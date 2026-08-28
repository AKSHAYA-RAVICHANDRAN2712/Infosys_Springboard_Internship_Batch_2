# MediSphere Production-Readiness TODO

## Backend
- [x] Fix CORS 403 (allowedOriginPatterns + allowCredentials)
- [x] Fix application.yml YAML indentation + env-driven config
- [x] Verify endpoint mapping (dashboard summary + appointments CRUD present)
- [x] Create AppointmentService (reuse Appointment entity + AppointmentRepository)
- [x] Create AppointmentController (full CRUD + status PATCH)
- [x] Create DashboardService (reuse all repositories)
- [x] Create DashboardController (/api/dashboard/summary?role=)
- [x] Fix DashboardService compile error (Long.compare instead of primitive .compareTo)
- [x] Harden SecurityConfig with role-based authorization (@EnableMethodSecurity)
- [x] Add actuator dependency + health endpoint
- [x] Add Dockerfile (multi-stage)
- [x] Add Procfile
- [x] Add render.yaml
- [x] Add railway.toml
- [x] Build backend successfully (mvn clean package)
- [x] Create backend .env file
- [x] Create medisphere database in PostgreSQL
- [x] Add spring-kafka + docker-compose.yml (local Kafka, KRaft mode)
- [x] VitalsStreamProducer — simulated per-patient reading publisher (Kafka producer)
- [x] VitalsStreamConsumer — @KafkaListener, persists + forwards to WebSocket
- [x] VitalsSessionRegistry — tracks active WS sessions per patient
- [x] Refactor VitalsWebSocketHandler to register/unregister only (no more in-process simulation)
- [x] Confirm consent management (Consent entity/service/controller + audit log) is complete end-to-end

## Frontend
- [x] Rewrite axiosClient.js (env-driven base URL, no localhost)
- [x] Rewrite vitalsService.js (env-driven WS URL, no localhost)
- [x] Update AuthContext to validate session via /api/auth/me
- [x] Create .env.production
- [x] Add vercel.json
- [x] Add netlify.toml
- [x] Build frontend successfully (npm run build)
- [x] Copy fresh build into backend/src/main/resources/static

## Verify / Run
- [x] Test login for roles (admin + doctor verified)
- [x] Backend running on :8080 (serves built frontend single-origin)
- [x] Frontend dev server running on :5173 (proxies /api to :8080)
- [x] Test CORS / proxy path
- [x] Final report (endpoint mapping, modified files, root causes, deploy steps)
