export function generateSocialId(name: string): string {
  // Convert to lowercase and remove special characters
  const normalized = name.toLowerCase()
    // Replace accented characters
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    // Replace spaces and special chars with dash
    .replace(/[^a-z0-9]+/g, '-')
    // Remove leading/trailing dashes
    .replace(/^-+|-+$/g, '')
    // Truncate to max 20 chars
    .slice(0, 20);

  // Generate random 4-digit number
  const randomNum = Math.floor(1000 + Math.random() * 9000);

  return `#${normalized}${randomNum}`;
}