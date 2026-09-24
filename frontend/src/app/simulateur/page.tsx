import { SpreadsheetSimulator } from "@/components/simulator/SpreadsheetSimulator";

export const metadata = {
  title: "Simulateur Excel & Rentabilité • BizIA",
  description: "Simulez vos scénarios de vente, ajustez vos marges et vos prix avec le tableur intelligent BizIA.",
};

export default function SimulateurPage() {
  return <SpreadsheetSimulator />;
}
