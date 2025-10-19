// src/components/Planet.tsx
const Planet = () => (
    <div className="absolute left-8 bottom-8 animate-spin-slow z-10" style={{animationDuration: "18s"}}>
      <svg width="140" height="140" viewBox="0 0 140 140">
        <defs>
          <radialGradient id="bg" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#b5e0ff" />
            <stop offset="70%" stopColor="#3076b6" />
            <stop offset="100%" stopColor="#040718" />
          </radialGradient>
        </defs>
        <circle cx="70" cy="70" r="60" fill="url(#bg)" />
        <ellipse cx="70" cy="90" rx="50" ry="12" fill="#88f" opacity="0.15"/>
      </svg>
    </div>
  );
  
  export default Planet;
  