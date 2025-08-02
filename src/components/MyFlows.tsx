import React, { useState, useEffect } from "react";
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
  Loader2,
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
import { flowApi } from "@/lib/api";

const MyFlows = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [flows, setFlows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch flows from database
  useEffect(() => {
    const fetchFlows = async () => {
      try {
        setLoading(true);
        const result = await flowApi.getFlows();
        
        if (result.success && result.data) {
          // Transform database data to match component expectations
          const transformedFlows = result.data.map((flow: any) => {
            const totalSteps = flow.workflow_steps?.length || 0;
            const completedSteps = flow.workflow_steps?.filter((step: any) => step.is_completed)?.length || 0;
            const progress = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;
            
            return {
              id: flow.id,
              title: flow.name,
              description: flow.description || '',
              status: flow.status || 'draft',
              progress: progress,
              dueDate: flow.updated_at ? new Date(flow.updated_at).toISOString().split('T')[0] : '',
              priority: 'medium', // Default priority
              tags: [], // No tags in current schema
              collaborators: [], // No collaborators in current schema
              totalSteps: totalSteps,
              completedSteps: completedSteps,
              created_at: flow.created_at,
              updated_at: flow.updated_at,
            };
          });
          setFlows(transformedFlows);
        } else {
          setError(result.error || 'Failed to fetch flows');
        }
      } catch (err) {
        console.error('Error fetching flows:', err);
        setError('Failed to fetch flows');
      } finally {
        setLoading(false);
      }
    };

    fetchFlows();
  }, []);

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

  const confirmDelete = async () => {
    if (flowToDelete) {
      try {
        const result = await flowApi.deleteFlow(flowToDelete);
        
        if (result.success) {
          setFlows(prev => prev.filter(flow => flow.id !== flowToDelete));
          toast({
            title: "Flow deleted",
            description: "The flow has been successfully deleted.",
          });
        } else {
          toast({
            title: "Error",
            description: result.error || "Failed to delete flow",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error('Error deleting flow:', error);
        toast({
          title: "Error",
          description: "Failed to delete flow",
          variant: "destructive",
        });
      } finally {
        setFlowToDelete(null);
      }
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
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin mr-2" />
                    <span>Loading flows...</span>
                  </div>
                ) : error ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                      <p className="text-destructive mb-2">{error}</p>
                      <Button 
                        variant="outline" 
                        onClick={() => window.location.reload()}
                      >
                        Try Again
                      </Button>
                    </div>
                  </div>
                ) : flows.length === 0 ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                      <p className="text-muted-foreground mb-4">No flows found</p>
                      <Button onClick={() => navigate("/workflow/new")}>
                        <Plus className="h-4 w-4 mr-2" />
                        Create Your First Flow
                      </Button>
                    </div>
                  </div>
                ) : (
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
                )}
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