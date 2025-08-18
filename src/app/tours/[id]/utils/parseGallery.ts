export function parseGallery(gallery?: string | null): string[] {
    if (!gallery) return [];
    try {
        const arr = JSON.parse(gallery);
        return Array.isArray(arr) ? arr : [];
    } catch {
        return [];
    }
}