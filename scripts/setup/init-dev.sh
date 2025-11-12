#!/bin/bash

# k8-keystone Development Environment Setup
# Purpose: One-command initialization for new developers
# Usage: ./scripts/setup/init-dev.sh

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
ORANGE='\033[0;33m'
NC='\033[0m' # No Color

echo -e "${ORANGE}🔧 Initializing k8-keystone development environment...${NC}\n"

# 1. Check Prerequisites
echo "Step 1: Checking prerequisites..."
command -v node >/dev/null 2>&1 || { echo -e "${RED}❌ Node.js not found. Install from https://nodejs.org${NC}"; exit 1; }
command -v pnpm >/dev/null 2>&1 || { echo -e "${RED}❌ pnpm not found. Run: npm install -g pnpm${NC}"; exit 1; }
command -v docker >/dev/null 2>&1 || { echo -e "${RED}❌ Docker not found. Install from https://docker.com${NC}"; exit 1; }
command -v python3 >/dev/null 2>&1 || { echo -e "${RED}❌ Python 3 not found.${NC}"; exit 1; }
echo -e "${GREEN}✓ All prerequisites met${NC}\n"

# 2. Install Node Dependencies
echo "Step 2: Installing Node.js dependencies..."
pnpm install
echo -e "${GREEN}✓ Node dependencies installed${NC}\n"

# 3. Install Python Dependencies
echo "Step 3: Installing Python dependencies..."
cd ai-core
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
deactivate
cd ..
echo -e "${GREEN}✓ Python dependencies installed${NC}\n"

# 4. Copy Environment Files
echo "Step 4: Setting up environment variables..."
if [ ! -f "server/.env" ]; then
    cp server/.env.example server/.env
    echo -e "${ORANGE}⚠️  Created server/.env - please configure${NC}"
fi
if [ ! -f "client/.env" ]; then
    cp client/.env.example client/.env
    echo -e "${ORANGE}⚠️  Created client/.env - please configure${NC}"
fi
if [ ! -f "ai-core/.env" ]; then
    cp ai-core/.env.example ai-core/.env
    echo -e "${ORANGE}⚠️  Created ai-core/.env - please configure${NC}"
fi
echo -e "${GREEN}✓ Environment files ready${NC}\n"

# 5. Generate JWT Secret
echo "Step 5: Generating JWT secret..."
node scripts/utils/generate-jwt-secret.js
echo -e "${GREEN}✓ JWT secret generated${NC}\n"

# 6. Start MongoDB (Docker)
echo "Step 6: Starting MongoDB container..."
docker-compose -f deploy/docker-compose.dev.yml up -d mongo
echo -e "${GREEN}✓ MongoDB running on localhost:27017${NC}\n"

# 7. Seed Development Data
echo "Step 7: Seeding development database..."
sleep 3  # Wait for MongoDB to be ready
node scripts/db/seed-dev-data.js
echo -e "${GREEN}✓ Database seeded${NC}\n"

echo -e "${GREEN}✅ Setup complete!${NC}\n"
echo -e "Next steps:"
echo -e "  1. Review .env files and add API keys"
echo -e "  2. Run ${ORANGE}pnpm dev${NC} to start all services"
echo -e "  3. Visit ${ORANGE}http://localhost:5173${NC} for the client"
echo -e "  4. API docs at ${ORANGE}http://localhost:3000/api/docs${NC}\n"