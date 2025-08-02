import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, ArrowRight, Star, Building2, Users, Shield, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Pricing() {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');

  const plans = [
    {
      name: "Free",
      price: "$0",
      yearlyPrice: "$0",
      period: billingPeriod === 'monthly' ? "forever" : "forever",
      description: "Perfect for individuals and personal projects",
      features: [
        "Unlimited projects",
        "Unlimited saved templates",
        "Basic cost analysis",
        "Standard support",
        "Basic tool recommendations",
        "Export to PDF"
      ],
      popular: false,
      buttonText: "Get Started Free",
      buttonVariant: "outline" as const,
      icon: <Zap className="h-6 w-6" />
    },
    {
      name: "Pro",
      price: "$9",
      yearlyPrice: "$90",
      period: billingPeriod === 'monthly' ? "per month" : "per year",
      description: "For teams that need to collaborate",
      features: [
        "Everything in Free",
        "Up to 20 team members",
        "Team collaboration features",
        "Advanced cost analysis",
        "Priority support",
        "AI-powered optimization",
        "Custom workflows",
        "Advanced analytics",
        "API access"
      ],
      popular: true,
      buttonText: "Start Pro Trial",
      buttonVariant: "default" as const,
      icon: <Users className="h-6 w-6" />
    },
    {
      name: "Enterprise",
      price: "$29",
      yearlyPrice: "$290",
      period: billingPeriod === 'monthly' ? "per month" : "per year",
      description: "For large organizations with multiple teams",
      features: [
        "Everything in Pro",
        "Unlimited team members",
        "Advanced team management",
        "Custom integrations",
        "Dedicated account manager",
        "24/7 priority support",
        "Advanced security features",
        "Custom branding",
        "SSO & advanced authentication",
        "Compliance reporting",
        "Custom training sessions",
        "SLA guarantees"
      ],
      popular: false,
      buttonText: "Contact Sales",
      buttonVariant: "default" as const,
      icon: <Building2 className="h-6 w-6" />
    }
  ];

  const getCurrentPrice = (plan: typeof plans[0]) => {
    return billingPeriod === 'monthly' ? plan.price : plan.yearlyPrice;
  };

  const getSavings = (monthlyPrice: string, yearlyPrice: string) => {
    const monthly = parseInt(monthlyPrice.replace('$', ''));
    const yearly = parseInt(yearlyPrice.replace('$', ''));
    const yearlyTotal = monthly * 12;
    const savings = yearlyTotal - yearly;
    return savings;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-purple-50 to-blue-100">
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <img 
                src="/logo.JPG" 
                alt="Flow Logo" 
                className="w-8 h-8 rounded-lg"
              />
              <span className="text-xl font-bold text-gray-900">Flow</span>
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
              <h1 className="text-5xl font-bold text-gray-900 mb-6">
                Simple, Transparent Pricing
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                Choose the plan that fits your needs. Start free and upgrade as you grow.
              </p>
              
              {/* Billing Toggle */}
              <div className="flex items-center justify-center space-x-4 mb-8">
                <span className={`text-sm font-medium ${billingPeriod === 'monthly' ? 'text-gray-900' : 'text-gray-500'}`}>
                  Monthly
                </span>
                <button
                  onClick={() => setBillingPeriod(billingPeriod === 'monthly' ? 'yearly' : 'monthly')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 ${
                    billingPeriod === 'yearly' ? 'bg-orange-500' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      billingPeriod === 'yearly' ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
                <span className={`text-sm font-medium ${billingPeriod === 'yearly' ? 'text-gray-900' : 'text-gray-500'}`}>
                  Yearly
                </span>
                {billingPeriod === 'yearly' && (
                  <Badge className="bg-green-100 text-green-800">
                    Save up to 17%
                  </Badge>
                )}
              </div>
            </motion.div>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="relative"
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-orange-500 via-purple-600 to-blue-600 text-white px-4 py-2">
                      <Star className="h-4 w-4 mr-1" />
                      Most Popular
                    </Badge>
                  </div>
                )}
                <Card className={`h-full ${plan.popular ? 'border-2 border-orange-500 shadow-xl' : 'border'}`}>
                  <CardHeader className="text-center">
                    <div className="flex items-center justify-center mb-2">
                      <div className="p-2 rounded-lg bg-gradient-to-r from-orange-500 to-purple-600 text-white">
                        {plan.icon}
                      </div>
                    </div>
                    <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                    <div className="mt-4">
                      <span className="text-4xl font-bold text-gray-900">{getCurrentPrice(plan)}</span>
                      <span className="text-gray-600 ml-2">/{plan.period}</span>
                    </div>
                    {billingPeriod === 'yearly' && plan.name !== 'Free' && (
                      <div className="mt-2">
                        <Badge variant="secondary" className="text-green-700 bg-green-100">
                          Save ${getSavings(plan.price, plan.yearlyPrice)}/year
                        </Badge>
                      </div>
                    )}
                    <CardDescription className="text-base mt-2">
                      {plan.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3 mb-8">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start">
                          <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700 text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button 
                      className={`w-full ${plan.popular ? 'bg-gradient-to-r from-orange-500 via-purple-600 to-blue-600 hover:from-orange-600 hover:via-purple-700 hover:to-blue-700' : ''}`}
                      variant={plan.buttonVariant}
                      size="lg"
                    >
                      {plan.buttonText}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
          </div>
          
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-gray-50 p-6 rounded-lg"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                What's the difference between the plans?
              </h3>
              <p className="text-gray-600">
                Free is perfect for individuals with unlimited projects. Pro adds team collaboration for up to 20 members. Enterprise is designed for large organizations with unlimited team members, advanced security, and dedicated support.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-gray-50 p-6 rounded-lg"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Is there a discount for yearly billing?
              </h3>
              <p className="text-gray-600">
                Yes! Yearly plans save you up to 17% compared to monthly billing. You can switch between monthly and yearly billing at any time.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-gray-50 p-6 rounded-lg"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                What's included in Enterprise?
              </h3>
              <p className="text-gray-600">
                Enterprise includes unlimited team members, advanced security features like SSO, custom integrations, dedicated account management, 24/7 support, compliance reporting, and custom training sessions.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-gray-50 p-6 rounded-lg"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Can I upgrade or downgrade my plan?
              </h3>
              <p className="text-gray-600">
                Yes! You can upgrade or downgrade at any time. When upgrading, you'll be charged the prorated difference. When downgrading, changes take effect at the next billing cycle.
              </p>
            </motion.div>
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
              Ready to Get Started?
            </h2>
            <p className="text-xl text-orange-100 mb-8">
              Join thousands of teams using Flow to streamline their processes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup">
                <Button size="lg" className="bg-white text-orange-600 hover:bg-gray-100 text-lg px-8 py-3">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/contact">
                <Button size="lg" className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-orange-600 text-lg px-8 py-3">
                  Contact Sales
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
} 