import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Check, Star, Zap, Users, Shield, ArrowLeft } from "lucide-react";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Separator } from "./ui/separator";

const Subscription = () => {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">(
    "monthly",
  );

  const plans = [
    {
      id: "free",
      name: "Personal",
      description: "Perfect for individuals getting started",
      price: { monthly: 0, yearly: 0 },
      popular: false,
      features: [
        "Up to 5 workflows",
        "Basic templates",
        "Personal workspace",
        "Mobile app access",
        "Email support",
        "1GB file storage",
      ],
      limitations: [
        "Limited AI suggestions",
        "Basic analytics",
        "No team collaboration",
      ],
    },
    {
      id: "plus",
      name: "Plus",
      description: "For power users who need more",
      price: { monthly: 8, yearly: 80 },
      popular: true,
      features: [
        "Unlimited workflows",
        "Advanced templates",
        "AI-powered suggestions",
        "Advanced analytics",
        "Priority support",
        "10GB file storage",
        "Calendar integration",
        "Custom workflow templates",
        "Export capabilities",
      ],
      limitations: [],
    },
    {
      id: "business",
      name: "Business",
      description: "For teams and organizations",
      price: { monthly: 15, yearly: 150 },
      popular: false,
      features: [
        "Everything in Plus",
        "Team collaboration",
        "Admin dashboard",
        "Advanced permissions",
        "SSO integration",
        "100GB shared storage",
        "Advanced security",
        "Custom branding",
        "API access",
        "Dedicated support",
      ],
      limitations: [],
    },
  ];

  const getPrice = (plan: (typeof plans)[0]) => {
    if (plan.price.monthly === 0) return "Free";
    const price =
      billingCycle === "monthly" ? plan.price.monthly : plan.price.yearly;
    const period = billingCycle === "monthly" ? "month" : "year";
    return `$${price}/${period}`;
  };

  const getSavings = (plan: (typeof plans)[0]) => {
    if (plan.price.monthly === 0) return null;
    const monthlyTotal = plan.price.monthly * 12;
    const savings = monthlyTotal - plan.price.yearly;
    return savings > 0 ? `Save $${savings}` : null;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/" className="flex items-center space-x-2">
                <ArrowLeft className="h-4 w-4" />
                <span className="text-sm text-muted-foreground">
                  Back to Flow
                </span>
              </Link>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold">F</span>
              </div>
              <h1 className="text-xl font-bold">Flow</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            Choose the perfect plan for your workflow
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Transform your productivity with Flow's intelligent workflow
            management. Start free and upgrade as you grow.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center mb-8">
            <Tabs
              value={billingCycle}
              onValueChange={(value) =>
                setBillingCycle(value as "monthly" | "yearly")
              }
            >
              <TabsList className="grid w-full grid-cols-2 max-w-xs">
                <TabsTrigger value="monthly">Monthly</TabsTrigger>
                <TabsTrigger value="yearly" className="relative">
                  Yearly
                  <Badge className="ml-2 text-xs" variant="secondary">
                    Save 17%
                  </Badge>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              className={`relative ${plan.popular ? "border-primary shadow-lg scale-105" : ""}`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground px-3 py-1">
                    <Star className="w-3 h-3 mr-1" />
                    Most Popular
                  </Badge>
                </div>
              )}

              <CardHeader className="text-center pb-4">
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <CardDescription className="text-base">
                  {plan.description}
                </CardDescription>
                <div className="mt-4">
                  <div className="text-4xl font-bold">{getPrice(plan)}</div>
                  {billingCycle === "yearly" && getSavings(plan) && (
                    <div className="text-sm text-green-600 font-medium mt-1">
                      {getSavings(plan)}
                    </div>
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <Button
                  className={`w-full ${plan.popular ? "" : "variant-outline"}`}
                  variant={plan.popular ? "default" : "outline"}
                >
                  {plan.id === "free" ? "Get Started" : "Start Free Trial"}
                </Button>

                <div className="space-y-3">
                  <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                    What's included
                  </h4>
                  <ul className="space-y-2">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {plan.limitations.length > 0 && (
                    <>
                      <Separator className="my-4" />
                      <ul className="space-y-2">
                        {plan.limitations.map((limitation, index) => (
                          <li
                            key={index}
                            className="flex items-start space-x-2"
                          >
                            <div className="h-4 w-4 mt-0.5 flex-shrink-0 text-muted-foreground">
                              •
                            </div>
                            <span className="text-sm text-muted-foreground">
                              {limitation}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Feature Comparison */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-center mb-8">
            Compare all features
          </h2>
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-4 font-medium">Features</th>
                      <th className="text-center p-4 font-medium">Personal</th>
                      <th className="text-center p-4 font-medium">Plus</th>
                      <th className="text-center p-4 font-medium">Business</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      {
                        feature: "Workflows",
                        personal: "5",
                        plus: "Unlimited",
                        business: "Unlimited",
                      },
                      {
                        feature: "AI Suggestions",
                        personal: "Basic",
                        plus: "Advanced",
                        business: "Advanced",
                      },
                      {
                        feature: "Templates",
                        personal: "Basic",
                        plus: "Advanced",
                        business: "Advanced + Custom",
                      },
                      {
                        feature: "File Storage",
                        personal: "1GB",
                        plus: "10GB",
                        business: "100GB",
                      },
                      {
                        feature: "Team Collaboration",
                        personal: "❌",
                        plus: "❌",
                        business: "✅",
                      },
                      {
                        feature: "Analytics",
                        personal: "Basic",
                        plus: "Advanced",
                        business: "Advanced",
                      },
                      {
                        feature: "API Access",
                        personal: "❌",
                        plus: "❌",
                        business: "✅",
                      },
                      {
                        feature: "SSO Integration",
                        personal: "❌",
                        plus: "❌",
                        business: "✅",
                      },
                      {
                        feature: "Priority Support",
                        personal: "❌",
                        plus: "✅",
                        business: "✅",
                      },
                    ].map((row, index) => (
                      <tr key={index} className="border-b last:border-b-0">
                        <td className="p-4 font-medium">{row.feature}</td>
                        <td className="p-4 text-center text-sm">
                          {row.personal}
                        </td>
                        <td className="p-4 text-center text-sm">{row.plus}</td>
                        <td className="p-4 text-center text-sm">
                          {row.business}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* FAQ Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-center mb-8">
            Frequently asked questions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[
              {
                question: "Can I change plans anytime?",
                answer:
                  "Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.",
              },
              {
                question: "Is there a free trial?",
                answer:
                  "Yes, all paid plans come with a 14-day free trial. No credit card required to start.",
              },
              {
                question: "What payment methods do you accept?",
                answer:
                  "We accept all major credit cards, PayPal, and bank transfers for annual plans.",
              },
              {
                question: "Can I cancel anytime?",
                answer:
                  "Absolutely. You can cancel your subscription at any time with no cancellation fees.",
              },
            ].map((faq, index) => (
              <div key={index} className="space-y-2">
                <h3 className="font-medium">{faq.question}</h3>
                <p className="text-sm text-muted-foreground">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <Card className="max-w-2xl mx-auto">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4">
                Ready to transform your productivity?
              </h2>
              <p className="text-muted-foreground mb-6">
                Join thousands of users who have streamlined their workflows
                with Flow. Start your free trial today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="px-8">
                  Start Free Trial
                </Button>
                <Button variant="outline" size="lg" className="px-8">
                  Contact Sales
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-card mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-sm text-muted-foreground">
            <p>© 2024 Flow. All rights reserved.</p>
            <div className="flex justify-center space-x-4 mt-2">
              <Link to="/terms" className="hover:text-foreground">
                Terms
              </Link>
              <Link to="/privacy" className="hover:text-foreground">
                Privacy
              </Link>
              <Link to="/contact" className="hover:text-foreground">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Subscription;
