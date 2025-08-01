#!/bin/bash

# Flow Chat2API Setup Script
# This script helps you set up the Chat2API service for the Flow application

set -e

echo "🚀 Flow Chat2API Setup Script"
echo "=============================="

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    echo "   Visit: https://docs.docker.com/get-docker/"
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    echo "   Visit: https://docs.docker.com/compose/install/"
    exit 1
fi

echo "✅ Docker and Docker Compose are installed"

# Create .env file for Flow app if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file for Flow application..."
    cat > .env << EOF
# Supabase Configuration (REQUIRED)
VITE_SUPABASE_URL=https://xkelgvdcgtobgexigyol.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhrZWxndmRjZ3RvYmdleGlneW9sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM5MzE5NTIsImV4cCI6MjA2OTUwNzk1Mn0.g_S-3UqPxq7ONitZ6x2acuWHf1oSYrBG2-6WCsoLZ6E

# Chat2API Configuration
VITE_CHAT2API_URL=http://localhost:5005
VITE_CHAT2API_AUTHORIZATION=sk-flow-ai-key-2024

# Optional Security Settings
VITE_ENABLE_HTTPS=true
VITE_ENABLE_CSP=true
VITE_ENABLE_HSTS=true

# Optional Rate Limiting
VITE_RATE_LIMIT_MAX_REQUESTS=100
VITE_RATE_LIMIT_WINDOW_MS=900000

# Optional Base Path (for deployment)
VITE_BASE_PATH=/
EOF
    echo "✅ Created .env file"
else
    echo "✅ .env file already exists"
fi

# Check if .env contains Chat2API configuration
if ! grep -q "VITE_CHAT2API_URL" .env; then
    echo "📝 Adding Chat2API configuration to .env file..."
    echo "" >> .env
    echo "# Chat2API Configuration" >> .env
    echo "VITE_CHAT2API_URL=http://localhost:5005" >> .env
    echo "VITE_CHAT2API_AUTHORIZATION=sk-flow-ai-key-2024" >> .env
    echo "✅ Added Chat2API configuration to .env"
fi

# Start Chat2API service
echo "🐳 Starting Chat2API service..."
docker-compose -f docker-compose.chat2api.yml up -d

echo "⏳ Waiting for Chat2API service to start..."
sleep 10

# Check if service is running
if curl -s http://localhost:5005/health > /dev/null; then
    echo "✅ Chat2API service is running successfully!"
else
    echo "⚠️  Chat2API service might still be starting up..."
    echo "   You can check the status with: docker-compose -f docker-compose.chat2api.yml logs chat2api"
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Start your Flow application: npm run dev"
echo "2. The AI Assistant component will be available in your app"
echo "3. You can access the Chat2API web interface at: http://localhost:5005"
echo ""
echo "🔧 Useful commands:"
echo "   - View Chat2API logs: docker-compose -f docker-compose.chat2api.yml logs chat2api"
echo "   - Stop Chat2API: docker-compose -f docker-compose.chat2api.yml down"
echo "   - Restart Chat2API: docker-compose -f docker-compose.chat2api.yml restart"
echo ""
echo "🔒 Security notes:"
echo "   - The API_PREFIX is set to 'flow_ai_2024' for security"
echo "   - The AUTHORIZATION key is 'sk-flow-ai-key-2024'"
echo "   - You can change these in docker-compose.chat2api.yml and .env"
echo ""
echo "📚 Documentation:"
echo "   - Chat2API GitHub: https://github.com/Niansuh/chat2api"
echo "   - Flow AI Integration: Check src/lib/chat2api.ts for usage examples" 