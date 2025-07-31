import { WorkflowTemplate } from '@/types/templates';
import { v4 as uuidv4 } from 'uuid';

// Helper function to create UUIDs
const createId = () => uuidv4();

// Software Development Templates
export const appDevelopmentTemplate: WorkflowTemplate = {
  id: createId(),
  name: 'Mobile App Development Pipeline',
  description: 'Complete workflow for developing and launching a mobile application from concept to app store deployment.',
  category: 'software-development',
  difficulty: 'advanced',
  estimatedDuration: { min: 12, max: 24, unit: 'weeks' },
  tags: ['mobile', 'app-development', 'ios', 'android', 'react-native', 'flutter'],
  version: '1.0.0',
  author: 'Flow Team',
  lastUpdated: new Date(),
  isPublic: true,
  rating: 4.8,
  usageCount: 1250,

  steps: [
    {
      id: createId(),
      title: 'Market Research & Concept Validation',
      description: 'Research target market, analyze competitors, validate app concept with potential users',
      type: 'research',
      order: 0,
      estimatedDuration: { min: 1, max: 2, unit: 'weeks' },
      requiredSkills: ['market-research', 'user-research', 'competitive-analysis'],
      requiredTools: ['google-analytics', 'survey-monkey', 'competitor-analysis-tools'],
      deliverables: ['Market research report', 'Competitor analysis', 'User personas', 'Concept validation results'],
      acceptanceCriteria: ['Clear target audience defined', 'Competitive landscape mapped', 'Concept validated with 50+ users'],
      riskLevel: 'low',
      costEstimate: { min: 2000, max: 5000, currency: 'USD' },
      automationPotential: 30,
      optimizationTips: ['Use automated survey tools', 'Leverage AI for competitor analysis', 'Automate data collection']
    },
    {
      id: createId(),
      title: 'UI/UX Design & Prototyping',
      description: 'Create wireframes, design mockups, and interactive prototypes for user testing',
      type: 'design',
      order: 1,
      estimatedDuration: { min: 2, max: 4, unit: 'weeks' },
      requiredSkills: ['ui-design', 'ux-design', 'prototyping', 'user-testing'],
      requiredTools: ['figma', 'sketch', 'invision', 'adobe-xd'],
      dependencies: [createId()], // Market research step
      deliverables: ['Wireframes', 'High-fidelity mockups', 'Interactive prototype', 'Design system'],
      acceptanceCriteria: ['All screens designed', 'Prototype tested with users', 'Design system documented'],
      riskLevel: 'medium',
      costEstimate: { min: 8000, max: 15000, currency: 'USD' },
      automationPotential: 20,
      optimizationTips: ['Use design system templates', 'Automate design handoff', 'Implement design tokens']
    },
    {
      id: createId(),
      title: 'Technical Architecture & Planning',
      description: 'Define technical stack, architecture, database design, and API specifications',
      type: 'planning',
      order: 2,
      estimatedDuration: { min: 1, max: 2, unit: 'weeks' },
      requiredSkills: ['system-architecture', 'database-design', 'api-design', 'security'],
      requiredTools: ['draw.io', 'postman', 'database-design-tools'],
      dependencies: [createId()], // Design step
      deliverables: ['Technical architecture document', 'Database schema', 'API specifications', 'Security plan'],
      acceptanceCriteria: ['Architecture approved by team', 'Database schema finalized', 'API endpoints defined'],
      riskLevel: 'medium',
      costEstimate: { min: 5000, max: 10000, currency: 'USD' },
      automationPotential: 40,
      optimizationTips: ['Use architecture templates', 'Automate API documentation', 'Implement security scanning']
    },
    {
      id: createId(),
      title: 'Frontend Development',
      description: 'Develop the mobile app frontend using React Native, Flutter, or native development',
      type: 'development',
      order: 3,
      estimatedDuration: { min: 6, max: 12, unit: 'weeks' },
      requiredSkills: ['react-native', 'javascript', 'mobile-development', 'state-management'],
      requiredTools: ['react-native', 'expo', 'redux', 'typescript'],
      dependencies: [createId()], // Technical architecture step
      deliverables: ['Mobile app frontend', 'State management', 'Navigation', 'UI components'],
      acceptanceCriteria: ['All screens implemented', 'Navigation working', 'State management functional'],
      riskLevel: 'high',
      costEstimate: { min: 25000, max: 50000, currency: 'USD' },
      automationPotential: 60,
      optimizationTips: ['Use component libraries', 'Implement automated testing', 'Use code generation tools']
    },
    {
      id: createId(),
      title: 'Backend Development',
      description: 'Develop the backend API, database, and server infrastructure',
      type: 'development',
      order: 4,
      estimatedDuration: { min: 4, max: 8, unit: 'weeks' },
      requiredSkills: ['backend-development', 'api-development', 'database-management', 'server-administration'],
      requiredTools: ['node.js', 'express', 'postgresql', 'aws'],
      dependencies: [createId()], // Technical architecture step
      deliverables: ['Backend API', 'Database', 'Authentication system', 'Server infrastructure'],
      acceptanceCriteria: ['API endpoints functional', 'Database operational', 'Authentication working'],
      riskLevel: 'high',
      costEstimate: { min: 20000, max: 40000, currency: 'USD' },
      automationPotential: 70,
      optimizationTips: ['Use API frameworks', 'Implement automated testing', 'Use infrastructure as code']
    },
    {
      id: createId(),
      title: 'Testing & Quality Assurance',
      description: 'Comprehensive testing including unit tests, integration tests, and user acceptance testing',
      type: 'testing',
      order: 5,
      estimatedDuration: { min: 2, max: 4, unit: 'weeks' },
      requiredSkills: ['testing', 'qa', 'automation', 'bug-tracking'],
      requiredTools: ['jest', 'cypress', 'appium', 'jira'],
      dependencies: [createId(), createId()], // Frontend and backend steps
      deliverables: ['Test suite', 'Bug reports', 'Performance test results', 'Security audit'],
      acceptanceCriteria: ['90% code coverage', 'All critical bugs fixed', 'Performance benchmarks met'],
      riskLevel: 'medium',
      costEstimate: { min: 10000, max: 20000, currency: 'USD' },
      automationPotential: 80,
      optimizationTips: ['Automate test execution', 'Use continuous testing', 'Implement automated bug reporting']
    },
    {
      id: createId(),
      title: 'App Store Submission & Deployment',
      description: 'Prepare app for app store submission, including store listings, screenshots, and compliance',
      type: 'deployment',
      order: 6,
      estimatedDuration: { min: 1, max: 2, unit: 'weeks' },
      requiredSkills: ['app-store-optimization', 'compliance', 'marketing'],
      requiredTools: ['app-store-connect', 'google-play-console', 'screenshot-tools'],
      dependencies: [createId()], // Testing step
      deliverables: ['App store listings', 'Screenshots and videos', 'Privacy policy', 'App store approval'],
      acceptanceCriteria: ['App approved by stores', 'Store listings complete', 'Compliance requirements met'],
      riskLevel: 'medium',
      costEstimate: { min: 3000, max: 8000, currency: 'USD' },
      automationPotential: 50,
      optimizationTips: ['Automate screenshot generation', 'Use ASO tools', 'Implement automated compliance checking']
    }
  ],

  costAnalysis: {
    totalCost: 75000,
    currency: 'USD',
    calculationDate: new Date(),
    breakdown: [
      {
        id: createId(),
        name: 'Development Team',
        description: 'Frontend and backend developers',
        type: 'labor',
        amount: 45000,
        currency: 'USD',
        frequency: 'one-time',
        category: 'personnel'
      },
      {
        id: createId(),
        name: 'Design Services',
        description: 'UI/UX design and prototyping',
        type: 'labor',
        amount: 12000,
        currency: 'USD',
        frequency: 'one-time',
        category: 'design'
      },
      {
        id: createId(),
        name: 'Infrastructure & Hosting',
        description: 'Cloud hosting and services',
        type: 'infrastructure',
        amount: 3000,
        currency: 'USD',
        frequency: 'monthly',
        category: 'infrastructure'
      },
      {
        id: createId(),
        name: 'Development Tools',
        description: 'Software licenses and tools',
        type: 'licensing',
        amount: 2000,
        currency: 'USD',
        frequency: 'one-time',
        category: 'tools'
      },
      {
        id: createId(),
        name: 'Testing & QA',
        description: 'Testing services and tools',
        type: 'labor',
        amount: 8000,
        currency: 'USD',
        frequency: 'one-time',
        category: 'quality'
      },
      {
        id: createId(),
        name: 'App Store Fees',
        description: 'Apple Developer Program and Google Play fees',
        type: 'subscription',
        amount: 500,
        currency: 'USD',
        frequency: 'yearly',
        category: 'platform'
      }
    ],
    assumptions: [
      'Team of 3-4 developers',
      '6-month development timeline',
      'Standard app complexity',
      'No custom hardware requirements'
    ],
    riskFactors: [
      'Scope creep may increase costs',
      'App store rejection delays',
      'Technical debt accumulation',
      'Market changes affecting requirements'
    ]
  },

  recommendedTools: [
    {
      id: createId(),
      name: 'React Native',
      category: 'frontend',
      description: 'Cross-platform mobile development framework',
      website: 'https://reactnative.dev',
      pricing: {
        model: 'free',
        notes: 'Open source framework'
      },
      features: ['Cross-platform development', 'Hot reloading', 'Native performance', 'Large community'],
      pros: ['Code reuse between platforms', 'Fast development', 'Native performance', 'Large ecosystem'],
      cons: ['Learning curve', 'Platform-specific code needed', 'Performance limitations', 'Debugging complexity'],
      learningCurve: 'intermediate',
      popularity: 9
    },
    {
      id: createId(),
      name: 'Figma',
      category: 'design',
      description: 'Collaborative design and prototyping tool',
      website: 'https://figma.com',
      pricing: {
        model: 'freemium',
        startingPrice: 12,
        currency: 'USD',
        notes: 'Per user per month'
      },
      features: ['Real-time collaboration', 'Prototyping', 'Design systems', 'Developer handoff'],
      pros: ['Excellent collaboration', 'Web-based', 'Free tier available', 'Great prototyping'],
      cons: ['Internet required', 'Limited offline features', 'Performance with large files'],
      learningCurve: 'beginner',
      popularity: 10
    },
    {
      id: createId(),
      name: 'AWS',
      category: 'cloud-services',
      description: 'Cloud computing platform for backend services',
      website: 'https://aws.amazon.com',
      pricing: {
        model: 'subscription',
        startingPrice: 0,
        currency: 'USD',
        notes: 'Pay-as-you-go pricing'
      },
      features: ['Scalable infrastructure', 'Global CDN', 'Database services', 'Security features'],
      pros: ['Highly scalable', 'Comprehensive services', 'Global presence', 'Enterprise features'],
      cons: ['Complex pricing', 'Steep learning curve', 'Vendor lock-in', 'Cost management'],
      learningCurve: 'advanced',
      popularity: 10
    }
  ],

  optimizationSuggestions: [
    {
      category: 'efficiency',
      title: 'Implement CI/CD Pipeline',
      description: 'Automate build, test, and deployment processes to reduce manual work and errors',
      impact: 'high',
      effort: 'medium',
      implementation: 'Set up GitHub Actions or Jenkins for automated testing and deployment'
    },
    {
      category: 'cost',
      title: 'Use Cross-Platform Development',
      description: 'Develop for both iOS and Android with a single codebase to reduce development costs',
      impact: 'high',
      effort: 'low',
      implementation: 'Choose React Native or Flutter for cross-platform development'
    },
    {
      category: 'quality',
      title: 'Implement Automated Testing',
      description: 'Automate unit tests, integration tests, and UI tests to catch bugs early',
      impact: 'high',
      effort: 'medium',
      implementation: 'Set up Jest for unit tests and Detox for E2E testing'
    },
    {
      category: 'speed',
      title: 'Use Component Libraries',
      description: 'Leverage existing UI component libraries to speed up development',
      impact: 'medium',
      effort: 'low',
      implementation: 'Use React Native Elements or NativeBase for pre-built components'
    }
  ],

  industryContext: {
    marketSize: 'Mobile app market valued at $935 billion in 2023',
    competition: 'High competition in app stores with millions of apps',
    regulations: ['GDPR compliance', 'App store guidelines', 'Data protection laws'],
    trends: ['AI integration', '5G optimization', 'Privacy-first design', 'Cross-platform development'],
    challenges: ['App store saturation', 'User acquisition costs', 'Technical complexity', 'Platform fragmentation'],
    opportunities: ['Emerging markets', 'Niche applications', 'Enterprise apps', 'IoT integration']
  },

  successMetrics: [
    {
      name: 'App Store Rating',
      description: 'Average user rating in app stores',
      target: '4.0+ stars',
      measurement: 'App store analytics',
      frequency: 'weekly'
    },
    {
      name: 'User Retention',
      description: 'Percentage of users who return after first use',
      target: '40%+ Day 7 retention',
      measurement: 'Analytics platform',
      frequency: 'daily'
    },
    {
      name: 'Crash Rate',
      description: 'Percentage of app sessions that crash',
      target: '< 1%',
      measurement: 'Crash reporting tool',
      frequency: 'daily'
    },
    {
      name: 'Development Velocity',
      description: 'Features delivered per sprint',
      target: '2-3 features per sprint',
      measurement: 'Project management tool',
      frequency: 'weekly'
    }
  ],

  risks: [
    {
      category: 'technical',
      description: 'Platform updates breaking app functionality',
      probability: 'medium',
      impact: 'high',
      mitigation: 'Regular testing with beta versions and maintaining compatibility'
    },
    {
      category: 'business',
      description: 'App store rejection delaying launch',
      probability: 'medium',
      impact: 'high',
      mitigation: 'Thorough review of guidelines and pre-submission testing'
    },
    {
      category: 'operational',
      description: 'Team member departure affecting development',
      probability: 'low',
      impact: 'medium',
      mitigation: 'Documentation, code reviews, and knowledge sharing'
    },
    {
      category: 'financial',
      description: 'Scope creep increasing development costs',
      probability: 'high',
      impact: 'medium',
      mitigation: 'Clear requirements, change control process, and regular stakeholder communication'
    }
  ],

  customizationOptions: [
    {
      name: 'platform',
      description: 'Target platforms for the app',
      type: 'select',
      defaultValue: 'both',
      options: ['ios', 'android', 'both'],
      required: true
    },
    {
      name: 'teamSize',
      description: 'Number of developers in the team',
      type: 'number',
      defaultValue: 3,
      required: true
    },
    {
      name: 'includeBackend',
      description: 'Whether the app requires a backend server',
      type: 'boolean',
      defaultValue: true,
      required: false
    },
    {
      name: 'budget',
      description: 'Available budget for the project',
      type: 'number',
      defaultValue: 75000,
      required: true
    }
  ]
};

// Game Design Template
export const gameDesignTemplate: WorkflowTemplate = {
  id: createId(),
  name: 'Game Development Pipeline',
  description: 'Complete workflow for developing a video game from concept to release, including design, development, and marketing phases.',
  category: 'game-design',
  difficulty: 'expert',
  estimatedDuration: { min: 18, max: 36, unit: 'months' },
  tags: ['game-development', 'unity', 'unreal', 'indie-games', 'mobile-games'],
  version: '1.0.0',
  author: 'Flow Team',
  lastUpdated: new Date(),
  isPublic: true,
  rating: 4.9,
  usageCount: 890,

  steps: [
    {
      id: createId(),
      title: 'Game Concept & Design Document',
      description: 'Define game concept, mechanics, story, and create comprehensive design document',
      type: 'planning',
      order: 0,
      estimatedDuration: { min: 2, max: 4, unit: 'weeks' },
      requiredSkills: ['game-design', 'creative-writing', 'mechanics-design'],
      requiredTools: ['google-docs', 'figma', 'mind-mapping-tools'],
      deliverables: ['Game design document', 'Mechanics specification', 'Story bible', 'Art style guide'],
      acceptanceCriteria: ['Design document approved', 'Core mechanics defined', 'Target audience identified'],
      riskLevel: 'low',
      costEstimate: { min: 5000, max: 15000, currency: 'USD' },
      automationPotential: 20
    },
    {
      id: createId(),
      title: 'Prototyping & Core Mechanics',
      description: 'Create playable prototype to test core game mechanics and gameplay loop',
      type: 'development',
      order: 1,
      estimatedDuration: { min: 4, max: 8, unit: 'weeks' },
      requiredSkills: ['game-programming', 'prototyping', 'game-mechanics'],
      requiredTools: ['unity', 'unreal-engine', 'godot'],
      dependencies: [createId()],
      deliverables: ['Playable prototype', 'Core mechanics implementation', 'Basic UI'],
      acceptanceCriteria: ['Prototype is playable', 'Core loop is fun', 'Mechanics are balanced'],
      riskLevel: 'medium',
      costEstimate: { min: 15000, max: 30000, currency: 'USD' },
      automationPotential: 40
    }
    // Additional steps would continue here...
  ],

  costAnalysis: {
    totalCost: 250000,
    currency: 'USD',
    calculationDate: new Date(),
    breakdown: [
      {
        id: createId(),
        name: 'Development Team',
        description: 'Programmers, artists, designers',
        type: 'labor',
        amount: 180000,
        currency: 'USD',
        frequency: 'one-time'
      },
      {
        id: createId(),
        name: 'Software Licenses',
        description: 'Game engines, tools, and software',
        type: 'licensing',
        amount: 15000,
        currency: 'USD',
        frequency: 'one-time'
      },
      {
        id: createId(),
        name: 'Marketing & PR',
        description: 'Game marketing and promotion',
        type: 'marketing',
        amount: 30000,
        currency: 'USD',
        frequency: 'one-time'
      }
    ]
  },

  recommendedTools: [
    {
      id: createId(),
      name: 'Unity',
      category: 'development',
      description: 'Cross-platform game engine',
      website: 'https://unity.com',
      pricing: {
        model: 'subscription',
        startingPrice: 25,
        currency: 'USD',
        notes: 'Per seat per month'
      },
      features: ['Cross-platform', 'Asset store', 'Large community', '2D/3D support'],
      pros: ['Easy to learn', 'Large community', 'Asset store', 'Cross-platform'],
      cons: ['Performance limitations', 'Subscription model', 'Platform fees'],
      learningCurve: 'beginner',
      popularity: 9
    }
  ],

  optimizationSuggestions: [
    {
      category: 'efficiency',
      title: 'Use Asset Store',
      description: 'Leverage pre-made assets to speed up development',
      impact: 'high',
      effort: 'low',
      implementation: 'Purchase and integrate assets from Unity Asset Store or similar platforms'
    }
  ],

  industryContext: {
    marketSize: 'Global gaming market valued at $200+ billion',
    competition: 'Highly competitive with thousands of new games released annually',
    trends: ['Mobile gaming growth', 'VR/AR integration', 'Cloud gaming', 'Esports'],
    challenges: ['High development costs', 'Long development cycles', 'Market saturation', 'Platform requirements']
  },

  successMetrics: [
    {
      name: 'Player Retention',
      description: 'Daily and monthly active users',
      target: '20%+ Day 1 retention',
      measurement: 'Analytics platform',
      frequency: 'daily'
    }
  ],

  risks: [
    {
      category: 'business',
      description: 'Game not meeting player expectations',
      probability: 'medium',
      impact: 'high',
      mitigation: 'Regular playtesting and community feedback'
    }
  ],

  customizationOptions: [
    {
      name: 'gameType',
      description: 'Type of game being developed',
      type: 'select',
      defaultValue: 'mobile',
      options: ['mobile', 'pc', 'console', 'vr'],
      required: true
    }
  ]
};

// Manufacturing Template
export const manufacturingTemplate: WorkflowTemplate = {
  id: createId(),
  name: 'Product Manufacturing Pipeline',
  description: 'Complete workflow from product design to retail distribution, including manufacturing, quality control, and logistics.',
  category: 'manufacturing',
  difficulty: 'advanced',
  estimatedDuration: { min: 6, max: 18, unit: 'months' },
  tags: ['manufacturing', 'product-development', 'supply-chain', 'retail'],
  version: '1.0.0',
  author: 'Flow Team',
  lastUpdated: new Date(),
  isPublic: true,
  rating: 4.7,
  usageCount: 650,

  steps: [
    {
      id: createId(),
      title: 'Product Design & Engineering',
      description: 'Finalize product design, create technical specifications, and prepare for manufacturing',
      type: 'design',
      order: 0,
      estimatedDuration: { min: 2, max: 4, unit: 'months' },
      requiredSkills: ['product-design', 'engineering', 'cad-modeling'],
      requiredTools: ['solidworks', 'autocad', '3d-printing'],
      deliverables: ['Technical drawings', '3D models', 'Bill of materials', 'Manufacturing specifications'],
      acceptanceCriteria: ['Design is manufacturable', 'Cost targets met', 'Quality standards defined'],
      riskLevel: 'medium',
      costEstimate: { min: 25000, max: 75000, currency: 'USD' },
      automationPotential: 60
    }
    // Additional steps would continue here...
  ],

  costAnalysis: {
    totalCost: 500000,
    currency: 'USD',
    calculationDate: new Date(),
    breakdown: [
      {
        id: createId(),
        name: 'Tooling & Setup',
        description: 'Manufacturing tooling and equipment setup',
        type: 'one-time',
        amount: 100000,
        currency: 'USD',
        frequency: 'one-time'
      },
      {
        id: createId(),
        name: 'Production Costs',
        description: 'Per-unit manufacturing costs',
        type: 'variable',
        amount: 50000,
        currency: 'USD',
        frequency: 'monthly'
      }
    ]
  },

  recommendedTools: [
    {
      id: createId(),
      name: 'SolidWorks',
      category: 'design',
      description: '3D CAD design software',
      website: 'https://solidworks.com',
      pricing: {
        model: 'subscription',
        startingPrice: 1295,
        currency: 'USD',
        notes: 'Per year'
      },
      features: ['3D modeling', 'Simulation', 'Manufacturing tools', 'Collaboration'],
      pros: ['Industry standard', 'Comprehensive features', 'Good support', 'Integration'],
      cons: ['Expensive', 'Steep learning curve', 'Windows only', 'Complex licensing'],
      learningCurve: 'advanced',
      popularity: 9
    }
  ],

  optimizationSuggestions: [
    {
      category: 'cost',
      title: 'Optimize Design for Manufacturing',
      description: 'Design products to minimize manufacturing complexity and costs',
      impact: 'high',
      effort: 'medium',
      implementation: 'Use DFM principles and consult with manufacturers early'
    }
  ],

  industryContext: {
    marketSize: 'Global manufacturing market valued at $15+ trillion',
    competition: 'Intense global competition, especially from low-cost regions',
    trends: ['Automation', '3D printing', 'Sustainable manufacturing', 'Local production'],
    challenges: ['Supply chain disruptions', 'Rising costs', 'Quality control', 'Regulatory compliance']
  },

  successMetrics: [
    {
      name: 'Production Yield',
      description: 'Percentage of products meeting quality standards',
      target: '95%+',
      measurement: 'Quality control system',
      frequency: 'daily'
    }
  ],

  risks: [
    {
      category: 'operational',
      description: 'Supply chain disruptions affecting production',
      probability: 'high',
      impact: 'high',
      mitigation: 'Diversify suppliers and maintain safety stock'
    }
  ],

  customizationOptions: [
    {
      name: 'productType',
      description: 'Type of product being manufactured',
      type: 'select',
      defaultValue: 'electronics',
      options: ['electronics', 'textiles', 'automotive', 'food', 'pharmaceuticals'],
      required: true
    }
  ]
};

// Export all templates
export const allTemplates: WorkflowTemplate[] = [
  appDevelopmentTemplate,
  gameDesignTemplate,
  manufacturingTemplate
];

// Template categories with descriptions
export const templateCategories = [
  {
    id: 'software-development',
    name: 'Software Development',
    description: 'Web apps, mobile apps, desktop software, and system development',
    icon: '💻',
    templateCount: 15
  },
  {
    id: 'game-design',
    name: 'Game Design',
    description: 'Video game development, from concept to release',
    icon: '🎮',
    templateCount: 8
  },
  {
    id: 'manufacturing',
    name: 'Manufacturing',
    description: 'Product manufacturing, from design to retail distribution',
    icon: '🏭',
    templateCount: 12
  },
  {
    id: 'marketing',
    name: 'Marketing',
    description: 'Digital marketing, campaigns, and brand development',
    icon: '📢',
    templateCount: 10
  },
  {
    id: 'business-operations',
    name: 'Business Operations',
    description: 'Business processes, operations, and management workflows',
    icon: '🏢',
    templateCount: 20
  },
  {
    id: 'creative-projects',
    name: 'Creative Projects',
    description: 'Design, content creation, and creative project management',
    icon: '🎨',
    templateCount: 14
  },
  {
    id: 'research-development',
    name: 'Research & Development',
    description: 'Scientific research, product R&D, and innovation processes',
    icon: '🔬',
    templateCount: 6
  },
  {
    id: 'customer-service',
    name: 'Customer Service',
    description: 'Customer support, service delivery, and satisfaction management',
    icon: '🎧',
    templateCount: 8
  },
  {
    id: 'human-resources',
    name: 'Human Resources',
    description: 'Recruitment, onboarding, training, and HR processes',
    icon: '👥',
    templateCount: 12
  },
  {
    id: 'finance',
    name: 'Finance',
    description: 'Financial planning, accounting, and investment processes',
    icon: '💰',
    templateCount: 9
  }
]; 