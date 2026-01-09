export function computeClientTruthHash(input: string): string {
  const normalized = input
    .normalize("NFKC")
    .replace(/\s+/g, " ")
    .trim();

  let h1 = 0x811c9dc5;
  let h2 = 0x9e3779b1;

  for (let i = 0; i < normalized.length; i++) {
    const c = normalized.charCodeAt(i);
    h1 ^= c;
    h1 = Math.imul(h1, 0x01000193);
    h2 ^= c + (h1 << 5) + (h1 >>> 2);
    h2 = Math.imul(h2, 0x85ebca6b);
  }

  const toHex = (n: number) =>
    (n >>> 0).toString(16).padStart(8, "0");

  return (
    toHex(h1) +
    toHex(h2) +
    toHex(h1 ^ h2) +
    toHex(h2 ^ (h1 >>> 1))
  );
}
