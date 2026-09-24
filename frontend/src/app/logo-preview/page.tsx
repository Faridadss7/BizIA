import { LogoShowcase } from "@/components/brand/LogoShowcase";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Aperçu des 3 Concepts de Logo • BizIA",
  description: "Sélection du nouveau logo officiel de BizIA",
};

export default function LogoPreviewPage() {
  return <LogoShowcase />;
}
