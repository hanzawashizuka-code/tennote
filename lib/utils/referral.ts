export function generateReferralCode(): string {
  return Math.random().toString(36).substring(2, 10).toUpperCase();
}

export function isValidReferralCodeFormat(code: string): boolean {
  return /^[A-Z0-9]{6,10}$/.test(code.trim().toUpperCase());
}
