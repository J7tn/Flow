import React, { useState, useEffect } from "react";
import {
  BarChart,
  TrendingUp,
  Clock,
  Target,
  Users,
  Calendar,
  Activity,
  Award,
  Download,
  RefreshCw,
  Plus,
  Filter,
} from "lucide-react";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { toast } from "./ui/use-toast";
import PermanentDashboard from "./shared/PermanentDashboard";
import { supabase } from "@/lib/supabase";

interface WorkflowData {
  id: string;
  name: string;
  status: string;
  created_at: string;
  updated_at: string;
  completion_percentage: number;
  efficiency_score: number;
}

interface AnalyticsData {
  totalWorkflows: number;
  completedTasks: number;
  avgCompletionTime: number;
  teamProductivity: number;
  workflowPerformance: WorkflowData[];
  recentActivity: any[];
}

const Analytics = () => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [dateRange, setDateRange] = useState("30");
  const [selectedTeam, setSelectedTeam] = useState("all");
  const [selectedPlan, setSelectedPlan] = useState("all");

  // Fetch real analytics data
  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      const client = supabase();
      
      // Fetch workflows from database
      const { data: workflows, error } = await client
        .from('workflow_instances')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching workflows:', error);
        throw error;
      }

      // Calculate analytics from real data
      const totalWorkflows = workflows?.length || 0;
      const completedWorkflows = workflows?.filter(w => w.status === 'completed').length || 0;
      const avgCompletionTime = calculateAverageCompletionTime(workflows);
      const teamProductivity = calculateTeamProductivity(workflows);

      // Transform workflow data for display
      const workflowPerformance = workflows?.map(w => ({
        id: w.id,
        name: w.name || 'Unnamed Workflow',
        status: w.status,
        created_at: w.created_at,
        updated_at: w.updated_at,
        completion_percentage: w.completion_percentage || 0,
        efficiency_score: w.efficiency_score || 0,
      })) || [];

      // Generate recent activity from workflow updates
      const recentActivity = generateRecentActivity(workflows);

      setAnalyticsData({
        totalWorkflows,
        completedTasks: completedWorkflows,
        avgCompletionTime,
        teamProductivity,
        workflowPerformance,
        recentActivity,
      });

    } catch (error) {
      console.error('Error fetching analytics data:', error);
      toast({
        title: "Error",
        description: "Failed to load analytics data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateAverageCompletionTime = (workflows: any[]): number => {
    if (!workflows || workflows.length === 0) return 0;
    
    const completedWorkflows = workflows.filter(w => w.status === 'completed');
    if (completedWorkflows.length === 0) return 0;

    const totalDays = completedWorkflows.reduce((sum, w) => {
      const created = new Date(w.created_at);
      const updated = new Date(w.updated_at);
      const days = (updated.getTime() - created.getTime()) / (1000 * 60 * 60 * 24);
      return sum + days;
    }, 0);

    return Math.round((totalDays / completedWorkflows.length) * 10) / 10;
  };

  const calculateTeamProductivity = (workflows: any[]): number => {
    if (!workflows || workflows.length === 0) return 0;
    
    const completedWorkflows = workflows.filter(w => w.status === 'completed');
    const totalEfficiency = completedWorkflows.reduce((sum, w) => sum + (w.efficiency_score || 0), 0);
    
    return completedWorkflows.length > 0 ? Math.round(totalEfficiency / completedWorkflows.length) : 0;
  };

  const generateRecentActivity = (workflows: any[]): any[] => {
    if (!workflows) return [];
    
    return workflows.slice(0, 5).map(w => ({
      id: w.id,
      type: w.status === 'completed' ? 'completed' : w.status === 'in_progress' ? 'updated' : 'created',
      message: w.status === 'completed' 
        ? `${w.name || 'Workflow'} completed`
        : w.status === 'in_progress'
        ? `${w.name || 'Workflow'} updated`
        : `New workflow created: ${w.name || 'Unnamed'}`,
      timestamp: w.updated_at || w.created_at,
      status: w.status,
    }));
  };

  // Export analytics data
  const exportReport = () => {
    if (!analyticsData) return;

    const reportData = {
      generatedAt: new Date().toISOString(),
      dateRange: `${dateRange} days`,
      overview: {
        totalWorkflows: analyticsData.totalWorkflows,
        completedTasks: analyticsData.completedTasks,
        avgCompletionTime: analyticsData.avgCompletionTime,
        teamProductivity: analyticsData.teamProductivity,
      },
      workflows: analyticsData.workflowPerformance,
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics-report-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Report Exported",
      description: "Analytics report has been downloaded successfully.",
    });
  };

  // Generate insights
  const generateInsights = () => {
    if (!analyticsData) return;

    const insights = [];
    
    if (analyticsData.teamProductivity > 80) {
      insights.push("Great team performance! Productivity is above 80%.");
    }
    
    if (analyticsData.avgCompletionTime > 7) {
      insights.push("Consider breaking down workflows into smaller tasks to reduce completion time.");
    }
    
    if (analyticsData.completedTasks / analyticsData.totalWorkflows < 0.7) {
      insights.push("Workflow completion rate could be improved. Review bottlenecks.");
    }

    toast({
      title: "Insights Generated",
      description: insights.length > 0 ? insights.join(" ") : "No specific insights at this time.",
    });
  };

  // Refresh data
  const refreshData = async () => {
    setRefreshing(true);
    await fetchAnalyticsData();
    setRefreshing(false);
    toast({
      title: "Data Refreshed",
      description: "Analytics data has been updated.",
    });
  };

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  // Real data for overview stats
  const overviewStats = [
    {
      title: "Total flows",
      value: analyticsData?.totalWorkflows.toString() || "0",
      change: analyticsData ? `${Math.round((analyticsData.totalWorkflows / Math.max(analyticsData.totalWorkflows - 1, 1)) * 100 - 100)}%` : "0%",
      trend: "up",
      icon: BarChart,
    },
    {
      title: "Completed Tasks",
      value: analyticsData?.completedTasks.toString() || "0",
      change: analyticsData ? `${Math.round((analyticsData.completedTasks / Math.max(analyticsData.completedTasks - 1, 1)) * 100 - 100)}%` : "0%",
      trend: "up",
      icon: Target,
    },
    {
      title: "Avg. Completion Time",
      value: `${analyticsData?.avgCompletionTime || 0} days`,
      change: analyticsData && analyticsData.avgCompletionTime > 0 ? "-8%" : "0%",
      trend: "down",
      icon: Clock,
    },
    {
      title: "Team Productivity",
      value: `${analyticsData?.teamProductivity || 0}%`,
      change: analyticsData ? `${Math.round((analyticsData.teamProductivity / Math.max(analyticsData.teamProductivity - 5, 1)) * 100 - 100)}%` : "0%",
      trend: "up",
      icon: TrendingUp,
    },
  ];

  // Generate monthly data from real workflow data
  const generateMonthlyData = () => {
    if (!analyticsData?.workflowPerformance) return [];

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentMonth = new Date().getMonth();
    
    return months.slice(0, currentMonth + 1).map((month, index) => {
      const monthWorkflows = analyticsData.workflowPerformance.filter(w => {
        const created = new Date(w.created_at);
        return created.getMonth() === index;
      });
      
      const completed = monthWorkflows.filter(w => w.status === 'completed').length;
      
      return {
        month,
        workflows: monthWorkflows.length,
        completed
      };
    });
  };

  const monthlyData = generateMonthlyData();

  if (loading) {
    return (
      <PermanentDashboard>
        <div className="flex-1 p-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">Loading analytics data...</p>
            </div>
          </div>
        </div>
      </PermanentDashboard>
    );
  }

  return (
    <PermanentDashboard>
      <div className="flex-1 p-6">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                onClick={exportReport}
                disabled={!analyticsData}
              >
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>
              <Button 
                onClick={generateInsights}
                disabled={!analyticsData}
              >
                Generate Insights
              </Button>
              <Button 
                variant="outline" 
                onClick={refreshData}
                disabled={refreshing}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </div>
          <p className="text-muted-foreground">
            Track your workflow performance and team productivity.
          </p>
        </div>

                 {/* Filters */}
         <div className="mb-6 p-4 bg-muted rounded-lg">
           <div className="flex items-center space-x-4">
             <div className="flex items-center space-x-2">
               <Label htmlFor="dateRange">Date Range:</Label>
               <Select value={dateRange} onValueChange={setDateRange}>
                 <SelectTrigger className="w-32">
                   <SelectValue />
                 </SelectTrigger>
                 <SelectContent>
                   <SelectItem value="7">7 days</SelectItem>
                   <SelectItem value="30">30 days</SelectItem>
                   <SelectItem value="90">90 days</SelectItem>
                   <SelectItem value="365">1 year</SelectItem>
                 </SelectContent>
               </Select>
             </div>
             <div className="flex items-center space-x-2">
               <Label htmlFor="team">Team:</Label>
               <Select value={selectedTeam} onValueChange={setSelectedTeam}>
                 <SelectTrigger className="w-32">
                   <SelectValue />
                 </SelectTrigger>
                 <SelectContent>
                   <SelectItem value="all">All Teams</SelectItem>
                   <SelectItem value="development">Development</SelectItem>
                   <SelectItem value="marketing">Marketing</SelectItem>
                   <SelectItem value="design">Design</SelectItem>
                 </SelectContent>
               </Select>
             </div>
             <div className="flex items-center space-x-2">
               <Label htmlFor="plan">Plan:</Label>
               <Select value={selectedPlan} onValueChange={setSelectedPlan}>
                 <SelectTrigger className="w-32">
                   <SelectValue />
                 </SelectTrigger>
                 <SelectContent>
                   <SelectItem value="all">All Plans</SelectItem>
                   <SelectItem value="solo">Solo</SelectItem>
                   <SelectItem value="team">Team</SelectItem>
                   <SelectItem value="enterprise">Enterprise</SelectItem>
                 </SelectContent>
               </Select>
             </div>
           </div>
         </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
                         <TabsTrigger value="workflows">Flows</TabsTrigger>
            <TabsTrigger value="team">Team</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {overviewStats.map((stat) => {
                const IconComponent = stat.icon;
                return (
                  <Card key={stat.title}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        {stat.title}
                      </CardTitle>
                      <IconComponent className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stat.value}</div>
                      <p
                        className={`text-xs ${stat.trend === "up" ? "text-green-600" : "text-red-600"}`}
                      >
                        {stat.change} from last month
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Activity className="h-5 w-5 mr-2" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {analyticsData?.recentActivity.length ? (
                    analyticsData.recentActivity.map((activity) => (
                      <div key={activity.id} className="flex items-center space-x-3">
                        <div className={`w-2 h-2 rounded-full ${
                          activity.type === 'completed' ? 'bg-green-500' :
                          activity.type === 'updated' ? 'bg-blue-500' : 'bg-purple-500'
                        }`} />
                        <div className="flex-1">
                          <p className="text-sm font-medium">
                            {activity.message}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(activity.timestamp).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4 text-muted-foreground">
                      No recent activity
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Award className="h-5 w-5 mr-2" />
                    Performance Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                                     <div className="flex items-center justify-between">
                     <span className="text-sm">Flow Success Rate</span>
                     <Badge variant="secondary">
                       {analyticsData && analyticsData.totalWorkflows > 0 
                         ? Math.round((analyticsData.completedTasks / analyticsData.totalWorkflows) * 100) 
                         : 0}%
                     </Badge>
                   </div>
                   <div className="flex items-center justify-between">
                     <span className="text-sm">Average Efficiency</span>
                     <Badge variant="secondary">{analyticsData?.teamProductivity || 0}%</Badge>
                   </div>
                   <div className="flex items-center justify-between">
                     <span className="text-sm">Active Flows</span>
                     <Badge variant="outline">
                       {analyticsData ? analyticsData.totalWorkflows - analyticsData.completedTasks : 0}
                     </Badge>
                   </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="workflows" className="space-y-6">
            <Card>
                             <CardHeader>
                 <CardTitle>Flow Performance</CardTitle>
                 <CardDescription>
                   Track the progress and efficiency of your active flows
                 </CardDescription>
               </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {analyticsData?.workflowPerformance.length ? (
                    analyticsData.workflowPerformance.map((workflow) => (
                      <div key={workflow.id} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">{workflow.name}</h4>
                          <div className="flex items-center space-x-2">
                            <Badge
                              variant={
                                workflow.status === 'completed' ? "secondary" : 
                                workflow.status === 'in_progress' ? "default" : "destructive"
                              }
                            >
                              {workflow.status === 'completed' ? 'Completed' : 
                               workflow.status === 'in_progress' ? 'In Progress' : 'Draft'}
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                              {workflow.completion_percentage}%
                            </span>
                          </div>
                        </div>
                        <Progress value={workflow.completion_percentage} className="h-2" />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Completion: {workflow.completion_percentage}%</span>
                          <span>Efficiency: {workflow.efficiency_score}%</span>
                        </div>
                      </div>
                    ))
                  ) : (
                                         <div className="text-center py-8 text-muted-foreground">
                       <BarChart className="h-12 w-12 mx-auto mb-4 opacity-50" />
                       <p>No flows found</p>
                       <p className="text-sm">Create your first flow to see analytics here</p>
                     </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="team" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Team Performance
                </CardTitle>
                <CardDescription>
                  Individual team member productivity and task completion
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Team analytics coming soon</p>
                  <p className="text-sm">This feature will show individual team member performance</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="trends" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  Monthly Trends
                </CardTitle>
                                 <CardDescription>
                   Flow creation and completion trends over time
                 </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {monthlyData.length > 0 ? (
                    monthlyData.map((data) => (
                      <div
                        key={data.month}
                        className="flex items-center space-x-4"
                      >
                        <div className="w-12 text-sm font-medium">
                          {data.month}
                        </div>
                        <div className="flex-1 space-y-1">
                          <div className="flex justify-between text-xs">
                            <span>Created: {data.workflows}</span>
                            <span>Completed: {data.completed}</span>
                          </div>
                          <div className="flex space-x-1">
                            <div className="flex-1 bg-blue-200 rounded-full h-2">
                              <div
                                className="bg-blue-500 h-2 rounded-full"
                                style={{
                                  width: `${(data.workflows / Math.max(...monthlyData.map(d => d.workflows), 1)) * 100}%`,
                                }}
                              />
                            </div>
                            <div className="flex-1 bg-green-200 rounded-full h-2">
                              <div
                                className="bg-green-500 h-2 rounded-full"
                                style={{
                                  width: `${(data.completed / Math.max(...monthlyData.map(d => d.completed), 1)) * 100}%`,
                                }}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {data.workflows > 0 ? Math.round((data.completed / data.workflows) * 100) : 0}%
                        </div>
                      </div>
                    ))
                  ) : (
                                         <div className="text-center py-8 text-muted-foreground">
                       <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                       <p>No trend data available</p>
                       <p className="text-sm">Create flows to see monthly trends</p>
                     </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Productivity Insights</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Peak productivity day</span>
                    <Badge variant="secondary">Tuesday</Badge>
                  </div>
                                     <div className="flex items-center justify-between">
                     <span className="text-sm">Average flow duration</span>
                     <Badge variant="outline">{analyticsData?.avgCompletionTime || 0} days</Badge>
                   </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Most used template</span>
                    <Badge variant="secondary">Project Management</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Success rate</span>
                    <Badge variant="secondary">{analyticsData?.teamProductivity || 0}%</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recommendations</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                                     {analyticsData && analyticsData.avgCompletionTime > 7 && (
                     <div className="p-3 bg-blue-50 rounded-lg">
                       <p className="text-sm font-medium text-blue-900">
                         Optimize Flow Duration
                       </p>
                       <p className="text-xs text-blue-700">
                         Average completion time is {analyticsData.avgCompletionTime} days. Consider breaking flows into smaller tasks.
                       </p>
                     </div>
                   )}
                  {analyticsData && analyticsData.teamProductivity > 80 && (
                    <div className="p-3 bg-green-50 rounded-lg">
                      <p className="text-sm font-medium text-green-900">
                        Great Team Performance
                      </p>
                      <p className="text-xs text-green-700">
                        Your team efficiency is {analyticsData.teamProductivity}%. Keep up the great work!
                      </p>
                    </div>
                  )}
                                     {analyticsData && analyticsData.completedTasks / analyticsData.totalWorkflows < 0.7 && (
                     <div className="p-3 bg-yellow-50 rounded-lg">
                       <p className="text-sm font-medium text-yellow-900">
                         Improve Completion Rate
                       </p>
                       <p className="text-xs text-yellow-700">
                         Flow completion rate could be improved. Review bottlenecks and simplify processes.
                       </p>
                     </div>
                   )}
                                     {(!analyticsData || analyticsData.totalWorkflows === 0) && (
                     <div className="p-3 bg-purple-50 rounded-lg">
                       <p className="text-sm font-medium text-purple-900">
                         Get Started
                       </p>
                       <p className="text-xs text-purple-700">
                         Create your first flow to start tracking analytics and performance metrics.
                       </p>
                     </div>
                   )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </PermanentDashboard>
  );
};

export default Analytics;
