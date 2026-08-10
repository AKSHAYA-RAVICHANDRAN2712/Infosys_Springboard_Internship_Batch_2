package com.medisphere.backend.websocket;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.medisphere.backend.service.VitalsService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Instant;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.ScheduledFuture;
import java.util.concurrent.TimeUnit;

/**
 * Live vitals feed over WebSocket, one connection per patient.
 *
 * Today this simulates readings with a bounded random walk, exactly
 * like the frontend's local mock in src/api/vitalsService.js did.
 * Once bedside monitors / wearables publish to Kafka, replace the
 * scheduled random walk below with a Kafka consumer that forwards
 * "vitals.raw" messages for this patientId to the session instead —
 * no frontend changes are needed, since the WS contract stays the same.
 *
 * Every reading sent over the socket is also persisted to the
 * `vitals` table via VitalsService, so history survives past the
 * WebSocket connection and can be read back through
 * GET /api/patients/{id}/vitals.
 */
@Component
@RequiredArgsConstructor
public class VitalsWebSocketHandler extends TextWebSocketHandler {

    private final VitalsService vitalsService;

    private final ObjectMapper objectMapper = new ObjectMapper();
    private final ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(4);
    private final Map<String, ScheduledFuture<?>> activeFeeds = new ConcurrentHashMap<>();
    private final Map<String, double[]> lastReadingBySession = new ConcurrentHashMap<>();

    // heartRate, spo2, systolic, diastolic, temp
    private static final double[] BASELINE = {78, 98, 122, 80, 98.4};

    @Override
    public void afterConnectionEstablished(WebSocketSession session) {
        String patientId = extractPatientId(session);
        lastReadingBySession.put(session.getId(), BASELINE.clone());

        // Send one reading immediately so the UI isn't empty while waiting for the first tick.
        sendReading(session, patientId);

        ScheduledFuture<?> future = scheduler.scheduleAtFixedRate(
                () -> sendReading(session, patientId), 2, 2, TimeUnit.SECONDS
        );
        activeFeeds.put(session.getId(), future);
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) {
        ScheduledFuture<?> future = activeFeeds.remove(session.getId());
        if (future != null) future.cancel(true);
        lastReadingBySession.remove(session.getId());
    }

    private void sendReading(WebSocketSession session, String patientId) {
        try {
            if (!session.isOpen()) return;

            double[] last = lastReadingBySession.get(session.getId());
            double[] next = {
                    jitter(last[0], 6),   // heartRate
                    Math.min(100, jitter(last[1], 1.2)), // spo2
                    jitter(last[2], 5),   // systolic
                    jitter(last[3], 4),   // diastolic
                    jitter(last[4], 0.3), // temp
            };
            lastReadingBySession.put(session.getId(), next);

            long heartRate = Math.round(next[0]);
            long spo2 = Math.round(next[1]);
            long systolic = Math.round(next[2]);
            long diastolic = Math.round(next[3]);
            double temp = Math.round(next[4] * 10.0) / 10.0;

            Map<String, Object> payload = Map.of(
                    "patientId", patientId,
                    "heartRate", heartRate,
                    "spo2", spo2,
                    "systolic", systolic,
                    "diastolic", diastolic,
                    "temp", temp,
                    "ts", Instant.now().toString()
            );

            session.sendMessage(new TextMessage(objectMapper.writeValueAsString(payload)));
            persistReading(patientId, (int) heartRate, (int) spo2, (int) systolic, (int) diastolic, temp);
        } catch (Exception ignored) {
            // Session likely closed mid-send; the scheduled task will be cancelled on afterConnectionClosed.
        }
    }

    /** patientId arrives as a path segment (String); skip persistence if it isn't a real patient id. */
    private void persistReading(String patientId, int heartRate, int spo2, int systolic, int diastolic, double temp) {
        try {
            Long id = Long.parseLong(patientId);
            BigDecimal temperature = BigDecimal.valueOf(temp).setScale(1, RoundingMode.HALF_UP);
            vitalsService.recordReading(id, heartRate, spo2, systolic, diastolic, temperature);
        } catch (NumberFormatException | IllegalArgumentException ignored) {
            // Not a numeric patient id (e.g. a demo/test session) — nothing to persist.
        }
    }

    private double jitter(double value, double range) {
        return value + (Math.random() - 0.5) * range;
    }

    private String extractPatientId(WebSocketSession session) {
        Map<String, Object> attrs = session.getAttributes();
        // Path variable extraction: Spring puts template vars here when using addHandler(..., "/ws/vitals/{patientId}")
        Object fromTemplate = attrs.get("patientId");
        if (fromTemplate != null) return fromTemplate.toString();

        String path = session.getUri() != null ? session.getUri().getPath() : "";
        String[] parts = path.split("/");
        return parts.length > 0 ? parts[parts.length - 1] : "unknown";
    }
}

