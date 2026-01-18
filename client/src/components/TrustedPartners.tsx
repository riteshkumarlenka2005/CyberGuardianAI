
import React from "react";

const TrustedPartners: React.FC = () => {
  // Using a mix of SimpleIcons (for tech) and direct SVG/Clearbit (for high-reliability)
  // SimpleIcons: https://cdn.simpleicons.org/[brand_slug]/[optional_color]
  const partners = [
    { name: "Google", logo: "https://cdn.simpleicons.org/google/4285F4" },
    { name: "Microsoft", logo: "https://cdn.simpleicons.org/microsoft/5E5E5E" },
    { name: "Amazon", logo: "https://cdn.simpleicons.org/amazon/FF9900" },
    { name: "SBI", logo: "https://upload.wikimedia.org/wikipedia/commons/c/cc/State_Bank_of_India_logo.svg" },
    { name: "Government of India", logo: "https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg" },
    { name: "Meta", logo: "https://cdn.simpleicons.org/meta/0668E1" },
    { name: "Apple", logo: "https://cdn.simpleicons.org/apple/000000" },
    { name: "Airtel", logo: "https://upload.wikimedia.org/wikipedia/commons/c/cf/Airtel_logo_2010.svg" },
    { name: "Jio", logo: "https://upload.wikimedia.org/wikipedia/commons/5/50/Reliance_Jio_Logo_%28October_2015%29.svg" },
    { name: "PayPal", logo: "https://cdn.simpleicons.org/paypal/003087" },
    { name: "Visa", logo: "https://cdn.simpleicons.org/visa/1A1F71" },
    { name: "Mastercard", logo: "https://cdn.simpleicons.org/mastercard/EB001B" },
    { name: "GitHub", logo: "https://cdn.simpleicons.org/github/181717" },
    { name: "IBM", logo: "https://cdn.simpleicons.org/ibm/052D72" },
    { name: "Intel", logo: "https://cdn.simpleicons.org/intel/0071C5" },
    { name: "Cisco", logo: "https://cdn.simpleicons.org/cisco/1BA0D7" },
    { name: "Oracle", logo: "https://cdn.simpleicons.org/oracle/F80000" },
    { name: "Adobe", logo: "https://cdn.simpleicons.org/adobe/FF0000" },
  ];

  return (
    <section className="relative w-full py-16 bg-white dark:bg-slate-950 transition-colors duration-300 overflow-hidden border-t border-slate-100 dark:border-slate-800">
      <div className="max-w-[1400px] mx-auto px-6 relative">
        
        {/* HUD ACCENT LINE */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-48 h-1 bg-blue-600 rounded-full shadow-[0_0_15px_rgba(37,99,235,0.5)] z-20" />

        {/* MAIN DISPLAY PLATE */}
        <div 
          className="relative w-full h-36 bg-slate-900 dark:bg-slate-800 shadow-2xl overflow-hidden"
          style={{
            clipPath: "polygon(2% 0%, 98% 0%, 100% 100%, 0% 100%)"
          }}
        >
          {/* INNER CONTRAST PLATE */}
          <div 
            className="absolute inset-[2px] bg-white flex items-center"
            style={{
              clipPath: "polygon(2% 0%, 98% 0%, 100% 100%, 0% 100%)"
            }}
          >
            {/* GRID OVERLAY FOR TECH FEEL */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                 style={{
                   backgroundImage: `radial-gradient(#000 1px, transparent 1px)`,
                   backgroundSize: '20px 20px'
                 }}
            />

            {/* SCROLLING MARQUEE */}
            <div className="relative w-full flex items-center overflow-hidden">
              <div className="flex animate-trusted-scroll whitespace-nowrap items-center py-4">
                {/* Triple the partners to ensure seamless loop on large screens */}
                {[...partners, ...partners, ...partners].map((partner, idx) => (
                  <div
                    key={`${partner.name}-${idx}`}
                    className="flex-shrink-0 mx-10 sm:mx-16 flex items-center justify-center transition-transform duration-300 hover:scale-125 group"
                  >
                    <img 
                      src={partner.logo} 
                      alt={partner.name} 
                      title={partner.name}
                      className="h-12 sm:h-14 w-auto object-contain filter drop-shadow-sm transition-all"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* MECHANICAL SUB-BAR */}
        <div 
          className="relative w-full h-2 bg-slate-900 dark:bg-slate-800 -mt-1"
          style={{ clipPath: "polygon(2% 0%, 98% 0%, 100% 100%, 0% 100%)" }}
        />
      </div>

      <style>{`
        @keyframes trusted-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.33%); }
        }

        .animate-trusted-scroll {
          animation: trusted-scroll 50s linear infinite;
        }

        .animate-trusted-scroll:hover {
          animation-play-state: paused;
        }

        /* Edge Fading for smoother transition */
        .relative.w-full.flex.items-center.overflow-hidden::after {
          content: "";
          position: absolute;
          inset: 0;
          pointer-events: none;
          background: linear-gradient(90deg, white, transparent 15%, transparent 85%, white);
        }
      `}</style>
    </section>
  );
};

export default TrustedPartners;
