
import React, { useEffect, useRef } from 'react';

const CyberNetworkVisual: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;
    let rotationX = 0;
    let rotationY = 0;

    interface Point3D {
      x: number;
      y: number;
      z: number;
    }

    interface Node {
      phi: number; // latitude
      theta: number; // longitude
      radius: number;
      baseOpacity: number;
      pulse: number;
    }

    const nodes: Node[] = [];
    const numNodes = 60;
    const globeRadius = 180;

    // Generate rings (latitudes and longitudes)
    const latitudes = 8;
    const longitudes = 8;

    const init = () => {
      const container = canvas.parentElement;
      width = canvas.width = container?.offsetWidth || 500;
      height = canvas.height = container?.offsetHeight || 500;

      nodes.length = 0;
      for (let i = 0; i < numNodes; i++) {
        nodes.push({
          phi: Math.acos(2 * Math.random() - 1) - Math.PI / 2, // -PI/2 to PI/2
          theta: Math.random() * Math.PI * 2,
          radius: 1 + Math.random() * 2,
          baseOpacity: 0.2 + Math.random() * 0.8,
          pulse: Math.random() * Math.PI * 2
        });
      }
    };

    const project = (phi: number, theta: number): Point3D => {
      // Convert spherical to Cartesian
      const r = globeRadius;
      let x = r * Math.cos(phi) * Math.cos(theta);
      let y = r * Math.sin(phi);
      let z = r * Math.cos(phi) * Math.sin(theta);

      // Rotate Y
      const cosY = Math.cos(rotationY);
      const sinY = Math.sin(rotationY);
      const x1 = x * cosY - z * sinY;
      const z1 = x * sinY + z * cosY;

      // Rotate X
      const cosX = Math.cos(rotationX);
      const sinX = Math.sin(rotationX);
      const y2 = y * cosX - z1 * sinX;
      const z2 = y * sinX + z1 * cosX;

      return { x: x1, y: y2, z: z2 };
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      const centerX = width / 2;
      const centerY = height / 2;
      const isDark = document.documentElement.classList.contains('dark');
      
      const strokeColor = isDark ? 'rgba(248, 250, 252, 0.15)' : 'rgba(15, 23, 42, 0.15)';
      const boldStrokeColor = isDark ? 'rgba(248, 250, 252, 0.3)' : 'rgba(15, 23, 42, 0.3)';
      const nodeColor = isDark ? '#f8fafc' : '#0f172a';

      rotationY += 0.002;
      rotationX += 0.0005;

      // Draw Latitudinal Rings
      for (let i = 1; i < latitudes; i++) {
        const phi = (i / latitudes) * Math.PI - Math.PI / 2;
        ctx.beginPath();
        for (let j = 0; j <= 60; j++) {
          const theta = (j / 60) * Math.PI * 2;
          const p = project(phi, theta);
          if (j === 0) ctx.moveTo(centerX + p.x, centerY + p.y);
          else ctx.lineTo(centerX + p.x, centerY + p.y);
        }
        ctx.strokeStyle = i % 3 === 0 ? boldStrokeColor : strokeColor;
        ctx.lineWidth = i % 3 === 0 ? 1 : 0.5;
        ctx.stroke();
      }

      // Draw Longitudinal Rings
      for (let i = 0; i < longitudes; i++) {
        const theta = (i / longitudes) * Math.PI * 2;
        ctx.beginPath();
        for (let j = 0; j <= 60; j++) {
          const phi = (j / 60) * Math.PI - Math.PI / 2;
          const p = project(phi, theta);
          if (j === 0) ctx.moveTo(centerX + p.x, centerY + p.y);
          else ctx.lineTo(centerX + p.x, centerY + p.y);
        }
        ctx.strokeStyle = i % 2 === 0 ? boldStrokeColor : strokeColor;
        ctx.lineWidth = i % 2 === 0 ? 0.8 : 0.5;
        ctx.stroke();
      }

      // Draw Nodes
      nodes.forEach(node => {
        const p = project(node.phi, node.theta);
        // Depth-based scaling and opacity (simple z-index simulation)
        const scale = (p.z + globeRadius) / (globeRadius * 2);
        if (p.z < -globeRadius * 0.5) return; // Simple occlusion for back nodes

        node.pulse += 0.02;
        const currentOpacity = node.baseOpacity * (0.6 + Math.sin(node.pulse) * 0.4) * scale;

        ctx.beginPath();
        ctx.arc(centerX + p.x, centerY + p.y, node.radius * (0.5 + scale), 0, Math.PI * 2);
        ctx.fillStyle = nodeColor;
        ctx.globalAlpha = currentOpacity;
        ctx.fill();
        ctx.globalAlpha = 1;
      });

      // Draw connecting arcs between random nodes to simulate "flow"
      ctx.beginPath();
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = 0.5;
      for (let i = 0; i < nodes.length; i += 5) {
        const p1 = project(nodes[i].phi, nodes[i].theta);
        const nextIdx = (i + 1) % nodes.length;
        const p2 = project(nodes[nextIdx].phi, nodes[nextIdx].theta);
        
        if (p1.z > 0 && p2.z > 0) {
          ctx.moveTo(centerX + p1.x, centerY + p1.y);
          ctx.quadraticCurveTo(centerX, centerY, centerX + p2.x, centerY + p2.y);
        }
      }
      ctx.stroke();

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
    <div className="w-full h-[450px] md:h-[550px] flex items-center justify-center relative overflow-hidden transition-colors duration-300">
      <canvas 
        ref={canvasRef} 
        className="w-full h-full cursor-default"
      />
      {/* Schematic overlay elements */}
      <div className="absolute inset-0 pointer-events-none border border-slate-900/5 dark:border-white/5 m-8 flex items-end p-4">
        <div className="font-mono text-[10px] text-slate-400 dark:text-slate-600 space-y-1">
          <p>GLOBAL THREAT VECTOR: SYNCING...</p>
          <p>SCANNING PATTERNS: [093.12.001]</p>
        </div>
      </div>
    </div>
  );
};

export default CyberNetworkVisual;
