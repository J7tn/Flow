import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Template,
  Search,
  Filter,
  Plus,
  Star,
  Download,
  Eye,
  X,
} from "lucide-react";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Input } from "./ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Badge } from "./ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";

const FlowTemplates = () => {
  const navigate = useNavigate();
  const [previewTemplate, setPreviewTemplate] = useState<any>(null);

  const templates = [
    {
      id: "1",
      title: "Project Management Workflow",
      description:
        "Complete project management workflow with milestones, tasks, and team collaboration",
      category: "Business",
      steps: 12,
      rating: 4.8,
      downloads: 1250,
      tags: ["Project Management", "Team Collaboration", "Milestones"],
      author: "Flow Team",
      featured: true,
      difficulty: "Intermediate",
      workflowSteps: [
        {
          id: "1",
          title: "Project Initiation",
          description: "Define project scope and objectives",
          type: "milestone",
        },
        {
          id: "2",
          title: "Team Assembly",
          description: "Assign team members and roles",
          type: "task",
        },
        {
          id: "3",
          title: "Planning Phase",
          description: "Create detailed project plan",
          type: "task",
        },
        {
          id: "4",
          title: "Resource Allocation",
          description: "Allocate budget and resources",
          type: "resource",
        },
        {
          id: "5",
          title: "Milestone 1",
          description: "Complete initial planning",
          type: "milestone",
        },
        {
          id: "6",
          title: "Development Phase",
          description: "Execute project tasks",
          type: "task",
        },
        {
          id: "7",
          title: "Quality Review",
          description: "Review and test deliverables",
          type: "task",
        },
        {
          id: "8",
          title: "Milestone 2",
          description: "Complete development phase",
          type: "milestone",
        },
        {
          id: "9",
          title: "Testing & Validation",
          description: "Comprehensive testing",
          type: "task",
        },
        {
          id: "10",
          title: "Documentation",
          description: "Create project documentation",
          type: "task",
        },
        {
          id: "11",
          title: "Final Review",
          description: "Stakeholder approval",
          type: "decision",
        },
        {
          id: "12",
          title: "Project Completion",
          description: "Project handover and closure",
          type: "milestone",
        },
      ],
    },
    {
      id: "2",
      title: "Content Creation Pipeline",
      description:
        "From ideation to publication - streamlined content creation workflow",
      category: "Creative",
      steps: 8,
      rating: 4.6,
      downloads: 890,
      tags: ["Content", "Publishing", "Creative"],
      author: "Creative Studio",
      featured: true,
      difficulty: "Beginner",
      workflowSteps: [
        {
          id: "1",
          title: "Content Ideation",
          description: "Brainstorm and research content ideas",
          type: "task",
        },
        {
          id: "2",
          title: "Content Planning",
          description: "Create content calendar and outline",
          type: "task",
        },
        {
          id: "3",
          title: "Content Creation",
          description: "Write, design, or produce content",
          type: "task",
        },
        {
          id: "4",
          title: "Review & Edit",
          description: "Review content for quality and accuracy",
          type: "task",
        },
        {
          id: "5",
          title: "Approval Process",
          description: "Get stakeholder approval",
          type: "decision",
        },
        {
          id: "6",
          title: "Content Optimization",
          description: "Optimize for SEO and engagement",
          type: "task",
        },
        {
          id: "7",
          title: "Publishing",
          description: "Publish content to platforms",
          type: "task",
        },
        {
          id: "8",
          title: "Promotion & Distribution",
          description: "Share and promote content",
          type: "task",
        },
      ],
    },
    {
      id: "3",
      title: "Product Launch Campaign",
      description:
        "Comprehensive product launch workflow covering marketing, PR, and sales",
      category: "Marketing",
      steps: 15,
      rating: 4.9,
      downloads: 2100,
      tags: ["Marketing", "Product Launch", "Campaign"],
      author: "Marketing Pro",
      featured: true,
      difficulty: "Advanced",
      workflowSteps: [
        {
          id: "1",
          title: "Market Research",
          description: "Analyze target market and competitors",
          type: "task",
        },
        {
          id: "2",
          title: "Product Positioning",
          description: "Define unique value proposition",
          type: "task",
        },
        {
          id: "3",
          title: "Campaign Strategy",
          description: "Develop comprehensive marketing strategy",
          type: "task",
        },
        {
          id: "4",
          title: "Content Creation",
          description: "Create marketing materials and content",
          type: "task",
        },
        {
          id: "5",
          title: "Channel Setup",
          description: "Prepare marketing channels and platforms",
          type: "task",
        },
        {
          id: "6",
          title: "PR & Media Outreach",
          description: "Engage with media and influencers",
          type: "task",
        },
        {
          id: "7",
          title: "Pre-launch Campaign",
          description: "Build anticipation and awareness",
          type: "milestone",
        },
        {
          id: "8",
          title: "Launch Event",
          description: "Execute product launch event",
          type: "milestone",
        },
        {
          id: "9",
          title: "Post-launch Marketing",
          description: "Sustain momentum after launch",
          type: "task",
        },
        {
          id: "10",
          title: "Performance Tracking",
          description: "Monitor and analyze campaign performance",
          type: "task",
        },
        {
          id: "11",
          title: "Optimization",
          description: "Optimize based on performance data",
          type: "task",
        },
        {
          id: "12",
          title: "Campaign Review",
          description: "Evaluate overall campaign success",
          type: "decision",
        },
        {
          id: "13",
          title: "Follow-up Strategy",
          description: "Plan next phase marketing activities",
          type: "task",
        },
        {
          id: "14",
          title: "Documentation",
          description: "Document learnings and best practices",
          type: "task",
        },
        {
          id: "15",
          title: "Campaign Closure",
          description: "Finalize campaign and report results",
          type: "milestone",
        },
      ],
    },
    {
      id: "4",
      title: "Personal Goal Achievement",
      description:
        "Step-by-step personal goal setting and achievement workflow",
      category: "Personal",
      steps: 6,
      rating: 4.5,
      downloads: 650,
      tags: ["Personal Development", "Goals", "Habits"],
      author: "Life Coach",
      featured: false,
      difficulty: "Beginner",
      workflowSteps: [
        {
          id: "1",
          title: "Goal Definition",
          description: "Clearly define your personal goal",
          type: "task",
        },
        {
          id: "2",
          title: "Goal Analysis",
          description: "Break down goal into smaller objectives",
          type: "task",
        },
        {
          id: "3",
          title: "Action Planning",
          description: "Create specific action steps",
          type: "task",
        },
        {
          id: "4",
          title: "Timeline Creation",
          description: "Set realistic deadlines and milestones",
          type: "task",
        },
        {
          id: "5",
          title: "Progress Tracking",
          description: "Monitor and track your progress",
          type: "task",
        },
        {
          id: "6",
          title: "Goal Achievement",
          description: "Celebrate reaching your goal",
          type: "milestone",
        },
      ],
    },
    {
      id: "5",
      title: "Software Development Cycle",
      description:
        "Agile software development workflow with sprints and code reviews",
      category: "Development",
      steps: 10,
      rating: 4.7,
      downloads: 1800,
      tags: ["Development", "Agile", "Code Review"],
      author: "Dev Team",
      featured: false,
      difficulty: "Advanced",
      workflowSteps: [
        {
          id: "1",
          title: "Sprint Planning",
          description: "Plan sprint goals and tasks",
          type: "task",
        },
        {
          id: "2",
          title: "Requirements Analysis",
          description: "Analyze and refine requirements",
          type: "task",
        },
        {
          id: "3",
          title: "Design & Architecture",
          description: "Create technical design",
          type: "task",
        },
        {
          id: "4",
          title: "Development",
          description: "Code implementation",
          type: "task",
        },
        {
          id: "5",
          title: "Unit Testing",
          description: "Write and run unit tests",
          type: "task",
        },
        {
          id: "6",
          title: "Code Review",
          description: "Peer review of code changes",
          type: "decision",
        },
        {
          id: "7",
          title: "Integration Testing",
          description: "Test integrated components",
          type: "task",
        },
        {
          id: "8",
          title: "Quality Assurance",
          description: "Comprehensive QA testing",
          type: "task",
        },
        {
          id: "9",
          title: "Sprint Review",
          description: "Demo completed features",
          type: "milestone",
        },
        {
          id: "10",
          title: "Sprint Retrospective",
          description: "Reflect on sprint performance",
          type: "task",
        },
      ],
    },
    {
      id: "6",
      title: "Event Planning Workflow",
      description: "Complete event planning from concept to execution",
      category: "Business",
      steps: 14,
      rating: 4.4,
      downloads: 720,
      tags: ["Event Planning", "Organization", "Coordination"],
      author: "Event Planner",
      featured: false,
      difficulty: "Intermediate",
      workflowSteps: [
        {
          id: "1",
          title: "Event Concept",
          description: "Define event purpose and theme",
          type: "task",
        },
        {
          id: "2",
          title: "Budget Planning",
          description: "Create detailed budget plan",
          type: "resource",
        },
        {
          id: "3",
          title: "Venue Selection",
          description: "Research and book venue",
          type: "task",
        },
        {
          id: "4",
          title: "Vendor Coordination",
          description: "Hire and coordinate vendors",
          type: "task",
        },
        {
          id: "5",
          title: "Marketing & Promotion",
          description: "Promote event to target audience",
          type: "task",
        },
        {
          id: "6",
          title: "Registration Setup",
          description: "Set up registration system",
          type: "task",
        },
        {
          id: "7",
          title: "Logistics Planning",
          description: "Plan event day logistics",
          type: "task",
        },
        {
          id: "8",
          title: "Final Preparations",
          description: "Complete pre-event preparations",
          type: "milestone",
        },
        {
          id: "9",
          title: "Event Execution",
          description: "Manage event on the day",
          type: "milestone",
        },
        {
          id: "10",
          title: "Post-Event Activities",
          description: "Follow up and gather feedback",
          type: "task",
        },
        {
          id: "11",
          title: "Event Analysis",
          description: "Analyze event success and ROI",
          type: "task",
        },
        {
          id: "12",
          title: "Documentation",
          description: "Document lessons learned",
          type: "task",
        },
        {
          id: "13",
          title: "Vendor Payments",
          description: "Process final payments",
          type: "task",
        },
        {
          id: "14",
          title: "Event Closure",
          description: "Complete event wrap-up",
          type: "milestone",
        },
      ],
    },
  ];

  const categories = [
    "All",
    "Business",
    "Creative",
    "Marketing",
    "Personal",
    "Development",
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner":
        return "secondary";
      case "Intermediate":
        return "outline";
      case "Advanced":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const handlePreview = (template: any) => {
    setPreviewTemplate(template);
  };

  const handleUseTemplate = (template: any) => {
    navigate("/workflow/new", { state: { template } });
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-3 w-3 ${i < Math.floor(rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
      />
    ));
  };

  return (
    <div className="flex h-screen bg-background">
      <div className="flex-1 p-6">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold tracking-tight">
              Flow Templates
            </h1>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Template
            </Button>
          </div>
          <p className="text-muted-foreground">
            Discover and use pre-built workflow templates to get started
            quickly.
          </p>
        </div>

        <div className="flex items-center space-x-4 mb-6">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search templates..." className="pl-8" />
          </div>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>

        <Tabs defaultValue="all" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            {categories.map((category) => (
              <TabsTrigger key={category} value={category.toLowerCase()}>
                {category}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="all" className="space-y-6">
            {/* Featured Templates */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Featured Templates</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {templates
                  .filter((template) => template.featured)
                  .map((template) => (
                    <Card
                      key={template.id}
                      className="overflow-hidden hover:shadow-lg transition-shadow"
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <Badge variant="secondary" className="mb-2">
                            <Star className="h-3 w-3 mr-1 fill-current" />
                            Featured
                          </Badge>
                          <Badge
                            variant={getDifficultyColor(template.difficulty)}
                          >
                            {template.difficulty}
                          </Badge>
                        </div>
                        <CardTitle className="text-lg">
                          {template.title}
                        </CardTitle>
                        <CardDescription className="text-sm">
                          {template.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">
                            {template.steps} steps
                          </span>
                          <div className="flex items-center space-x-1">
                            {renderStars(template.rating)}
                            <span className="text-xs text-muted-foreground ml-1">
                              ({template.rating})
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-1">
                          {template.tags.slice(0, 2).map((tag) => (
                            <Badge
                              key={tag}
                              variant="outline"
                              className="text-xs"
                            >
                              {tag}
                            </Badge>
                          ))}
                          {template.tags.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{template.tags.length - 2}
                            </Badge>
                          )}
                        </div>

                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>by {template.author}</span>
                          <div className="flex items-center space-x-1">
                            <Download className="h-3 w-3" />
                            <span>{template.downloads.toLocaleString()}</span>
                          </div>
                        </div>

                        <div className="flex space-x-2 pt-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1"
                            onClick={() => handlePreview(template)}
                          >
                            <Eye className="h-3 w-3 mr-1" />
                            Preview
                          </Button>
                          <Button
                            size="sm"
                            className="flex-1"
                            onClick={() => handleUseTemplate(template)}
                          >
                            Use Template
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </div>

            {/* All Templates */}
            <div>
              <h2 className="text-xl font-semibold mb-4">All Templates</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {templates.map((template) => (
                  <Card
                    key={template.id}
                    className="overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <Badge variant="outline">{template.category}</Badge>
                        <Badge
                          variant={getDifficultyColor(template.difficulty)}
                        >
                          {template.difficulty}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg">
                        {template.title}
                      </CardTitle>
                      <CardDescription className="text-sm">
                        {template.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                          {template.steps} steps
                        </span>
                        <div className="flex items-center space-x-1">
                          {renderStars(template.rating)}
                          <span className="text-xs text-muted-foreground ml-1">
                            ({template.rating})
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1">
                        {template.tags.slice(0, 2).map((tag) => (
                          <Badge
                            key={tag}
                            variant="outline"
                            className="text-xs"
                          >
                            {tag}
                          </Badge>
                        ))}
                        {template.tags.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{template.tags.length - 2}
                          </Badge>
                        )}
                      </div>

                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>by {template.author}</span>
                        <div className="flex items-center space-x-1">
                          <Download className="h-3 w-3" />
                          <span>{template.downloads.toLocaleString()}</span>
                        </div>
                      </div>

                      <div className="flex space-x-2 pt-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          <Eye className="h-3 w-3 mr-1" />
                          Preview
                        </Button>
                        <Button size="sm" className="flex-1">
                          Use Template
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          {categories.slice(1).map((category) => (
            <TabsContent
              key={category}
              value={category.toLowerCase()}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {templates
                  .filter((template) => template.category === category)
                  .map((template) => (
                    <Card
                      key={template.id}
                      className="overflow-hidden hover:shadow-lg transition-shadow"
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <Badge variant="outline">{template.category}</Badge>
                          <Badge
                            variant={getDifficultyColor(template.difficulty)}
                          >
                            {template.difficulty}
                          </Badge>
                        </div>
                        <CardTitle className="text-lg">
                          {template.title}
                        </CardTitle>
                        <CardDescription className="text-sm">
                          {template.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">
                            {template.steps} steps
                          </span>
                          <div className="flex items-center space-x-1">
                            {renderStars(template.rating)}
                            <span className="text-xs text-muted-foreground ml-1">
                              ({template.rating})
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-1">
                          {template.tags.slice(0, 2).map((tag) => (
                            <Badge
                              key={tag}
                              variant="outline"
                              className="text-xs"
                            >
                              {tag}
                            </Badge>
                          ))}
                          {template.tags.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{template.tags.length - 2}
                            </Badge>
                          )}
                        </div>

                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>by {template.author}</span>
                          <div className="flex items-center space-x-1">
                            <Download className="h-3 w-3" />
                            <span>{template.downloads.toLocaleString()}</span>
                          </div>
                        </div>

                        <div className="flex space-x-2 pt-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1"
                            onClick={() => handlePreview(template)}
                          >
                            <Eye className="h-3 w-3 mr-1" />
                            Preview
                          </Button>
                          <Button
                            size="sm"
                            className="flex-1"
                            onClick={() => handleUseTemplate(template)}
                          >
                            Use Template
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>

      {/* Preview Dialog */}
      <Dialog
        open={!!previewTemplate}
        onOpenChange={() => setPreviewTemplate(null)}
      >
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>{previewTemplate?.title} - Workflow Preview</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setPreviewTemplate(null)}
              >
                <X className="h-4 w-4" />
              </Button>
            </DialogTitle>
            <DialogDescription>
              {previewTemplate?.description}
            </DialogDescription>
          </DialogHeader>

          {previewTemplate && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Badge variant="outline">{previewTemplate.category}</Badge>
                  <Badge
                    variant={getDifficultyColor(previewTemplate.difficulty)}
                  >
                    {previewTemplate.difficulty}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {previewTemplate.steps} steps
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  {renderStars(previewTemplate.rating)}
                  <span className="text-sm text-muted-foreground ml-1">
                    ({previewTemplate.rating})
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {previewTemplate.tags.map((tag: string) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Workflow Steps</h3>
                <div className="space-y-3">
                  {previewTemplate.workflowSteps?.map(
                    (step: any, index: number) => (
                      <div
                        key={step.id}
                        className="flex items-start space-x-3 p-3 border rounded-lg"
                      >
                        <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium">{step.title}</h4>
                            <Badge variant="outline" className="text-xs">
                              {step.type}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {step.description}
                          </p>
                        </div>
                      </div>
                    ),
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t">
                <div className="text-sm text-muted-foreground">
                  Created by {previewTemplate.author} •{" "}
                  {previewTemplate.downloads.toLocaleString()} downloads
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setPreviewTemplate(null)}
                  >
                    Close
                  </Button>
                  <Button onClick={() => handleUseTemplate(previewTemplate)}>
                    Use This Template
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FlowTemplates;
