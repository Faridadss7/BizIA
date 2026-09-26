"use client";

import { useState, type FormEvent } from "react";
import { IconGoogle, IconX } from "@/components/icons/Icons";
import { Button } from "@/components/ui/Button";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSelectAccount: (account: { email: string; name?: string }) => void;
  isLoading?: boolean;
};

export function GoogleAccountModal({
  isOpen,
  onClose,
  onSelectAccount,
  isLoading = false,
}: Props) {
  const [email, setEmail] = useState("");

  if (!isOpen) return null;

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;

    onSelectAccount({
      email: email.trim(),
    });
  }

  return (
    <div
      className="modal-backdrop animate-fade-in"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="modal-card card card--glass animate-scale-up google-modal"
        style={{ maxWidth: 480, width: "100%" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header" style={{ alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <IconGoogle size={24} />
            <h2 style={{ margin: 0, fontSize: "1.25rem", fontWeight: 700 }}>Connexion avec Google</h2>
          </div>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Fermer"
            disabled={isLoading}
          >
            <IconX size={16} />
          </button>
        </div>

        <p className="muted" style={{ margin: "6px 0 16px", fontSize: "0.92rem", lineHeight: 1.5 }}>
          Choisissez votre mode de connexion Google sécurisé :
        </p>

        <div style={{ marginBottom: 16 }}>
          <button
            type="button"
            className="btn btn--google"
            style={{ width: "100%", justifyContent: "center", marginBottom: 12 }}
            onClick={() => onSelectAccount({ email: "utilisateur.google@gmail.com", name: "Utilisateur Google" })}
            disabled={isLoading}
          >
            <span className="btn__icon">
              <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
            </span>
            <span>Connexion Google Immédiate (1 clic)</span>
          </button>

          <div className="auth-divider" style={{ margin: "12px 0" }}>
            <span>ou saisir votre adresse Gmail / Google Workspace</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="google-custom-form">
          <div className="form-field" style={{ marginBottom: 18 }}>
            <label
              className="form-label"
              htmlFor="google-email"
              style={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--color-text, #1e293b)", marginBottom: 6, display: "block" }}
            >
              Adresse e-mail Google
            </label>
            <input
              id="google-email"
              type="email"
              className="field__control"
              style={{
                width: "100%",
                padding: "10px 14px",
                fontSize: "0.95rem",
                borderRadius: "var(--radius-sm, 6px)",
                border: "1px solid var(--color-border, #cbd5e1)",
                backgroundColor: "var(--color-surface, #ffffff)",
                color: "var(--color-text, #0f172a)",
                boxSizing: "border-box",
                outline: "none",
              }}
              placeholder="votre.nom@gmail.com ou votre domaine"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoFocus
            />
            <span style={{ display: "block", marginTop: 6, fontSize: "0.78rem", color: "var(--color-text-muted, #64748b)" }}>
              Votre compte et votre espace entreprise seront créés et sécurisés automatiquement.
            </span>
          </div>

          <div className="modal-actions" style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={isLoading}
            >
              Annuler
            </Button>
            <Button type="submit" loading={isLoading} disabled={!email.trim()}>
              Continuer avec cet e-mail
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
