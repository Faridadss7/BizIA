"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { HorizontalBarChart, type CategorySales } from "./HorizontalBarChart";
import { VerticalBarChart, type ProductSales } from "./VerticalBarChart";
import { MonthlyLineChart, type MonthlyDataPoint } from "./MonthlyLineChart";
import { CommercialDataTable, type CommercialRow } from "./CommercialDataTable";
import { formatCurrency } from "@/utils/format";
import { IconHome } from "@/components/icons/Icons";

const INITIAL_ROWS: CommercialRow[] = [];
const INITIAL_CATEGORIES: CategorySales[] = [];
const INITIAL_MONTHS: MonthlyDataPoint[] = [];
const INITIAL_PRODUCTS: ProductSales[] = [];

type Props = {
  companyName?: string;
  onOpenPdf?: () => void;
};

export function CommercialReport({ companyName = "BizIA", onOpenPdf }: Props) {
  const rows = INITIAL_ROWS;
  const categories = INITIAL_CATEGORIES;
  const months = INITIAL_MONTHS;
  const products = INITIAL_PRODUCTS;

  // KPIs
  const clientCount = 0;
  const commandCount = 0;
  const averageBasket = 0;
  const totalSales = 0;

  return (
    <div className="commercial-dashboard" id="commercial-report-print-area">
      {/* 1. Bandeau supérieur bleu signature */}
      <div className="commercial-header-banner">
        <div className="commercial-header-banner__left">
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
            {companyName && (
              <span className="commercial-header-banner__tag">
                {companyName}
              </span>
            )}
          </div>
          <h1 className="commercial-header-banner__title">
            DASHBOARD DE LA PERFORMANCE COMMERCIALE
          </h1>
        </div>

        <div className="commercial-header-banner__right">
          {onOpenPdf && (
            <button
              type="button"
              className="btn btn--white btn--sm no-print"
              onClick={onOpenPdf}
              title="Exporter le rapport PDF"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 9V2h12v7M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                <rect x="6" y="14" width="12" height="8" />
              </svg>
              <span>Exporter PDF</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. Les 4 Cartes KPI */}
      <div className="commercial-kpi-row">
        <div className="commercial-kpi-card">
          <span className="commercial-kpi-card__value">{clientCount}</span>
          <span className="commercial-kpi-card__label">Nombre de Clients</span>
        </div>

        <div className="commercial-kpi-card">
          <span className="commercial-kpi-card__value">{commandCount}</span>
          <span className="commercial-kpi-card__label">Nombre de commandes</span>
        </div>

        <div className="commercial-kpi-card">
          <span className="commercial-kpi-card__value">
            {formatCurrency(averageBasket, { showDecimals: true })}
          </span>
          <span className="commercial-kpi-card__label">Panier Moyen</span>
        </div>

        <div className="commercial-kpi-card commercial-kpi-card--primary">
          <span className="commercial-kpi-card__value">
            {formatCurrency(totalSales, { showDecimals: true })}
          </span>
          <span className="commercial-kpi-card__label">Total vente</span>
        </div>
      </div>

      {/* 3. Grille Principale des Visualisations */}
      <div className="commercial-grid">
        <div className="commercial-grid__row">
          <div className="commercial-grid__col-6">
            <HorizontalBarChart data={categories} />
          </div>
          <div className="commercial-grid__col-6">
            <CommercialDataTable rows={rows} />
          </div>
        </div>

        <div className="commercial-grid__row">
          <div className="commercial-grid__col-5">
            <MonthlyLineChart data={months} />
          </div>
          <div className="commercial-grid__col-7">
            <VerticalBarChart data={products} />
          </div>
        </div>
      </div>
    </div>
  );
}
