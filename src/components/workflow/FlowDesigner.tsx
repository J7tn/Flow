import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
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
  ArrowRight,
  ArrowUp,
  ArrowDown,
  Building,
  Camera,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import PermanentDashboard from "../shared/PermanentDashboard";
import { flowApi } from "@/lib/api";
import { flowSchema, type FlowInput } from "@/lib/validation";
import { allTemplates } from "@/data/templates";
import type { FlowTemplate } from "@/types/templates";
import { Chat2APIService } from '@/lib/chat2api';

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
  const [userType, setUserType] = useState<"solo" | "team" | "enterprise">("solo");
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
  const [activePanel, setActivePanel] = useState<"suggested-steps" | "tools" | null>(null);
  
  // Tutorial state
  const [showTutorial, setShowTutorial] = useState(true);
  const [tutorialStep, setTutorialStep] = useState(0);

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
      
      // Set active panel to show suggested steps
      if (aiSteps.length > 0) {
        setActivePanel("suggested-steps");
        // Generate tools for the first step
        await generateToolsForStep(aiSteps[0].title, aiSteps[0].description);
      }
    } catch (error) {
      console.error('Error generating AI steps:', error);
      // Fallback to basic steps
      const fallbackSteps = getFallbackSteps(goal);
      setSuggestedSteps(fallbackSteps);
      setCurrentStepIndex(0);
      
      if (fallbackSteps.length > 0) {
        setActivePanel("suggested-steps");
        await generateToolsForStep(fallbackSteps[0].title, fallbackSteps[0].description);
      }
    } finally {
      setIsGeneratingSteps(false);
    }
  };

  const generateStepsWithAI = async (goal: string): Promise<Array<{ title: string; description: string; type: FlowStep["type"]; icon: any; color: string }>> => {
    console.log('🔍 Starting AI step generation for goal:', goal);
    try {
      // Use Chat2API to generate custom steps based on the goal
      const messages = [
        {
          role: 'system',
          content: `You are an expert workflow designer. Create a step-by-step workflow for achieving the given goal. 

IMPORTANT: Return your response as a JSON array with exactly this structure:
[
  {
    "title": "Step Title",
    "description": "Detailed description of what this step involves",
    "type": "task|milestone|decision|automation",
    "icon": "icon_name",
    "color": "bg-blue-500|bg-green-500|bg-purple-500|bg-orange-500|bg-indigo-500|bg-red-500|bg-yellow-500|bg-gray-500"
  }
]

Guidelines:
- Create 4-8 practical, actionable steps
- Use "task" for most steps, "milestone" for major achievements, "decision" for choice points, "automation" for automated processes
- Make descriptions specific and actionable
- Choose appropriate colors for visual variety
- Focus on the specific goal provided, not generic templates
- Ensure steps are in logical order and build upon each other`
        },
        {
          role: 'user',
          content: `Create a workflow for this goal: ${goal}`
        }
      ];

      console.log('📤 Sending request to Chat2API...');
      const response = await Chat2APIService.createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages,
        temperature: 0.7,
        max_tokens: 1000,
      });

      console.log('📥 Received response from Chat2API:', response);
      const aiResponse = response.choices[0]?.message?.content || '';
      console.log('🤖 AI Response content:', aiResponse);
      
      // Try to parse the JSON response
      try {
        console.log('🔧 Attempting to parse JSON response...');
        
        // Strip markdown code block wrappers if present
        let cleanResponse = aiResponse.trim();
        if (cleanResponse.startsWith('```json')) {
          cleanResponse = cleanResponse.replace(/^```json\s*/, '');
        }
        if (cleanResponse.startsWith('```')) {
          cleanResponse = cleanResponse.replace(/^```\s*/, '');
        }
        if (cleanResponse.endsWith('```')) {
          cleanResponse = cleanResponse.replace(/\s*```$/, '');
        }
        
        console.log('🧹 Cleaned response for parsing:', cleanResponse);
        const parsedSteps = JSON.parse(cleanResponse);
        console.log('✅ Successfully parsed steps:', parsedSteps);
        
        // Map icon names to actual icon components
        const iconMap: { [key: string]: any } = {
          'Target': Target,
          'Search': Search,
          'Code': Code,
          'Users': Users,
          'Rocket': Rocket,
          'TrendingUp': TrendingUp,
          'Activity': Activity,
          'Heart': Heart,
          'Package': Package,
          'Video': Video,
          'Calendar': Calendar,
          'FileText': FileText,
          'Share2': Share2,
          'Zap': Zap,
          'BarChart3': BarChart3,
          'UserPlus': UserPlus,
          'Filter': Filter,
          'Settings': Settings,
          'Lightbulb': Lightbulb,
          'MapPin': MapPin,
          'Mic': Mic,
          'Megaphone': Megaphone,
          'MessageCircle': MessageCircle,
          'MessageSquare': MessageSquare,
          'Palette': Palette,
          'PenTool': PenTool,
          'Edit': Edit,
          'Image': Image,
          'CheckCircle': CheckCircle,
          'Gamepad2': Gamepad2,
          'BookOpen': BookOpen,
          'Monitor': Monitor,
          'GraduationCap': GraduationCap,
          'Calculator': Calculator,
          'RefreshCw': RefreshCw,
          'HelpCircle': HelpCircle,
          'Box': Box,
          'Database': Database,
          'Clipboard': Clipboard,
          'Bug': Bug,
          'Upload': Upload,
          'Camera': Camera,
          'Play': Play,
          'Map': Map,
          'CheckSquare': CheckSquare,
          'Shield': Shield,
          'AlertTriangle': AlertTriangle
        };

        // Validate and transform the parsed steps
        const validSteps = parsedSteps
          .filter((step: any) => 
            step.title && 
            step.description && 
            step.type && 
            ['task', 'milestone', 'decision', 'automation'].includes(step.type)
          )
          .map((step: any) => ({
            title: step.title,
            description: step.description,
            type: step.type as FlowStep["type"],
            icon: iconMap[step.icon] || Target, // Default to Target if icon not found
            color: step.color || 'bg-blue-500'
          }));

        console.log('✅ Valid steps generated:', validSteps);

        if (validSteps.length > 0) {
          console.log('🎉 Returning AI-generated steps!');
          return validSteps;
        }
      } catch (parseError) {
        console.warn('❌ Failed to parse AI response as JSON:', parseError);
        console.warn('Raw response was:', aiResponse);
      }

      // Fallback to keyword-based generation if AI parsing fails
      console.log('🔄 AI parsing failed, using fallback generation');
      return getFallbackSteps(goal);
      
    } catch (error) {
      console.error('💥 AI step generation failed:', error);
      // Fallback to keyword-based generation
      return getFallbackSteps(goal);
    }
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
    console.log('🔍 Starting AI tool generation for step:', stepTitle);
    try {
      // Use Chat2API to generate custom tools based on the step
      const messages = [
        {
          role: 'system',
          content: `You are an expert tool recommendation specialist. Based on the workflow step, suggest relevant tools, software, or resources that would help accomplish this step.

IMPORTANT: Return your response as a JSON array with exactly this structure:
[
  {
    "name": "Tool Name",
    "description": "Brief description of what this tool does",
    "category": "productivity|communication|storage|creative|gaming|education|health|finance|social|research|management",
    "icon": "icon_name",
    "link": "https://tool-website.com",
    "pricing": {
      "model": "free|freemium|subscription|one-time",
      "startingPrice": 0,
      "currency": "USD",
      "notes": "Brief pricing notes"
    }
  }
]

Guidelines:
- Suggest 3-6 relevant tools for the specific step
- Include a mix of free and paid tools
- Focus on tools that directly help with the step's objectives
- Use realistic pricing and accurate descriptions
- Choose appropriate categories and icons
- Ensure tools are actually useful for the given step context`
        },
        {
          role: 'user',
          content: `Suggest tools for this workflow step:
Title: ${stepTitle}
Description: ${stepDescription}`
        }
      ];

      console.log('📤 Sending tool request to Chat2API...');
      const response = await Chat2APIService.createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages,
        temperature: 0.7,
        max_tokens: 800,
      });

      console.log('📥 Received tool response from Chat2API:', response);
      const aiResponse = response.choices[0]?.message?.content || '';
      console.log('🤖 AI Tool Response content:', aiResponse);
      
      // Try to parse the JSON response
      try {
        console.log('🔧 Attempting to parse tool JSON response...');
        
        // Strip markdown code block wrappers if present
        let cleanResponse = aiResponse.trim();
        if (cleanResponse.startsWith('```json')) {
          cleanResponse = cleanResponse.replace(/^```json\s*/, '');
        }
        if (cleanResponse.startsWith('```')) {
          cleanResponse = cleanResponse.replace(/^```\s*/, '');
        }
        if (cleanResponse.endsWith('```')) {
          cleanResponse = cleanResponse.replace(/\s*```$/, '');
        }
        
        console.log('🧹 Cleaned tool response for parsing:', cleanResponse);
        const parsedTools = JSON.parse(cleanResponse);
        console.log('✅ Successfully parsed tools:', parsedTools);
        
        // Map icon names to actual icon components
        const iconMap: { [key: string]: any } = {
          'Target': Target,
          'Search': Search,
          'Code': Code,
          'Users': Users,
          'Rocket': Rocket,
          'TrendingUp': TrendingUp,
          'Activity': Activity,
          'Heart': Heart,
          'Package': Package,
          'Video': Video,
          'Calendar': Calendar,
          'FileText': FileText,
          'Share2': Share2,
          'Zap': Zap,
          'BarChart3': BarChart3,
          'UserPlus': UserPlus,
          'Filter': Filter,
          'Settings': Settings,
          'Lightbulb': Lightbulb,
          'MapPin': MapPin,
          'Mic': Mic,
          'Megaphone': Megaphone,
          'MessageCircle': MessageCircle,
          'MessageSquare': MessageSquare,
          'Palette': Palette,
          'PenTool': PenTool,
          'Edit': Edit,
          'Image': Image,
          'CheckCircle': CheckCircle,
          'Gamepad2': Gamepad2,
          'BookOpen': BookOpen,
          'Monitor': Monitor,
          'GraduationCap': GraduationCap,
          'Calculator': Calculator,
          'RefreshCw': RefreshCw,
          'HelpCircle': HelpCircle,
          'Box': Box,
          'Database': Database,
          'Clipboard': Clipboard,
          'Bug': Bug,
          'Upload': Upload,
          'Camera': Camera,
          'Play': Play,
          'Map': Map,
          'CheckSquare': CheckSquare,
          'Shield': Shield,
          'AlertTriangle': AlertTriangle,
          'Mail': Mail,
          'Eye': Eye,
          'Folder': Folder,
          'Globe': Globe
        };

        // Validate and transform the parsed tools
        const validTools = parsedTools
          .filter((tool: any) => 
            tool.name && 
            tool.description && 
            tool.category && 
            tool.pricing
          )
          .map((tool: any) => ({
            name: tool.name,
            description: tool.description,
            category: tool.category,
            icon: iconMap[tool.icon] || Target, // Default to Target if icon not found
            link: tool.link || '#',
            pricing: {
              model: tool.pricing.model || 'freemium',
              startingPrice: tool.pricing.startingPrice || 0,
              currency: tool.pricing.currency || 'USD',
              notes: tool.pricing.notes || 'Pricing varies'
            }
          }));

        console.log('✅ Valid tools generated:', validTools);

        if (validTools.length > 0) {
          // Filter tools based on user type
          const filterToolsByUserType = (toolList: Array<{ name: string; description: string; category: string; icon: any; link?: string; pricing: { model: string; startingPrice?: number; currency: string; notes?: string } }>) => {
            return toolList.filter(tool => {
              const userPricing = getUserSpecificPricing(tool);
              // For solo users, prioritize free tools
              if (userType === "solo" && userPricing.model !== "free") {
                return false;
              }
              // For team users, include free and affordable tools
              if (userType === "team" && userPricing.startingPrice && userPricing.startingPrice > 50) {
                return false;
              }
              // For enterprise users, include all tools
              return true;
            });
          };

          const filteredTools = filterToolsByUserType(validTools);
          console.log('🎉 Returning AI-generated tools!', filteredTools);
          return filteredTools;
        }
      } catch (parseError) {
        console.warn('❌ Failed to parse AI tool response as JSON:', parseError);
        console.warn('Raw tool response was:', aiResponse);
      }

      // Fallback to keyword-based generation if AI parsing fails
      console.log('🔄 AI tool parsing failed, using fallback generation');
      return getFallbackTools(stepTitle);
      
    } catch (error) {
      console.error('💥 AI tool generation failed:', error);
      // Fallback to keyword-based generation
      return getFallbackTools(stepTitle);
    }
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
        const userPricing = getUserSpecificPricing(tool);
        if (userPricing.model === 'free') return 0;
        if (userPricing.model === 'freemium') return userPricing.startingPrice || 0;
        if (userPricing.model === 'subscription') return userPricing.startingPrice || 0;
        if (userPricing.model === 'one-time') return userPricing.startingPrice || 0;
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

  const getUserSpecificPricing = (tool: { name: string; description: string; category: string; icon: any; link?: string; pricing: { model: string; startingPrice?: number; currency: string; notes?: string } }) => {
    const { pricing } = tool;
    
    // Define user-specific pricing for common tools
    const userSpecificPricing: Record<string, Record<string, { model: string; startingPrice?: number; currency: string; notes: string }>> = {
      "Notion": {
        solo: { model: "free", currency: "USD", notes: "Free for personal use" },
        team: { model: "subscription", startingPrice: 8, currency: "USD", notes: "Team plan from $8/user/month" },
        enterprise: { model: "subscription", startingPrice: 20, currency: "USD", notes: "Enterprise plan from $20/user/month" }
      },
      "Trello": {
        solo: { model: "free", currency: "USD", notes: "Free for personal use" },
        team: { model: "subscription", startingPrice: 5, currency: "USD", notes: "Team plan from $5/user/month" },
        enterprise: { model: "subscription", startingPrice: 17.50, currency: "USD", notes: "Enterprise plan from $17.50/user/month" }
      },
      "Asana": {
        solo: { model: "free", currency: "USD", notes: "Free for personal use" },
        team: { model: "subscription", startingPrice: 10.99, currency: "USD", notes: "Team plan from $10.99/user/month" },
        enterprise: { model: "subscription", startingPrice: 24.99, currency: "USD", notes: "Enterprise plan from $24.99/user/month" }
      },
      "Slack": {
        solo: { model: "free", currency: "USD", notes: "Free for personal use" },
        team: { model: "subscription", startingPrice: 7.25, currency: "USD", notes: "Team plan from $7.25/user/month" },
        enterprise: { model: "subscription", startingPrice: 12.50, currency: "USD", notes: "Enterprise plan from $12.50/user/month" }
      },
      "Figma": {
        solo: { model: "free", currency: "USD", notes: "Free for personal use" },
        team: { model: "subscription", startingPrice: 12, currency: "USD", notes: "Team plan from $12/user/month" },
        enterprise: { model: "subscription", startingPrice: 45, currency: "USD", notes: "Enterprise plan from $45/user/month" }
      },
      "Monday.com": {
        solo: { model: "subscription", startingPrice: 8, currency: "USD", notes: "Individual plan from $8/month" },
        team: { model: "subscription", startingPrice: 10, currency: "USD", notes: "Team plan from $10/user/month" },
        enterprise: { model: "subscription", startingPrice: 20, currency: "USD", notes: "Enterprise plan from $20/user/month" }
      }
    };

    // Return user-specific pricing if available, otherwise return original pricing
    if (userSpecificPricing[tool.name] && userSpecificPricing[tool.name][userType]) {
      return userSpecificPricing[tool.name][userType];
    }
    
    return pricing;
  };

  const updateGoal = (newGoal: string) => {
    setWorkflowGoal(newGoal);
    // Advance tutorial if user types in goal
    if (showTutorial && tutorialStep === 0 && newGoal.trim()) {
      setTutorialStep(1);
    }
  };

  const handleTutorialNext = () => {
    if (tutorialStep < 2) {
      setTutorialStep(tutorialStep + 1);
    } else {
      setShowTutorial(false);
    }
  };

  const handleTutorialSkip = () => {
    setShowTutorial(false);
  };

  const handleGenerateStepsClick = () => {
    if (workflowGoal.trim()) {
      generateAISteps(workflowGoal);
      // Advance tutorial when generate steps is clicked
      if (showTutorial && tutorialStep === 1) {
        setTutorialStep(2);
      }
    }
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
                      <div className="lg:w-1/3 relative">
                        {/* Tutorial Hint - Outside tutorial block */}
                        {showTutorial && tutorialStep === 0 && (
                          <div className="absolute top-1/3 -right-4 z-20 transform -translate-y-1/2">
                            <div className="flex items-center bg-primary text-primary-foreground px-3 py-2 rounded-lg shadow-lg">
                              <ArrowLeft className="h-4 w-4 mr-2" />
                              <span className="text-sm font-medium">First, type in a goal</span>
                            </div>
                          </div>
                        )}
                     <Card 
                       className={`w-full max-w-md mx-auto shadow-lg border-2 cursor-pointer hover:shadow-xl transition-shadow ${
                         showTutorial && tutorialStep === 0 
                           ? 'border-primary ring-4 ring-primary/30 bg-gradient-to-br from-primary/10 to-primary/5' 
                           : 'border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10'
                       }`}
                       onClick={() => {
                         if (suggestedSteps.length > 0) {
                           setActivePanel("suggested-steps");
                         }
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
                           <div>
                             <label className="text-sm font-medium text-foreground mb-2 block">
                               Who is this flow for?
                             </label>
                             <div className="flex gap-2">
                               <Button
                                 variant={userType === "solo" ? "default" : "outline"}
                                 size="sm"
                                 onClick={() => setUserType("solo")}
                                 className="flex-1"
                               >
                                 <UserPlus className="h-4 w-4 mr-2" />
                                 Solo
                               </Button>
                               <Button
                                 variant={userType === "team" ? "default" : "outline"}
                                 size="sm"
                                 onClick={() => setUserType("team")}
                                 className="flex-1"
                               >
                                 <Users className="h-4 w-4 mr-2" />
                                 Team
                               </Button>
                               <Button
                                 variant={userType === "enterprise" ? "default" : "outline"}
                                 size="sm"
                                 onClick={() => setUserType("enterprise")}
                                 className="flex-1"
                               >
                                 <Building className="h-4 w-4 mr-2" />
                                 Enterprise
                               </Button>
                             </div>
                             <p className="text-xs text-muted-foreground mt-1">
                               This helps AI select better tools based on your needs
                             </p>
                           </div>
                           <div className="flex items-center justify-between">
                             <div className="text-xs text-muted-foreground">
                               Define a clear, measurable goal
                             </div>
                             <Button
                               onClick={handleGenerateStepsClick}
                               disabled={!workflowGoal.trim() || isGeneratingSteps}
                               size="sm"
                               className={`${
                                 showTutorial && tutorialStep === 1 
                                   ? 'bg-primary hover:bg-primary/90 text-primary-foreground ring-4 ring-primary/30' 
                                   : 'bg-accent hover:bg-accent/90 text-accent-foreground'
                               }`}
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

                     {/* Tutorial Hint - Outside goal block, below Generate Steps button */}
                     {showTutorial && tutorialStep === 1 && (
                       <div className="mt-3 flex justify-end">
                         <div className="flex items-center bg-primary text-primary-foreground px-3 py-2 rounded-lg shadow-lg">
                           <ArrowUp className="h-4 w-4 mr-2" />
                           <span className="text-sm font-medium">Now, generate steps</span>
                         </div>
                       </div>
                     )}

                     {/* Miniaturized Step Blocks - Directly below Goal Block */}
                     {steps.length > 0 && (
                       <div className={`mt-3 ${
                         showTutorial && tutorialStep === 2 
                           ? 'ring-4 ring-primary/30 rounded-lg p-2 bg-primary/5' 
                           : ''
                       }`}>
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
                     {activePanel === "suggested-steps" && suggestedSteps.length > 0 ? (
                       /* Suggested Steps Panel */
                       <div>
                         <div className="flex items-center justify-between mb-4">
                           <h3 className="font-semibold text-lg">Suggested Steps</h3>
                           <Badge variant="secondary">{suggestedSteps.length} steps</Badge>
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
                     ) : activePanel === "tools" ? (
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
                                 {currentStepTools.length > 0 ? (
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
                                                 variant={getUserSpecificPricing(tool).model === 'free' ? 'secondary' : 'default'}
                                                 className="text-xs"
                                               >
                                                 {getUserSpecificPricing(tool).model === 'free' ? 'FREE' : getUserSpecificPricing(tool).startingPrice ? `$${getUserSpecificPricing(tool).startingPrice}` : 'PAID'}
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
                                 ) : (
                                   <div className="flex items-center justify-center h-32">
                                     <Card className="w-full max-w-md shadow-lg">
                                       <CardContent className="p-6">
                                         <div className="text-center">
                                           <Info className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                                           <p className="text-sm text-muted-foreground">No tools available for the selected category</p>
                                           <p className="text-xs text-muted-foreground mt-1">Try selecting a different category or "All Tools"</p>
                                         </div>
                                       </CardContent>
                                     </Card>
                                   </div>
                                 )}
                               </div>
                             </div>
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
                     ) : (
                       /* Default State - Tutorial or Empty State */
                       <div className="flex items-center justify-center h-full">
                         {showTutorial ? (
                           /* Tutorial Overlay */
                           <div className="relative w-full max-w-md">
                             {/* Tutorial Step 0: Goal Input */}
                             {tutorialStep === 0 && (
                               <Card className="w-full shadow-lg border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
                                 <CardContent className="p-6">
                                   <div className="text-center">
                                     <p className="text-sm font-medium mb-2">Welcome to Flow Designer</p>
                                     <p className="text-xs text-muted-foreground mb-4">Let's get you started with creating your first flow</p>
                                     <Button onClick={handleTutorialNext} size="sm" className="mr-2">
                                       Next
                                     </Button>
                                     <Button onClick={handleTutorialSkip} variant="outline" size="sm">
                                       Skip Tutorial
                                       </Button>
                                   </div>
                                 </CardContent>
                               </Card>
                             )}

                             {/* Tutorial Step 1: Generate Steps Button */}
                             {tutorialStep === 1 && (
                               <Card className="w-full shadow-lg border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
                                 <CardContent className="p-6">
                                   <div className="text-center">
                                     <Sparkles className="h-12 w-12 mx-auto mb-3 text-primary" />
                                     <p className="text-sm font-medium mb-2">Great! You've entered a goal</p>
                                     <p className="text-xs text-muted-foreground mb-4">Click the "Generate Steps" button to create your workflow</p>
                                     <Button onClick={handleTutorialNext} size="sm" className="mr-2">
                                       Next
                                     </Button>
                                     <Button onClick={handleTutorialSkip} variant="outline" size="sm">
                                       Skip Tutorial
                                       </Button>
                                   </div>
                                 </CardContent>
                               </Card>
                             )}

                             {/* Tutorial Step 2: Flow Steps Section */}
                             {tutorialStep === 2 && (
                               <div className="relative">
                                 <div className="absolute -top-16 -left-8 z-20">
                                   <div className="flex items-center bg-primary text-primary-foreground px-3 py-2 rounded-lg shadow-lg">
                                     <ArrowDown className="h-4 w-4 mr-2" />
                                     <span className="text-sm font-medium">Add steps to your flow</span>
                                   </div>
                                 </div>
                                 <Card className="w-full shadow-lg border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
                                   <CardContent className="p-6">
                                     <div className="text-center">
                                       <List className="h-12 w-12 mx-auto mb-3 text-primary" />
                                       <p className="text-sm font-medium mb-2">Perfect! Steps generated</p>
                                       <p className="text-xs text-muted-foreground mb-4">Click "Add Step" to add steps to your flow, then click on them to add tools</p>
                                       <Button onClick={handleTutorialNext} size="sm">
                                         Finish Tutorial
                                       </Button>
                                     </div>
                                   </CardContent>
                                 </Card>
                               </div>
                             )}
                           </div>
                         ) : (
                           /* Empty State - No Tutorial */
                           <Card className="w-full max-w-md shadow-lg">
                             <CardContent className="p-6">
                               <div className="text-center">
                                 <p className="text-xs text-muted-foreground">Enter a goal and click "Generate Steps" to get started</p>
                               </div>
                             </CardContent>
                           </Card>
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