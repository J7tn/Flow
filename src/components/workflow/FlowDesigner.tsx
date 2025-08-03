import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  Plus,
  Save,
  Play,
  Settings,
  Trash2,
  Copy,
  Eye,
  Share2,
  Zap,
  Clock,
  Users,
  Target,
  DollarSign,
  CheckCircle,
  AlertCircle,
  Info,
  Search,
  Wrench,
  Megaphone,
  Rocket,
  MessageSquare,
  FileText,
  BarChart3,
  Mail,
  Trophy,
  MessageCircle,
  Clipboard,
  Palette,
  Code,
  Bug,
  Upload,
  Calendar,
  MapPin,
  Mic,
  UserPlus,
  Filter,
  Presentation,
  Handshake,
  TrendingUp,
  Lightbulb,
  Map,
  AlertTriangle,
  Shield,
  Sparkles,
  List,
  Database,
  Globe,
  Video,
  Folder,
  CheckSquare,
  ChevronRight,
  ChevronLeft,
  ChevronUp,
  ChevronDown,
  PenTool,
  Edit,
  Image,
  BookOpen,
  Monitor,
  GraduationCap,
  Activity,
  Heart,
  Package,
  Award,
  Calculator,
  RefreshCw,
  HelpCircle,
  Box,
  Gamepad2,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import PermanentDashboard from "../shared/PermanentDashboard";
import { flowApi } from "@/lib/api";
import { flowSchema, type FlowInput } from "@/lib/validation";
import { allTemplates } from "@/data/templates";
import type { FlowTemplate } from "@/types/templates";

interface FlowStep {
  id: string;
  title: string;
  description: string;
  type: "goal" | "task" | "decision" | "milestone" | "automation";
  status: "pending" | "in-progress" | "completed" | "blocked";
  assignee?: string;
  estimatedTime?: number;
  cost?: number;
  dependencies: string[];
  subFlow?: FlowStep[]; // New: nested flow within this step
  selectedCategory?: string; // New: selected tool category for this step
  addedTools?: Array<{ name: string; description: string; category: string; icon: any; link?: string; pricing: { model: string; startingPrice?: number; currency: string; notes?: string } }>; // New: tools added to this step
}

const FlowDesigner = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const [workflowName, setWorkflowName] = useState("New Flow");
  const [workflowDescription, setWorkflowDescription] = useState("");
  const [workflowGoal, setWorkflowGoal] = useState("");
  const [selectedStep, setSelectedStep] = useState<string | null>(null);
  const [steps, setSteps] = useState<FlowStep[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [shareLink, setShareLink] = useState("");
  const [showPreview, setShowPreview] = useState(false);

  // AI-powered step suggestions
  const [isGeneratingSteps, setIsGeneratingSteps] = useState(false);
  const [suggestedSteps, setSuggestedSteps] = useState<Array<{ title: string; description: string; type: FlowStep["type"]; icon: any; color: string }>>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [currentStepTools, setCurrentStepTools] = useState<Array<{ name: string; description: string; category: string; icon: any; link?: string; pricing: { model: string; startingPrice?: number; currency: string; notes?: string } }>>([]);
  const [isGeneratingTools, setIsGeneratingTools] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [expandedStep, setExpandedStep] = useState<string | null>(null);
  const [selectedSubStep, setSelectedSubStep] = useState<string | null>(null);
  const [priceSort, setPriceSort] = useState<"none" | "low-to-high" | "high-to-low">("none");
  
  // Roadmap interaction state
  const [selectedRoadmapStep, setSelectedRoadmapStep] = useState<string | null>(null);
  
  // Panel display state - controls which panel shows in the right sidebar
  const [activePanel, setActivePanel] = useState<"suggested-steps" | "tools">("suggested-steps");

  // Load template from URL parameter
  useEffect(() => {
    const templateId = searchParams.get('template');
    if (templateId) {
      const template = allTemplates.find(t => t.id === templateId);
      if (template) {
        // Load template data into the workflow
        setWorkflowName(template.name);
        setWorkflowDescription(template.description);
        setWorkflowGoal(template.description); // Use description as goal
        
        // Convert template steps to FlowStep format
        const convertedSteps: FlowStep[] = template.steps.map((step, index) => ({
          id: step.id,
          title: step.title,
          description: step.description,
          type: step.type as FlowStep["type"],
          status: "pending" as const,
          estimatedTime: step.estimatedDuration.min,
          cost: step.costEstimate.min,
          dependencies: step.dependencies || [],
        }));
        
        setSteps(convertedSteps);
        
        toast({
          title: "Template Loaded",
          description: `Successfully loaded "${template.name}" template`,
        });
      } else {
        toast({
          title: "Template Not Found",
          description: "The requested template could not be found",
          variant: "destructive",
        });
      }
    }
  }, [searchParams, toast]);

  const generateAISteps = async (goal: string) => {
    if (!goal.trim()) return;
    
    setIsGeneratingSteps(true);
    
    try {
      // Simulate AI API call with intelligent step generation
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API delay
      
      const aiSteps = await generateStepsWithAI(goal);
      setSuggestedSteps(aiSteps);
      setCurrentStepIndex(0);
      
      // Generate tools for the first step
      if (aiSteps.length > 0) {
        await generateToolsForStep(aiSteps[0].title, aiSteps[0].description);
      }
    } catch (error) {
      console.error('Error generating AI steps:', error);
      // Fallback to basic steps
      const fallbackSteps = getFallbackSteps(goal);
      setSuggestedSteps(fallbackSteps);
      setCurrentStepIndex(0);
      
      if (fallbackSteps.length > 0) {
        await generateToolsForStep(fallbackSteps[0].title, fallbackSteps[0].description);
      }
    } finally {
      setIsGeneratingSteps(false);
    }
  };

  const generateStepsWithAI = async (goal: string): Promise<Array<{ title: string; description: string; type: FlowStep["type"]; icon: any; color: string }>> => {
    // This would be replaced with actual AI API call
    // For now, we'll simulate intelligent step generation based on goal analysis
    
    const lowerGoal = goal.toLowerCase();
    const words = goal.split(' ').map(word => word.toLowerCase());
    
    // Analyze goal complexity and context
    const isComplex = words.length > 5 || lowerGoal.includes('launch') || lowerGoal.includes('campaign') || lowerGoal.includes('development');
    const isBusiness = lowerGoal.includes('business') || lowerGoal.includes('company') || lowerGoal.includes('startup') || lowerGoal.includes('enterprise');
    const isCreative = lowerGoal.includes('design') || lowerGoal.includes('creative') || lowerGoal.includes('art') || lowerGoal.includes('content') || lowerGoal.includes('visual');
    const isTechnical = lowerGoal.includes('development') || lowerGoal.includes('coding') || lowerGoal.includes('software') || lowerGoal.includes('app');
    const isMarketing = lowerGoal.includes('marketing') || lowerGoal.includes('promotion') || lowerGoal.includes('advertising') || lowerGoal.includes('campaign');
    const isSales = lowerGoal.includes('sales') || lowerGoal.includes('revenue') || lowerGoal.includes('conversion') || lowerGoal.includes('leads');
    const isEvent = lowerGoal.includes('event') || lowerGoal.includes('conference') || lowerGoal.includes('meeting') || lowerGoal.includes('workshop');
    const isProduct = lowerGoal.includes('product') || lowerGoal.includes('launch') || lowerGoal.includes('development') || lowerGoal.includes('create');
    const isCustomer = lowerGoal.includes('customer') || lowerGoal.includes('user') || lowerGoal.includes('onboarding') || lowerGoal.includes('support');
    const isGame = lowerGoal.includes('game') || lowerGoal.includes('gaming') || lowerGoal.includes('play') || lowerGoal.includes('entertainment');
    const isEducation = lowerGoal.includes('learn') || lowerGoal.includes('education') || lowerGoal.includes('course') || lowerGoal.includes('training') || lowerGoal.includes('tutorial');
    const isHealth = lowerGoal.includes('health') || lowerGoal.includes('fitness') || lowerGoal.includes('wellness') || lowerGoal.includes('medical') || lowerGoal.includes('therapy');
    const isFinance = lowerGoal.includes('finance') || lowerGoal.includes('money') || lowerGoal.includes('investment') || lowerGoal.includes('budget') || lowerGoal.includes('financial');
    const isSocial = lowerGoal.includes('social') || lowerGoal.includes('community') || lowerGoal.includes('network') || lowerGoal.includes('connect') || lowerGoal.includes('relationship');
    const isResearch = lowerGoal.includes('research') || lowerGoal.includes('study') || lowerGoal.includes('analysis') || lowerGoal.includes('investigation') || lowerGoal.includes('explore');
    
    let steps: Array<{ title: string; description: string; type: FlowStep["type"]; icon: any; color: string }> = [];
    
    // Generate contextually appropriate steps
    if (isProduct) {
      steps = [
        { title: "Market Analysis", description: "Research target market, competitors, and market gaps", type: "task", icon: Search, color: "bg-blue-500" },
        { title: "Product Strategy", description: "Define product vision, features, and value proposition", type: "task", icon: Target, color: "bg-green-500" },
        { title: "MVP Development", description: "Build minimum viable product with core features", type: "task", icon: Code, color: "bg-purple-500" },
        { title: "User Testing", description: "Conduct user research and gather feedback", type: "task", icon: Users, color: "bg-orange-500" },
        { title: "Launch Preparation", description: "Prepare marketing materials and launch strategy", type: "milestone", icon: Rocket, color: "bg-indigo-500" },
        { title: "Post-Launch Optimization", description: "Monitor performance and iterate based on data", type: "task", icon: TrendingUp, color: "bg-red-500" },
      ];
    } else if (isMarketing) {
      steps = [
        { title: "Audience Research", description: "Define target audience demographics and psychographics", type: "task", icon: Users, color: "bg-blue-500" },
        { title: "Competitive Analysis", description: "Analyze competitor strategies and market positioning", type: "task", icon: Search, color: "bg-green-500" },
        { title: "Content Strategy", description: "Develop content themes, formats, and distribution plan", type: "task", icon: FileText, color: "bg-purple-500" },
        { title: "Channel Selection", description: "Choose optimal marketing channels and platforms", type: "decision", icon: Share2, color: "bg-orange-500" },
        { title: "Campaign Execution", description: "Launch and monitor marketing campaigns", type: "milestone", icon: Zap, color: "bg-indigo-500" },
        { title: "Performance Tracking", description: "Measure KPIs and optimize campaign performance", type: "task", icon: BarChart3, color: "bg-red-500" },
      ];
    } else if (isSales) {
      steps = [
        { title: "Lead Generation Strategy", description: "Develop methods to attract and capture leads", type: "task", icon: UserPlus, color: "bg-blue-500" },
        { title: "Lead Qualification Process", description: "Create criteria and process for qualifying leads", type: "task", icon: Filter, color: "bg-green-500" },
        { title: "Sales Pipeline Design", description: "Design sales funnel and conversion stages", type: "task", icon: TrendingUp, color: "bg-purple-500" },
        { title: "Sales Training", description: "Train sales team on product and sales techniques", type: "task", icon: Users, color: "bg-orange-500" },
        { title: "CRM Implementation", description: "Set up customer relationship management system", type: "automation", icon: Settings, color: "bg-indigo-500" },
        { title: "Sales Performance Review", description: "Analyze sales metrics and optimize process", type: "milestone", icon: BarChart3, color: "bg-red-500" },
      ];
    } else if (isEvent) {
      steps = [
        { title: "Event Concept Development", description: "Define event purpose, theme, and target audience", type: "task", icon: Lightbulb, color: "bg-blue-500" },
        { title: "Budget Planning", description: "Create detailed budget and financial projections", type: "task", icon: DollarSign, color: "bg-green-500" },
        { title: "Venue and Logistics", description: "Secure venue and arrange all logistical requirements", type: "task", icon: MapPin, color: "bg-purple-500" },
        { title: "Speaker and Content Curation", description: "Invite speakers and develop event content", type: "task", icon: Mic, color: "bg-orange-500" },
        { title: "Marketing and Promotion", description: "Create marketing strategy and promotional materials", type: "task", icon: Megaphone, color: "bg-indigo-500" },
        { title: "Event Execution", description: "Host the event and manage on-site operations", type: "milestone", icon: Calendar, color: "bg-red-500" },
      ];
    } else if (isCustomer) {
      steps = [
        { title: "Customer Journey Mapping", description: "Map out the complete customer experience", type: "task", icon: Map, color: "bg-blue-500" },
        { title: "Onboarding Automation", description: "Set up automated welcome and setup processes", type: "automation", icon: Zap, color: "bg-green-500" },
        { title: "Knowledge Base Creation", description: "Develop comprehensive help documentation", type: "task", icon: FileText, color: "bg-purple-500" },
        { title: "Support System Setup", description: "Implement customer support tools and processes", type: "task", icon: MessageCircle, color: "bg-orange-500" },
        { title: "Success Metrics Definition", description: "Define and track customer success metrics", type: "task", icon: Target, color: "bg-indigo-500" },
        { title: "Feedback Loop Implementation", description: "Create systems for continuous customer feedback", type: "milestone", icon: MessageSquare, color: "bg-red-500" },
      ];
    } else if (isCreative) {
      steps = [
        { title: "Creative Brief Development", description: "Define project scope, style guidelines, and creative direction", type: "task", icon: FileText, color: "bg-blue-500" },
        { title: "Mood Board Creation", description: "Create visual inspiration and style references", type: "task", icon: Palette, color: "bg-green-500" },
        { title: "Concept Sketching", description: "Develop initial concepts and rough sketches", type: "task", icon: PenTool, color: "bg-purple-500" },
        { title: "Design Iteration", description: "Refine designs based on feedback and requirements", type: "task", icon: Edit, color: "bg-orange-500" },
        { title: "Asset Creation", description: "Produce final design assets and deliverables", type: "task", icon: Image, color: "bg-indigo-500" },
        { title: "Design Review and Approval", description: "Present designs and gather final approvals", type: "milestone", icon: CheckCircle, color: "bg-red-500" },
      ];
    } else if (isGame) {
      steps = [
        { title: "Game Concept Development", description: "Define game mechanics, story, and target audience", type: "task", icon: Lightbulb, color: "bg-blue-500" },
        { title: "Game Design Document", description: "Create comprehensive game design documentation", type: "task", icon: FileText, color: "bg-green-500" },
        { title: "Artwork Creation", description: "Design characters, environments, and visual assets", type: "task", icon: Palette, color: "bg-purple-500" },
        { title: "Prototype Development", description: "Build playable prototype to test core mechanics", type: "task", icon: Code, color: "bg-orange-500" },
        { title: "Playtesting and Iteration", description: "Test with users and refine gameplay experience", type: "task", icon: Users, color: "bg-indigo-500" },
        { title: "Game Launch Preparation", description: "Prepare for release and marketing campaign", type: "milestone", icon: Rocket, color: "bg-red-500" },
      ];
    } else if (isEducation) {
      steps = [
        { title: "Learning Objectives Definition", description: "Define clear learning goals and outcomes", type: "task", icon: Target, color: "bg-blue-500" },
        { title: "Curriculum Development", description: "Create structured learning content and materials", type: "task", icon: BookOpen, color: "bg-green-500" },
        { title: "Content Creation", description: "Develop educational videos, documents, and resources", type: "task", icon: Video, color: "bg-purple-500" },
        { title: "Assessment Design", description: "Create quizzes, tests, and evaluation methods", type: "task", icon: CheckSquare, color: "bg-orange-500" },
        { title: "Platform Setup", description: "Set up learning management system and delivery platform", type: "task", icon: Monitor, color: "bg-indigo-500" },
        { title: "Course Launch and Monitoring", description: "Launch course and track student progress", type: "milestone", icon: GraduationCap, color: "bg-red-500" },
      ];
    } else if (isHealth) {
      steps = [
        { title: "Health Assessment", description: "Evaluate current health status and identify goals", type: "task", icon: Activity, color: "bg-blue-500" },
        { title: "Wellness Plan Creation", description: "Develop personalized health and fitness plan", type: "task", icon: Heart, color: "bg-green-500" },
        { title: "Resource Gathering", description: "Identify tools, apps, and support systems needed", type: "task", icon: Package, color: "bg-purple-500" },
        { title: "Progress Tracking Setup", description: "Set up monitoring and measurement systems", type: "task", icon: BarChart3, color: "bg-orange-500" },
        { title: "Implementation and Consistency", description: "Execute plan and maintain healthy habits", type: "task", icon: Calendar, color: "bg-indigo-500" },
        { title: "Health Goal Achievement", description: "Reach health milestones and maintain progress", type: "milestone", icon: Award, color: "bg-red-500" },
      ];
    } else if (isFinance) {
      steps = [
        { title: "Financial Assessment", description: "Analyze current financial situation and goals", type: "task", icon: DollarSign, color: "bg-blue-500" },
        { title: "Budget Planning", description: "Create comprehensive budget and spending plan", type: "task", icon: Calculator, color: "bg-green-500" },
        { title: "Investment Strategy", description: "Develop investment portfolio and strategy", type: "task", icon: TrendingUp, color: "bg-purple-500" },
        { title: "Financial Tools Setup", description: "Set up tracking apps and financial management tools", type: "task", icon: Settings, color: "bg-orange-500" },
        { title: "Regular Review and Adjustment", description: "Monitor progress and adjust financial plans", type: "task", icon: RefreshCw, color: "bg-indigo-500" },
        { title: "Financial Goal Achievement", description: "Reach financial milestones and targets", type: "milestone", icon: Target, color: "bg-red-500" },
      ];
    } else if (isSocial) {
      steps = [
        { title: "Community Research", description: "Identify target community and understand needs", type: "task", icon: Search, color: "bg-blue-500" },
        { title: "Platform Selection", description: "Choose appropriate social platforms and tools", type: "task", icon: Share2, color: "bg-green-500" },
        { title: "Content Strategy", description: "Develop engaging content and communication plan", type: "task", icon: MessageSquare, color: "bg-purple-500" },
        { title: "Community Building", description: "Create and grow online community engagement", type: "task", icon: Users, color: "bg-orange-500" },
        { title: "Relationship Management", description: "Maintain and strengthen community connections", type: "task", icon: Heart, color: "bg-indigo-500" },
        { title: "Community Growth and Impact", description: "Scale community and measure social impact", type: "milestone", icon: TrendingUp, color: "bg-red-500" },
      ];
    } else if (isResearch) {
      steps = [
        { title: "Research Question Formulation", description: "Define clear research objectives and questions", type: "task", icon: HelpCircle, color: "bg-blue-500" },
        { title: "Literature Review", description: "Review existing research and gather background information", type: "task", icon: BookOpen, color: "bg-green-500" },
        { title: "Methodology Design", description: "Design research methods and data collection strategies", type: "task", icon: Clipboard, color: "bg-purple-500" },
        { title: "Data Collection", description: "Gather research data through surveys, interviews, or experiments", type: "task", icon: Database, color: "bg-orange-500" },
        { title: "Data Analysis", description: "Analyze collected data and identify patterns", type: "task", icon: BarChart3, color: "bg-indigo-500" },
        { title: "Research Publication", description: "Document findings and share research results", type: "milestone", icon: FileText, color: "bg-red-500" },
      ];
    } else if (isTechnical) {
      steps = [
        { title: "Requirements Analysis", description: "Gather and analyze technical requirements", type: "task", icon: Clipboard, color: "bg-blue-500" },
        { title: "Architecture Design", description: "Design system architecture and technical specifications", type: "task", icon: Settings, color: "bg-green-500" },
        { title: "Development Planning", description: "Create development roadmap and sprint planning", type: "task", icon: Calendar, color: "bg-purple-500" },
        { title: "Code Development", description: "Implement features and functionality", type: "task", icon: Code, color: "bg-orange-500" },
        { title: "Testing and QA", description: "Conduct comprehensive testing and quality assurance", type: "task", icon: Bug, color: "bg-indigo-500" },
        { title: "Deployment and Monitoring", description: "Deploy to production and set up monitoring", type: "milestone", icon: Upload, color: "bg-red-500" },
      ];
    } else {
      // Generic intelligent steps based on goal complexity
      steps = [
        { title: "Goal Analysis", description: "Break down the goal into measurable objectives", type: "task", icon: Target, color: "bg-blue-500" },
        { title: "Research Phase", description: "Gather relevant information and best practices", type: "task", icon: Search, color: "bg-green-500" },
        { title: "Strategy Development", description: "Create detailed action plan and timeline", type: "task", icon: Clipboard, color: "bg-purple-500" },
        { title: "Resource Planning", description: "Identify and allocate necessary resources", type: "task", icon: Users, color: "bg-orange-500" },
        { title: "Implementation", description: "Execute the plan and track progress", type: "milestone", icon: Play, color: "bg-indigo-500" },
        { title: "Evaluation and Iteration", description: "Assess results and optimize the process", type: "task", icon: TrendingUp, color: "bg-red-500" },
      ];
    }
    
    // Add complexity-based additional steps
    if (isComplex) {
      steps.push(
        { title: "Risk Assessment", description: "Identify potential risks and mitigation strategies", type: "task", icon: AlertTriangle, color: "bg-yellow-500" },
        { title: "Stakeholder Communication", description: "Establish communication protocols with stakeholders", type: "task", icon: MessageSquare, color: "bg-gray-500" }
      );
    }
    
    if (isBusiness) {
      steps.push(
        { title: "Legal Compliance", description: "Ensure all legal and regulatory requirements are met", type: "task", icon: Shield, color: "bg-red-500" }
      );
    }
    
    return steps;
  };

  const getFallbackSteps = (goal: string): Array<{ title: string; description: string; type: FlowStep["type"]; icon: any; color: string }> => {
    return [
      { title: "Planning", description: "Define objectives and create plan", type: "task", icon: Clipboard, color: "bg-blue-500" },
      { title: "Research", description: "Gather information and analyze data", type: "task", icon: Search, color: "bg-green-500" },
      { title: "Implementation", description: "Execute the plan", type: "task", icon: Play, color: "bg-purple-500" },
      { title: "Review", description: "Evaluate results and gather feedback", type: "task", icon: Eye, color: "bg-orange-500" },
      { title: "Optimization", description: "Improve based on learnings", type: "task", icon: TrendingUp, color: "bg-indigo-500" },
    ];
  };

  const generateToolsForStep = async (stepTitle: string, stepDescription: string, category: string = "all") => {
    setIsGeneratingTools(true);
    
    try {
      // Simulate AI API call for tool generation
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const tools = await generateToolsWithAI(stepTitle, stepDescription);
      // Filter tools by category if specified
      const filteredTools = category === "all" ? tools : tools.filter(tool => tool.category.toLowerCase() === category.toLowerCase());
      setCurrentStepTools(filteredTools);
    } catch (error) {
      console.error('Error generating tools:', error);
      const fallbackTools = getFallbackTools(stepTitle);
      const filteredTools = category === "all" ? fallbackTools : fallbackTools.filter(tool => tool.category.toLowerCase() === category.toLowerCase());
      setCurrentStepTools(filteredTools);
    } finally {
      setIsGeneratingTools(false);
    }
  };

  const generateToolsWithAI = async (stepTitle: string, stepDescription: string): Promise<Array<{ name: string; description: string; category: string; icon: any; link?: string; pricing: { model: string; startingPrice?: number; currency: string; notes?: string } }>> => {
    const lowerTitle = stepTitle.toLowerCase();
    const lowerDesc = stepDescription.toLowerCase();
    
    const tools = [];
    
    // Management tools
    if (lowerTitle.includes('market') || lowerTitle.includes('research') || lowerDesc.includes('market') || lowerTitle.includes('analysis') || lowerTitle.includes('planning')) {
      tools.push(
        { name: "Google Analytics", description: "Track website traffic and user behavior", category: "management", icon: BarChart3, link: "https://analytics.google.com", pricing: { model: "free", currency: "USD", notes: "Free for basic features" } },
        { name: "SEMrush", description: "Competitive analysis and keyword research", category: "management", icon: Search, link: "https://semrush.com", pricing: { model: "subscription", startingPrice: 119, currency: "USD", notes: "Starting at $119/month" } },
        { name: "Ahrefs", description: "SEO and backlink analysis", category: "management", icon: TrendingUp, link: "https://ahrefs.com", pricing: { model: "subscription", startingPrice: 99, currency: "USD", notes: "Starting at $99/month" } },
        { name: "Hotjar", description: "User behavior analytics and heatmaps", category: "management", icon: Eye, link: "https://hotjar.com", pricing: { model: "freemium", startingPrice: 32, currency: "USD", notes: "Free plan available, paid from $32/month" } },
        { name: "Mixpanel", description: "Product analytics and user insights", category: "management", icon: BarChart3, link: "https://mixpanel.com", pricing: { model: "freemium", startingPrice: 25, currency: "USD", notes: "Free plan available, paid from $25/month" } },
        { name: "Tableau", description: "Data visualization and business intelligence", category: "management", icon: BarChart3, link: "https://tableau.com", pricing: { model: "subscription", startingPrice: 70, currency: "USD", notes: "Starting at $70/month" } }
      );
    }
    
    // Productivity tools
    if (lowerTitle.includes('product') || lowerTitle.includes('development') || lowerDesc.includes('product') || lowerTitle.includes('build') || lowerTitle.includes('create')) {
      tools.push(
        { name: "Notion", description: "All-in-one workspace for notes and collaboration", category: "productivity", icon: FileText, link: "https://notion.so", pricing: { model: "freemium", startingPrice: 8, currency: "USD", notes: "Free plan available, paid from $8/month" } },
        { name: "Trello", description: "Project management with boards and cards", category: "productivity", icon: CheckSquare, link: "https://trello.com", pricing: { model: "freemium", startingPrice: 5, currency: "USD", notes: "Free plan available, paid from $5/month" } },
        { name: "Asana", description: "Team collaboration and project tracking", category: "productivity", icon: Target, link: "https://asana.com", pricing: { model: "freemium", startingPrice: 10.99, currency: "USD", notes: "Free plan available, paid from $10.99/month" } },
        { name: "Monday.com", description: "Work management platform", category: "productivity", icon: Calendar, link: "https://monday.com", pricing: { model: "subscription", startingPrice: 8, currency: "USD", notes: "Starting at $8/month" } },
        { name: "ClickUp", description: "All-in-one productivity platform", category: "productivity", icon: CheckSquare, link: "https://clickup.com", pricing: { model: "freemium", startingPrice: 5, currency: "USD", notes: "Free plan available, paid from $5/month" } },
        { name: "Figma", description: "Design and prototyping tool", category: "productivity", icon: Palette, link: "https://figma.com", pricing: { model: "freemium", startingPrice: 12, currency: "USD", notes: "Free plan available, paid from $12/month" } }
      );
    }
    
    // Communication tools
    if (lowerTitle.includes('marketing') || lowerTitle.includes('campaign') || lowerDesc.includes('marketing') || lowerTitle.includes('promotion') || lowerTitle.includes('outreach') || lowerTitle.includes('communication')) {
      tools.push(
        { name: "Mailchimp", description: "Email marketing and automation", category: "communication", icon: Mail, link: "https://mailchimp.com", pricing: { model: "freemium", startingPrice: 10, currency: "USD", notes: "Free plan available, paid from $10/month" } },
        { name: "Slack", description: "Team communication and collaboration", category: "communication", icon: MessageSquare, link: "https://slack.com", pricing: { model: "freemium", startingPrice: 7.25, currency: "USD", notes: "Free plan available, paid from $7.25/month" } },
        { name: "Discord", description: "Community and team chat platform", category: "communication", icon: MessageCircle, link: "https://discord.com", pricing: { model: "freemium", startingPrice: 9.99, currency: "USD", notes: "Free plan available, paid from $9.99/month" } },
        { name: "Zoom", description: "Video conferencing and meetings", category: "communication", icon: Video, link: "https://zoom.us", pricing: { model: "freemium", startingPrice: 14.99, currency: "USD", notes: "Free plan available, paid from $14.99/month" } },
        { name: "Microsoft Teams", description: "Business communication platform", category: "communication", icon: MessageSquare, link: "https://teams.microsoft.com", pricing: { model: "subscription", startingPrice: 4, currency: "USD", notes: "Starting at $4/month" } },
        { name: "Intercom", description: "Customer messaging and support", category: "communication", icon: MessageCircle, link: "https://intercom.com", pricing: { model: "subscription", startingPrice: 39, currency: "USD", notes: "Starting at $39/month" } }
      );
    }
    
    // Storage tools
    if (lowerTitle.includes('launch') || lowerTitle.includes('preparation') || lowerDesc.includes('launch') || lowerTitle.includes('deploy') || lowerTitle.includes('release') || lowerTitle.includes('storage')) {
      tools.push(
        { name: "Google Drive", description: "Cloud storage and file sharing", category: "storage", icon: Folder, link: "https://drive.google.com", pricing: { model: "freemium", startingPrice: 1.99, currency: "USD", notes: "Free plan available, paid from $1.99/month" } },
        { name: "Dropbox", description: "File hosting and cloud storage", category: "storage", icon: Upload, link: "https://dropbox.com", pricing: { model: "subscription", startingPrice: 9.99, currency: "USD", notes: "Starting at $9.99/month" } },
        { name: "OneDrive", description: "Microsoft cloud storage solution", category: "storage", icon: Database, link: "https://onedrive.live.com", pricing: { model: "freemium", startingPrice: 1.99, currency: "USD", notes: "Free plan available, paid from $1.99/month" } },
        { name: "Box", description: "Enterprise file sharing and collaboration", category: "storage", icon: Folder, link: "https://box.com", pricing: { model: "subscription", startingPrice: 5, currency: "USD", notes: "Starting at $5/month" } },
        { name: "AWS S3", description: "Cloud object storage service", category: "storage", icon: Database, link: "https://aws.amazon.com/s3", pricing: { model: "subscription", startingPrice: 0.023, currency: "USD", notes: "Pay per use, starting at $0.023/GB" } },
        { name: "GitHub", description: "Code repository and version control", category: "storage", icon: Code, link: "https://github.com", pricing: { model: "freemium", startingPrice: 4, currency: "USD", notes: "Free plan available, paid from $4/month" } }
      );
    }
    
    // Creative and Design tools
    if (lowerTitle.includes('design') || lowerTitle.includes('creative') || lowerTitle.includes('art') || lowerTitle.includes('visual') || lowerTitle.includes('artwork') || lowerTitle.includes('sketch')) {
      tools.push(
        { name: "Adobe Creative Suite", description: "Professional design and creative software", category: "creative", icon: Palette, link: "https://adobe.com/creativecloud", pricing: { model: "subscription", startingPrice: 52.99, currency: "USD", notes: "Starting at $52.99/month" } },
        { name: "Figma", description: "Collaborative design and prototyping tool", category: "creative", icon: Palette, link: "https://figma.com", pricing: { model: "freemium", startingPrice: 12, currency: "USD", notes: "Free plan available, paid from $12/month" } },
        { name: "Sketch", description: "Digital design for Mac users", category: "creative", icon: PenTool, link: "https://sketch.com", pricing: { model: "subscription", startingPrice: 9, currency: "USD", notes: "Starting at $9/month" } },
        { name: "Canva Pro", description: "Graphic design platform with templates", category: "creative", icon: Image, link: "https://canva.com", pricing: { model: "subscription", startingPrice: 12.99, currency: "USD", notes: "Starting at $12.99/month" } },
        { name: "Procreate", description: "Digital painting and illustration app", category: "creative", icon: PenTool, link: "https://procreate.art", pricing: { model: "one-time", startingPrice: 9.99, currency: "USD", notes: "One-time purchase for iPad" } },
        { name: "Blender", description: "Free 3D creation suite", category: "creative", icon: Box, link: "https://blender.org", pricing: { model: "free", currency: "USD", notes: "Completely free open-source software" } }
      );
    }
    
    // Game Development tools
    if (lowerTitle.includes('game') || lowerTitle.includes('gaming') || lowerTitle.includes('play') || lowerTitle.includes('entertainment') || lowerTitle.includes('prototype')) {
      tools.push(
        { name: "Unity", description: "Game development engine and platform", category: "gaming", icon: Gamepad2, link: "https://unity.com", pricing: { model: "freemium", startingPrice: 25, currency: "USD", notes: "Free plan available, paid from $25/month" } },
        { name: "Unreal Engine", description: "Advanced game development engine", category: "gaming", icon: Gamepad2, link: "https://unrealengine.com", pricing: { model: "subscription", startingPrice: 0, currency: "USD", notes: "Free until $1M revenue, then 5% royalty" } },
        { name: "Godot", description: "Free and open-source game engine", category: "gaming", icon: Gamepad2, link: "https://godotengine.org", pricing: { model: "free", currency: "USD", notes: "Completely free open-source engine" } },
        { name: "GameMaker Studio", description: "2D game development platform", category: "gaming", icon: Gamepad2, link: "https://gamemaker.io", pricing: { model: "subscription", startingPrice: 39, currency: "USD", notes: "Starting at $39/month" } },
        { name: "Construct", description: "No-code 2D game development", category: "gaming", icon: Gamepad2, link: "https://construct.net", pricing: { model: "subscription", startingPrice: 8.99, currency: "USD", notes: "Starting at $8.99/month" } },
        { name: "Aseprite", description: "Pixel art and animation tool", category: "gaming", icon: PenTool, link: "https://aseprite.org", pricing: { model: "one-time", startingPrice: 19.99, currency: "USD", notes: "One-time purchase" } }
      );
    }
    
    // Education and Learning tools
    if (lowerTitle.includes('learn') || lowerTitle.includes('education') || lowerTitle.includes('course') || lowerTitle.includes('training') || lowerTitle.includes('tutorial') || lowerTitle.includes('curriculum')) {
      tools.push(
        { name: "Coursera", description: "Online courses from top universities", category: "education", icon: GraduationCap, link: "https://coursera.org", pricing: { model: "subscription", startingPrice: 39, currency: "USD", notes: "Starting at $39/month" } },
        { name: "Udemy", description: "Online learning platform with courses", category: "education", icon: BookOpen, link: "https://udemy.com", pricing: { model: "one-time", startingPrice: 9.99, currency: "USD", notes: "Individual course pricing" } },
        { name: "Khan Academy", description: "Free educational content and courses", category: "education", icon: GraduationCap, link: "https://khanacademy.org", pricing: { model: "free", currency: "USD", notes: "Completely free" } },
        { name: "Skillshare", description: "Creative and business skill courses", category: "education", icon: BookOpen, link: "https://skillshare.com", pricing: { model: "subscription", startingPrice: 15, currency: "USD", notes: "Starting at $15/month" } },
        { name: "Moodle", description: "Learning management system", category: "education", icon: Monitor, link: "https://moodle.org", pricing: { model: "freemium", startingPrice: 0, currency: "USD", notes: "Free open-source, hosting costs vary" } },
        { name: "Google Classroom", description: "Classroom management and learning platform", category: "education", icon: Monitor, link: "https://classroom.google.com", pricing: { model: "free", currency: "USD", notes: "Free for educational institutions" } }
      );
    }
    
    // Health and Wellness tools
    if (lowerTitle.includes('health') || lowerTitle.includes('fitness') || lowerTitle.includes('wellness') || lowerTitle.includes('medical') || lowerTitle.includes('therapy') || lowerTitle.includes('workout')) {
      tools.push(
        { name: "MyFitnessPal", description: "Calorie tracking and nutrition app", category: "health", icon: Activity, link: "https://myfitnesspal.com", pricing: { model: "freemium", startingPrice: 9.99, currency: "USD", notes: "Free plan available, paid from $9.99/month" } },
        { name: "Fitbit", description: "Fitness tracking and health monitoring", category: "health", icon: Heart, link: "https://fitbit.com", pricing: { model: "subscription", startingPrice: 9.99, currency: "USD", notes: "Starting at $9.99/month" } },
        { name: "Headspace", description: "Meditation and mindfulness app", category: "health", icon: Heart, link: "https://headspace.com", pricing: { model: "subscription", startingPrice: 12.99, currency: "USD", notes: "Starting at $12.99/month" } },
        { name: "Calm", description: "Sleep and meditation app", category: "health", icon: Heart, link: "https://calm.com", pricing: { model: "subscription", startingPrice: 14.99, currency: "USD", notes: "Starting at $14.99/month" } },
        { name: "Strava", description: "Social fitness tracking platform", category: "health", icon: Activity, link: "https://strava.com", pricing: { model: "freemium", startingPrice: 5, currency: "USD", notes: "Free plan available, paid from $5/month" } },
        { name: "Noom", description: "Weight loss and behavior change program", category: "health", icon: Heart, link: "https://noom.com", pricing: { model: "subscription", startingPrice: 59, currency: "USD", notes: "Starting at $59/month" } }
      );
    }
    
    // Financial Management tools
    if (lowerTitle.includes('finance') || lowerTitle.includes('money') || lowerTitle.includes('investment') || lowerTitle.includes('budget') || lowerTitle.includes('financial') || lowerTitle.includes('trading')) {
      tools.push(
        { name: "Mint", description: "Personal finance and budgeting app", category: "finance", icon: DollarSign, link: "https://mint.intuit.com", pricing: { model: "free", currency: "USD", notes: "Completely free" } },
        { name: "YNAB", description: "You Need A Budget - budgeting software", category: "finance", icon: Calculator, link: "https://youneedabudget.com", pricing: { model: "subscription", startingPrice: 11.99, currency: "USD", notes: "Starting at $11.99/month" } },
        { name: "Robinhood", description: "Commission-free stock trading app", category: "finance", icon: TrendingUp, link: "https://robinhood.com", pricing: { model: "freemium", startingPrice: 0, currency: "USD", notes: "Free trading, premium features available" } },
        { name: "Acorns", description: "Automated investing and savings app", category: "finance", icon: TrendingUp, link: "https://acorns.com", pricing: { model: "subscription", startingPrice: 3, currency: "USD", notes: "Starting at $3/month" } },
        { name: "Personal Capital", description: "Wealth management and financial planning", category: "finance", icon: DollarSign, link: "https://personalcapital.com", pricing: { model: "freemium", startingPrice: 0, currency: "USD", notes: "Free plan available, advisory services extra" } },
        { name: "Coinbase", description: "Cryptocurrency exchange and wallet", category: "finance", icon: DollarSign, link: "https://coinbase.com", pricing: { model: "freemium", startingPrice: 0, currency: "USD", notes: "Free trading, fees apply" } }
      );
    }
    
    // Social and Community tools
    if (lowerTitle.includes('social') || lowerTitle.includes('community') || lowerTitle.includes('network') || lowerTitle.includes('connect') || lowerTitle.includes('relationship') || lowerTitle.includes('engagement')) {
      tools.push(
        { name: "Discord", description: "Community chat and voice platform", category: "social", icon: MessageCircle, link: "https://discord.com", pricing: { model: "freemium", startingPrice: 9.99, currency: "USD", notes: "Free plan available, paid from $9.99/month" } },
        { name: "Slack", description: "Team communication and collaboration", category: "social", icon: MessageSquare, link: "https://slack.com", pricing: { model: "freemium", startingPrice: 7.25, currency: "USD", notes: "Free plan available, paid from $7.25/month" } },
        { name: "Mighty Networks", description: "Community platform for creators", category: "social", icon: Users, link: "https://mightybell.com", pricing: { model: "subscription", startingPrice: 23, currency: "USD", notes: "Starting at $23/month" } },
        { name: "Circle", description: "Community platform for creators and businesses", category: "social", icon: Users, link: "https://circle.so", pricing: { model: "subscription", startingPrice: 39, currency: "USD", notes: "Starting at $39/month" } },
        { name: "Kajabi", description: "All-in-one platform for creators", category: "social", icon: Users, link: "https://kajabi.com", pricing: { model: "subscription", startingPrice: 119, currency: "USD", notes: "Starting at $119/month" } },
        { name: "Patreon", description: "Membership platform for creators", category: "social", icon: Heart, link: "https://patreon.com", pricing: { model: "subscription", startingPrice: 0, currency: "USD", notes: "Free to start, 5-12% platform fees" } }
      );
    }
    
    // Research and Analysis tools
    if (lowerTitle.includes('research') || lowerTitle.includes('study') || lowerTitle.includes('analysis') || lowerTitle.includes('investigation') || lowerTitle.includes('explore') || lowerTitle.includes('data')) {
      tools.push(
        { name: "Google Scholar", description: "Academic research and literature search", category: "research", icon: Search, link: "https://scholar.google.com", pricing: { model: "free", currency: "USD", notes: "Completely free" } },
        { name: "SurveyMonkey", description: "Online survey and questionnaire platform", category: "research", icon: Clipboard, link: "https://surveymonkey.com", pricing: { model: "freemium", startingPrice: 25, currency: "USD", notes: "Free plan available, paid from $25/month" } },
        { name: "Qualtrics", description: "Advanced survey and research platform", category: "research", icon: Clipboard, link: "https://qualtrics.com", pricing: { model: "subscription", startingPrice: 0, currency: "USD", notes: "Contact for pricing" } },
        { name: "SPSS", description: "Statistical analysis software", category: "research", icon: BarChart3, link: "https://ibm.com/spss", pricing: { model: "subscription", startingPrice: 99, currency: "USD", notes: "Starting at $99/month" } },
        { name: "R Studio", description: "Open-source statistical computing", category: "research", icon: BarChart3, link: "https://rstudio.com", pricing: { model: "freemium", startingPrice: 0, currency: "USD", notes: "Free open-source, commercial licenses available" } },
        { name: "Tableau", description: "Data visualization and business intelligence", category: "research", icon: BarChart3, link: "https://tableau.com", pricing: { model: "subscription", startingPrice: 70, currency: "USD", notes: "Starting at $70/month" } }
      );
    }
    
    // Add some general tools for any step
    tools.push(
      { name: "Google Docs", description: "Document creation and collaboration", category: "productivity", icon: FileText, link: "https://docs.google.com", pricing: { model: "free", currency: "USD", notes: "Completely free" } },
      { name: "Canva", description: "Graphic design and visual content", category: "productivity", icon: Palette, link: "https://canva.com", pricing: { model: "freemium", startingPrice: 12.99, currency: "USD", notes: "Free plan available, paid from $12.99/month" } },
      { name: "Loom", description: "Screen recording and video messaging", category: "communication", icon: Video, link: "https://loom.com", pricing: { model: "freemium", startingPrice: 8, currency: "USD", notes: "Free plan available, paid from $8/month" } },
      { name: "Airtable", description: "Database and spreadsheet hybrid", category: "storage", icon: Database, link: "https://airtable.com", pricing: { model: "freemium", startingPrice: 10, currency: "USD", notes: "Free plan available, paid from $10/month" } }
    );
    
    return tools;
  };

  const getFallbackTools = (stepTitle: string): Array<{ name: string; description: string; category: string; icon: any; link?: string; pricing: { model: string; startingPrice?: number; currency: string; notes?: string } }> => {
    return [
      { name: "Notion", description: "Documentation and project management", category: "productivity", icon: FileText, pricing: { model: "freemium", startingPrice: 8, currency: "USD", notes: "Free plan available, paid from $8/month" } },
      { name: "Trello", description: "Task management and organization", category: "productivity", icon: CheckSquare, pricing: { model: "freemium", startingPrice: 5, currency: "USD", notes: "Free plan available, paid from $5/month" } },
      { name: "Google Docs", description: "Collaborative document editing", category: "productivity", icon: FileText, pricing: { model: "free", currency: "USD", notes: "Completely free" } },
      { name: "Slack", description: "Team communication and collaboration", category: "communication", icon: MessageSquare, pricing: { model: "freemium", startingPrice: 7.25, currency: "USD", notes: "Free plan available, paid from $7.25/month" } },
      { name: "Google Drive", description: "Cloud storage and file sharing", category: "storage", icon: Folder, pricing: { model: "freemium", startingPrice: 1.99, currency: "USD", notes: "Free plan available, paid from $1.99/month" } },
    ];
  };

  const moveToNextStep = async () => {
    if (currentStepIndex < suggestedSteps.length - 1) {
      const nextIndex = currentStepIndex + 1;
      setCurrentStepIndex(nextIndex);
      await generateToolsForStep(suggestedSteps[nextIndex].title, suggestedSteps[nextIndex].description);
    }
  };

  const moveToPreviousStep = async () => {
    if (currentStepIndex > 0) {
      const prevIndex = currentStepIndex - 1;
      setCurrentStepIndex(prevIndex);
      await generateToolsForStep(suggestedSteps[prevIndex].title, suggestedSteps[prevIndex].description);
    }
  };

  const handleCategorySelect = async (category: string, stepId?: string) => {
    if (stepId) {
      // Handle category selection for a specific step
      setSteps(prev => prev.map(step => 
        step.id === stepId 
          ? { ...step, selectedCategory: category }
          : step
      ));
      
      // Generate tools for this specific step with the selected category
      const step = steps.find(s => s.id === stepId);
      if (step) {
        await generateToolsForStep(step.title, step.description, category);
      }
    } else {
      // Handle category selection for AI suggestions (global)
      setSelectedCategory(category);
      if (suggestedSteps[currentStepIndex]) {
        const step = suggestedSteps[currentStepIndex];
        await generateToolsForStep(step.title, step.description, category);
      }
    }
  };

  const sortToolsByPrice = (tools: Array<{ name: string; description: string; category: string; icon: any; link?: string; pricing: { model: string; startingPrice?: number; currency: string; notes?: string } }>) => {
    if (priceSort === "none") return tools;
    
    return [...tools].sort((a, b) => {
      const getPriceValue = (tool: typeof tools[0]) => {
        if (tool.pricing.model === 'free') return 0;
        if (tool.pricing.model === 'freemium') return tool.pricing.startingPrice || 0;
        if (tool.pricing.model === 'subscription') return tool.pricing.startingPrice || 0;
        if (tool.pricing.model === 'one-time') return tool.pricing.startingPrice || 0;
        return 999999; // Enterprise/unknown pricing
      };
      
      const priceA = getPriceValue(a);
      const priceB = getPriceValue(b);
      
      if (priceSort === "low-to-high") {
        return priceA - priceB;
      } else {
        return priceB - priceA;
      }
    });
  };

  const addStep = (suggestedStep: { title: string; description: string; type: FlowStep["type"]; icon: any; color: string }) => {
    const stepNumber = steps.length + 1;
    const newStep: FlowStep = {
      id: crypto.randomUUID(),
      title: `Step ${stepNumber} ${suggestedStep.title}`,
      description: suggestedStep.description,
      type: suggestedStep.type,
      status: "pending",
      dependencies: [],
      subFlow: [], // Initialize empty sub-flow
      selectedCategory: "all"
    };
    setSteps(prev => [...prev, newStep]);
  };

  const updateStep = (id: string, updates: Partial<FlowStep>) => {
    setSteps(prev => prev.map(step => step.id === id ? { ...step, ...updates } : step));
  };

  const deleteStep = (id: string) => {
    setSteps(prev => prev.filter(step => step.id !== id));
    if (selectedStep === id) {
      setSelectedStep(null);
    }
  };

  const addSubStep = (parentStepId: string, subStep: { title: string; description: string; type: FlowStep["type"]; icon: any; color: string }) => {
    setSteps(prev => prev.map(step => {
      if (step.id === parentStepId) {
        const newSubStep: FlowStep = {
          id: crypto.randomUUID(),
          title: subStep.title,
          description: subStep.description,
          type: subStep.type,
          status: "pending",
          dependencies: [],
          subFlow: step.subFlow || []
        };
        return {
          ...step,
          subFlow: [...(step.subFlow || []), newSubStep]
        };
      }
      return step;
    }));
  };

  const deleteSubStep = (parentStepId: string, subStepId: string) => {
    setSteps(prev => prev.map(step => {
      if (step.id === parentStepId) {
        return {
          ...step,
          subFlow: (step.subFlow || []).filter(subStep => subStep.id !== subStepId)
        };
      }
      return step;
    }));
  };

  const addToolToStep = (stepId: string, tool: { name: string; description: string; category: string; icon: any; link?: string; pricing: { model: string; startingPrice?: number; currency: string; notes?: string } }) => {
    setSteps(steps.map(step => {
      if (step.id === stepId) {
        const existingTools = step.addedTools || [];
        // Check if tool is already added to avoid duplicates
        const isAlreadyAdded = existingTools.some(existingTool => existingTool.name === tool.name);
        if (isAlreadyAdded) {
          toast({
            title: "Tool Already Added",
            description: `${tool.name} is already added to this step`,
            variant: "destructive",
          });
          return step;
        }
        
        return {
          ...step,
          addedTools: [...existingTools, tool]
        };
      }
      return step;
    }));
    
    toast({
      title: "Tool Added",
      description: `${tool.name} has been added to the step`,
    });
  };

  const toggleStepExpansion = (stepId: string) => {
    setExpandedStep(expandedStep === stepId ? null : stepId);
    setSelectedSubStep(null); // Clear sub-step selection when expanding/collapsing
  };

  const handleSubStepClick = (subStepId: string) => {
    setSelectedSubStep(selectedSubStep === subStepId ? null : subStepId);
  };

  const calculateTotalCost = () => {
    return steps.reduce((total, step) => total + (step.cost || 0), 0);
  };

  const calculateTotalTime = () => {
    return steps.reduce((total, step) => total + (step.estimatedTime || 0), 0);
  };

  const getNextStatus = (currentStatus: FlowStep["status"]) => {
    switch (currentStatus) {
      case "pending":
        return "in-progress";
      case "in-progress":
        return "completed";
      case "completed":
        return "blocked";
      case "blocked":
        return "pending";
      default:
        return "pending";
    }
  };

  // Determine relevant tool categories based on workflow goal
  const getRelevantCategories = (goal: string): string[] => {
    if (!goal.trim()) {
      return ["all", "management", "productivity", "communication", "storage"];
    }
    
    const lowerGoal = goal.toLowerCase();
    const relevantCategories = ["all"]; // Always include "all" option
    
    // Business and Management workflows
    if (lowerGoal.includes('business') || lowerGoal.includes('company') || lowerGoal.includes('startup') || lowerGoal.includes('enterprise') || 
        lowerGoal.includes('management') || lowerGoal.includes('strategy') || lowerGoal.includes('planning')) {
      relevantCategories.push("management", "productivity", "communication", "storage");
    }
    
    // Product and Development workflows
    if (lowerGoal.includes('product') || lowerGoal.includes('development') || lowerGoal.includes('coding') || 
        lowerGoal.includes('software') || lowerGoal.includes('app') || lowerGoal.includes('build') || 
        lowerGoal.includes('create') || lowerGoal.includes('launch')) {
      relevantCategories.push("productivity", "storage", "management");
    }
    
    // Marketing and Sales workflows
    if (lowerGoal.includes('marketing') || lowerGoal.includes('promotion') || lowerGoal.includes('advertising') || 
        lowerGoal.includes('campaign') || lowerGoal.includes('sales') || lowerGoal.includes('revenue') || 
        lowerGoal.includes('conversion') || lowerGoal.includes('leads')) {
      relevantCategories.push("communication", "management", "productivity");
    }
    
    // Creative and Design workflows
    if (lowerGoal.includes('design') || lowerGoal.includes('creative') || lowerGoal.includes('art') || 
        lowerGoal.includes('content') || lowerGoal.includes('visual') || lowerGoal.includes('artwork') || 
        lowerGoal.includes('sketch') || lowerGoal.includes('brand')) {
      relevantCategories.push("creative", "productivity", "storage");
    }
    
    // Game Development workflows
    if (lowerGoal.includes('game') || lowerGoal.includes('gaming') || lowerGoal.includes('play') || 
        lowerGoal.includes('entertainment') || lowerGoal.includes('prototype')) {
      relevantCategories.push("gaming", "creative", "productivity", "storage");
    }
    
    // Education and Learning workflows
    if (lowerGoal.includes('learn') || lowerGoal.includes('education') || lowerGoal.includes('course') || 
        lowerGoal.includes('training') || lowerGoal.includes('tutorial') || lowerGoal.includes('curriculum')) {
      relevantCategories.push("education", "productivity", "communication");
    }
    
    // Health and Wellness workflows
    if (lowerGoal.includes('health') || lowerGoal.includes('fitness') || lowerGoal.includes('wellness') || 
        lowerGoal.includes('medical') || lowerGoal.includes('therapy') || lowerGoal.includes('workout')) {
      relevantCategories.push("health", "productivity");
    }
    
    // Financial workflows
    if (lowerGoal.includes('finance') || lowerGoal.includes('money') || lowerGoal.includes('investment') || 
        lowerGoal.includes('budget') || lowerGoal.includes('financial') || lowerGoal.includes('trading')) {
      relevantCategories.push("finance", "productivity", "management");
    }
    
    // Social and Community workflows
    if (lowerGoal.includes('social') || lowerGoal.includes('community') || lowerGoal.includes('network') || 
        lowerGoal.includes('connect') || lowerGoal.includes('relationship') || lowerGoal.includes('engagement')) {
      relevantCategories.push("social", "communication", "productivity");
    }
    
    // Research and Analysis workflows
    if (lowerGoal.includes('research') || lowerGoal.includes('study') || lowerGoal.includes('analysis') || 
        lowerGoal.includes('investigation') || lowerGoal.includes('explore') || lowerGoal.includes('data')) {
      relevantCategories.push("research", "management", "productivity");
    }
    
    // Event and Conference workflows
    if (lowerGoal.includes('event') || lowerGoal.includes('conference') || lowerGoal.includes('meeting') || 
        lowerGoal.includes('workshop') || lowerGoal.includes('presentation')) {
      relevantCategories.push("communication", "productivity", "management");
    }
    
    // Customer and Support workflows
    if (lowerGoal.includes('customer') || lowerGoal.includes('user') || lowerGoal.includes('onboarding') || 
        lowerGoal.includes('support') || lowerGoal.includes('service')) {
      relevantCategories.push("communication", "productivity", "management");
    }
    
    // Remove duplicates and return
    return [...new Set(relevantCategories)];
  };

  // Add category buttons within each step block
  const renderCategoryButtons = (step: FlowStep) => {
    const relevantCategories = getRelevantCategories(workflowGoal);
    
    return (
      <div className="mt-4 space-y-2">
        <div className="text-sm font-medium text-foreground mb-2">Tools & Resources:</div>
        <div className="flex flex-wrap gap-2">
          {relevantCategories.map((category) => (
            <Button
              key={category}
              variant={step.selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => handleCategorySelect(category, step.id)}
              className="text-xs capitalize"
            >
              {category === "all" ? "All Tools" : category}
            </Button>
          ))}
        </div>
      </div>
    );
  };



  const getStepColor = (step: FlowStep) => {
    if (step.type === "goal") return "bg-gradient-to-r from-purple-500 to-pink-500";
    const suggestedStep = suggestedSteps.find(s => s.title === step.title);
    return suggestedStep ? suggestedStep.color : "bg-gray-500";
  };

  const getStepIcon = (step: FlowStep) => {
    if (step.type === "goal") return Target;
    const suggestedStep = suggestedSteps.find(s => s.title === step.title);
    return suggestedStep ? suggestedStep.icon : CheckCircle;
  };

  const updateGoal = (newGoal: string) => {
    setWorkflowGoal(newGoal);
  };

  // Save flow functionality
  const handleSaveFlow = async () => {
    if (!workflowName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a flow name",
        variant: "destructive",
      });
      return;
    }

    if (steps.length === 0) {
      toast({
        title: "Warning",
        description: "Please add at least one step to your flow",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      const flowData: FlowInput = {
        title: workflowName,
        description: workflowDescription,
        steps: steps.map((step, index) => ({
          id: step.id,
          title: step.title,
          description: step.description || "",
          order: index,
          type: step.type,
          status: step.status,
          estimatedTime: step.estimatedTime,
          cost: step.cost,
          dependencies: step.dependencies,
          subFlow: step.subFlow,
          selectedCategory: step.selectedCategory,
        })),
        tags: [],
        isPublic: false,
      };

      console.log('Saving flow with data:', flowData);
      const result = await flowApi.createFlow(flowData);
      
      if (result.success) {
        toast({
          title: "Success",
          description: "Flow saved successfully!",
        });
        // Optionally navigate to the saved flow or stay on the page
      } else {
        throw new Error(result.error || "Failed to save flow");
      }
    } catch (error) {
      console.error("Error saving flow:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save flow",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Share flow functionality
  const handleShareFlow = async () => {
    setIsSharing(true);
    try {
      // Generate a shareable link with flow data encoded
      const flowData = {
        name: workflowName,
        description: workflowDescription,
        goal: workflowGoal,
        steps: steps,
        timestamp: Date.now(),
      };
      
      // Create a shareable URL with encoded data
      const encodedData = btoa(JSON.stringify(flowData));
      const shareUrl = `${window.location.origin}/flow/share/${encodedData}`;
      setShareLink(shareUrl);
      
      // Copy to clipboard
      try {
        await navigator.clipboard.writeText(shareUrl);
        toast({
          title: "Link copied!",
          description: "Share link has been copied to clipboard",
        });
      } catch (clipboardError) {
        // Fallback for older browsers or if clipboard API is not available
        console.warn("Clipboard API not available, showing link in dialog");
        toast({
          title: "Share link generated",
          description: "Click the copy button to copy the link",
        });
      }
    } catch (error) {
      console.error("Error sharing flow:", error);
      toast({
        title: "Error",
        description: "Failed to generate share link",
        variant: "destructive",
      });
    } finally {
      setIsSharing(false);
    }
  };

  // Copy share link to clipboard
  const copyShareLink = async () => {
    if (!shareLink) {
      toast({
        title: "Error",
        description: "No share link available",
        variant: "destructive",
      });
      return;
    }

    try {
      await navigator.clipboard.writeText(shareLink);
      toast({
        title: "Copied!",
        description: "Link copied to clipboard",
      });
    } catch (error) {
      // Fallback: create a temporary input element to copy
      const tempInput = document.createElement('input');
      tempInput.value = shareLink;
      document.body.appendChild(tempInput);
      tempInput.select();
      document.execCommand('copy');
      document.body.removeChild(tempInput);
      
      toast({
        title: "Copied!",
        description: "Link copied to clipboard (fallback method)",
      });
    }
  };

  return (
    <PermanentDashboard>
      <div className="flex-1 flex flex-col h-full">
        {/* Header */}
        <div className="border-b bg-card px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div>
                <Input
                  value={workflowName}
                  onChange={(e) => setWorkflowName(e.target.value)}
                  className="text-xl font-semibold border-none p-0 h-auto focus-visible:ring-0"
                  placeholder="New Flow"
                />
                <Textarea
                  value={workflowDescription}
                  onChange={(e) => setWorkflowDescription(e.target.value)}
                  placeholder="Add a description..."
                  className="text-sm text-muted-foreground border-none p-0 h-auto resize-none focus-visible:ring-0"
                  rows={1}
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Dialog open={showPreview} onOpenChange={setShowPreview}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    Preview
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Flow Preview</DialogTitle>
                    <DialogDescription>
                      Preview of your flow template: {workflowName}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-6">
                    {/* Flow Overview */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Target className="h-5 w-5 text-primary" />
                          {workflowName}
                        </CardTitle>
                        {workflowDescription && (
                          <CardDescription>{workflowDescription}</CardDescription>
                        )}
                      </CardHeader>
                      {workflowGoal && (
                        <CardContent>
                          <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg border border-primary/20">
                            <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                            <div>
                              <h4 className="font-medium text-foreground mb-1">Goal</h4>
                              <p className="text-sm text-muted-foreground">{workflowGoal}</p>
                            </div>
                          </div>
                        </CardContent>
                      )}
                    </Card>

                    {/* Flow Steps */}
                    {steps.length > 0 && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <List className="h-5 w-5 text-primary" />
                            Flow Steps ({steps.length})
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            {steps.map((step, index) => (
                              <div key={step.id} className="flex items-start gap-4 p-4 border rounded-lg">
                                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium text-primary">
                                  {index + 1}
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    <h4 className="font-medium">{step.title}</h4>
                                    <Badge variant="outline" className="text-xs">
                                      {step.type}
                                    </Badge>
                                    <Badge 
                                      variant={step.status === 'completed' ? 'default' : 'secondary'}
                                      className="text-xs"
                                    >
                                      {step.status}
                                    </Badge>
                                  </div>
                                  {step.description && (
                                    <p className="text-sm text-muted-foreground mb-2">{step.description}</p>
                                  )}
                                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                    {step.estimatedTime && (
                                      <span className="flex items-center gap-1">
                                        <Clock className="h-3 w-3" />
                                        {step.estimatedTime} min
                                      </span>
                                    )}
                                    {step.cost && (
                                      <span className="flex items-center gap-1">
                                        <DollarSign className="h-3 w-3" />
                                        ${step.cost}
                                      </span>
                                    )}
                                    {step.assignee && (
                                      <span className="flex items-center gap-1">
                                        <Users className="h-3 w-3" />
                                        {step.assignee}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* Flow Summary */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <BarChart3 className="h-5 w-5 text-orange-500" />
                          Flow Summary
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="text-center p-4 bg-primary/10 rounded-lg">
                            <div className="text-2xl font-bold text-primary">{steps.length}</div>
                            <div className="text-sm text-muted-foreground">Total Steps</div>
                          </div>
                          <div className="text-center p-4 bg-primary/10 rounded-lg">
                            <div className="text-2xl font-bold text-primary">{calculateTotalTime()}</div>
                            <div className="text-sm text-muted-foreground">Total Time (min)</div>
                          </div>
                          <div className="text-center p-4 bg-primary/10 rounded-lg">
                            <div className="text-2xl font-bold text-primary">${calculateTotalCost()}</div>
                            <div className="text-sm text-muted-foreground">Total Cost</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </DialogContent>
              </Dialog>

              <Dialog>
                <DialogTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleShareFlow}
                    disabled={isSharing}
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    {isSharing ? "Generating..." : "Share"}
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Share Flow</DialogTitle>
                    <DialogDescription>
                      Share this flow with others using the link below.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Input
                        value={shareLink}
                        readOnly
                        placeholder="Share link will appear here..."
                        className="flex-1"
                      />
                      <Button
                        onClick={copyShareLink}
                        disabled={!shareLink}
                        size="sm"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Anyone with this link can view your flow template.
                    </p>
                  </div>
                </DialogContent>
              </Dialog>

              <Button 
                onClick={handleSaveFlow}
                disabled={isSaving}
              >
                <Save className="h-4 w-4 mr-2" />
                {isSaving ? "Saving..." : "Save Flow"}
              </Button>
            </div>
          </div>
        </div>

                 {/* Main Content */}
         <div className="flex-1 flex overflow-hidden">
           {/* Center - Flow Canvas */}
           <div className="flex-1 bg-background relative overflow-auto">
             <div className="p-6 min-h-full">
                              <div className="canvas-container w-full h-full min-h-[600px] bg-muted/50 rounded-lg border-2 border-dashed border-muted-foreground/20 p-6">
                 {/* Roadmap Layout - Goal Block at the very left */}
                 <div className="flex flex-col lg:flex-row gap-8 mb-8">
                   {/* Goal Input Block - Left Side */}
                   <div className="lg:w-1/3">
                     <Card 
                       className="w-full max-w-md mx-auto shadow-lg border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10 cursor-pointer hover:shadow-xl transition-shadow"
                       onClick={() => {
                         setActivePanel("suggested-steps");
                         setSelectedStep(null);
                         setCurrentStepTools([]);
                       }}
                     >
                       <CardHeader className="pb-4">
                         <div className="flex items-center space-x-2 mb-3">
                           <div className="w-4 h-4 rounded-full bg-gradient-to-r from-primary to-primary/80" />
                           <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-primary/30">
                             Goal
                           </Badge>
                         </div>
                         <div className="space-y-3">
                           <div>
                             <label htmlFor="workflow-goal" className="text-sm font-medium text-foreground mb-2 block">
                               What is the goal of this flow?
                             </label>
                             <div className="relative">
                               <Textarea
                                 id="workflow-goal"
                                 value={workflowGoal}
                                 onChange={(e) => updateGoal(e.target.value)}
                                 placeholder="e.g., Launch a new product, Optimize customer onboarding, Create a marketing campaign..."
                                 className="w-full"
                                 rows={3}
                               />
                             </div>
                           </div>
                           <div className="flex items-center justify-between">
                             <div className="text-xs text-muted-foreground">
                               Define a clear, measurable goal
                             </div>
                             <Button
                               onClick={() => generateAISteps(workflowGoal)}
                               disabled={!workflowGoal.trim() || isGeneratingSteps}
                               size="sm"
                               className="bg-accent hover:bg-accent/90 text-accent-foreground"
                             >
                               {isGeneratingSteps ? (
                                 <>
                                   <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                   AI is thinking...
                                 </>
                               ) : (
                                 <>
                                   <Sparkles className="h-4 w-4 mr-2" />
                                   Generate Steps
                                 </>
                               )}
                             </Button>
                           </div>
                         </div>
                       </CardHeader>
                     </Card>

                     {/* Miniaturized Step Blocks - Directly below Goal Block */}
                     {steps.length > 0 && (
                       <div className="mt-3">
                         <div className="flex items-center justify-between mb-3">
                           <h3 className="font-semibold text-lg">Flow Steps</h3>
                           <Badge variant="secondary">{steps.length} steps added</Badge>
                         </div>
                         <div className="space-y-2">
                           {steps.map((step, index) => (
                             <div key={step.id} className="relative z-10">
                               <Card 
                                 className={`shadow-lg hover:shadow-xl transition-shadow min-h-[200px] border-2 border-primary/20 bg-card dark:bg-card cursor-pointer ${
                                 selectedStep === step.id ? 'ring-2 ring-accent' : ''
                               }`}
                                 onClick={(e) => {
                                   e.preventDefault();
                                   e.stopPropagation();
                                   console.log('Added step clicked:', step.id, step.title);
                                   setSelectedStep(step.id);
                                   setActivePanel("tools");
                                   // Generate tools for this added step
                                   generateToolsForStep(step.title, step.description);
                                 }}
                               >
                                 <CardHeader className="pb-4">
                                   <div className="flex items-center justify-between">
                                     <div className="flex items-center space-x-2">
                                       <div className={`w-3 h-3 rounded-full ${getStepColor(step)}`} />
                                       <Badge variant="outline" className="text-xs">
                                         {index + 1}
                                       </Badge>
                                     </div>
                                     <Button
                                       variant="ghost"
                                       size="sm"
                                       onClick={(e) => {
                                         e.stopPropagation();
                                         deleteStep(step.id);
                                       }}
                                     >
                                       <Trash2 className="h-3 w-3" />
                                     </Button>
                                   </div>
                                   <CardTitle className="text-base break-words">{step.title}</CardTitle>
                                 </CardHeader>
                                 <CardContent className="pt-0 space-y-4">
                                   <CardDescription className="text-sm break-words overflow-hidden leading-relaxed">
                                     {step.description || "No description"}
                                   </CardDescription>
                                   
                                   <div className="space-y-1 text-xs text-muted-foreground pt-2 border-t">
                                     {step.estimatedTime && (
                                       <div className="flex items-center">
                                         <Clock className="h-3 w-3 mr-1" />
                                         {step.estimatedTime}h
                                       </div>
                                     )}
                                     {step.cost && (
                                       <div className="flex items-center">
                                         <DollarSign className="h-3 w-3 mr-1" />
                                         ${step.cost}
                                       </div>
                                     )}
                                   </div>
                                   
                                   {/* Added Tools Display */}
                                   {step.addedTools && step.addedTools.length > 0 && (
                                     <div className="space-y-2 pt-2 border-t">
                                       <div className="text-xs font-medium text-muted-foreground">Added Tools:</div>
                                       <div className="flex flex-wrap gap-1">
                                         {step.addedTools.map((tool, toolIndex) => (
                                           <Badge key={toolIndex} variant="secondary" className="text-xs">
                                             {tool.name}
                                           </Badge>
                                         ))}
                                       </div>
                                     </div>
                                   )}
                                 </CardContent>
                               </Card>
                             </div>
                           ))}
                         </div>
                       </div>
                     )}
                   </div>

                   {/* Dynamic Panel Area - Right Side */}
                   <div className="lg:w-2/3">
                     {activePanel === "suggested-steps" ? (
                       /* Suggested Steps Panel */
                       <div>
                         <div className="flex items-center justify-between mb-4">
                           <h3 className="font-semibold text-lg">Suggested Steps</h3>
                           {suggestedSteps.length > 0 && (
                             <Badge variant="secondary">{suggestedSteps.length} steps</Badge>
                           )}
                         </div>

                         {/* Loading State */}
                         {isGeneratingSteps && (
                           <div className="flex items-center justify-center h-64">
                             <Card className="w-full max-w-md shadow-lg">
                               <CardContent className="p-6">
                                 <div className="text-center">
                                   <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-3"></div>
                                   <p className="text-sm text-muted-foreground">AI is analyzing your goal and generating intelligent steps...</p>
                                 </div>
                               </CardContent>
                             </Card>
                           </div>
                         )}

                         {/* Suggested Steps Grid */}
                         {suggestedSteps.length > 0 && !isGeneratingSteps && (
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                             {suggestedSteps.map((step, index) => (
                               <div
                                 key={index}
                                 className={`transition-all duration-300 ${
                                   selectedRoadmapStep === `suggested-${index}` ? 'opacity-100 scale-105' : 'opacity-60 hover:opacity-80'
                                 }`}
                               >
                                 <Card 
                                   className={`shadow-lg hover:shadow-xl transition-all cursor-pointer border-2 ${
                                     selectedRoadmapStep === `suggested-${index}` 
                                       ? 'border-primary ring-2 ring-primary/20' 
                                       : 'border-muted hover:border-primary/50'
                                   }`}
                                   onClick={() => {
                                     setSelectedRoadmapStep(`suggested-${index}`);
                                   }}
                                 >
                                   <CardHeader className="pb-3">
                                     <div className="flex items-center space-x-2">
                                       <div className={`p-2 rounded-lg ${step.color} bg-opacity-10`}>
                                         {step.icon && React.createElement(step.icon, {
                                           className: `h-5 w-5 ${step.color.replace('bg-', 'text-')}`
                                         })}
                                       </div>
                                       <Badge variant="outline" className="text-xs">
                                         Step {index + 1}
                                       </Badge>
                                     </div>
                                     <CardTitle className="text-sm font-medium">{step.title}</CardTitle>
                                   </CardHeader>
                                   <CardContent className="pt-0">
                                     <p className="text-xs text-muted-foreground mb-3">{step.description}</p>
                                     <Button 
                                       size="sm" 
                                       className="w-full text-xs"
                                       variant={selectedRoadmapStep === `suggested-${index}` ? "default" : "outline"}
                                       onClick={(e) => {
                                         e.stopPropagation();
                                         if (selectedRoadmapStep === `suggested-${index}`) {
                                           addStep(step);
                                           setSelectedRoadmapStep(null);
                                         }
                                       }}
                                     >
                                       {selectedRoadmapStep === `suggested-${index}` ? "Add to Flow" : "Choose This Step"}
                                     </Button>
                                   </CardContent>
                                 </Card>
                               </div>
                             ))}
                           </div>
                         )}

                         {/* Empty state when no suggested steps */}
                         {suggestedSteps.length === 0 && !isGeneratingSteps && (
                           <div className="flex items-center justify-center h-64">
                             <Card className="w-full max-w-md shadow-lg">
                               <CardContent className="p-6">
                                 <div className="text-center">
                                   <Target className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
                                   <p className="text-sm text-muted-foreground">Enter a goal and click "Generate Steps" to get started</p>
                                 </div>
                               </CardContent>
                             </Card>
                           </div>
                         )}
                       </div>
                     ) : (
                       /* Tools for Selected Step Panel */
                       <div>
                         {selectedStep ? (
                           <div>
                             <div className="flex items-center justify-between mb-4">
                               <h3 className="font-semibold text-lg">Tools for Selected Step</h3>
                               <Button
                                 variant="ghost"
                                 size="sm"
                                 onClick={() => setSelectedStep(null)}
                               >
                                 ×
                               </Button>
                             </div>
                             
                             {/* Step Properties */}
                             <Card className="mb-6">
                               <CardHeader>
                                 <CardTitle className="text-base">Step Properties</CardTitle>
                               </CardHeader>
                               <CardContent>
                                 <Tabs defaultValue="general" className="w-full">
                                   <TabsList className="grid w-full grid-cols-2">
                                     <TabsTrigger value="general">General</TabsTrigger>
                                     <TabsTrigger value="advanced">Advanced</TabsTrigger>
                                   </TabsList>
                                   <TabsContent value="general" className="space-y-4">
                                     <div>
                                       <label className="text-sm font-medium">Title</label>
                                       <Input
                                         value={steps.find(s => s.id === selectedStep)?.title || ""}
                                         onChange={(e) => updateStep(selectedStep, { title: e.target.value })}
                                         className="mt-1"
                                       />
                                     </div>
                                     <div>
                                       <label className="text-sm font-medium">Description</label>
                                       <Textarea
                                         value={steps.find(s => s.id === selectedStep)?.description || ""}
                                         onChange={(e) => updateStep(selectedStep, { description: e.target.value })}
                                         className="mt-1"
                                         rows={3}
                                       />
                                     </div>
                                     <div>
                                       <label className="text-sm font-medium">Assignee</label>
                                       <Input
                                         value={steps.find(s => s.id === selectedStep)?.assignee || ""}
                                         onChange={(e) => updateStep(selectedStep, { assignee: e.target.value })}
                                         className="mt-1"
                                         placeholder="Enter assignee name"
                                       />
                                     </div>
                                     <div className="grid grid-cols-2 gap-4 items-start">
                                       <div className="flex flex-col">
                                         <label className="text-sm font-medium mb-1 whitespace-nowrap">Estimated Time (hours)</label>
                                         <Input
                                           type="number"
                                           value={steps.find(s => s.id === selectedStep)?.estimatedTime || ""}
                                           onChange={(e) => updateStep(selectedStep, { estimatedTime: parseInt(e.target.value) || 0 })}
                                           className="h-10"
                                         />
                                       </div>
                                       <div className="flex flex-col">
                                         <label className="text-sm font-medium mb-1 whitespace-nowrap">Cost ($)</label>
                                         <Input
                                           type="number"
                                           value={steps.find(s => s.id === selectedStep)?.cost || ""}
                                           onChange={(e) => updateStep(selectedStep, { cost: parseInt(e.target.value) || 0 })}
                                           className="h-10"
                                         />
                                       </div>
                                     </div>
                                   </TabsContent>
                                   <TabsContent value="advanced" className="space-y-4">
                                     <div>
                                       <label className="text-sm font-medium">Status</label>
                                       <select
                                         value={steps.find(s => s.id === selectedStep)?.status || "pending"}
                                         onChange={(e) => updateStep(selectedStep, { status: e.target.value as FlowStep["status"] })}
                                         className="mt-1 w-full p-2 border rounded-md"
                                       >
                                         <option value="pending">Pending</option>
                                         <option value="in-progress">In Progress</option>
                                         <option value="completed">Completed</option>
                                         <option value="blocked">Blocked</option>
                                       </select>
                                     </div>
                                     <div>
                                       <label className="text-sm font-medium">Dependencies</label>
                                       <div className="mt-1 space-y-2">
                                         {steps
                                           .filter(s => s.id !== selectedStep && s.type !== "goal")
                                           .map(step => (
                                             <label key={step.id} className="flex items-center space-x-2">
                                               <input
                                                 type="checkbox"
                                                 checked={steps.find(s => s.id === selectedStep)?.dependencies.includes(step.id) || false}
                                                 onChange={(e) => {
                                                   const currentStep = steps.find(s => s.id === selectedStep);
                                                   if (currentStep) {
                                                     const newDependencies = e.target.checked
                                                       ? [...currentStep.dependencies, step.id]
                                                       : currentStep.dependencies.filter(id => id !== step.id);
                                                     updateStep(selectedStep, { dependencies: newDependencies });
                                                   }
                                                 }}
                                               />
                                               <span className="text-sm">{step.title}</span>
                                             </label>
                                           ))}
                                       </div>
                                     </div>
                                   </TabsContent>
                                 </Tabs>
                               </CardContent>
                             </Card>

                             {/* Tools for Selected Step */}
                             {currentStepTools.length > 0 && (
                               <div>
                                 <div className="flex items-center justify-between mb-4">
                                   <h3 className="font-semibold text-lg">Available Tools</h3>
                                 </div>
                                 
                                 <div className="space-y-4">
                                   {/* Category Filter Buttons */}
                                   <div className="flex flex-wrap gap-2">
                                     {getRelevantCategories(workflowGoal).map((category) => (
                                       <Button
                                         key={category}
                                         variant={selectedCategory === category ? "default" : "outline"}
                                         size="sm"
                                         className="text-xs capitalize"
                                         onClick={() => handleCategorySelect(category, selectedStep)}
                                       >
                                         {category === "all" ? "All Tools" : category}
                                       </Button>
                                     ))}
                                   </div>

                                   {/* Tools Grid */}
                                   {currentStepTools.length > 0 && (
                                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                       {currentStepTools.map((tool, index) => (
                                         <div key={index} className="border rounded-lg p-3 hover:shadow-md transition-shadow bg-card">
                                           <div className="flex items-start space-x-3">
                                             <div className="p-2 rounded-lg bg-muted flex-shrink-0">
                                               {tool.icon && React.createElement(tool.icon, {
                                                 className: "h-4 w-4 text-muted-foreground"
                                               })}
                                             </div>
                                             <div className="flex-1 min-w-0">
                                               <div className="flex items-center justify-between mb-1">
                                                 <h5 className="font-medium text-sm truncate">{tool.name}</h5>
                                                 <Badge 
                                                   variant={tool.pricing.model === 'free' ? 'secondary' : 'default'}
                                                   className="text-xs"
                                                 >
                                                   {tool.pricing.model === 'free' ? 'FREE' : 'PAID'}
                                                 </Badge>
                                               </div>
                                               <p className="text-xs text-muted-foreground mb-2">{tool.description}</p>
                                               <div className="flex gap-2">
                                                 {tool.link && (
                                                   <Button
                                                     variant="ghost"
                                                     size="sm"
                                                     className="h-6 px-2 text-xs"
                                                     onClick={() => window.open(tool.link, '_blank')}
                                                   >
                                                     Visit Tool
                                                     <ChevronRight className="h-3 w-3 ml-1" />
                                                   </Button>
                                                 )}
                                                 <Button
                                                   variant="outline"
                                                   size="sm"
                                                   className="h-6 px-2 text-xs"
                                                   onClick={(e) => {
                                                     e.stopPropagation();
                                                     if (selectedStep) {
                                                       addToolToStep(selectedStep, tool);
                                                     }
                                                   }}
                                                 >
                                                   Add Tool
                                                 </Button>
                                               </div>
                                             </div>
                                           </div>
                                         </div>
                                       ))}
                                     </div>
                                   )}
                                 </div>
                               </div>
                             )}
                           </div>
                         ) : (
                           <div className="flex items-center justify-center h-64">
                             <Card className="w-full max-w-md shadow-lg">
                               <CardContent className="p-6">
                                 <div className="text-center">
                                   <Info className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
                                   <p className="text-sm text-muted-foreground">Select an added step to view its tools</p>
                                 </div>
                               </CardContent>
                             </Card>
                           </div>
                         )}
                       </div>
                     )}
                   </div>
                 </div>

               </div>
             </div>
           </div>

                      {/* Right Sidebar - Flow Statistics */}
           <div className="w-80 border-l bg-muted/30 p-4 overflow-y-auto">
             {/* Flow Statistics */}
             <div className="mb-6">
               <h3 className="font-semibold mb-3">Flow Statistics</h3>
               <div className="space-y-3">
                 <div className="flex items-center justify-between">
                   <span className="text-sm text-muted-foreground">Goal Set</span>
                   <Badge variant={workflowGoal ? "default" : "secondary"}>
                     {workflowGoal ? "✓ Set" : "Not Set"}
                   </Badge>
                 </div>
                 <div className="flex items-center justify-between">
                   <span className="text-sm text-muted-foreground">Total Steps</span>
                   <Badge variant="secondary">{steps.filter(step => step.type !== "goal").length}</Badge>
                 </div>
                 <div className="flex items-center justify-between">
                   <span className="text-sm text-muted-foreground">Estimated Time</span>
                   <Badge variant="secondary">{calculateTotalTime()}h</Badge>
                 </div>
                 <div className="flex items-center justify-between">
                   <span className="text-sm text-muted-foreground">Total Cost</span>
                   <Badge variant="secondary">${calculateTotalCost().toLocaleString()}</Badge>
                 </div>
               </div>
             </div>
           </div>
        </div>
      </div>
    </PermanentDashboard>
  );
};

export default FlowDesigner; 