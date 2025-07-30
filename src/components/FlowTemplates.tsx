import React from "react";
import {
  Template,
  Search,
  Filter,
  Plus,
  Star,
  Download,
  Eye,
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

const FlowTemplates = () => {
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
                          >
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
                          >
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
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
};

export default FlowTemplates;
