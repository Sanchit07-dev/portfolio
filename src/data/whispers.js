// Local-only whispers wall. Swap this adapter for a network one later
// without changing the panel: keep list() and add() as the contract.

const STORAGE_KEY = 'toy_whispers_v1';
const MAX_LENGTH = 30;

const BLOCKED = [
  'fuck', 'shit', 'bitch', 'asshole', 'bastard', 'dick', 'cunt', 'nigger', 'faggot',
];

export function sanitizeWhisper(raw) {
  const text = String(raw || '').replace(/\s+/g, ' ').trim().slice(0, MAX_LENGTH);
  if (!text) return { ok: false, reason: 'Write a short note first.' };
  const lowered = text.toLowerCase();
  if (BLOCKED.some((word) => lowered.includes(word))) {
    return { ok: false, reason: 'Please keep the note friendly.' };
  }
  return { ok: true, text };
}

function readAll() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export const whispersAdapter = {
  maxLength: MAX_LENGTH,

  async list() {
    return readAll().slice(-24).reverse();
  },

  async add(raw) {
    const cleaned = sanitizeWhisper(raw);
    if (!cleaned.ok) return cleaned;
    const next = readAll().concat({
      id: `${Date.now()}`,
      text: cleaned.text,
      at: Date.now(),
    });
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next.slice(-80)));
    } catch {
      return { ok: false, reason: 'Could not save on this browser.' };
    }
    return { ok: true, text: cleaned.text };
  },
};
