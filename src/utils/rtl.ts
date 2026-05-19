import type { RtlMode } from '../types';

const RTL_CHAR_RE = /[\u0590-\u08FF\uFB1D-\uFDFF\uFE70-\uFEFF]/;

export function detectRtlFromText(text: string): boolean {
  return RTL_CHAR_RE.test(text);
}

export function resolveDirection(
  rtl: RtlMode | undefined,
  sampleText?: string,
): 'rtl' | 'ltr' {
  if (rtl === 'true') return 'rtl';
  if (rtl === 'false') return 'ltr';

  if (sampleText && detectRtlFromText(sampleText)) {
    return 'rtl';
  }

  const docDir = document.documentElement.getAttribute('dir');
  if (docDir === 'rtl') return 'rtl';

  return 'ltr';
}

export function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
