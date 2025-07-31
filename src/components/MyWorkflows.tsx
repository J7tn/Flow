import React, { useState } from "react";
import {
  Clock,
  Search,
  Filter,
  Plus,
  MoreHorizontal,
  Play,
  Pause,
  Archive,
  Trash2,
  Edit,
  Copy,
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
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import { useToast } from "./ui/use-toast";
import { useNavigate } from "react-router-dom";
import PermanentDashboard from "./shared/PermanentDashboard";

const MyWorkflows = () => {
  const navigate = useNavigate();
  const [workflows, setWorkflows] = useState([
    {
      id: "1",
      title: "Product Launch Campaign",
      description: "Complete marketing workflow for Q2 product launch",
      status: "active",
      progress: 75,
      dueDate: "2023-06-15",
      priority: "high",
      tags: ["Marketing", "Launch"],
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
      totalSteps: 12,
      completedSteps: 9,
    },
    {
      id: "2",
      title: "Website Redesign",
      description: "UX improvements and visual refresh for main website",
      status: "active",
      progress: 40,
      dueDate: "2023-07-30",
      priority: "medium",
      tags: ["Design", "Development"],
      collaborators: [
        {
          id: "3",
          name: "Taylor",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Taylor",
        },
      ],
      totalSteps: 15,
      completedSteps: 6,
    },
    {
      id: "3",
      title: "Quarterly Budget Review",
      description: "Financial planning and resource allocation for Q3",
      status: "paused",
      progress: 20,
      dueDate: "2023-06-30",
      priority: "low",
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
      totalSteps: 8,
      completedSteps: 2,
    },
    {
      id: "4",
      title: "Content Strategy Planning",
      description: "Develop comprehensive content strategy for social media",
      status: "completed",
      progress: 100,
      dueDate: "2023-05-15",
      priority: "medium",
      tags: ["Content", "Strategy"],
      collaborators: [
        {
          id: "6",
          name: "Sam",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sam",
        },
      ],
      totalSteps: 10,
      completedSteps: 10,
    },
  ]);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [workflowToDelete, setWorkflowToDelete] = useState<string | null>(null);
  const { toast } = useToast();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500";
      case "paused":
        return "bg-yellow-500";
      case "completed":
        return "bg-blue-500";
      default:
        return "bg-gray-500";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "destructive";
      case "medium":
        return "secondary";
      case "low":
        return "outline";
      default:
        return "secondary";
    }
  };

  const filterWorkflows = (status: string) => {
    if (status === "all") return workflows;
    return workflows.filter((workflow) => workflow.status === status);
  };

  const handleDeleteWorkflow = (workflowId: string) => {
    setWorkflowToDelete(workflowId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (workflowToDelete) {
      setWorkflows(prev => prev.filter(workflow => workflow.id !== workflowToDelete));
      toast({
        title: "Workflow deleted",
        description: "The workflow has been successfully deleted.",
      });
      setDeleteDialogOpen(false);
      setWorkflowToDelete(null);
    }
  };

  const cancelDelete = () => {
    setDeleteDialogOpen(false);
    setWorkflowToDelete(null);
  };

  return (
    <PermanentDashboard>
      <div className="flex-1 p-6">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold tracking-tight">My Flows</h1>
            <Button onClick={() => navigate("/workflow/new")}>
              <Plus className="h-4 w-4 mr-2" />
              New Flow
            </Button>
          </div>
          <p className="text-muted-foreground">
            Manage and track all your active flows.
          </p>
        </div>

        <div className="flex items-center space-x-4 mb-6">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search workflows..." className="pl-8" />
          </div>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>

        <Tabs defaultValue="all" className="space-y-6">
          <TabsList>
            <TabsTrigger value="all">All ({workflows.length})</TabsTrigger>
            <TabsTrigger value="active">
              Active ({filterWorkflows("active").length})
            </TabsTrigger>
            <TabsTrigger value="paused">
              Paused ({filterWorkflows("paused").length})
            </TabsTrigger>
            <TabsTrigger value="completed">
              Completed ({filterWorkflows("completed").length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {workflows.map((workflow) => (
                <Card
                  key={workflow.id}
                  className="overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2">
                        <div
                          className={`w-3 h-3 rounded-full ${getStatusColor(workflow.status)}`}
                        />
                        <Badge
                          variant={getPriorityColor(workflow.priority)}
                          className="text-xs"
                        >
                          {workflow.priority}
                        </Badge>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Copy className="h-4 w-4 mr-2" />
                            Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleDeleteWorkflow(workflow.id)}
                            className="text-red-600 focus:text-red-600"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <CardTitle className="text-lg">{workflow.title}</CardTitle>
                    <CardDescription className="text-sm">
                      {workflow.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Progress</span>
                        <span>
                          {workflow.completedSteps}/{workflow.totalSteps} steps
                        </span>
                      </div>
                      <Progress value={workflow.progress} className="h-2" />
                      <p className="text-xs text-muted-foreground mt-1">
                        {workflow.progress}% complete
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {workflow.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex -space-x-2">
                        {workflow.collaborators.map((user) => (
                          <Avatar
                            key={user.id}
                            className="border-2 border-background h-6 w-6"
                          >
                            <AvatarImage src={user.avatar} alt={user.name} />
                            <AvatarFallback className="text-xs">
                              {user.name[0]}
                            </AvatarFallback>
                          </Avatar>
                        ))}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Due: {new Date(workflow.dueDate).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="flex space-x-2 pt-2">
                      {workflow.status === "active" && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1"
                          >
                            <Pause className="h-3 w-3 mr-1" />
                            Pause
                          </Button>
                          <Button size="sm" className="flex-1">
                            Open
                          </Button>
                        </>
                      )}
                      {workflow.status === "paused" && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1"
                          >
                            <Play className="h-3 w-3 mr-1" />
                            Resume
                          </Button>
                          <Button size="sm" className="flex-1">
                            Open
                          </Button>
                        </>
                      )}
                      {workflow.status === "completed" && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1"
                          >
                            <Archive className="h-3 w-3 mr-1" />
                            Archive
                          </Button>
                          <Button size="sm" className="flex-1">
                            View
                          </Button>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {["active", "paused", "completed"].map((status) => (
            <TabsContent key={status} value={status} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filterWorkflows(status).map((workflow) => (
                  <Card
                    key={workflow.id}
                    className="overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-2">
                          <div
                            className={`w-3 h-3 rounded-full ${getStatusColor(workflow.status)}`}
                          />
                          <Badge
                            variant={getPriorityColor(workflow.priority)}
                            className="text-xs"
                          >
                            {workflow.priority}
                          </Badge>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Copy className="h-4 w-4 mr-2" />
                              Duplicate
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleDeleteWorkflow(workflow.id)}
                              className="text-red-600 focus:text-red-600"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <CardTitle className="text-lg">
                        {workflow.title}
                      </CardTitle>
                      <CardDescription className="text-sm">
                        {workflow.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Progress</span>
                          <span>
                            {workflow.completedSteps}/{workflow.totalSteps}{" "}
                            steps
                          </span>
                        </div>
                        <Progress value={workflow.progress} className="h-2" />
                        <p className="text-xs text-muted-foreground mt-1">
                          {workflow.progress}% complete
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-1">
                        {workflow.tags.map((tag) => (
                          <Badge
                            key={tag}
                            variant="outline"
                            className="text-xs"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex -space-x-2">
                          {workflow.collaborators.map((user) => (
                            <Avatar
                              key={user.id}
                              className="border-2 border-background h-6 w-6"
                            >
                              <AvatarImage src={user.avatar} alt={user.name} />
                              <AvatarFallback className="text-xs">
                                {user.name[0]}
                              </AvatarFallback>
                            </Avatar>
                          ))}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Due: {new Date(workflow.dueDate).toLocaleDateString()}
                        </p>
                      </div>

                      <div className="flex space-x-2 pt-2">
                        {workflow.status === "active" && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1"
                            >
                              <Pause className="h-3 w-3 mr-1" />
                              Pause
                            </Button>
                            <Button size="sm" className="flex-1">
                              Open
                            </Button>
                          </>
                        )}
                        {workflow.status === "paused" && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1"
                            >
                              <Play className="h-3 w-3 mr-1" />
                              Resume
                            </Button>
                            <Button size="sm" className="flex-1">
                              Open
                            </Button>
                          </>
                        )}
                        {workflow.status === "completed" && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1"
                            >
                              <Archive className="h-3 w-3 mr-1" />
                              Archive
                            </Button>
                            <Button size="sm" className="flex-1">
                              View
                            </Button>
                          </>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Workflow</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this workflow? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={cancelDelete}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </PermanentDashboard>
  );
};

export default MyWorkflows;
