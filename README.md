# Flow - Process Optimization Platform

<!-- Updated for Vercel deployment with environment variables -->

Flow is a comprehensive process optimization platform that helps teams streamline workflows, calculate costs, and choose the right tools for any project.

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
   
   Or use the setup script (Windows):
   ```bash
   cp setup-env.bat.template setup-env.bat
   # Edit setup-env.bat with your actual Supabase credentials
   .\setup-env.bat
   ```

4. **Set up AI features (Optional)**
   To enable AI-powered features, you need to set up the Chat2API service:
   
   **Prerequisites:**
   - Docker Desktop installed and running
   - OpenAI API key (get one from https://platform.openai.com/account/api-keys)
   
   **Setup Steps:**
   
   a. Copy the template file:
   ```bash
   cp docker-compose.chat2api.yml.template docker-compose.chat2api.yml
   ```
   
   b. Edit `docker-compose.chat2api.yml` and replace:
   - `your-openai-api-key-here` with your actual OpenAI API key
   - `your-custom-auth-key-here` with any custom authorization key you want
   
   c. Start the Chat2API service:
   ```bash
   docker-compose -f docker-compose.chat2api.yml up -d
   ```
   
   d. Test the service:
   ```bash
   cp test-chat.ps1.template test-chat.ps1
   # Edit test-chat.ps1 with your actual API keys
   .\test-chat.ps1
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