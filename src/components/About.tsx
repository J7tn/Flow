import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  FileText, 
  MessageSquare, 
  AlertTriangle, 
  CheckCircle, 
  ArrowRight,
  Zap,
  Target,
  Shield
} from 'lucide-react';
import { Link } from 'react-router-dom';

export function About() {
  const problems = [
    {
      icon: <FileText className="h-8 w-8 text-red-500" />,
      title: "Document Chaos",
      description: "Files scattered across Word docs, PDFs, and Discord forums with no central organization"
    },
    {
      icon: <Users className="h-8 w-8 text-orange-500" />,
      title: "Team Confusion",
      description: "Nobody knew what the process was or where to find the latest guidelines"
    },
    {
      icon: <MessageSquare className="h-8 w-8 text-yellow-500" />,
      title: "Communication Breakdown",
      description: "Important information buried in chat threads and overlapping discussions"
    },
    {
      icon: <AlertTriangle className="h-8 w-8 text-red-600" />,
      title: "Failed Guidelines",
      description: "Process guidelines were ignored or never read, leading to inconsistent results"
    }
  ];

  const solutions = [
    {
      icon: <CheckCircle className="h-8 w-8 text-green-500" />,
      title: "Centralized Workflows",
      description: "All processes in one place, clearly organized and easy to follow"
    },
    {
      icon: <Target className="h-8 w-8 text-blue-500" />,
      title: "Step-by-Step Guidance",
      description: "Clear, user-friendly format that anyone can understand and follow"
    },
    {
      icon: <Zap className="h-8 w-8 text-purple-500" />,
      title: "Smart Templates",
      description: "Pre-built workflows that eliminate guesswork and ensure consistency"
    },
    {
      icon: <Shield className="h-8 w-8 text-green-600" />,
      title: "Built-in Accountability",
      description: "Track progress and ensure everyone stays on the same page"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-purple-50 to-blue-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Navigation */}
      <nav className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
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
                About Flow
              </h1>
                              <p className="text-xl text-muted-foreground max-w-4xl mx-auto">
                Born from frustration with chaotic team processes, Flow transforms disorganized workflows 
                into clear, actionable steps that everyone can follow.
              </p>
            </motion.div>
          </div>

          {/* The Problem */}
          <div className="mb-24">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                The Problem We Solved
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                I was frustrated with a huge team that didn't have a pipeline that everyone followed. 
                People uploaded documents as Word docs, PDFs, onto Discord forums, and stuff overlapped as well. 
                Nobody knew what the process was and guidelines failed to be read or met.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8">
              {problems.map((problem, index) => (
                <motion.div
                  key={problem.title}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                >
                  <Card className="h-full border-red-200 bg-red-50">
                    <CardHeader>
                      <div className="mb-4">{problem.icon}</div>
                      <CardTitle className="text-xl text-red-900">{problem.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-base text-red-700">
                        {problem.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          {/* The Solution */}
          <div className="mb-24">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                The Flow Solution
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                I made this app so these idiots can follow a simple step-by-step process, 
                written clearly in a user-friendly format.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8">
              {solutions.map((solution, index) => (
                <motion.div
                  key={solution.title}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
                >
                  <Card className="h-full border-green-200 bg-green-50">
                    <CardHeader>
                      <div className="mb-4">{solution.icon}</div>
                      <CardTitle className="text-xl text-green-900">{solution.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-base text-green-700">
                        {solution.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Mission Statement */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="bg-card rounded-2xl p-12 text-center shadow-xl"
          >
            <h2 className="text-3xl font-bold text-foreground mb-6">
              Our Mission
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              To eliminate the chaos of disorganized team processes by providing simple, 
              clear, and actionable workflows that anyone can follow. We believe that 
              great results come from great processes, and great processes come from 
              clear communication and organized execution.
            </p>
          </motion.div>
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
              Ready to End the Chaos?
            </h2>
            <p className="text-xl text-orange-100 mb-8">
              Join thousands of teams who've transformed their disorganized processes into streamlined workflows.
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
                  Contact Us
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
} 