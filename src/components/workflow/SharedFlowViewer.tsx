import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Target,
  List,
  Clock,
  DollarSign,
  Users,
  BarChart3,
  Copy,
  Download,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface SharedFlowData {
  name: string;
  description: string;
  goal: string;
  steps: Array<{
    id: string;
    title: string;
    description: string;
    type: string;
    status: string;
    assignee?: string;
    estimatedTime?: number;
    cost?: number;
  }>;
  timestamp: number;
}

const SharedFlowViewer = () => {
  const { encodedData } = useParams<{ encodedData: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [flowData, setFlowData] = useState<SharedFlowData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (encodedData) {
      try {
        const decodedData = atob(encodedData);
        const parsedData = JSON.parse(decodedData) as SharedFlowData;
        setFlowData(parsedData);
      } catch (err) {
        setError("Invalid or corrupted share link");
        console.error("Error decoding flow data:", err);
      }
    }
  }, [encodedData]);

  const calculateTotalCost = () => {
    if (!flowData) return 0;
    return flowData.steps.reduce((total, step) => total + (step.cost || 0), 0);
  };

  const calculateTotalTime = () => {
    if (!flowData) return 0;
    return flowData.steps.reduce((total, step) => total + (step.estimatedTime || 0), 0);
  };

  const copyFlowData = async () => {
    if (!flowData) return;
    
    try {
      const flowText = `
Flow: ${flowData.name}
Description: ${flowData.description}
Goal: ${flowData.goal}

Steps:
${flowData.steps.map((step, index) => `${index + 1}. ${step.title} - ${step.description}`).join('\n')}

Total Time: ${calculateTotalTime()} hours
Total Cost: $${calculateTotalCost()}
      `.trim();
      
      await navigator.clipboard.writeText(flowText);
      toast({
        title: "Copied!",
        description: "Flow details copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy flow details",
        variant: "destructive",
      });
    }
  };

  const downloadFlowData = () => {
    if (!flowData) return;
    
    const flowText = `
Flow: ${flowData.name}
Description: ${flowData.description}
Goal: ${flowData.goal}

Steps:
${flowData.steps.map((step, index) => `${index + 1}. ${step.title} - ${step.description}`).join('\n')}

Total Time: ${calculateTotalTime()} hours
Total Cost: $${calculateTotalCost()}
    `.trim();
    
    const blob = new Blob([flowText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${flowData.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_flow.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-red-600">Invalid Share Link</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate("/")} className="w-full">
              Go Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!flowData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="border-b bg-white px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/")}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
            <Separator orientation="vertical" className="h-6" />
            <div>
              <h1 className="text-xl font-semibold">{flowData.name}</h1>
              {flowData.description && (
                <p className="text-sm text-muted-foreground">{flowData.description}</p>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={copyFlowData}>
              <Copy className="h-4 w-4 mr-2" />
              Copy
            </Button>
            <Button variant="outline" size="sm" onClick={downloadFlowData}>
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Flow Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-blue-500" />
              Flow Overview
            </CardTitle>
          </CardHeader>
          {flowData.goal && (
            <CardContent>
              <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200">
                <div className="w-2 h-2 rounded-full bg-purple-500 mt-2 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-purple-900 mb-1">Goal</h4>
                  <p className="text-sm text-purple-700">{flowData.goal}</p>
                </div>
              </div>
            </CardContent>
          )}
        </Card>

        {/* Flow Steps */}
        {flowData.steps.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <List className="h-5 w-5 text-green-500" />
                Flow Steps ({flowData.steps.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {flowData.steps.map((step, index) => (
                  <div key={step.id} className="flex items-start gap-4 p-4 border rounded-lg">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-sm font-medium text-blue-600">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-medium">{step.title}</h4>
                        <Badge variant="outline" className="text-xs">
                          {step.type}
                        </Badge>
                        <Badge 
                          variant={step.status === 'completed' ? 'default' : 'secondary'}
                          className="text-xs"
                        >
                          {step.status}
                        </Badge>
                      </div>
                      {step.description && (
                        <p className="text-sm text-muted-foreground mb-2">{step.description}</p>
                      )}
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        {step.estimatedTime && (
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {step.estimatedTime} min
                          </span>
                        )}
                        {step.cost && (
                          <span className="flex items-center gap-1">
                            <DollarSign className="h-3 w-3" />
                            ${step.cost}
                          </span>
                        )}
                        {step.assignee && (
                          <span className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {step.assignee}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Flow Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-orange-500" />
              Flow Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{flowData.steps.length}</div>
                <div className="text-sm text-blue-700">Total Steps</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{calculateTotalTime()}</div>
                <div className="text-sm text-green-700">Total Time (min)</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">${calculateTotalCost()}</div>
                <div className="text-sm text-purple-700">Total Cost</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Share Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">
              Shared on {new Date(flowData.timestamp).toLocaleDateString()}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
};

export default SharedFlowViewer; 