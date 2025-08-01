# Flow Chat2API Startup Script for Windows
# This script helps you start the Chat2API service

Write-Host "🚀 Flow Chat2API Startup Script" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Green

# Check if Docker is installed
try {
    $dockerVersion = docker --version 2>$null
    if ($dockerVersion) {
        Write-Host "✅ Docker is installed: $dockerVersion" -ForegroundColor Green
    } else {
        throw "Docker not found"
    }
} catch {
    Write-Host "❌ Docker is not installed or not running." -ForegroundColor Red
    Write-Host "Please install Docker Desktop for Windows first:" -ForegroundColor Yellow
    Write-Host "   https://www.docker.com/products/docker-desktop/" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "After installing Docker Desktop:" -ForegroundColor Yellow
    Write-Host "1. Start Docker Desktop" -ForegroundColor White
    Write-Host "2. Wait for Docker to be ready" -ForegroundColor White
    Write-Host "3. Run this script again" -ForegroundColor White
    Read-Host "Press Enter to exit"
    exit 1
}

# Check if Docker Compose is available
try {
    $composeVersion = docker-compose --version 2>$null
    if ($composeVersion) {
        Write-Host "✅ Docker Compose is available: $composeVersion" -ForegroundColor Green
    } else {
        throw "Docker Compose not found"
    }
} catch {
    Write-Host "❌ Docker Compose is not available." -ForegroundColor Red
    Write-Host "Please ensure Docker Desktop is properly installed." -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

# Check if docker-compose.chat2api.yml exists
if (-not (Test-Path "docker-compose.chat2api.yml")) {
    Write-Host "❌ docker-compose.chat2api.yml not found!" -ForegroundColor Red
    Write-Host "Please ensure you're running this script from the Flow project directory." -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "✅ All prerequisites are met!" -ForegroundColor Green
Write-Host ""

# Check if port 5005 is already in use
try {
    $portCheck = netstat -ano | Select-String ":5005"
    if ($portCheck) {
        Write-Host "⚠️  Port 5005 is already in use:" -ForegroundColor Yellow
        Write-Host $portCheck -ForegroundColor White
        Write-Host ""
        $continue = Read-Host "Do you want to continue anyway? (y/N)"
        if ($continue -ne "y" -and $continue -ne "Y") {
            Write-Host "Stopping startup process." -ForegroundColor Yellow
            exit 0
        }
    }
} catch {
    # Port check failed, continue anyway
}

# Start the Chat2API service
Write-Host "🐳 Starting Chat2API service..." -ForegroundColor Cyan
try {
    docker-compose -f docker-compose.chat2api.yml up -d
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Chat2API service started successfully!" -ForegroundColor Green
    } else {
        throw "Failed to start service"
    }
} catch {
    Write-Host "❌ Failed to start Chat2API service." -ForegroundColor Red
    Write-Host "Error: $_" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

# Wait a moment for the service to start
Write-Host "⏳ Waiting for service to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# Check if service is responding
Write-Host "🔍 Checking service health..." -ForegroundColor Cyan
try {
    $healthResponse = Invoke-WebRequest -Uri "http://localhost:5005/health" -TimeoutSec 10 -ErrorAction Stop
    if ($healthResponse.StatusCode -eq 200) {
        Write-Host "✅ Chat2API service is healthy and responding!" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Service responded with status: $($healthResponse.StatusCode)" -ForegroundColor Yellow
    }
} catch {
    Write-Host "⚠️  Service health check failed. The service might still be starting up." -ForegroundColor Yellow
    Write-Host "You can check the logs with: docker-compose -f docker-compose.chat2api.yml logs chat2api" -ForegroundColor White
}

Write-Host ""
Write-Host "🎉 Setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Next steps:" -ForegroundColor Cyan
Write-Host "1. Start your Flow application: npm run dev" -ForegroundColor White
Write-Host "2. Test AI features in WorkflowBuilder and SmartSuggestionPanel" -ForegroundColor White
Write-Host "3. Access Chat2API web interface: http://localhost:5005" -ForegroundColor White
Write-Host ""
Write-Host "🔧 Useful commands:" -ForegroundColor Cyan
Write-Host "   - View logs: docker-compose -f docker-compose.chat2api.yml logs chat2api" -ForegroundColor White
Write-Host "   - Stop service: docker-compose -f docker-compose.chat2api.yml down" -ForegroundColor White
Write-Host "   - Restart service: docker-compose -f docker-compose.chat2api.yml restart" -ForegroundColor White
Write-Host ""
Write-Host "🔒 Security:" -ForegroundColor Cyan
Write-Host "   - API Prefix: flow_ai_2024" -ForegroundColor White
Write-Host "   - Authorization: sk-flow-ai-key-2024" -ForegroundColor White
Write-Host ""

Read-Host "Press Enter to exit" 