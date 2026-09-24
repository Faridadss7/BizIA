type BizIALogoProps = {
  showTagline?: boolean;
  size?: "sm" | "md" | "lg";
  concept?: 1 | 2 | 3;
};

const sizes = {
  sm: { mark: 28, text: "1.05rem", tagline: "0.62rem" },
  md: { mark: 36, text: "1.35rem", tagline: "0.7rem" },
  lg: { mark: 48, text: "1.75rem", tagline: "0.8rem" },
};

export function BizIALogo({ showTagline = true, size = "md", concept = 1 }: BizIALogoProps) {
  const s = sizes[size];

  return (
    <div className="bizia-logo" aria-label="BizIA">
      {concept === 1 && (
        <svg
          className="bizia-logo__mark"
          width={s.mark}
          height={s.mark}
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="bizia-c1-base" x1="10" y1="10" x2="90" y2="90" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#1D4ED8" />
              <stop offset="50%" stopColor="#2563EB" />
              <stop offset="100%" stopColor="#3B82F6" />
            </linearGradient>
            <linearGradient id="bizia-c1-accent" x1="30" y1="20" x2="85" y2="75" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#38BDF8" />
              <stop offset="100%" stopColor="#06B6D4" />
            </linearGradient>
          </defs>
          <rect width="100" height="100" rx="24" fill="url(#bizia-c1-base)" />
          {/* Colonne dorsale */}
          <path d="M24 22C24 19.7909 25.7909 18 28 18H38C40.2091 18 42 19.7909 42 22V78C42 80.2091 40.2091 82 38 82H28C25.7909 82 24 80.2091 24 78V22Z" fill="white" />
          {/* Boucle haut */}
          <path d="M38 18H58C67.9411 18 76 26.0589 76 36C76 45.9411 67.9411 54 58 54H38V18Z" fill="white" fillOpacity="0.96" />
          <path d="M48 28H56C60.4183 28 64 31.5817 64 36C64 40.4183 60.4183 44 56 44H48V28Z" fill="url(#bizia-c1-base)" />
          {/* Boucle bas (dynamisme) */}
          <path d="M38 46H62C72.4934 46 81 54.5066 81 65C81 74.3888 74.1911 82 64.8023 82H38V46Z" fill="url(#bizia-c1-accent)" />
          <path d="M48 56H61C65.9706 56 70 60.0294 70 65C70 69.9706 65.9706 74 61 74H48V56Z" fill="url(#bizia-c1-base)" />
          {/* Flèche d'ascension discrète */}
          <path d="M74 24L82 16M82 16H74M82 16V24" stroke="#38BDF8" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}

      {concept === 2 && (
        <svg
          className="bizia-logo__mark"
          width={s.mark}
          height={s.mark}
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path d="M50 12L82 30.5L50 49L18 30.5L50 12Z" fill="#6366F1" />
          <path d="M18 30.5L50 49V86L18 67.5V30.5Z" fill="#312E81" />
          <path d="M50 49L82 30.5V67.5L50 86V49Z" fill="#10B981" />
          <path d="M36 34V66H50C54.4183 66 58 62.4183 58 58C58 54.5 55.5 51.5 52 50.5C54.5 49.5 56 47 56 44C56 39.5817 52.4183 36 48 36H36" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="50" cy="12" r="3" fill="#38BDF8" />
        </svg>
      )}

      {concept === 3 && (
        <svg
          className="bizia-logo__mark"
          width={s.mark}
          height={s.mark}
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <rect width="100" height="100" rx="24" fill="#0B1120" />
          <rect x="25" y="44" width="9" height="32" rx="4.5" fill="#38BDF8" fillOpacity="0.6" />
          <rect x="38" y="32" width="9" height="44" rx="4.5" fill="#60A5FA" fillOpacity="0.8" />
          <path d="M30 50H54C60.0751 50 65 45.0751 65 39C65 32.9249 60.0751 28 54 28H30V76H56C62.6274 76 68 70.6274 68 64C68 57.3726 62.6274 52 56 52H30" stroke="white" strokeWidth="6" strokeLinecap="round" />
        </svg>
      )}

      <div className="bizia-logo__text-wrap">
        <span className="bizia-logo__name" style={{ fontSize: s.text, fontWeight: 800, letterSpacing: "-0.03em" }}>
          Biz<span className="bizia-logo__accent" style={{ color: "#2563EB", fontWeight: 900 }}>IA</span>
        </span>
        {showTagline && (
          <span className="bizia-logo__tagline" style={{ fontSize: s.tagline, letterSpacing: "0.04em", fontWeight: 600 }}>
            PME &amp; entreprises
          </span>
        )}
      </div>
    </div>
  );
}

