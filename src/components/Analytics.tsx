import React from "react";
import {
  BarChart,
  TrendingUp,
  Clock,
  Target,
  Users,
  Calendar,
  Activity,
  Award,
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

const Analytics = () => {
  // Mock analytics data
  const overviewStats = [
    {
      title: "Total Workflows",
      value: "24",
      change: "+12%",
      trend: "up",
      icon: BarChart,
    },
    {
      title: "Completed Tasks",
      value: "156",
      change: "+23%",
      trend: "up",
      icon: Target,
    },
    {
      title: "Avg. Completion Time",
      value: "4.2 days",
      change: "-8%",
      trend: "down",
      icon: Clock,
    },
    {
      title: "Team Productivity",
      value: "87%",
      change: "+5%",
      trend: "up",
      icon: TrendingUp,
    },
  ];

  const workflowPerformance = [
    {
      name: "Product Launch Campaign",
      completion: 85,
      efficiency: 92,
      onTime: true,
    },
    {
      name: "Website Redesign",
      completion: 60,
      efficiency: 78,
      onTime: true,
    },
    {
      name: "Content Strategy",
      completion: 100,
      efficiency: 95,
      onTime: true,
    },
    {
      name: "Budget Review",
      completion: 30,
      efficiency: 65,
      onTime: false,
    },
  ];

  const teamMetrics = [
    {
      name: "Alex Johnson",
      tasksCompleted: 28,
      efficiency: 94,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
    },
    {
      name: "Jamie Smith",
      tasksCompleted: 24,
      efficiency: 89,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jamie",
    },
    {
      name: "Taylor Brown",
      tasksCompleted: 31,
      efficiency: 91,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Taylor",
    },
    {
      name: "Morgan Davis",
      tasksCompleted: 19,
      efficiency: 86,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Morgan",
    },
  ];

  const monthlyData = [
    { month: "Jan", workflows: 8, completed: 6 },
    { month: "Feb", workflows: 12, completed: 10 },
    { month: "Mar", workflows: 15, completed: 13 },
    { month: "Apr", workflows: 18, completed: 16 },
    { month: "May", workflows: 22, completed: 19 },
    { month: "Jun", workflows: 24, completed: 20 },
  ];

  return (
    <div className="flex h-screen bg-background">
      <div className="flex-1 p-6">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
            <div className="flex space-x-2">
              <Button variant="outline">Export Report</Button>
              <Button>Generate Insights</Button>
            </div>
          </div>
          <p className="text-muted-foreground">
            Track your workflow performance and team productivity.
          </p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="workflows">Workflows</TabsTrigger>
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
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">
                        Product Launch Campaign completed
                      </p>
                      <p className="text-xs text-muted-foreground">
                        2 hours ago
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">
                        New workflow created: Mobile App Design
                      </p>
                      <p className="text-xs text-muted-foreground">
                        5 hours ago
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">
                        Budget Review workflow paused
                      </p>
                      <p className="text-xs text-muted-foreground">1 day ago</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">
                        Team member added to Website Redesign
                      </p>
                      <p className="text-xs text-muted-foreground">
                        2 days ago
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Award className="h-5 w-5 mr-2" />
                    Top Performers
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {teamMetrics.slice(0, 3).map((member, index) => (
                    <div
                      key={member.name}
                      className="flex items-center space-x-3"
                    >
                      <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{member.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {member.tasksCompleted} tasks • {member.efficiency}%
                          efficiency
                        </p>
                      </div>
                      <Badge variant="secondary">{member.efficiency}%</Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="workflows" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Workflow Performance</CardTitle>
                <CardDescription>
                  Track the progress and efficiency of your active workflows
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {workflowPerformance.map((workflow) => (
                    <div key={workflow.name} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{workflow.name}</h4>
                        <div className="flex items-center space-x-2">
                          <Badge
                            variant={
                              workflow.onTime ? "secondary" : "destructive"
                            }
                          >
                            {workflow.onTime ? "On Track" : "Delayed"}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            {workflow.completion}%
                          </span>
                        </div>
                      </div>
                      <Progress value={workflow.completion} className="h-2" />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Completion: {workflow.completion}%</span>
                        <span>Efficiency: {workflow.efficiency}%</span>
                      </div>
                    </div>
                  ))}
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
                <div className="space-y-4">
                  {teamMetrics.map((member) => (
                    <div
                      key={member.name}
                      className="flex items-center space-x-4 p-4 border rounded-lg"
                    >
                      <img
                        src={member.avatar}
                        alt={member.name}
                        className="w-10 h-10 rounded-full"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium">{member.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {member.tasksCompleted} tasks completed this month
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold">
                          {member.efficiency}%
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Efficiency
                        </p>
                      </div>
                      <Progress value={member.efficiency} className="w-20" />
                    </div>
                  ))}
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
                  Workflow creation and completion trends over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {monthlyData.map((data) => (
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
                                width: `${(data.workflows / 30) * 100}%`,
                              }}
                            />
                          </div>
                          <div className="flex-1 bg-green-200 rounded-full h-2">
                            <div
                              className="bg-green-500 h-2 rounded-full"
                              style={{
                                width: `${(data.completed / 30) * 100}%`,
                              }}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {Math.round((data.completed / data.workflows) * 100)}%
                      </div>
                    </div>
                  ))}
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
                    <span className="text-sm">Average workflow duration</span>
                    <Badge variant="outline">4.2 days</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Most used template</span>
                    <Badge variant="secondary">Project Management</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Success rate</span>
                    <Badge variant="secondary">87%</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recommendations</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm font-medium text-blue-900">
                      Optimize Budget Review
                    </p>
                    <p className="text-xs text-blue-700">
                      This workflow is behind schedule. Consider breaking it
                      into smaller tasks.
                    </p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <p className="text-sm font-medium text-green-900">
                      Great Team Performance
                    </p>
                    <p className="text-xs text-green-700">
                      Your team efficiency is up 15% this month. Keep up the
                      great work!
                    </p>
                  </div>
                  <div className="p-3 bg-yellow-50 rounded-lg">
                    <p className="text-sm font-medium text-yellow-900">
                      Template Opportunity
                    </p>
                    <p className="text-xs text-yellow-700">
                      Consider creating a template from your successful Product
                      Launch workflow.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Analytics;
