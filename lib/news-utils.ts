export function cleanText(value: string | undefined): string {
  return (value ?? "")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;|&#160;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}
export function canonicalUrl(value: string | undefined): string | null {
  try {
    const u = new URL(value ?? "");
    if (!["https:", "http:"].includes(u.protocol)) return null;
    u.hash = "";
    for (const k of [...u.searchParams.keys()])
      if (/^utm_|^fbclid$|^gclid$/.test(k)) u.searchParams.delete(k);
    return u.toString();
  } catch {
    return null;
  }
}
export function validDate(value: string | undefined): string | null {
  const n = Date.parse(value ?? "");
  return Number.isFinite(n) ? new Date(n).toISOString() : null;
}
export type AnalysisTier = "description" | "headline" | "insufficient";

export function analysisTier(title: string, summary: string): AnalysisTier {
  const normalizedTitle = title.replace(/\s+-\s+[^-]+$/, "").trim();
  const additionalText = summary
    .replace(title, "")
    .replace(normalizedTitle, "")
    .replace(/\s+-\s+[^-]+$/, "")
    .trim();
  if (additionalText.length >= 30) return "description";
  if (normalizedTitle.length >= 24) return "headline";
  return "insufficient";
}

export function hasEnoughContext(title: string, summary: string): boolean {
  return analysisTier(title, summary) !== "insufficient";
}
