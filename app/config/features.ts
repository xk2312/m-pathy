// Zentrale Feature-Flags / Defaults für die Chat‑Darstellung
// Single Source of Truth für den Standard‑Renderer.

export type RendererName = 'plain' | 'markdown';

// Lese optional ENV, fallback auf 'plain' (0‑Refactor‑Sicherheit)
const envDefault = (process.env.RENDERER_DEFAULT || '').toLowerCase();
const isKnown = envDefault === 'markdown' || envDefault === 'plain';

export const defaultRenderer: RendererName = (isKnown ? (envDefault as RendererName) : 'plain');
