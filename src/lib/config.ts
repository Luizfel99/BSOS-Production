/**
 * ✨ BSOS - Bright & Shine Operating System
 * Where Cleaning Meets Intelligence
 * 
 * Serviço de Configuração de Ambiente
 * Centraliza todas as configurações da aplicação
 */

interface Config {
  // App
  appUrl: string;
  nodeEnv: string;
  
  // Database
  databaseUrl?: string;
  
  // Airbnb
  airbnb: {
    clientId?: string;
    clientSecret?: string;
    redirectUri?: string;
  };
  
  // WhatsApp
  whatsapp: {
    apiToken?: string;
    phoneNumberId?: string;
    webhookVerifyToken?: string;
  };
  
  // SendGrid
  sendgrid: {
    apiKey?: string;
    fromEmail?: string;
    fromName?: string;
  };
  
  // Twilio
  twilio: {
    accountSid?: string;
    authToken?: string;
    phoneNumber?: string;
  };
  
  // Hostaway
  hostaway: {
    apiKey?: string;
    username?: string;
    password?: string;
  };
  
  // Security
  security: {
    jwtSecret?: string;
    webhookSecret?: string;
    encryptionKey?: string;
  };
  
  // Feature flags
  features: {
    debug: boolean;
    rateLimitEnabled: boolean;
    rateLimitRequestsPerMinute: number;
  };
}

class ConfigService {
  private static instance: ConfigService;
  private config: Config;

  private constructor() {
    this.config = this.loadConfig();
  }

  public static getInstance(): ConfigService {
    if (!ConfigService.instance) {
      ConfigService.instance = new ConfigService();
    }
    return ConfigService.instance;
  }

  private loadConfig(): Config {
    return {
      // App basics
      appUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
      nodeEnv: process.env.NODE_ENV || 'development',
      
      // Database
      databaseUrl: process.env.DATABASE_URL,
      
      // Airbnb integration
      airbnb: {
        clientId: process.env.AIRBNB_CLIENT_ID,
        clientSecret: process.env.AIRBNB_CLIENT_SECRET,
        redirectUri: process.env.AIRBNB_REDIRECT_URI
      },
      
      // WhatsApp Business API
      whatsapp: {
        apiToken: process.env.WHATSAPP_API_TOKEN,
        phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID,
        webhookVerifyToken: process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN
      },
      
      // SendGrid email
      sendgrid: {
        apiKey: process.env.SENDGRID_API_KEY,
        fromEmail: process.env.SENDGRID_FROM_EMAIL,
        fromName: process.env.SENDGRID_FROM_NAME || 'Bright & Shine'
      },
      
      // Twilio SMS
      twilio: {
        accountSid: process.env.TWILIO_ACCOUNT_SID,
        authToken: process.env.TWILIO_AUTH_TOKEN,
        phoneNumber: process.env.TWILIO_PHONE_NUMBER
      },
      
      // Hostaway PMS
      hostaway: {
        apiKey: process.env.HOSTAWAY_API_KEY,
        username: process.env.HOSTAWAY_USERNAME,
        password: process.env.HOSTAWAY_PASSWORD
      },
      
      // Security
      security: {
        jwtSecret: process.env.JWT_SECRET,
        webhookSecret: process.env.WEBHOOK_SECRET,
        encryptionKey: process.env.ENCRYPTION_KEY
      },
      
      // Feature flags
      features: {
        debug: process.env.DEBUG === 'true',
        rateLimitEnabled: process.env.RATE_LIMIT_ENABLED !== 'false',
        rateLimitRequestsPerMinute: parseInt(process.env.RATE_LIMIT_REQUESTS_PER_MINUTE || '60')
      }
    };
  }

  // Getters for easy access
  get app() {
    return {
      url: this.config.appUrl,
      isProduction: this.config.nodeEnv === 'production',
      isDevelopment: this.config.nodeEnv === 'development'
    };
  }

  get database() {
    return {
      url: this.config.databaseUrl,
      isConnected: !!this.config.databaseUrl
    };
  }

  get airbnb() {
    return {
      ...this.config.airbnb,
      isConfigured: !!(this.config.airbnb.clientId && this.config.airbnb.clientSecret)
    };
  }

  get whatsapp() {
    return {
      ...this.config.whatsapp,
      isConfigured: !!(this.config.whatsapp.apiToken && this.config.whatsapp.phoneNumberId)
    };
  }

  get sendgrid() {
    return {
      ...this.config.sendgrid,
      isConfigured: !!this.config.sendgrid.apiKey
    };
  }

  get twilio() {
    return {
      ...this.config.twilio,
      isConfigured: !!(this.config.twilio.accountSid && this.config.twilio.authToken)
    };
  }

  get hostaway() {
    return {
      ...this.config.hostaway,
      isConfigured: !!this.config.hostaway.apiKey
    };
  }

  get security() {
    return this.config.security;
  }

  get features() {
    return this.config.features;
  }

  // Validation methods
  validateRequired(): { isValid: boolean; missing: string[] } {
    const missing: string[] = [];
    
    if (!this.config.security.jwtSecret) {
      missing.push('JWT_SECRET');
    }
    
    if (this.app.isProduction) {
      if (!this.config.databaseUrl) {
        missing.push('DATABASE_URL');
      }
      
      if (!this.config.security.webhookSecret) {
        missing.push('WEBHOOK_SECRET');
      }
    }
    
    return {
      isValid: missing.length === 0,
      missing
    };
  }

  // Integration status
  getIntegrationStatus() {
    return {
      airbnb: this.airbnb.isConfigured,
      whatsapp: this.whatsapp.isConfigured,
      sendgrid: this.sendgrid.isConfigured,
      twilio: this.twilio.isConfigured,
      hostaway: this.hostaway.isConfigured,
      database: this.database.isConnected
    };
  }

  // Log configuration status (without sensitive data)
  logStatus() {
    const status = this.getIntegrationStatus();
    
    console.log('🔧 Configuration Status:');
    console.log(`   Environment: ${this.config.nodeEnv}`);
    console.log(`   App URL: ${this.config.appUrl}`);
    console.log(`   Database: ${status.database ? '✅' : '❌'}`);
    console.log(`   Airbnb: ${status.airbnb ? '✅' : '❌'}`);
    console.log(`   WhatsApp: ${status.whatsapp ? '✅' : '❌'}`);
    console.log(`   SendGrid: ${status.sendgrid ? '✅' : '❌'}`);
    console.log(`   Twilio: ${status.twilio ? '✅' : '❌'}`);
    console.log(`   Hostaway: ${status.hostaway ? '✅' : '❌'}`);
    
    const validation = this.validateRequired();
    if (!validation.isValid) {
      console.log(`❌ Missing required variables: ${validation.missing.join(', ')}`);
    }
  }
}

// Export singleton instance
export const config = ConfigService.getInstance();

// Validate on import in production (Edge Runtime compatible)
if (typeof window === 'undefined' && config.app.isProduction) {
  const validation = config.validateRequired();
  if (!validation.isValid) {
    console.warn(`⚠️ Missing environment variables: ${validation.missing.join(', ')}`);
  }
}