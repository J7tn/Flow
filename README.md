# Flow - Flow Management Web Application

A modern, secure flow management web application built with React, TypeScript, and Supabase. Flow helps teams and individuals create, manage, and track complex flows with an intuitive interface and powerful analytics.

## 🚀 Features

- **🔐 Secure Authentication** - Enterprise-grade security with Supabase Auth
- **📊 Visual Flow Builder** - Drag-and-drop interface for creating flows
- **📈 Real-time Progress Tracking** - Live updates and progress visualization
- **🤖 AI-Powered Features** - ChatGPT integration for workflow suggestions, optimization, and cost analysis
- **📱 Responsive Design** - Works seamlessly across all devices
- **🔒 Data Protection** - Comprehensive security with Row Level Security
- **📋 Comprehensive Template Library** - Industry-proven flow templates with cost analysis, tool recommendations, and optimization suggestions
- **💰 Cost Calculation Engine** - Automatic cost breakdown and budget planning for any flow
- **🛠️ Tool Recommendation System** - Curated tool suggestions with pricing, features, and alternatives
- **📊 Process Optimization** - AI-powered suggestions to improve efficiency, reduce costs, and enhance quality
- **📅 Calendar Integration** - Schedule and track flow deadlines
- **👥 Team Collaboration** - Share flows and collaborate with team members

## 🛠️ Technology Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** with shadcn/ui components
- **React Router DOM** for navigation
- **React Hook Form** with Zod validation
- **Framer Motion** for animations

### Backend
- **Supabase** (PostgreSQL database)
- **Supabase Auth** with PKCE flow
- **Supabase Realtime** for live updates
- **Row Level Security** for data protection

### Development Tools
- **Vitest** + React Testing Library for testing
- **ESLint** + TypeScript for code quality
- **Prettier** for code formatting

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/flow.git
   cd flow
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```bash
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Set up AI features (Optional)**
   To enable AI-powered features, run the Chat2API setup script:
   ```bash
   chmod +x scripts/setup-chat2api.sh
   ./scripts/setup-chat2api.sh
   ```
   Or manually start the Chat2API service:
   ```bash
   docker-compose -f docker-compose.chat2api.yml up -d
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:5173`

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run test` - Run tests
- `npm run test:ui` - Run tests with UI
- `npm run test:coverage` - Run tests with coverage
- `npm run lint` - Run ESLint

## 📁 Project Structure

```
src/
├── components/
│   ├── auth/           # Authentication components
│   ├── ai/             # AI-powered components
│   ├── ui/             # Reusable UI components
│   ├── workflow/       # Flow-specific components
│   ├── templates/      # Template browser and detail components
│   ├── shared/         # Shared layout components
│   └── security/       # Security-related components
├── contexts/           # React contexts for state management
├── lib/
│   ├── hooks/          # Custom React hooks including useChat2API
│   └── ...             # Utility functions and configurations
├── data/               # Template data and configurations
├── types/              # TypeScript type definitions
└── docs/               # Documentation including Chat2API integration
```

## 🤖 AI Features

Flow includes powerful AI capabilities powered by ChatGPT through the [Chat2API](https://github.com/Niansuh/chat2api) service:

### AI Assistant Component
- **Real-time Chat Interface** - Interactive chat with AI for workflow guidance
- **Streaming Responses** - See AI responses as they're generated
- **Workflow Suggestions** - Get AI-powered workflow recommendations based on project descriptions
- **Process Optimization** - AI analysis of existing workflows to suggest improvements
- **Cost Estimation** - AI-powered cost analysis for workflow steps
- **Template Generation** - Generate custom workflow templates for different project types

### Integration Points
- **WorkflowBuilder** - AI suggestions for workflow steps
- **SmartSuggestionPanel** - AI-powered optimization recommendations
- **Cost Analysis** - AI-enhanced cost estimation
- **Template Library** - AI-generated template suggestions

### Setup
The AI features are optional and can be enabled by running:
```bash
./scripts/setup-chat2api.sh
```

For detailed documentation, see [Chat2API Integration Guide](docs/CHAT2API_INTEGRATION.md).

## 🔐 Security Features

- **Authentication**: Secure login/signup with email verification
- **Authorization**: Protected routes and role-based access
- **Data Validation**: Comprehensive input validation with Zod
- **XSS Prevention**: Content Security Policy and input sanitization
- **Rate Limiting**: API rate limiting to prevent abuse
- **Row Level Security**: Database-level access control

## 📚 Documentation

- [Design Document](./DESIGN.md) - Comprehensive design and architecture
- [Security Documentation](./SECURITY.md) - Security features and best practices
- [Cursor Rules](./.cursorrules) - Development guidelines and conventions

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [documentation](./DESIGN.md)
2. Search existing [issues](../../issues)
3. Create a new issue with detailed information

## 🚀 Deployment

The application is designed to be deployed to any static hosting service:

- **Vercel**: Connect your GitHub repository for automatic deployments
- **Netlify**: Drag and drop the `dist` folder after building
- **AWS S3**: Upload the built files to an S3 bucket
- **GitHub Pages**: Use GitHub Actions for automated deployment

Remember to set up your Supabase project and configure the environment variables in your hosting platform.
