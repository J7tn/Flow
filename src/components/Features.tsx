import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Search, 
  FileText, 
  Calculator, 
  TrendingUp, 
  CheckCircle, 
  ArrowRight,
  Zap,
  Target,
  Users,
  Shield,
  BarChart3,
  Workflow,
  Settings
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useScrollToTop } from "@/lib/hooks/useScrollToTop";

export function Features() {
  // Scroll to top immediately before any rendering
  if (typeof window !== 'undefined') {
    window.scrollTo(0, 0);
  }
  
  // Scroll to top when component mounts
  useScrollToTop();

  const steps = [
    {
      icon: <Search className="h-8 w-8 text-orange-500" />,
      title: "1. Choose Your Template",
      description: "Browse our library of 30+ pre-built templates for app development, game design, content creation, and more. Each template is designed by experts for specific project types.",
      color: "border-orange-200 bg-orange-50"
    },
    {
      icon: <FileText className="h-8 w-8 text-purple-500" />,
      title: "2. Customize Your Flow",
      description: "Adapt the template to your specific needs. Add, remove, or modify steps. Set deadlines, assign roles, and define clear deliverables for each stage.",
      color: "border-purple-200 bg-purple-50"
    },
    {
      icon: <Calculator className="h-8 w-8 text-blue-500" />,
      title: "3. Calculate Costs & Resources",
      description: "Get detailed cost breakdowns including labor, tools, time, and overhead. Our AI suggests the best tools and resources for your specific project.",
      color: "border-blue-200 bg-blue-50"
    },
    {
      icon: <TrendingUp className="h-8 w-8 text-orange-600" />,
      title: "4. Optimize Your Process",
      description: "Identify bottlenecks and inefficiencies. Get AI-powered suggestions to streamline your workflow and improve team productivity.",
      color: "border-orange-200 bg-orange-50"
    },
    {
      icon: <CheckCircle className="h-8 w-8 text-purple-600" />,
      title: "5. Execute & Track Progress",
      description: "Follow your optimized flow step-by-step. Track progress, measure success metrics, and ensure everyone stays on the same page.",
      color: "border-purple-200 bg-purple-50"
    }
  ];

  const benefits = [
    {
      icon: <Zap className="h-6 w-6 text-orange-500" />,
      title: "Save Time",
      description: "Pre-built templates eliminate hours of planning and setup"
    },
    {
      icon: <Target className="h-6 w-6 text-purple-500" />,
      title: "Stay Organized",
      description: "Clear step-by-step processes keep everyone aligned"
    },
    {
      icon: <Users className="h-6 w-6 text-blue-500" />,
      title: "Team Collaboration",
      description: "Shared workflows ensure consistent execution across teams"
    },
    {
      icon: <Shield className="h-6 w-6 text-orange-600" />,
      title: "Enterprise Security",
      description: "Bank-level security with Supabase authentication"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-purple-50 to-blue-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Navigation */}
      <nav className="border-b bg-background/95 backdrop-blur-md sticky-nav shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <img 
                src="/logo.JPG" 
                alt="Flow Logo" 
                className="w-8 h-8 rounded-lg"
              />
              <span className="text-xl font-bold text-foreground">Flow</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/">
                <Button variant="ghost">Home</Button>
              </Link>
              <Link to="/signup">
                <Button className="bg-gradient-to-r from-orange-500 via-purple-600 to-blue-600 hover:from-orange-600 hover:via-purple-700 hover:to-blue-700">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl font-bold text-foreground mb-6">
                Powerful Features for Every Workflow
              </h1>
                              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Transform chaos into clarity with our simple 5-step process. 
                From template selection to execution, Flow guides you every step of the way.
              </p>
            </motion.div>
          </div>

          {/* Process Steps */}
          <div className="space-y-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className={`flex items-center gap-8 p-8 rounded-2xl border-2 ${step.color} ${
                  index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'
                }`}
              >
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 rounded-full bg-card flex items-center justify-center shadow-lg">
                    {step.icon}
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-foreground mb-3">{step.title}</h3>
                                      <p className="text-lg text-muted-foreground">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden md:block">
                    <ArrowRight className="h-8 w-8 text-gray-400" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Why Choose Flow?
            </h2>
            <p className="text-xl text-gray-600">
              Experience the benefits of streamlined process management
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full text-center hover:shadow-lg transition-shadow duration-300">
                  <CardHeader>
                    <div className="mx-auto mb-4">{benefit.icon}</div>
                    <CardTitle className="text-xl">{benefit.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">
                      {benefit.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-orange-500 via-purple-600 to-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Streamline Your Processes?
            </h2>
            <p className="text-xl text-orange-100 mb-8">
              Join thousands of teams using Flow to eliminate chaos and boost productivity.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup">
                <Button size="lg" className="bg-background text-foreground hover:bg-muted text-lg px-8 py-3">
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/templates">
                <Button size="lg" className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-foreground text-lg px-8 py-3 font-semibold">
                  View Templates
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
} 