# Docker Setup Guide for Chat2API

## Prerequisites

You need to install Docker Desktop for Windows to run the Chat2API service.

### Step 1: Install Docker Desktop

1. **Download Docker Desktop for Windows:**
   - Visit: https://www.docker.com/products/docker-desktop/
   - Click "Download for Windows"
   - Choose the appropriate version (Windows 10/11 or Windows Server)

2. **Install Docker Desktop:**
   - Run the downloaded installer
   - Follow the installation wizard
   - Restart your computer when prompted

3. **Verify Installation:**
   - Open PowerShell or Command Prompt
   - Run: `docker --version`
   - Run: `docker-compose --version`

### Step 2: Configure Environment Variables

Add these lines to your `.env` file:

```env
# Chat2API Configuration
VITE_CHAT2API_URL=http://localhost:5005
VITE_CHAT2API_AUTHORIZATION=sk-flow-ai-key-2024
```

### Step 3: Start the Chat2API Service

Once Docker is installed, run these commands in your project directory:

```bash
# Start the Chat2API service
docker-compose -f docker-compose.chat2api.yml up -d

# Check if the service is running
docker-compose -f docker-compose.chat2api.yml ps

# View logs (optional)
docker-compose -f docker-compose.chat2api.yml logs chat2api
```

### Step 4: Verify the Setup

1. **Check if the service is running:**
   ```bash
   curl http://localhost:5005/health
   ```
   You should see a response indicating the service is healthy.

2. **Access the web interface:**
   - Open your browser
   - Go to: http://localhost:5005
   - You should see the Chat2API web interface

### Step 5: Test AI Integration

1. **Start your Flow application:**
   ```bash
   npm run dev
   ```

2. **Test AI features:**
   - Navigate to the WorkflowBuilder component
   - Try the AI-powered features (Generate Steps, Optimize, Cost Analysis)
   - Check the SmartSuggestionPanel for AI-generated suggestions

## Troubleshooting

### Docker Not Starting
- Make sure Docker Desktop is running
- Check Windows Hyper-V and WSL2 requirements
- Restart Docker Desktop

### Port Already in Use
If port 5005 is already in use:
```bash
# Find what's using the port
netstat -ano | findstr :5005

# Stop the process or change the port in docker-compose.chat2api.yml
```

### Service Not Responding
```bash
# Check service logs
docker-compose -f docker-compose.chat2api.yml logs chat2api

# Restart the service
docker-compose -f docker-compose.chat2api.yml restart
```

## Useful Commands

### Service Management
```bash
# Start the service
docker-compose -f docker-compose.chat2api.yml up -d

# Stop the service
docker-compose -f docker-compose.chat2api.yml down

# Restart the service
docker-compose -f docker-compose.chat2api.yml restart

# View logs
docker-compose -f docker-compose.chat2api.yml logs -f chat2api
```

### Health Checks
```bash
# Check service health
curl http://localhost:5005/health

# Check available models
curl http://localhost:5005/v1/models
```

## Configuration Details

### Docker Compose Configuration
The service runs with these settings:
- **Image**: `niansuh/chat2api:latest`
- **Port**: `5005` (mapped to localhost)
- **API Prefix**: `flow_ai_2024`
- **Authorization**: `sk-flow-ai-key-2024`

### Environment Variables
- `VITE_CHAT2API_URL`: Service URL (http://localhost:5005)
- `VITE_CHAT2API_AUTHORIZATION`: Authorization key for API access

## Security Notes

- The API prefix and authorization key provide basic security
- The service runs locally on your machine
- No data is sent to external servers (except ChatGPT)
- You can change the authorization key for additional security

## Next Steps

After setting up Docker and starting the service:

1. **Test the AI Integration:**
   - Use the AI Assistant component
   - Try workflow generation in WorkflowBuilder
   - Check SmartSuggestionPanel for AI suggestions

2. **Customize the Setup:**
   - Modify the authorization key for security
   - Adjust the API prefix if needed
   - Configure additional environment variables

3. **Production Deployment:**
   - Consider using a reverse proxy (nginx)
   - Set up SSL certificates
   - Configure proper firewall rules

## Support

If you encounter issues:
1. Check the Docker logs
2. Verify the service health endpoint
3. Ensure all environment variables are set correctly
4. Check that Docker Desktop is running

For more information about Chat2API:
- GitHub: https://github.com/Niansuh/chat2api
- Documentation: Check the project README 