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

        <p className="muted" style={{ margin: "6px 0 18px", fontSize: "0.92rem", lineHeight: 1.5 }}>
          Connectez-vous avec votre compte professionnel ou personnel Google :
        </p>

        <form onSubmit={handleSubmit} className="google-custom-form">
          <div className="form-field" style={{ marginBottom: 20 }}>
            <label
              className="form-label"
              htmlFor="google-email"
              style={{ fontSize: "0.95rem", fontWeight: 600, color: "#1e293b", marginBottom: 8, display: "block" }}
            >
              Adresse e-mail Google
            </label>
            <input
              id="google-email"
              type="email"
              className="field__control"
              style={{
                width: "100%",
                padding: "12px 14px",
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
              required
              autoFocus
            />
            <span style={{ display: "block", marginTop: 6, fontSize: "0.82rem", color: "#64748b" }}>
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
              Continuer avec ce compte Google
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
