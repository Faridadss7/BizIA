"use client";

import { useRef, useState, type ChangeEvent, type DragEvent } from "react";
import { api } from "@/services/api";
import { useToast } from "@/contexts/ToastContext";
import { Spinner } from "@/components/ui/Spinner";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import type { IngestionPreview } from "@/types";
import { getApiErrorMessage } from "@/utils/apiError";

type ReceiptScannerProps = {
  onSuccess?: () => void;
  standalone?: boolean;
};

export function ReceiptScanner({ onSuccess, standalone = false }: ReceiptScannerProps) {
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const [committing, setCommitting] = useState(false);
  const [previewData, setPreviewData] = useState<IngestionPreview | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const { addToast } = useToast();

  function handleFileSelected(file: File | null) {
    if (!file) return;
    
    // Check type
    const isImageOrPdf = file.type.startsWith("image/") || file.type === "application/pdf";
    if (!isImageOrPdf) {
      setError("Veuillez sélectionner une image (JPG, PNG, WebP) ou un document PDF de facture/reçu.");
      return;
    }

    setError(null);
    setSuccessMessage(null);
    setPreviewData(null);
    setSelectedFile(file);

    if (file.type.startsWith("image/")) {
      const url = URL.createObjectURL(file);
      setImagePreviewUrl(url);
    } else {
      setImagePreviewUrl(null);
    }

    // Auto-trigger OCR scanning
    triggerScan(file);
  }

  async function triggerScan(file: File) {
    setScanning(true);
    setError(null);
    try {
      const result = await api.previewFile(file);
      setPreviewData(result);
      addToast("Document analysé avec succès par l'IA.", "success");
    } catch (err) {
      const msg = getApiErrorMessage(err);
      setError(msg);
      addToast(msg, "error");
    } finally {
      setScanning(false);
    }
  }

  function handleDrop(e: DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileSelected(file);
  }

  function resetScanner() {
    setSelectedFile(null);
    setImagePreviewUrl(null);
    setPreviewData(null);
    setError(null);
    setSuccessMessage(null);
    if (cameraInputRef.current) cameraInputRef.current.value = "";
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function handleCommit() {
    if (!previewData) return;
    setCommitting(true);
    setError(null);
    try {
      const res = await api.commitImport({
        filename: previewData.filename,
        source: previewData.source,
        products: previewData.products,
        sales: previewData.sales,
      });

      const totalItems = (res.products_ingested || 0) + (res.sales_ingested || 0);
      const msg = `${totalItems} élément(s) enregistré(s) avec succès dans votre entreprise.`;
      setSuccessMessage(msg);
      addToast(msg, "success");
      setPreviewData(null);
      if (onSuccess) onSuccess();
    } catch (err) {
      const msg = getApiErrorMessage(err);
      setError(msg);
      addToast(msg, "error");
    } finally {
      setCommitting(false);
    }
  }

  return (
    <div className={`receipt-scanner ${standalone ? "receipt-scanner--standalone" : ""}`}>
      {/* Hidden inputs */}
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        style={{ display: "none" }}
        onChange={(e: ChangeEvent<HTMLInputElement>) => handleFileSelected(e.target.files?.[0] ?? null)}
      />
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,application/pdf"
        style={{ display: "none" }}
        onChange={(e: ChangeEvent<HTMLInputElement>) => handleFileSelected(e.target.files?.[0] ?? null)}
      />

      {error && (
        <div style={{ marginBottom: "1rem" }}>
          <Alert variant="error">{error}</Alert>
        </div>
      )}

      {successMessage && (
        <div style={{ marginBottom: "1rem" }}>
          <Alert variant="success">{successMessage}</Alert>
        </div>
      )}

      {!selectedFile && !previewData && (
        <div
          className={`scanner-dropzone ${dragOver ? "scanner-dropzone--active" : ""}`}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
        >
          <div className="scanner-dropzone__icon-box">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
              <circle cx="12" cy="13" r="4" />
            </svg>
          </div>

          <div className="scanner-dropzone__content">
            <h3 style={{ margin: "0 0 0.35rem", fontSize: "1.1rem", fontWeight: 700 }}>
              Numériser une facture ou un reçu papier
            </h3>
            <p style={{ margin: 0, fontSize: "0.875rem", color: "var(--color-text-muted, #94A3B8)" }}>
              Prenez en photo votre ticket de caisse, facture fournisseur ou bon de livraison. L'IA extrait automatiquement les articles et montants.
            </p>
          </div>

          <div className="scanner-dropzone__buttons">
            <button
              type="button"
              className="btn btn--primary"
              onClick={() => cameraInputRef.current?.click()}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 6 }}>
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                <circle cx="12" cy="13" r="4" />
              </svg>
              Prendre une photo (Caméra)
            </button>
            <button
              type="button"
              className="btn btn--outline"
              onClick={() => fileInputRef.current?.click()}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 6 }}>
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
              Importer depuis l'appareil
            </button>
          </div>
        </div>
      )}

      {selectedFile && scanning && (
        <div className="card card--glass" style={{ padding: "2.5rem 1.5rem", textAlign: "center" }}>
          <Spinner size="md" />
          <h3 style={{ marginTop: "1rem", marginBottom: "0.25rem", fontSize: "1.1rem" }}>
            Analyse OCR par Gemini Vision...
          </h3>
          <p style={{ margin: 0, fontSize: "0.85rem", color: "var(--color-text-muted, #94A3B8)" }}>
            Extraction des lignes d'articles, quantités, prix et totaux du document ({selectedFile.name}).
          </p>
        </div>
      )}

      {previewData && (
        <div className="card card--glass scanner-results">
          <div className="scanner-results__header">
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span className="badge badge--success">
                  {previewData.extraction_method === "gemini" ? "Extrait par Vision IA" : "Extrait"}
                </span>
                <span style={{ fontSize: "0.8rem", color: "var(--color-text-muted, #94A3B8)" }}>
                  {previewData.filename}
                </span>
              </div>
              <h3 style={{ margin: "0.4rem 0 0", fontSize: "1.15rem", fontWeight: 700 }}>
                Données détectées dans le document
              </h3>
            </div>

            <button
              type="button"
              className="btn btn--outline btn--sm"
              onClick={resetScanner}
            >
              Scanner un autre reçu
            </button>
          </div>

          {previewData.warnings && previewData.warnings.length > 0 && (
            <div style={{ marginTop: "1rem" }}>
              {previewData.warnings.map((w, idx) => (
                <Alert key={idx} variant="info">
                  {w}
                </Alert>
              ))}
            </div>
          )}

          <div className="scanner-results__body">
            {imagePreviewUrl && (
              <div className="scanner-results__image-preview">
                <img src={imagePreviewUrl} alt="Aperçu du reçu" />
              </div>
            )}

            <div className="scanner-results__table-wrap">
              {previewData.products && previewData.products.length > 0 && (
                <div style={{ marginBottom: "1.5rem" }}>
                  <h4 style={{ margin: "0 0 0.5rem", fontSize: "0.95rem", fontWeight: 600 }}>
                    Articles / Produits ({previewData.products.length})
                  </h4>
                  <div className="table-responsive">
                    <table className="table">
                      <thead>
                        <tr>
                          <th>Désignation / SKU</th>
                          <th>Coût d'achat</th>
                          <th>Prix de vente</th>
                          <th>Quantité</th>
                        </tr>
                      </thead>
                      <tbody>
                        {previewData.products.map((p, idx) => (
                          <tr key={idx}>
                            <td>
                              <strong>{p.name || p.sku}</strong>
                              {p.name && p.sku !== p.name && (
                                <div style={{ fontSize: "0.75rem", color: "#64748b" }}>SKU: {p.sku}</div>
                              )}
                            </td>
                            <td>{p.unit_cost != null ? `${p.unit_cost.toLocaleString()} FCFA` : "-"}</td>
                            <td>{p.unit_price != null ? `${p.unit_price.toLocaleString()} FCFA` : "-"}</td>
                            <td>{p.stock_quantity != null ? p.stock_quantity : "-"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {previewData.sales && previewData.sales.length > 0 && (
                <div>
                  <h4 style={{ margin: "0 0 0.5rem", fontSize: "0.95rem", fontWeight: 600 }}>
                    Lignes de Vente ({previewData.sales.length})
                  </h4>
                  <div className="table-responsive">
                    <table className="table">
                      <thead>
                        <tr>
                          <th>Produit</th>
                          <th>Quantité</th>
                          <th>Prix unitaire</th>
                          <th>Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {previewData.sales.map((s, idx) => (
                          <tr key={idx}>
                            <td><strong>{s.product_sku}</strong></td>
                            <td>{s.quantity}</td>
                            <td>{s.unit_price != null ? `${s.unit_price.toLocaleString()} FCFA` : "-"}</td>
                            <td>
                              {s.unit_price != null
                                ? `${(s.quantity * s.unit_price).toLocaleString()} FCFA`
                                : "-"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="scanner-results__footer">
            <button
              type="button"
              className="btn btn--outline"
              onClick={resetScanner}
              disabled={committing}
            >
              Annuler
            </button>
            <button
              type="button"
              className="btn btn--primary"
              onClick={handleCommit}
              disabled={committing}
            >
              {committing ? "Enregistrement..." : "Enregistrer dans l'entreprise"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
