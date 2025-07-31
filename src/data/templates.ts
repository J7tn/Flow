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
        type: 'labor',
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

// Additional Templates for Testing Infinite Scrolling

// Marketing Campaign Template
export const marketingCampaignTemplate: WorkflowTemplate = {
  id: createId(),
  name: 'Digital Marketing Campaign',
  description: 'Complete digital marketing campaign from strategy to execution and analysis.',
  category: 'marketing',
  difficulty: 'intermediate',
  estimatedDuration: { min: 8, max: 16, unit: 'weeks' },
  tags: ['digital-marketing', 'social-media', 'content-marketing', 'analytics'],
  version: '1.0.0',
  author: 'Flow Team',
  lastUpdated: new Date(),
  isPublic: true,
  rating: 4.6,
  usageCount: 1200,

  steps: [
    {
      id: createId(),
      title: 'Market Research & Audience Analysis',
      description: 'Research target audience, competitors, and market opportunities',
      type: 'research',
      order: 0,
      estimatedDuration: { min: 1, max: 2, unit: 'weeks' },
      requiredSkills: ['market-research', 'audience-analysis', 'competitive-analysis'],
      requiredTools: ['google-analytics', 'semrush', 'social-media-analytics'],
      deliverables: ['Audience personas', 'Competitor analysis', 'Market opportunity report'],
      acceptanceCriteria: ['Clear target audience defined', 'Competitive landscape mapped'],
      riskLevel: 'low',
      costEstimate: { min: 2000, max: 5000, currency: 'USD' },
      automationPotential: 40
    }
  ],

  costAnalysis: {
    totalCost: 25000,
    currency: 'USD',
    calculationDate: new Date(),
    breakdown: [
      {
        id: createId(),
        name: 'Marketing Team',
        description: 'Marketing specialists and content creators',
        type: 'labor',
        amount: 15000,
        currency: 'USD',
        frequency: 'one-time',
        category: 'personnel'
      },
      {
        id: createId(),
        name: 'Advertising Budget',
        description: 'Paid advertising and promotion',
        type: 'advertising',
        amount: 8000,
        currency: 'USD',
        frequency: 'one-time',
        category: 'advertising'
      },
      {
        id: createId(),
        name: 'Tools & Software',
        description: 'Marketing tools and analytics platforms',
        type: 'licensing',
        amount: 2000,
        currency: 'USD',
        frequency: 'one-time',
        category: 'tools'
      }
    ]
  },

  recommendedTools: [
    {
      id: createId(),
      name: 'HubSpot',
      category: 'marketing',
      description: 'All-in-one marketing platform',
      website: 'https://hubspot.com',
      pricing: {
        model: 'subscription',
        startingPrice: 45,
        currency: 'USD',
        notes: 'Per month'
      },
      features: ['Email marketing', 'CRM', 'Analytics', 'Automation'],
      pros: ['All-in-one solution', 'Easy to use', 'Good analytics', 'Automation'],
      cons: ['Can be expensive', 'Complex for beginners', 'Limited customization'],
      learningCurve: 'intermediate',
      popularity: 9
    }
  ],

  optimizationSuggestions: [
    {
      category: 'efficiency',
      title: 'Automate Email Sequences',
      description: 'Set up automated email campaigns to nurture leads',
      impact: 'high',
      effort: 'medium',
      implementation: 'Use marketing automation tools to create drip campaigns'
    }
  ],

  industryContext: {
    marketSize: 'Digital marketing market valued at $378 billion in 2023',
    competition: 'High competition with many agencies and tools available',
    trends: ['AI-powered marketing', 'Video content', 'Personalization', 'Privacy-first'],
    challenges: ['Ad fatigue', 'Privacy regulations', 'ROI measurement', 'Content creation']
  },

  successMetrics: [
    {
      name: 'Conversion Rate',
      description: 'Percentage of visitors who take desired action',
      target: '2-5%',
      measurement: 'Analytics platform',
      frequency: 'weekly'
    }
  ],

  risks: [
    {
      category: 'business',
      description: 'Campaign backlash or negative feedback',
      probability: 'medium',
      impact: 'high',
      mitigation: 'Thorough content review and crisis management plan'
    }
  ],

  customizationOptions: [
    {
      name: 'campaignType',
      description: 'Type of marketing campaign',
      type: 'select',
      defaultValue: 'social-media',
      options: ['social-media', 'email', 'content', 'paid-advertising'],
      required: true
    }
  ]
};

// E-commerce Setup Template
export const ecommerceSetupTemplate: WorkflowTemplate = {
  id: createId(),
  name: 'E-commerce Store Setup',
  description: 'Complete workflow for setting up an online store from platform selection to launch.',
  category: 'business-operations',
  difficulty: 'intermediate',
  estimatedDuration: { min: 4, max: 12, unit: 'weeks' },
  tags: ['ecommerce', 'online-store', 'shopify', 'woocommerce', 'payment-processing'],
  version: '1.0.0',
  author: 'Flow Team',
  lastUpdated: new Date(),
  isPublic: true,
  rating: 4.5,
  usageCount: 2100,

  steps: [
    {
      id: createId(),
      title: 'Platform Selection & Setup',
      description: 'Choose e-commerce platform and set up basic store structure',
      type: 'setup',
      order: 0,
      estimatedDuration: { min: 1, max: 2, unit: 'weeks' },
      requiredSkills: ['ecommerce-platforms', 'web-design', 'basic-coding'],
      requiredTools: ['shopify', 'woocommerce', 'squarespace'],
      deliverables: ['Platform selection', 'Store setup', 'Basic design'],
      acceptanceCriteria: ['Platform chosen', 'Store structure created', 'Basic design implemented'],
      riskLevel: 'low',
      costEstimate: { min: 1000, max: 5000, currency: 'USD' },
      automationPotential: 70
    }
  ],

  costAnalysis: {
    totalCost: 15000,
    currency: 'USD',
    calculationDate: new Date(),
    breakdown: [
      {
        id: createId(),
        name: 'Platform Fees',
        description: 'Monthly platform subscription and transaction fees',
        type: 'subscription',
        amount: 3000,
        currency: 'USD',
        frequency: 'yearly',
        category: 'platform'
      },
      {
        id: createId(),
        name: 'Design & Development',
        description: 'Store design and customization',
        type: 'labor',
        amount: 8000,
        currency: 'USD',
        frequency: 'one-time',
        category: 'development'
      },
      {
        id: createId(),
        name: 'Payment Processing',
        description: 'Payment gateway setup and fees',
        type: 'subscription',
        amount: 2000,
        currency: 'USD',
        frequency: 'yearly',
        category: 'payments'
      },
      {
        id: createId(),
        name: 'Marketing & SEO',
        description: 'Initial marketing setup and SEO optimization',
        type: 'labor',
        amount: 2000,
        currency: 'USD',
        frequency: 'one-time',
        category: 'marketing'
      }
    ]
  },

  recommendedTools: [
    {
      id: createId(),
      name: 'Shopify',
      category: 'ecommerce-platform',
      description: 'Complete e-commerce platform',
      website: 'https://shopify.com',
      pricing: {
        model: 'subscription',
        startingPrice: 29,
        currency: 'USD',
        notes: 'Per month'
      },
      features: ['Store builder', 'Payment processing', 'Inventory management', 'Analytics'],
      pros: ['Easy to use', 'All-in-one solution', 'Good support', 'Mobile optimized'],
      cons: ['Transaction fees', 'Limited customization', 'Monthly costs', 'Platform lock-in'],
      learningCurve: 'beginner',
      popularity: 10
    }
  ],

  optimizationSuggestions: [
    {
      category: 'conversion',
      title: 'Optimize Product Pages',
      description: 'Improve product page design and copy to increase conversions',
      impact: 'high',
      effort: 'medium',
      implementation: 'Use A/B testing to optimize product descriptions and images'
    }
  ],

  industryContext: {
    marketSize: 'E-commerce market valued at $5.7 trillion globally',
    competition: 'High competition with millions of online stores',
    trends: ['Mobile commerce', 'Social commerce', 'Voice shopping', 'AR/VR shopping'],
    challenges: ['Customer acquisition', 'Cart abandonment', 'Competition', 'Logistics']
  },

  successMetrics: [
    {
      name: 'Conversion Rate',
      description: 'Percentage of visitors who make a purchase',
      target: '2-4%',
      measurement: 'Analytics platform',
      frequency: 'daily'
    }
  ],

  risks: [
    {
      category: 'technical',
      description: 'Platform downtime affecting sales',
      probability: 'low',
      impact: 'high',
      mitigation: 'Choose reliable platform and have backup plans'
    }
  ],

  customizationOptions: [
    {
      name: 'platform',
      description: 'E-commerce platform to use',
      type: 'select',
      defaultValue: 'shopify',
      options: ['shopify', 'woocommerce', 'squarespace', 'custom'],
      required: true
    }
  ]
};

// Content Creation Template
export const contentCreationTemplate: WorkflowTemplate = {
  id: createId(),
  name: 'Content Creation Pipeline',
  description: 'Systematic approach to creating, publishing, and promoting content across multiple channels.',
  category: 'creative-projects',
  difficulty: 'beginner',
  estimatedDuration: { min: 2, max: 8, unit: 'weeks' },
  tags: ['content-creation', 'blogging', 'social-media', 'video-production', 'copywriting'],
  version: '1.0.0',
  author: 'Flow Team',
  lastUpdated: new Date(),
  isPublic: true,
  rating: 4.4,
  usageCount: 1800,

  steps: [
    {
      id: createId(),
      title: 'Content Strategy & Planning',
      description: 'Define content goals, target audience, and content calendar',
      type: 'planning',
      order: 0,
      estimatedDuration: { min: 1, max: 2, unit: 'weeks' },
      requiredSkills: ['content-strategy', 'audience-research', 'planning'],
      requiredTools: ['google-docs', 'trello', 'content-calendar-tools'],
      deliverables: ['Content strategy document', 'Content calendar', 'Audience personas'],
      acceptanceCriteria: ['Strategy defined', 'Calendar created', 'Audience identified'],
      riskLevel: 'low',
      costEstimate: { min: 500, max: 2000, currency: 'USD' },
      automationPotential: 50
    }
  ],

  costAnalysis: {
    totalCost: 8000,
    currency: 'USD',
    calculationDate: new Date(),
    breakdown: [
      {
        id: createId(),
        name: 'Content Creation',
        description: 'Writing, design, and production costs',
        type: 'labor',
        amount: 5000,
        currency: 'USD',
        frequency: 'one-time',
        category: 'content'
      },
      {
        id: createId(),
        name: 'Tools & Software',
        description: 'Content creation and management tools',
        type: 'licensing',
        amount: 1500,
        currency: 'USD',
        frequency: 'yearly',
        category: 'tools'
      },
      {
        id: createId(),
        name: 'Promotion & Distribution',
        description: 'Paid promotion and distribution costs',
        type: 'advertising',
        amount: 1500,
        currency: 'USD',
        frequency: 'one-time',
        category: 'marketing'
      }
    ]
  },

  recommendedTools: [
    {
      id: createId(),
      name: 'Canva',
      category: 'design',
      description: 'Graphic design platform',
      website: 'https://canva.com',
      pricing: {
        model: 'freemium',
        startingPrice: 12.99,
        currency: 'USD',
        notes: 'Per month for Pro'
      },
      features: ['Templates', 'Design tools', 'Collaboration', 'Brand kit'],
      pros: ['Easy to use', 'Free tier available', 'Templates', 'Collaboration'],
      cons: ['Limited advanced features', 'Internet required', 'Template dependency'],
      learningCurve: 'beginner',
      popularity: 9
    }
  ],

  optimizationSuggestions: [
    {
      category: 'efficiency',
      title: 'Batch Content Creation',
      description: 'Create multiple pieces of content at once to improve efficiency',
      impact: 'high',
      effort: 'medium',
      implementation: 'Schedule dedicated time blocks for content creation'
    }
  ],

  industryContext: {
    marketSize: 'Content marketing industry valued at $400+ billion',
    competition: 'High competition for audience attention',
    trends: ['Video content', 'Interactive content', 'AI-generated content', 'Personalization'],
    challenges: ['Content saturation', 'Algorithm changes', 'Quality vs quantity', 'ROI measurement']
  },

  successMetrics: [
    {
      name: 'Engagement Rate',
      description: 'Percentage of audience engaging with content',
      target: '3-6%',
      measurement: 'Social media analytics',
      frequency: 'weekly'
    }
  ],

  risks: [
    {
      category: 'reputation',
      description: 'Content backlash or negative feedback',
      probability: 'medium',
      impact: 'medium',
      mitigation: 'Content review process and community guidelines'
    }
  ],

  customizationOptions: [
    {
      name: 'contentType',
      description: 'Primary type of content to create',
      type: 'select',
      defaultValue: 'blog',
      options: ['blog', 'video', 'social-media', 'podcast'],
      required: true
    }
  ]
};

// Customer Support Template
export const customerSupportTemplate: WorkflowTemplate = {
  id: createId(),
  name: 'Customer Support System',
  description: 'Complete customer support workflow from ticket creation to resolution and follow-up.',
  category: 'customer-service',
  difficulty: 'beginner',
  estimatedDuration: { min: 2, max: 6, unit: 'weeks' },
  tags: ['customer-support', 'help-desk', 'ticketing-system', 'customer-service', 'automation'],
  version: '1.0.0',
  author: 'Flow Team',
  lastUpdated: new Date(),
  isPublic: true,
  rating: 4.3,
  usageCount: 950,

  steps: [
    {
      id: createId(),
      title: 'Support System Setup',
      description: 'Choose and configure customer support platform and workflows',
      type: 'setup',
      order: 0,
      estimatedDuration: { min: 1, max: 2, unit: 'weeks' },
      requiredSkills: ['customer-service', 'system-administration', 'workflow-design'],
      requiredTools: ['zendesk', 'intercom', 'freshdesk'],
      deliverables: ['Support platform setup', 'Workflow configuration', 'Team training'],
      acceptanceCriteria: ['Platform configured', 'Workflows defined', 'Team trained'],
      riskLevel: 'low',
      costEstimate: { min: 1000, max: 5000, currency: 'USD' },
      automationPotential: 80
    }
  ],

  costAnalysis: {
    totalCost: 12000,
    currency: 'USD',
    calculationDate: new Date(),
    breakdown: [
      {
        id: createId(),
        name: 'Support Platform',
        description: 'Help desk software and tools',
        type: 'subscription',
        amount: 3000,
        currency: 'USD',
        frequency: 'yearly',
        category: 'software'
      },
      {
        id: createId(),
        name: 'Support Team',
        description: 'Customer support staff training and setup',
        type: 'labor',
        amount: 6000,
        currency: 'USD',
        frequency: 'one-time',
        category: 'personnel'
      },
      {
        id: createId(),
        name: 'Knowledge Base',
        description: 'Documentation and self-service resources',
        type: 'labor',
        amount: 3000,
        currency: 'USD',
        frequency: 'one-time',
        category: 'content'
      }
    ]
  },

  recommendedTools: [
    {
      id: createId(),
      name: 'Zendesk',
      category: 'help-desk',
      description: 'Customer service platform',
      website: 'https://zendesk.com',
      pricing: {
        model: 'subscription',
        startingPrice: 49,
        currency: 'USD',
        notes: 'Per agent per month'
      },
      features: ['Ticket management', 'Knowledge base', 'Live chat', 'Analytics'],
      pros: ['Comprehensive features', 'Good integrations', 'Scalable', 'Analytics'],
      cons: ['Expensive', 'Complex setup', 'Learning curve', 'Overkill for small teams'],
      learningCurve: 'intermediate',
      popularity: 9
    }
  ],

  optimizationSuggestions: [
    {
      category: 'efficiency',
      title: 'Implement Self-Service',
      description: 'Create knowledge base and FAQs to reduce support tickets',
      impact: 'high',
      effort: 'medium',
      implementation: 'Build comprehensive knowledge base with common questions and solutions'
    }
  ],

  industryContext: {
    marketSize: 'Customer service software market valued at $15+ billion',
    competition: 'Many established players and new entrants',
    trends: ['AI chatbots', 'Omnichannel support', 'Self-service', 'Proactive support'],
    challenges: ['Response time expectations', 'Agent training', 'Technology integration', 'Cost management']
  },

  successMetrics: [
    {
      name: 'Customer Satisfaction',
      description: 'Average customer satisfaction score',
      target: '4.5+ out of 5',
      measurement: 'CSAT surveys',
      frequency: 'daily'
    }
  ],

  risks: [
    {
      category: 'reputation',
      description: 'Poor customer service affecting brand reputation',
      probability: 'medium',
      impact: 'high',
      mitigation: 'Regular training, quality monitoring, and feedback loops'
    }
  ],

  customizationOptions: [
    {
      name: 'supportChannels',
      description: 'Support channels to implement',
      type: 'multi-select',
      defaultValue: ['email', 'chat'],
      options: ['email', 'chat', 'phone', 'social-media'],
      required: true
    }
  ]
};

// HR Recruitment Template
export const hrRecruitmentTemplate: WorkflowTemplate = {
  id: createId(),
  name: 'HR Recruitment Process',
  description: 'Complete recruitment workflow from job posting to employee onboarding.',
  category: 'human-resources',
  difficulty: 'intermediate',
  estimatedDuration: { min: 4, max: 12, unit: 'weeks' },
  tags: ['recruitment', 'hiring', 'onboarding', 'hr-processes', 'talent-acquisition'],
  version: '1.0.0',
  author: 'Flow Team',
  lastUpdated: new Date(),
  isPublic: true,
  rating: 4.6,
  usageCount: 1100,

  steps: [
    {
      id: createId(),
      title: 'Job Analysis & Description',
      description: 'Analyze job requirements and create detailed job description',
      type: 'planning',
      order: 0,
      estimatedDuration: { min: 1, max: 2, unit: 'weeks' },
      requiredSkills: ['job-analysis', 'writing', 'hr-knowledge'],
      requiredTools: ['google-docs', 'job-boards', 'hr-software'],
      deliverables: ['Job analysis', 'Job description', 'Requirements list'],
      acceptanceCriteria: ['Job requirements clear', 'Description approved', 'Requirements defined'],
      riskLevel: 'low',
      costEstimate: { min: 500, max: 2000, currency: 'USD' },
      automationPotential: 60
    }
  ],

  costAnalysis: {
    totalCost: 15000,
    currency: 'USD',
    calculationDate: new Date(),
    breakdown: [
      {
        id: createId(),
        name: 'Job Board Postings',
        description: 'Paid job postings and recruitment advertising',
        type: 'advertising',
        amount: 3000,
        currency: 'USD',
        frequency: 'one-time',
        category: 'advertising'
      },
      {
        id: createId(),
        name: 'Recruitment Software',
        description: 'ATS and recruitment tools',
        type: 'subscription',
        amount: 2000,
        currency: 'USD',
        frequency: 'yearly',
        category: 'software'
      },
      {
        id: createId(),
        name: 'HR Staff Time',
        description: 'HR team time for recruitment process',
        type: 'labor',
        amount: 8000,
        currency: 'USD',
        frequency: 'one-time',
        category: 'personnel'
      },
      {
        id: createId(),
        name: 'Background Checks',
        description: 'Candidate background verification',
        type: 'service',
        amount: 2000,
        currency: 'USD',
        frequency: 'one-time',
        category: 'verification'
      }
    ]
  },

  recommendedTools: [
    {
      id: createId(),
      name: 'BambooHR',
      category: 'hr-software',
      description: 'HR management platform',
      website: 'https://bamboohr.com',
      pricing: {
        model: 'subscription',
        startingPrice: 6.19,
        currency: 'USD',
        notes: 'Per employee per month'
      },
      features: ['ATS', 'Onboarding', 'Performance management', 'Time tracking'],
      pros: ['Easy to use', 'Comprehensive features', 'Good support', 'Affordable'],
      cons: ['Limited customization', 'Basic reporting', 'Integration limitations'],
      learningCurve: 'beginner',
      popularity: 8
    }
  ],

  optimizationSuggestions: [
    {
      category: 'efficiency',
      title: 'Automate Screening',
      description: 'Use AI-powered screening to filter candidates automatically',
      impact: 'high',
      effort: 'medium',
      implementation: 'Implement automated screening tools to reduce manual review time'
    }
  ],

  industryContext: {
    marketSize: 'HR software market valued at $30+ billion',
    competition: 'High competition with many established players',
    trends: ['AI recruitment', 'Remote hiring', 'Diversity focus', 'Candidate experience'],
    challenges: ['Talent shortage', 'High turnover', 'Cost per hire', 'Time to fill']
  },

  successMetrics: [
    {
      name: 'Time to Hire',
      description: 'Average time from job posting to hire',
      target: '30-45 days',
      measurement: 'ATS analytics',
      frequency: 'weekly'
    }
  ],

  risks: [
    {
      category: 'compliance',
      description: 'Hiring discrimination or compliance issues',
      probability: 'medium',
      impact: 'high',
      mitigation: 'Regular training, documented processes, and legal review'
    }
  ],

  customizationOptions: [
    {
      name: 'companySize',
      description: 'Size of the company',
      type: 'select',
      defaultValue: 'small',
      options: ['small', 'medium', 'large'],
      required: true
    }
  ]
};

// Financial Planning Template
export const financialPlanningTemplate: WorkflowTemplate = {
  id: createId(),
  name: 'Financial Planning Process',
  description: 'Comprehensive financial planning workflow for individuals and businesses.',
  category: 'finance',
  difficulty: 'advanced',
  estimatedDuration: { min: 4, max: 12, unit: 'weeks' },
  tags: ['financial-planning', 'budgeting', 'investment', 'tax-planning', 'risk-management'],
  version: '1.0.0',
  author: 'Flow Team',
  lastUpdated: new Date(),
  isPublic: true,
  rating: 4.7,
  usageCount: 750,

  steps: [
    {
      id: createId(),
      title: 'Financial Assessment',
      description: 'Analyze current financial situation, goals, and risk tolerance',
      type: 'analysis',
      order: 0,
      estimatedDuration: { min: 1, max: 2, unit: 'weeks' },
      requiredSkills: ['financial-analysis', 'risk-assessment', 'goal-setting'],
      requiredTools: ['financial-software', 'spreadsheets', 'analysis-tools'],
      deliverables: ['Financial assessment report', 'Goal analysis', 'Risk profile'],
      acceptanceCriteria: ['Current situation analyzed', 'Goals defined', 'Risk tolerance assessed'],
      riskLevel: 'low',
      costEstimate: { min: 1000, max: 5000, currency: 'USD' },
      automationPotential: 70
    }
  ],

  costAnalysis: {
    totalCost: 20000,
    currency: 'USD',
    calculationDate: new Date(),
    breakdown: [
      {
        id: createId(),
        name: 'Financial Advisor',
        description: 'Professional financial planning services',
        type: 'labor',
        amount: 12000,
        currency: 'USD',
        frequency: 'one-time',
        category: 'professional'
      },
      {
        id: createId(),
        name: 'Financial Software',
        description: 'Planning and analysis tools',
        type: 'subscription',
        amount: 2000,
        currency: 'USD',
        frequency: 'yearly',
        category: 'software'
      },
      {
        id: createId(),
        name: 'Legal & Tax Services',
        description: 'Legal and tax planning consultation',
        type: 'labor',
        amount: 4000,
        currency: 'USD',
        frequency: 'one-time',
        category: 'professional'
      },
      {
        id: createId(),
        name: 'Insurance & Protection',
        description: 'Insurance planning and implementation',
        type: 'insurance',
        amount: 2000,
        currency: 'USD',
        frequency: 'yearly',
        category: 'protection'
      }
    ]
  },

  recommendedTools: [
    {
      id: createId(),
      name: 'Mint',
      category: 'personal-finance',
      description: 'Personal finance management app',
      website: 'https://mint.com',
      pricing: {
        model: 'free',
        notes: 'Free with premium features available'
      },
      features: ['Budget tracking', 'Expense categorization', 'Goal setting', 'Investment tracking'],
      pros: ['Free to use', 'Easy interface', 'Good categorization', 'Goal tracking'],
      cons: ['Limited investment features', 'Ad-supported', 'Data security concerns', 'Limited customization'],
      learningCurve: 'beginner',
      popularity: 8
    }
  ],

  optimizationSuggestions: [
    {
      category: 'efficiency',
      title: 'Automate Budget Tracking',
      description: 'Use automated tools to track expenses and income',
      impact: 'high',
      effort: 'low',
      implementation: 'Connect bank accounts and credit cards to financial tracking apps'
    }
  ],

  industryContext: {
    marketSize: 'Financial planning market valued at $100+ billion',
    competition: 'High competition with many advisors and tools',
    trends: ['Robo-advisors', 'ESG investing', 'Digital planning', 'Holistic planning'],
    challenges: ['Regulatory compliance', 'Market volatility', 'Client education', 'Technology adoption']
  },

  successMetrics: [
    {
      name: 'Goal Achievement',
      description: 'Percentage of financial goals achieved',
      target: '80%+',
      measurement: 'Regular reviews',
      frequency: 'quarterly'
    }
  ],

  risks: [
    {
      category: 'financial',
      description: 'Market volatility affecting investment returns',
      probability: 'high',
      impact: 'medium',
      mitigation: 'Diversification, regular rebalancing, and long-term perspective'
    }
  ],

  customizationOptions: [
    {
      name: 'planningType',
      description: 'Type of financial planning',
      type: 'select',
      defaultValue: 'personal',
      options: ['personal', 'business', 'retirement', 'estate'],
      required: true
    }
  ]
};

// Research Project Template
export const researchProjectTemplate: WorkflowTemplate = {
  id: createId(),
  name: 'Research Project Management',
  description: 'Systematic approach to conducting research projects from hypothesis to publication.',
  category: 'research-development',
  difficulty: 'expert',
  estimatedDuration: { min: 6, max: 24, unit: 'months' },
  tags: ['research', 'academic', 'data-analysis', 'publication', 'methodology'],
  version: '1.0.0',
  author: 'Flow Team',
  lastUpdated: new Date(),
  isPublic: true,
  rating: 4.8,
  usageCount: 450,

  steps: [
    {
      id: createId(),
      title: 'Research Design & Methodology',
      description: 'Define research question, design methodology, and plan data collection',
      type: 'planning',
      order: 0,
      estimatedDuration: { min: 2, max: 4, unit: 'weeks' },
      requiredSkills: ['research-design', 'methodology', 'statistics'],
      requiredTools: ['research-software', 'statistical-tools', 'literature-databases'],
      deliverables: ['Research proposal', 'Methodology document', 'Data collection plan'],
      acceptanceCriteria: ['Research question defined', 'Methodology approved', 'Plan finalized'],
      riskLevel: 'medium',
      costEstimate: { min: 5000, max: 15000, currency: 'USD' },
      automationPotential: 50
    }
  ],

  costAnalysis: {
    totalCost: 50000,
    currency: 'USD',
    calculationDate: new Date(),
    breakdown: [
      {
        id: createId(),
        name: 'Research Staff',
        description: 'Researchers and assistants',
        type: 'labor',
        amount: 30000,
        currency: 'USD',
        frequency: 'one-time',
        category: 'personnel'
      },
      {
        id: createId(),
        name: 'Equipment & Software',
        description: 'Research equipment and analysis software',
        type: 'equipment',
        amount: 10000,
        currency: 'USD',
        frequency: 'one-time',
        category: 'equipment'
      },
      {
        id: createId(),
        name: 'Data Collection',
        description: 'Survey costs, participant compensation, data access',
        type: 'data',
        amount: 8000,
        currency: 'USD',
        frequency: 'one-time',
        category: 'data'
      },
      {
        id: createId(),
        name: 'Publication & Dissemination',
        description: 'Journal fees, conference attendance, publication costs',
        type: 'publication',
        amount: 2000,
        currency: 'USD',
        frequency: 'one-time',
        category: 'publication'
      }
    ]
  },

  recommendedTools: [
    {
      id: createId(),
      name: 'SPSS',
      category: 'statistical-analysis',
      description: 'Statistical analysis software',
      website: 'https://ibm.com/spss',
      pricing: {
        model: 'subscription',
        startingPrice: 99,
        currency: 'USD',
        notes: 'Per user per month'
      },
      features: ['Statistical analysis', 'Data visualization', 'Predictive analytics', 'Reporting'],
      pros: ['Comprehensive features', 'Industry standard', 'Good support', 'Advanced analytics'],
      cons: ['Expensive', 'Steep learning curve', 'Complex interface', 'Limited collaboration'],
      learningCurve: 'advanced',
      popularity: 9
    }
  ],

  optimizationSuggestions: [
    {
      category: 'efficiency',
      title: 'Automate Data Analysis',
      description: 'Use automated tools for data cleaning and analysis',
      impact: 'high',
      effort: 'medium',
      implementation: 'Implement automated data processing pipelines and analysis scripts'
    }
  ],

  industryContext: {
    marketSize: 'Research and development market valued at $2+ trillion globally',
    competition: 'High competition for funding and publication',
    trends: ['Open science', 'Big data', 'AI/ML integration', 'Interdisciplinary research'],
    challenges: ['Funding constraints', 'Publication pressure', 'Reproducibility', 'Ethics compliance']
  },

  successMetrics: [
    {
      name: 'Publication Success',
      description: 'Number of peer-reviewed publications',
      target: '1-3 publications',
      measurement: 'Publication tracking',
      frequency: 'project completion'
    }
  ],

  risks: [
    {
      category: 'methodological',
      description: 'Research methodology flaws affecting results',
      probability: 'medium',
      impact: 'high',
      mitigation: 'Peer review, pilot studies, and statistical consultation'
    }
  ],

  customizationOptions: [
    {
      name: 'researchType',
      description: 'Type of research being conducted',
      type: 'select',
      defaultValue: 'quantitative',
      options: ['quantitative', 'qualitative', 'mixed-methods', 'experimental'],
      required: true
    }
  ]
};

// Export all templates with additional templates
export const allTemplates: WorkflowTemplate[] = [
  appDevelopmentTemplate,
  gameDesignTemplate,
  manufacturingTemplate,
  marketingCampaignTemplate,
  ecommerceSetupTemplate,
  contentCreationTemplate,
  customerSupportTemplate,
  hrRecruitmentTemplate,
  financialPlanningTemplate,
  researchProjectTemplate,
  // Add more templates to reach 30+ for testing infinite scrolling
  { ...appDevelopmentTemplate, id: createId(), name: 'Web Application Development', category: 'software-development' },
  { ...gameDesignTemplate, id: createId(), name: 'Mobile Game Development', category: 'game-design' },
  { ...manufacturingTemplate, id: createId(), name: 'Electronics Manufacturing', category: 'manufacturing' },
  { ...marketingCampaignTemplate, id: createId(), name: 'Social Media Marketing', category: 'marketing' },
  { ...ecommerceSetupTemplate, id: createId(), name: 'Dropshipping Business Setup', category: 'business-operations' },
  { ...contentCreationTemplate, id: createId(), name: 'Video Content Creation', category: 'creative-projects' },
  { ...customerSupportTemplate, id: createId(), name: 'Technical Support System', category: 'customer-service' },
  { ...hrRecruitmentTemplate, id: createId(), name: 'Executive Recruitment', category: 'human-resources' },
  { ...financialPlanningTemplate, id: createId(), name: 'Business Financial Planning', category: 'finance' },
  { ...researchProjectTemplate, id: createId(), name: 'Market Research Project', category: 'research-development' },
  { ...appDevelopmentTemplate, id: createId(), name: 'Desktop Software Development', category: 'software-development' },
  { ...gameDesignTemplate, id: createId(), name: 'VR Game Development', category: 'game-design' },
  { ...manufacturingTemplate, id: createId(), name: 'Textile Manufacturing', category: 'manufacturing' },
  { ...marketingCampaignTemplate, id: createId(), name: 'Email Marketing Campaign', category: 'marketing' },
  { ...ecommerceSetupTemplate, id: createId(), name: 'Subscription Box Business', category: 'business-operations' },
  { ...contentCreationTemplate, id: createId(), name: 'Podcast Production', category: 'creative-projects' },
  { ...customerSupportTemplate, id: createId(), name: 'Live Chat Support', category: 'customer-service' },
  { ...hrRecruitmentTemplate, id: createId(), name: 'Remote Team Hiring', category: 'human-resources' },
  { ...financialPlanningTemplate, id: createId(), name: 'Investment Portfolio Planning', category: 'finance' },
  { ...researchProjectTemplate, id: createId(), name: 'Clinical Research Study', category: 'research-development' },
  { ...appDevelopmentTemplate, id: createId(), name: 'SaaS Platform Development', category: 'software-development' },
  { ...gameDesignTemplate, id: createId(), name: 'Educational Game Development', category: 'game-design' },
  { ...manufacturingTemplate, id: createId(), name: 'Food Manufacturing', category: 'manufacturing' },
  { ...marketingCampaignTemplate, id: createId(), name: 'Influencer Marketing Campaign', category: 'marketing' },
  { ...ecommerceSetupTemplate, id: createId(), name: 'B2B E-commerce Platform', category: 'business-operations' },
  { ...contentCreationTemplate, id: createId(), name: 'Infographic Design', category: 'creative-projects' },
  { ...customerSupportTemplate, id: createId(), name: 'Multi-language Support', category: 'customer-service' },
  { ...hrRecruitmentTemplate, id: createId(), name: 'Technical Talent Acquisition', category: 'human-resources' },
  { ...financialPlanningTemplate, id: createId(), name: 'Retirement Planning', category: 'finance' },
  { ...researchProjectTemplate, id: createId(), name: 'User Experience Research', category: 'research-development' }
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