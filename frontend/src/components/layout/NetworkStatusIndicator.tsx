"use client";

import { useEffect, useState } from "react";
import { getOfflineQueue, syncOfflineQueue } from "@/services/offlineSync";
import { api } from "@/services/api";
import { useToast } from "@/contexts/ToastContext";

export function NetworkStatusIndicator() {
  const [isOnline, setIsOnline] = useState(true);
  const [pendingCount, setPendingCount] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);
  const { addToast } = useToast();

  useEffect(() => {
    if (typeof window === "undefined") return;

    setIsOnline(navigator.onLine);
    setPendingCount(getOfflineQueue().length);

    function handleOnline() {
      setIsOnline(true);
      addToast("Connexion rétablie.", "info");
      triggerAutoSync();
    }

    function handleOffline() {
      setIsOnline(false);
      addToast("Vous êtes hors-ligne. Les ventes seront sauvegardées localement.", "warning");
    }

    function handleQueueChange(e: Event) {
      const custom = e as CustomEvent<{ count: number }>;
      setPendingCount(custom.detail?.count ?? getOfflineQueue().length);
    }

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    window.addEventListener("bizia_offline_queue_changed", handleQueueChange);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("bizia_offline_queue_changed", handleQueueChange);
    };
  }, []);

  async function triggerAutoSync() {
    const queue = getOfflineQueue();
    if (queue.length === 0) return;

    setIsSyncing(true);
    try {
      const res = await syncOfflineQueue((payload) =>
        api.sales.create({
          product_sku: payload.product_sku,
          quantity: payload.quantity,
          unit_price: payload.unit_price ?? 0,
          unit_cost: payload.unit_cost ?? null,
          sold_at: payload.sold_at ?? null,
          channel: payload.channel ?? "direct",
        })
      );
      if (res.success > 0) {
        addToast(`${res.success} vente(s) synchronisée(s) avec succès.`, "success");
      }
      if (res.failed > 0) {
        addToast(`${res.failed} vente(s) n'ont pas pu être synchronisées.`, "error");
      }
      setPendingCount(getOfflineQueue().length);
    } catch (err) {
      console.error("Erreur de synchronisation", err);
    } finally {
      setIsSyncing(false);
    }
  }

  if (isOnline && pendingCount === 0) {
    return null;
  }

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.5rem",
        padding: "0.25rem 0.65rem",
        borderRadius: "9999px",
        fontSize: "0.75rem",
        fontWeight: 600,
        background: !isOnline ? "rgba(245, 158, 11, 0.15)" : "rgba(59, 130, 246, 0.15)",
        color: !isOnline ? "#D97706" : "#3B82F6",
        border: `1px solid ${!isOnline ? "rgba(245, 158, 11, 0.3)" : "rgba(59, 130, 246, 0.3)"}`,
        transition: "all 0.2s ease",
      }}
      role="status"
    >
      <span
        style={{
          width: "6px",
          height: "6px",
          borderRadius: "50%",
          background: !isOnline ? "#F59E0B" : "#3B82F6",
          display: "inline-block",
          animation: !isOnline ? "pulse 2s infinite" : "none",
        }}
      />
      {!isOnline ? (
        <span>
          Hors-ligne {pendingCount > 0 ? `(${pendingCount} en attente)` : ""}
        </span>
      ) : (
        <button
          type="button"
          onClick={triggerAutoSync}
          disabled={isSyncing}
          style={{
            background: "none",
            border: "none",
            color: "inherit",
            cursor: "pointer",
            padding: 0,
            font: "inherit",
            display: "inline-flex",
            alignItems: "center",
            gap: "0.25rem",
          }}
        >
          {isSyncing ? "Synchronisation..." : `Synchroniser (${pendingCount})`}
        </button>
      )}
    </div>
  );
}
