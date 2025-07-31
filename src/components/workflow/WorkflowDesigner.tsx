import React, { useState, useRef } from "react";
import { motion, useDragControls } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Plus,
  Save,
  Play,
  Settings,
  Trash2,
  Copy,
  Eye,
  Download,
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
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import PermanentDashboard from "../shared/PermanentDashboard";

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
  position: { x: number; y: number };
}

const WorkflowDesigner = () => {
  const navigate = useNavigate();
  const [workflowName, setWorkflowName] = useState("New Flow");
  const [workflowDescription, setWorkflowDescription] = useState("");
  const [workflowGoal, setWorkflowGoal] = useState("");
  const [selectedStep, setSelectedStep] = useState<string | null>(null);
  const [goalPosition, setGoalPosition] = useState({ x: 50, y: 50 });
  const [steps, setSteps] = useState<FlowStep[]>([
    {
      id: "1",
      title: "Project Planning",
      description: "Define project scope and objectives",
      type: "milestone",
      status: "pending",
      estimatedTime: 8,
      cost: 500,
      dependencies: [],
      position: { x: 100, y: 100 },
    },
    {
      id: "2",
      title: "Research & Analysis",
      description: "Gather requirements and analyze market",
      type: "task",
      status: "pending",
      assignee: "Alex Johnson",
      estimatedTime: 16,
      cost: 1200,
      dependencies: ["1"],
      position: { x: 300, y: 100 },
    },
    {
      id: "3",
      title: "Design Phase",
      description: "Create wireframes and mockups",
      type: "task",
      status: "pending",
      assignee: "Sarah Chen",
      estimatedTime: 24,
      cost: 1800,
      dependencies: ["2"],
      position: { x: 500, y: 100 },
    },
  ]);

  // AI-powered step suggestions
  const [isGeneratingSteps, setIsGeneratingSteps] = useState(false);
  const [suggestedSteps, setSuggestedSteps] = useState<Array<{ title: string; description: string; type: FlowStep["type"]; icon: any; color: string }>>([]);

  const generateAISteps = async (goal: string) => {
    if (!goal.trim()) return;
    
    setIsGeneratingSteps(true);
    
    try {
      // Simulate AI API call with intelligent step generation
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API delay
      
      const aiSteps = await generateStepsWithAI(goal);
      setSuggestedSteps(aiSteps);
    } catch (error) {
      console.error('Error generating AI steps:', error);
      // Fallback to basic steps
      setSuggestedSteps(getFallbackSteps(goal));
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
    const isCreative = lowerGoal.includes('design') || lowerGoal.includes('creative') || lowerGoal.includes('art') || lowerGoal.includes('content');
    const isTechnical = lowerGoal.includes('development') || lowerGoal.includes('coding') || lowerGoal.includes('software') || lowerGoal.includes('app');
    const isMarketing = lowerGoal.includes('marketing') || lowerGoal.includes('promotion') || lowerGoal.includes('advertising') || lowerGoal.includes('campaign');
    const isSales = lowerGoal.includes('sales') || lowerGoal.includes('revenue') || lowerGoal.includes('conversion') || lowerGoal.includes('leads');
    const isEvent = lowerGoal.includes('event') || lowerGoal.includes('conference') || lowerGoal.includes('meeting') || lowerGoal.includes('workshop');
    const isProduct = lowerGoal.includes('product') || lowerGoal.includes('launch') || lowerGoal.includes('development') || lowerGoal.includes('create');
    const isCustomer = lowerGoal.includes('customer') || lowerGoal.includes('user') || lowerGoal.includes('onboarding') || lowerGoal.includes('support');
    
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

  const addStep = (suggestedStep: { title: string; description: string; type: FlowStep["type"]; icon: any; color: string }) => {
    const newStep: FlowStep = {
      id: Date.now().toString(),
      title: suggestedStep.title,
      description: suggestedStep.description,
      type: suggestedStep.type,
      status: "pending",
      dependencies: [],
      position: { x: Math.random() * 400 + 100, y: Math.random() * 300 + 100 },
    };
    setSteps([...steps, newStep]);
  };

  const updateStep = (id: string, updates: Partial<FlowStep>) => {
    setSteps(steps.map(step => step.id === id ? { ...step, ...updates } : step));
  };

  const deleteStep = (id: string) => {
    setSteps(steps.filter(step => step.id !== id));
    if (selectedStep === id) {
      setSelectedStep(null);
    }
  };

  const calculateTotalCost = () => {
    return steps.reduce((total, step) => total + (step.cost || 0), 0);
  };

  const calculateTotalTime = () => {
    return steps.reduce((total, step) => total + (step.estimatedTime || 0), 0);
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

  const handleStepDrag = (stepId: string, info: any) => {
    // Get the canvas container
    const canvas = document.querySelector('.canvas-container');
    if (!canvas) return;
    
    const canvasRect = canvas.getBoundingClientRect();
    
    // Calculate position relative to canvas
    const newPosition = {
      x: info.point.x - canvasRect.left,
      y: info.point.y - canvasRect.top
    };
    
    // Ensure the block stays within canvas bounds
    const maxX = canvasRect.width - 256; // Card width
    const maxY = canvasRect.height - 200; // Approximate card height
    
    newPosition.x = Math.max(0, Math.min(newPosition.x, maxX));
    newPosition.y = Math.max(0, Math.min(newPosition.y, maxY));
    
    if (stepId === "goal") {
      setGoalPosition(newPosition);
    } else {
      setSteps(steps.map(step => 
        step.id === stepId ? { ...step, position: newPosition } : step
      ));
    }
  };

  const updateGoal = (newGoal: string) => {
    setWorkflowGoal(newGoal);
    // Update or create goal step
    const goalStepIndex = steps.findIndex(step => step.type === "goal");
    if (goalStepIndex >= 0) {
      // Update existing goal step
      setSteps(steps.map((step, index) => 
        index === goalStepIndex 
          ? { ...step, title: newGoal, description: `Goal: ${newGoal}` }
          : step
      ));
    } else if (newGoal.trim()) {
      // Create new goal step
      const newGoalStep: FlowStep = {
        id: "goal",
        title: newGoal,
        description: `Goal: ${newGoal}`,
        type: "goal",
        status: "pending",
        dependencies: [],
        position: goalPosition,
      };
      setSteps([newGoalStep, ...steps]);
    }
  };

  return (
    <PermanentDashboard>
      <div className="flex-1 flex flex-col h-full">
        {/* Header */}
        <div className="border-b bg-white px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/workflows")}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Flows
              </Button>
              <Separator orientation="vertical" className="h-6" />
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
              <Button variant="outline" size="sm">
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button>
                <Save className="h-4 w-4 mr-2" />
                Save Flow
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Sidebar - Step Library */}
          <div className="w-80 border-r bg-gray-50 p-4 overflow-y-auto">
                         <div className="mb-6">
               <h3 className="font-semibold mb-3">Add Goal</h3>
               <div className="space-y-3">
                 <div>
                   <label className="text-sm font-medium text-gray-700 mb-2 block">
                     What is the goal of this flow?
                   </label>
                                       <Textarea
                      value={workflowGoal}
                      onChange={(e) => updateGoal(e.target.value)}
                      placeholder="e.g., Launch a new product, Optimize customer onboarding, Create a marketing campaign..."
                      className="w-full"
                      rows={3}
                    />
                 </div>
                 <div className="text-xs text-gray-500">
                   Define a clear, measurable goal to help guide your flow design and track success.
                 </div>
                 <Button
                   onClick={() => generateAISteps(workflowGoal)}
                   disabled={!workflowGoal.trim() || isGeneratingSteps}
                   className="w-full"
                   size="sm"
                 >
                   {isGeneratingSteps ? (
                     <>
                       <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                       AI is thinking...
                     </>
                   ) : (
                     <>
                       <Sparkles className="h-4 w-4 mr-2" />
                       Generate AI Steps
                     </>
                   )}
                 </Button>
               </div>
             </div>

            <Separator className="my-4" />

                         <div className="mb-6">
               <h3 className="font-semibold mb-3">AI Suggested Steps</h3>
               <div className="space-y-2">
                 {isGeneratingSteps ? (
                   <div className="text-center text-muted-foreground py-4">
                     <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                     <p className="text-sm">AI is analyzing your goal and generating intelligent steps...</p>
                   </div>
                 ) : suggestedSteps.length > 0 ? (
                   <>
                     <div className="flex items-center justify-between mb-3">
                       <span className="text-sm text-muted-foreground">Generated {suggestedSteps.length} steps</span>
                       <Button
                         variant="ghost"
                         size="sm"
                         onClick={() => generateAISteps(workflowGoal)}
                         disabled={!workflowGoal.trim()}
                       >
                         <Sparkles className="h-3 w-3 mr-1" />
                         Regenerate
                       </Button>
                     </div>
                     {suggestedSteps.map((suggestedStep, index) => (
                       <Button
                         key={index}
                         variant="outline"
                         className="w-full justify-start"
                         onClick={() => addStep(suggestedStep)}
                       >
                         <suggestedStep.icon className={`h-4 w-4 mr-2 ${suggestedStep.color.replace('bg-', 'text-')}`} />
                         <div className="text-left">
                           <div className="font-medium">{suggestedStep.title}</div>
                           <div className="text-xs text-muted-foreground">{suggestedStep.description}</div>
                         </div>
                       </Button>
                     ))}
                   </>
                 ) : workflowGoal ? (
                   <div className="text-center text-muted-foreground py-4">
                     <Sparkles className="h-8 w-8 mx-auto mb-2 opacity-50" />
                     <p className="text-sm">Click "Generate AI Steps" to get intelligent suggestions</p>
                   </div>
                 ) : (
                   <div className="text-center text-muted-foreground py-4">
                     <Info className="h-8 w-8 mx-auto mb-2 opacity-50" />
                     <p className="text-sm">Set a goal and generate AI steps</p>
                   </div>
                 )}
               </div>
             </div>

            <Separator className="my-4" />

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
                   <Badge variant="secondary">{steps.length}</Badge>
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

            <Separator className="my-4" />

            <div>
              <h3 className="font-semibold mb-3">Quick Actions</h3>
              <div className="space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Copy className="h-4 w-4 mr-2" />
                  Duplicate Flow
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Settings className="h-4 w-4 mr-2" />
                  Flow Settings
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Play className="h-4 w-4 mr-2" />
                  Test Flow
                </Button>
              </div>
            </div>
          </div>

          {/* Center - Flow Canvas */}
          <div className="flex-1 bg-white relative overflow-auto">
            <div className="p-6 min-h-full">
                             <div className="canvas-container relative w-full h-full min-h-[600px] bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                                   {/* Goal Block */}
                  {workflowGoal && (
                    <motion.div
                      drag
                      dragMomentum={false}
                      dragElastic={0}
                      dragConstraints={false}
                      onDragEnd={(event, info) => handleStepDrag("goal", info)}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      whileDrag={{ scale: 1.05, zIndex: 10 }}
                      className={`absolute cursor-move ${
                        selectedStep === "goal" ? 'ring-2 ring-purple-500' : ''
                      }`}
                      style={{
                        left: goalPosition.x,
                        top: goalPosition.y,
                      }}
                      onClick={() => setSelectedStep("goal")}
                    >
                     <Card className="w-72 shadow-lg border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
                       <CardHeader className="pb-2">
                         <div className="flex items-center justify-between">
                           <div className="flex items-center space-x-2">
                             <div className="w-4 h-4 rounded-full bg-gradient-to-r from-purple-500 to-pink-500" />
                             <Badge variant="outline" className="text-xs bg-purple-100 text-purple-800 border-purple-300">
                               Goal
                             </Badge>
                           </div>
                           <Button
                             variant="ghost"
                             size="sm"
                             onClick={(e) => {
                               e.stopPropagation();
                               setWorkflowGoal("");
                               setSteps(steps.filter(step => step.type !== "goal"));
                             }}
                           >
                             <Trash2 className="h-3 w-3" />
                           </Button>
                         </div>
                         <CardTitle className="text-sm font-bold text-purple-900">{workflowGoal}</CardTitle>
                       </CardHeader>
                       <CardContent className="pt-0">
                         <CardDescription className="text-xs mb-2 text-purple-700">
                           This is the main objective of your workflow
                         </CardDescription>
                       </CardContent>
                     </Card>
                   </motion.div>
                 )}
                 
                                   {/* Step Blocks */}
                  {steps.filter(step => step.type !== "goal").map((step) => (
                    <motion.div
                      key={step.id}
                      drag
                      dragMomentum={false}
                      dragElastic={0}
                      dragConstraints={false}
                      onDragEnd={(event, info) => handleStepDrag(step.id, info)}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      whileDrag={{ scale: 1.05, zIndex: 10 }}
                      className={`absolute cursor-move ${
                        selectedStep === step.id ? 'ring-2 ring-blue-500' : ''
                      }`}
                      style={{
                        left: step.position.x,
                        top: step.position.y,
                      }}
                      onClick={() => setSelectedStep(step.id)}
                    >
                     <Card className="w-64 shadow-lg">
                       <CardHeader className="pb-2">
                         <div className="flex items-center justify-between">
                           <div className="flex items-center space-x-2">
                             <div className={`w-3 h-3 rounded-full ${getStepColor(step)}`} />
                             <Badge variant="outline" className="text-xs">
                               {step.type}
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
                         <CardTitle className="text-sm">{step.title}</CardTitle>
                       </CardHeader>
                       <CardContent className="pt-0">
                         <CardDescription className="text-xs mb-2">
                           {step.description || "No description"}
                         </CardDescription>
                         <div className="space-y-1 text-xs text-muted-foreground">
                           {step.assignee && (
                             <div className="flex items-center">
                               <Users className="h-3 w-3 mr-1" />
                               {step.assignee}
                             </div>
                           )}
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
                       </CardContent>
                     </Card>
                   </motion.div>
                 ))}
               </div>
            </div>
          </div>

                     {/* Right Sidebar - Step Properties */}
           <div className="w-80 border-l bg-gray-50 p-4 overflow-y-auto">
             {selectedStep ? (
               <div>
                 <div className="flex items-center justify-between mb-4">
                   <h3 className="font-semibold">
                     {selectedStep === "goal" ? "Goal Properties" : "Step Properties"}
                   </h3>
                   <Button
                     variant="ghost"
                     size="sm"
                     onClick={() => setSelectedStep(null)}
                   >
                     ×
                   </Button>
                 </div>
                 
                 {selectedStep === "goal" ? (
                   <div className="space-y-4">
                     <div>
                       <label className="text-sm font-medium">Goal</label>
                       <Textarea
                         value={workflowGoal}
                         onChange={(e) => updateGoal(e.target.value)}
                         className="mt-1"
                         rows={3}
                         placeholder="Enter your workflow goal..."
                       />
                     </div>
                     <div className="text-xs text-muted-foreground">
                       The goal defines the main objective of your workflow. All steps should contribute to achieving this goal.
                     </div>
                   </div>
                 ) : (
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
                       <div className="grid grid-cols-2 gap-4">
                         <div>
                           <label className="text-sm font-medium">Estimated Time (hours)</label>
                           <Input
                             type="number"
                             value={steps.find(s => s.id === selectedStep)?.estimatedTime || ""}
                             onChange={(e) => updateStep(selectedStep, { estimatedTime: parseInt(e.target.value) || 0 })}
                             className="mt-1"
                           />
                         </div>
                         <div>
                           <label className="text-sm font-medium">Cost ($)</label>
                           <Input
                             type="number"
                             value={steps.find(s => s.id === selectedStep)?.cost || ""}
                             onChange={(e) => updateStep(selectedStep, { cost: parseInt(e.target.value) || 0 })}
                             className="mt-1"
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
                 )}
               </div>
             ) : (
               <div className="text-center text-muted-foreground py-8">
                 <Info className="h-12 w-12 mx-auto mb-4 opacity-50" />
                 <p>Select a step or goal to edit its properties</p>
               </div>
             )}
           </div>
        </div>
      </div>
    </PermanentDashboard>
  );
};

export default WorkflowDesigner; 