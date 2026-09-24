/**
 * Espaces insécables et visibles.
 *
 * `Intl` sépare les milliers avec une espace fine (U+202F) que les polices
 * rendent quasi nulle : « 1 000 » se lisait « 1000 ». L'espace insécable
 * classique reste conforme à l'usage français, se voit, et évite qu'un montant
 * se coupe en fin de colonne.
 */
function withVisibleSpaces(value: string): string {
  return value.replace(/\s/g, "\u00a0");
}

export function formatCurrency(
  value: number,
  currencyOrOptions: string | { currency?: string; showDecimals?: boolean } = "FCFA"
): string {
  const currency =
    typeof currencyOrOptions === "string"
      ? currencyOrOptions
      : currencyOrOptions?.currency || "FCFA";
  const showDecimals =
    typeof currencyOrOptions === "object" ? !!currencyOrOptions.showDecimals : false;

  const amount = new Intl.NumberFormat("fr-FR", {
    minimumFractionDigits: showDecimals ? 2 : 0,
    maximumFractionDigits: showDecimals ? 2 : 0,
  }).format(value);
  return `${withVisibleSpaces(amount)}\u00a0${currency}`;
}

export const formatAmount = formatCurrency;


export function formatPercent(value: number): string {
  return withVisibleSpaces(
    new Intl.NumberFormat("fr-FR", {
      style: "percent",
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    }).format(value / 100)
  );
}

export function formatDate(value: string | null | undefined): string {
  if (!value) return "—";
  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}
