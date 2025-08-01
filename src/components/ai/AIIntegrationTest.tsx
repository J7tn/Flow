import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { useChat2API } from '@/lib/hooks/useChat2API';

const AIIntegrationTest: React.FC = () => {
  const {
    isLoading,
    error,
    healthCheck,
    generateWorkflowSuggestions,
    optimizeWorkflow,
    estimateWorkflowCosts,
  } = useChat2API();

  const [testResults, setTestResults] = React.useState<{
    healthCheck: boolean | null;
    workflowSuggestions: boolean | null;
    optimization: boolean | null;
    costAnalysis: boolean | null;
  }>({
    healthCheck: null,
    workflowSuggestions: null,
    optimization: null,
    costAnalysis: null,
  });

  const [isRunningTests, setIsRunningTests] = React.useState(false);

  const runAllTests = async () => {
    setIsRunningTests(true);
    setTestResults({
      healthCheck: null,
      workflowSuggestions: null,
      optimization: null,
      costAnalysis: null,
    });

    try {
      // Test 1: Health Check
      const healthResult = await healthCheck();
      setTestResults(prev => ({ ...prev, healthCheck: healthResult }));

      if (healthResult) {
        // Test 2: Workflow Suggestions
        try {
          await generateWorkflowSuggestions("Create a simple project management workflow");
          setTestResults(prev => ({ ...prev, workflowSuggestions: true }));
        } catch (error) {
          setTestResults(prev => ({ ...prev, workflowSuggestions: false }));
        }

        // Test 3: Optimization
        try {
          await optimizeWorkflow(["Planning", "Development", "Testing"]);
          setTestResults(prev => ({ ...prev, optimization: true }));
        } catch (error) {
          setTestResults(prev => ({ ...prev, optimization: false }));
        }

        // Test 4: Cost Analysis
        try {
          await estimateWorkflowCosts(["Planning", "Development", "Testing"]);
          setTestResults(prev => ({ ...prev, costAnalysis: true }));
        } catch (error) {
          setTestResults(prev => ({ ...prev, costAnalysis: false }));
        }
      }
    } catch (error) {
      console.error('Test failed:', error);
    } finally {
      setIsRunningTests(false);
    }
  };

  const getTestStatus = (result: boolean | null) => {
    if (result === null) return { icon: AlertCircle, color: 'text-yellow-500', text: 'Not tested' };
    if (result) return { icon: CheckCircle, color: 'text-green-500', text: 'Passed' };
    return { icon: XCircle, color: 'text-red-500', text: 'Failed' };
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
            AI Integration Test
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              AI service error: {error}
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <span className="font-medium">Health Check</span>
            <div className="flex items-center gap-2">
              {(() => {
                const status = getTestStatus(testResults.healthCheck);
                const Icon = status.icon;
                return (
                  <>
                    <Icon className={`h-4 w-4 ${status.color}`} />
                    <span className={status.color}>{status.text}</span>
                  </>
                );
              })()}
            </div>
          </div>

          <div className="flex items-center justify-between p-3 border rounded-lg">
            <span className="font-medium">Workflow Suggestions</span>
            <div className="flex items-center gap-2">
              {(() => {
                const status = getTestStatus(testResults.workflowSuggestions);
                const Icon = status.icon;
                return (
                  <>
                    <Icon className={`h-4 w-4 ${status.color}`} />
                    <span className={status.color}>{status.text}</span>
                  </>
                );
              })()}
            </div>
          </div>

          <div className="flex items-center justify-between p-3 border rounded-lg">
            <span className="font-medium">Workflow Optimization</span>
            <div className="flex items-center gap-2">
              {(() => {
                const status = getTestStatus(testResults.optimization);
                const Icon = status.icon;
                return (
                  <>
                    <Icon className={`h-4 w-4 ${status.color}`} />
                    <span className={status.color}>{status.text}</span>
                  </>
                );
              })()}
            </div>
          </div>

          <div className="flex items-center justify-between p-3 border rounded-lg">
            <span className="font-medium">Cost Analysis</span>
            <div className="flex items-center gap-2">
              {(() => {
                const status = getTestStatus(testResults.costAnalysis);
                const Icon = status.icon;
                return (
                  <>
                    <Icon className={`h-4 w-4 ${status.color}`} />
                    <span className={status.color}>{status.text}</span>
                  </>
                );
              })()}
            </div>
          </div>
        </div>

        <Button
          onClick={runAllTests}
          disabled={isRunningTests || isLoading}
          className="w-full"
        >
          {isRunningTests ? 'Running Tests...' : 'Run AI Integration Tests'}
        </Button>

        <div className="text-sm text-muted-foreground">
          <p>This test verifies that the AI integration is working correctly in the WorkflowBuilder and SmartSuggestionPanel components.</p>
          <p className="mt-2">
            <strong>Prerequisites:</strong> Make sure the chat2api service is running and accessible.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default AIIntegrationTest; 