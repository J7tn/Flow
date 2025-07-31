import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowRight, 
  Zap, 
  TrendingUp, 
  Calculator, 
  Wrench, 
  Target,
  Users,
  Shield,
  BarChart3,
  Lightbulb
} from 'lucide-react';
import { Link } from 'react-router-dom';

export function LandingPage() {
  const features = [
    {
      icon: <Zap className="h-8 w-8 text-blue-500" />,
              title: "Flow Templates",
      description: "Access 30+ pre-built templates for app development, game design, manufacturing, and more."
    },
    {
      icon: <Calculator className="h-8 w-8 text-green-500" />,
      title: "Cost Analysis",
      description: "Calculate detailed costs including labor, tools, time, and overhead for any process."
    },
    {
      icon: <Wrench className="h-8 w-8 text-purple-500" />,
      title: "Tool Recommendations",
              description: "Get expert suggestions for the best tools and software for your specific flow."
    },
    {
      icon: <TrendingUp className="h-8 w-8 text-orange-500" />,
      title: "Process Optimization",
              description: "Identify bottlenecks and get AI-powered suggestions to streamline your flows."
    },
    {
      icon: <Target className="h-8 w-8 text-red-500" />,
      title: "Success Metrics",
      description: "Track key performance indicators and measure the success of your optimized processes."
    },
    {
      icon: <Shield className="h-8 w-8 text-indigo-500" />,
      title: "Enterprise Security",
      description: "Bank-level security with Supabase authentication and Row Level Security protection."
    }
  ];

  const stats = [
    { label: "Templates Available", value: "30+" },
    { label: "Process Categories", value: "15+" },
    { label: "Cost Categories", value: "8" },
    { label: "Security Features", value: "10+" }
  ];

           const templateCategories = [
           "App Development", "Game Design", "Content Creation", "Learning",
           "Creative Projects", "Personal Goals", "Event Planning", "Home Projects"
         ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">F</span>
              </div>
              <span className="text-xl font-bold text-gray-900">Flow</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/login">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link to="/signup">
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
                                   <Badge className="mb-6 bg-blue-100 text-blue-800 hover:bg-blue-200">
                       <Zap className="w-4 h-4 mr-2" />
                       Process Optimization Platform
                     </Badge>
              
                                   <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                       Optimize Any Process with
                       <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                         {" "}AI-Powered Templates
                       </span>
                     </h1>
       
                     <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                       From creative projects to personal goals, Flow helps you plan, calculate costs,
                       optimize flows, and choose the right tools for any process or project.
                     </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/signup">
                  <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg px-8 py-3">
                    Start Optimizing
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/templates">
                  <Button size="lg" variant="outline" className="text-lg px-8 py-3">
                    Browse Templates
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
                               <h2 className="text-4xl font-bold text-gray-900 mb-4">
                     Everything You Need to Optimize Any Process
                   </h2>
                   <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                     Comprehensive tools and templates to streamline any project or flow
                   </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                  <CardHeader>
                    <div className="mb-4">{feature.icon}</div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Template Categories */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
                               <h2 className="text-4xl font-bold text-gray-900 mb-4">
                     Templates for Every Project Type
                   </h2>
                   <p className="text-xl text-gray-600">
                     Ready-to-use templates covering creative, personal, educational, and professional projects
                   </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {templateCategories.map((category, index) => (
              <motion.div
                key={category}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Card className="text-center hover:shadow-md transition-shadow duration-300 cursor-pointer">
                  <CardContent className="pt-6">
                    <div className="text-lg font-semibold text-gray-900">{category}</div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
                               <h2 className="text-4xl font-bold text-white mb-6">
                     Ready to Optimize Your Projects?
                   </h2>
                   <p className="text-xl text-blue-100 mb-8">
                     Join thousands of creators, learners, and professionals using Flow to streamline their processes and achieve their goals.
                   </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-3">
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/templates">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600 text-lg px-8 py-3">
                  Explore Templates
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">F</span>
                </div>
                <span className="text-xl font-bold">Flow</span>
              </div>
                                   <p className="text-gray-400">
                       The ultimate process optimization platform for creators, learners, and professionals.
                     </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/templates" className="hover:text-white">Templates</Link></li>
                <li><Link to="/features" className="hover:text-white">Features</Link></li>
                <li><Link to="/pricing" className="hover:text-white">Pricing</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/about" className="hover:text-white">About</Link></li>
                <li><Link to="/contact" className="hover:text-white">Contact</Link></li>
                <li><Link to="/blog" className="hover:text-white">Blog</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/help" className="hover:text-white">Help Center</Link></li>
                <li><Link to="/docs" className="hover:text-white">Documentation</Link></li>
                <li><Link to="/status" className="hover:text-white">Status</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Flow. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
} 