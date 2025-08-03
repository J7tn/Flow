import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  PlusCircle,
  Settings,
  User,
  Search,
  Clock,
  Calendar,
  BarChart,
  Loader2,
  RefreshCw,
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
import { toast } from "./ui/use-toast";
import PermanentDashboard from "./shared/PermanentDashboard";
import { supabase } from "@/lib/supabase";

const Home = () => {
  const [activeTab, setActiveTab] = useState("recent");
  const [loading, setLoading] = useState(true);
  const [recentFlows, setRecentFlows] = useState<any[]>([]);
  const [dashboardStats, setDashboardStats] = useState({
    activeFlows: 0,
    completedTasks: 0,
    overallProgress: 0,
  });

  // Fetch real data from Supabase
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const client = supabase();
      
      // Fetch workflows from database
      const { data: workflows, error } = await client
        .from('workflows')
        .select('*')
        .order('updated_at', { ascending: false })
        .limit(6); // Get 6 most recent flows

      if (error) {
        console.error('Error fetching workflows:', error);
        throw error;
      }

      // Transform workflow data for display
      const transformedFlows = workflows?.map(w => ({
        id: w.id,
        title: w.name || 'Unnamed Flow',
        description: w.description || 'No description available',
        progress: w.completion_percentage || 0,
        dueDate: w.due_date || w.created_at,
        tags: w.tags || [],
        status: w.status,
        created_at: w.created_at,
        updated_at: w.updated_at,
      })) || [];

      setRecentFlows(transformedFlows);

      // Calculate dashboard statistics
      const { data: allWorkflows } = await client
        .from('workflows')
        .select('*');

      if (allWorkflows) {
        const activeFlows = allWorkflows.filter(w => w.status !== 'completed').length;
        const completedTasks = allWorkflows.filter(w => w.status === 'completed').length;
        const totalWorkflows = allWorkflows.length;
        const overallProgress = totalWorkflows > 0 
          ? Math.round((completedTasks / totalWorkflows) * 100)
          : 0;

        setDashboardStats({
          activeFlows,
          completedTasks,
          overallProgress,
        });
      }

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const templateFlows = [
    {
      id: "4",
      title: "Project Management",
      description: "Standard project management flow with milestones",
      steps: 12,
      category: "Business",
    },
    {
      id: "5",
      title: "Content Creation",
      description: "From ideation to publication flow",
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
    <PermanentDashboard>
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <header className="border-b bg-card p-4 sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                             <Input placeholder="Search flows..." className="pl-8" />
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <User className="h-4 w-4 mr-2" />
                Invite Team
              </Button>
              <Button size="sm" asChild>
                <Link to="/workflow/new">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  New Flow
                </Link>
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
               Track your progress and create new flows.
             </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Active Flows
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm text-muted-foreground">Loading...</span>
                  </div>
                ) : (
                  <>
                    <div className="text-2xl font-bold">{dashboardStats.activeFlows}</div>
                    <p className="text-xs text-muted-foreground">
                      Currently in progress
                    </p>
                  </>
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Completed Tasks
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm text-muted-foreground">Loading...</span>
                  </div>
                ) : (
                  <>
                    <div className="text-2xl font-bold">{dashboardStats.completedTasks}</div>
                    <p className="text-xs text-muted-foreground">
                      Successfully completed
                    </p>
                  </>
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Overall Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm text-muted-foreground">Loading...</span>
                  </div>
                ) : (
                  <>
                    <div className="text-2xl font-bold">{dashboardStats.overallProgress}%</div>
                    <Progress value={dashboardStats.overallProgress} className="mt-2" />
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          <Tabs 
            defaultValue="recent" 
            className="mb-8"
            onValueChange={setActiveTab}
          >
            <div className="flex items-center justify-between mb-4">
              <TabsList>
                <TabsTrigger value="recent">Recent Flows</TabsTrigger>
                <TabsTrigger value="templates">Templates</TabsTrigger>
              </TabsList>
              <div className="flex items-center space-x-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={fetchDashboardData}
                  disabled={loading}
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <Link to={activeTab === "templates" ? "/saved-templates" : "/flows"}>
                    View All
                  </Link>
                </Button>
              </div>
            </div>

            <TabsContent value="recent" className="space-y-4">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">Loading recent flows...</p>
                  </div>
                </div>
              ) : recentFlows.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {recentFlows.map((flow) => (
                    <Card key={flow.id} className="overflow-hidden">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">{flow.title}</CardTitle>
                          <Badge 
                            variant={
                              flow.status === 'completed' ? 'secondary' : 
                              flow.status === 'in_progress' ? 'default' : 'outline'
                            }
                          >
                            {flow.status === 'completed' ? 'Completed' : 
                             flow.status === 'in_progress' ? 'In Progress' : 'Draft'}
                          </Badge>
                        </div>
                        <CardDescription>{flow.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="mb-4">
                          <div className="flex justify-between text-sm mb-1">
                            <span>Progress</span>
                            <span>{flow.progress}%</span>
                          </div>
                          <Progress value={flow.progress} />
                        </div>
                        {flow.tags && flow.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-4">
                            {flow.tags.slice(0, 3).map((tag, index) => (
                              <Badge key={index} variant="secondary">
                                {tag}
                              </Badge>
                            ))}
                            {flow.tags.length > 3 && (
                              <Badge variant="outline">+{flow.tags.length - 3}</Badge>
                            )}
                          </div>
                        )}
                        <div className="text-sm text-muted-foreground">
                          Updated: {new Date(flow.updated_at).toLocaleDateString()}
                        </div>
                      </CardContent>
                      <CardFooter className="border-t pt-4 flex justify-between">
                        <div className="text-xs text-muted-foreground">
                          Created {new Date(flow.created_at).toLocaleDateString()}
                        </div>
                        <Button variant="ghost" size="sm" asChild>
                          <Link to={`/workflow/design?id=${flow.id}`}>
                            Open Flow
                          </Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
                    <PlusCircle className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">No flows yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Create your first flow to get started
                  </p>
                  <Button asChild>
                    <Link to="/workflow/new">
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Create Flow
                    </Link>
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="templates" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {templateFlows.map((template) => (
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
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <Button
                 variant="outline"
                 className="h-24 flex flex-col items-center justify-center"
                 asChild
               >
                 <Link to="/workflow/new">
                   <PlusCircle className="h-8 w-8 mb-2" />
                   New Flow
                 </Link>
               </Button>
               <Button
                 variant="outline"
                 className="h-24 flex flex-col items-center justify-center"
                 asChild
               >
                 <Link to="/analytics">
                   <BarChart className="h-8 w-8 mb-2" />
                   View Analytics
                 </Link>
               </Button>
             </div>
          </div>
        </main>
      </div>
    </PermanentDashboard>
  );
};

export default Home;
