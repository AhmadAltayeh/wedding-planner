export const COUPLE = {
  groom: "Ahmad",
  bride: "Nour",
  tagline: "Planning our wedding · Amman",
} as const;

export function displayNames(partnerOne?: string | null, partnerTwo?: string | null) {
  return {
    groom: partnerOne?.trim() || COUPLE.groom,
    bride: partnerTwo?.trim() || COUPLE.bride,
  };
}
