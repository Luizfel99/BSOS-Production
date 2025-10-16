-- =====================================================
-- 🏠 BRIGHT & SHINE - DATABASE SCHEMA
-- Criação das tabelas para produção (PostgreSQL)
-- =====================================================

-- Extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- =====================================================
-- 👥 TABELA DE USUÁRIOS
-- =====================================================
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    role VARCHAR(50) NOT NULL DEFAULT 'cleaner',
    status VARCHAR(20) NOT NULL DEFAULT 'active',
    avatar_url TEXT,
    hire_date DATE,
    avg_rating DECIMAL(3,2) DEFAULT 0.00,
    total_tasks INTEGER DEFAULT 0,
    bonus_earned DECIMAL(10,2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- 🏠 TABELA DE PROPRIEDADES
-- =====================================================
CREATE TABLE properties (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    platform VARCHAR(50) NOT NULL,
    external_id VARCHAR(255),
    address TEXT NOT NULL,
    city VARCHAR(100),
    state VARCHAR(50),
    postal_code VARCHAR(20),
    instructions TEXT,
    amenities TEXT[],
    property_type VARCHAR(50),
    bedrooms INTEGER,
    bathrooms INTEGER,
    max_guests INTEGER,
    cleaning_fee DECIMAL(10,2),
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- 🛏️ TABELA DE RESERVAS
-- =====================================================
CREATE TABLE reservations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
    external_id VARCHAR(255),
    platform VARCHAR(50) NOT NULL,
    guest_name VARCHAR(255) NOT NULL,
    guest_email VARCHAR(255),
    guest_phone VARCHAR(20),
    check_in TIMESTAMP NOT NULL,
    check_out TIMESTAMP NOT NULL,
    guests_count INTEGER DEFAULT 1,
    total_amount DECIMAL(10,2),
    cleaning_fee DECIMAL(10,2),
    status VARCHAR(50) DEFAULT 'confirmed',
    special_requests TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- ✅ TABELA DE TAREFAS
-- =====================================================
CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
    reservation_id UUID REFERENCES reservations(id) ON DELETE SET NULL,
    assigned_to UUID REFERENCES users(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(50) NOT NULL, -- 'checkout', 'checkin', 'maintenance'
    priority VARCHAR(20) DEFAULT 'medium', -- 'low', 'medium', 'high'
    status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'in_progress', 'completed', 'cancelled'
    scheduled_date TIMESTAMP NOT NULL,
    started_at TIMESTAMP,
    completed_at TIMESTAMP,
    estimated_duration INTEGER DEFAULT 120, -- em minutos
    actual_duration INTEGER,
    checklist JSONB,
    photos TEXT[],
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    feedback TEXT,
    bonus_amount DECIMAL(10,2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- 🔔 TABELA DE NOTIFICAÇÕES
-- =====================================================
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type VARCHAR(50) NOT NULL, -- 'whatsapp', 'email', 'sms', 'system'
    recipient VARCHAR(255) NOT NULL,
    subject VARCHAR(255),
    message TEXT NOT NULL,
    template_name VARCHAR(100),
    variables JSONB,
    status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'sent', 'failed'
    scheduled_for TIMESTAMP,
    sent_at TIMESTAMP,
    error_message TEXT,
    task_id UUID REFERENCES tasks(id) ON DELETE SET NULL,
    reservation_id UUID REFERENCES reservations(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- 📦 TABELA DE ESTOQUE
-- =====================================================
CREATE TABLE inventory (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    brand VARCHAR(100),
    unit VARCHAR(50) NOT NULL, -- 'pcs', 'ml', 'kg', 'box'
    current_stock INTEGER NOT NULL DEFAULT 0,
    min_stock INTEGER NOT NULL DEFAULT 0,
    max_stock INTEGER,
    unit_cost DECIMAL(10,2),
    supplier_id UUID REFERENCES suppliers(id) ON DELETE SET NULL,
    last_restocked TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- 🏪 TABELA DE FORNECEDORES
-- =====================================================
CREATE TABLE suppliers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    contact_person VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(20),
    address TEXT,
    website VARCHAR(255),
    rating DECIMAL(3,2) DEFAULT 0.00,
    payment_terms INTEGER DEFAULT 30, -- dias
    notes TEXT,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- ⭐ TABELA DE AVALIAÇÕES
-- =====================================================
CREATE TABLE evaluations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    quality_rating INTEGER CHECK (quality_rating >= 1 AND quality_rating <= 5),
    time_rating INTEGER CHECK (time_rating >= 1 AND time_rating <= 5),
    communication_rating INTEGER CHECK (communication_rating >= 1 AND communication_rating <= 5),
    feedback TEXT,
    bonus_amount DECIMAL(10,2) DEFAULT 0.00,
    bonus_paid BOOLEAN DEFAULT FALSE,
    evaluated_by VARCHAR(255), -- 'client', 'supervisor', 'system'
    created_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- 🔗 TABELA DE INTEGRAÇÕES
-- =====================================================
CREATE TABLE integrations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    platform VARCHAR(50) NOT NULL UNIQUE,
    status VARCHAR(20) DEFAULT 'disconnected', -- 'connected', 'disconnected', 'error'
    credentials JSONB, -- Armazena credenciais criptografadas
    webhook_url VARCHAR(500),
    last_sync TIMESTAMP,
    sync_frequency INTEGER DEFAULT 3600, -- em segundos
    error_message TEXT,
    config JSONB, -- Configurações específicas da plataforma
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- 📊 TABELA DE LOGS/ATIVIDADES
-- =====================================================
CREATE TABLE activity_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50), -- 'task', 'property', 'reservation', etc.
    entity_id UUID,
    old_data JSONB,
    new_data JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- 📈 VIEWS PARA RELATÓRIOS
-- =====================================================

-- View para dashboard principal
CREATE VIEW dashboard_stats AS
SELECT 
    (SELECT COUNT(*) FROM tasks WHERE DATE(scheduled_date) = CURRENT_DATE) as tasks_today,
    (SELECT COUNT(*) FROM tasks WHERE status = 'completed' AND DATE(completed_at) = CURRENT_DATE) as completed_today,
    (SELECT COUNT(*) FROM properties WHERE status = 'active') as active_properties,
    (SELECT COUNT(*) FROM reservations WHERE status = 'confirmed' AND check_in >= CURRENT_DATE) as upcoming_reservations,
    (SELECT SUM(total_amount) FROM reservations WHERE DATE(created_at) = CURRENT_DATE) as revenue_today,
    (SELECT SUM(cleaning_fee) FROM reservations WHERE EXTRACT(MONTH FROM created_at) = EXTRACT(MONTH FROM CURRENT_DATE)) as revenue_month;

-- View para performance dos funcionários
CREATE VIEW cleaner_performance AS
SELECT 
    u.id,
    u.name,
    u.email,
    COUNT(t.id) as total_tasks,
    COUNT(CASE WHEN t.status = 'completed' THEN 1 END) as completed_tasks,
    AVG(CASE WHEN t.rating IS NOT NULL THEN t.rating END) as avg_rating,
    SUM(t.bonus_amount) as total_bonus,
    AVG(t.actual_duration) as avg_duration
FROM users u
LEFT JOIN tasks t ON u.id = t.assigned_to
WHERE u.role = 'cleaner'
GROUP BY u.id, u.name, u.email;

-- View para estoque baixo
CREATE VIEW low_stock_items AS
SELECT 
    i.*,
    s.name as supplier_name,
    s.phone as supplier_phone
FROM inventory i
LEFT JOIN suppliers s ON i.supplier_id = s.id
WHERE i.current_stock <= i.min_stock
ORDER BY (i.current_stock::float / NULLIF(i.min_stock, 0)) ASC;

-- =====================================================
-- 🔍 ÍNDICES PARA PERFORMANCE
-- =====================================================

-- Índices para buscas frequentes
CREATE INDEX idx_tasks_scheduled_date ON tasks(scheduled_date);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_assigned_to ON tasks(assigned_to);
CREATE INDEX idx_tasks_property_id ON tasks(property_id);

CREATE INDEX idx_reservations_check_in ON reservations(check_in);
CREATE INDEX idx_reservations_check_out ON reservations(check_out);
CREATE INDEX idx_reservations_property_id ON reservations(property_id);
CREATE INDEX idx_reservations_platform ON reservations(platform);

CREATE INDEX idx_properties_platform ON properties(platform);
CREATE INDEX idx_properties_status ON properties(status);

CREATE INDEX idx_notifications_status ON notifications(status);
CREATE INDEX idx_notifications_scheduled_for ON notifications(scheduled_for);
CREATE INDEX idx_notifications_type ON notifications(type);

CREATE INDEX idx_inventory_category ON inventory(category);
CREATE INDEX idx_inventory_stock_level ON inventory(current_stock, min_stock);

-- Índices para busca textual
CREATE INDEX idx_properties_name_trgm ON properties USING gin(name gin_trgm_ops);
CREATE INDEX idx_users_name_trgm ON users USING gin(name gin_trgm_ops);
CREATE INDEX idx_tasks_title_trgm ON tasks USING gin(title gin_trgm_ops);

-- =====================================================
-- ⚡ TRIGGERS E FUNÇÕES
-- =====================================================

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_properties_updated_at BEFORE UPDATE ON properties FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_reservations_updated_at BEFORE UPDATE ON reservations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON tasks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_inventory_updated_at BEFORE UPDATE ON inventory FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_suppliers_updated_at BEFORE UPDATE ON suppliers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_integrations_updated_at BEFORE UPDATE ON integrations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Função para calcular bonus automaticamente
CREATE OR REPLACE FUNCTION calculate_task_bonus()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'completed' AND NEW.rating IS NOT NULL THEN
        NEW.bonus_amount = CASE 
            WHEN NEW.rating >= 5 THEN 50.00
            WHEN NEW.rating >= 4 THEN 30.00
            WHEN NEW.rating >= 3 THEN 15.00
            ELSE 0.00
        END;
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER calculate_bonus_trigger BEFORE UPDATE ON tasks FOR EACH ROW EXECUTE FUNCTION calculate_task_bonus();

-- =====================================================
-- 🔐 POLÍTICAS DE SEGURANÇA (RLS)
-- =====================================================

-- Habilitar Row Level Security
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE evaluations ENABLE ROW LEVEL SECURITY;

-- Política para funcionários verem apenas suas tarefas
CREATE POLICY cleaner_tasks_policy ON tasks
    FOR ALL TO authenticated
    USING (assigned_to = auth.uid() OR auth.role() = 'manager');

-- =====================================================
-- 📊 DADOS INICIAIS
-- =====================================================

-- Inserir usuário administrador
INSERT INTO users (name, email, role, status) VALUES 
('Administrador', 'admin@brightshine.com', 'admin', 'active');

-- Inserir fornecedores padrão
INSERT INTO suppliers (name, contact_person, email, phone) VALUES 
('Distribuidora Limpeza Total', 'João Silva', 'joao@limpezatotal.com', '+5521999999999'),
('Química & Cia', 'Maria Santos', 'maria@quimicacia.com', '+5521888888888');

-- Inserir itens de estoque básicos
INSERT INTO inventory (name, category, unit, current_stock, min_stock, unit_cost) VALUES 
('Detergente Neutro', 'Produtos de Limpeza', 'ml', 5000, 1000, 0.015),
('Papel Higiênico', 'Higiene', 'pcs', 50, 20, 2.50),
('Toalhas Descartáveis', 'Higiene', 'pcs', 30, 10, 15.00),
('Desinfetante', 'Produtos de Limpeza', 'ml', 3000, 500, 0.020),
('Sabonete Líquido', 'Higiene', 'ml', 2000, 500, 0.025);

-- =====================================================
-- ✅ VERIFICAÇÕES FINAIS
-- =====================================================

-- Verificar se todas as tabelas foram criadas
SELECT 
    table_name,
    table_type
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Verificar se todos os índices foram criados
SELECT 
    indexname,
    tablename
FROM pg_indexes 
WHERE schemaname = 'public'
ORDER BY tablename, indexname;

-- =====================================================
-- 📝 COMENTÁRIOS DAS TABELAS
-- =====================================================

COMMENT ON TABLE users IS 'Funcionários e usuários do sistema';
COMMENT ON TABLE properties IS 'Propriedades gerenciadas (Airbnb, etc.)';
COMMENT ON TABLE reservations IS 'Reservas das propriedades';
COMMENT ON TABLE tasks IS 'Tarefas de limpeza e manutenção';
COMMENT ON TABLE notifications IS 'Notificações enviadas (WhatsApp, Email, SMS)';
COMMENT ON TABLE inventory IS 'Controle de estoque de materiais';
COMMENT ON TABLE suppliers IS 'Fornecedores de materiais';
COMMENT ON TABLE evaluations IS 'Avaliações de qualidade do serviço';
COMMENT ON TABLE integrations IS 'Configurações de integrações externas';
COMMENT ON TABLE activity_logs IS 'Log de atividades do sistema';

-- =====================================================
-- 🎯 FINALIZAÇÃO
-- =====================================================

-- Confirmar que o schema foi criado com sucesso
SELECT 'Database schema created successfully!' as status;