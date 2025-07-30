import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  PlusCircle,
  Save,
  Trash2,
  MoveHorizontal,
  Settings,
  ChevronRight,
} from "lucide-react";
import SmartSuggestionPanel from "./SmartSuggestionPanel";
import VisualProgressTracker from "./VisualProgressTracker";

interface WorkflowStep {
  id: string;
  title: string;
  description: string;
  type: string;
  duration: number;
  dependencies: string[];
}

interface WorkflowBuilderProps {
  initialWorkflow?: {
    id: string;
    title: string;
    description: string;
    steps: WorkflowStep[];
  };
  onSave?: (workflow: any) => void;
}

const WorkflowBuilder = ({
  initialWorkflow = {
    id: "",
    title: "New Workflow",
    description: "Describe your workflow here",
    steps: [],
  },
  onSave = () => {},
}: WorkflowBuilderProps) => {
  const [workflow, setWorkflow] = useState(initialWorkflow);
  const [activeTab, setActiveTab] = useState("canvas");
  const [selectedStep, setSelectedStep] = useState<string | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(true);

  const templates = [
    { id: "blank", name: "Blank Workflow" },
    { id: "project", name: "Project Management" },
    { id: "daily", name: "Daily Routine" },
    { id: "learning", name: "Learning Path" },
  ];

  const stepTypes = [
    { id: "task", name: "Task" },
    { id: "milestone", name: "Milestone" },
    { id: "decision", name: "Decision Point" },
    { id: "resource", name: "Resource Allocation" },
  ];

  const addStep = () => {
    const newStep: WorkflowStep = {
      id: `step-${Date.now()}`,
      title: "New Step",
      description: "Describe this step",
      type: "task",
      duration: 60, // minutes
      dependencies: [],
    };

    setWorkflow({
      ...workflow,
      steps: [...workflow.steps, newStep],
    });
    setSelectedStep(newStep.id);
  };

  const updateStep = (id: string, updates: Partial<WorkflowStep>) => {
    setWorkflow({
      ...workflow,
      steps: workflow.steps.map((step) =>
        step.id === id ? { ...step, ...updates } : step,
      ),
    });
  };

  const deleteStep = (id: string) => {
    setWorkflow({
      ...workflow,
      steps: workflow.steps.filter((step) => step.id !== id),
    });
    if (selectedStep === id) {
      setSelectedStep(null);
    }
  };

  const handleSave = () => {
    onSave(workflow);
    // Show success message or redirect
  };

  const selectedStepData = selectedStep
    ? workflow.steps.find((step) => step.id === selectedStep)
    : null;

  return (
    <div className="flex h-full bg-background">
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b flex justify-between items-center">
          <div>
            <Input
              className="text-xl font-semibold border-none bg-transparent w-80"
              value={workflow.title}
              onChange={(e) =>
                setWorkflow({ ...workflow, title: e.target.value })
              }
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setShowSuggestions(!showSuggestions)}
            >
              {showSuggestions ? "Hide" : "Show"} Suggestions
            </Button>
            <Button onClick={handleSave}>
              <Save className="mr-2 h-4 w-4" /> Save Workflow
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="flex-1 flex flex-col"
        >
          <div className="border-b px-4">
            <TabsList>
              <TabsTrigger value="canvas">Canvas</TabsTrigger>
              <TabsTrigger value="timeline">Timeline</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
          </div>

          <div className="flex-1 overflow-hidden">
            <TabsContent value="canvas" className="h-full flex">
              <div className="flex-1 p-4 overflow-auto">
                {/* Template Selection */}
                {workflow.steps.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full">
                    <h2 className="text-2xl font-semibold mb-6">
                      Start Building Your Workflow
                    </h2>
                    <div className="grid grid-cols-2 gap-4 max-w-2xl">
                      {templates.map((template) => (
                        <Card
                          key={template.id}
                          className="cursor-pointer hover:border-primary transition-colors"
                          onClick={() => addStep()}
                        >
                          <CardContent className="p-6 flex flex-col items-center justify-center">
                            <h3 className="font-medium text-lg">
                              {template.name}
                            </h3>
                            <p className="text-muted-foreground text-sm mt-2">
                              Start with a {template.name.toLowerCase()}{" "}
                              template
                            </p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                    {/* Workflow Canvas */}
                    <div className="flex justify-between mb-4">
                      <h2 className="text-xl font-semibold">Workflow Steps</h2>
                      <Button onClick={addStep} size="sm">
                        <PlusCircle className="mr-2 h-4 w-4" /> Add Step
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {workflow.steps.map((step) => (
                        <Card
                          key={step.id}
                          className={`cursor-pointer ${selectedStep === step.id ? "border-primary" : ""}`}
                          onClick={() => setSelectedStep(step.id)}
                        >
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-medium">{step.title}</h3>
                                <p className="text-xs text-muted-foreground">
                                  {step.type}
                                </p>
                              </div>
                              <div className="flex gap-1">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    deleteStep(step.id);
                                  }}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon">
                                  <MoveHorizontal className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                            <p className="text-sm mt-2 line-clamp-2">
                              {step.description}
                            </p>
                            {step.dependencies.length > 0 && (
                              <div className="mt-2 text-xs text-muted-foreground">
                                Dependencies: {step.dependencies.length}
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Step Configuration Panel */}
              {selectedStep && (
                <div className="w-80 border-l p-4 overflow-y-auto">
                  <h3 className="font-semibold mb-4">Step Configuration</h3>

                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Title</label>
                      <Input
                        value={selectedStepData?.title || ""}
                        onChange={(e) =>
                          updateStep(selectedStep, { title: e.target.value })
                        }
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium">Type</label>
                      <Select
                        value={selectedStepData?.type || "task"}
                        onValueChange={(value) =>
                          updateStep(selectedStep, { type: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          {stepTypes.map((type) => (
                            <SelectItem key={type.id} value={type.id}>
                              {type.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm font-medium">Description</label>
                      <Textarea
                        value={selectedStepData?.description || ""}
                        onChange={(e) =>
                          updateStep(selectedStep, {
                            description: e.target.value,
                          })
                        }
                        rows={4}
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium">
                        Duration (minutes)
                      </label>
                      <Input
                        type="number"
                        value={selectedStepData?.duration || 0}
                        onChange={(e) =>
                          updateStep(selectedStep, {
                            duration: parseInt(e.target.value) || 0,
                          })
                        }
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium">
                        Dependencies
                      </label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Add dependency" />
                        </SelectTrigger>
                        <SelectContent>
                          {workflow.steps
                            .filter((step) => step.id !== selectedStep)
                            .map((step) => (
                              <SelectItem key={step.id} value={step.id}>
                                {step.title}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>

                      {selectedStepData?.dependencies &&
                      selectedStepData.dependencies.length > 0 ? (
                        <div className="mt-2 space-y-1">
                          {selectedStepData.dependencies.map((depId) => {
                            const dep = workflow.steps.find(
                              (s) => s.id === depId,
                            );
                            return (
                              <div
                                key={depId}
                                className="flex justify-between items-center text-sm p-2 bg-muted rounded-md"
                              >
                                <span>{dep?.title || "Unknown step"}</span>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <p className="text-xs text-muted-foreground mt-2">
                          No dependencies set
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="timeline" className="h-full">
              <div className="p-4 h-full">
                <VisualProgressTracker
                  workflowId={workflow.id}
                  steps={workflow.steps.map((step) => ({
                    id: step.id,
                    title: step.title,
                    status: "pending" as const,
                    progress: 0,
                    dependencies: step.dependencies,
                    resources: [],
                    dueDate: new Date(Date.now() + step.duration * 60000)
                      .toISOString()
                      .split("T")[0],
                  }))}
                  onUpdateStep={(id, updates) => updateStep(id, updates)}
                />
              </div>
            </TabsContent>

            <TabsContent value="settings" className="h-full">
              <div className="p-4 max-w-2xl mx-auto">
                <h2 className="text-xl font-semibold mb-4">
                  Workflow Settings
                </h2>

                <div className="space-y-6">
                  <div>
                    <label className="text-sm font-medium">
                      Workflow Title
                    </label>
                    <Input
                      value={workflow.title}
                      onChange={(e) =>
                        setWorkflow({ ...workflow, title: e.target.value })
                      }
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">Description</label>
                    <Textarea
                      value={workflow.description}
                      onChange={(e) =>
                        setWorkflow({
                          ...workflow,
                          description: e.target.value,
                        })
                      }
                      rows={4}
                    />
                  </div>

                  <div>
                    <h3 className="text-sm font-medium mb-2">
                      Advanced Settings
                    </h3>
                    <Card>
                      <CardContent className="p-4 space-y-4">
                        <div className="flex items-center">
                          <Settings className="h-4 w-4 mr-2" />
                          <span>Workflow Permissions</span>
                          <ChevronRight className="h-4 w-4 ml-auto" />
                        </div>
                        <div className="flex items-center">
                          <Settings className="h-4 w-4 mr-2" />
                          <span>Notification Settings</span>
                          <ChevronRight className="h-4 w-4 ml-auto" />
                        </div>
                        <div className="flex items-center">
                          <Settings className="h-4 w-4 mr-2" />
                          <span>Integration Options</span>
                          <ChevronRight className="h-4 w-4 ml-auto" />
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>

      {/* Smart Suggestion Panel */}
      {showSuggestions && (
        <div className="w-80 border-l overflow-y-auto">
          <SmartSuggestionPanel
            workflowId={workflow.id}
            currentSteps={workflow.steps}
            onApplySuggestion={(suggestion) => {
              // Handle applying suggestion
              console.log("Applying suggestion:", suggestion);
            }}
          />
        </div>
      )}
    </div>
  );
};

export default WorkflowBuilder;
