declare namespace NodeJS {
  interface ProcessEnv {
    // App
    NEXT_PUBLIC_APP_URL: string;
    NODE_ENV: 'development' | 'production' | 'test';
    
    // Security
    JWT_SECRET: string;
    WEBHOOK_SECRET: string;
    ENCRYPTION_KEY: string;
    
    // Stripe
    STRIPE_PUBLISHABLE_KEY: string;
    STRIPE_SECRET_KEY: string;
    STRIPE_WEBHOOK_SECRET: string;
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: string;
    
    // Airbnb
    AIRBNB_CLIENT_ID?: string;
    AIRBNB_CLIENT_SECRET?: string;
    AIRBNB_REDIRECT_URI: string;
    
    // WhatsApp
    WHATSAPP_API_TOKEN?: string;
    WHATSAPP_PHONE_NUMBER_ID?: string;
    WHATSAPP_WEBHOOK_VERIFY_TOKEN?: string;
    
    // Email
    SENDGRID_API_KEY?: string;
    SENDGRID_FROM_EMAIL: string;
    SENDGRID_FROM_NAME: string;
    
    // Database
    DATABASE_URL?: string;
    
    // Development
    DEBUG: string;
    RATE_LIMIT_ENABLED: string;
    RATE_LIMIT_REQUESTS_PER_MINUTE: string;
  }
}