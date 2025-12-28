export function buildPairText(userText: string, assistantText: string): string {
  return `${userText}\n\n---\n\n${assistantText}`
}
