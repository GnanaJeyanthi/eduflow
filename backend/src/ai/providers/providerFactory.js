import { GeminiProvider } from './geminiProvider.js';

const providers = {
  gemini: new GeminiProvider()
};

export function getProvider(name) {
  const p = providers[name];
  if (!p) throw new Error(`Unknown AI provider: ${name}`);
  return p;
}

export function getPrimaryProvider() {
  return getProvider('gemini');
}

export function getFallbackProvider() {
  return null; // No fallback provider as Gemini is the only provider
}

export function getVideoProvider() {
  return getProvider('gemini');
}

export function getEmbeddingProvider() {
  return getProvider('gemini');
}
