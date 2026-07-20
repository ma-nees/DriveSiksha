export function formatNPR(amount: number): string {
  return "NPR " + new Intl.NumberFormat("en-IN").format(Math.round(amount));
}

export function formatCompactNepali(amount: number, withSymbol = false): string {
  const prefix = withSymbol ? "NPR " : "";
  if (Math.abs(amount) >= 10000000) {
    const cr = (amount / 10000000).toFixed(2).replace(/\.00$/, "").replace(/(\.\d)0$/, "$1");
    return `${prefix}${cr} Cr`;
  }
  if (Math.abs(amount) >= 100000) {
    const lakh = (amount / 100000).toFixed(2).replace(/\.00$/, "").replace(/(\.\d)0$/, "$1");
    return `${prefix}${lakh} L`;
  }
  if (Math.abs(amount) >= 1000) {
    const k = (amount / 1000).toFixed(0);
    return `${prefix}${k}k`;
  }
  return `${prefix}${amount}`;
}

export function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

export function formatDateTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatBSDate(isoOrDate: string | Date): string {
  const d = new Date(isoOrDate);
  const adYear = d.getFullYear();
  const adMonth = d.getMonth() + 1;
  const adDay = d.getDate();

  let bsYear = adYear + 56;
  let bsMonth = adMonth + 8;
  if (bsMonth > 12) {
    bsMonth -= 12;
    bsYear += 1;
  }
  const bsDay = Math.min(adDay, 30);
  const mm = String(bsMonth).padStart(2, "0");
  const dd = String(bsDay).padStart(2, "0");
  return `${bsYear}-${mm}-${dd}`;
}

export function numberToWords(n: number): string {
  // Simple implementation for NPR receipts
  if (n === 0) return "Zero";
  const ones = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten",
    "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
  const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
  function twoDigit(num: number): string {
    if (num < 20) return ones[num];
    return tens[Math.floor(num / 10)] + (num % 10 ? " " + ones[num % 10] : "");
  }
  function threeDigit(num: number): string {
    const h = Math.floor(num / 100);
    const r = num % 100;
    return (h ? ones[h] + " Hundred" + (r ? " " : "") : "") + (r ? twoDigit(r) : "");
  }
  let result = "";
  const crore = Math.floor(n / 10000000); n %= 10000000;
  const lakh = Math.floor(n / 100000); n %= 100000;
  const thousand = Math.floor(n / 1000); n %= 1000;
  const rest = n;
  if (crore) result += twoDigit(crore) + " Crore ";
  if (lakh) result += twoDigit(lakh) + " Lakh ";
  if (thousand) result += twoDigit(thousand) + " Thousand ";
  if (rest) result += threeDigit(rest);
  return result.trim() + " Rupees Only";
}
