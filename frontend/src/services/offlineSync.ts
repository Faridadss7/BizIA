/**
 * Service de gestion de la file d'attente hors-ligne pour BizIA.
 * Permet aux commerçants d'enregistrer des ventes même sans réseau.
 */

export type OfflineSale = {
  id: string;
  product_sku: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  unit_cost?: number;
  total_amount: number;
  sold_at: string;
  channel?: string;
  notes?: string;
  timestamp: number;
};

const OFFLINE_SALES_KEY = "bizia_offline_sales_queue";

export function getOfflineQueue(): OfflineSale[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(OFFLINE_SALES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveOfflineQueue(queue: OfflineSale[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(OFFLINE_SALES_KEY, JSON.stringify(queue));
    window.dispatchEvent(new CustomEvent("bizia_offline_queue_changed", { detail: { count: queue.length } }));
  } catch (err) {
    console.error("Erreur sauvegarde file hors-ligne", err);
  }
}

export function addOfflineSale(sale: Omit<OfflineSale, "id" | "timestamp">): OfflineSale {
  const queue = getOfflineQueue();
  const newSale: OfflineSale = {
    ...sale,
    id: `off-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
    timestamp: Date.now(),
  };
  queue.push(newSale);
  saveOfflineQueue(queue);
  return newSale;
}

export function removeOfflineSale(id: string): void {
  const queue = getOfflineQueue().filter((item) => item.id !== id);
  saveOfflineQueue(queue);
}

export function clearOfflineQueue(): void {
  saveOfflineQueue([]);
}

export async function syncOfflineQueue(
  recordSaleFn: (payload: {
    product_sku: string;
    quantity: number;
    unit_price?: number;
    unit_cost?: number;
    sold_at?: string;
    channel?: string;
    notes?: string;
  }) => Promise<any>
): Promise<{ success: number; failed: number }> {
  const queue = getOfflineQueue();
  if (queue.length === 0) return { success: 0, failed: 0 };

  let successCount = 0;
  let failedCount = 0;
  const remaining: OfflineSale[] = [];

  for (const item of queue) {
    try {
      await recordSaleFn({
        product_sku: item.product_sku,
        quantity: item.quantity,
        unit_price: item.unit_price,
        unit_cost: item.unit_cost,
        sold_at: item.sold_at,
        channel: item.channel || "direct",
        notes: item.notes,
      });
      successCount++;
    } catch (err) {
      console.error("Échec de synchronisation de la vente", item, err);
      failedCount++;
      remaining.push(item);
    }
  }

  saveOfflineQueue(remaining);
  return { success: successCount, failed: failedCount };
}
