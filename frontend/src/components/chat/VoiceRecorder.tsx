"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";

interface VoiceRecorderProps {
  onRecorded: (audioBlob?: Blob, transcript?: string) => void;
  onLiveTranscript?: (transcript: string) => void;
  disabled?: boolean;
}

export function VoiceRecorder({ onRecorded, onLiveTranscript, disabled = false }: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [liveTranscript, setLiveTranscript] = useState("");
  const [recordingTime, setRecordingTime] = useState(0);

  const isRecordingRef = useRef(false);
  const streamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recognitionRef = useRef<any>(null);
  const transcriptRef = useRef<string>("");
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const cleanupRecognition = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.onresult = null;
        recognitionRef.current.onerror = null;
        recognitionRef.current.onend = null;
        recognitionRef.current.abort();
      } catch (e) {
        // Ignorer les erreurs d'arrêt
      }
      recognitionRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      cleanupRecognition();
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => {
          try {
            track.stop();
          } catch (e) {}
        });
      }
    };
  }, [cleanupRecognition]);

  const getSupportedMimeType = () => {
    if (typeof MediaRecorder === "undefined") return "";
    const types = [
      "audio/webm;codecs=opus",
      "audio/webm",
      "audio/ogg;codecs=opus",
      "audio/mp4",
      "audio/wav",
    ];
    for (const t of types) {
      if (MediaRecorder.isTypeSupported(t)) return t;
    }
    return "";
  };

  const startRecording = async () => {
    if (disabled || isRecordingRef.current) return;
    setLiveTranscript("");
    transcriptRef.current = "";
    setRecordingTime(0);
    audioChunksRef.current = [];
    isRecordingRef.current = true;
    setIsRecording(true);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
      streamRef.current = stream;

      // Nettoyer toute instance antérieure avant de démarrer
      cleanupRecognition();

      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        try {
          const recognition = new SpeechRecognition();
          recognition.continuous = true;
          recognition.interimResults = true;
          recognition.lang = "fr-FR";

          recognition.onresult = (event: any) => {
            // STOP IMMÉDIAT : ignorer tout résultat si l'enregistrement est stoppé
            if (!isRecordingRef.current) return;

            let current = "";
            for (let i = 0; i < event.results.length; i++) {
              current += event.results[i][0].transcript + " ";
            }
            const clean = current.trim();
            if (isRecordingRef.current) {
              transcriptRef.current = clean;
              setLiveTranscript(clean);
              if (onLiveTranscript) {
                onLiveTranscript(clean);
              }
            }
          };

          recognition.onerror = () => {
            // Ignorer les erreurs non bloquantes
          };

          recognition.onend = () => {
            // Pas de relance automatique
          };

          recognitionRef.current = recognition;
          recognition.start();
        } catch (e) {
          console.warn("SpeechRecognition start error:", e);
        }
      }

      const mimeType = getSupportedMimeType();
      let mediaRecorder: MediaRecorder;
      try {
        mediaRecorder = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream);
      } catch {
        mediaRecorder = new MediaRecorder(stream);
      }
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blobType = mediaRecorder.mimeType || mimeType || "audio/webm";
        const audioBlob = new Blob(audioChunksRef.current, { type: blobType });
        const finalText = transcriptRef.current.trim() || undefined;
        onRecorded(audioBlob, finalText);
      };

      mediaRecorder.start(100);

      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      isRecordingRef.current = false;
      setIsRecording(false);
      console.error("Accès micro refusé:", err);
      alert("Veuillez autoriser l'accès au microphone dans votre navigateur pour parler à l'IA.");
    }
  };

  const stopRecording = () => {
    if (!isRecordingRef.current) return;
    // 1. Coupe immédiatement le drapeau d'enregistrement
    isRecordingRef.current = false;
    setIsRecording(false);

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    // 2. Coupe immédiatement la reconnaissance vocale (aucun mot prononcé après ce clic ne sera transcrit)
    cleanupRecognition();

    // 3. Coupe immédiatement le microphone physique (le voyant rouge s'éteint)
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        try {
          track.stop();
        } catch (e) {}
      });
      streamRef.current = null;
    }

    // 4. Stoppe l'enregistrement média pour déclencher onstop et envoyer
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      try {
        mediaRecorderRef.current.stop();
      } catch (e) {}
    } else {
      const finalText = transcriptRef.current.trim() || undefined;
      if (finalText) {
        onRecorded(undefined, finalText);
      }
    }
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins}:${remainingSecs < 10 ? "0" : ""}${remainingSecs}`;
  };

  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
      {isRecording && (
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "0.35rem 0.75rem",
            borderRadius: "9999px",
            background: "var(--color-error-bg, #fef2f2)",
            border: "1px solid var(--color-error, #dc2626)",
            color: "var(--color-error, #dc2626)",
            fontSize: "0.8125rem",
            fontWeight: 600,
          }}
        >
          <span
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              background: "var(--color-error, #dc2626)",
              display: "inline-block",
            }}
          />
          <span>{formatTime(recordingTime)}</span>
          {liveTranscript && (
            <span
              style={{
                maxWidth: "200px",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                color: "var(--color-text)",
                fontStyle: "italic",
                fontWeight: 500,
              }}
            >
              « {liveTranscript} »
            </span>
          )}
        </div>
      )}

      <button
        type="button"
        onClick={isRecording ? stopRecording : startRecording}
        disabled={disabled}
        title={isRecording ? "Arrêter l'enregistrement et envoyer" : "Parler à l'IA (Commande vocale)"}
        className={`btn ${isRecording ? "btn--danger" : "btn--secondary"}`}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "0.4rem",
          padding: "0.55rem 0.9rem",
          fontSize: "0.8125rem",
          fontWeight: 600,
          cursor: disabled ? "not-allowed" : "pointer",
          opacity: disabled ? 0.6 : 1,
        }}
      >
        {isRecording ? (
          <>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <rect x="5" y="5" width="14" height="14" rx="2" />
            </svg>
            <span>Arrêter</span>
          </>
        ) : (
          <>
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.2}
                d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
              />
            </svg>
            <span>Micro</span>
          </>
        )}
      </button>
    </div>
  );
}
