import { z } from 'zod';

// Base template types
export const templateCategorySchema = z.enum([
  'software-development',
  'game-design',
  'manufacturing',
  'marketing',
  'business-operations',
  'creative-projects',
  'research-development',
  'customer-service',
  'human-resources',
  'finance',
  'healthcare',
  'education',
  'legal',
  'real-estate',
  'consulting',
  'ecommerce',
  'content-creation',
  'event-planning',
  'product-management',
  'quality-assurance'
]);

export const difficultyLevelSchema = z.enum(['beginner', 'intermediate', 'advanced', 'expert']);

export const costTypeSchema = z.enum([
  'fixed',
  'variable',
  'recurring',
  'one-time',
  'subscription',
  'licensing',
  'infrastructure',
  'labor',
  'materials',
  'overhead'
]);

// Cost calculation types
export const costItemSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, 'Cost item name is required'),
  description: z.string().optional(),
  type: costTypeSchema,
  amount: z.number().positive('Amount must be positive'),
  currency: z.string().default('USD'),
  frequency: z.enum(['one-time', 'monthly', 'quarterly', 'yearly']).default('one-time'),
  isOptional: z.boolean().default(false),
  category: z.string().optional(),
  notes: z.string().optional(),
});

export const costCalculationSchema = z.object({
  totalCost: z.number().positive(),
  breakdown: z.array(costItemSchema),
  currency: z.string().default('USD'),
  calculationDate: z.date(),
  assumptions: z.array(z.string()).optional(),
  riskFactors: z.array(z.string()).optional(),
});

// Tool and technology types
export const toolCategorySchema = z.enum([
  'development',
  'design',
  'project-management',
  'communication',
  'analytics',
  'marketing',
  'testing',
  'deployment',
  'monitoring',
  'security',
  'documentation',
  'collaboration',
  'automation',
  'ai-ml',
  'cloud-services',
  'database',
  'frontend',
  'backend',
  'mobile',
  'devops'
]);

export const toolSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, 'Tool name is required'),
  category: toolCategorySchema,
  description: z.string(),
  website: z.string().url().optional(),
  pricing: z.object({
    model: z.enum(['free', 'freemium', 'subscription', 'one-time', 'enterprise']),
    startingPrice: z.number().optional(),
    currency: z.string().default('USD'),
    notes: z.string().optional(),
  }),
  features: z.array(z.string()),
  pros: z.array(z.string()),
  cons: z.array(z.string()),
  alternatives: z.array(z.string()).optional(),
  integrationNotes: z.string().optional(),
  learningCurve: difficultyLevelSchema,
  popularity: z.number().min(1).max(10).optional(),
});

// Process step types
export const stepTypeSchema = z.enum([
  'planning',
  'design',
  'development',
  'testing',
  'deployment',
  'maintenance',
  'review',
  'approval',
  'research',
  'analysis',
  'implementation',
  'training',
  'documentation',
  'quality-assurance',
  'marketing',
  'sales',
  'support',
  'optimization'
]);

export const processStepSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1, 'Step title is required'),
  description: z.string(),
  type: stepTypeSchema,
  order: z.number().int().min(0),
  estimatedDuration: z.object({
    min: z.number().positive(),
    max: z.number().positive(),
    unit: z.enum(['hours', 'days', 'weeks', 'months']),
  }),
  requiredSkills: z.array(z.string()),
  requiredTools: z.array(z.string()),
  dependencies: z.array(z.string().uuid()).optional(),
  deliverables: z.array(z.string()),
  acceptanceCriteria: z.array(z.string()),
  riskLevel: z.enum(['low', 'medium', 'high', 'critical']).default('medium'),
  costEstimate: z.object({
    min: z.number().positive(),
    max: z.number().positive(),
    currency: z.string().default('USD'),
  }),
  automationPotential: z.number().min(0).max(100).optional(),
  optimizationTips: z.array(z.string()).optional(),
});

// Template definition
export const workflowTemplateSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, 'Template name is required'),
  description: z.string(),
  category: templateCategorySchema,
  difficulty: difficultyLevelSchema,
  estimatedDuration: z.object({
    min: z.number().positive(),
    max: z.number().positive(),
    unit: z.enum(['days', 'weeks', 'months']),
  }),
  tags: z.array(z.string()),
  thumbnail: z.string().url().optional(),
  version: z.string().default('1.0.0'),
  author: z.string(),
  lastUpdated: z.date(),
  isPublic: z.boolean().default(true),
  rating: z.number().min(0).max(5).optional(),
  usageCount: z.number().int().min(0).default(0),
  
  // Process definition
  steps: z.array(processStepSchema),
  
  // Cost analysis
  costAnalysis: costCalculationSchema,
  
  // Tools and technologies
  recommendedTools: z.array(toolSchema),
  
  // Optimization and suggestions
  optimizationSuggestions: z.array(z.object({
    category: z.enum(['efficiency', 'cost', 'quality', 'speed', 'automation']),
    title: z.string(),
    description: z.string(),
    impact: z.enum(['low', 'medium', 'high']),
    effort: z.enum(['low', 'medium', 'high']),
    implementation: z.string(),
  })),
  
  // Industry-specific data
  industryContext: z.object({
    marketSize: z.string().optional(),
    competition: z.string().optional(),
    regulations: z.array(z.string()).optional(),
    trends: z.array(z.string()).optional(),
    challenges: z.array(z.string()).optional(),
    opportunities: z.array(z.string()).optional(),
  }),
  
  // Success metrics
  successMetrics: z.array(z.object({
    name: z.string(),
    description: z.string(),
    target: z.string(),
    measurement: z.string(),
    frequency: z.enum(['daily', 'weekly', 'monthly', 'quarterly']),
  })),
  
  // Risk assessment
  risks: z.array(z.object({
    category: z.enum(['technical', 'business', 'operational', 'financial', 'legal']),
    description: z.string(),
    probability: z.enum(['low', 'medium', 'high']),
    impact: z.enum(['low', 'medium', 'high', 'critical']),
    mitigation: z.string(),
  })),
  
  // Customization options
  customizationOptions: z.array(z.object({
    name: z.string(),
    description: z.string(),
    type: z.enum(['boolean', 'number', 'string', 'select']),
    defaultValue: z.any(),
    options: z.array(z.string()).optional(),
    required: z.boolean().default(false),
  })),
});

// Template instances (user-created workflows from templates)
export const workflowInstanceSchema = z.object({
  id: z.string().uuid(),
  templateId: z.string().uuid(),
  name: z.string(),
  description: z.string(),
  userId: z.string().uuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
  status: z.enum(['draft', 'active', 'completed', 'archived']),
  
  // Customized values
  customizations: z.record(z.string(), z.any()),
  
  // Progress tracking
  currentStep: z.number().int().min(0),
  completedSteps: z.array(z.string().uuid()),
  
  // Actual costs (vs estimated)
  actualCosts: costCalculationSchema.optional(),
  
  // Performance metrics
  performanceMetrics: z.record(z.string(), z.any()).optional(),
  
  // Notes and modifications
  notes: z.array(z.object({
    id: z.string().uuid(),
    stepId: z.string().uuid().optional(),
    content: z.string(),
    createdAt: z.date(),
    userId: z.string().uuid(),
  })),
});

// Type exports
export type TemplateCategory = z.infer<typeof templateCategorySchema>;
export type DifficultyLevel = z.infer<typeof difficultyLevelSchema>;
export type CostType = z.infer<typeof costTypeSchema>;
export type CostItem = z.infer<typeof costItemSchema>;
export type CostCalculation = z.infer<typeof costCalculationSchema>;
export type ToolCategory = z.infer<typeof toolCategorySchema>;
export type Tool = z.infer<typeof toolSchema>;
export type StepType = z.infer<typeof stepTypeSchema>;
export type ProcessStep = z.infer<typeof processStepSchema>;
export type WorkflowTemplate = z.infer<typeof workflowTemplateSchema>;
export type WorkflowInstance = z.infer<typeof workflowInstanceSchema>; 