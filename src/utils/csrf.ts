class CSRFProtection {
  private token: string | null = null;

  async initialize(): Promise<void> {
    try {
      // In development, generate a mock token
      if (process.env.NODE_ENV === 'development') {
        this.token = this.generateMockToken();
        this.updateMetaTag(this.token);
        return;
      }

      // In production, fetch from server
      const response = await fetch('/api/csrf-token');
      const { csrfToken } = await response.json();
      this.token = csrfToken;
      
      // Add to meta tag for form submissions
      this.updateMetaTag(csrfToken);
    } catch (error) {
      console.error('Failed to initialize CSRF protection:', error);
      // Fallback to mock token
      this.token = this.generateMockToken();
      this.updateMetaTag(this.token);
    }
  }

  getToken(): string | null {
    return this.token || document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
  }

  private generateMockToken(): string {
    // Generate a mock CSRF token for development
    return btoa(`csrf_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
  }

  private updateMetaTag(token: string): void {
    let metaTag = document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement;
    if (!metaTag) {
      metaTag = document.createElement('meta');
      metaTag.name = 'csrf-token';
      document.head.appendChild(metaTag);
    }
    metaTag.content = token;
  }

  // Add CSRF token to fetch requests
  enhanceFetchHeaders(headers: HeadersInit = {}): HeadersInit {
    const token = this.getToken();
    if (token) {
      return {
        ...headers,
        'X-CSRF-Token': token,
      };
    }
    return headers;
  }

  // Create a fetch wrapper with CSRF protection
  protectedFetch(url: string, options: RequestInit = {}): Promise<Response> {
    const enhancedOptions = {
      ...options,
      headers: this.enhanceFetchHeaders(options.headers),
    };

    return fetch(url, enhancedOptions);
  }

  // Validate CSRF token (client-side basic check)
  validateToken(token: string): boolean {
    if (!token) return false;
    
    try {
      // Basic validation - in production, this should be done server-side
      const decoded = atob(token);
      return decoded.startsWith('csrf_') && decoded.length > 10;
    } catch {
      return false;
    }
  }
}

export const csrfProtection = new CSRFProtection();

// Initialize CSRF protection when module loads
csrfProtection.initialize();
