import { QRType, QRFormData } from '../types';

export interface ValidationResult {
  isValid: boolean;
  error: string | null;
  fieldErrors?: Record<string, string>;
}

// RFC 5322 simplified email check
const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

// Standard phone format check: must have at least 6 digits/characters, allow +, -, spaces, ()
const PHONE_REGEX = /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]{5,20}$/;

export function validateQRData(type: QRType, formData: QRFormData): ValidationResult {
  const fieldErrors: Record<string, string> = {};

  switch (type) {
    case 'url': {
      const url = formData.url.url.trim();
      if (!url) {
        return {
          isValid: false,
          error: 'URL cannot be empty. Please enter a valid web address.',
          fieldErrors: { url: 'Please enter a URL (e.g., https://example.com)' },
        };
      }

      // Check URL validity
      let valid = false;
      try {
        const testUrl = /^https?:\/\//i.test(url) ? url : `https://${url}`;
        const parsed = new URL(testUrl);
        // Ensure hostname has at least one dot or is localhost
        valid = parsed.hostname.includes('.') || parsed.hostname === 'localhost';
      } catch {
        valid = false;
      }

      if (!valid) {
        return {
          isValid: false,
          error: 'Invalid URL format. Please include a valid domain (e.g. https://example.com).',
          fieldErrors: { url: 'Invalid URL format (e.g., https://example.com)' },
        };
      }

      return { isValid: true, error: null };
    }

    case 'text': {
      const text = formData.text.text;
      if (!text || !text.trim()) {
        return {
          isValid: false,
          error: 'Text field is empty. Please enter some text to generate a QR code.',
          fieldErrors: { text: 'Text cannot be empty.' },
        };
      }
      return { isValid: true, error: null };
    }

    case 'email': {
      const { email } = formData.email;
      const cleanEmail = email.trim();
      if (!cleanEmail) {
        return {
          isValid: false,
          error: 'Email address is required.',
          fieldErrors: { email: 'Please provide a valid recipient email.' },
        };
      }

      if (!EMAIL_REGEX.test(cleanEmail)) {
        return {
          isValid: false,
          error: 'Please enter a valid email address (e.g., name@domain.com).',
          fieldErrors: { email: 'Invalid email address format.' },
        };
      }

      return { isValid: true, error: null };
    }

    case 'phone': {
      const phone = formData.phone.phone.trim();
      if (!phone) {
        return {
          isValid: false,
          error: 'Phone number is required.',
          fieldErrors: { phone: 'Please enter a valid phone number.' },
        };
      }

      // Validate digits count and allowed characters
      const digitsOnly = phone.replace(/\D/g, '');
      if (digitsOnly.length < 5 || !PHONE_REGEX.test(phone)) {
        return {
          isValid: false,
          error: 'Invalid phone number format. Please include at least 5 digits.',
          fieldErrors: { phone: 'Please enter a valid phone number (e.g., +1 234 567 8900).' },
        };
      }

      return { isValid: true, error: null };
    }

    case 'wifi': {
      const { ssid, password, security } = formData.wifi;
      const cleanSsid = ssid.trim();

      if (!cleanSsid) {
        return {
          isValid: false,
          error: 'Wi-Fi Network Name (SSID) cannot be empty.',
          fieldErrors: { ssid: 'SSID / Network name is required.' },
        };
      }

      if (security !== 'nopass') {
        if (!password || password.trim().length === 0) {
          return {
            isValid: false,
            error: `Password is required when security is set to ${security}.`,
            fieldErrors: { password: `Password is required for ${security} protected networks.` },
          };
        }
        if (security === 'WPA' && password.length < 8) {
          return {
            isValid: false,
            error: 'WPA/WPA2 passphrases must be at least 8 characters long.',
            fieldErrors: { password: 'WPA/WPA2 password must be at least 8 characters.' },
          };
        }
      }

      return { isValid: true, error: null };
    }

    default:
      return { isValid: false, error: 'Unknown QR type selected.' };
  }
}
