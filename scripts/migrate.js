#!/usr/bin/env node
/**
 * 🏠 Bright & Shine - Migration Script
 * Script para migrar do banco simulado para PostgreSQL
 */

const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

// Configuração do banco de dados
const dbConfig = {
  connectionString: process.env.DATABASE_URL || 'postgresql://localhost:5432/brightshine',
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
};

async function runMigration() {
  const client = new Client(dbConfig);

  try {
    console.log('🔌 Conectando ao banco de dados...');
    await client.connect();
    console.log('✅ Conectado com sucesso!');

    // Ler o schema SQL
    const schemaPath = path.join(__dirname, 'database-schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');

    console.log('📊 Executando migração do schema...');
    await client.query(schemaSql);
    console.log('✅ Schema criado com sucesso!');

    // Migrar dados do banco simulado (se existir)
    await migrateSampleData(client);

    console.log('🎉 Migração concluída com sucesso!');

  } catch (error) {
    console.error('❌ Erro na migração:', error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

async function migrateSampleData(client) {
  console.log('📝 Inserindo dados de exemplo...');

  // Dados de exemplo para desenvolvimento
  const sampleData = {
    // Usuários
    users: [
      {
        name: 'Maria Silva',
        email: 'maria@brightshine.com',
        phone: '+5521999999999',
        role: 'cleaner',
        hire_date: '2024-01-01',
        avg_rating: 4.8
      },
      {
        name: 'João Santos',
        email: 'joao@brightshine.com',
        phone: '+5521888888888',
        role: 'cleaner',
        hire_date: '2024-01-01',
        avg_rating: 4.5
      },
      {
        name: 'Ana Costa',
        email: 'ana@brightshine.com',
        phone: '+5521777777777',
        role: 'supervisor',
        hire_date: '2023-12-01',
        avg_rating: 4.9
      }
    ],

    // Propriedades
    properties: [
      {
        name: 'Apartamento Centro - Copacabana',
        platform: 'airbnb',
        external_id: 'airbnb-123456',
        address: 'Rua Barata Ribeiro, 123 - Copacabana, Rio de Janeiro',
        city: 'Rio de Janeiro',
        state: 'RJ',
        postal_code: '22040-000',
        instructions: 'Chaves no cofre da portaria. Código: 1234',
        amenities: ['wifi', 'ar_condicionado', 'tv', 'cozinha'],
        property_type: 'apartment',
        bedrooms: 2,
        bathrooms: 1,
        max_guests: 4,
        cleaning_fee: 80.00
      },
      {
        name: 'Casa Inteira - Ipanema',
        platform: 'booking',
        external_id: 'booking-789012',
        address: 'Rua Visconde de Pirajá, 456 - Ipanema, Rio de Janeiro',
        city: 'Rio de Janeiro',
        state: 'RJ',
        postal_code: '22410-000',
        instructions: 'Entrada pela lateral. Cuidado com o gato Mimi.',
        amenities: ['wifi', 'ar_condicionado', 'piscina', 'churrasqueira'],
        property_type: 'house',
        bedrooms: 3,
        bathrooms: 2,
        max_guests: 6,
        cleaning_fee: 120.00
      }
    ]
  };

  // Inserir usuários
  for (const user of sampleData.users) {
    await client.query(`
      INSERT INTO users (name, email, phone, role, hire_date, avg_rating)
      VALUES ($1, $2, $3, $4, $5, $6)
      ON CONFLICT (email) DO NOTHING
    `, [user.name, user.email, user.phone, user.role, user.hire_date, user.avg_rating]);
  }

  // Inserir propriedades
  for (const property of sampleData.properties) {
    await client.query(`
      INSERT INTO properties (name, platform, external_id, address, city, state, postal_code, instructions, amenities, property_type, bedrooms, bathrooms, max_guests, cleaning_fee)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
    `, [
      property.name, property.platform, property.external_id, property.address,
      property.city, property.state, property.postal_code, property.instructions,
      property.amenities, property.property_type, property.bedrooms,
      property.bathrooms, property.max_guests, property.cleaning_fee
    ]);
  }

  console.log('✅ Dados de exemplo inseridos!');
}

// Verificar se é execução direta
if (require.main === module) {
  runMigration().catch(console.error);
}

module.exports = { runMigration };