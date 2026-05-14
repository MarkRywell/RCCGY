export function slugifyName(input: string): string {
  return input
    .trim()
    .toLowerCase()
    // replace non alphanumeric with hyphens
    .replace(/[^a-z0-9]+/g, '-')
    // trim leading/trailing hyphens
    .replace(/^-+|-+$/g, '')
    // collapse multiple hyphens
    .replace(/-{2,}/g, '-')
}

export default slugifyName
