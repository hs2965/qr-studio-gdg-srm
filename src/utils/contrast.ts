import { QRSettings, ScanReliabilityResult } from '../types';

/**
 * Parses a hex color string (#rgb, #rrggbb) into [r, g, b] (0-255)
 */
export function hexToRgb(hex: string): [number, number, number] | null {
  const cleanHex = hex.replace('#', '').trim();
  if (cleanHex.length === 3) {
    const r = parseInt(cleanHex[0] + cleanHex[0], 16);
    const g = parseInt(cleanHex[1] + cleanHex[1], 16);
    const b = parseInt(cleanHex[2] + cleanHex[2], 16);
    return [r, g, b];
  } else if (cleanHex.length === 6) {
    const r = parseInt(cleanHex.substring(0, 2), 16);
    const g = parseInt(cleanHex.substring(2, 4), 16);
    const b = parseInt(cleanHex.substring(4, 6), 16);
    return [r, g, b];
  }
  return null;
}

/**
 * Calculates relative luminance according to WCAG 2.1 specifications
 */
export function getRelativeLuminance(rgb: [number, number, number]): number {
  const [r, g, b] = rgb.map((val) => {
    const s = val / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/**
 * Computes contrast ratio between two hex colors (1:1 to 21:1)
 */
export function calculateContrastRatio(hex1: string, hex2: string): number {
  const rgb1 = hexToRgb(hex1) || [0, 0, 0];
  const rgb2 = hexToRgb(hex2) || [255, 255, 255];

  const lum1 = getRelativeLuminance(rgb1);
  const lum2 = getRelativeLuminance(rgb2);

  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);

  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Evaluates scan reliability based on colors, size, margin, and error correction
 */
export function evaluateScanReliability(settings: QRSettings, payloadLength: number = 0): ScanReliabilityResult {
  const { fgColor, bgColor, size, margin, errorCorrection } = settings;
  const ratio = calculateContrastRatio(fgColor, bgColor);
  const warnings: string[] = [];
  const tips: string[] = [];

  const fgRgb = hexToRgb(fgColor) || [0, 0, 0];
  const bgRgb = hexToRgb(bgColor) || [255, 255, 255];
  const fgLum = getRelativeLuminance(fgRgb);
  const bgLum = getRelativeLuminance(bgRgb);

  // Check 1: Inverted colors (light QR pattern on dark background)
  const isInverted = fgLum > bgLum;
  if (isInverted) {
    warnings.push('Inverted color scheme detected (light foreground on dark background). Some hardware scanners require dark modules on a light background.');
    tips.push('Swap foreground and background colors to ensure maximum scanner compatibility.');
  }

  // Check 2: Contrast Ratio
  if (ratio < 2.5) {
    warnings.push(`Extremely low contrast ratio (${ratio.toFixed(1)}:1). Most mobile cameras and laser scanners will fail to detect modules.`);
    tips.push('Use darker foreground or lighter background to exceed at least 4.5:1 contrast.');
  } else if (ratio < 4.0) {
    warnings.push(`Low color contrast (${ratio.toFixed(1)}:1) may affect QR scanning in dim lighting or with older camera sensors.`);
    tips.push('Increase contrast between foreground and background colors.');
  }

  // Check 3: Margin / Quiet Zone
  if (margin === 0) {
    warnings.push('Zero margin (no quiet zone). Scanners rely on surrounding whitespace to distinguish QR finder patterns.');
    tips.push('Set padding/margin to at least 2 or 3 for standard scannability.');
  } else if (margin === 1) {
    warnings.push('Very narrow margin. If printed or cropped, the QR code might bleed into borders.');
    tips.push('Recommended margin is 2 or more modules.');
  }

  // Check 4: Size / Resolution
  if (size < 180) {
    warnings.push(`Compact export size (${size}px). Small pixel dimensions may appear blurry when printed or scaled up.`);
    tips.push('Increase size to 240px or higher for crisp physical printing or digital displays.');
  }

  // Check 5: Dense payload with low error correction
  if (payloadLength > 200 && errorCorrection === 'L') {
    warnings.push('Dense data detected with Low error correction. Any surface dirt or optical distortion may render the code unreadable.');
    tips.push('Switch to Medium (M) or High (H) error correction for dense payloads.');
  }

  // Determine overall score
  let score: 'excellent' | 'good' | 'warning' | 'critical' = 'excellent';
  if (ratio < 2.5 || (isInverted && ratio < 3.5)) {
    score = 'critical';
  } else if (warnings.length >= 2 || ratio < 4.0 || margin === 0) {
    score = 'warning';
  } else if (warnings.length > 0) {
    score = 'good';
  }

  return {
    isReliable: warnings.length === 0,
    score,
    contrastRatio: Number(ratio.toFixed(2)),
    warnings,
    tips,
  };
}
