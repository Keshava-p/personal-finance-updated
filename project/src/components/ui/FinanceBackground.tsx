import React from 'react';

export function FinanceBackground({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Animated Currency Symbols Background */}
      <div className="fixed inset-0 -z-10">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a0f1f] via-[#101b30] to-[#060b18]" />
        
        {/* Floating Currency Symbols */}
        <div className="absolute inset-0 overflow-hidden">
          {['$', '€', '₹', '¥', '£', '+'].map((symbol, idx) => (
            <div
              key={idx}
              className="absolute text-white/5 text-9xl font-bold select-none pointer-events-none"
              style={{
                left: `${(idx * 15) % 100}%`,
                top: `${(idx * 20) % 100}%`,
                animation: `float${idx % 3} ${15 + idx * 2}s ease-in-out infinite`,
                animationDelay: `${idx * 2}s`,
              }}
            >
              {symbol}
            </div>
          ))}
        </div>

        {/* Subtle Pattern Overlay */}
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='coins' x='0' y='0' width='100' height='100' patternUnits='userSpaceOnUse'%3E%3Ccircle cx='50' cy='50' r='20' fill='none' stroke='white' stroke-width='1'/%3E%3Ccircle cx='50' cy='50' r='10' fill='none' stroke='white' stroke-width='1'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100' height='100' fill='url(%23coins)'/%3E%3C/svg%3E")`,
            backgroundSize: '200px 200px',
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>

      <style>{`
        @keyframes float0 {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          33% { transform: translate(30px, -30px) rotate(5deg); }
          66% { transform: translate(-20px, 20px) rotate(-5deg); }
        }
        @keyframes float1 {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          50% { transform: translate(-40px, 40px) rotate(10deg); }
        }
        @keyframes float2 {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          25% { transform: translate(50px, -20px) rotate(-8deg); }
          75% { transform: translate(-30px, 50px) rotate(8deg); }
        }
      `}</style>
    </div>
  );
}

