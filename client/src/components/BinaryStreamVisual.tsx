
import React, { useEffect, useRef } from 'react';

const BinaryStreamVisual: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;

    interface Stream {
      x: number;
      y: number;
      speed: number;
      chars: string[];
      opacity: number;
      fontSize: number;
    }

    const streams: Stream[] = [];
    const numStreams = 45;

    const init = () => {
      const container = canvas.parentElement;
      width = canvas.width = container?.offsetWidth || 600;
      height = canvas.height = container?.offsetHeight || 600;

      streams.length = 0;
      for (let i = 0; i < numStreams; i++) {
        // Concentrate streams toward the center to match the pedestal width
        const radius = Math.random() * (width * 0.25);
        const angle = Math.random() * Math.PI * 2;
        const x = width / 2 + radius * Math.cos(angle);
        
        streams.push({
          x: x,
          y: height - 120 - Math.random() * height,
          speed: 1 + Math.random() * 2,
          chars: Array.from({ length: 10 }, () => (Math.random() > 0.5 ? '1' : '0')),
          opacity: 0.1 + Math.random() * 0.5,
          fontSize: 10 + Math.random() * 8,
        });
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      const centerX = width / 2;
      const centerY = height - 120; // Bottom platform center

      // 1. Draw Platform (Pedestal)
      const isDark = document.documentElement.classList.contains('dark');
      const accentColor = '#3b82f6'; // blue-500
      const glowColor = 'rgba(59, 130, 246, 0.4)';

      // Outer Ring
      ctx.beginPath();
      ctx.ellipse(centerX, centerY, width * 0.3, width * 0.08, 0, 0, Math.PI * 2);
      ctx.strokeStyle = accentColor;
      ctx.lineWidth = 2;
      ctx.stroke();

      // Platform Glow
      const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, width * 0.3);
      gradient.addColorStop(0, glowColor);
      gradient.addColorStop(1, 'transparent');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.ellipse(centerX, centerY, width * 0.3, width * 0.08, 0, 0, Math.PI * 2);
      ctx.fill();

      // Inner Detailing
      ctx.beginPath();
      ctx.ellipse(centerX, centerY, width * 0.2, width * 0.05, 0, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.stroke();

      // 2. Draw Binary Streams
      ctx.textAlign = 'center';
      streams.forEach((stream) => {
        ctx.font = `bold ${stream.fontSize}px font-mono`;
        ctx.fillStyle = `rgba(59, 130, 246, ${stream.opacity})`;
        
        // Draw characters in a vertical column
        stream.chars.forEach((char, idx) => {
          const charY = stream.y - idx * stream.fontSize;
          if (charY > 50 && charY < centerY) {
             // Add vertical "ray" glow effect
             if (idx === 0) {
               ctx.shadowBlur = 10;
               ctx.shadowColor = accentColor;
             }
             ctx.fillText(char, stream.x, charY);
             ctx.shadowBlur = 0;
          }
        });

        // Move upward
        stream.y -= stream.speed;

        // Reset if off top
        if (stream.y < -100) {
          stream.y = centerY;
          const radius = Math.random() * (width * 0.25);
          const angle = Math.random() * Math.PI * 2;
          stream.x = width / 2 + radius * Math.cos(angle);
        }
      });

      // 3. Vertical Ray Lines (Atmospheric)
      ctx.lineWidth = 1;
      for (let i = 0; i < 8; i++) {
        const xOffset = (i - 3.5) * (width * 0.08);
        const alpha = 0.05 + Math.random() * 0.05;
        ctx.strokeStyle = `rgba(59, 130, 246, ${alpha})`;
        ctx.beginPath();
        ctx.moveTo(centerX + xOffset, centerY);
        ctx.lineTo(centerX + xOffset, 50);
        ctx.stroke();
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    window.addEventListener('resize', init);
    init();
    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', init);
    };
  }, []);

  return (
    <div className="w-full h-[500px] flex items-center justify-center relative bg-slate-950 rounded-[3rem] overflow-hidden">
      <canvas 
        ref={canvasRef} 
        className="w-full h-full"
      />
      {/* HUD Info Overlays */}
      <div className="absolute top-8 left-8 border-l border-blue-500/30 pl-4 py-2">
        <div className="text-[10px] font-mono text-blue-400 uppercase tracking-[0.2em] mb-1">Live Processing</div>
        <div className="text-xs font-mono text-white/50 tracking-tighter">NODE_CG_0x449</div>
      </div>
      <div className="absolute bottom-8 right-8 text-right">
        <div className="text-[10px] font-mono text-blue-400 uppercase tracking-[0.2em] mb-1">Signal Intensity</div>
        <div className="flex gap-1 justify-end">
           {[1,2,3,4,5].map(i => <div key={i} className="w-1 h-3 bg-blue-500/40 rounded-full animate-pulse" style={{animationDelay: `${i*150}ms`}} />)}
        </div>
      </div>
    </div>
  );
};

export default BinaryStreamVisual;
