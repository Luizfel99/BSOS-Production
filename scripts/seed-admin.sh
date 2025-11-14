#!/bin/bash
echo "🌱 Recriando usuário Admin Demo..."
npx prisma db execute --stdin <<'SQL'
INSERT INTO "User" (name, email, "passwordHash", role, active)
VALUES ('Admin Demo', 'admin@bsos.com', '$2a$10$ZpY9h5nU6iQ.mYBQQ7eC4uSG9hJ1gN7shvYcXai0r82ZtYz9Ibnne', 'admin', TRUE)
ON CONFLICT (email) DO UPDATE SET role='admin', active=TRUE;
SQL
echo "✅ Admin Demo restaurado com sucesso."
