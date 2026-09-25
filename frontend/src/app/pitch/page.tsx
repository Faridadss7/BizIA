import { PitchDeck } from "@/components/presentation/PitchDeck";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "BizIA — Présentation Exécutive & Pitch Deck",
  description: "Dossier de présentation complet de BizIA pour jury d'experts et investisseurs.",
};

export default function PitchPage() {
  return <PitchDeck />;
}
