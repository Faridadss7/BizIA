import Link from "next/link";
import type { ReactNode } from "react";
import { BizIALogo } from "@/components/brand/BizIALogo";

type AuthPageLayoutProps = {
  children: ReactNode;
};

export function AuthPageLayout({ children }: AuthPageLayoutProps) {
  return (
    <div className="auth-page">
      <div className="auth-page__decor" aria-hidden="true" />
      <div className="auth-page__top-nav">
        <Link href="/" className="auth-page__back-link" title="Revenir à la page d'accueil">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          <span>Retour à l&apos;accueil</span>
        </Link>
      </div>
      <div className="auth-page__inner">
        <Link href="/" className="auth-page__brand" title="BizIA - Accueil">
          <BizIALogo size="md" showTagline />
        </Link>
        {children}
      </div>
    </div>
  );
}
