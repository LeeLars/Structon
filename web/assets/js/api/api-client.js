// Simpele API client voor het CMS
const CMS_API_BASE = '/cms/api'; // pas dit pad aan indien nodig

export async function fetchJson(path) {
    const res = await fetch(`${CMS_API_BASE}${path}`);
    if (!res.ok) {
        throw new Error(`API error: ${res.status}`);
    }
    return res.json();
}
