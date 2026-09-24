"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AppPageLayout } from "@/components/layout/AppPageLayout";
import { useCompany } from "@/contexts/CompanyContext";
import { api } from "@/services/api";
import { formatAmount, formatPercent } from "@/utils/format";
import {
  IconPackage,
  IconCoins,
  IconFile,
  IconUpload,
  IconDownload,
  IconBot,
  IconTrash,
  IconPlus,
} from "@/components/icons/Icons";

type TemplateType = "products" | "sales" | "expenses";

interface ProductRow {
  id: string;
  sku: string;
  name: string;
  category: string;
  unit_cost: number;
  unit_price: number;
  stock_quantity: number;
  simulated_sales_qty: number;
}

interface SaleRow {
  id: string;
  date: string;
  sku: string;
  name: string;
  quantity: number;
  unit_price: number;
  customer: string;
}

interface ExpenseRow {
  id: string;
  date: string;
  category: string;
  amount: number;
  description: string;
}

export function SpreadsheetSimulator() {
  const { currentCompany } = useCompany();
  const router = useRouter();

  // Mode de tableau actif
  const [template, setTemplate] = useState<TemplateType>("products");

  // Données des tables (initialisées vides — aucune donnée statique/mock)
  const [productRows, setProductRows] = useState<ProductRow[]>([]);
  const [saleRows, setSaleRows] = useState<SaleRow[]>([]);
  const [expenseRows, setExpenseRows] = useState<ExpenseRow[]>([]);

  // État de chargement et retours
  const [loading, setLoading] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiGenerating, setAiGenerating] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: "success" | "error" | "info" } | null>(null);

  // Ajustements scénarios What-If (Produits)
  const [priceAdjustmentPct, setPriceAdjustmentPct] = useState<number>(0);
  const [volumeAdjustmentPct, setVolumeAdjustmentPct] = useState<number>(0);

  // Charger les données existantes de l'entreprise connectée
  useEffect(() => {
    async function loadCompanyData() {
      try {
        setLoading(true);
        const [prodRes, salesRes] = await Promise.all([
          api.products.list().catch(() => ({ items: [] })),
          api.sales.list().catch(() => ({ items: [] })),
        ]);

        if (prodRes.items && prodRes.items.length > 0) {
          const mapped: ProductRow[] = prodRes.items.map((p, idx) => ({
            id: p.id || String(idx + 1),
            sku: p.sku || `ART-00${idx + 1}`,
            name: p.name || "",
            category: p.category || "Général",
            unit_cost: Number(p.unit_cost) || 0,
            unit_price: Number(p.unit_price) || 0,
            stock_quantity: Number(p.stock_quantity) || 0,
            simulated_sales_qty: 0,
          }));
          setProductRows(mapped);
        } else {
          // Ligne vierge initiale pour commencer la saisie
          setProductRows([
            {
              id: "1",
              sku: "ART-001",
              name: "",
              category: "Général",
              unit_cost: 0,
              unit_price: 0,
              stock_quantity: 0,
              simulated_sales_qty: 0,
            },
          ]);
        }

        if (salesRes.items && salesRes.items.length > 0) {
          const mappedSales: SaleRow[] = salesRes.items.map((s, idx) => ({
            id: s.id || `s_${idx + 1}`,
            date: s.sold_at || new Date().toISOString().split("T")[0],
            sku: s.product_sku || `SKU-${idx + 1}`,
            name: (s as any).product_name || s.product_sku || `Article ${idx + 1}`,
            quantity: Number(s.quantity) || 1,
            unit_price: Number(s.unit_price) || 0,
            customer: (s as any).customer || s.channel || "Client",
          }));
          setSaleRows(mappedSales);
        } else {
          setSaleRows([
            {
              id: "s1",
              date: new Date().toISOString().split("T")[0],
              sku: "ART-001",
              name: "",
              quantity: 1,
              unit_price: 0,
              customer: "Client Comptoir",
            },
          ]);
        }

        setExpenseRows([
          {
            id: "e1",
            date: new Date().toISOString().split("T")[0],
            category: "Charges d'exploitation",
            amount: 0,
            description: "",
          },
        ]);
      } catch (err) {
        console.warn("Initialisation du tableau vierge.");
      } finally {
        setLoading(false);
      }
    }
    loadCompanyData();
  }, [currentCompany.id]);

  // Actions Produits
  const updateProductCell = (id: string, field: keyof ProductRow, value: any) => {
    setProductRows((prev) =>
      prev.map((r) => {
        if (r.id !== id) return r;
        return {
          ...r,
          [field]: field === "name" || field === "sku" || field === "category" ? value : Number(value) || 0,
        };
      })
    );
  };

  const addProductRow = () => {
    const newId = String(Date.now());
    const newRow: ProductRow = {
      id: newId,
      sku: `ART-${productRows.length + 1 < 10 ? "00" : "0"}${productRows.length + 1}`,
      name: "",
      category: "Général",
      unit_cost: 0,
      unit_price: 0,
      stock_quantity: 0,
      simulated_sales_qty: 0,
    };
    setProductRows((prev) => [...prev, newRow]);
  };

  const deleteProductRow = (id: string) => {
    setProductRows((prev) => prev.filter((r) => r.id !== id));
  };

  // Actions Ventes
  const updateSaleCell = (id: string, field: keyof SaleRow, value: any) => {
    setSaleRows((prev) =>
      prev.map((r) => {
        if (r.id !== id) return r;
        return {
          ...r,
          [field]: field === "quantity" || field === "unit_price" ? Number(value) || 0 : value,
        };
      })
    );
  };

  const addSaleRow = () => {
    const newId = `s_${Date.now()}`;
    const newRow: SaleRow = {
      id: newId,
      date: new Date().toISOString().split("T")[0],
      sku: `ART-${saleRows.length + 1 < 10 ? "00" : "0"}${saleRows.length + 1}`,
      name: "",
      quantity: 1,
      unit_price: 0,
      customer: "Client",
    };
    setSaleRows((prev) => [...prev, newRow]);
  };

  const deleteSaleRow = (id: string) => {
    setSaleRows((prev) => prev.filter((r) => r.id !== id));
  };

  // Actions Dépenses
  const updateExpenseCell = (id: string, field: keyof ExpenseRow, value: any) => {
    setExpenseRows((prev) =>
      prev.map((r) => {
        if (r.id !== id) return r;
        return {
          ...r,
          [field]: field === "amount" ? Number(value) || 0 : value,
        };
      })
    );
  };

  const addExpenseRow = () => {
    const newId = `e_${Date.now()}`;
    const newRow: ExpenseRow = {
      id: newId,
      date: new Date().toISOString().split("T")[0],
      category: "Charges d'exploitation",
      amount: 0,
      description: "",
    };
    setExpenseRows((prev) => [...prev, newRow]);
  };

  const deleteExpenseRow = (id: string) => {
    setExpenseRows((prev) => prev.filter((r) => r.id !== id));
  };

  // Calculs What-If Produits
  const getAdjustedPrice = (price: number) => Math.round(price * (1 + priceAdjustmentPct / 100));
  const getAdjustedVolume = (qty: number) => Math.max(0, Math.round(qty * (1 + volumeAdjustmentPct / 100)));

  let totalSimulatedRevenue = 0;
  let totalSimulatedCost = 0;
  let totalSimulatedVolume = 0;
  let totalImmobilizedCapital = 0;

  const computedProducts = productRows.map((r) => {
    const adjPrice = getAdjustedPrice(r.unit_price);
    const adjQty = getAdjustedVolume(r.simulated_sales_qty);
    const marginAmount = adjPrice - r.unit_cost;
    const marginPct = adjPrice > 0 ? (marginAmount / adjPrice) * 100 : 0;
    const rowRevenue = adjPrice * adjQty;
    const rowCost = r.unit_cost * adjQty;
    const rowProfit = rowRevenue - rowCost;
    const immobilized = r.unit_cost * r.stock_quantity;

    totalSimulatedRevenue += rowRevenue;
    totalSimulatedCost += rowCost;
    totalSimulatedVolume += adjQty;
    totalImmobilizedCapital += immobilized;

    return {
      ...r,
      adjPrice,
      adjQty,
      marginAmount,
      marginPct,
      rowRevenue,
      rowProfit,
      immobilized,
    };
  });

  const totalSimulatedProfit = totalSimulatedRevenue - totalSimulatedCost;
  const avgSimulatedMarginPct =
    totalSimulatedRevenue > 0 ? (totalSimulatedProfit / totalSimulatedRevenue) * 100 : 0;

  // Calculs Totaux Ventes & Dépenses
  const totalSalesRevenue = saleRows.reduce((sum, s) => sum + s.quantity * s.unit_price, 0);
  const totalSalesUnits = saleRows.reduce((sum, s) => sum + s.quantity, 0);
  const totalExpensesAmount = expenseRows.reduce((sum, e) => sum + e.amount, 0);

  // Génération IA par prompt
  const handleGenerateWithAI = async (customPrompt?: string) => {
    const promptToUse = customPrompt || aiPrompt;
    if (!promptToUse.trim()) return;

    setAiGenerating(true);
    setStatusMessage({ text: "Génération du tableau avec l'IA en cours...", type: "info" });
    try {
      const res = await api.generateTable(promptToUse, template);
      if (res && res.rows && res.rows.length > 0) {
        if (template === "products") {
          const mapped: ProductRow[] = res.rows.map((r: any, idx: number) => ({
            id: `ai_${Date.now()}_${idx}`,
            sku: r.sku || `ART-${idx + 101}`,
            name: r.name || `Article ${idx + 1}`,
            category: r.category || "Général",
            unit_cost: Number(r.unit_cost) || 0,
            unit_price: Number(r.unit_price) || 0,
            stock_quantity: Number(r.stock_quantity) || 0,
            simulated_sales_qty: Number(r.simulated_sales_qty) || 0,
          }));
          setProductRows(mapped);
        } else if (template === "sales") {
          const mapped: SaleRow[] = res.rows.map((r: any, idx: number) => ({
            id: `ai_s_${Date.now()}_${idx}`,
            date: r.date || new Date().toISOString().split("T")[0],
            sku: r.sku || `ART-${idx + 101}`,
            name: r.name || `Article Vendu ${idx + 1}`,
            quantity: Number(r.quantity) || 1,
            unit_price: Number(r.unit_price) || 0,
            customer: r.customer || "Client",
          }));
          setSaleRows(mapped);
        } else if (template === "expenses") {
          const mapped: ExpenseRow[] = res.rows.map((r: any, idx: number) => ({
            id: `ai_e_${Date.now()}_${idx}`,
            date: r.date || new Date().toISOString().split("T")[0],
            category: r.category || "Charges",
            amount: Number(r.amount) || 0,
            description: r.description || "Dépense d'exploitation",
          }));
          setExpenseRows(mapped);
        }
        setStatusMessage({ text: `Tableau généré avec succès (${res.rows.length} lignes créées).`, type: "success" });
        setAiPrompt("");
      }
    } catch (err) {
      setStatusMessage({ text: "Erreur lors de la génération IA du tableau.", type: "error" });
    } finally {
      setAiGenerating(false);
    }
  };

  // Export CSV / Excel
  const handleExportExcel = () => {
    let filename = "";
    let csvContent = "";

    if (template === "products") {
      filename = `catalogue_produits_${currentCompany.name.toLowerCase().replace(/\s+/g, "_")}.csv`;
      const headers = [
        "SKU",
        "Nom du Produit",
        "Catégorie",
        "Coût Achat (FCFA)",
        "Prix Vente Simulé (FCFA)",
        "Marge Unitaire (FCFA)",
        "Marge (%)",
        "Stock Actuel",
        "Ventes Simulées",
        "CA Simulé (FCFA)",
        "Bénéfice Simulé (FCFA)",
        "Capital Immobilisé (FCFA)",
      ];
      csvContent = [
        headers.join(";"),
        ...computedProducts.map((r) =>
          [
            r.sku,
            `"${r.name.replace(/"/g, '""')}"`,
            `"${r.category.replace(/"/g, '""')}"`,
            r.unit_cost,
            r.adjPrice,
            r.marginAmount,
            r.marginPct.toFixed(1),
            r.stock_quantity,
            r.adjQty,
            r.rowRevenue,
            r.rowProfit,
            r.immobilized,
          ].join(";")
        ),
      ].join("\r\n");
    } else if (template === "sales") {
      filename = `journal_ventes_${currentCompany.name.toLowerCase().replace(/\s+/g, "_")}.csv`;
      const headers = ["Date", "SKU", "Article", "Quantité", "Prix Unitaire (FCFA)", "Total Vente (FCFA)", "Client"];
      csvContent = [
        headers.join(";"),
        ...saleRows.map((s) =>
          [
            s.date,
            s.sku,
            `"${s.name.replace(/"/g, '""')}"`,
            s.quantity,
            s.unit_price,
            s.quantity * s.unit_price,
            `"${s.customer.replace(/"/g, '""')}"`,
          ].join(";")
        ),
      ].join("\r\n");
    } else {
      filename = `charges_depenses_${currentCompany.name.toLowerCase().replace(/\s+/g, "_")}.csv`;
      const headers = ["Date", "Catégorie", "Montant (FCFA)", "Description"];
      csvContent = [
        headers.join(";"),
        ...expenseRows.map((e) =>
          [
            e.date,
            `"${e.category.replace(/"/g, '""')}"`,
            e.amount,
            `"${e.description.replace(/"/g, '""')}"`,
          ].join(";")
        ),
      ].join("\r\n");
    }

    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Transmission directe vers l'analyse ML & Dashboard
  const handleInjectIntoAnalysis = async () => {
    try {
      setLoading(true);
      setStatusMessage({ text: "Injection des données et calcul de l'analyse en cours...", type: "info" });

      const productsPayload = computedProducts
        .filter((p) => p.name.trim() || p.unit_price > 0)
        .map((p) => ({
          sku: p.sku,
          name: p.name || p.sku,
          category: p.category,
          unit_cost: p.unit_cost,
          unit_price: p.adjPrice,
          stock_quantity: p.stock_quantity,
          low_stock_threshold: 5,
        }));

      const salesPayload =
        template === "sales"
          ? saleRows
            .filter((s) => s.name.trim() || s.unit_price > 0)
            .map((s) => ({
              product_sku: s.sku,
              quantity: s.quantity,
              unit_price: s.unit_price,
              sold_at: s.date,
              channel: "Comptoir",
            }))
          : computedProducts
            .filter((p) => p.name.trim() || p.unit_price > 0)
            .map((p) => ({
              product_sku: p.sku,
              quantity: p.adjQty,
              unit_price: p.adjPrice,
              unit_cost: p.unit_cost,
              sold_at: new Date().toISOString().split("T")[0],
              channel: "Simulateur",
            }));

      await api.commitImport({
        filename: `tableau_${template}_${new Date().toISOString().slice(0, 10)}.xlsx`,
        source: "excel",
        products: productsPayload,
        sales: salesPayload,
      });

      await api.runAnalysis();

      setStatusMessage({ text: "Données injectées et rapport généré avec succès. Redirection vers le tableau de bord...", type: "success" });

      setTimeout(() => {
        router.push("/dashboard");
      }, 1200);
    } catch (err) {
      setStatusMessage({ text: "Erreur lors de l'injection vers le moteur d'analyse.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const cellInputStyle: React.CSSProperties = {
    background: "transparent",
    border: "1px solid transparent",
    borderRadius: "var(--radius-sm, 6px)",
    padding: "0.25rem 0.5rem",
    fontSize: "0.875rem",
    color: "var(--color-text)",
    width: "100%",
    transition: "border-color 0.15s, background 0.15s",
  };

  const onFocusCell = (e: React.FocusEvent<HTMLInputElement>) => {
    e.currentTarget.style.borderColor = "var(--color-primary)";
    e.currentTarget.style.background = "var(--color-surface)";
  };

  const onBlurCell = (e: React.FocusEvent<HTMLInputElement>) => {
    e.currentTarget.style.borderColor = "transparent";
    e.currentTarget.style.background = "transparent";
  };

  return (
    <AppPageLayout
      eyebrow={`Création de Tableaux & Scénarios • ${currentCompany.name}`}
      title="Créateur de Tableaux Excel & Simulateur Prévisionnel"
      description="Créez vos tableaux d'exploitation, exportez vos fichiers Excel (.xlsx / .csv) et injectez directement vos chiffres dans l'analyse de données pour générer un rapport décisionnel."
    >
      {/* Alerte Statut */}
      {statusMessage && (
        <div
          style={{
            marginBottom: "1.25rem",
            padding: "0.875rem 1.25rem",
            borderRadius: "var(--radius-md, 10px)",
            border: `1px solid ${statusMessage.type === "success"
                ? "var(--color-success, #059669)"
                : statusMessage.type === "error"
                  ? "var(--color-error, #dc2626)"
                  : "var(--color-primary, #2563eb)"
              }`,
            background:
              statusMessage.type === "success"
                ? "var(--color-success-bg, #ecfdf5)"
                : statusMessage.type === "error"
                  ? "var(--color-error-bg, #fef2f2)"
                  : "var(--color-info-bg, #f0f9ff)",
            color:
              statusMessage.type === "success"
                ? "var(--color-success, #059669)"
                : statusMessage.type === "error"
                  ? "var(--color-error, #dc2626)"
                  : "var(--color-primary, #2563eb)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontWeight: 500,
            fontSize: "0.875rem",
          }}
        >
          <span>{statusMessage.text}</span>
          <button
            type="button"
            onClick={() => setStatusMessage(null)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: "0.8125rem",
              textDecoration: "underline",
              color: "inherit",
            }}
          >
            Fermer
          </button>
        </div>
      )}

      {/* Barre de navigation des modèles de tableaux et actions */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "1rem",
          marginBottom: "1.5rem",
        }}
      >
        <div
          style={{
            display: "inline-flex",
            padding: "0.25rem",
            background: "var(--color-surface, #ffffff)",
            border: "1px solid var(--color-border, #d8dee9)",
            borderRadius: "var(--radius-md, 10px)",
            boxShadow: "var(--shadow-sm)",
          }}
        >
          <button
            type="button"
            onClick={() => setTemplate("products")}
            className={`btn ${template === "products" ? "btn--primary" : "btn--outline"}`}
            style={{ padding: "0.45rem 0.9rem", fontSize: "0.8125rem", border: "none", display: "inline-flex", alignItems: "center", gap: "0.35rem" }}
          >
            <IconPackage size={14} /> Catalogue & Stocks
          </button>
          <button
            type="button"
            onClick={() => setTemplate("sales")}
            className={`btn ${template === "sales" ? "btn--primary" : "btn--outline"}`}
            style={{ padding: "0.45rem 0.9rem", fontSize: "0.8125rem", border: "none", display: "inline-flex", alignItems: "center", gap: "0.35rem" }}
          >
            <IconCoins size={14} /> Journal des Ventes
          </button>
          <button
            type="button"
            onClick={() => setTemplate("expenses")}
            className={`btn ${template === "expenses" ? "btn--primary" : "btn--outline"}`}
            style={{ padding: "0.45rem 0.9rem", fontSize: "0.8125rem", border: "none", display: "inline-flex", alignItems: "center", gap: "0.35rem" }}
          >
            <IconFile size={14} /> Dépenses & Charges
          </button>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "0.625rem" }}>
          <button
            type="button"
            onClick={handleExportExcel}
            className="btn btn--secondary"
            style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", fontSize: "0.8125rem" }}
          >
            <IconDownload size={14} /> Télécharger en Excel (.csv)
          </button>
          <button
            type="button"
            onClick={handleInjectIntoAnalysis}
            disabled={loading}
            className="btn btn--primary"
            style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", fontSize: "0.8125rem" }}
          >
            <IconUpload size={14} /> Injecter dans l&apos;Analyse & Rapport
          </button>
        </div>
      </div>

      {/* Cartes KPI */}
      <div className="kpi-grid" style={{ marginBottom: "1.5rem" }}>
        {template === "products" && (
          <>
            <div className="kpi-card kpi-card--blue">
              <span className="kpi-card__label">CA Simulé Prévisionnel</span>
              <div className="kpi-card__value">{formatAmount(totalSimulatedRevenue)}</div>
              <span className="kpi-card__sub">Volume : {totalSimulatedVolume} articles simulés</span>
            </div>
            <div className="kpi-card kpi-card--green">
              <span className="kpi-card__label">Bénéfice Brut Estimé</span>
              <div className="kpi-card__value">{formatAmount(totalSimulatedProfit)}</div>
              <span className="kpi-card__sub">Coûts totaux : {formatAmount(totalSimulatedCost)}</span>
            </div>
            <div className="kpi-card kpi-card--orange">
              <span className="kpi-card__label">Taux de Marge Moyen</span>
              <div className="kpi-card__value">{formatPercent(avgSimulatedMarginPct)}</div>
              <span className="kpi-card__sub">Rentabilité prévisionnelle</span>
            </div>
            <div className="kpi-card kpi-card--purple">
              <span className="kpi-card__label">Capital Stock Immobilisé</span>
              <div className="kpi-card__value">{formatAmount(totalImmobilizedCapital)}</div>
              <span className="kpi-card__sub">{productRows.length} références en catalogue</span>
            </div>
          </>
        )}

        {template === "sales" && (
          <>
            <div className="kpi-card kpi-card--blue">
              <span className="kpi-card__label">Total Chiffre d&apos;Affaires</span>
              <div className="kpi-card__value">{formatAmount(totalSalesRevenue)}</div>
              <span className="kpi-card__sub">Montant des encaissements</span>
            </div>
            <div className="kpi-card kpi-card--green">
              <span className="kpi-card__label">Volume Total Vendu</span>
              <div className="kpi-card__value">{totalSalesUnits} articles</div>
              <span className="kpi-card__sub">Sur {saleRows.length} transactions</span>
            </div>
            <div className="kpi-card kpi-card--orange">
              <span className="kpi-card__label">Panier Moyen</span>
              <div className="kpi-card__value">
                {formatAmount(saleRows.length > 0 ? totalSalesRevenue / saleRows.length : 0)}
              </div>
              <span className="kpi-card__sub">Par vente enregistrée</span>
            </div>
            <div className="kpi-card kpi-card--purple">
              <span className="kpi-card__label">Nombre de Lignes</span>
              <div className="kpi-card__value">{saleRows.length}</div>
              <span className="kpi-card__sub">Dans le journal des ventes</span>
            </div>
          </>
        )}

        {template === "expenses" && (
          <>
            <div className="kpi-card kpi-card--orange">
              <span className="kpi-card__label">Total des Dépenses</span>
              <div className="kpi-card__value">{formatAmount(totalExpensesAmount)}</div>
              <span className="kpi-card__sub">Charges d&apos;exploitation</span>
            </div>
            <div className="kpi-card kpi-card--blue">
              <span className="kpi-card__label">Dépense Moyenne</span>
              <div className="kpi-card__value">
                {formatAmount(expenseRows.length > 0 ? totalExpensesAmount / expenseRows.length : 0)}
              </div>
              <span className="kpi-card__sub">Par poste de charge</span>
            </div>
            <div className="kpi-card kpi-card--purple">
              <span className="kpi-card__label">Postes Déclarés</span>
              <div className="kpi-card__value">{expenseRows.length}</div>
              <span className="kpi-card__sub">Lignes comptables</span>
            </div>
            <div className="kpi-card kpi-card--green">
              <span className="kpi-card__label">Statut Budget</span>
              <div className="kpi-card__value">Enregistré</div>
              <span className="kpi-card__sub">Prêt pour le rapport</span>
            </div>
          </>
        )}
      </div>

      {/* Générateur IA par invite (Prompt) */}
      <div className="card card--glass" style={{ padding: "1rem 1.25rem", marginBottom: "1.5rem" }}>
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "0.75rem" }}>
          <div style={{ flex: 1, minWidth: "280px", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <IconBot size={18} />
            <input
              type="text"
              className="field__control"
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleGenerateWithAI()}
              placeholder={
                template === "products"
                  ? "Demander à l'IA (ex: 5 articles avec prix d'achat et vente)..."
                  : template === "sales"
                    ? "Demander à l'IA (ex: 6 ventes récentes)..."
                    : "Demander à l'IA (ex: 4 dépenses mensuelles pour un commerce)..."
              }
              style={{ fontSize: "0.875rem", padding: "0.55rem 0.85rem" }}
            />
            <button
              type="button"
              onClick={() => handleGenerateWithAI()}
              disabled={aiGenerating || !aiPrompt.trim()}
              className="btn btn--primary"
              style={{ fontSize: "0.8125rem", whiteSpace: "nowrap", padding: "0.55rem 1rem" }}
            >
              {aiGenerating ? "Génération..." : "Générer avec l'IA"}
            </button>
          </div>
        </div>
      </div>

      {/* Ajustements scénarios What-If (Produits) */}
      {template === "products" && (
        <div
          className="card card--glass"
          style={{
            padding: "1rem 1.25rem",
            marginBottom: "1.5rem",
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "1rem",
          }}
        >
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "1.5rem" }}>
            <div>
              <span style={{ fontSize: "0.8125rem", fontWeight: 600, color: "var(--color-text)", display: "block", marginBottom: "0.35rem" }}>
                Variation Prix : <span style={{ color: priceAdjustmentPct >= 0 ? "var(--color-success)" : "var(--color-error)" }}>{priceAdjustmentPct > 0 ? `+${priceAdjustmentPct}%` : `${priceAdjustmentPct}%`}</span>
              </span>
              <div style={{ display: "flex", gap: "0.3rem" }}>
                {[-10, -5, 0, 5, 10, 20].map((pct) => (
                  <button
                    key={pct}
                    type="button"
                    onClick={() => setPriceAdjustmentPct(pct)}
                    className={`btn ${priceAdjustmentPct === pct ? "btn--primary" : "btn--outline"}`}
                    style={{ fontSize: "0.75rem", padding: "0.25rem 0.5rem" }}
                  >
                    {pct > 0 ? `+${pct}%` : `${pct}%`}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <span style={{ fontSize: "0.8125rem", fontWeight: 600, color: "var(--color-text)", display: "block", marginBottom: "0.35rem" }}>
                Volume Ventes : <span style={{ color: volumeAdjustmentPct >= 0 ? "var(--color-primary)" : "var(--color-error)" }}>{volumeAdjustmentPct > 0 ? `+${volumeAdjustmentPct}%` : `${volumeAdjustmentPct}%`}</span>
              </span>
              <div style={{ display: "flex", gap: "0.3rem" }}>
                {[-20, -10, 0, 10, 25, 50].map((pct) => (
                  <button
                    key={pct}
                    type="button"
                    onClick={() => setVolumeAdjustmentPct(pct)}
                    className={`btn ${volumeAdjustmentPct === pct ? "btn--secondary" : "btn--outline"}`}
                    style={{ fontSize: "0.75rem", padding: "0.25rem 0.5rem" }}
                  >
                    {pct > 0 ? `+${pct}%` : `${pct}%`}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={addProductRow}
            className="btn btn--outline"
            style={{ fontSize: "0.8125rem", padding: "0.45rem 0.85rem", display: "inline-flex", alignItems: "center", gap: "0.3rem" }}
          >
            <IconPlus size={13} /> Ajouter une ligne produit
          </button>
        </div>
      )}

      {/* Grille Interactive : 1. Catalogue Produits */}
      {template === "products" && (
        <div className="card card--glass" style={{ padding: 0, overflow: "hidden" }}>
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th style={{ width: "110px" }}>SKU</th>
                  <th>Article</th>
                  <th style={{ width: "130px" }}>Catégorie</th>
                  <th style={{ textAlign: "right", width: "110px" }}>Prix Achat</th>
                  <th style={{ textAlign: "right", width: "130px" }}>Prix Vente</th>
                  <th style={{ textAlign: "right", width: "110px" }}>Marge Unit.</th>
                  <th style={{ textAlign: "right", width: "90px" }}>Marge %</th>
                  <th style={{ textAlign: "right", width: "80px" }}>Stock</th>
                  <th style={{ textAlign: "right", width: "90px" }}>Ventes Sim.</th>
                  <th style={{ textAlign: "right", width: "120px" }}>CA Simulé</th>
                  <th style={{ textAlign: "right", width: "120px" }}>Bénéfice</th>
                  <th style={{ textAlign: "center", width: "60px" }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {computedProducts.map((r) => (
                  <tr key={r.id}>
                    <td>
                      <input
                        type="text"
                        value={r.sku}
                        onChange={(e) => updateProductCell(r.id, "sku", e.target.value)}
                        onFocus={onFocusCell}
                        onBlur={onBlurCell}
                        style={{ ...cellInputStyle, fontFamily: "monospace" }}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        placeholder="Nom du produit..."
                        value={r.name}
                        onChange={(e) => updateProductCell(r.id, "name", e.target.value)}
                        onFocus={onFocusCell}
                        onBlur={onBlurCell}
                        style={{ ...cellInputStyle, fontWeight: 600 }}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={r.category}
                        onChange={(e) => updateProductCell(r.id, "category", e.target.value)}
                        onFocus={onFocusCell}
                        onBlur={onBlurCell}
                        style={cellInputStyle}
                      />
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <input
                        type="number"
                        value={r.unit_cost || ""}
                        onChange={(e) => updateProductCell(r.id, "unit_cost", e.target.value)}
                        onFocus={onFocusCell}
                        onBlur={onBlurCell}
                        style={{ ...cellInputStyle, textAlign: "right", fontFamily: "monospace" }}
                      />
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <input
                        type="number"
                        value={r.unit_price || ""}
                        onChange={(e) => updateProductCell(r.id, "unit_price", e.target.value)}
                        onFocus={onFocusCell}
                        onBlur={onBlurCell}
                        style={{ ...cellInputStyle, textAlign: "right", fontFamily: "monospace", fontWeight: 600, color: "var(--color-primary)" }}
                      />
                    </td>
                    <td style={{ textAlign: "right", fontFamily: "monospace" }}>
                      {formatAmount(r.marginAmount)}
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <span
                        className={`badge ${r.marginPct >= 30 ? "badge--ok" : r.marginPct > 15 ? "badge--warn" : "badge--danger"
                          }`}
                      >
                        {r.marginPct.toFixed(1)}%
                      </span>
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <input
                        type="number"
                        value={r.stock_quantity || ""}
                        onChange={(e) => updateProductCell(r.id, "stock_quantity", e.target.value)}
                        onFocus={onFocusCell}
                        onBlur={onBlurCell}
                        style={{ ...cellInputStyle, textAlign: "right", fontFamily: "monospace" }}
                      />
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <input
                        type="number"
                        value={r.simulated_sales_qty || ""}
                        onChange={(e) => updateProductCell(r.id, "simulated_sales_qty", e.target.value)}
                        onFocus={onFocusCell}
                        onBlur={onBlurCell}
                        style={{ ...cellInputStyle, textAlign: "right", fontFamily: "monospace", fontWeight: 600, color: "var(--color-secondary)" }}
                      />
                    </td>
                    <td style={{ textAlign: "right", fontFamily: "monospace", fontWeight: 600 }}>
                      {formatAmount(r.rowRevenue)}
                    </td>
                    <td style={{ textAlign: "right", fontFamily: "monospace", fontWeight: 600, color: "var(--color-success)" }}>
                      {formatAmount(r.rowProfit)}
                    </td>
                    <td style={{ textAlign: "center" }}>
                      <button
                        type="button"
                        onClick={() => deleteProductRow(r.id)}
                        style={{ background: "none", border: "none", cursor: "pointer", opacity: 0.6, display: "inline-flex", alignItems: "center", justifyContent: "center" }}
                        title="Supprimer la ligne"
                      >
                        <IconTrash size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr style={{ fontWeight: 700, background: "var(--color-surface-hover, #f1f4f8)" }}>
                  <td colSpan={3} style={{ padding: "0.75rem 1rem" }}>
                    TOTAUX CATALOGUE ({computedProducts.length} références)
                  </td>
                  <td style={{ textAlign: "right", color: "var(--color-text-muted)" }}>-</td>
                  <td style={{ textAlign: "right", color: "var(--color-text-muted)" }}>-</td>
                  <td style={{ textAlign: "right", color: "var(--color-text-muted)" }}>-</td>
                  <td style={{ textAlign: "right", color: "var(--color-primary)" }}>{formatPercent(avgSimulatedMarginPct)}</td>
                  <td style={{ textAlign: "right", fontFamily: "monospace" }}>
                    {computedProducts.reduce((sum, r) => sum + r.stock_quantity, 0)}
                  </td>
                  <td style={{ textAlign: "right", fontFamily: "monospace", color: "var(--color-secondary)" }}>{totalSimulatedVolume}</td>
                  <td style={{ textAlign: "right", fontFamily: "monospace", fontSize: "0.95rem" }}>{formatAmount(totalSimulatedRevenue)}</td>
                  <td style={{ textAlign: "right", fontFamily: "monospace", fontSize: "0.95rem", color: "var(--color-success)" }}>{formatAmount(totalSimulatedProfit)}</td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}

      {/* Grille Interactive : 2. Journal des Ventes */}
      {template === "sales" && (
        <div className="card card--glass" style={{ padding: 0, overflow: "hidden" }}>
          <div
            style={{
              padding: "0.75rem 1.25rem",
              background: "var(--color-surface-hover, #f1f4f8)",
              borderBottom: "1px solid var(--color-border, #d8dee9)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <span style={{ fontSize: "0.8125rem", fontWeight: 600, color: "var(--color-text)" }}>
              Saisie et édition des ventes enregistrées
            </span>
            <button
              type="button"
              onClick={addSaleRow}
              className="btn btn--primary"
              style={{ fontSize: "0.75rem", padding: "0.35rem 0.75rem", display: "inline-flex", alignItems: "center", gap: "0.3rem" }}
            >
              <IconPlus size={13} /> Ajouter une vente
            </button>
          </div>
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th style={{ width: "130px" }}>Date</th>
                  <th style={{ width: "110px" }}>Réf / SKU</th>
                  <th>Article Vendu</th>
                  <th style={{ textAlign: "right", width: "90px" }}>Quantité</th>
                  <th style={{ textAlign: "right", width: "120px" }}>Prix Unitaire</th>
                  <th style={{ textAlign: "right", width: "130px" }}>Total Vente</th>
                  <th>Client / Destinataire</th>
                  <th style={{ textAlign: "center", width: "60px" }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {saleRows.map((s) => (
                  <tr key={s.id}>
                    <td>
                      <input
                        type="date"
                        value={s.date}
                        onChange={(e) => updateSaleCell(s.id, "date", e.target.value)}
                        onFocus={onFocusCell}
                        onBlur={onBlurCell}
                        style={cellInputStyle}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={s.sku}
                        onChange={(e) => updateSaleCell(s.id, "sku", e.target.value)}
                        onFocus={onFocusCell}
                        onBlur={onBlurCell}
                        style={{ ...cellInputStyle, fontFamily: "monospace" }}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        placeholder="Article vendu..."
                        value={s.name}
                        onChange={(e) => updateSaleCell(s.id, "name", e.target.value)}
                        onFocus={onFocusCell}
                        onBlur={onBlurCell}
                        style={{ ...cellInputStyle, fontWeight: 600 }}
                      />
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <input
                        type="number"
                        value={s.quantity || ""}
                        onChange={(e) => updateSaleCell(s.id, "quantity", e.target.value)}
                        onFocus={onFocusCell}
                        onBlur={onBlurCell}
                        style={{ ...cellInputStyle, textAlign: "right", fontFamily: "monospace", fontWeight: 600, color: "var(--color-secondary)" }}
                      />
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <input
                        type="number"
                        value={s.unit_price || ""}
                        onChange={(e) => updateSaleCell(s.id, "unit_price", e.target.value)}
                        onFocus={onFocusCell}
                        onBlur={onBlurCell}
                        style={{ ...cellInputStyle, textAlign: "right", fontFamily: "monospace", color: "var(--color-primary)" }}
                      />
                    </td>
                    <td style={{ textAlign: "right", fontFamily: "monospace", fontWeight: 700 }}>
                      {formatAmount(s.quantity * s.unit_price)}
                    </td>
                    <td>
                      <input
                        type="text"
                        value={s.customer}
                        onChange={(e) => updateSaleCell(s.id, "customer", e.target.value)}
                        onFocus={onFocusCell}
                        onBlur={onBlurCell}
                        style={cellInputStyle}
                      />
                    </td>
                    <td style={{ textAlign: "center" }}>
                      <button
                        type="button"
                        onClick={() => deleteSaleRow(s.id)}
                        style={{ background: "none", border: "none", cursor: "pointer", opacity: 0.6, display: "inline-flex", alignItems: "center", justifyContent: "center" }}
                        title="Supprimer la vente"
                      >
                        <IconTrash size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr style={{ fontWeight: 700, background: "var(--color-surface-hover, #f1f4f8)" }}>
                  <td colSpan={3} style={{ padding: "0.75rem 1rem" }}>
                    TOTAL DU JOURNAL ({saleRows.length} ventes)
                  </td>
                  <td style={{ textAlign: "right", fontFamily: "monospace", color: "var(--color-secondary)" }}>{totalSalesUnits}</td>
                  <td style={{ textAlign: "right", color: "var(--color-text-muted)" }}>-</td>
                  <td style={{ textAlign: "right", fontFamily: "monospace", fontSize: "0.95rem", color: "var(--color-success)" }}>
                    {formatAmount(totalSalesRevenue)}
                  </td>
                  <td colSpan={2}></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}

      {/* Grille Interactive : 3. Charges & Dépenses */}
      {template === "expenses" && (
        <div className="card card--glass" style={{ padding: 0, overflow: "hidden" }}>
          <div
            style={{
              padding: "0.75rem 1.25rem",
              background: "var(--color-surface-hover, #f1f4f8)",
              borderBottom: "1px solid var(--color-border, #d8dee9)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <span style={{ fontSize: "0.8125rem", fontWeight: 600, color: "var(--color-text)" }}>
              Journal des décaissements et frais généraux
            </span>
            <button
              type="button"
              onClick={addExpenseRow}
              className="btn btn--danger"
              style={{ fontSize: "0.75rem", padding: "0.35rem 0.75rem", display: "inline-flex", alignItems: "center", gap: "0.3rem" }}
            >
              <IconPlus size={13} /> Ajouter une dépense
            </button>
          </div>
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th style={{ width: "130px" }}>Date</th>
                  <th style={{ width: "180px" }}>Catégorie de Charge</th>
                  <th style={{ textAlign: "right", width: "140px" }}>Montant (FCFA)</th>
                  <th>Description / Motif</th>
                  <th style={{ textAlign: "center", width: "60px" }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {expenseRows.map((exp) => (
                  <tr key={exp.id}>
                    <td>
                      <input
                        type="date"
                        value={exp.date}
                        onChange={(e) => updateExpenseCell(exp.id, "date", e.target.value)}
                        onFocus={onFocusCell}
                        onBlur={onBlurCell}
                        style={cellInputStyle}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={exp.category}
                        onChange={(e) => updateExpenseCell(exp.id, "category", e.target.value)}
                        onFocus={onFocusCell}
                        onBlur={onBlurCell}
                        style={{ ...cellInputStyle, fontWeight: 600 }}
                      />
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <input
                        type="number"
                        value={exp.amount || ""}
                        onChange={(e) => updateExpenseCell(exp.id, "amount", e.target.value)}
                        onFocus={onFocusCell}
                        onBlur={onBlurCell}
                        style={{ ...cellInputStyle, textAlign: "right", fontFamily: "monospace", fontWeight: 700, color: "var(--color-error)" }}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        placeholder="Description du motif..."
                        value={exp.description}
                        onChange={(e) => updateExpenseCell(exp.id, "description", e.target.value)}
                        onFocus={onFocusCell}
                        onBlur={onBlurCell}
                        style={cellInputStyle}
                      />
                    </td>
                    <td style={{ textAlign: "center" }}>
                      <button
                        type="button"
                        onClick={() => deleteExpenseRow(exp.id)}
                        style={{ background: "none", border: "none", cursor: "pointer", opacity: 0.6, display: "inline-flex", alignItems: "center", justifyContent: "center" }}
                        title="Supprimer la charge"
                      >
                        <IconTrash size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr style={{ fontWeight: 700, background: "var(--color-surface-hover, #f1f4f8)" }}>
                  <td colSpan={2} style={{ padding: "0.75rem 1rem" }}>
                    TOTAL DES CHARGES ({expenseRows.length} postes)
                  </td>
                  <td style={{ textAlign: "right", fontFamily: "monospace", fontSize: "0.95rem", color: "var(--color-error)" }}>
                    {formatAmount(totalExpensesAmount)}
                  </td>
                  <td colSpan={2}></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}
    </AppPageLayout>
  );
}
