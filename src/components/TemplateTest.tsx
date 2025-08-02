import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { testSupabaseConnection, uploadTemplate } from '@/lib/api';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

export const TemplateTest: React.FC = () => {
  const [testResult, setTestResult] = useState<{
    success: boolean;
    error?: string;
    user?: any;
  } | null>(null);
  const [isTesting, setIsTesting] = useState(false);
  const [uploadResult, setUploadResult] = useState<{
    success: boolean;
    error?: string;
    data?: any;
  } | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null);
    
    try {
      const result = await testSupabaseConnection();
      setTestResult(result);
      console.log('Connection test result:', result);
    } catch (error) {
      setTestResult({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleTestUpload = async () => {
    setIsUploading(true);
    setUploadResult(null);
    
    try {
      // Create a test template
      const testTemplate = {
        name: 'Test Template',
        description: 'This is a test template to verify the upload functionality',
        category: 'software-development' as const,
        difficulty: 'beginner' as const,
        targetAudience: 'individual' as const,
        estimatedDuration: {
          min: 1,
          max: 2,
          unit: 'weeks' as const,
        },
        tags: ['test', 'debug'],
        thumbnail: undefined,
        version: '1.0.0',
        author: 'Test User',
        lastUpdated: new Date(),
        isPublic: true,
        steps: [
          {
            id: 'test-step-1',
            title: 'Test Step 1',
            description: 'This is a test step',
            type: 'planning' as const,
            order: 0,
            estimatedDuration: { min: 1, max: 2, unit: 'days' as const },
            requiredSkills: [],
            requiredTools: [],
            dependencies: [],
            deliverables: [],
            acceptanceCriteria: [],
            riskLevel: 'low' as const,
            costEstimate: { min: 0, max: 100, currency: 'USD' as const },
            automationPotential: 50,
            optimizationTips: [],
          }
        ],
        costAnalysis: {
          totalCost: 200,
          breakdown: [
            {
              id: 'test-cost-1',
              name: 'Test Cost',
              description: 'Test cost item',
              type: 'one-time' as const,
              amount: 200,
              currency: 'USD' as const,
              frequency: 'one-time' as const,
            }
          ],
          currency: 'USD' as const,
          calculationDate: new Date(),
          assumptions: ['Test assumption'],
          riskFactors: ['Test risk'],
        },
        recommendedTools: [],
        optimizationSuggestions: [
          {
            category: 'efficiency' as const,
            title: 'Test Optimization',
            description: 'Test optimization suggestion',
            impact: 'medium' as const,
            effort: 'low' as const,
            implementation: 'Test implementation',
          }
        ],
        industryContext: {
          marketSize: 'Test market size',
          competition: 'Low',
          regulations: [],
          trends: ['Test trend'],
          challenges: ['Test challenge'],
          opportunities: ['Test opportunity'],
        },
        successMetrics: [
          {
            name: 'Test Metric',
            description: 'Test success metric',
            target: '100%',
            measurement: 'Test measurement',
            frequency: 'weekly' as const,
          }
        ],
        risks: [
          {
            category: 'technical' as const,
            title: 'Test Risk',
            description: 'Test risk description',
            probability: 'low' as const,
            impact: 'medium' as const,
            mitigation: 'Test mitigation',
          }
        ],
        customizationOptions: [],
        isUserGenerated: true,
        status: 'pending' as const,
      };

      const result = await uploadTemplate(testTemplate);
      setUploadResult({
        success: !result.error,
        error: result.error || undefined,
        data: result.data || undefined,
      });
      console.log('Upload test result:', result);
    } catch (error) {
      setUploadResult({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Template Upload Debug Tool</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Connection Test */}
          <div className="space-y-2">
            <h3 className="text-lg font-medium">1. Test Supabase Connection</h3>
            <Button
              onClick={handleTestConnection}
              disabled={isTesting}
              className="w-full"
            >
              {isTesting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Testing Connection...
                </>
              ) : (
                'Test Connection'
              )}
            </Button>
            
            {testResult && (
              <Alert className={testResult.success ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
                {testResult.success ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-red-600" />
                )}
                <AlertDescription className={testResult.success ? 'text-green-800' : 'text-red-800'}>
                  {testResult.success 
                    ? 'Connection successful! User is authenticated and database is accessible.'
                    : `Connection failed: ${testResult.error}`
                  }
                </AlertDescription>
              </Alert>
            )}
          </div>

          {/* Upload Test */}
          <div className="space-y-2">
            <h3 className="text-lg font-medium">2. Test Template Upload</h3>
            <Button
              onClick={handleTestUpload}
              disabled={isUploading || !testResult?.success}
              className="w-full"
            >
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Testing Upload...
                </>
              ) : (
                'Test Template Upload'
              )}
            </Button>
            
            {uploadResult && (
              <Alert className={uploadResult.success ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
                {uploadResult.success ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-red-600" />
                )}
                <AlertDescription className={uploadResult.success ? 'text-green-800' : 'text-red-800'}>
                  {uploadResult.success 
                    ? 'Upload successful! Template saved to database.'
                    : `Upload failed: ${uploadResult.error}`
                  }
                </AlertDescription>
              </Alert>
            )}
          </div>

          {/* Instructions */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">How to use this debug tool:</h4>
            <ol className="text-sm text-blue-800 space-y-1">
              <li>1. First, test the Supabase connection to ensure authentication and database access</li>
              <li>2. If the connection test passes, try the template upload test</li>
              <li>3. Check the browser console for detailed error messages</li>
              <li>4. Use the results to identify and fix any issues</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 