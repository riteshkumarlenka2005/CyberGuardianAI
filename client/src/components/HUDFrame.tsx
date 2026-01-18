
import React from 'react';

interface HUDFrameProps {
  children: React.ReactNode;
  className?: string;
}

const HUDFrame: React.FC<HUDFrameProps> = ({ children, className = "" }) => {
  return (
    <div className={`relative ${className}`}>
      {/* HUD Frame Background and Decorations */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <svg 
          width="100%" 
          height="100%" 
          viewBox="0 0 800 400" 
          preserveAspectRatio="none" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-sm"
        >
          {/* Main Container Fill and Border */}
          <path 
            d="M 40 20 L 710 20 L 760 70 L 760 330 L 710 380 L 90 380 L 40 330 Z" 
            fill="#f9fafb" 
            stroke="#000" 
            strokeWidth="1"
          />
          
          {/* Grid Background Pattern (Conceptual inside the frame) */}
          <defs>
            <pattern id="grid-pattern" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e5e7eb" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <path d="M 40 20 L 710 20 L 760 70 L 760 330 L 710 380 L 90 380 L 40 330 Z" fill="url(#grid-pattern)" />

          {/* Top Left Corner Accents */}
          <path d="M 40 40 L 40 20 L 140 20" stroke="#000" strokeWidth="1" />
          <path d="M 150 20 L 170 20" stroke="#000" strokeWidth="1" />
          <path d="M 120 30 L 130 30" stroke="#000" strokeWidth="4" strokeOpacity="0.1" />

          {/* Top Right Corner Accents */}
          <path d="M 730 20 L 760 20 L 760 50" stroke="#000" strokeWidth="1" />
          <path d="M 725 20 L 760 55" fill="#000" />
          <path d="M 680 30 L 710 30" stroke="#000" strokeWidth="1" />

          {/* Bottom Left Corner Accents (Specific based on image) */}
          <path d="M 40 310 L 40 340 L 70 370" stroke="#000" strokeWidth="1" />
          {/* Solid black triangle */}
          <path d="M 40 335 L 40 370 L 75 370 Z" fill="#000" />
          {/* Detached trapezium-like shape */}
          <path d="M 40 380 L 160 380 L 140 395 L 40 395 Z" fill="#000" />
          <rect x="90" y="385" width="40" height="5" fill="#fff" />

          {/* Bottom Right Corner Accents */}
          <path d="M 760 290 L 760 330 L 730 360" stroke="#000" strokeWidth="1" />
          <path d="M 570 380 L 760 380 L 760 365 L 590 365 Z" fill="#000" />
          {/* Mechanical Cutout Shape in Bottom Right Bar */}
          <path d="M 700 365 L 750 365 L 750 380 L 710 380 Z" fill="#fff" />
          
          {/* Decorative Stepped Connectors */}
          <path d="M 200 380 L 220 380 L 230 390 L 450 390" stroke="#000" strokeWidth="0.5" />
          
          {/* Bottom Left stripe texture (conceptual) */}
          <path d="M 110 50 L 125 35 M 130 50 L 145 35 M 150 50 L 165 35" stroke="#000" strokeWidth="4" strokeOpacity="0.05" />
          <path d="M 680 350 L 695 335 M 700 350 L 715 335 M 720 350 L 735 335" stroke="#000" strokeWidth="4" strokeOpacity="0.05" />
        </svg>
      </div>

      {/* Content Area */}
      <div className="relative z-10 p-12 md:p-16">
        {children}
      </div>
    </div>
  );
};

export default HUDFrame;
