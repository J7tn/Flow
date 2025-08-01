# Chat2API Integration Guide

## Overview

This document describes the integration of the `chat2api` service into the Flow web application. The `chat2api` service converts the ChatGPT web interface to OpenAI API format, enabling AI features without requiring direct OpenAI API keys.

## What is Chat2API?

Chat2API is a service that acts as a bridge between your application and ChatGPT's web interface. It provides an OpenAI-compatible API endpoint that allows you to:

- Send chat completions requests
- Receive streaming responses
- Access ChatGPT's capabilities without API keys
- Use ChatGPT's web interface as a backend service

## Quick Setup

### Option 1: Automated Setup (Recommended)

1. Run the setup script:
   ```bash
   chmod +x scripts/setup-chat2api.sh
   ./scripts/setup-chat2api.sh
   ```

2. The script will:
   - Check for Docker and Docker Compose
   - Create/update `.env` file with required variables
   - Start the chat2api service
   - Perform a health check
   - Provide next steps

### Option 2: Manual Setup

1. **Start the Chat2API service:**
   ```bash
   docker-compose -f docker-compose.chat2api.yml up -d
   ```

2. **Configure environment variables:**
   Create or update your `.env` file:
   ```env
   VITE_CHAT2API_URL=http://127.0.0.1:5005
   VITE_CHAT2API_AUTHORIZATION=sk-flow-ai-key-2024
   ```

3. **Verify the service is running:**
   ```bash
   curl http://127.0.0.1:5005/health
   ```

## Features

### AI Chat Interface
- **General Chat**: Interactive chat interface with ChatGPT
- **Workflow-Specific AI**: Specialized AI functions for workflow management
- **Streaming Responses**: Real-time response streaming
- **Error Handling**: Comprehensive error handling and status display

### AI-Powered Workflow Features

#### WorkflowBuilder Integration
The `WorkflowBuilder` component now includes several AI-powered features:

1. **AI Step Generation**
   - Generate workflow steps based on project description
   - AI analyzes the workflow title and description to suggest relevant steps
   - Automatically creates structured workflow steps

2. **AI Workflow Optimization**
   - Analyze existing workflow steps for optimization opportunities
   - Suggest improvements for efficiency and effectiveness
   - Provide recommendations for parallelization and time savings

3. **AI Cost Analysis**
   - Estimate costs for workflow execution
   - Analyze resource requirements and time estimates
   - Provide cost optimization suggestions

4. **AI Template Generation**
   - Generate complete workflow templates based on project type
   - Create industry-specific workflow patterns
   - Replace or enhance existing workflow structures

#### SmartSuggestionPanel Integration
The `SmartSuggestionPanel` component has been enhanced with AI capabilities:

1. **Real-time AI Suggestions**
   - Automatically generate suggestions based on current workflow
   - Provide step recommendations, optimizations, and improvements
   - Update suggestions as the workflow evolves

2. **Custom AI Prompts**
   - Allow users to input custom prompts for specific suggestions
   - Generate targeted recommendations based on user needs
   - Support for specialized workflow requirements

3. **AI-Generated Content**
   - Mark AI-generated suggestions with visual indicators
   - Distinguish between manual and AI-generated content
   - Provide context for AI suggestions

4. **Intelligent Parsing**
   - Parse AI responses into structured suggestion items
   - Categorize suggestions by type (steps, optimizations, improvements)
   - Apply appropriate metadata and impact assessments

### React Hook Usage

The integration provides a custom React hook `useChat2API` that simplifies AI interactions:

```typescript
import { useChat2API } from '@/lib/hooks/useChat2API';

function MyComponent() {
  const {
    isLoading,
    error,
    generateWorkflowSuggestions,
    optimizeWorkflow,
    estimateWorkflowCosts,
    generateTemplateSuggestions,
    healthCheck,
  } = useChat2API();

  const handleGenerateSteps = async () => {
    try {
      const suggestions = await generateWorkflowSuggestions("Project description");
      console.log('AI suggestions:', suggestions);
    } catch (error) {
      console.error('Failed to generate suggestions:', error);
    }
  };

  return (
    <div>
      <button onClick={handleGenerateSteps} disabled={isLoading}>
        Generate AI Suggestions
      </button>
      {error && <p>Error: {error}</p>}
    </div>
  );
}
```

## Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_CHAT2API_URL` | Chat2API service URL | `http://127.0.0.1:5005` |
| `VITE_CHAT2API_AUTHORIZATION` | Authorization key | `sk-flow-ai-key-2024` |

### Docker Configuration

The `docker-compose.chat2api.yml` file configures:

- **Service**: `chat2api` using `niansuh/chat2api:latest`
- **Port**: `5005` (mapped to host)
- **Environment Variables**:
  - `API_PREFIX`: API endpoint prefix
  - `AUTHORIZATION`: Authorization key for API access

## Security

### Authorization
- All API requests require the configured authorization key
- The key is included in request headers
- Unauthorized requests are rejected

### User Authentication
- AI features require user authentication
- User ID is validated before processing requests
- Prevents unauthorized access to AI services

### Error Handling
- Comprehensive error handling for network issues
- Graceful degradation when AI service is unavailable
- User-friendly error messages

## Troubleshooting

### Common Issues

1. **Service Not Available**
   ```bash
   # Check if the service is running
   docker ps | grep chat2api
   
   # Check service logs
   docker-compose -f docker-compose.chat2api.yml logs
   ```

2. **Connection Refused**
   - Verify the service is running on port 5005
   - Check firewall settings
   - Ensure Docker is running

3. **Authorization Errors**
   - Verify the authorization key in `.env`
   - Check that the key matches the Docker service configuration

4. **AI Features Not Working**
   - Run the AI integration test component
   - Check browser console for errors
   - Verify user authentication

### Health Check

Use the provided test component to verify AI integration:

```typescript
import AIIntegrationTest from '@/components/ai/AIIntegrationTest';

// Add to your component
<AIIntegrationTest />
```

## Advanced Usage

### Custom AI Prompts

You can create custom AI prompts for specific use cases:

```typescript
const customPrompt = `
Create a workflow for a software development project with the following requirements:
- Agile methodology
- 3-week sprints
- Code review process
- Automated testing
`;

const suggestions = await generateWorkflowSuggestions(customPrompt);
```

### Streaming Responses

For real-time responses, use the streaming functionality:

```typescript
const { sendStreamingMessage } = useChat2API();

await sendStreamingMessage(
  "Generate a detailed project timeline",
  (chunk) => {
    // Handle each chunk of the response
    console.log('Received chunk:', chunk);
  }
);
```

### Error Recovery

Implement error recovery strategies:

```typescript
const handleAIRequest = async () => {
  try {
    const result = await generateWorkflowSuggestions(prompt);
    return result;
  } catch (error) {
    if (error.message.includes('Authentication required')) {
      // Handle authentication error
      redirectToLogin();
    } else if (error.message.includes('service is not available')) {
      // Handle service unavailability
      showFallbackUI();
    } else {
      // Handle other errors
      showErrorMessage(error.message);
    }
  }
};
```

## Integration with Existing Components

### WorkflowBuilder Enhancements

The `WorkflowBuilder` component now includes:

- **AI Features Bar**: Quick access to AI functions
- **AI Template Generation**: Generate templates from workflow titles
- **AI Step Generation**: Add AI-generated steps to workflows
- **Cost Analysis Display**: Show AI-generated cost estimates
- **Error Handling**: Display AI-related errors and status

### SmartSuggestionPanel Enhancements

The `SmartSuggestionPanel` component now includes:

- **AI Service Status**: Real-time service availability
- **Custom Prompt Interface**: User-defined AI prompts
- **Auto-generation**: Automatic suggestions based on workflow changes
- **AI Content Indicators**: Visual markers for AI-generated content
- **Regeneration Controls**: Manual refresh of AI suggestions

## Performance Considerations

### Debouncing
- AI suggestions are debounced to prevent excessive API calls
- 2-second delay before auto-generating suggestions
- Manual regeneration available for immediate updates

### Caching
- Consider implementing response caching for common requests
- Cache template suggestions for similar project types
- Store optimization results for reuse

### Rate Limiting
- Implement rate limiting for AI requests
- Queue requests during high load
- Provide user feedback for request status

## Future Enhancements

### Planned Features
- **AI Workflow Templates**: Pre-built AI-generated templates
- **Smart Dependencies**: AI-suggested step dependencies
- **Resource Optimization**: AI recommendations for resource allocation
- **Progress Prediction**: AI-powered timeline predictions
- **Collaboration Suggestions**: AI recommendations for team coordination

### Integration Opportunities
- **Calendar Integration**: AI-suggested scheduling
- **Resource Management**: AI-optimized resource allocation
- **Risk Assessment**: AI-powered risk analysis
- **Quality Assurance**: AI-suggested quality checkpoints

## Support

For issues related to the Chat2API integration:

1. Check the troubleshooting section above
2. Review the service logs
3. Test with the AI integration test component
4. Verify environment configuration
5. Check user authentication status

## Contributing

When contributing to the AI integration:

1. Follow the existing code patterns
2. Add appropriate error handling
3. Include TypeScript types
4. Update documentation
5. Add tests for new features 