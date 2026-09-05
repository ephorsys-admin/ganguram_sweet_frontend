import React from "react";

// Maharaja Crown (Rajmukut)
export const MaharajaCrown = ({ className = "h-8 w-8", ...props }) => (
  <svg
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...props}
  >
    {/* Shadow behind the crown */}
    <path
      d="M15 78 Q50 83 85 78 L82 70 Q50 75 18 70 Z"
      fill="black"
      opacity="0.15"
    />
    {/* Base of the Crown */}
    <path
      d="M18 74 Q50 79 82 74 L80 67 Q50 71 20 67 Z"
      fill="url(#crownGoldGrad)"
      stroke="#B7950B"
      strokeWidth="0.75"
    />
    {/* Red Velvet cushion border */}
    <path
      d="M23 71 Q50 74 77 71 L76 68 Q50 71 24 68 Z"
      fill="url(#velvetGrad)"
    />
    {/* Main crown peaks structure */}
    <path
      d="M20 67 L26 43 L38 56 L50 26 L62 56 L74 43 L80 67 Q50 71 20 67 Z"
      fill="url(#crownGoldGrad)"
      stroke="#9A7D0A"
      strokeWidth="0.75"
    />
    {/* Velvet cap interior */}
    <path
      d="M24 67 C24 55, 32 45, 50 45 C68 45, 76 55, 76 67 Z"
      fill="url(#velvetGrad)"
      opacity="0.85"
      style={{ mixBlendMode: "multiply" }}
    />
    {/* Center Gem (Ruby) */}
    <path
      d="M50 48 L56 55 L50 62 L44 55 Z"
      fill="url(#rubyGrad)"
      stroke="#78281F"
      strokeWidth="0.5"
    />
    <circle cx="50" cy="55" r="1.5" fill="#FFFFFF" opacity="0.8" />
    {/* Pearls on peaks */}
    <circle cx="26" cy="41" r="3" fill="url(#pearlGrad)" stroke="#BDC3C7" strokeWidth="0.5" />
    <circle cx="50" cy="24" r="4.5" fill="url(#pearlGrad)" stroke="#BDC3C7" strokeWidth="0.5" />
    <circle cx="74" cy="41" r="3" fill="url(#pearlGrad)" stroke="#BDC3C7" strokeWidth="0.5" />
    {/* Additional small gems */}
    <circle cx="34" cy="58" r="2" fill="#00A896" />
    <circle cx="66" cy="58" r="2" fill="#00A896" />
    <circle cx="50" cy="68" r="1.5" fill="#FFFFFF" />
    <defs>
      <linearGradient id="crownGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFE57F" />
        <stop offset="35%" stopColor="#FFC107" />
        <stop offset="70%" stopColor="#FF9800" />
        <stop offset="100%" stopColor="#B7950B" />
      </linearGradient>
      <linearGradient id="velvetGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#D2143A" />
        <stop offset="100%" stopColor="#7D051B" />
      </linearGradient>
      <radialGradient id="rubyGrad" cx="35%" cy="35%" r="65%">
        <stop offset="0%" stopColor="#FF6B6B" />
        <stop offset="70%" stopColor="#C0392B" />
        <stop offset="100%" stopColor="#641E16" />
      </radialGradient>
      <radialGradient id="pearlGrad" cx="30%" cy="30%" r="70%">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="60%" stopColor="#E5E8E8" />
        <stop offset="100%" stopColor="#BDC3C7" />
      </radialGradient>
    </defs>
  </svg>
);

// Motichoor Laddu Icon
export const LadduIcon = ({ className = "h-8 w-8", ...props }) => (
  <svg
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...props}
  >
    {/* Shadow */}
    <circle cx="52" cy="54" r="38" fill="black" opacity="0.1" />
    {/* Laddu body */}
    <circle cx="50" cy="50" r="38" fill="url(#ladduGrad)" />
    {/* Laddu texture / Bundi dots */}
    <circle cx="36" cy="38" r="3" fill="#FFE066" opacity="0.9" />
    <circle cx="44" cy="34" r="2.5" fill="#E28743" opacity="0.8" />
    <circle cx="32" cy="46" r="3.5" fill="#D35400" />
    <circle cx="42" cy="48" r="3" fill="#E67E22" />
    <circle cx="50" cy="40" r="4" fill="#F39C12" />
    <circle cx="58" cy="34" r="3" fill="#FFE066" opacity="0.9" />
    <circle cx="64" cy="42" r="3.5" fill="#D35400" />
    <circle cx="54" cy="48" r="2.5" fill="#E28743" opacity="0.8" />
    
    <circle cx="34" cy="58" r="3" fill="#FFE066" opacity="0.9" />
    <circle cx="42" cy="62" r="3.5" fill="#D35400" />
    <circle cx="50" cy="60" r="4" fill="#E67E22" />
    <circle cx="58" cy="58" r="3" fill="#F39C12" />
    <circle cx="66" cy="54" r="2.5" fill="#E28743" opacity="0.8" />
    <circle cx="60" cy="66" r="3" fill="#FFE066" opacity="0.9" />
    
    <circle cx="48" cy="70" r="3.5" fill="#D35400" />
    <circle cx="38" cy="70" r="2" fill="#E28743" />
    
    {/* Garnishing (Pistachio & Almond bits) */}
    <path d="M46 26 L52 28 L48 30 Z" fill="#2ECC71" /> {/* Pistachio sliver */}
    <path d="M52 24 L56 20 L58 24 Z" fill="#F9E79F" /> {/* Almond sliver */}
    <circle cx="48" cy="22" r="1.5" fill="#27AE60" />
    <circle cx="54" cy="27" r="1" fill="#27AE60" />
    <defs>
      <radialGradient id="ladduGrad" cx="35%" cy="35%" r="65%">
        <stop offset="0%" stopColor="#FFC300" />
        <stop offset="45%" stopColor="#FF9F1C" />
        <stop offset="85%" stopColor="#E65F00" />
        <stop offset="100%" stopColor="#9E2A2B" />
      </radialGradient>
    </defs>
  </svg>
);

// Kaju Katli (Cashew Fudge with Silver Foil / Vark)
export const KajuKatliIcon = ({ className = "h-8 w-8", ...props }) => (
  <svg
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...props}
  >
    {/* Shadow */}
    <path d="M52 19 L87 52 L52 87 L17 52 Z" fill="black" opacity="0.08" />
    {/* Katli base */}
    <path
      d="M50 15 L85 50 L50 85 L15 50 Z"
      fill="url(#katliBaseGrad)"
      stroke="#D7CCC8"
      strokeWidth="0.75"
    />
    {/* Silver Vark Foil overlay */}
    <path
      d="M32 38 L65 42 L60 62 L40 58 Z"
      fill="url(#silverFoilGrad)"
      opacity="0.88"
    />
    <path
      d="M48 20 L52 20 L68 45 L50 40 Z"
      fill="url(#silverFoilGrad)"
      opacity="0.8"
    />
    <path
      d="M30 52 L48 68 L36 76 L24 64 Z"
      fill="url(#silverFoilGrad)"
      opacity="0.85"
    />
    {/* Reflection Highlights */}
    <path
      d="M50 15 L85 50 L50 52 Z"
      fill="white"
      opacity="0.15"
    />
    <defs>
      <linearGradient id="katliBaseGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFFDF9" />
        <stop offset="50%" stopColor="#F5EFE6" />
        <stop offset="100%" stopColor="#DFD3C3" />
      </linearGradient>
      <linearGradient id="silverFoilGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="35%" stopColor="#E2E8F0" />
        <stop offset="70%" stopColor="#94A3B8" />
        <stop offset="100%" stopColor="#CBD5E1" />
      </linearGradient>
    </defs>
  </svg>
);

// Jalebi (Crispy orange syrup spiral)
export const JalebiIcon = ({ className = "h-8 w-8", ...props }) => (
  <svg
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...props}
  >
    {/* Soft Shadow */}
    <path
      d="M50 50 C45 45, 40 55, 50 60 C65 65, 60 35, 40 40 C20 45, 30 75, 55 75 C80 75, 85 45, 60 30 C35 15, 15 45, 25 70 C35 95, 75 90, 85 65 C95 40, 75 15, 50 15"
      stroke="black"
      strokeWidth="7"
      strokeLinecap="round"
      opacity="0.1"
      className="translate-y-1 translate-x-1"
    />
    {/* Jalebi Swirl */}
    <path
      d="M50 50 C45 45, 40 55, 50 60 C65 65, 60 35, 40 40 C20 45, 30 75, 55 75 C80 75, 85 45, 60 30 C35 15, 15 45, 25 70 C35 95, 75 90, 85 65 C95 40, 75 15, 50 15"
      stroke="url(#jalebiGold)"
      strokeWidth="7.5"
      strokeLinecap="round"
    />
    {/* Glossy syrup highlight lines */}
    <path
      d="M48 48 C45 45, 41 53, 50 57 C62 61, 58 37, 41 42 C24 47, 32 72, 55 72"
      stroke="#FFF3CD"
      strokeWidth="1.5"
      strokeLinecap="round"
      opacity="0.75"
    />
    <defs>
      <linearGradient id="jalebiGold" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FF9900" />
        <stop offset="40%" stopColor="#FF5E00" />
        <stop offset="80%" stopColor="#E03E00" />
        <stop offset="100%" stopColor="#991B00" />
      </linearGradient>
    </defs>
  </svg>
);

// Rasgulla Icon
export const RasgullaIcon = ({ className = "h-8 w-8", ...props }) => (
  <svg
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...props}
  >
    {/* Shadow */}
    <circle cx="52" cy="53" r="37" fill="black" opacity="0.08" />
    {/* White juicy sphere */}
    <circle cx="50" cy="50" r="37" fill="url(#rasgullaGrad)" />
    {/* Spongy texture details */}
    <circle cx="48" cy="48" r="37" fill="none" stroke="#FFFFFF" strokeWidth="1" opacity="0.6" />
    {/* Saffron threads (Kesar) */}
    <path
      d="M42 35 Q48 37 50 31"
      stroke="#D35400"
      strokeWidth="1.2"
      strokeLinecap="round"
    />
    <path
      d="M58 45 Q62 50 66 48"
      stroke="#D35400"
      strokeWidth="1.2"
      strokeLinecap="round"
    />
    <circle cx="45" cy="30" r="0.8" fill="#F39C12" />
    <circle cx="64" cy="52" r="0.8" fill="#F39C12" />
    
    {/* Pistachio slice */}
    <path d="M52 60 L58 57 L54 63 Z" fill="#27AE60" opacity="0.9" />
    
    {/* Syrup droplet shine */}
    <path
      d="M32 32 Q42 22 62 27 Q48 37 32 32 Z"
      fill="white"
      opacity="0.45"
    />
    <defs>
      <radialGradient id="rasgullaGrad" cx="30%" cy="30%" r="70%">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="60%" stopColor="#FCF7EA" />
        <stop offset="85%" stopColor="#F5E8C7" />
        <stop offset="100%" stopColor="#DEC797" />
      </radialGradient>
    </defs>
  </svg>
);

// Royal Mandala Decorative background (slowly rotating)
export const RoyalMandala = ({ className = "h-48 w-48", ...props }) => (
  <svg
    viewBox="0 0 200 200"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...props}
  >
    <circle cx="100" cy="100" r="95" stroke="url(#mandalaGoldGrad)" strokeWidth="0.5" strokeDasharray="3 3" opacity="0.25" />
    <circle cx="100" cy="100" r="82" stroke="url(#mandalaGoldGrad)" strokeWidth="1" opacity="0.35" />
    <circle cx="100" cy="100" r="60" stroke="url(#mandalaGoldGrad)" strokeWidth="0.5" strokeDasharray="6 3" opacity="0.25" />
    <circle cx="100" cy="100" r="35" stroke="url(#mandalaGoldGrad)" strokeWidth="0.75" opacity="0.3" />
    
    {/* Flower petals & lines */}
    {Array.from({ length: 16 }).map((_, i) => {
      const angle = (i * 22.5 * Math.PI) / 180;
      const x1 = 100 + Math.cos(angle) * 15;
      const y1 = 100 + Math.sin(angle) * 15;
      const x2 = 100 + Math.cos(angle) * 82;
      const y2 = 100 + Math.sin(angle) * 82;
      const innerX = 100 + Math.cos(angle) * 35;
      const innerY = 100 + Math.sin(angle) * 35;
      
      return (
        <g key={i}>
          {/* Radial ray lines */}
          <line
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="url(#mandalaGoldGrad)"
            strokeWidth="0.5"
            opacity="0.3"
          />
          {/* Outer circle points */}
          <circle cx={x2} cy={y2} r="1.5" fill="url(#mandalaGoldGrad)" opacity="0.5" />
          {/* Petal curves */}
          <path
            d={`M 100 100 Q ${100 + Math.cos(angle + 0.1) * 50} ${100 + Math.sin(angle + 0.1) * 50} ${x2} ${y2} Q ${100 + Math.cos(angle - 0.1) * 50} ${100 + Math.sin(angle - 0.1) * 50} 100 100`}
            stroke="url(#mandalaGoldGrad)"
            strokeWidth="0.5"
            opacity="0.15"
          />
          {/* Inner small petal curves */}
          <path
            d={`M 100 100 Q ${100 + Math.cos(angle + 0.15) * 22} ${100 + Math.sin(angle + 0.15) * 22} ${innerX} ${innerY} Q ${100 + Math.cos(angle - 0.15) * 22} ${100 + Math.sin(angle - 0.15) * 22} 100 100`}
            fill="url(#mandalaGoldGrad)"
            opacity="0.08"
          />
        </g>
      );
    })}
    <defs>
      <linearGradient id="mandalaGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFE082" />
        <stop offset="50%" stopColor="#FFB300" />
        <stop offset="100%" stopColor="#FF6F00" />
      </linearGradient>
    </defs>
  </svg>
);
