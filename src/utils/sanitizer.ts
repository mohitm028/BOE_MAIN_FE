interface SanitizationOptions {
  allowedTags?: string[];
  allowedAttributes?: string[];
  stripTags?: boolean;
}

class InputSanitizer {
  sanitizeHTML(input: string, options: SanitizationOptions = {}): string {
    // Basic HTML sanitization without DOMPurify for now
    // In production, install DOMPurify: npm install dompurify @types/dompurify
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
  }

  sanitizeText(input: string): string {
    if (typeof input !== 'string') return '';
    
    return input
      .replace(/[<>]/g, '') // Remove potential HTML brackets
      .replace(/javascript:/gi, '') // Remove javascript: protocols
      .replace(/on\w+=/gi, '') // Remove event handlers
      .replace(/&lt;script&gt;/gi, '') // Remove script tags
      .replace(/&lt;\/script&gt;/gi, '')
      .trim();
  }

  sanitizeJobName(input: string): string {
    if (typeof input !== 'string') return '';
    
    // Specific validation for job names
    return input
      .toUpperCase()
      .replace(/[^A-Z0-9@#$]/g, '') // Only allow specified characters
      .slice(0, 50); // Limit length
  }

  sanitizeEmail(input: string): string {
    if (typeof input !== 'string') return '';
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const cleaned = input.toLowerCase().trim();
    return emailRegex.test(cleaned) ? cleaned : '';
  }

  sanitizeAlphaNumeric(input: string): string {
    if (typeof input !== 'string') return '';
    
    return input.replace(/[^a-zA-Z0-9]/g, '');
  }

  sanitizeAlpha(input: string): string {
    if (typeof input !== 'string') return '';
    
    return input.replace(/[^a-zA-Z]/g, '');
  }

  sanitizeFormData<T extends Record<string, any>>(data: T): T {
    const sanitized = {} as T;
    
    for (const [key, value] of Object.entries(data)) {
      if (typeof value === 'string') {
        sanitized[key as keyof T] = this.sanitizeText(value) as T[keyof T];
      } else if (Array.isArray(value)) {
        sanitized[key as keyof T] = value.map(item => 
          typeof item === 'string' ? this.sanitizeText(item) : item
        ) as T[keyof T];
      } else {
        sanitized[key as keyof T] = value;
      }
    }
    
    return sanitized;
  }

  // Field-specific sanitizers for job scheduling
  sanitizeJobFormData(data: any) {
    return {
      ...data,
      jobName: this.sanitizeJobName(data.jobName || ''),
      region: this.sanitizeAlpha(data.region || ''),
      lpar: this.sanitizeAlphaNumeric(data.lpar || ''),
      uid: this.sanitizeText(data.uid || ''),
      jclLibrary: this.sanitizeText(data.jclLibrary || ''),
      distributionEmailList: this.sanitizeEmail(data.distributionEmailList || ''),
      changeRequestNumber: this.sanitizeAlphaNumeric(data.changeRequestNumber || ''),
      crqNumber: this.sanitizeAlphaNumeric(data.crqNumber || ''),
    };
  }
}

export const inputSanitizer = new InputSanitizer();
export type { SanitizationOptions };
