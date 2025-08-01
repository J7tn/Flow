@echo off
echo Setting up Chat2API environment variables...

REM Check if .env file exists
if not exist .env (
    echo Creating .env file...
    (
        echo # Supabase Configuration ^(REQUIRED^)
        echo VITE_SUPABASE_URL=https://xkelgvdcgtobgexigyol.supabase.co
        echo VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhrZWxndmRjZ3RvYmdleGlneW9sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM5MzE5NTIsImV4cCI6MjA2OTUwNzk1Mn0.g_S-3UqPxq7ONitZ6x2acuWHf1oSYrBG2-6WCsoLZ6E
        echo.
        echo # Chat2API Configuration
        echo VITE_CHAT2API_URL=http://localhost:5005
        echo VITE_CHAT2API_AUTHORIZATION=sk-flow-ai-key-2024
        echo.
        echo # Optional Security Settings
        echo VITE_ENABLE_HTTPS=true
        echo VITE_ENABLE_CSP=true
        echo VITE_ENABLE_HSTS=true
        echo.
        echo # Optional Rate Limiting
        echo VITE_RATE_LIMIT_MAX_REQUESTS=100
        echo VITE_RATE_LIMIT_WINDOW_MS=900000
        echo.
        echo # Optional Base Path ^(for deployment^)
        echo VITE_BASE_PATH=/
    ) > .env
    echo Created .env file successfully!
) else (
    echo .env file already exists.
    
    REM Check if Chat2API configuration is already in .env
    findstr /C:"VITE_CHAT2API_URL" .env >nul
    if errorlevel 1 (
        echo Adding Chat2API configuration to .env file...
        echo. >> .env
        echo # Chat2API Configuration >> .env
        echo VITE_CHAT2API_URL=http://localhost:5005 >> .env
        echo VITE_CHAT2API_AUTHORIZATION=sk-flow-ai-key-2024 >> .env
        echo Added Chat2API configuration to .env
    ) else (
        echo Chat2API configuration already exists in .env
    )
)

echo.
echo Environment setup complete!
echo.
echo Next steps:
echo 1. Install Docker Desktop for Windows
echo 2. Start Docker Desktop
echo 3. Run: docker-compose -f docker-compose.chat2api.yml up -d
echo 4. Start your Flow app: npm run dev
echo.
echo For detailed instructions, see DOCKER_SETUP_GUIDE.md
pause 