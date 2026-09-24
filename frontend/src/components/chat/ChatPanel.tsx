"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { AppPageLayout } from "@/components/layout/AppPageLayout";
import { useCompany } from "@/contexts/CompanyContext";
import { api } from "@/services/api";
import { VoiceRecorder } from "@/components/chat/VoiceRecorder";
import { IconBot } from "@/components/icons/Icons";
import type { ChatAction } from "@/types";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  grounded?: boolean;
  actions_taken?: ChatAction[];
};

const SUGGESTIONS = [
  "Bonjour, que puis-je faire pour votre entreprise aujourd'hui ?",
  "Voulez-vous enregistrer un nouveau produit ?",
  "Voulez-vous enregistrer une nouvelle vente ?",
  "Consulter le bilan et les marges de l'entreprise",
  "Vérifier les produits en rupture de stock",
];

export function ChatPanel() {
  const { currentCompany } = useCompany();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [speechEnabled, setSpeechEnabled] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages([]);
    setError(null);
    stopSpeaking();
  }, [currentCompany.id]);

  const speakText = (rawText: string, force: boolean = false) => {
    if ((!speechEnabled && !force) || typeof window === "undefined" || !("speechSynthesis" in window)) {
      return;
    }

    try {
      window.speechSynthesis.cancel();

      const cleaned = rawText
        .replace(/[*#_`~>]/g, "")
        .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
        .replace(/[\u{1F300}-\u{1F6FF}\u{1F900}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, "")
        .replace(/\s+/g, " ")
        .trim();

      if (!cleaned) return;

      const utterance = new SpeechSynthesisUtterance(cleaned);
      utterance.lang = "fr-FR";
      utterance.rate = 1.05;
      utterance.pitch = 1.0;

      const voices = window.speechSynthesis.getVoices();
      const frVoice = voices.find(
        (v) =>
          v.lang.startsWith("fr") &&
          (v.name.includes("Google") || v.name.includes("Natural") || v.name.includes("Denise") || v.name.includes("Henri"))
      ) || voices.find((v) => v.lang.startsWith("fr"));

      if (frVoice) {
        utterance.voice = frVoice;
      }

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn("Erreur synthèse vocale:", e);
      setIsSpeaking(false);
    }
  };

  const stopSpeaking = () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  async function sendMessage(text: string) {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    stopSpeaking();
    const userMsg: Message = {
      id: `u-${Date.now()}`,
      role: "user",
      content: trimmed,
    };

    const historyPayload = messages.map((m) => ({ role: m.role, content: m.content }));

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);
    setError(null);

    try {
      const reply = await api.chat(trimmed, historyPayload);
      setMessages((prev) => [
        ...prev,
        {
          id: `a-${Date.now()}`,
          role: "assistant",
          content: reply.reply,
          grounded: reply.grounded,
          actions_taken: reply.actions_taken,
        },
      ]);
      speakText(reply.reply);
      setTimeout(() => {
        listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
      }, 100);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Impossible d'envoyer le message.");
    } finally {
      setLoading(false);
    }
  }

  async function handleVoiceRecorded(audioBlob?: Blob, transcript?: string) {
    if (loading) return;
    stopSpeaking();
    setLoading(true);
    setError(null);

    const userMsgId = `u-${Date.now()}`;
    const userLabel = transcript ? `🎤 ${transcript}` : "🎤 Message vocal...";
    const historyPayload = messages.map((m) => ({ role: m.role, content: m.content }));

    setMessages((prev) => [...prev, { id: userMsgId, role: "user", content: userLabel }]);

    try {
      const reply = await api.chatVoice(audioBlob, transcript, historyPayload);
      const recognized = reply.transcript || transcript;
      if (recognized && recognized !== "Message vocal non reconnu ou vide.") {
        setMessages((prev) =>
          prev.map((m) => (m.id === userMsgId ? { ...m, content: `🎤 ${recognized}` } : m))
        );
      } else {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === userMsgId ? { ...m, content: "🎤 Message vocal" } : m
          )
        );
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `a-${Date.now()}`,
          role: "assistant",
          content: reply.reply,
          grounded: reply.grounded,
          actions_taken: reply.actions_taken,
        },
      ]);
      speakText(reply.reply);
      setTimeout(() => {
        listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
      }, 100);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors du traitement du message vocal.");
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    sendMessage(input);
  }

  return (
    <AppPageLayout
      className="chat-section"
      eyebrow={`Assistant IA & Voix • ${currentCompany.name}`}
      title="Assistant d'analyse & Actions"
      description="Interrogez vos données, pilotez vos stocks, ajoutez des articles et enregistrez des ventes par saisie ou par commande vocale avec retour vocal."
    >
      {error && <Alert variant="error">{error}</Alert>}

      <div className="chat-layout card card--glass">
        {/* En-tête du Chat avec contrôle Audio */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0.625rem 1rem",
            borderBottom: "1px solid var(--color-border, #d8dee9)",
            background: "var(--color-surface-hover, #f1f4f8)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: "var(--color-success, #059669)",
                display: "inline-block",
              }}
            />
            <span style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--color-text-muted)" }}>
              IA Connectée à {currentCompany.name} (Gemini Flash & Groq)
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            {isSpeaking && (
              <button
                type="button"
                onClick={stopSpeaking}
                className="btn btn--danger"
                style={{ fontSize: "0.75rem", padding: "0.3rem 0.6rem" }}
              >
                Arrêter la voix
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                if (speechEnabled) stopSpeaking();
                setSpeechEnabled(!speechEnabled);
              }}
              className={`btn ${speechEnabled ? "btn--primary" : "btn--outline"}`}
              style={{ fontSize: "0.75rem", padding: "0.3rem 0.6rem" }}
            >
              {speechEnabled ? "Lecture auto : Active" : "Lecture auto : Désactivée"}
            </button>
          </div>
        </div>

        <div className="chat-messages" ref={listRef}>
          {messages.length === 0 ? (
            <div className="chat-empty">
              <div className="flex justify-center mb-3">
                <span
                  style={{
                    padding: "0.75rem",
                    background: "var(--color-info-bg, #f0f9ff)",
                    border: "1px solid var(--color-border, #d8dee9)",
                    borderRadius: "var(--radius-md, 10px)",
                    color: "var(--color-primary, #2563eb)",
                    display: "inline-flex",
                  }}
                >
                  <IconBot size={28} />
                </span>
              </div>
              <p className="font-semibold text-center mb-1" style={{ fontSize: "1.05rem", color: "var(--color-text)" }}>
                Vous allez bien ? Que puis-je faire pour vous aujourd&apos;hui ?
              </p>
              <p className="text-xs text-center mb-4" style={{ color: "var(--color-text-muted)", maxWidth: "480px", margin: "0 auto 1.25rem" }}>
                Je suis à votre écoute pour enregistrer un produit, saisir une vente, analyser vos marges ou vérifier vos stocks.
              </p>
              <div className="chat-suggestions">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    className="chat-suggestion"
                    onClick={() => sendMessage(s)}
                    disabled={loading}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((msg) => (
              <div key={msg.id} className={`chat-bubble chat-bubble--${msg.role}`}>
                <p className="whitespace-pre-wrap">{msg.content}</p>

                {/* Actions exécutées en base de données */}
                {msg.actions_taken && msg.actions_taken.length > 0 && (
                  <div style={{ marginTop: "0.75rem", paddingTop: "0.5rem", borderTop: "1px solid var(--color-border, #d8dee9)" }}>
                    <span style={{ fontSize: "0.6875rem", fontWeight: 700, color: "var(--color-success, #059669)", textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: "0.35rem" }}>
                      Actions appliquées :
                    </span>
                    {msg.actions_taken.map((act, i) => (
                      <div
                        key={i}
                        style={{
                          fontSize: "0.75rem",
                          background: "var(--color-success-bg, #ecfdf5)",
                          border: "1px solid var(--color-success, #059669)",
                          padding: "0.35rem 0.6rem",
                          borderRadius: "var(--radius-sm, 6px)",
                          color: "var(--color-success, #059669)",
                          fontWeight: 500,
                          marginBottom: "0.25rem",
                        }}
                      >
                        {act.label}
                      </div>
                    ))}
                  </div>
                )}

                {msg.role === "assistant" && (
                  <div
                    style={{
                      marginTop: "0.5rem",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      fontSize: "0.6875rem",
                      color: "var(--color-text-muted)",
                      paddingTop: "0.35rem",
                      borderTop: "1px solid var(--color-border, #d8dee9)",
                    }}
                  >
                    <span>
                      {msg.grounded ? "Ancré sur votre base de données" : "Réponse générale"}
                    </span>
                    <button
                      type="button"
                      onClick={() => speakText(msg.content, true)}
                      className="btn btn--outline"
                      style={{ fontSize: "0.6875rem", padding: "0.2rem 0.5rem" }}
                      title="Écouter la réponse à voix haute"
                    >
                      Écouter
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
          {loading && (
            <div className="chat-bubble chat-bubble--assistant chat-bubble--typing">
              <span className="typing-dots" aria-label="L'assistant traite votre demande…">
                <span /><span /><span />
              </span>
            </div>
          )}
        </div>

        <form className="chat-input-bar items-center gap-2" onSubmit={handleSubmit}>
          <VoiceRecorder
            onRecorded={handleVoiceRecorded}
            onLiveTranscript={(text) => setInput(text)}
            disabled={loading}
          />
          <input
            className="chat-input-bar__field flex-1"
            type="text"
            placeholder="Posez une question, dictez une vente ou ajoutez un produit…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
            aria-label="Votre message ou commande"
          />
          <Button type="submit" disabled={!input.trim() || loading} loading={loading}>
            Envoyer
          </Button>
        </form>
      </div>
    </AppPageLayout>
  );
}
