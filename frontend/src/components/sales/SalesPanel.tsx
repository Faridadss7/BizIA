"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Input } from "@/components/ui/Input";
import { AppPageLayout } from "@/components/layout/AppPageLayout";
import { Spinner } from "@/components/ui/Spinner";
import { useCompany } from "@/contexts/CompanyContext";
import { api } from "@/services/api";
import { addOfflineSale } from "@/services/offlineSync";
import type { Product, Sale } from "@/types";
import { formatCurrency, formatDate } from "@/utils/format";

type SaleForm = {
  product_sku: string;
  quantity: number;
  unit_price: number;
  sold_at: string;
  channel: string;
};

const EMPTY: SaleForm = {
  product_sku: "",
  quantity: 1,
  unit_price: 0,
  sold_at: "",
  channel: "Boutique",
};

const CHANNELS = [
  { value: "Boutique", label: "Boutique / Point de vente" },
  { value: "Web", label: "Site Web / E-commerce" },
  { value: "WhatsApp", label: "WhatsApp Business" },
  { value: "B2B", label: "B2B / Vente en gros" },
  { value: "Autre", label: "Autre canal" },
];

export function SalesPanel() {
  const { currentCompany } = useCompany();
  const [items, setItems] = useState<Sale[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState<SaleForm>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const [sales, catalog] = await Promise.all([api.sales.list(), api.products.list()]);
      setItems(sales.items ?? []);
      setProducts(catalog.items ?? []);
    } catch (err) {
      if (typeof navigator !== "undefined" && !navigator.onLine) {
        setLoadError("Mode hors-ligne : affichage des données locales.");
      } else {
        setLoadError(err instanceof Error ? err.message : "Impossible de charger les ventes.");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load, currentCompany.id]);

  // Pagination des ventes
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  const totals = useMemo(
    () =>
      items.reduce(
        (acc, sale) => ({
          quantity: acc.quantity + sale.quantity,
          revenue: acc.revenue + sale.quantity * sale.unit_price,
        }),
        { quantity: 0, revenue: 0 }
      ),
    [items]
  );

  useEffect(() => {
    setPage(1);
  }, [items.length, pageSize]);

  const totalPages = pageSize > 0 ? Math.max(1, Math.ceil(items.length / pageSize)) : 1;
  const paginatedSales = useMemo(() => {
    if (pageSize <= 0) return items;
    const start = (page - 1) * pageSize;
    return items.slice(start, start + pageSize);
  }, [items, page, pageSize]);

  const pageNumbers = useMemo(() => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    if (page <= 3) {
      return [1, 2, 3, 4, "…", totalPages];
    }
    if (page >= totalPages - 2) {
      return [1, "…", totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    }
    return [1, "…", page - 1, page, page + 1, "…", totalPages];
  }, [page, totalPages]);

  /** Le prix du catalogue sert de proposition, l'utilisateur peut le corriger. */
  function selectProduct(sku: string) {
    const product = products.find((item) => item.sku === sku);
    setForm((f) => ({
      ...f,
      product_sku: sku,
      unit_price: product ? product.unit_price : f.unit_price,
    }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!form.product_sku.trim()) {
      setError("Choisissez le produit vendu.");
      return;
    }

    setSubmitting(true);
    setError(null);
    setSuccess(null);

    const isOffline = typeof navigator !== "undefined" && !navigator.onLine;

    if (isOffline) {
      const prodName = products.find((p) => p.sku === form.product_sku)?.name || form.product_sku;
      addOfflineSale({
        product_sku: form.product_sku.trim(),
        product_name: prodName,
        quantity: form.quantity,
        unit_price: form.unit_price,
        total_amount: form.quantity * form.unit_price,
        sold_at: form.sold_at ? new Date(form.sold_at).toISOString() : new Date().toISOString(),
        channel: form.channel || "Boutique",
      });

      setSuccess(
        `Vente enregistrée en mode hors-ligne : ${form.quantity} × ${formatCurrency(form.unit_price, currentCompany.currency || "FCFA")}. Elle sera synchronisée au retour du réseau.`
      );
      setForm(EMPTY);
      setSubmitting(false);
      return;
    }

    try {
      await api.sales.create({
        product_sku: form.product_sku.trim(),
        quantity: form.quantity,
        unit_price: form.unit_price,
        unit_cost: null,
        sold_at: form.sold_at ? new Date(form.sold_at).toISOString() : null,
        channel: form.channel || "Boutique",
      });
      setSuccess(
        `Vente enregistrée : ${form.quantity} × ${formatCurrency(form.unit_price, currentCompany.currency || "FCFA")} = ${formatCurrency(
          form.quantity * form.unit_price,
          currentCompany.currency || "FCFA"
        )} (${form.channel}).`
      );
      setForm(EMPTY);
      await load();
    } catch (err) {
      // Offline fallback when network drops
      const prodName = products.find((p) => p.sku === form.product_sku)?.name || form.product_sku;
      addOfflineSale({
        product_sku: form.product_sku.trim(),
        product_name: prodName,
        quantity: form.quantity,
        unit_price: form.unit_price,
        total_amount: form.quantity * form.unit_price,
        sold_at: form.sold_at ? new Date(form.sold_at).toISOString() : new Date().toISOString(),
        channel: form.channel || "Boutique",
      });
      setSuccess(
        `Connexion instable : vente sauvegardée localement (${form.quantity}x ${prodName}). Elle sera synchronisée automatiquement.`
      );
      setForm(EMPTY);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AppPageLayout
      eyebrow="Transactions"
      title="Ventes"
      description={`Enregistrez et suivez les ventes de ${currentCompany.name}. Données strictement rattachées à votre entreprise courante.`}
      actions={
        <Link href="/scanner" className="btn btn--outline btn--sm">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 6 }}>
            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
            <circle cx="12" cy="13" r="4" />
          </svg>
          Scanner un reçu
        </Link>
      }
    >
      <div className="page-grid page-grid--form-table">
        <form className="card card--glass form-card" onSubmit={handleSubmit}>
          <h2>Nouvelle vente</h2>

          {error && <Alert variant="error">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}

          {products.length === 0 && !loading ? (
            <Alert variant="info">
              Aucun produit au catalogue de {currentCompany.name}.{" "}
              <Link href="/produits" className="alert__link">Ajoutez un produit</Link>{" "}
              avant d&apos;enregistrer une vente.
            </Alert>
          ) : (
            <div className="field">
              <label className="field__label" htmlFor="product_sku">
                Produit
              </label>
              <div className="field__control">
                <select
                  id="product_sku"
                  name="product_sku"
                  className="field__input"
                  value={form.product_sku}
                  onChange={(e) => selectProduct(e.target.value)}
                  required
                >
                  <option value="">Choisir un produit…</option>
                  {products.map((product) => (
                    <option key={product.sku} value={product.sku}>
                      {product.name} — {product.sku} ({formatCurrency(product.unit_price, currentCompany.currency || "FCFA")})
                    </option>
                  ))}
                </select>
              </div>
              <p className="field__hint">
                Le prix de vente du catalogue est proposé automatiquement.
              </p>
            </div>
          )}

          <div className="form-card__row">
            <Input
              name="quantity"
              type="number"
              label="Quantité"
              min={1}
              value={form.quantity || ""}
              onChange={(e) => setForm((f) => ({ ...f, quantity: Number(e.target.value) }))}
              required
            />
            <Input
              name="unit_price"
              type="number"
              label={`Prix unitaire (${currentCompany.currency || "FCFA"})`}
              min={0}
              value={form.unit_price || ""}
              onChange={(e) => setForm((f) => ({ ...f, unit_price: Number(e.target.value) }))}
            />
          </div>

          <div className="form-card__row">
            <div className="field" style={{ flex: 1 }}>
              <label className="field__label" htmlFor="sale_channel">
                Canal de distribution
              </label>
              <div className="field__control">
                <select
                  id="sale_channel"
                  name="channel"
                  className="field__input"
                  value={form.channel}
                  onChange={(e) => setForm((f) => ({ ...f, channel: e.target.value }))}
                >
                  {CHANNELS.map((ch) => (
                    <option key={ch.value} value={ch.value}>
                      {ch.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <Input
              name="sold_at"
              type="datetime-local"
              label="Date de vente (optionnel)"
              value={form.sold_at}
              onChange={(e) => setForm((f) => ({ ...f, sold_at: e.target.value }))}
            />
          </div>

          <Button
            type="submit"
            loading={submitting}
            disabled={submitting || !form.product_sku}
          >
            Enregistrer dans {currentCompany.name}
          </Button>
        </form>

        <div className="card card--glass">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem", flexWrap: "wrap", gap: "0.75rem" }}>
            <h2>Historique des ventes ({items.length})</h2>
            <span className="badge badge--default" style={{ fontSize: "0.75rem", padding: "0.2rem 0.5rem" }}>
              Total : {formatCurrency(totals.revenue, currentCompany.currency || "FCFA")}
            </span>
          </div>

          {loadError && <Alert variant="error">{loadError}</Alert>}
          {loading ? (
            <Spinner />
          ) : items.length === 0 ? (
            <EmptyState
              title={`Aucune vente pour ${currentCompany.name}`}
              description="Enregistrez une première vente ou importez un document de ventes."
            />
          ) : (
            <>
              <div className="table-wrap">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Produit</th>
                      <th>Qté</th>
                      <th>Prix unit.</th>
                      <th>Total</th>
                      <th>Date</th>
                      <th>Canal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedSales.map((s, i) => (
                      <tr key={s.id ?? `${s.product_sku}-${i}`}>
                        <td><code>{s.product_sku}</code></td>
                        <td>{s.quantity}</td>
                        <td>{formatCurrency(s.unit_price, currentCompany.currency || "FCFA")}</td>
                        <td><strong>{formatCurrency(s.quantity * s.unit_price, currentCompany.currency || "FCFA")}</strong></td>
                        <td className="td--nowrap">{formatDate(s.sold_at)}</td>
                        <td>
                          <span className="table-tag table-tag--info">
                            {s.channel && s.channel !== "manual" ? s.channel : "Boutique"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <th scope="row">Total</th>
                      <td>{totals.quantity}</td>
                      <td />
                      <td>
                        <strong>{formatCurrency(totals.revenue, currentCompany.currency || "FCFA")}</strong>
                      </td>
                      <td colSpan={2} />
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* Barre de pagination dynamique pour les ventes */}
              {items.length > 0 && (
                <div className="pagination-bar">
                  <div className="pagination-info">
                    Affichage de <strong>{(page - 1) * pageSize + 1}</strong> à{" "}
                    <strong>{pageSize > 0 ? Math.min(page * pageSize, items.length) : items.length}</strong> sur{" "}
                    <strong>{items.length}</strong> {items.length > 1 ? "ventes" : "vente"}
                  </div>

                  <div className="pagination-controls">
                    <div className="pagination-size">
                      <label htmlFor="pageSizeSales" className="muted">
                        Afficher :
                      </label>
                      <select
                        id="pageSizeSales"
                        value={pageSize}
                        onChange={(e) => setPageSize(Number(e.target.value))}
                      >
                        <option value={15}>15 par page</option>
                        <option value={20}>20 par page</option>
                        <option value={50}>50 par page</option>
                        <option value={100}>100 par page</option>
                        <option value={-1}>Tout voir ({items.length})</option>
                      </select>
                    </div>

                    {pageSize > 0 && totalPages > 1 && (
                      <div className="pagination-nav">
                        <button
                          type="button"
                          className="pagination-btn"
                          onClick={() => setPage((p) => Math.max(1, p - 1))}
                          disabled={page <= 1}
                          title="Page précédente"
                        >
                          ← Précédent
                        </button>

                        {pageNumbers.map((num, idx) =>
                          typeof num === "number" ? (
                            <button
                              key={idx}
                              type="button"
                              className={`pagination-btn ${num === page ? "pagination-btn--active" : ""}`}
                              onClick={() => setPage(num)}
                            >
                              {num}
                            </button>
                          ) : (
                            <span key={idx} className="pagination-ellipsis">
                              {num}
                            </span>
                          )
                        )}

                        <button
                          type="button"
                          className="pagination-btn"
                          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                          disabled={page >= totalPages}
                          title="Page suivante"
                        >
                          Suivant →
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </AppPageLayout>
  );
}
