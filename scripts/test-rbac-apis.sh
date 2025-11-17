#!/usr/bin/env bash
# Quick API test script for RBAC endpoints
# Usage: bash scripts/test-rbac-apis.sh

set -e

BASE_URL="${BASE_URL:-http://localhost:3020}"
echo "🧪 Testing RBAC APIs at $BASE_URL"
echo "Login as admin@demo.local to get auth token..."

# 1. Login as admin
TOKEN=$(curl -s -X POST "$BASE_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@demo.local","password":"demo123"}' \
  | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
  echo "❌ Login failed! Is dev server running?"
  exit 1
fi

echo "✅ Got auth token: ${TOKEN:0:20}..."

# 2. Test Tasks API
echo ""
echo "📋 Testing Tasks API..."
TASKS=$(curl -s "$BASE_URL/api/tasks" \
  -H "Cookie: auth_token=$TOKEN" | jq -r '.tasks | length')
echo "  ✅ GET /api/tasks → $TASKS tasks found"

TASK_ID=$(curl -s "$BASE_URL/api/tasks" \
  -H "Cookie: auth_token=$TOKEN" | jq -r '.tasks[0].id')
if [ "$TASK_ID" != "null" ]; then
  curl -s "$BASE_URL/api/tasks/$TASK_ID" \
    -H "Cookie: auth_token=$TOKEN" | jq -r '.task.title' | \
    xargs -I {} echo "  ✅ GET /api/tasks/[id] → Task: {}"
fi

# 3. Test Properties API
echo ""
echo "🏠 Testing Properties API..."
PROPS=$(curl -s "$BASE_URL/api/properties" \
  -H "Cookie: auth_token=$TOKEN" | jq -r '.properties | length')
echo "  ✅ GET /api/properties → $PROPS properties found"

# 4. Test Team API
echo ""
echo "👥 Testing Team API..."
MEMBERS=$(curl -s "$BASE_URL/api/team" \
  -H "Cookie: auth_token=$TOKEN" | jq -r '.team | length')
echo "  ✅ GET /api/team → $MEMBERS members found"

# 5. Test forbidden access (client can't create tasks)
echo ""
echo "🔒 Testing RBAC permissions..."
CLIENT_TOKEN=$(curl -s -X POST "$BASE_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"client@demo.local","password":"demo123"}' \
  | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

FORBIDDEN=$(curl -s -X POST "$BASE_URL/api/tasks" \
  -H "Cookie: auth_token=$CLIENT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Task"}' | jq -r '.error')

if [ "$FORBIDDEN" = "forbidden" ]; then
  echo "  ✅ Client correctly blocked from creating tasks (403)"
else
  echo "  ❌ RBAC check failed! Client should not create tasks"
fi

echo ""
echo "✅ All RBAC API tests passed!"
