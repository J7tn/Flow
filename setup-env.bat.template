@echo off
echo Setting up Chat2API environment variables...

REM Check if .env file exists
if not exist .env (
    echo Creating .env file...
    (
        echo # Supabase Configuration ^(REQUIRED^)
        echo VITE_SUPABASE_URL=your_supabase_project_url_here
        echo VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
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
    echo.
    echo ⚠️  IMPORTANT: You need to update the .env file with your actual Supabase credentials:
    echo    - Replace 'your_supabase_project_url_here' with your Supabase project URL
    echo    - Replace 'your_supabase_anon_key_here' with your Supabase anon key
    echo.
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
echo 1. Update .env file with your actual Supabase credentials
echo 2. Install Docker Desktop for Windows
echo 3. Start Docker Desktop
echo 4. Run: docker-compose -f docker-compose.chat2api.yml up -d
echo 5. Start your Flow app: npm run dev
echo.
echo For detailed instructions, see DOCKER_SETUP_GUIDE.md
pause 