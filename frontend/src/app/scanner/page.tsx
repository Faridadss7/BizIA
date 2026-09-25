"use client";

import { AppPageLayout } from "@/components/layout/AppPageLayout";
import { ReceiptScanner } from "@/components/scanner/ReceiptScanner";
import { useRouter } from "next/navigation";

export default function ScannerPage() {
  const router = useRouter();

  return (
    <AppPageLayout
      eyebrow="Intelligence & Vision"
      title="Scanner de Reçus & Factures"
      description="Prenez en photo une facture papier, un reçu de caisse ou un bon de livraison pour extraire et enregistrer automatiquement les articles et ventes via Gemini Vision."
    >
      <div style={{ maxWidth: 960, margin: "0 auto" }}>
        <ReceiptScanner
          standalone
          onSuccess={() => {
            // Option to redirect to products or sales
          }}
        />
      </div>
    </AppPageLayout>
  );
}
