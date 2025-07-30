import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  CheckCircle,
  Clock,
  AlertCircle,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Filter,
  Calendar,
} from "lucide-react";

interface Step {
  id: string;
  title: string;
  status: "completed" | "in-progress" | "pending";
  progress: number;
  dependencies: string[];
  resources: string[];
  dueDate: string;
}

interface VisualProgressTrackerProps {
  workflowId?: string;
  steps?: Step[];
  onUpdateStep?: (stepId: string, updates: Partial<Step>) => void;
}

const VisualProgressTracker = ({
  workflowId = "1",
  steps = [
    {
      id: "1",
      title: "Research Phase",
      status: "completed",
      progress: 100,
      dependencies: [],
      resources: ["Documentation", "Internet"],
      dueDate: "2023-06-15",
    },
    {
      id: "2",
      title: "Planning",
      status: "in-progress",
      progress: 60,
      dependencies: ["1"],
      resources: ["Whiteboard", "Team"],
      dueDate: "2023-06-20",
    },
    {
      id: "3",
      title: "Implementation",
      status: "pending",
      progress: 0,
      dependencies: ["2"],
      resources: ["Development Team", "Tools"],
      dueDate: "2023-07-01",
    },
    {
      id: "4",
      title: "Testing",
      status: "pending",
      progress: 0,
      dependencies: ["3"],
      resources: ["QA Team", "Test Environment"],
      dueDate: "2023-07-10",
    },
    {
      id: "5",
      title: "Deployment",
      status: "pending",
      progress: 0,
      dependencies: ["4"],
      resources: ["DevOps", "Production Environment"],
      dueDate: "2023-07-15",
    },
  ],
  onUpdateStep = () => {},
}: VisualProgressTrackerProps) => {
  const [zoomLevel, setZoomLevel] = useState<number>(50);
  const [view, setView] = useState<string>("timeline");

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "in-progress":
        return <Clock className="h-5 w-5 text-blue-500" />;
      case "pending":
        return <AlertCircle className="h-5 w-5 text-gray-400" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 border-green-300";
      case "in-progress":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "pending":
        return "bg-gray-100 text-gray-800 border-gray-300";
      default:
        return "";
    }
  };

  const handleUpdateStatus = (stepId: string, newStatus: Step["status"]) => {
    onUpdateStep(stepId, { status: newStatus });
  };

  const handleUpdateProgress = (stepId: string, newProgress: number) => {
    onUpdateStep(stepId, { progress: newProgress });
  };

  return (
    <Card className="w-full bg-white border-gray-200">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">
            Workflow Progress
          </h2>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button variant="outline" size="sm">
              <Calendar className="h-4 w-4 mr-2" />
              Timeline View
            </Button>
          </div>
        </div>

        <Tabs value={view} onValueChange={setView} className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
            <TabsTrigger value="list">List View</TabsTrigger>
            <TabsTrigger value="dependencies">Dependencies</TabsTrigger>
          </TabsList>

          <div className="flex items-center justify-end mb-4 space-x-2">
            <ZoomOut className="h-4 w-4 text-gray-500" />
            <Slider
              className="w-32"
              value={[zoomLevel]}
              min={10}
              max={100}
              step={10}
              onValueChange={(value) => setZoomLevel(value[0])}
            />
            <ZoomIn className="h-4 w-4 text-gray-500" />
          </div>

          <TabsContent value="timeline" className="mt-0">
            <div
              className="relative overflow-x-auto"
              style={{
                minHeight: "300px",
                transform: `scale(${0.5 + (zoomLevel / 100) * 0.5})`,
                transformOrigin: "left top",
              }}
            >
              <div className="flex flex-col space-y-6 pb-6">
                {steps.map((step, index) => (
                  <div key={step.id} className="relative">
                    {/* Connection lines */}
                    {index > 0 && (
                      <div className="absolute top-0 left-6 h-full w-0.5 -mt-6 bg-gray-200"></div>
                    )}

                    <div className="flex items-start">
                      <div
                        className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${step.status === "completed" ? "bg-green-100" : step.status === "in-progress" ? "bg-blue-100" : "bg-gray-100"}`}
                      >
                        {getStatusIcon(step.status)}
                      </div>

                      <div className="ml-4 flex-grow">
                        <div
                          className={`p-4 rounded-lg border ${getStatusColor(step.status)}`}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-medium text-lg">
                              {step.title}
                            </h3>
                            <Badge
                              variant={
                                step.status === "completed"
                                  ? "default"
                                  : step.status === "in-progress"
                                    ? "secondary"
                                    : "outline"
                              }
                            >
                              {step.status.replace("-", " ")}
                            </Badge>
                          </div>

                          <div className="mb-3">
                            <div className="flex justify-between text-sm text-gray-500 mb-1">
                              <span>Progress</span>
                              <span>{step.progress}%</span>
                            </div>
                            <Progress value={step.progress} className="h-2" />
                          </div>

                          <div className="flex flex-wrap gap-2 mb-3">
                            {step.resources.map((resource) => (
                              <Badge
                                key={resource}
                                variant="outline"
                                className="bg-gray-50"
                              >
                                {resource}
                              </Badge>
                            ))}
                          </div>

                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-500">
                              Due: {step.dueDate}
                            </span>
                            <div className="flex space-x-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  handleUpdateStatus(step.id, "completed")
                                }
                                disabled={step.status === "completed"}
                              >
                                Mark Complete
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  handleUpdateProgress(
                                    step.id,
                                    Math.min(100, step.progress + 10),
                                  )
                                }
                                disabled={step.progress >= 100}
                              >
                                Update Progress
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="list" className="mt-0">
            <div className="space-y-4">
              {steps.map((step) => (
                <div
                  key={step.id}
                  className="flex items-center p-4 border rounded-lg"
                >
                  <div className="mr-4">{getStatusIcon(step.status)}</div>
                  <div className="flex-grow">
                    <h3 className="font-medium">{step.title}</h3>
                    <div className="flex items-center text-sm text-gray-500">
                      <span>Progress: {step.progress}%</span>
                      <span className="mx-2">•</span>
                      <span>Due: {step.dueDate}</span>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="dependencies" className="mt-0">
            <div className="p-4 border rounded-lg bg-gray-50">
              <h3 className="font-medium mb-4">Dependency Map</h3>
              <div className="space-y-4">
                {steps.map((step) => (
                  <div key={step.id} className="p-3 bg-white border rounded-md">
                    <h4 className="font-medium">{step.title}</h4>
                    {step.dependencies.length > 0 ? (
                      <div className="mt-2">
                        <span className="text-sm text-gray-500">
                          Depends on:
                        </span>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {step.dependencies.map((depId) => {
                            const depStep = steps.find((s) => s.id === depId);
                            return depStep ? (
                              <Badge key={depId} variant="outline">
                                {depStep.title}
                              </Badge>
                            ) : null;
                          })}
                        </div>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-500 block mt-2">
                        No dependencies
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <Separator className="my-6" />

        <div className="flex justify-between items-center">
          <div>
            <span className="text-sm text-gray-500">Overall Progress</span>
            <div className="flex items-center mt-1">
              <Progress
                value={
                  steps.reduce((acc, step) => acc + step.progress, 0) /
                  steps.length
                }
                className="w-40 h-2 mr-3"
              />
              <span className="text-sm font-medium">
                {Math.round(
                  steps.reduce((acc, step) => acc + step.progress, 0) /
                    steps.length,
                )}
                %
              </span>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              Export
            </Button>
            <Button size="sm">Update All</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VisualProgressTracker;
