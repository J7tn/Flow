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
import { useNavigate, Link } from "react-router-dom";
import PermanentDashboard from "./shared/PermanentDashboard";

const MyFlows = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [flows, setFlows] = useState([
    {
      id: "1",
      title: "Product Launch Campaign",
      description: "Complete marketing flow for Q2 product launch",
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
      dueDate: "2023-08-15",
      priority: "medium",
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
      title: "Customer Feedback Analysis",
      description: "Analyze and implement customer feedback improvements",
      status: "completed",
      progress: 100,
      dueDate: "2023-05-20",
      priority: "low",
      tags: ["Customer", "Analysis"],
      collaborators: [
        {
          id: "6",
          name: "Riley",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Riley",
        },
      ],
      totalSteps: 10,
      completedSteps: 10,
    },
    {
      id: "5",
      title: "Team Building Event",
      description: "Plan and execute quarterly team building activities",
      status: "active",
      progress: 60,
      dueDate: "2023-06-30",
      priority: "medium",
      tags: ["Team", "Events"],
      collaborators: [
        {
          id: "7",
          name: "Jordan",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jordan",
        },
        {
          id: "8",
          name: "Parker",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Parker",
        },
      ],
      totalSteps: 6,
      completedSteps: 4,
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [flowToDelete, setFlowToDelete] = useState<string | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500";
      case "paused":
        return "bg-yellow-500";
      case "completed":
        return "bg-blue-500";
      case "archived":
        return "bg-gray-500";
      default:
        return "bg-gray-400";
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
        return "outline";
    }
  };

  const filterFlows = (status: string) => {
    if (status === "all") return flows;
    return flows.filter((flow) => flow.status === status);
  };

  const handleDeleteFlow = (flowId: string) => {
    setFlowToDelete(flowId);
  };

  const confirmDelete = () => {
    if (flowToDelete) {
      setFlows(prev => prev.filter(flow => flow.id !== flowToDelete));
      toast({
        title: "Flow deleted",
        description: "The flow has been successfully deleted.",
      });
      setFlowToDelete(null);
    }
  };

  const cancelDelete = () => {
    setFlowToDelete(null);
  };

  return (
    <PermanentDashboard>
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <header className="border-b bg-card p-4 sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">My Flows</h1>
              <p className="text-muted-foreground">
                Manage and track your flows
              </p>
            </div>
            <Button onClick={() => navigate("/workflow/new")}>
              <Plus className="h-4 w-4 mr-2" />
              New Flow
            </Button>
          </div>
        </header>

        {/* Content */}
        <main className="p-6">
          {/* Search and Filters */}
          <div className="mb-6">
            <div className="flex items-center space-x-4 mb-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search flows..." className="pl-8" />
              </div>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="all">All ({flows.length})</TabsTrigger>
                <TabsTrigger value="active">
                  Active ({filterFlows("active").length})
                </TabsTrigger>
                <TabsTrigger value="paused">
                  Paused ({filterFlows("paused").length})
                </TabsTrigger>
                <TabsTrigger value="completed">
                  Completed ({filterFlows("completed").length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {flows.map((flow) => (
                    <Card
                      key={flow.id}
                      className="overflow-hidden hover:shadow-lg transition-shadow"
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <div
                              className={`w-3 h-3 rounded-full ${getStatusColor(
                                flow.status
                              )}`}
                            />
                            <Badge
                              variant={getPriorityColor(flow.priority)}
                              className="text-xs"
                            >
                              {flow.priority}
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
                                onClick={() => handleDeleteFlow(flow.id)}
                                className="text-destructive"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        <CardTitle className="text-lg">{flow.title}</CardTitle>
                        <CardDescription>
                          {flow.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="mb-4">
                          <div className="flex justify-between text-sm mb-1">
                            <span>Progress</span>
                            <span>
                              {flow.completedSteps}/{flow.totalSteps} steps
                            </span>
                          </div>
                          <Progress value={flow.progress} className="h-2" />
                          <p className="text-xs text-muted-foreground mt-1">
                            {flow.progress}% complete
                          </p>
                        </div>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {flow.tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex -space-x-2">
                            {flow.collaborators.map((user) => (
                              <Avatar
                                key={user.id}
                                className="border-2 border-background h-7 w-7"
                              >
                                <AvatarImage src={user.avatar} alt={user.name} />
                                <AvatarFallback>{user.name[0]}</AvatarFallback>
                              </Avatar>
                            ))}
                          </div>
                          <span className="text-sm text-muted-foreground">
                            Due: {new Date(flow.dueDate).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex space-x-2">
                          {flow.status === "active" && (
                            <Button variant="outline" size="sm" className="flex-1">
                              <Pause className="h-4 w-4 mr-2" />
                              Pause
                            </Button>
                          )}
                          {flow.status === "paused" && (
                            <Button variant="outline" size="sm" className="flex-1">
                              <Play className="h-4 w-4 mr-2" />
                              Resume
                            </Button>
                          )}
                          {flow.status === "completed" && (
                            <Button variant="outline" size="sm" className="flex-1">
                              <Archive className="h-4 w-4 mr-2" />
                              Archive
                            </Button>
                          )}
                          <Button variant="outline" size="sm" asChild>
                            <Link to={`/workflow/design?id=${flow.id}`}>
                              Open
                            </Link>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="active" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filterFlows("active").map((flow) => (
                    <Card
                      key={flow.id}
                      className="overflow-hidden hover:shadow-lg transition-shadow"
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <div
                              className={`w-3 h-3 rounded-full ${getStatusColor(
                                flow.status
                              )}`}
                            />
                            <Badge
                              variant={getPriorityColor(flow.priority)}
                              className="text-xs"
                            >
                              {flow.priority}
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
                                onClick={() => handleDeleteFlow(flow.id)}
                                className="text-destructive"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        <CardTitle className="text-lg">{flow.title}</CardTitle>
                        <CardDescription>
                          {flow.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="mb-4">
                          <div className="flex justify-between text-sm mb-1">
                            <span>Progress</span>
                            <span>
                              {flow.completedSteps}/{flow.totalSteps}{" "}
                              steps
                            </span>
                          </div>
                          <Progress value={flow.progress} className="h-2" />
                          <p className="text-xs text-muted-foreground mt-1">
                            {flow.progress}% complete
                          </p>
                        </div>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {flow.tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex -space-x-2">
                            {flow.collaborators.map((user) => (
                              <Avatar
                                key={user.id}
                                className="border-2 border-background h-7 w-7"
                              >
                                <AvatarImage src={user.avatar} alt={user.name} />
                                <AvatarFallback>{user.name[0]}</AvatarFallback>
                              </Avatar>
                            ))}
                          </div>
                          <span className="text-sm text-muted-foreground">
                            Due: {new Date(flow.dueDate).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" className="flex-1">
                            <Pause className="h-4 w-4 mr-2" />
                            Pause
                          </Button>
                          <Button variant="outline" size="sm" asChild>
                            <Link to={`/workflow/design?id=${flow.id}`}>
                              Open
                            </Link>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="paused" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filterFlows("paused").map((flow) => (
                    <Card
                      key={flow.id}
                      className="overflow-hidden hover:shadow-lg transition-shadow"
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <div
                              className={`w-3 h-3 rounded-full ${getStatusColor(
                                flow.status
                              )}`}
                            />
                            <Badge
                              variant={getPriorityColor(flow.priority)}
                              className="text-xs"
                            >
                              {flow.priority}
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
                                onClick={() => handleDeleteFlow(flow.id)}
                                className="text-destructive"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        <CardTitle className="text-lg">{flow.title}</CardTitle>
                        <CardDescription>
                          {flow.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="mb-4">
                          <div className="flex justify-between text-sm mb-1">
                            <span>Progress</span>
                            <span>
                              {flow.completedSteps}/{flow.totalSteps}{" "}
                              steps
                            </span>
                          </div>
                          <Progress value={flow.progress} className="h-2" />
                          <p className="text-xs text-muted-foreground mt-1">
                            {flow.progress}% complete
                          </p>
                        </div>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {flow.tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex -space-x-2">
                            {flow.collaborators.map((user) => (
                              <Avatar
                                key={user.id}
                                className="border-2 border-background h-7 w-7"
                              >
                                <AvatarImage src={user.avatar} alt={user.name} />
                                <AvatarFallback>{user.name[0]}</AvatarFallback>
                              </Avatar>
                            ))}
                          </div>
                          <span className="text-sm text-muted-foreground">
                            Due: {new Date(flow.dueDate).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" className="flex-1">
                            <Play className="h-4 w-4 mr-2" />
                            Resume
                          </Button>
                          <Button variant="outline" size="sm" asChild>
                            <Link to={`/workflow/design?id=${flow.id}`}>
                              Open
                            </Link>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="completed" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filterFlows("completed").map((flow) => (
                    <Card
                      key={flow.id}
                      className="overflow-hidden hover:shadow-lg transition-shadow"
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <div
                              className={`w-3 h-3 rounded-full ${getStatusColor(
                                flow.status
                              )}`}
                            />
                            <Badge
                              variant={getPriorityColor(flow.priority)}
                              className="text-xs"
                            >
                              {flow.priority}
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
                                onClick={() => handleDeleteFlow(flow.id)}
                                className="text-destructive"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        <CardTitle className="text-lg">{flow.title}</CardTitle>
                        <CardDescription>
                          {flow.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="mb-4">
                          <div className="flex justify-between text-sm mb-1">
                            <span>Progress</span>
                            <span>
                              {flow.completedSteps}/{flow.totalSteps}{" "}
                              steps
                            </span>
                          </div>
                          <Progress value={flow.progress} className="h-2" />
                          <p className="text-xs text-muted-foreground mt-1">
                            {flow.progress}% complete
                          </p>
                        </div>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {flow.tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex -space-x-2">
                            {flow.collaborators.map((user) => (
                              <Avatar
                                key={user.id}
                                className="border-2 border-background h-7 w-7"
                              >
                                <AvatarImage src={user.avatar} alt={user.name} />
                                <AvatarFallback>{user.name[0]}</AvatarFallback>
                              </Avatar>
                            ))}
                          </div>
                          <span className="text-sm text-muted-foreground">
                            Due: {new Date(flow.dueDate).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" className="flex-1">
                            <Archive className="h-4 w-4 mr-2" />
                            Archive
                          </Button>
                          <Button variant="outline" size="sm" asChild>
                            <Link to={`/workflow/design?id=${flow.id}`}>
                              Open
                            </Link>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!flowToDelete} onOpenChange={() => setFlowToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Flow</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this flow? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={cancelDelete}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </PermanentDashboard>
  );
};

export default MyFlows; 