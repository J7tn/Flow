import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  Grid3X3,
  List,
  Target,
  Briefcase,
  CheckSquare,
  Square,
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
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
import { NestedFlowTree } from "./workflow/NestedFlowTree";
import { FlowDetails } from "./workflow/FlowDetails";
import { nestedFlowApi } from "@/lib/nestedFlowApi";
import type { WorkflowInstance, FlowType } from "@/types/nested-flows";

const MyFlows = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [flows, setFlows] = useState<WorkflowInstance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFlowId, setSelectedFlowId] = useState<string | undefined>();
  const [viewMode, setViewMode] = useState<'tree' | 'grid' | 'list'>('tree');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<FlowType | 'all'>('all');
  const [deleteFlowId, setDeleteFlowId] = useState<string | null>(null);

  // Fetch flows from database
  useEffect(() => {
    fetchFlows();
  }, []);

  const fetchFlows = async () => {
    try {
      setLoading(true);
      const result = await nestedFlowApi.getFlows();
      
      if (result.success && result.data) {
        setFlows(result.data);
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500';
      case 'completed':
        return 'bg-blue-500';
      case 'archived':
        return 'bg-gray-500';
      default:
        return 'bg-yellow-500';
    }
  };

  const getFlowTypeIcon = (flowType: FlowType) => {
    switch (flowType) {
      case 'goal':
        return <Target className="h-4 w-4" />;
      case 'project':
        return <Briefcase className="h-4 w-4" />;
      case 'task':
        return <CheckSquare className="h-4 w-4" />;
      case 'subtask':
        return <Square className="h-4 w-4" />;
      default:
        return <Briefcase className="h-4 w-4" />;
    }
  };

  const getFlowTypeColor = (flowType: FlowType) => {
    switch (flowType) {
      case 'goal':
        return 'bg-purple-500';
      case 'project':
        return 'bg-blue-500';
      case 'task':
        return 'bg-green-500';
      case 'subtask':
        return 'bg-gray-500';
      default:
        return 'bg-gray-400';
    }
  };

  const handleDeleteFlow = (flowId: string) => {
    setDeleteFlowId(flowId);
  };

  const confirmDelete = async () => {
    if (!deleteFlowId) return;

    try {
      const result = await nestedFlowApi.deleteFlow(deleteFlowId);
      
      if (result.success) {
        toast({
          title: 'Success',
          description: 'Flow deleted successfully',
        });
        fetchFlows(); // Refresh the list
      } else {
        toast({
          title: 'Error',
          description: result.error || 'Failed to delete flow',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete flow',
        variant: 'destructive',
      });
    } finally {
      setDeleteFlowId(null);
    }
  };

  const cancelDelete = () => {
    setDeleteFlowId(null);
  };

  const handleFlowSelect = (flowId: string) => {
    setSelectedFlowId(flowId);
  };

  const handleCreateFlow = () => {
    navigate('/workflow/new');
  };

  const filteredFlows = flows.filter(flow => {
    const matchesSearch = flow.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (flow.description && flow.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || flow.status === statusFilter;
    const matchesType = typeFilter === 'all' || flow.flow_type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const renderFlowCard = (flow: WorkflowInstance) => (
    <motion.div
      key={flow.id}
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Card
        className={`overflow-hidden hover:shadow-lg transition-shadow cursor-pointer ${
          selectedFlowId === flow.id ? 'ring-2 ring-primary' : ''
        }`}
        onClick={() => handleFlowSelect(flow.id)}
      >
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${getFlowTypeColor(flow.flow_type)}`} />
              {getFlowTypeIcon(flow.flow_type)}
              <Badge variant="outline" className="text-xs">
                {flow.flow_type}
              </Badge>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => navigate(`/workflow/${flow.id}`)}>
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
          <CardTitle className="text-lg">{flow.name}</CardTitle>
          {flow.description && (
            <CardDescription className="line-clamp-2">
              {flow.description}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">{Math.round(flow.progress || 0)}%</span>
            </div>
            <Progress value={flow.progress || 0} className="h-2" />
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${getStatusColor(flow.status)}`} />
                <span className="capitalize">{flow.status}</span>
              </div>
              <div className="flex items-center space-x-1 text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span>{new Date(flow.updated_at).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  const renderFlowList = (flow: WorkflowInstance) => (
    <motion.div
      key={flow.id}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3 }}
    >
      <Card
        className={`mb-3 hover:shadow-md transition-shadow cursor-pointer ${
          selectedFlowId === flow.id ? 'ring-2 ring-primary' : ''
        }`}
        onClick={() => handleFlowSelect(flow.id)}
      >
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className={`w-3 h-3 rounded-full ${getFlowTypeColor(flow.flow_type)}`} />
              <div className="flex items-center space-x-2">
                {getFlowTypeIcon(flow.flow_type)}
                <div>
                  <h3 className="font-medium">{flow.name}</h3>
                  {flow.description && (
                    <p className="text-sm text-muted-foreground line-clamp-1">
                      {flow.description}
                    </p>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-sm font-medium">{Math.round(flow.progress || 0)}%</div>
                <Progress value={flow.progress || 0} className="h-1 w-16" />
              </div>
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${getStatusColor(flow.status)}`} />
                <span className="text-sm capitalize">{flow.status}</span>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => navigate(`/workflow/${flow.id}`)}>
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
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <PermanentDashboard>
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <header className="border-b bg-card p-4 sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">My Flows</h1>
              <p className="text-muted-foreground">
                Manage your workflow hierarchies and projects
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Button onClick={handleCreateFlow}>
                <Plus className="h-4 w-4 mr-2" />
                New Flow
              </Button>
              <Button 
                variant="outline" 
                onClick={() => navigate('/test-nested-flows')}
                className="text-sm"
              >
                Test Nested Flows
              </Button>
            </div>
          </div>
        </header>

        <motion.main 
          className="p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Search and Filters */}
          <motion.div 
            className="mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
              <div className="flex flex-1 items-center space-x-2 max-w-md">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search flows..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1"
                />
              </div>
              
                             <div className="flex items-center space-x-2">
                 <Select value={statusFilter} onValueChange={setStatusFilter}>
                   <SelectTrigger className="w-[140px]">
                     <SelectValue placeholder="All Status" />
                   </SelectTrigger>
                   <SelectContent>
                     <SelectItem value="all">All Status</SelectItem>
                     <SelectItem value="draft">Draft</SelectItem>
                     <SelectItem value="active">Active</SelectItem>
                     <SelectItem value="completed">Completed</SelectItem>
                     <SelectItem value="archived">Archived</SelectItem>
                   </SelectContent>
                 </Select>
                 
                 <Select value={typeFilter} onValueChange={(value) => setTypeFilter(value as FlowType | 'all')}>
                   <SelectTrigger className="w-[140px]">
                     <SelectValue placeholder="All Types" />
                   </SelectTrigger>
                   <SelectContent>
                     <SelectItem value="all">All Types</SelectItem>
                     <SelectItem value="goal">Goals</SelectItem>
                     <SelectItem value="project">Projects</SelectItem>
                     <SelectItem value="task">Tasks</SelectItem>
                     <SelectItem value="subtask">Subtasks</SelectItem>
                   </SelectContent>
                 </Select>
                
                <div className="flex items-center border rounded-md">
                  <Button
                    variant={viewMode === 'tree' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('tree')}
                    className="rounded-r-none"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    className="rounded-none"
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                    className="rounded-l-none"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Content */}
          {loading ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin mr-2" />
              <span>Loading flows...</span>
            </motion.div>
          ) : error ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center justify-center py-12">
              <div className="text-center">
                <p className="text-destructive mb-2">{error}</p>
                <Button variant="outline" onClick={fetchFlows}>
                  Try Again
                </Button>
              </div>
            </motion.div>
          ) : filteredFlows.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center justify-center py-12">
              <div className="text-center">
                <p className="text-muted-foreground mb-2">No flows found. Create your first one!</p>
                <Button onClick={handleCreateFlow}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Flow
                </Button>
              </div>
            </motion.div>
          ) : viewMode === 'tree' ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Flow Tree Sidebar */}
              <div className="lg:col-span-1">
                <NestedFlowTree
                  onFlowSelect={handleFlowSelect}
                  selectedFlowId={selectedFlowId}
                />
              </div>
              
                             {/* Flow Details */}
               <div className="lg:col-span-2">
                 {selectedFlowId ? (
                   <FlowDetails 
                     flowId={selectedFlowId}
                     onFlowUpdate={fetchFlows}
                     onFlowDelete={() => {
                       setSelectedFlowId(undefined);
                       fetchFlows();
                     }}
                   />
                 ) : (
                   <Card>
                     <CardContent className="flex items-center justify-center py-12">
                       <div className="text-center">
                         <p className="text-muted-foreground">Select a flow from the tree to view details</p>
                       </div>
                     </CardContent>
                   </Card>
                 )}
               </div>
            </div>
          ) : (
            <motion.div 
              className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" : ""}
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.1
                  }
                }
              }}
            >
              <AnimatePresence>
                {filteredFlows.map((flow) => 
                  viewMode === 'grid' ? renderFlowCard(flow) : renderFlowList(flow)
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </motion.main>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteFlowId} onOpenChange={() => setDeleteFlowId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Flow</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this flow? This action cannot be undone and will also delete all sub-flows.
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