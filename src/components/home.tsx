import React from "react";
import { Link } from "react-router-dom";
import {
  PlusCircle,
  Settings,
  User,
  Search,
  Clock,
  Calendar,
  BarChart,
} from "lucide-react";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Input } from "./ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";

const Home = () => {
  // Mock data for workflows
  const recentWorkflows = [
    {
      id: "1",
      title: "Product Launch Campaign",
      description: "Marketing workflow for Q2 product launch",
      progress: 75,
      dueDate: "2023-06-15",
      tags: ["Marketing", "High Priority"],
      collaborators: [
        {
          id: "1",
          name: "Alex",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
        },
        {
          id: "2",
          name: "Jamie",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jamie",
        },
      ],
    },
    {
      id: "2",
      title: "Website Redesign",
      description: "UX improvements and visual refresh",
      progress: 40,
      dueDate: "2023-07-30",
      tags: ["Design", "Development"],
      collaborators: [
        {
          id: "3",
          name: "Taylor",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Taylor",
        },
      ],
    },
    {
      id: "3",
      title: "Quarterly Budget Review",
      description: "Financial planning and resource allocation",
      progress: 20,
      dueDate: "2023-06-30",
      tags: ["Finance", "Planning"],
      collaborators: [
        {
          id: "4",
          name: "Morgan",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Morgan",
        },
        {
          id: "5",
          name: "Casey",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Casey",
        },
      ],
    },
  ];

  const templateWorkflows = [
    {
      id: "4",
      title: "Project Management",
      description: "Standard project management workflow with milestones",
      steps: 12,
      category: "Business",
    },
    {
      id: "5",
      title: "Content Creation",
      description: "From ideation to publication workflow",
      steps: 8,
      category: "Creative",
    },
    {
      id: "6",
      title: "Personal Goal Setting",
      description: "Step-by-step goal achievement process",
      steps: 6,
      category: "Personal",
    },
  ];

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className="w-64 border-r bg-card p-4 flex flex-col">
        <div className="flex items-center mb-8">
          <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center mr-2">
            <span className="text-primary-foreground font-bold">F</span>
          </div>
          <h1 className="text-xl font-bold">Flow</h1>
        </div>

        <nav className="space-y-1 flex-1">
          <Link
            to="/"
            className="flex items-center px-3 py-2 text-sm rounded-md bg-accent text-accent-foreground"
          >
            <BarChart className="mr-2 h-4 w-4" />
            Dashboard
          </Link>
          <Link
            to="/workflows"
            className="flex items-center px-3 py-2 text-sm rounded-md hover:bg-accent hover:text-accent-foreground"
          >
            <Clock className="mr-2 h-4 w-4" />
            My Workflows
          </Link>
          <Link
            to="/calendar"
            className="flex items-center px-3 py-2 text-sm rounded-md hover:bg-accent hover:text-accent-foreground"
          >
            <Calendar className="mr-2 h-4 w-4" />
            Calendar
          </Link>
          <Link
            to="/settings"
            className="flex items-center px-3 py-2 text-sm rounded-md hover:bg-accent hover:text-accent-foreground"
          >
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Link>
        </nav>

        <div className="mt-auto pt-4 border-t">
          <div className="flex items-center px-3 py-2">
            <Avatar className="h-8 w-8 mr-2">
              <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=user" />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">User Name</p>
              <p className="text-xs text-muted-foreground">user@example.com</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <header className="border-b bg-card p-4 sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search workflows..." className="pl-8" />
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <User className="h-4 w-4 mr-2" />
                Invite Team
              </Button>
              <Button size="sm">
                <PlusCircle className="h-4 w-4 mr-2" />
                New Workflow
              </Button>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-6">
          <div className="mb-8">
            <h2 className="text-3xl font-bold tracking-tight mb-2">
              Welcome back!
            </h2>
            <p className="text-muted-foreground">
              Track your progress and create new workflows.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Active Workflows
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">7</div>
                <p className="text-xs text-muted-foreground">
                  +2 from last week
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Completed Tasks
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">24</div>
                <p className="text-xs text-muted-foreground">
                  +8 from last week
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Overall Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">68%</div>
                <Progress value={68} className="mt-2" />
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="recent" className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <TabsList>
                <TabsTrigger value="recent">Recent Workflows</TabsTrigger>
                <TabsTrigger value="templates">Templates</TabsTrigger>
              </TabsList>
              <Button variant="outline" size="sm">
                View All
              </Button>
            </div>

            <TabsContent value="recent" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {recentWorkflows.map((workflow) => (
                  <Card key={workflow.id} className="overflow-hidden">
                    <CardHeader>
                      <CardTitle>{workflow.title}</CardTitle>
                      <CardDescription>{workflow.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-4">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Progress</span>
                          <span>{workflow.progress}%</span>
                        </div>
                        <Progress value={workflow.progress} />
                      </div>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {workflow.tags.map((tag) => (
                          <Badge key={tag} variant="secondary">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Due: {new Date(workflow.dueDate).toLocaleDateString()}
                      </div>
                    </CardContent>
                    <CardFooter className="border-t pt-4 flex justify-between">
                      <div className="flex -space-x-2">
                        {workflow.collaborators.map((user) => (
                          <Avatar
                            key={user.id}
                            className="border-2 border-background h-7 w-7"
                          >
                            <AvatarImage src={user.avatar} alt={user.name} />
                            <AvatarFallback>{user.name[0]}</AvatarFallback>
                          </Avatar>
                        ))}
                      </div>
                      <Button variant="ghost" size="sm">
                        Open
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="templates" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {templateWorkflows.map((template) => (
                  <Card key={template.id}>
                    <CardHeader>
                      <CardTitle>{template.title}</CardTitle>
                      <CardDescription>{template.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between items-center">
                        <Badge>{template.category}</Badge>
                        <span className="text-sm text-muted-foreground">
                          {template.steps} steps
                        </span>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full">Use Template</Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>

          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Quick Actions</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Button
                variant="outline"
                className="h-24 flex flex-col items-center justify-center"
              >
                <PlusCircle className="h-8 w-8 mb-2" />
                Create Workflow
              </Button>
              <Button
                variant="outline"
                className="h-24 flex flex-col items-center justify-center"
              >
                <Clock className="h-8 w-8 mb-2" />
                Schedule Task
              </Button>
              <Button
                variant="outline"
                className="h-24 flex flex-col items-center justify-center"
              >
                <BarChart className="h-8 w-8 mb-2" />
                View Analytics
              </Button>
              <Button
                variant="outline"
                className="h-24 flex flex-col items-center justify-center"
              >
                <Settings className="h-8 w-8 mb-2" />
                Customize Flow
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Home;
