import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Send, 
  Bot, 
  User, 
  Loader2, 
  Sparkles, 
  Workflow, 
  Calculator, 
  FileText,
  AlertCircle,
  CheckCircle,
  X
} from 'lucide-react';
import { useChat2API } from '@/lib/hooks/useChat2API';
import { ChatMessage } from '@/lib/chat2api';

interface AIAssistantProps {
  className?: string;
}

export function AIAssistant({ className }: AIAssistantProps) {
  const [inputValue, setInputValue] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [workflowSteps, setWorkflowSteps] = useState<string[]>([]);
  const [projectType, setProjectType] = useState('');
  const [streamingContent, setStreamingContent] = useState('');
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const {
    messages,
    isLoading,
    isStreaming,
    error,
    lastResponse,
    sendMessage,
    sendStreamingMessage,
    clearMessages,
    generateWorkflowSuggestions,
    optimizeWorkflow,
    estimateWorkflowCosts,
    generateTemplateSuggestions,
    healthCheck,
  } = useChat2API({
    model: 'gpt-3.5-turbo',
    temperature: 0.7,
    maxTokens: 1000,
    onError: (error) => {
      console.error('Chat2API Error:', error);
    },
  });

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages, streamingContent]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;
    
    setStreamingContent('');
    await sendStreamingMessage(inputValue, (chunk) => {
      setStreamingContent(prev => prev + chunk);
    });
    setInputValue('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleGenerateWorkflow = async () => {
    if (!projectDescription.trim()) return;
    
    try {
      const suggestions = await generateWorkflowSuggestions(projectDescription);
      // You can parse the suggestions and add them to your workflow
      console.log('Workflow suggestions:', suggestions);
    } catch (error) {
      console.error('Failed to generate workflow:', error);
    }
  };

  const handleOptimizeWorkflow = async () => {
    if (workflowSteps.length === 0) return;
    
    try {
      const optimized = await optimizeWorkflow(workflowSteps);
      console.log('Optimized workflow:', optimized);
    } catch (error) {
      console.error('Failed to optimize workflow:', error);
    }
  };

  const handleEstimateCosts = async () => {
    if (workflowSteps.length === 0) return;
    
    try {
      const costs = await estimateWorkflowCosts(workflowSteps);
      console.log('Cost estimation:', costs);
    } catch (error) {
      console.error('Failed to estimate costs:', error);
    }
  };

  const handleGenerateTemplate = async () => {
    if (!projectType.trim()) return;
    
    try {
      const template = await generateTemplateSuggestions(projectType);
      console.log('Template suggestions:', template);
    } catch (error) {
      console.error('Failed to generate template:', error);
    }
  };

  const addWorkflowStep = () => {
    const step = prompt('Enter workflow step:');
    if (step) {
      setWorkflowSteps(prev => [...prev, step]);
    }
  };

  const removeWorkflowStep = (index: number) => {
    setWorkflowSteps(prev => prev.filter((_, i) => i !== index));
  };

  const renderMessage = (message: ChatMessage, index: number) => (
    <motion.div
      key={index}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
    >
      <div className={`flex gap-3 max-w-[80%] ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
          message.role === 'user' 
            ? 'bg-gradient-to-r from-orange-500 to-purple-600 text-white' 
            : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
        }`}>
          {message.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
        </div>
        <div className={`rounded-lg p-3 ${
          message.role === 'user' 
            ? 'bg-gradient-to-r from-orange-500 to-purple-600 text-white' 
            : 'bg-gray-100 text-gray-900'
        }`}>
          <p className="whitespace-pre-wrap">{message.content}</p>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className={`w-full max-w-4xl mx-auto ${className}`}>
      <Card className="h-[600px] flex flex-col">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot className="w-6 h-6 text-purple-600" />
              <CardTitle>AI Workflow Assistant</CardTitle>
              <Badge variant="secondary" className="ml-2">
                Powered by ChatGPT
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={clearMessages}
                disabled={messages.length === 0}
              >
                Clear Chat
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={healthCheck}
              >
                Health Check
              </Button>
            </div>
          </div>
        </CardHeader>

        <Tabs defaultValue="chat" className="flex-1 flex flex-col">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="chat">Chat</TabsTrigger>
            <TabsTrigger value="workflow">Workflow AI</TabsTrigger>
            <TabsTrigger value="costs">Cost Analysis</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
          </TabsList>

          <TabsContent value="chat" className="flex-1 flex flex-col">
            <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
              <div className="space-y-4">
                {messages.length === 0 && (
                  <div className="text-center text-gray-500 py-8">
                    <Bot className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>Start a conversation with your AI assistant</p>
                    <p className="text-sm">Ask about workflows, project planning, or anything else!</p>
                  </div>
                )}
                
                <AnimatePresence>
                  {messages.map((message, index) => renderMessage(message, index))}
                  
                  {isStreaming && streamingContent && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex gap-3 justify-start"
                    >
                      <div className="flex gap-3 max-w-[80%]">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                          <Bot className="w-4 h-4" />
                        </div>
                        <div className="rounded-lg p-3 bg-gray-100 text-gray-900">
                          <p className="whitespace-pre-wrap">
                            {streamingContent}
                            <span className="animate-pulse">▋</span>
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {error && (
                  <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg">
                    <AlertCircle className="w-4 h-4" />
                    <span>{error}</span>
                  </div>
                )}
              </div>
            </ScrollArea>

            <div className="p-4 border-t">
              <div className="flex gap-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  disabled={isLoading || isStreaming}
                  className="flex-1"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isLoading || isStreaming}
                  className="bg-gradient-to-r from-orange-500 via-purple-600 to-blue-600 hover:from-orange-600 hover:via-purple-700 hover:to-blue-700"
                >
                  {(isLoading || isStreaming) ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="workflow" className="flex-1 p-4">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Project Description</label>
                <Textarea
                  value={projectDescription}
                  onChange={(e) => setProjectDescription(e.target.value)}
                  placeholder="Describe your project to get AI-powered workflow suggestions..."
                  rows={3}
                />
                <Button
                  onClick={handleGenerateWorkflow}
                  disabled={!projectDescription.trim() || isLoading}
                  className="mt-2 bg-gradient-to-r from-orange-500 via-purple-600 to-blue-600"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate Workflow
                </Button>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Current Workflow Steps</label>
                <div className="space-y-2">
                  {workflowSteps.map((step, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                      <span className="text-sm font-medium">{index + 1}.</span>
                      <span className="flex-1 text-sm">{step}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeWorkflowStep(index)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
                <Button
                  onClick={addWorkflowStep}
                  variant="outline"
                  className="mt-2"
                >
                  Add Step
                </Button>
                <Button
                  onClick={handleOptimizeWorkflow}
                  disabled={workflowSteps.length === 0 || isLoading}
                  className="mt-2 ml-2 bg-gradient-to-r from-orange-500 via-purple-600 to-blue-600"
                >
                  <Workflow className="w-4 h-4 mr-2" />
                  Optimize Workflow
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="costs" className="flex-1 p-4">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Workflow Steps for Cost Analysis</label>
                <div className="space-y-2">
                  {workflowSteps.map((step, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                      <span className="text-sm font-medium">{index + 1}.</span>
                      <span className="flex-1 text-sm">{step}</span>
                    </div>
                  ))}
                </div>
                <Button
                  onClick={handleEstimateCosts}
                  disabled={workflowSteps.length === 0 || isLoading}
                  className="mt-2 bg-gradient-to-r from-orange-500 via-purple-600 to-blue-600"
                >
                  <Calculator className="w-4 h-4 mr-2" />
                  Estimate Costs
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="templates" className="flex-1 p-4">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Project Type</label>
                <Input
                  value={projectType}
                  onChange={(e) => setProjectType(e.target.value)}
                  placeholder="e.g., Software Development, Marketing Campaign, Event Planning..."
                />
                <Button
                  onClick={handleGenerateTemplate}
                  disabled={!projectType.trim() || isLoading}
                  className="mt-2 bg-gradient-to-r from-orange-500 via-purple-600 to-blue-600"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Generate Template
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
} 