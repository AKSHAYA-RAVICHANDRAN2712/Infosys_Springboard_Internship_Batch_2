import { useEffect, useRef } from 'react';

/* MediSphere Analytics Charting Library (Canvas), ported from assets/js/charts.js */

export function LineChart({ labels, dataset, color = '#2563EB', height = 200 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width = canvas.parentElement.clientWidth;
    const h = canvas.height = canvas.parentElement.clientHeight || height;

    ctx.clearRect(0, 0, width, h);

    const padding = 30;
    const chartW = width - padding * 2;
    const chartH = h - padding * 2;
    const maxVal = Math.max(...dataset) * 1.15 || 10;

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = h - padding - (chartH / 4) * i;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
      ctx.stroke();
    }

    const points = dataset.map((val, idx) => ({
      x: padding + (chartW / (dataset.length - 1 || 1)) * idx,
      y: h - padding - (val / maxVal) * chartH
    }));

    const grad = ctx.createLinearGradient(0, padding, 0, h - padding);
    grad.addColorStop(0, color + '55');
    grad.addColorStop(1, color + '00');

    ctx.beginPath();
    ctx.moveTo(points[0].x, h - padding);
    points.forEach(p => ctx.lineTo(p.x, p.y));
    ctx.lineTo(points[points.length - 1].x, h - padding);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();

    ctx.beginPath();
    points.forEach((p, idx) => {
      if (idx === 0) ctx.moveTo(p.x, p.y);
      else ctx.lineTo(p.x, p.y);
    });
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.stroke();

    points.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#FFFFFF';
      ctx.fill();
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.stroke();
    });
  }, [labels, dataset, color, height]);

  return <canvas ref={canvasRef} />;
}

export function BarChart({ labels, dataset, color = '#3B82F6', height = 200 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width = canvas.parentElement.clientWidth;
    const h = canvas.height = canvas.parentElement.clientHeight || height;

    ctx.clearRect(0, 0, width, h);

    const padding = 35;
    const chartW = width - padding * 2;
    const chartH = h - padding * 2;
    const maxVal = Math.max(...dataset) * 1.15 || 10;
    const barWidth = (chartW / dataset.length) * 0.55;

    dataset.forEach((val, idx) => {
      const x = padding + (chartW / dataset.length) * idx + (chartW / dataset.length - barWidth) / 2;
      const barH = (val / maxVal) * chartH;
      const y = h - padding - barH;

      const grad = ctx.createLinearGradient(0, y, 0, h - padding);
      grad.addColorStop(0, color);
      grad.addColorStop(1, color + '44');

      ctx.fillStyle = grad;
      ctx.beginPath();
      if (ctx.roundRect) {
        ctx.roundRect(x, y, barWidth, barH, [6, 6, 0, 0]);
      } else {
        ctx.rect(x, y, barWidth, barH);
      }
      ctx.fill();

      ctx.fillStyle = '#9CA3AF';
      ctx.font = '10px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(labels[idx], x + barWidth / 2, h - 10);
    });
  }, [labels, dataset, color, height]);

  return <canvas ref={canvasRef} />;
}
