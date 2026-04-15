import React, { useEffect, useRef, useState } from 'react';
import Card from './ui/Card';
import { Camera } from 'lucide-react';

const AR_SeatFinder = ({ isARActive, onToggleAR }) => {
  const canvasRef = useRef(null);
  const videoRef = useRef(null);
  const animationRef = useRef(null);
  const startTimeRef = useRef(null);

  const resizeCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas && canvas.parentElement) {
      canvas.width = canvas.parentElement.clientWidth;
      canvas.height = canvas.parentElement.clientHeight;
    }
  };

  useEffect(() => {
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const drawFrame = (timestamp) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const elapsed = timestamp - startTimeRef.current;
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      const pulse = (Math.sin(elapsed * Math.PI / 500) + 1) / 2;

      // Corner brackets
      ctx.save();
      ctx.strokeStyle = '#8b5cf6';
      ctx.lineWidth = 4;
      const armLength = 32;
      const padding = 24;
      ctx.beginPath();
      ctx.moveTo(padding, padding + armLength);
      ctx.lineTo(padding, padding);
      ctx.lineTo(padding + armLength, padding);
      ctx.moveTo(w - padding - armLength, padding);
      ctx.lineTo(w - padding, padding);
      ctx.lineTo(w - padding, padding + armLength);
      ctx.moveTo(padding, h - padding - armLength);
      ctx.lineTo(padding, h - padding);
      ctx.lineTo(padding + armLength, h - padding);
      ctx.moveTo(w - padding - armLength, h - padding);
      ctx.lineTo(w - padding, h - padding);
      ctx.lineTo(w - padding, h - padding - armLength);
      ctx.stroke();
      ctx.restore();

      // Direction arrows
      ctx.save();
      ctx.fillStyle = `rgba(16, 185, 129, ${0.35 + pulse * 0.5})`;
      ctx.translate(w / 2, h / 2 + 22);
      for (let i = 0; i < 3; i += 1) {
        const yOffset = -i * 30 + pulse * 18;
        ctx.beginPath();
        ctx.moveTo(-24, yOffset + 12);
        ctx.lineTo(0, yOffset - 10);
        ctx.lineTo(24, yOffset + 12);
        ctx.lineTo(24, yOffset + 18);
        ctx.lineTo(0, yOffset - 2);
        ctx.lineTo(-24, yOffset + 18);
        ctx.fill();
      }
      ctx.restore();

      // Direction label
      ctx.save();
      ctx.translate(w / 2, h / 2 - 86);
      ctx.fillStyle = 'rgba(99, 102, 241, 0.18)';
      ctx.strokeStyle = '#8b5cf6';
      ctx.lineWidth = 2;
      ctx.shadowColor = '#8b5cf6';
      ctx.shadowBlur = 14;
      ctx.beginPath();
      ctx.roundRect(-112, -24, 224, 48, 16);
      ctx.fill();
      ctx.stroke();
      ctx.shadowBlur = 0;
      ctx.fillStyle = '#ffffff';
      ctx.font = '700 14px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('→ CONCOURSE B — 40m', 0, 0);
      ctx.restore();

      // Seat glow spot
      ctx.save();
      const seatX = w - 90;
      const seatY = 88;
      ctx.beginPath();
      ctx.arc(seatX, seatY, 32 + pulse * 10, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(139, 92, 246, ${0.18 + (0.12 * (1 - pulse))})`;
      ctx.fill();
      ctx.beginPath();
      ctx.arc(seatX, seatY, 16, 0, Math.PI * 2);
      ctx.fillStyle = '#8b5cf6';
      ctx.shadowColor = '#8b5cf6';
      ctx.shadowBlur = 24;
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.fillStyle = '#ffffff';
      ctx.font = '600 12px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('YOUR SEAT:', seatX, seatY + 54);
      ctx.fillText('142-F', seatX, seatY + 72);
      ctx.restore();

      if (isARActive) {
        animationRef.current = requestAnimationFrame(drawFrame);
      }
    };

    if (isARActive) {
      startTimeRef.current = null;
      resizeCanvas();
      animationRef.current = requestAnimationFrame(drawFrame);
    } else {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isARActive]);

  const toggleAr = () => {
    setArActive((current) => !current);
  };

  return (
    <Card className="h-full min-h-[500px] relative overflow-hidden bg-obsidian/90 p-0">
      <video
        ref={videoRef}
        title="AR background"
        src="/stadium-video.mp4"
        autoPlay
        muted
        loop
        playsInline
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${isARActive ? 'opacity-100' : 'opacity-0'}`}
        style={{ position: 'absolute', zIndex: 0 }}
      />
      <canvas
        ref={canvasRef}
        id="ar-canvas"
        className="absolute inset-0 w-full h-full"
        style={{ position: 'absolute', top: 0, left: 0, zIndex: 1, pointerEvents: 'none', background: 'transparent' }}
      />
      <div className="relative z-20 p-6 h-full flex flex-col justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-black/50 px-3 py-2 text-xs uppercase tracking-[0.3em] text-violet font-semibold mb-4">
            <Camera size={18} /> AR VIEW
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-white mb-2">Stadium AR Overlay</h2>
          <p className="max-w-xl text-sm text-gray-300 leading-6">
            Activate the live AR background and overlay directional guidance, seat highlights, and corner brackets directly on top of the stadium footage.
          </p>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-4 text-sm text-slate-200 shadow-xl shadow-violet/10">
            <div className="font-semibold text-violet">AR STATUS</div>
            <div>{isARActive ? 'ACTIVE' : 'INACTIVE'}</div>
          </div>
          <button
            type="button"
            onClick={onToggleAR}
            className={`inline-flex items-center justify-center rounded-full px-8 py-4 text-base font-bold text-white transition ${isARActive ? 'bg-violet/90 hover:bg-violet' : 'bg-transparent border border-violet/60 hover:bg-violet/10'}`}
          >
            {isARActive ? 'DEACTIVATE AR' : 'ACTIVATE AR'}
          </button>
        </div>
      </div>
    </Card>
  );
};

export default AR_SeatFinder;
