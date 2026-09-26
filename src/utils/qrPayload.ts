import { QRType, QRFormData } from '../types';

/**
 * Escapes characters for Wi-Fi strings according to the ZXing QR spec
 * Characters needing escape: \ , ; : "
 */
function escapeWifiString(str: string): string {
  return str.replace(/([\\;,:"\\])/g, '\\$1');
}

/**
 * Generates the standardized QR payload string for a given QR type and form data.
 */
export function generateQRPayload(type: QRType, formData: QRFormData): string {
  switch (type) {
    case 'url': {
      const raw = formData.url.url.trim();
      if (!raw) return '';
      // Ensure protocol is present for valid direct browser navigation
      if (!/^https?:\/\//i.test(raw) && !/^ftp:\/\//i.test(raw)) {
        return `https://${raw}`;
      }
      return raw;
    }

    case 'text': {
      return formData.text.text;
    }

    case 'email': {
      const { email, subject, body } = formData.email;
      const cleanEmail = email.trim();
      if (!cleanEmail) return '';
      const params: string[] = [];
      if (subject.trim()) {
        params.push(`subject=${encodeURIComponent(subject.trim())}`);
      }
      if (body.trim()) {
        params.push(`body=${encodeURIComponent(body.trim())}`);
      }
      const query = params.length > 0 ? `?${params.join('&')}` : '';
      return `mailto:${cleanEmail}${query}`;
    }

    case 'phone': {
      const phone = formData.phone.phone.trim();
      if (!phone) return '';
      // Strip spaces or parens if needed for clean tel: standard
      const cleanPhone = phone.replace(/[\s()-]/g, '');
      return `tel:${cleanPhone}`;
    }

    case 'wifi': {
      const { ssid, password, security, hidden } = formData.wifi;
      const cleanSsid = ssid.trim();
      if (!cleanSsid) return '';
      
      const parts: string[] = [];
      // Security type: WPA (WPA/WPA2), WEP, or nopass
      parts.push(`T:${security}`);
      parts.push(`S:${escapeWifiString(cleanSsid)}`);
      
      if (security !== 'nopass' && password) {
        parts.push(`P:${escapeWifiString(password)}`);
      }
      
      if (hidden) {
        parts.push('H:true');
      }
      
      return `WIFI:${parts.join(';')};;`;
    }

    default:
      return '';
  }
}

/**
 * Generates user-friendly summary title and subtitle for recent items
 */
export function getQRSummary(type: QRType, formData: QRFormData): { title: string; subtitle: string } {
  switch (type) {
    case 'url': {
      const val = formData.url.url.trim();
      return {
        title: val || 'Untitled URL',
        subtitle: 'Website Link',
      };
    }
    case 'text': {
      const text = formData.text.text.trim();
      const snippet = text.length > 32 ? `${text.slice(0, 32)}…` : text;
      return {
        title: snippet || 'Plain Text Note',
        subtitle: `${text.length} characters`,
      };
    }
    case 'email': {
      const { email, subject } = formData.email;
      return {
        title: email.trim() || 'Email Message',
        subtitle: subject.trim() ? `Subj: ${subject.trim()}` : 'Quick Email',
      };
    }
    case 'phone': {
      return {
        title: formData.phone.phone.trim() || 'Phone Call',
        subtitle: 'Direct Dial Number',
      };
    }
    case 'wifi': {
      const { ssid, security } = formData.wifi;
      return {
        title: ssid.trim() || 'Wi-Fi Network',
        subtitle: `${security === 'nopass' ? 'Open Network' : security} Security`,
      };
    }
  }
}
