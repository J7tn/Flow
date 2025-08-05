import { FlowTemplate } from '@/types/templates';

// Helper function to create static IDs for consistency
const createId = (prefix: string, index: number) => `${prefix}-${index}`;

// Software Development Templates
export const appDevelopmentTemplate: FlowTemplate = {
  id: 'app-development-1',
  name: 'Mobile App Development Pipeline',
  description: 'Complete workflow for developing and launching a mobile application from concept to app store deployment.',
  category: 'software-development',
  difficulty: 'advanced',
  targetAudience: 'small-team',
  estimatedDuration: { min: 12, max: 24, unit: 'weeks' },
  tags: ['mobile', 'app-development', 'ios', 'android', 'react-native', 'flutter'],
  thumbnail: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=300&fit=crop',
  version: '1.0.0',
  author: 'Flow Team',
  authorName: 'Flow Team',
  lastUpdated: new Date(),
  createdAt: new Date(),
  isPublic: true,
  rating: 4.8,
  usageCount: 1250,
  isUserGenerated: false,
  status: 'approved',

  steps: [
    {
      id: 'app-dev-step-1',
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
      costEstimate: { min: 800, max: 1500, currency: 'USD' },
      automationPotential: 30,
      optimizationTips: ['Use automated survey tools', 'Leverage AI for competitor analysis', 'Automate data collection']
    },
    {
      id: 'app-dev-step-2',
      title: 'UI/UX Design & Prototyping',
      description: 'Create wireframes, design mockups, and interactive prototypes for user testing',
      type: 'design',
      order: 1,
      estimatedDuration: { min: 2, max: 4, unit: 'weeks' },
      requiredSkills: ['ui-design', 'ux-design', 'prototyping', 'user-testing'],
      requiredTools: ['figma', 'sketch', 'invision', 'adobe-xd'],
      dependencies: ['app-dev-step-1'], // Market research step
      deliverables: ['Wireframes', 'High-fidelity mockups', 'Interactive prototype', 'Design system'],
      acceptanceCriteria: ['All screens designed', 'Prototype tested with users', 'Design system documented'],
      riskLevel: 'medium',
      costEstimate: { min: 3000, max: 6000, currency: 'USD' },
      automationPotential: 20,
      optimizationTips: ['Use design system templates', 'Automate design handoff', 'Implement design tokens']
    },
    {
      id: 'app-dev-step-3',
      title: 'Technical Architecture & Planning',
      description: 'Define technical stack, architecture, database design, and API specifications',
      type: 'planning',
      order: 2,
      estimatedDuration: { min: 1, max: 2, unit: 'weeks' },
      requiredSkills: ['system-architecture', 'database-design', 'api-design', 'security'],
      requiredTools: ['draw.io', 'postman', 'database-design-tools'],
      dependencies: ['app-dev-step-2'], // Design step
      deliverables: ['Technical architecture document', 'Database schema', 'API specifications', 'Security plan'],
      acceptanceCriteria: ['Architecture approved by team', 'Database schema finalized', 'API endpoints defined'],
      riskLevel: 'medium',
      costEstimate: { min: 2000, max: 4000, currency: 'USD' },
      automationPotential: 40,
      optimizationTips: ['Use architecture templates', 'Automate API documentation', 'Implement security scanning']
    },
    {
      id: 'app-dev-step-4',
      title: 'Frontend Development',
      description: 'Develop the mobile app frontend using React Native, Flutter, or native development',
      type: 'development',
      order: 3,
      estimatedDuration: { min: 6, max: 12, unit: 'weeks' },
      requiredSkills: ['react-native', 'javascript', 'mobile-development', 'state-management'],
      requiredTools: ['react-native', 'expo', 'redux', 'typescript'],
      dependencies: ['app-dev-step-3'], // Technical architecture step
      deliverables: ['Mobile app frontend', 'State management', 'Navigation', 'UI components'],
      acceptanceCriteria: ['All screens implemented', 'Navigation working', 'State management functional'],
      riskLevel: 'high',
      costEstimate: { min: 8000, max: 15000, currency: 'USD' },
      automationPotential: 60,
      optimizationTips: ['Use component libraries', 'Implement automated testing', 'Use code generation tools']
    },
    {
      id: 'app-dev-step-5',
      title: 'Backend Development',
      description: 'Develop the backend API, database, and server infrastructure',
      type: 'development',
      order: 4,
      estimatedDuration: { min: 4, max: 8, unit: 'weeks' },
      requiredSkills: ['backend-development', 'api-development', 'database-management', 'server-administration'],
      requiredTools: ['node.js', 'express', 'postgresql', 'aws'],
      dependencies: ['app-dev-step-3'], // Technical architecture step
      deliverables: ['Backend API', 'Database', 'Authentication system', 'Server infrastructure'],
      acceptanceCriteria: ['API endpoints functional', 'Database operational', 'Authentication working'],
      riskLevel: 'high',
      costEstimate: { min: 6000, max: 12000, currency: 'USD' },
      automationPotential: 70,
      optimizationTips: ['Use API frameworks', 'Implement automated testing', 'Use infrastructure as code']
    },
    {
      id: 'app-dev-step-6',
      title: 'Testing & Quality Assurance',
      description: 'Comprehensive testing including unit tests, integration tests, and user acceptance testing',
      type: 'testing',
      order: 5,
      estimatedDuration: { min: 2, max: 4, unit: 'weeks' },
      requiredSkills: ['testing', 'qa', 'automation', 'bug-tracking'],
      requiredTools: ['jest', 'cypress', 'appium', 'jira'],
      dependencies: ['app-dev-step-4', 'app-dev-step-5'], // Frontend and backend steps
      deliverables: ['Test suite', 'Bug reports', 'Performance test results', 'Security audit'],
      acceptanceCriteria: ['90% code coverage', 'All critical bugs fixed', 'Performance benchmarks met'],
      riskLevel: 'medium',
      costEstimate: { min: 3000, max: 6000, currency: 'USD' },
      automationPotential: 80,
      optimizationTips: ['Automate test execution', 'Use continuous testing', 'Implement automated bug reporting']
    },
    {
      id: 'app-dev-step-7',
      title: 'App Store Submission & Deployment',
      description: 'Prepare app for app store submission, including store listings, screenshots, and compliance',
      type: 'deployment',
      order: 6,
      estimatedDuration: { min: 1, max: 2, unit: 'weeks' },
      requiredSkills: ['app-store-optimization', 'compliance', 'marketing'],
      requiredTools: ['app-store-connect', 'google-play-console', 'screenshot-tools'],
      dependencies: ['app-dev-step-6'], // Testing step
      deliverables: ['App store listings', 'Screenshots and videos', 'Privacy policy', 'App store approval'],
      acceptanceCriteria: ['App approved by stores', 'Store listings complete', 'Compliance requirements met'],
      riskLevel: 'medium',
      costEstimate: { min: 1000, max: 2000, currency: 'USD' },
      automationPotential: 50,
      optimizationTips: ['Automate screenshot generation', 'Use ASO tools', 'Implement automated compliance checking']
    }
  ],

  costAnalysis: {
    totalCost: 35000,
    currency: 'USD',
    calculationDate: new Date(),
    breakdown: [
      {
        id: createId('dev-team', 1),
        name: 'Development Team (3 developers)',
        description: 'Frontend and backend developers at $120/hour average rate',
        type: 'labor',
        amount: 24000,
        currency: 'USD',
        frequency: 'one-time',
        category: 'personnel'
      },
      {
        id: createId('ui-ux-designer', 1),
        name: 'UI/UX Designer',
        description: 'Professional designer at $80/hour for 50 hours',
        type: 'labor',
        amount: 4000,
        currency: 'USD',
        frequency: 'one-time',
        category: 'design'
      },
      {
        id: createId('aws-cloud-infrastructure', 1),
        name: 'AWS Cloud Infrastructure',
        description: 'EC2, RDS, S3, CloudFront for first year (similar to Instagram\'s initial setup)',
        type: 'infrastructure',
        amount: 2400,
        currency: 'USD',
        frequency: 'yearly',
        category: 'infrastructure'
      },
      {
        id: createId('development-tools-licenses', 1),
        name: 'Development Tools & Licenses',
        description: 'JetBrains IDEs, Sketch, Figma Pro, Postman Pro, GitHub Pro',
        type: 'licensing',
        amount: 1200,
        currency: 'USD',
        frequency: 'yearly',
        category: 'tools'
      },
      {
        id: createId('testing-qa-services', 1),
        name: 'Testing & QA Services',
        description: 'Automated testing tools, device testing, security audit',
        type: 'labor',
        amount: 3000,
        currency: 'USD',
        frequency: 'one-time',
        category: 'quality'
      },
      {
        id: createId('app-store-developer-accounts', 1),
        name: 'App Store Developer Accounts',
        description: 'Apple Developer Program ($99/year) + Google Play Console ($25 one-time)',
        type: 'subscription',
        amount: 124,
        currency: 'USD',
        frequency: 'yearly',
        category: 'platform'
      }
    ],
    assumptions: [
      'Team of 3 developers working 20 weeks',
      'Professional UI/UX designer for 50 hours',
      'Standard app complexity (similar to a food delivery app)',
      'AWS infrastructure for scalability',
      'Comprehensive testing and security measures'
    ],
    riskFactors: [
      'Scope creep may increase costs by 20-30%',
      'App store rejection delays (average 2-4 weeks)',
      'Technical debt accumulation requiring refactoring',
      'Market changes affecting requirements and timeline'
    ]
  },

  recommendedTools: [
    {
      id: createId('react-native', 1),
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
      id: createId('figma', 1),
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
      id: createId('aws', 1),
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
export const gameDesignTemplate: FlowTemplate = {
  id: 'game-design-1',
  name: 'Game Development Pipeline',
  description: 'Complete workflow for developing a video game from concept to release, including design, development, and marketing phases.',
  category: 'game-design',
  difficulty: 'expert',
  targetAudience: 'enterprise',
  estimatedDuration: { min: 18, max: 36, unit: 'months' },
  tags: ['game-development', 'unity', 'unreal', 'indie-games', 'mobile-games'],
  thumbnail: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&h=300&fit=crop',
  version: '1.0.0',
  author: 'Flow Team',
  authorName: 'Flow Team',
  lastUpdated: new Date(),
  createdAt: new Date(),
  isPublic: true,
  rating: 4.9,
  usageCount: 890,
  isUserGenerated: false,
  status: 'approved',

  steps: [
    {
      id: 'game-dev-step-1',
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
      id: 'game-dev-step-2',
      title: 'Prototyping & Core Mechanics',
      description: 'Create playable prototype to test core game mechanics and gameplay loop',
      type: 'development',
      order: 1,
      estimatedDuration: { min: 4, max: 8, unit: 'weeks' },
      requiredSkills: ['game-programming', 'prototyping', 'game-mechanics'],
      requiredTools: ['unity', 'unreal-engine', 'godot'],
      dependencies: ['game-dev-step-1'],
      deliverables: ['Playable prototype', 'Core mechanics implementation', 'Basic UI'],
      acceptanceCriteria: ['Prototype is playable', 'Core loop is fun', 'Mechanics are balanced'],
      riskLevel: 'medium',
      costEstimate: { min: 15000, max: 30000, currency: 'USD' },
      automationPotential: 40
    }
    // Additional steps would continue here...
  ],

  costAnalysis: {
    totalCost: 85000,
    currency: 'USD',
    calculationDate: new Date(),
    breakdown: [
      {
        id: createId('dev-team', 2),
        name: 'Development Team (5 people)',
        description: '2 programmers ($100/hour), 2 artists ($80/hour), 1 designer ($90/hour) for 18 months',
        type: 'labor',
        amount: 55000,
        currency: 'USD',
        frequency: 'one-time',
        category: 'personnel'
      },
      {
        id: createId('unity-pro-licenses', 1),
        name: 'Unity Pro Licenses',
        description: 'Unity Pro ($180/month per seat) for 5 team members for 18 months',
        type: 'licensing',
        amount: 16200,
        currency: 'USD',
        frequency: 'one-time',
        category: 'software'
      },
      {
        id: createId('marketing-steam-page', 1),
        name: 'Marketing & Steam Page',
        description: 'Steam page creation, press kit, influencer outreach, social media campaign',
        type: 'labor',
        amount: 8000,
        currency: 'USD',
        frequency: 'one-time',
        category: 'marketing'
      },
      {
        id: createId('asset-store-purchases', 1),
        name: 'Asset Store Purchases',
        description: 'Unity Asset Store purchases for models, textures, sound effects, animations',
        type: 'materials',
        amount: 3000,
        currency: 'USD',
        frequency: 'one-time',
        category: 'assets'
      },
      {
        id: createId('testing-qa', 1),
        name: 'Testing & QA',
        description: 'Beta testing, bug fixing, performance optimization, platform testing',
        type: 'labor',
        amount: 2800,
        currency: 'USD',
        frequency: 'one-time',
        category: 'quality'
      }
    ],
    assumptions: [
      'Indie game development team of 5 people',
      '18-month development cycle (typical for indie games)',
      'Unity-based 3D game (similar to Among Us complexity)',
      'Steam platform release with marketing',
      'Asset store purchases to speed up development'
    ],
    riskFactors: [
      'Development delays can increase costs by 30-50%',
      'Steam algorithm changes affecting discoverability',
      'Player feedback requiring major redesigns',
      'Competition from similar games affecting sales'
    ]
  },

  recommendedTools: [
    {
      id: createId('unity', 1),
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
export const manufacturingTemplate: FlowTemplate = {
  id: 'manufacturing-1',
  name: 'Product Manufacturing Pipeline',
  description: 'Complete workflow from product design to retail distribution, including manufacturing, quality control, and logistics.',
  category: 'manufacturing',
  difficulty: 'advanced',
  targetAudience: 'enterprise',
  estimatedDuration: { min: 6, max: 18, unit: 'months' },
  tags: ['manufacturing', 'product-development', 'supply-chain', 'retail'],
  thumbnail: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=300&fit=crop',
  version: '1.0.0',
  author: 'Flow Team',
  authorName: 'Flow Team',
  lastUpdated: new Date(),
  createdAt: new Date(),
  isPublic: true,
  rating: 4.7,
  usageCount: 650,
  isUserGenerated: false,
  status: 'approved',

  steps: [
    {
      id: 'product-design-engineering',
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
      costEstimate: { min: 8000, max: 20000, currency: 'USD' },
      automationPotential: 60
    }
    // Additional steps would continue here...
  ],

  costAnalysis: {
    totalCost: 250000,
    currency: 'USD',
    calculationDate: new Date(),
    breakdown: [
      {
        id: createId('injection-molding-tooling', 1),
        name: 'Injection Molding Tooling',
        description: 'Custom injection molds for plastic parts (similar to iPhone case manufacturing)',
        type: 'one-time',
        amount: 80000,
        currency: 'USD',
        frequency: 'one-time',
        category: 'tooling'
      },
      {
        id: createId('pcb-assembly-setup', 1),
        name: 'PCB Assembly Setup',
        description: 'Circuit board assembly line setup, stencils, fixtures',
        type: 'one-time',
        amount: 45000,
        currency: 'USD',
        frequency: 'one-time',
        category: 'equipment'
      },
      {
        id: createId('first-production-run', 1),
        name: 'First Production Run (1000 units)',
        description: 'Materials, labor, and overhead for initial production batch',
        type: 'variable',
        amount: 75000,
        currency: 'USD',
        frequency: 'one-time',
        category: 'production'
      },
      {
        id: createId('quality-control-testing', 1),
        name: 'Quality Control & Testing',
        description: 'Testing equipment, certifications, quality assurance processes',
        type: 'one-time',
        amount: 25000,
        currency: 'USD',
        frequency: 'one-time',
        category: 'quality'
      },
      {
        id: createId('packaging-logistics', 1),
        name: 'Packaging & Logistics',
        description: 'Custom packaging design, shipping containers, logistics setup',
        type: 'one-time',
        amount: 15000,
        currency: 'USD',
        frequency: 'one-time',
        category: 'logistics'
      },
      {
        id: createId('ongoing-production', 1),
        name: 'Ongoing Production (Monthly)',
        description: 'Materials, labor, overhead for 500 units/month production',
        type: 'variable',
        amount: 35000,
        currency: 'USD',
        frequency: 'monthly',
        category: 'production'
      }
    ],
    assumptions: [
      'Consumer electronics product (similar to smart home device)',
      'Injection molded plastic housing with PCB assembly',
      'Initial production run of 1000 units',
      'Ongoing production of 500 units/month',
      'Quality standards meeting FCC/CE certifications'
    ],
    riskFactors: [
      'Supply chain disruptions can increase costs by 20-40%',
      'Tooling modifications required after first production run',
      'Quality issues requiring rework and delays',
      'Material price fluctuations affecting ongoing costs'
    ]
  },

  recommendedTools: [
    {
      id: createId('solidworks', 1),
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
export const marketingCampaignTemplate: FlowTemplate = {
  id: 'marketing-campaign-1',
  name: 'Digital Marketing Campaign',
  description: 'Complete digital marketing campaign from strategy to execution and analysis.',
  category: 'marketing',
  difficulty: 'intermediate',
  targetAudience: 'small-team',
  estimatedDuration: { min: 8, max: 16, unit: 'weeks' },
  tags: ['digital-marketing', 'social-media', 'content-marketing', 'analytics'],
  thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop',
  version: '1.0.0',
  author: 'Flow Team',
  authorName: 'Flow Team',
  lastUpdated: new Date(),
  createdAt: new Date(),
  isPublic: true,
  rating: 4.6,
  usageCount: 1200,
  isUserGenerated: false,
  status: 'approved',

  steps: [
    {
      id: 'marketing-step-1',
      title: 'Campaign Strategy & Goal Setting',
      description: 'Define campaign objectives, target audience, key messages, and success metrics',
      type: 'strategy',
      order: 0,
      estimatedDuration: { min: 1, max: 2, unit: 'weeks' },
      requiredSkills: ['marketing-strategy', 'goal-setting', 'audience-segmentation'],
      requiredTools: ['google-analytics', 'facebook-audience-insights', 'semrush'],
      deliverables: ['Campaign brief', 'Target audience personas', 'Key messaging framework', 'Success metrics'],
      acceptanceCriteria: ['Clear campaign objectives defined', 'Target audience segmented', 'Success metrics established'],
      riskLevel: 'low',
      costEstimate: { min: 1000, max: 3000, currency: 'USD' },
      automationPotential: 50,
      optimizationTips: ['Use AI for audience insights', 'Automate competitor analysis', 'Implement goal tracking']
    },
    {
      id: 'marketing-step-2',
      title: 'Market Research & Competitive Analysis',
      description: 'Research target market, analyze competitors, and identify market opportunities',
      type: 'research',
      order: 1,
      estimatedDuration: { min: 1, max: 2, unit: 'weeks' },
      requiredSkills: ['market-research', 'competitive-analysis', 'data-analysis'],
      requiredTools: ['semrush', 'spyfu', 'similar-web', 'google-trends'],
      dependencies: ['marketing-step-1'],
      deliverables: ['Market analysis report', 'Competitor analysis', 'Opportunity assessment', 'Market trends'],
      acceptanceCriteria: ['Market landscape understood', 'Competitive positioning clear', 'Opportunities identified'],
      riskLevel: 'low',
      costEstimate: { min: 2000, max: 5000, currency: 'USD' },
      automationPotential: 70,
      optimizationTips: ['Use automated research tools', 'Implement competitive monitoring', 'Automate trend analysis']
    },
    {
      id: 'marketing-step-3',
      title: 'Creative Strategy & Content Planning',
      description: 'Develop creative concepts, content themes, and visual identity for the campaign',
      type: 'creative',
      order: 2,
      estimatedDuration: { min: 2, max: 3, unit: 'weeks' },
      requiredSkills: ['creative-strategy', 'content-planning', 'brand-identity'],
      requiredTools: ['canva', 'figma', 'trello', 'content-calendar'],
      dependencies: ['marketing-step-2'],
      deliverables: ['Creative brief', 'Content calendar', 'Visual guidelines', 'Brand assets'],
      acceptanceCriteria: ['Creative concept approved', 'Content plan finalized', 'Visual assets created'],
      riskLevel: 'medium',
      costEstimate: { min: 3000, max: 8000, currency: 'USD' },
      automationPotential: 40,
      optimizationTips: ['Use design templates', 'Automate content scheduling', 'Implement brand guidelines']
    },
    {
      id: 'marketing-step-4',
      title: 'Channel Strategy & Platform Selection',
      description: 'Select marketing channels, plan platform-specific strategies, and set up accounts',
      type: 'planning',
      order: 3,
      estimatedDuration: { min: 1, max: 2, unit: 'weeks' },
      requiredSkills: ['channel-strategy', 'platform-marketing', 'account-setup'],
      requiredTools: ['facebook-business', 'google-ads', 'linkedin-ads', 'tiktok-ads'],
      dependencies: ['marketing-step-3'],
      deliverables: ['Channel strategy', 'Platform accounts', 'Ad account setup', 'Tracking configuration'],
      acceptanceCriteria: ['Channels selected', 'Accounts configured', 'Tracking implemented'],
      riskLevel: 'low',
      costEstimate: { min: 1000, max: 3000, currency: 'USD' },
      automationPotential: 80,
      optimizationTips: ['Use account management tools', 'Automate platform setup', 'Implement cross-platform tracking']
    },
    {
      id: 'marketing-step-5',
      title: 'Content Creation & Asset Development',
      description: 'Create all campaign assets including ads, social media content, and landing pages',
      type: 'content',
      order: 4,
      estimatedDuration: { min: 3, max: 5, unit: 'weeks' },
      requiredSkills: ['content-creation', 'graphic-design', 'copywriting', 'video-production'],
      requiredTools: ['canva', 'adobe-creative-suite', 'capcut', 'copy-ai'],
      dependencies: ['marketing-step-4'],
      deliverables: ['Ad creatives', 'Social media content', 'Landing pages', 'Video content'],
      acceptanceCriteria: ['All assets created', 'Content approved', 'Assets optimized for platforms'],
      riskLevel: 'medium',
      costEstimate: { min: 5000, max: 15000, currency: 'USD' },
      automationPotential: 60,
      optimizationTips: ['Use AI content tools', 'Implement design systems', 'Automate content optimization']
    },
    {
      id: 'marketing-step-6',
      title: 'Campaign Setup & Launch Preparation',
      description: 'Set up advertising campaigns, configure targeting, and prepare for launch',
      type: 'setup',
      order: 5,
      estimatedDuration: { min: 1, max: 2, unit: 'weeks' },
      requiredSkills: ['advertising-setup', 'targeting', 'campaign-optimization'],
      requiredTools: ['facebook-ads-manager', 'google-ads', 'linkedin-campaign-manager'],
      dependencies: ['marketing-step-5'],
      deliverables: ['Campaign configurations', 'Targeting setup', 'Budget allocation', 'Launch checklist'],
      acceptanceCriteria: ['Campaigns configured', 'Targeting optimized', 'Budget allocated'],
      riskLevel: 'medium',
      costEstimate: { min: 2000, max: 5000, currency: 'USD' },
      automationPotential: 85,
      optimizationTips: ['Use automated bidding', 'Implement smart targeting', 'Automate budget management']
    },
    {
      id: 'marketing-step-7',
      title: 'Campaign Launch & Active Management',
      description: 'Launch campaigns across all channels and actively monitor and optimize performance',
      type: 'execution',
      order: 6,
      estimatedDuration: { min: 4, max: 12, unit: 'weeks' },
      requiredSkills: ['campaign-management', 'performance-optimization', 'data-analysis'],
      requiredTools: ['facebook-ads-manager', 'google-ads', 'analytics-platforms', 'reporting-tools'],
      dependencies: ['marketing-step-6'],
      deliverables: ['Active campaigns', 'Performance reports', 'Optimization recommendations', 'Budget management'],
      acceptanceCriteria: ['Campaigns live', 'Performance tracking', 'Optimizations implemented'],
      riskLevel: 'high',
      costEstimate: { min: 10000, max: 50000, currency: 'USD' },
      automationPotential: 90,
      optimizationTips: ['Use automated optimization', 'Implement real-time monitoring', 'Automate reporting']
    },
    {
      id: 'marketing-step-8',
      title: 'Performance Analysis & Optimization',
      description: 'Analyze campaign performance, identify optimization opportunities, and implement improvements',
      type: 'analysis',
      order: 7,
      estimatedDuration: { min: 1, max: 2, unit: 'weeks' },
      requiredSkills: ['data-analysis', 'performance-optimization', 'reporting'],
      requiredTools: ['google-analytics', 'facebook-insights', 'excel', 'data-visualization'],
      dependencies: ['marketing-step-7'],
      deliverables: ['Performance analysis', 'Optimization recommendations', 'ROI calculations', 'Future insights'],
      acceptanceCriteria: ['Performance analyzed', 'Optimizations implemented', 'ROI calculated'],
      riskLevel: 'low',
      costEstimate: { min: 2000, max: 6000, currency: 'USD' },
      automationPotential: 95,
      optimizationTips: ['Use automated reporting', 'Implement predictive analytics', 'Automate optimization decisions']
    },
    {
      id: 'marketing-step-9',
      title: 'Campaign Wrap-up & Learnings',
      description: 'Finalize campaign, document learnings, and prepare insights for future campaigns',
      type: 'wrap-up',
      order: 8,
      estimatedDuration: { min: 1, max: 2, unit: 'weeks' },
      requiredSkills: ['project-management', 'documentation', 'knowledge-management'],
      requiredTools: ['google-docs', 'notion', 'slack', 'presentation-tools'],
      dependencies: ['marketing-step-8'],
      deliverables: ['Campaign report', 'Lessons learned', 'Best practices', 'Future recommendations'],
      acceptanceCriteria: ['Campaign completed', 'Learnings documented', 'Recommendations provided'],
      riskLevel: 'low',
      costEstimate: { min: 1000, max: 3000, currency: 'USD' },
      automationPotential: 60,
      optimizationTips: ['Automate report generation', 'Use knowledge management tools', 'Implement learning databases']
    }
  ],

  costAnalysis: {
    totalCost: 85000,
    currency: 'USD',
    calculationDate: new Date(),
    breakdown: [
      {
        id: createId('marketing-team', 1),
        name: 'Marketing Team (4 people)',
        description: 'Marketing director ($120/hour), content strategist ($80/hour), designer ($75/hour), social media manager ($65/hour) for 16 weeks',
        type: 'labor',
        amount: 45000,
        currency: 'USD',
        frequency: 'one-time',
        category: 'personnel'
      },
      {
        id: createId('paid-advertising-budget', 1),
        name: 'Paid Advertising Budget',
        description: 'Facebook/Instagram ads ($25,000), Google Search/Display ($15,000), TikTok ads ($10,000) - typical for mid-market D2C brand',
        type: 'variable',
        amount: 50000,
        currency: 'USD',
        frequency: 'one-time',
        category: 'advertising'
      },
      {
        id: createId('influencer-creator-partnerships', 1),
        name: 'Influencer & Creator Partnerships',
        description: 'Mix of nano (10-50k followers), micro (50k-500k), and macro (500k+) influencers across platforms',
        type: 'variable',
        amount: 15000,
        currency: 'USD',
        frequency: 'one-time',
        category: 'influencer'
      },
      {
        id: createId('marketing-technology-stack', 1),
        name: 'Marketing Technology Stack',
        description: 'HubSpot Marketing Hub ($800/month), Klaviyo ($200/month), Later Pro ($40/month), Canva Pro ($120/year), SEMrush ($119/month)',
        type: 'subscription',
        amount: 15000,
        currency: 'USD',
        frequency: 'yearly',
        category: 'tools'
      },
      {
        id: createId('professional-content-production', 1),
        name: 'Professional Content Production',
        description: 'Product photography ($5,000), lifestyle shoots ($8,000), video content ($12,000), graphic design assets ($5,000)',
        type: 'labor',
        amount: 30000,
        currency: 'USD',
        frequency: 'one-time',
        category: 'content'
      },
      {
        id: createId('pr-media-relations', 1),
        name: 'PR & Media Relations',
        description: 'Press release distribution ($2,000), media kit creation ($3,000), journalist outreach ($5,000), PR agency retainer ($10,000)',
        type: 'labor',
        amount: 20000,
        currency: 'USD',
        frequency: 'one-time',
        category: 'pr'
      },
      {
        id: createId('analytics-attribution', 1),
        name: 'Analytics & Attribution',
        description: 'Google Analytics 4 setup, conversion tracking, attribution modeling, A/B testing platform',
        type: 'subscription',
        amount: 5000,
        currency: 'USD',
        frequency: 'yearly',
        category: 'analytics'
      },
      {
        id: createId('legal-compliance', 1),
        name: 'Legal & Compliance',
        description: 'Privacy policy updates, GDPR compliance, advertising compliance review, terms of service',
        type: 'one-time',
        amount: 8000,
        currency: 'USD',
        frequency: 'one-time',
        category: 'legal'
      }
    ],
    assumptions: [
      'Mid-market D2C e-commerce brand with $2-5M annual revenue',
      '4-month comprehensive campaign duration',
      'Target audience of 500,000+ potential customers across multiple platforms',
      'Multi-channel approach (social, search, influencer, PR)',
      'Professional content creation with agency-level quality',
      'Full marketing technology stack implementation',
      'Compliance with privacy regulations (GDPR, CCPA)'
    ],
    riskFactors: [
      'Ad platform algorithm changes affecting performance and costs',
      'Influencer partnerships not delivering expected ROI or brand alignment',
      'Competitive advertising driving up costs and reducing visibility',
      'Seasonal fluctuations affecting campaign timing and performance',
      'Privacy regulation changes impacting targeting capabilities',
      'Content creation delays affecting campaign timeline',
      'Platform policy changes affecting advertising strategies'
    ]
  },

  recommendedTools: [
    {
      id: createId('hubspot', 1),
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
export const ecommerceSetupTemplate: FlowTemplate = {
  id: 'ecommerce-setup-1',
  name: 'E-commerce Store Setup',
  description: 'Complete workflow for setting up an online store from platform selection to launch.',
  category: 'business-operations',
  difficulty: 'intermediate',
  targetAudience: 'individual',
  estimatedDuration: { min: 4, max: 12, unit: 'weeks' },
  tags: ['ecommerce', 'online-store', 'shopify', 'woocommerce', 'payment-processing'],
  thumbnail: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop',
  version: '1.0.0',
  author: 'Flow Team',
  authorName: 'Flow Team',
  lastUpdated: new Date(),
  createdAt: new Date(),
  isPublic: true,
  rating: 4.5,
  usageCount: 2100,
  isUserGenerated: false,
  status: 'approved',

  steps: [
    {
      id: 'ecommerce-step-1',
      title: 'Market Research & Business Planning',
      description: 'Research target market, analyze competitors, define business model and value proposition',
      type: 'research',
      order: 0,
      estimatedDuration: { min: 1, max: 2, unit: 'weeks' },
      requiredSkills: ['market-research', 'business-planning', 'competitive-analysis'],
      requiredTools: ['google-trends', 'semrush', 'spyfu', 'similar-web'],
      deliverables: ['Market analysis report', 'Competitor analysis', 'Business model canvas', 'Target audience personas'],
      acceptanceCriteria: ['Clear market opportunity identified', 'Competitive landscape mapped', 'Business model validated'],
      riskLevel: 'low',
      costEstimate: { min: 500, max: 2000, currency: 'USD' },
      automationPotential: 60,
      optimizationTips: ['Use automated market research tools', 'Leverage AI for competitor analysis', 'Automate data collection']
    },
    {
      id: 'ecommerce-step-2',
      title: 'Platform Selection & Technical Planning',
      description: 'Choose e-commerce platform, plan technical architecture, and set up development environment',
      type: 'planning',
      order: 1,
      estimatedDuration: { min: 1, max: 2, unit: 'weeks' },
      requiredSkills: ['ecommerce-platforms', 'technical-architecture', 'project-planning'],
      requiredTools: ['shopify', 'woocommerce', 'magento', 'bigcommerce'],
      dependencies: ['ecommerce-step-1'],
      deliverables: ['Platform selection', 'Technical architecture', 'Development timeline', 'Resource allocation'],
      acceptanceCriteria: ['Platform chosen based on requirements', 'Technical architecture documented', 'Development plan approved'],
      riskLevel: 'low',
      costEstimate: { min: 1000, max: 3000, currency: 'USD' },
      automationPotential: 40,
      optimizationTips: ['Use platform comparison tools', 'Automate setup processes', 'Implement CI/CD pipeline']
    },
    {
      id: 'ecommerce-step-3',
      title: 'Store Design & User Experience',
      description: 'Create store design, wireframes, and user experience flow for optimal conversion',
      type: 'design',
      order: 2,
      estimatedDuration: { min: 2, max: 4, unit: 'weeks' },
      requiredSkills: ['ui-design', 'ux-design', 'conversion-optimization', 'user-research'],
      requiredTools: ['figma', 'sketch', 'hotjar', 'google-analytics'],
      dependencies: ['ecommerce-step-2'],
      deliverables: ['Store wireframes', 'High-fidelity mockups', 'User journey maps', 'Design system'],
      acceptanceCriteria: ['Design approved by stakeholders', 'User testing completed', 'Conversion optimization implemented'],
      riskLevel: 'medium',
      costEstimate: { min: 3000, max: 8000, currency: 'USD' },
      automationPotential: 30,
      optimizationTips: ['Use design system templates', 'Implement A/B testing framework', 'Automate user testing']
    },
    {
      id: 'ecommerce-step-4',
      title: 'Store Development & Setup',
      description: 'Develop the e-commerce store, set up products, categories, and basic functionality',
      type: 'development',
      order: 3,
      estimatedDuration: { min: 3, max: 6, unit: 'weeks' },
      requiredSkills: ['web-development', 'ecommerce-development', 'database-management'],
      requiredTools: ['shopify-liquid', 'javascript', 'css', 'html'],
      dependencies: ['ecommerce-step-3'],
      deliverables: ['Functional e-commerce store', 'Product catalog', 'Shopping cart', 'User accounts'],
      acceptanceCriteria: ['Store is functional', 'All core features working', 'Mobile responsive design'],
      riskLevel: 'medium',
      costEstimate: { min: 5000, max: 15000, currency: 'USD' },
      automationPotential: 70,
      optimizationTips: ['Use theme templates', 'Implement automated testing', 'Use code generation tools']
    },
    {
      id: 'ecommerce-step-5',
      title: 'Payment & Security Setup',
      description: 'Configure payment gateways, security measures, and compliance requirements',
      type: 'configuration',
      order: 4,
      estimatedDuration: { min: 1, max: 2, unit: 'weeks' },
      requiredSkills: ['payment-processing', 'security', 'compliance', 'ssl-certificates'],
      requiredTools: ['stripe', 'paypal', 'square', 'ssl-certificates'],
      dependencies: ['ecommerce-step-4'],
      deliverables: ['Payment processing setup', 'SSL certificates', 'Security measures', 'Compliance documentation'],
      acceptanceCriteria: ['Payments processing correctly', 'Security audit passed', 'Compliance requirements met'],
      riskLevel: 'high',
      costEstimate: { min: 1000, max: 3000, currency: 'USD' },
      automationPotential: 80,
      optimizationTips: ['Use automated security scanning', 'Implement fraud detection', 'Automate compliance checking']
    },
    {
      id: 'ecommerce-step-6',
      title: 'Product Management & Inventory',
      description: 'Set up product catalog, inventory management, and fulfillment processes',
      type: 'operations',
      order: 5,
      estimatedDuration: { min: 1, max: 3, unit: 'weeks' },
      requiredSkills: ['inventory-management', 'product-management', 'logistics'],
      requiredTools: ['shopify-admin', 'inventory-tracking', 'fulfillment-software'],
      dependencies: ['ecommerce-step-5'],
      deliverables: ['Product catalog', 'Inventory system', 'Fulfillment process', 'Supplier management'],
      acceptanceCriteria: ['All products uploaded', 'Inventory tracking working', 'Fulfillment process defined'],
      riskLevel: 'medium',
      costEstimate: { min: 2000, max: 5000, currency: 'USD' },
      automationPotential: 85,
      optimizationTips: ['Automate inventory updates', 'Use barcode scanning', 'Implement automated reordering']
    },
    {
      id: 'ecommerce-step-7',
      title: 'Marketing & SEO Setup',
      description: 'Implement marketing tools, SEO optimization, and analytics tracking',
      type: 'marketing',
      order: 6,
      estimatedDuration: { min: 2, max: 3, unit: 'weeks' },
      requiredSkills: ['digital-marketing', 'seo', 'analytics', 'email-marketing'],
      requiredTools: ['google-analytics', 'google-search-console', 'klaviyo', 'facebook-pixel'],
      dependencies: ['ecommerce-step-6'],
      deliverables: ['SEO optimization', 'Marketing automation', 'Analytics setup', 'Email marketing'],
      acceptanceCriteria: ['SEO implemented', 'Analytics tracking working', 'Marketing automation active'],
      riskLevel: 'low',
      costEstimate: { min: 2000, max: 6000, currency: 'USD' },
      automationPotential: 90,
      optimizationTips: ['Automate SEO monitoring', 'Use AI for content optimization', 'Implement automated reporting']
    },
    {
      id: 'ecommerce-step-8',
      title: 'Testing & Quality Assurance',
      description: 'Comprehensive testing of all store functionality, payment processing, and user experience',
      type: 'testing',
      order: 7,
      estimatedDuration: { min: 1, max: 2, unit: 'weeks' },
      requiredSkills: ['testing', 'qa', 'user-testing', 'bug-tracking'],
      requiredTools: ['cypress', 'selenium', 'user-testing-platforms', 'bug-tracking-tools'],
      dependencies: ['ecommerce-step-7'],
      deliverables: ['Test results', 'Bug reports', 'Performance metrics', 'User feedback'],
      acceptanceCriteria: ['All critical bugs fixed', 'Performance benchmarks met', 'User testing completed'],
      riskLevel: 'medium',
      costEstimate: { min: 1500, max: 4000, currency: 'USD' },
      automationPotential: 75,
      optimizationTips: ['Automate test execution', 'Use continuous testing', 'Implement automated bug reporting']
    },
    {
      id: 'ecommerce-step-9',
      title: 'Launch & Go-Live',
      description: 'Final preparations, soft launch, and full public launch of the e-commerce store',
      type: 'deployment',
      order: 8,
      estimatedDuration: { min: 1, max: 2, unit: 'weeks' },
      requiredSkills: ['project-management', 'launch-planning', 'crisis-management'],
      requiredTools: ['launch-checklist', 'monitoring-tools', 'support-tickets'],
      dependencies: ['ecommerce-step-8'],
      deliverables: ['Launch checklist', 'Go-live plan', 'Support documentation', 'Launch announcement'],
      acceptanceCriteria: ['Store successfully launched', 'All systems operational', 'Support team ready'],
      riskLevel: 'high',
      costEstimate: { min: 1000, max: 3000, currency: 'USD' },
      automationPotential: 50,
      optimizationTips: ['Automate launch monitoring', 'Use automated rollback procedures', 'Implement automated alerts']
    }
  ],

  costAnalysis: {
    totalCost: 15000,
    currency: 'USD',
    calculationDate: new Date(),
    breakdown: [
      {
        id: createId('shopify-plus-platform', 1),
        name: 'Shopify Plus Platform',
        description: 'Shopify Plus ($2000/month) + transaction fees (2.9% + 30¢ per transaction)',
        type: 'subscription',
        amount: 24000,
        currency: 'USD',
        frequency: 'yearly',
        category: 'platform'
      },
      {
        id: createId('custom-theme-development', 1),
        name: 'Custom Theme Development',
        description: 'Professional Shopify theme development (similar to Allbirds or Warby Parker)',
        type: 'labor',
        amount: 8000,
        currency: 'USD',
        frequency: 'one-time',
        category: 'development'
      },
      {
        id: createId('payment-processing-setup', 1),
        name: 'Payment Processing Setup',
        description: 'Stripe integration, PayPal Business, Apple Pay, Google Pay setup',
        type: 'subscription',
        amount: 1200,
        currency: 'USD',
        frequency: 'yearly',
        category: 'payments'
      },
      {
        id: createId('product-photography-content', 1),
        name: 'Product Photography & Content',
        description: 'Professional product photography, lifestyle shots, product descriptions',
        type: 'labor',
        amount: 5000,
        currency: 'USD',
        frequency: 'one-time',
        category: 'content'
      },
      {
        id: createId('seo-marketing-setup', 1),
        name: 'SEO & Marketing Setup',
        description: 'SEO optimization, Google Shopping setup, Facebook Pixel, email marketing',
        type: 'labor',
        amount: 3000,
        currency: 'USD',
        frequency: 'one-time',
        category: 'marketing'
      },
      {
        id: createId('apps-integrations', 1),
        name: 'Apps & Integrations',
        description: 'Klaviyo email marketing, Yotpo reviews, ReCharge subscriptions, ShipStation',
        type: 'subscription',
        amount: 2400,
        currency: 'USD',
        frequency: 'yearly',
        category: 'tools'
      },
      {
        id: createId('legal-compliance', 1),
        name: 'Legal & Compliance',
        description: 'Privacy policy, terms of service, GDPR compliance, SSL certificates',
        type: 'one-time',
        amount: 2000,
        currency: 'USD',
        frequency: 'one-time',
        category: 'legal'
      }
    ],
    assumptions: [
      'Premium D2C brand with 100+ SKUs',
      'Shopify Plus platform for scalability',
      'Professional custom theme development',
      'High-quality product photography',
      'Comprehensive marketing and analytics setup'
    ],
    riskFactors: [
      'Platform fee increases affecting profitability',
      'Custom development delays extending timeline',
      'Payment processing issues affecting sales',
      'Competition driving up customer acquisition costs'
    ]
  },

  recommendedTools: [
    {
      id: createId('shopify', 1),
      name: 'Shopify',
      category: 'development',
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
      category: 'efficiency',
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
export const contentCreationTemplate: FlowTemplate = {
  id: 'content-creation-1',
  name: 'Content Creation Pipeline',
  description: 'Systematic approach to creating, publishing, and promoting content across multiple channels.',
  category: 'creative-projects',
  difficulty: 'beginner',
  targetAudience: 'individual',
  estimatedDuration: { min: 2, max: 8, unit: 'weeks' },
  tags: ['content-creation', 'blogging', 'social-media', 'video-production', 'copywriting'],
  thumbnail: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop',
  version: '1.0.0',
  author: 'Flow Team',
  authorName: 'Flow Team',
  lastUpdated: new Date(),
  createdAt: new Date(),
  isPublic: true,
  rating: 4.4,
  usageCount: 1800,
  isUserGenerated: false,
  status: 'approved',

  steps: [
    {
      id: 'content-step-1',
      title: 'Content Strategy & Audience Research',
      description: 'Define content goals, research target audience, and develop content strategy',
      type: 'strategy',
      order: 0,
      estimatedDuration: { min: 1, max: 2, unit: 'weeks' },
      requiredSkills: ['content-strategy', 'audience-research', 'market-analysis'],
      requiredTools: ['google-analytics', 'semrush', 'social-media-insights', 'survey-tools'],
      deliverables: ['Content strategy document', 'Audience personas', 'Content goals', 'Brand voice guidelines'],
      acceptanceCriteria: ['Strategy defined', 'Audience researched', 'Goals established'],
      riskLevel: 'low',
      costEstimate: { min: 500, max: 2000, currency: 'USD' },
      automationPotential: 60,
      optimizationTips: ['Use AI for audience insights', 'Automate competitor analysis', 'Implement content research tools']
    },
    {
      id: 'content-step-2',
      title: 'Content Planning & Calendar Creation',
      description: 'Create content calendar, plan content themes, and establish publishing schedule',
      type: 'planning',
      order: 1,
      estimatedDuration: { min: 1, max: 2, unit: 'weeks' },
      requiredSkills: ['content-planning', 'calendar-management', 'editorial-planning'],
      requiredTools: ['trello', 'asana', 'google-calendar', 'content-calendar-tools'],
      dependencies: ['content-step-1'],
      deliverables: ['Content calendar', 'Editorial plan', 'Publishing schedule', 'Content themes'],
      acceptanceCriteria: ['Calendar created', 'Schedule established', 'Themes defined'],
      riskLevel: 'low',
      costEstimate: { min: 300, max: 1000, currency: 'USD' },
      automationPotential: 80,
      optimizationTips: ['Use automated calendar tools', 'Implement content scheduling', 'Automate workflow management']
    },
    {
      id: 'content-step-3',
      title: 'Content Research & Topic Development',
      description: 'Research trending topics, keywords, and develop content ideas',
      type: 'research',
      order: 2,
      estimatedDuration: { min: 1, max: 2, unit: 'weeks' },
      requiredSkills: ['keyword-research', 'topic-research', 'trend-analysis'],
      requiredTools: ['google-trends', 'semrush', 'ubersuggest', 'buzzsumo'],
      dependencies: ['content-step-2'],
      deliverables: ['Keyword list', 'Topic ideas', 'Trending topics', 'Content briefs'],
      acceptanceCriteria: ['Keywords identified', 'Topics developed', 'Briefs created'],
      riskLevel: 'low',
      costEstimate: { min: 200, max: 800, currency: 'USD' },
      automationPotential: 85,
      optimizationTips: ['Use AI keyword tools', 'Automate trend monitoring', 'Implement topic generation']
    },
    {
      id: 'content-step-4',
      title: 'Content Creation & Writing',
      description: 'Write, create, and develop all content pieces according to the plan',
      type: 'creation',
      order: 3,
      estimatedDuration: { min: 2, max: 4, unit: 'weeks' },
      requiredSkills: ['copywriting', 'content-creation', 'creative-writing'],
      requiredTools: ['google-docs', 'grammarly', 'hemingway-editor', 'copy-ai'],
      dependencies: ['content-step-3'],
      deliverables: ['Blog posts', 'Social media content', 'Email newsletters', 'Website copy'],
      acceptanceCriteria: ['Content written', 'Quality standards met', 'SEO optimized'],
      riskLevel: 'medium',
      costEstimate: { min: 1000, max: 4000, currency: 'USD' },
      automationPotential: 70,
      optimizationTips: ['Use AI writing tools', 'Implement content templates', 'Automate quality checks']
    },
    {
      id: 'content-step-5',
      title: 'Visual Design & Asset Creation',
      description: 'Create visual assets, graphics, and design elements for content',
      type: 'design',
      order: 4,
      estimatedDuration: { min: 1, max: 3, unit: 'weeks' },
      requiredSkills: ['graphic-design', 'visual-design', 'brand-design'],
      requiredTools: ['canva', 'adobe-creative-suite', 'figma', 'unsplash'],
      dependencies: ['content-step-4'],
      deliverables: ['Social media graphics', 'Infographics', 'Blog images', 'Brand assets'],
      acceptanceCriteria: ['Visuals created', 'Brand consistent', 'Platform optimized'],
      riskLevel: 'medium',
      costEstimate: { min: 800, max: 3000, currency: 'USD' },
      automationPotential: 60,
      optimizationTips: ['Use design templates', 'Implement brand guidelines', 'Automate image optimization']
    },
    {
      id: 'content-step-6',
      title: 'Video & Multimedia Production',
      description: 'Create video content, podcasts, and multimedia assets',
      type: 'production',
      order: 5,
      estimatedDuration: { min: 2, max: 4, unit: 'weeks' },
      requiredSkills: ['video-production', 'audio-editing', 'multimedia-creation'],
      requiredTools: ['capcut', 'premiere-pro', 'audacity', 'canva-video'],
      dependencies: ['content-step-5'],
      deliverables: ['Video content', 'Podcast episodes', 'Live streams', 'Tutorial videos'],
      acceptanceCriteria: ['Videos produced', 'Audio quality good', 'Content engaging'],
      riskLevel: 'medium',
      costEstimate: { min: 1200, max: 5000, currency: 'USD' },
      automationPotential: 50,
      optimizationTips: ['Use video templates', 'Implement automated editing', 'Optimize for platforms']
    },
    {
      id: 'content-step-7',
      title: 'Content Optimization & SEO',
      description: 'Optimize content for search engines, readability, and engagement',
      type: 'optimization',
      order: 6,
      estimatedDuration: { min: 1, max: 2, unit: 'weeks' },
      requiredSkills: ['seo', 'content-optimization', 'analytics'],
      requiredTools: ['yoast-seo', 'semrush', 'google-analytics', 'readability-tools'],
      dependencies: ['content-step-6'],
      deliverables: ['SEO optimized content', 'Meta descriptions', 'Internal linking', 'Performance tracking'],
      acceptanceCriteria: ['SEO implemented', 'Content optimized', 'Tracking setup'],
      riskLevel: 'low',
      costEstimate: { min: 400, max: 1500, currency: 'USD' },
      automationPotential: 90,
      optimizationTips: ['Use automated SEO tools', 'Implement content scoring', 'Automate optimization suggestions']
    },
    {
      id: 'content-step-8',
      title: 'Content Publishing & Distribution',
      description: 'Publish content across all platforms and distribute through various channels',
      type: 'publishing',
      order: 7,
      estimatedDuration: { min: 1, max: 2, unit: 'weeks' },
      requiredSkills: ['content-publishing', 'platform-management', 'distribution'],
      requiredTools: ['wordpress', 'social-media-platforms', 'email-marketing', 'buffer'],
      dependencies: ['content-step-7'],
      deliverables: ['Published content', 'Social media posts', 'Email campaigns', 'Distribution reports'],
      acceptanceCriteria: ['Content published', 'Distribution complete', 'Engagement tracking'],
      riskLevel: 'low',
      costEstimate: { min: 300, max: 1000, currency: 'USD' },
      automationPotential: 95,
      optimizationTips: ['Use automated publishing', 'Implement cross-platform posting', 'Automate distribution']
    },
    {
      id: 'content-step-9',
      title: 'Performance Analysis & Optimization',
      description: 'Analyze content performance, gather insights, and optimize future content',
      type: 'analysis',
      order: 8,
      estimatedDuration: { min: 1, max: 2, unit: 'weeks' },
      requiredSkills: ['data-analysis', 'performance-tracking', 'content-analytics'],
      requiredTools: ['google-analytics', 'social-media-analytics', 'email-analytics', 'reporting-tools'],
      dependencies: ['content-step-8'],
      deliverables: ['Performance reports', 'Engagement metrics', 'ROI analysis', 'Optimization recommendations'],
      acceptanceCriteria: ['Performance analyzed', 'Insights gathered', 'Recommendations provided'],
      riskLevel: 'low',
      costEstimate: { min: 200, max: 800, currency: 'USD' },
      automationPotential: 95,
      optimizationTips: ['Use automated reporting', 'Implement predictive analytics', 'Automate optimization decisions']
    }
  ],

  costAnalysis: {
    totalCost: 8500,
    currency: 'USD',
    calculationDate: new Date(),
    breakdown: [
      {
        id: createId('content-creator', 1),
        name: 'Content Creator (Freelance)',
        description: 'Professional content creator at $75/hour for 40 hours (blog posts, social media, videos)',
        type: 'labor',
        amount: 3000,
        currency: 'USD',
        frequency: 'one-time',
        category: 'content'
      },
      {
        id: createId('graphic-designer', 1),
        name: 'Graphic Designer',
        description: 'Professional designer for infographics, social media graphics, brand assets',
        type: 'labor',
        amount: 2000,
        currency: 'USD',
        frequency: 'one-time',
        category: 'design'
      },
      {
        id: createId('video-production', 1),
        name: 'Video Production',
        description: 'Professional video editing, motion graphics, YouTube optimization',
        type: 'labor',
        amount: 2500,
        currency: 'USD',
        frequency: 'one-time',
        category: 'video'
      },
      {
        id: createId('content-management-tools', 1),
        name: 'Content Management Tools',
        description: 'Notion Pro, Canva Pro, Adobe Creative Suite, Buffer, Hootsuite',
        type: 'licensing',
        amount: 1200,
        currency: 'USD',
        frequency: 'yearly',
        category: 'tools'
      },
      {
        id: createId('paid-promotion', 1),
        name: 'Paid Promotion',
        description: 'Facebook/Instagram ads, Pinterest promoted pins, YouTube ads',
        type: 'variable',
        amount: 1500,
        currency: 'USD',
        frequency: 'one-time',
        category: 'marketing'
      },
      {
        id: createId('analytics-seo-tools', 1),
        name: 'Analytics & SEO Tools',
        description: 'SEMrush, Ahrefs, Google Analytics Premium, Hotjar',
        type: 'licensing',
        amount: 800,
        currency: 'USD',
        frequency: 'yearly',
        category: 'analytics'
      }
    ],
    assumptions: [
      'Professional content marketing campaign for SaaS company',
      'Multi-format content (blog, video, social media, infographics)',
      '3-month content creation and distribution campaign',
      'Target audience of 50,000+ potential customers',
      'Professional tools and paid promotion'
    ],
    riskFactors: [
      'Content performance below expectations affecting ROI',
      'Platform algorithm changes reducing organic reach',
      'Competition for audience attention increasing costs',
      'Content creation delays affecting campaign timeline'
    ]
  },

  recommendedTools: [
    {
      id: createId('canva', 1),
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
      category: 'business',
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
export const customerSupportTemplate: FlowTemplate = {
  id: 'customer-support-1',
  name: 'Customer Support System',
  description: 'Complete customer support workflow from ticket creation to resolution and follow-up.',
  category: 'customer-service',
  difficulty: 'beginner',
  targetAudience: 'small-team',
  estimatedDuration: { min: 2, max: 6, unit: 'weeks' },
  tags: ['customer-support', 'help-desk', 'ticketing-system', 'customer-service', 'automation'],
  thumbnail: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop',
  version: '1.0.0',
  author: 'Flow Team',
  authorName: 'Flow Team',
  lastUpdated: new Date(),
  createdAt: new Date(),
  isPublic: true,
  rating: 4.3,
  usageCount: 950,
  isUserGenerated: false,
  status: 'approved',

  steps: [
    {
      id: 'support-step-1',
      title: 'Support Strategy & Team Planning',
      description: 'Define support strategy, team structure, and service level agreements',
      type: 'strategy',
      order: 0,
      estimatedDuration: { min: 1, max: 2, unit: 'weeks' },
      requiredSkills: ['customer-service-strategy', 'team-planning', 'sla-definition'],
      requiredTools: ['google-docs', 'slack', 'project-management-tools'],
      deliverables: ['Support strategy document', 'Team structure', 'SLA definitions', 'Service standards'],
      acceptanceCriteria: ['Strategy defined', 'Team structure planned', 'SLAs established'],
      riskLevel: 'low',
      costEstimate: { min: 500, max: 2000, currency: 'USD' },
      automationPotential: 40,
      optimizationTips: ['Use AI for strategy planning', 'Automate SLA monitoring', 'Implement goal tracking']
    },
    {
      id: 'support-step-2',
      title: 'Platform Selection & Evaluation',
      description: 'Research and select the best customer support platform for your needs',
      type: 'research',
      order: 1,
      estimatedDuration: { min: 1, max: 2, unit: 'weeks' },
      requiredSkills: ['platform-evaluation', 'comparative-analysis', 'requirements-gathering'],
      requiredTools: ['g2-crowd', 'capterra', 'software-review-sites', 'demo-platforms'],
      dependencies: ['support-step-1'],
      deliverables: ['Platform evaluation report', 'Feature comparison', 'Recommendation', 'Implementation plan'],
      acceptanceCriteria: ['Platform selected', 'Features evaluated', 'Plan approved'],
      riskLevel: 'low',
      costEstimate: { min: 300, max: 1000, currency: 'USD' },
      automationPotential: 60,
      optimizationTips: ['Use automated comparison tools', 'Implement feature tracking', 'Automate evaluation process']
    },
    {
      id: 'support-step-3',
      title: 'System Setup & Configuration',
      description: 'Set up the chosen support platform, configure workflows, and integrate systems',
      type: 'setup',
      order: 2,
      estimatedDuration: { min: 1, max: 3, unit: 'weeks' },
      requiredSkills: ['system-administration', 'workflow-design', 'integration'],
      requiredTools: ['zendesk', 'intercom', 'freshdesk', 'api-tools'],
      dependencies: ['support-step-2'],
      deliverables: ['Platform setup', 'Workflow configuration', 'System integrations', 'Automation rules'],
      acceptanceCriteria: ['Platform configured', 'Workflows active', 'Integrations working'],
      riskLevel: 'medium',
      costEstimate: { min: 1000, max: 5000, currency: 'USD' },
      automationPotential: 85,
      optimizationTips: ['Use automated setup tools', 'Implement workflow templates', 'Automate integration testing']
    },
    {
      id: 'support-step-4',
      title: 'Knowledge Base Development',
      description: 'Create comprehensive knowledge base, FAQs, and self-service resources',
      type: 'content',
      order: 3,
      estimatedDuration: { min: 2, max: 4, unit: 'weeks' },
      requiredSkills: ['technical-writing', 'content-creation', 'user-experience'],
      requiredTools: ['knowledge-base-platform', 'documentation-tools', 'screenshot-software'],
      dependencies: ['support-step-3'],
      deliverables: ['Knowledge base', 'FAQ section', 'Video tutorials', 'Troubleshooting guides'],
      acceptanceCriteria: ['Knowledge base complete', 'Content reviewed', 'Search functionality working'],
      riskLevel: 'medium',
      costEstimate: { min: 2000, max: 6000, currency: 'USD' },
      automationPotential: 70,
      optimizationTips: ['Use AI content generation', 'Implement automated updates', 'Use analytics for optimization']
    },
    {
      id: 'support-step-5',
      title: 'Team Training & Onboarding',
      description: 'Train support team on platform usage, processes, and customer service best practices',
      type: 'training',
      order: 4,
      estimatedDuration: { min: 1, max: 2, unit: 'weeks' },
      requiredSkills: ['training-development', 'customer-service', 'process-documentation'],
      requiredTools: ['training-platforms', 'video-creation-tools', 'assessment-software'],
      dependencies: ['support-step-4'],
      deliverables: ['Training materials', 'Process documentation', 'Team certification', 'Performance standards'],
      acceptanceCriteria: ['Team trained', 'Processes documented', 'Standards established'],
      riskLevel: 'low',
      costEstimate: { min: 1500, max: 4000, currency: 'USD' },
      automationPotential: 75,
      optimizationTips: ['Use automated training platforms', 'Implement skill assessments', 'Automate certification tracking']
    },
    {
      id: 'support-step-6',
      title: 'Automation & Self-Service Setup',
      description: 'Implement chatbots, automated responses, and self-service options',
      type: 'automation',
      order: 5,
      estimatedDuration: { min: 1, max: 3, unit: 'weeks' },
      requiredSkills: ['chatbot-development', 'automation-design', 'ai-integration'],
      requiredTools: ['chatbot-platforms', 'ai-tools', 'automation-software'],
      dependencies: ['support-step-5'],
      deliverables: ['Chatbot implementation', 'Automated responses', 'Self-service portal', 'Escalation rules'],
      acceptanceCriteria: ['Chatbot active', 'Automation working', 'Self-service functional'],
      riskLevel: 'medium',
      costEstimate: { min: 1000, max: 4000, currency: 'USD' },
      automationPotential: 95,
      optimizationTips: ['Use AI-powered chatbots', 'Implement machine learning', 'Automate response optimization']
    },
    {
      id: 'support-step-7',
      title: 'Quality Assurance & Monitoring',
      description: 'Set up quality monitoring, performance tracking, and customer satisfaction measurement',
      type: 'monitoring',
      order: 6,
      estimatedDuration: { min: 1, max: 2, unit: 'weeks' },
      requiredSkills: ['quality-assurance', 'performance-monitoring', 'data-analysis'],
      requiredTools: ['quality-monitoring-tools', 'analytics-platforms', 'survey-software'],
      dependencies: ['support-step-6'],
      deliverables: ['Quality metrics', 'Performance dashboards', 'Customer surveys', 'Feedback system'],
      acceptanceCriteria: ['Metrics defined', 'Dashboards active', 'Feedback system working'],
      riskLevel: 'low',
      costEstimate: { min: 800, max: 2500, currency: 'USD' },
      automationPotential: 90,
      optimizationTips: ['Use automated quality scoring', 'Implement real-time monitoring', 'Automate feedback collection']
    },
    {
      id: 'support-step-8',
      title: 'Launch & Go-Live',
      description: 'Launch the support system, monitor performance, and handle initial customer interactions',
      type: 'launch',
      order: 7,
      estimatedDuration: { min: 1, max: 2, unit: 'weeks' },
      requiredSkills: ['launch-management', 'crisis-management', 'performance-monitoring'],
      requiredTools: ['monitoring-tools', 'communication-platforms', 'escalation-systems'],
      dependencies: ['support-step-7'],
      deliverables: ['System launch', 'Performance monitoring', 'Issue resolution', 'Customer communication'],
      acceptanceCriteria: ['System live', 'Performance stable', 'Issues resolved'],
      riskLevel: 'high',
      costEstimate: { min: 500, max: 2000, currency: 'USD' },
      automationPotential: 60,
      optimizationTips: ['Use automated monitoring', 'Implement alert systems', 'Automate issue escalation']
    },
    {
      id: 'support-step-9',
      title: 'Continuous Improvement & Optimization',
      description: 'Analyze performance data, gather feedback, and continuously improve the support system',
      type: 'optimization',
      order: 8,
      estimatedDuration: { min: 1, max: 2, unit: 'weeks' },
      requiredSkills: ['data-analysis', 'process-improvement', 'change-management'],
      requiredTools: ['analytics-tools', 'feedback-platforms', 'improvement-tracking'],
      dependencies: ['support-step-8'],
      deliverables: ['Performance analysis', 'Improvement recommendations', 'Process updates', 'Success metrics'],
      acceptanceCriteria: ['Analysis complete', 'Recommendations implemented', 'Metrics improved'],
      riskLevel: 'low',
      costEstimate: { min: 400, max: 1500, currency: 'USD' },
      automationPotential: 85,
      optimizationTips: ['Use automated analysis', 'Implement predictive analytics', 'Automate improvement suggestions']
    }
  ],

  costAnalysis: {
    totalCost: 12000,
    currency: 'USD',
    calculationDate: new Date(),
    breakdown: [
      {
        id: createId('zendesk-support-suite', 1),
        name: 'Zendesk Support Suite',
        description: 'Zendesk Support ($49/agent/month) for 3 agents + knowledge base + live chat',
        type: 'subscription',
        amount: 1764,
        currency: 'USD',
        frequency: 'yearly',
        category: 'software'
      },
      {
        id: createId('support-team-training', 1),
        name: 'Support Team Training',
        description: '3 support agents training, onboarding, and process documentation',
        type: 'labor',
        amount: 4500,
        currency: 'USD',
        frequency: 'one-time',
        category: 'personnel'
      },
      {
        id: createId('knowledge-base-development', 1),
        name: 'Knowledge Base Development',
        description: 'Professional documentation, FAQs, video tutorials, troubleshooting guides',
        type: 'labor',
        amount: 3000,
        currency: 'USD',
        frequency: 'one-time',
        category: 'content'
      },
      {
        id: createId('chatbot-implementation', 1),
        name: 'Chatbot Implementation',
        description: 'Intercom chatbot setup, training, and integration with support system',
        type: 'subscription',
        amount: 1200,
        currency: 'USD',
        frequency: 'yearly',
        category: 'automation'
      },
      {
        id: createId('quality-monitoring-tools', 1),
        name: 'Quality Monitoring Tools',
        description: 'Call recording, quality assurance software, customer satisfaction surveys',
        type: 'subscription',
        amount: 800,
        currency: 'USD',
        frequency: 'yearly',
        category: 'analytics'
      },
      {
        id: createId('integration-setup', 1),
        name: 'Integration & Setup',
        description: 'CRM integration, email setup, phone system configuration',
        type: 'labor',
        amount: 1500,
        currency: 'USD',
        frequency: 'one-time',
        category: 'integration'
      }
    ],
    assumptions: [
      'SaaS company with 10,000+ customers',
      '3 support agents handling 500+ tickets/month',
      'Multi-channel support (email, chat, phone)',
      'Professional knowledge base and automation',
      'Quality monitoring and analytics'
    ],
    riskFactors: [
      'High ticket volume overwhelming support team',
      'Customer satisfaction scores below targets',
      'Integration issues causing support delays',
      'Staff turnover requiring retraining costs'
    ]
  },

  recommendedTools: [
    {
      id: createId('zendesk', 1),
      name: 'Zendesk',
      category: 'communication',
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
      category: 'business',
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
      type: 'select',
      defaultValue: ['email', 'chat'],
      options: ['email', 'chat', 'phone', 'social-media'],
      required: true
    }
  ]
};

// HR Recruitment Template
export const hrRecruitmentTemplate: FlowTemplate = {
  id: 'hr-recruitment-1',
  name: 'HR Recruitment Process',
  description: 'Complete recruitment workflow from job posting to employee onboarding.',
  category: 'human-resources',
  difficulty: 'intermediate',
  targetAudience: 'small-team',
  estimatedDuration: { min: 4, max: 12, unit: 'weeks' },
  tags: ['recruitment', 'hiring', 'onboarding', 'hr-processes', 'talent-acquisition'],
  thumbnail: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=400&h=300&fit=crop',
  version: '1.0.0',
  author: 'Flow Team',
  authorName: 'Flow Team',
  lastUpdated: new Date(),
  createdAt: new Date(),
  isPublic: true,
  rating: 4.6,
  usageCount: 1100,
  isUserGenerated: false,
  status: 'approved',

  steps: [
    {
      id: 'hr-step-1',
      title: 'Recruitment Strategy & Planning',
      description: 'Define recruitment strategy, hiring plan, and resource allocation',
      type: 'strategy',
      order: 0,
      estimatedDuration: { min: 1, max: 2, unit: 'weeks' },
      requiredSkills: ['recruitment-strategy', 'workforce-planning', 'budget-planning'],
      requiredTools: ['google-docs', 'excel', 'project-management-tools'],
      deliverables: ['Recruitment strategy', 'Hiring plan', 'Budget allocation', 'Timeline'],
      acceptanceCriteria: ['Strategy defined', 'Plan approved', 'Budget allocated'],
      riskLevel: 'low',
      costEstimate: { min: 500, max: 2000, currency: 'USD' },
      automationPotential: 50,
      optimizationTips: ['Use AI for workforce planning', 'Automate budget tracking', 'Implement goal monitoring']
    },
    {
      id: 'hr-step-2',
      title: 'Job Analysis & Requirements Definition',
      description: 'Analyze job requirements, create detailed job descriptions, and define success criteria',
      type: 'analysis',
      order: 1,
      estimatedDuration: { min: 1, max: 2, unit: 'weeks' },
      requiredSkills: ['job-analysis', 'requirements-gathering', 'competency-mapping'],
      requiredTools: ['google-docs', 'job-analysis-tools', 'competency-frameworks'],
      dependencies: ['hr-step-1'],
      deliverables: ['Job analysis', 'Job description', 'Requirements list', 'Success criteria'],
      acceptanceCriteria: ['Requirements clear', 'Description approved', 'Criteria defined'],
      riskLevel: 'low',
      costEstimate: { min: 500, max: 2000, currency: 'USD' },
      automationPotential: 70,
      optimizationTips: ['Use AI job analysis tools', 'Automate requirements gathering', 'Implement template libraries']
    },
    {
      id: 'hr-step-3',
      title: 'Sourcing Strategy & Channel Selection',
      description: 'Develop sourcing strategy, select recruitment channels, and set up job postings',
      type: 'sourcing',
      order: 2,
      estimatedDuration: { min: 1, max: 2, unit: 'weeks' },
      requiredSkills: ['sourcing-strategy', 'channel-selection', 'job-posting'],
      requiredTools: ['linkedin-recruiter', 'indeed', 'glassdoor', 'job-boards'],
      dependencies: ['hr-step-2'],
      deliverables: ['Sourcing strategy', 'Channel selection', 'Job postings', 'Sourcing pipeline'],
      acceptanceCriteria: ['Strategy defined', 'Channels selected', 'Postings live'],
      riskLevel: 'low',
      costEstimate: { min: 800, max: 3000, currency: 'USD' },
      automationPotential: 80,
      optimizationTips: ['Use automated sourcing tools', 'Implement multi-channel posting', 'Automate candidate sourcing']
    },
    {
      id: 'hr-step-4',
      title: 'Candidate Sourcing & Initial Screening',
      description: 'Source candidates, conduct initial screening, and build candidate pipeline',
      type: 'sourcing',
      order: 3,
      estimatedDuration: { min: 2, max: 4, unit: 'weeks' },
      requiredSkills: ['candidate-sourcing', 'screening', 'pipeline-management'],
      requiredTools: ['ats-system', 'sourcing-tools', 'screening-software'],
      dependencies: ['hr-step-3'],
      deliverables: ['Candidate pipeline', 'Screening results', 'Qualified candidates', 'Rejection communications'],
      acceptanceCriteria: ['Pipeline built', 'Candidates screened', 'Communications sent'],
      riskLevel: 'medium',
      costEstimate: { min: 1000, max: 4000, currency: 'USD' },
      automationPotential: 85,
      optimizationTips: ['Use AI screening tools', 'Automate candidate communications', 'Implement scoring systems']
    },
    {
      id: 'hr-step-5',
      title: 'Assessment & Technical Evaluation',
      description: 'Conduct technical assessments, skills testing, and candidate evaluation',
      type: 'assessment',
      order: 4,
      estimatedDuration: { min: 1, max: 3, unit: 'weeks' },
      requiredSkills: ['assessment-design', 'technical-evaluation', 'skills-testing'],
      requiredTools: ['hackerrank', 'codility', 'assessment-platforms', 'video-interviewing'],
      dependencies: ['hr-step-4'],
      deliverables: ['Assessment results', 'Technical evaluations', 'Skills reports', 'Candidate rankings'],
      acceptanceCriteria: ['Assessments completed', 'Evaluations done', 'Rankings established'],
      riskLevel: 'medium',
      costEstimate: { min: 800, max: 3000, currency: 'USD' },
      automationPotential: 90,
      optimizationTips: ['Use automated assessment platforms', 'Implement AI evaluation', 'Automate scoring systems']
    },
    {
      id: 'hr-step-6',
      title: 'Interview Process & Coordination',
      description: 'Conduct interviews, coordinate schedules, and evaluate candidates',
      type: 'interviewing',
      order: 5,
      estimatedDuration: { min: 2, max: 4, unit: 'weeks' },
      requiredSkills: ['interviewing', 'coordination', 'evaluation'],
      requiredTools: ['zoom', 'calendly', 'interview-platforms', 'evaluation-forms'],
      dependencies: ['hr-step-5'],
      deliverables: ['Interview schedules', 'Interview feedback', 'Candidate evaluations', 'Decision recommendations'],
      acceptanceCriteria: ['Interviews completed', 'Feedback collected', 'Decisions made'],
      riskLevel: 'medium',
      costEstimate: { min: 1200, max: 5000, currency: 'USD' },
      automationPotential: 75,
      optimizationTips: ['Use automated scheduling', 'Implement structured interviews', 'Automate feedback collection']
    },
    {
      id: 'hr-step-7',
      title: 'Background Checks & Reference Verification',
      description: 'Conduct background checks, verify references, and complete due diligence',
      type: 'verification',
      order: 6,
      estimatedDuration: { min: 1, max: 2, unit: 'weeks' },
      requiredSkills: ['background-checks', 'reference-verification', 'compliance'],
      requiredTools: ['hireright', 'checkr', 'reference-checking-tools'],
      dependencies: ['hr-step-6'],
      deliverables: ['Background check reports', 'Reference verifications', 'Compliance documentation', 'Clearance reports'],
      acceptanceCriteria: ['Checks completed', 'References verified', 'Compliance met'],
      riskLevel: 'low',
      costEstimate: { min: 500, max: 2000, currency: 'USD' },
      automationPotential: 95,
      optimizationTips: ['Use automated background check platforms', 'Implement digital verification', 'Automate compliance tracking']
    },
    {
      id: 'hr-step-8',
      title: 'Offer Management & Negotiation',
      description: 'Prepare and present job offers, handle negotiations, and finalize agreements',
      type: 'offer',
      order: 7,
      estimatedDuration: { min: 1, max: 2, unit: 'weeks' },
      requiredSkills: ['offer-management', 'negotiation', 'contract-management'],
      requiredTools: ['offer-management-platforms', 'contract-templates', 'compensation-tools'],
      dependencies: ['hr-step-7'],
      deliverables: ['Job offers', 'Negotiation outcomes', 'Employment contracts', 'Compensation packages'],
      acceptanceCriteria: ['Offers presented', 'Negotiations complete', 'Contracts signed'],
      riskLevel: 'high',
      costEstimate: { min: 800, max: 3000, currency: 'USD' },
      automationPotential: 60,
      optimizationTips: ['Use automated offer platforms', 'Implement compensation benchmarking', 'Automate contract generation']
    },
    {
      id: 'hr-step-9',
      title: 'Onboarding & Integration',
      description: 'Plan and execute comprehensive onboarding process for new hires',
      type: 'onboarding',
      order: 8,
      estimatedDuration: { min: 2, max: 4, unit: 'weeks' },
      requiredSkills: ['onboarding-design', 'integration-planning', 'employee-engagement'],
      requiredTools: ['onboarding-platforms', 'training-software', 'communication-tools'],
      dependencies: ['hr-step-8'],
      deliverables: ['Onboarding plan', 'Training materials', 'Integration activities', 'Success metrics'],
      acceptanceCriteria: ['Onboarding complete', 'Employee integrated', 'Success measured'],
      riskLevel: 'medium',
      costEstimate: { min: 1000, max: 4000, currency: 'USD' },
      automationPotential: 80,
      optimizationTips: ['Use automated onboarding platforms', 'Implement digital training', 'Automate progress tracking']
    }
  ],

  costAnalysis: {
    totalCost: 15000,
    currency: 'USD',
    calculationDate: new Date(),
    breakdown: [
      {
        id: createId('linkedin-recruiter', 1),
        name: 'LinkedIn Recruiter',
        description: 'LinkedIn Recruiter ($99/month) + job postings ($395 per posting)',
        type: 'subscription',
        amount: 1588,
        currency: 'USD',
        frequency: 'yearly',
        category: 'advertising'
      },
      {
        id: createId('greenhouse-ats', 1),
        name: 'Greenhouse ATS',
        description: 'Greenhouse ATS ($95/user/month) for 2 recruiters + job board integrations',
        type: 'subscription',
        amount: 2280,
        currency: 'USD',
        frequency: 'yearly',
        category: 'software'
      },
      {
        id: createId('hr-team-time', 1),
        name: 'HR Team Time',
        description: '2 recruiters ($75/hour) working 40 hours each on recruitment process',
        type: 'labor',
        amount: 6000,
        currency: 'USD',
        frequency: 'one-time',
        category: 'personnel'
      },
      {
        id: createId('background-checks-assessments', 1),
        name: 'Background Checks & Assessments',
        description: 'HireRight background checks ($50/candidate) + HackerRank assessments ($25/candidate)',
        type: 'one-time',
        amount: 1500,
        currency: 'USD',
        frequency: 'one-time',
        category: 'verification'
      },
      {
        id: createId('recruitment-marketing', 1),
        name: 'Recruitment Marketing',
        description: 'Career page development, employer branding, social media recruitment',
        type: 'labor',
        amount: 2500,
        currency: 'USD',
        frequency: 'one-time',
        category: 'marketing'
      },
      {
        id: createId('interview-coordination', 1),
        name: 'Interview Coordination',
        description: 'Video interview platform (Zoom Pro), scheduling tools, candidate experience',
        type: 'subscription',
        amount: 600,
        currency: 'USD',
        frequency: 'yearly',
        category: 'tools'
      },
      {
        id: createId('onboarding-setup', 1),
        name: 'Onboarding Setup',
        description: 'BambooHR onboarding ($6.19/employee/month) + welcome kit preparation',
        type: 'subscription',
        amount: 500,
        currency: 'USD',
        frequency: 'yearly',
        category: 'onboarding'
      }
    ],
    assumptions: [
      'Tech company hiring 10-15 positions annually',
      '2 full-time recruiters managing the process',
      'Professional ATS and recruitment tools',
      'Comprehensive background checks and assessments',
      'Employer branding and candidate experience focus'
    ],
    riskFactors: [
      'Talent shortage driving up recruitment costs',
      'High candidate drop-off rates affecting efficiency',
      'Competition for top talent increasing time-to-hire',
      'Background check delays affecting start dates'
    ]
  },

  recommendedTools: [
    {
      id: createId('bamboohr', 1),
      name: 'BambooHR',
      category: 'project-management',
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
      category: 'legal',
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
export const financialPlanningTemplate: FlowTemplate = {
  id: 'financial-planning-1',
  name: 'Financial Planning Process',
  description: 'Comprehensive financial planning workflow for individuals and businesses.',
  category: 'finance',
  difficulty: 'advanced',
  targetAudience: 'individual',
  estimatedDuration: { min: 4, max: 12, unit: 'weeks' },
  tags: ['financial-planning', 'budgeting', 'investment', 'tax-planning', 'risk-management'],
  thumbnail: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=300&fit=crop',
  version: '1.0.0',
  author: 'Flow Team',
  authorName: 'Flow Team',
  lastUpdated: new Date(),
  createdAt: new Date(),
  isPublic: true,
  rating: 4.7,
  usageCount: 750,
  isUserGenerated: false,
  status: 'approved',

  steps: [
    {
      id: 'financial-assessment',
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
    totalCost: 35000,
    currency: 'USD',
    calculationDate: new Date(),
    breakdown: [
      {
        id: createId('certified-financial-planner', 1),
        name: 'Certified Financial Planner',
        description: 'CFP professional at $200/hour for comprehensive financial planning (40 hours)',
        type: 'labor',
        amount: 8000,
        currency: 'USD',
        frequency: 'one-time',
        category: 'professional'
      },
      {
        id: createId('investment-management', 1),
        name: 'Investment Management',
        description: 'Vanguard Personal Advisor Services (0.30% AUM) for $500,000 portfolio',
        type: 'subscription',
        amount: 1500,
        currency: 'USD',
        frequency: 'yearly',
        category: 'investment'
      },
      {
        id: createId('tax-planning-preparation', 1),
        name: 'Tax Planning & Preparation',
        description: 'CPA services for tax planning, preparation, and optimization strategies',
        type: 'labor',
        amount: 5000,
        currency: 'USD',
        frequency: 'yearly',
        category: 'professional'
      },
      {
        id: createId('estate-planning-attorney', 1),
        name: 'Estate Planning Attorney',
        description: 'Estate planning, wills, trusts, and legal documentation',
        type: 'labor',
        amount: 8000,
        currency: 'USD',
        frequency: 'one-time',
        category: 'legal'
      },
      {
        id: createId('insurance-policies', 1),
        name: 'Insurance Policies',
        description: 'Life insurance ($500,000 term policy), disability insurance, umbrella policy',
        type: 'subscription',
        amount: 3000,
        currency: 'USD',
        frequency: 'yearly',
        category: 'protection'
      },
      {
        id: createId('financial-planning-software', 1),
        name: 'Financial Planning Software',
        description: 'eMoney Advisor, RightCapital, or similar comprehensive planning platform',
        type: 'subscription',
        amount: 1200,
        currency: 'USD',
        frequency: 'yearly',
        category: 'software'
      },
      {
        id: createId('ongoing-advisory-services', 1),
        name: 'Ongoing Advisory Services',
        description: 'Quarterly reviews, portfolio rebalancing, strategy adjustments',
        type: 'labor',
        amount: 4000,
        currency: 'USD',
        frequency: 'yearly',
        category: 'ongoing'
      }
    ],
    assumptions: [
      'High-net-worth individual with $500,000+ investable assets',
      'Comprehensive financial planning including retirement, estate, and tax',
      'Professional CFP and CPA services',
      'Diversified investment portfolio with professional management',
      'Ongoing advisory relationship with quarterly reviews'
    ],
    riskFactors: [
      'Market volatility affecting investment returns and planning',
      'Tax law changes requiring strategy adjustments',
      'Life events (marriage, children, career changes) affecting plans',
      'Inflation and economic changes impacting long-term projections'
    ]
  },

  recommendedTools: [
    {
      id: createId('mint', 1),
      name: 'Mint',
      category: 'analytics',
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
export const researchProjectTemplate: FlowTemplate = {
  id: 'research-project-1',
  name: 'Research Project Management',
  description: 'Systematic approach to conducting research projects from hypothesis to publication.',
  category: 'research-development',
  difficulty: 'expert',
  targetAudience: 'enterprise',
  estimatedDuration: { min: 6, max: 24, unit: 'months' },
  tags: ['research', 'academic', 'data-analysis', 'publication', 'methodology'],
  thumbnail: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400&h=300&fit=crop',
  version: '1.0.0',
  author: 'Flow Team',
  authorName: 'Flow Team',
  lastUpdated: new Date(),
  createdAt: new Date(),
  isPublic: true,
  rating: 4.8,
  usageCount: 450,
  isUserGenerated: false,
  status: 'approved',

  steps: [
    {
      id: 'research-design-methodology',
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
      costEstimate: { min: 2000, max: 5000, currency: 'USD' },
      automationPotential: 50
    }
  ],

  costAnalysis: {
    totalCost: 45000,
    currency: 'USD',
    calculationDate: new Date(),
    breakdown: [
      {
        id: createId('principal-investigator', 1),
        name: 'Principal Investigator',
        description: 'PhD researcher at $150/hour for 100 hours (research design, analysis, writing)',
        type: 'labor',
        amount: 15000,
        currency: 'USD',
        frequency: 'one-time',
        category: 'personnel'
      },
      {
        id: createId('research-assistants', 1),
        name: 'Research Assistants',
        description: '2 graduate students at $25/hour for 200 hours each (data collection, coding)',
        type: 'labor',
        amount: 10000,
        currency: 'USD',
        frequency: 'one-time',
        category: 'personnel'
      },
      {
        id: createId('statistical-software-tools', 1),
        name: 'Statistical Software & Tools',
        description: 'SPSS ($99/month), Qualtrics ($500/year), NVivo ($1,200/year)',
        type: 'subscription',
        amount: 2400,
        currency: 'USD',
        frequency: 'yearly',
        category: 'software'
      },
      {
        id: createId('participant-recruitment', 1),
        name: 'Participant Recruitment',
        description: 'Amazon Mechanical Turk ($2/participant) for 500 participants + screening',
        type: 'variable',
        amount: 1500,
        currency: 'USD',
        frequency: 'one-time',
        category: 'data'
      },
      {
        id: createId('equipment-materials', 1),
        name: 'Equipment & Materials',
        description: 'Eye-tracking equipment, EEG system, or specialized research tools',
        type: 'one-time',
        amount: 8000,
        currency: 'USD',
        frequency: 'one-time',
        category: 'equipment'
      },
      {
        id: createId('conference-presentations', 1),
        name: 'Conference Presentations',
        description: 'Conference registration ($500), travel ($1,000), accommodation ($800)',
        type: 'one-time',
        amount: 2300,
        currency: 'USD',
        frequency: 'one-time',
        category: 'dissemination'
      },
      {
        id: createId('publication-costs', 1),
        name: 'Publication Costs',
        description: 'Open access fees ($3,000), proofreading ($500), figure preparation ($200)',
        type: 'one-time',
        amount: 3700,
        currency: 'USD',
        frequency: 'one-time',
        category: 'publication'
      }
    ],
    assumptions: [
      'Academic research project with 500+ participants',
      'Mixed-methods study with quantitative and qualitative data',
      'Professional statistical analysis and software',
      'Conference presentation and journal publication',
      'Specialized research equipment and tools'
    ],
    riskFactors: [
      'Participant recruitment difficulties extending timeline',
      'Data quality issues requiring additional collection',
      'Journal rejection requiring resubmission to different outlets',
      'Equipment malfunctions affecting data collection'
    ]
  },

  recommendedTools: [
    {
      id: createId('spss', 1),
      name: 'SPSS',
      category: 'analytics',
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
      frequency: 'monthly'
    }
  ],

  risks: [
    {
      category: 'technical',
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

// Game Development Studio Team Templates
export const gameBalanceTemplate: FlowTemplate = {
  id: 'game-balance-1',
  name: 'Game Balance Testing & Tuning',
  description: 'Focused workflow for game balance team to test, analyze, and tune game mechanics for optimal player experience.',
  category: 'game-design',
  difficulty: 'intermediate',
  targetAudience: 'small-team',
  estimatedDuration: { min: 2, max: 4, unit: 'weeks' },
  tags: ['game-balance', 'testing', 'analytics', 'tuning', 'player-experience'],
  thumbnail: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&h=300&fit=crop',
  version: '1.0.0',
  author: 'Flow Team',
  authorName: 'Flow Team',
  lastUpdated: new Date(),
  createdAt: new Date(),
  isPublic: true,
  rating: 4.6,
  usageCount: 320,
  isUserGenerated: false,
  status: 'approved',

  steps: [
    {
      id: 'balance-metrics-setup',
      title: 'Balance Metrics Setup',
      description: 'Define key performance indicators and metrics to track for balance analysis',
      type: 'planning',
      order: 0,
      estimatedDuration: { min: 2, max: 3, unit: 'days' },
      requiredSkills: ['game-analytics', 'data-analysis', 'balance-design'],
      requiredTools: ['analytics-dashboard', 'spreadsheet-software', 'game-engine'],
      deliverables: ['Balance metrics framework', 'KPI definitions', 'Data collection plan'],
      acceptanceCriteria: ['All key metrics defined', 'Data collection automated', 'Baseline established'],
      riskLevel: 'low',
      costEstimate: { min: 200, max: 400, currency: 'USD' },
      automationPotential: 80,
      optimizationTips: ['Automate data collection', 'Use real-time dashboards', 'Implement alert systems']
    },
    {
      id: 'player-data-collection',
      title: 'Player Data Collection',
      description: 'Gather player behavior data, win rates, and engagement metrics from live gameplay',
      type: 'analysis',
      order: 1,
      estimatedDuration: { min: 3, max: 7, unit: 'days' },
      requiredSkills: ['data-collection', 'game-analytics', 'sql'],
      requiredTools: ['analytics-platform', 'database', 'data-visualization'],
      dependencies: ['balance-metrics-setup'], // Balance metrics setup
      deliverables: ['Player behavior dataset', 'Win rate analysis', 'Engagement metrics'],
      acceptanceCriteria: ['Sufficient data collected', 'Metrics validated', 'Anomalies identified'],
      riskLevel: 'medium',
      costEstimate: { min: 300, max: 600, currency: 'USD' },
      automationPotential: 90,
      optimizationTips: ['Automate data pipelines', 'Use real-time processing', 'Implement data validation']
    },
    {
      id: 'balance-analysis-identification',
      title: 'Balance Analysis & Identification',
      description: 'Analyze collected data to identify balance issues, overpowered/underpowered elements',
      type: 'analysis',
      order: 2,
      estimatedDuration: { min: 2, max: 4, unit: 'days' },
      requiredSkills: ['statistical-analysis', 'game-balance', 'data-interpretation'],
      requiredTools: ['statistical-software', 'data-visualization', 'spreadsheet-software'],
      dependencies: ['player-data-collection'], // Player data collection
      deliverables: ['Balance analysis report', 'Issue identification', 'Priority ranking'],
      acceptanceCriteria: ['All issues documented', 'Root causes identified', 'Impact assessed'],
      riskLevel: 'medium',
      costEstimate: { min: 400, max: 800, currency: 'USD' },
      automationPotential: 70,
      optimizationTips: ['Use automated analysis tools', 'Implement anomaly detection', 'Create automated reports']
    },
    {
      id: 'balance-adjustments-testing',
      title: 'Balance Adjustments & Testing',
      description: 'Implement balance changes and test their impact on gameplay metrics',
      type: 'testing',
      order: 3,
      estimatedDuration: { min: 3, max: 7, unit: 'days' },
      requiredSkills: ['game-balance', 'testing', 'iteration'],
      requiredTools: ['game-engine', 'testing-framework', 'version-control'],
      dependencies: ['balance-analysis-identification'], // Balance analysis
      deliverables: ['Balance adjustments', 'Test results', 'Iteration plan'],
      acceptanceCriteria: ['Changes implemented', 'Tests completed', 'Results documented'],
      riskLevel: 'high',
      costEstimate: { min: 500, max: 1000, currency: 'USD' },
      automationPotential: 60,
      optimizationTips: ['Automate testing processes', 'Use A/B testing', 'Implement rapid iteration']
    },
    {
      id: 'final-validation-documentation',
      title: 'Final Validation & Documentation',
      description: 'Validate final balance changes and document the process for future reference',
      type: 'quality-assurance',
      order: 4,
      estimatedDuration: { min: 1, max: 2, unit: 'days' },
      requiredSkills: ['documentation', 'validation', 'communication'],
      requiredTools: ['documentation-tools', 'communication-platform', 'version-control'],
      dependencies: ['balance-adjustments-testing'], // Balance adjustments
      deliverables: ['Final balance report', 'Process documentation', 'Recommendations'],
      acceptanceCriteria: ['Changes validated', 'Documentation complete', 'Team informed'],
      riskLevel: 'low',
      costEstimate: { min: 200, max: 400, currency: 'USD' },
      automationPotential: 50,
      optimizationTips: ['Automate reporting', 'Use templates', 'Implement knowledge base']
    }
  ],

  costAnalysis: {
    totalCost: 8500,
    breakdown: [
      { 
        id: createId('unity-analytics-pro', 1), 
        name: 'Unity Analytics Pro', 
        description: 'Unity Analytics Pro ($500/month) + Amplitude ($995/month) for advanced analytics', 
        type: 'subscription', 
        amount: 17940, 
        currency: 'USD', 
        frequency: 'yearly',
        category: 'analytics'
      },
      { 
        id: createId('data-scientist', 1), 
        name: 'Data Scientist (Contract)', 
        description: 'Contract data scientist at $120/hour for 20 hours (setup, analysis, reporting)', 
        type: 'labor', 
        amount: 2400, 
        currency: 'USD', 
        frequency: 'one-time',
        category: 'personnel'
      },
      { 
        id: createId('a-b-testing-platform', 1), 
        name: 'A/B Testing Platform', 
        description: 'Optimizely or similar A/B testing platform for game mechanics testing', 
        type: 'subscription', 
        amount: 2400, 
        currency: 'USD', 
        frequency: 'yearly',
        category: 'testing'
      },
      { 
        id: createId('heatmap-session-recording', 1), 
        type: 'subscription', 
        amount: 1200, 
        currency: 'USD', 
        frequency: 'yearly',
        category: 'analytics'
      },
      { 
        id: createId('ongoing-analysis-reporting', 1), 
        description: 'Monthly analysis, reporting, and optimization recommendations', 
        type: 'labor', 
        amount: 6000, 
        currency: 'USD', 
        frequency: 'yearly',
        category: 'ongoing'
      }
    ],
    currency: 'USD',
    calculationDate: new Date(),
    assumptions: [
      'Mobile game with 100,000+ monthly active users',
      'Professional analytics stack for data-driven decisions',
      'Contract data scientist for setup and analysis',
      'Comprehensive A/B testing and optimization',
      'Ongoing analysis and reporting services'
    ],
    riskFactors: [
      'Data privacy regulations affecting tracking capabilities',
      'Player behavior changes requiring new analysis approaches',
      'Analytics platform costs scaling with user growth',
      'Technical implementation delays affecting data collection'
    ]
  },

  recommendedTools: [
    {
      id: createId('unity-analytics', 1),
      name: 'Unity Analytics',
      category: 'analytics',
      description: 'Game analytics and player behavior tracking',
      website: 'https://unity.com/analytics',
      pricing: {
        model: 'freemium',
        startingPrice: 0,
        notes: 'Free tier available, paid plans for advanced features'
      },
      features: ['Player behavior tracking', 'Real-time analytics', 'Custom events', 'Performance monitoring'],
      pros: ['Easy integration', 'Real-time data', 'Comprehensive metrics', 'Free tier available'],
      cons: ['Limited free tier', 'Data privacy concerns', 'Complex setup', 'Performance overhead'],
      learningCurve: 'intermediate',
      popularity: 8
    }
  ],

  optimizationSuggestions: [
    {
      category: 'efficiency',
      title: 'Automated Data Collection',
      description: 'Implement automated data collection to reduce manual work',
      impact: 'high',
      effort: 'medium',
      implementation: 'Set up automated data pipelines and real-time monitoring'
    }
  ],

  industryContext: {
    marketSize: 'Global game analytics market valued at $2.5 billion',
    competition: 'High competition in mobile gaming market',
    regulations: ['GDPR compliance', 'Data privacy laws', 'Age restrictions'],
    trends: ['Real-time analytics', 'AI-powered insights', 'Cross-platform tracking'],
    challenges: ['Data accuracy', 'Player privacy', 'Real-time processing'],
    opportunities: ['Predictive analytics', 'Personalized experiences', 'Performance optimization']
  }
};

export const gameMechanicsTemplate: FlowTemplate = {
  id: 'game-mechanics-1',
  name: 'Game Mechanics Design & Implementation',
  description: 'Workflow for game mechanics team to design, prototype, and implement new game systems and mechanics.',
  category: 'game-design',
  difficulty: 'advanced',
  targetAudience: 'small-team',
  estimatedDuration: { min: 3, max: 6, unit: 'weeks' },
  tags: ['game-mechanics', 'prototyping', 'system-design', 'implementation', 'playtesting'],
  thumbnail: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=300&fit=crop',
  version: '1.0.0',
  author: 'Flow Team',
  authorName: 'Flow Team',
  lastUpdated: new Date(),
  createdAt: new Date(),
  isPublic: true,
  rating: 4.7,
  usageCount: 450,
  isUserGenerated: false,
  status: 'approved',

  steps: [
    {
      id: 'mechanics-concept-design',
      title: 'Mechanics Concept & Design',
      description: 'Brainstorm and design new game mechanics, systems, and interactions',
      type: 'design',
      order: 0,
      estimatedDuration: { min: 3, max: 5, unit: 'days' },
      requiredSkills: ['game-design', 'system-design', 'creative-thinking'],
      requiredTools: ['design-software', 'whiteboard', 'collaboration-tools'],
      deliverables: ['Mechanics concept document', 'System diagrams', 'Design specifications'],
      acceptanceCriteria: ['Concepts clearly defined', 'Systems mapped out', 'Design approved by team'],
      riskLevel: 'medium',
      costEstimate: { min: 600, max: 1200, currency: 'USD' },
      automationPotential: 20,
      optimizationTips: ['Use design templates', 'Implement feedback loops', 'Document design decisions']
    },
    {
      id: 'rapid-prototyping',
      title: 'Rapid Prototyping',
      description: 'Create quick prototypes to test mechanics and validate design concepts',
      type: 'development',
      order: 1,
      estimatedDuration: { min: 4, max: 7, unit: 'days' },
      requiredSkills: ['prototyping', 'game-development', 'rapid-iteration'],
      requiredTools: ['game-engine', 'prototyping-tools', 'version-control'],
      dependencies: ['mechanics-concept-design'], // Mechanics concept
      deliverables: ['Functional prototypes', 'Test scenarios', 'Initial feedback'],
      acceptanceCriteria: ['Prototypes functional', 'Core mechanics working', 'Team can test'],
      riskLevel: 'high',
      costEstimate: { min: 800, max: 1500, currency: 'USD' },
      automationPotential: 40,
      optimizationTips: ['Use prototyping frameworks', 'Automate build processes', 'Implement quick iteration']
    },
    {
      id: 'internal-playtesting',
      title: 'Internal Playtesting',
      description: 'Conduct internal playtesting sessions to gather feedback and identify issues',
      type: 'testing',
      order: 2,
      estimatedDuration: { min: 2, max: 4, unit: 'days' },
      requiredSkills: ['playtesting', 'feedback-collection', 'analysis'],
      requiredTools: ['testing-framework', 'feedback-tools', 'recording-software'],
      dependencies: ['rapid-prototyping'], // Rapid prototyping
      deliverables: ['Playtest feedback', 'Issue reports', 'Improvement suggestions'],
      acceptanceCriteria: ['Comprehensive feedback collected', 'Issues documented', 'Priorities established'],
      riskLevel: 'medium',
      costEstimate: { min: 400, max: 800, currency: 'USD' },
      automationPotential: 30,
      optimizationTips: ['Automate feedback collection', 'Use structured testing', 'Implement feedback tracking']
    },
    {
      id: 'mechanics-refinement',
      title: 'Mechanics Refinement',
      description: 'Iterate on mechanics based on playtest feedback and improve implementation',
      type: 'development',
      order: 3,
      estimatedDuration: { min: 3, max: 6, unit: 'days' },
      requiredSkills: ['game-development', 'iteration', 'problem-solving'],
      requiredTools: ['game-engine', 'development-tools', 'version-control'],
      dependencies: ['internal-playtesting'], // Internal playtesting
      deliverables: ['Refined mechanics', 'Updated prototypes', 'Implementation notes'],
      acceptanceCriteria: ['Issues addressed', 'Mechanics improved', 'Ready for final testing'],
      riskLevel: 'medium',
      costEstimate: { min: 600, max: 1200, currency: 'USD' },
      automationPotential: 50,
      optimizationTips: ['Use automated testing', 'Implement continuous integration', 'Automate deployment']
    },
    {
      id: 'final-integration-documentation',
      title: 'Final Integration & Documentation',
      description: 'Integrate refined mechanics into main game and document for future reference',
      type: 'implementation',
      order: 4,
      estimatedDuration: { min: 2, max: 3, unit: 'days' },
      requiredSkills: ['integration', 'documentation', 'communication'],
      requiredTools: ['game-engine', 'documentation-tools', 'version-control'],
      dependencies: ['mechanics-refinement'], // Mechanics refinement
      deliverables: ['Integrated mechanics', 'Technical documentation', 'Design documentation'],
      acceptanceCriteria: ['Mechanics integrated', 'Documentation complete', 'Team trained'],
      riskLevel: 'low',
      costEstimate: { min: 300, max: 600, currency: 'USD' },
      automationPotential: 60,
      optimizationTips: ['Automate integration', 'Use documentation templates', 'Implement knowledge sharing']
    }
  ],

  costAnalysis: {
    totalCost: 4000,
    breakdown: [
      { id: createId('design-concept', 1), description: 'Design and concept development', type: 'one-time', amount: 900, currency: 'USD', frequency: 'one-time' },
      { id: createId('prototyping', 1), description: 'Prototyping and development', type: 'one-time', amount: 1150, currency: 'USD', frequency: 'one-time' },
      { id: createId('playtesting', 1), description: 'Playtesting and feedback', type: 'one-time', amount: 600, currency: 'USD', frequency: 'one-time' },
      { id: createId('refinement', 1), description: 'Refinement and iteration', type: 'one-time', amount: 900, currency: 'USD', frequency: 'one-time' },
      { id: createId('integration', 1), description: 'Integration and documentation', type: 'one-time', amount: 450, currency: 'USD', frequency: 'one-time' }
    ],
    currency: 'USD',
    calculationDate: new Date(),
    assumptions: ['Game engine already available', 'Team of 3-4 people', '3-6 week timeline'],
    riskFactors: ['Design complexity', 'Technical challenges', 'Playtesting feedback changes']
  },

  recommendedTools: [
    {
      id: createId('unity-game-engine', 1),
      name: 'Unity Game Engine',
      category: 'development',
      description: 'Cross-platform game development engine',
      website: 'https://unity.com',
      pricing: {
        model: 'freemium',
        startingPrice: 0,
        notes: 'Free for personal use, paid plans for commercial use'
      },
      features: ['Cross-platform development', 'Visual scripting', 'Asset store', 'Real-time rendering'],
      pros: ['Easy to learn', 'Large community', 'Extensive documentation', 'Asset store'],
      cons: ['Performance limitations', 'Licensing costs', 'Platform-specific issues', 'Learning curve'],
      learningCurve: 'intermediate',
      popularity: 9
    }
  ],

  optimizationSuggestions: [
    {
      category: 'speed',
      title: 'Rapid Prototyping',
      description: 'Use rapid prototyping to validate mechanics early',
      impact: 'high',
      effort: 'medium',
      implementation: 'Implement quick prototypes and iterate based on feedback'
    }
  ],

  industryContext: {
    marketSize: 'Global game development market valued at $200 billion',
    competition: 'High competition in indie game market',
    regulations: ['Age ratings', 'Content guidelines', 'Platform policies'],
    trends: ['Procedural generation', 'AI integration', 'Cross-platform play'],
    challenges: ['Market saturation', 'Development costs', 'Player retention'],
    opportunities: ['Emerging platforms', 'Subscription models', 'Esports integration']
  }
};

export const gameArtTemplate: FlowTemplate = {
  id: 'game-art-1',
  name: 'Game Art Asset Pipeline',
  description: 'Streamlined workflow for art team to create, optimize, and integrate game assets efficiently.',
  category: 'creative-projects',
  difficulty: 'intermediate',
  targetAudience: 'small-team',
  estimatedDuration: { min: 2, max: 4, unit: 'weeks' },
  tags: ['game-art', 'asset-creation', 'optimization', 'pipeline', 'texturing'],
  thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop',
  version: '1.0.0',
  author: 'Flow Team',
  authorName: 'Flow Team',
  lastUpdated: new Date(),
  createdAt: new Date(),
  isPublic: true,
  rating: 4.5,
  usageCount: 280,
  isUserGenerated: false,
  status: 'approved',

  steps: [
    {
      id: 'art-style-guide-asset-planning',
      title: 'Art Style Guide & Asset Planning',
      description: 'Define art style guidelines, asset specifications, and production pipeline',
      type: 'planning',
      order: 0,
      estimatedDuration: { min: 2, max: 3, unit: 'days' },
      requiredSkills: ['art-direction', 'pipeline-design', 'project-planning'],
      requiredTools: ['design-software', 'project-management', 'style-guide-tools'],
      deliverables: ['Art style guide', 'Asset specifications', 'Production pipeline'],
      acceptanceCriteria: ['Style guide approved', 'Specifications clear', 'Pipeline defined'],
      riskLevel: 'low',
      costEstimate: { min: 400, max: 800, currency: 'USD' },
      automationPotential: 30,
      optimizationTips: ['Use style guide templates', 'Automate specification generation', 'Implement approval workflows']
    },
    {
      id: 'asset-creation-modeling',
      title: 'Asset Creation & Modeling',
      description: 'Create 3D models, textures, and 2D assets according to specifications',
      type: 'development',
      order: 1,
      estimatedDuration: { min: 5, max: 10, unit: 'days' },
      requiredSkills: ['3d-modeling', 'texturing', '2d-art', 'asset-creation'],
      requiredTools: ['3d-software', 'texture-software', '2d-software', 'asset-library'],
      dependencies: ['art-style-guide-asset-planning'], // Art style guide
      deliverables: ['3D models', 'Textures', '2D assets', 'Asset library'],
      acceptanceCriteria: ['Assets meet specifications', 'Quality standards met', 'Assets organized'],
      riskLevel: 'medium',
      costEstimate: { min: 1200, max: 2400, currency: 'USD' },
      automationPotential: 40,
      optimizationTips: ['Use asset libraries', 'Implement batch processing', 'Automate quality checks']
    },
    {
      id: 'asset-optimization-lod-creation',
      title: 'Asset Optimization & LOD Creation',
      description: 'Optimize assets for performance, create LODs, and prepare for game engine',
      type: 'optimization',
      order: 2,
      estimatedDuration: { min: 2, max: 4, unit: 'days' },
      requiredSkills: ['asset-optimization', 'performance-tuning', 'lod-creation'],
      requiredTools: ['optimization-tools', 'lod-generators', 'performance-testing'],
      dependencies: ['asset-creation-modeling'], // Asset creation
      deliverables: ['Optimized assets', 'LOD models', 'Performance metrics'],
      acceptanceCriteria: ['Assets optimized', 'LODs created', 'Performance targets met'],
      riskLevel: 'medium',
      costEstimate: { min: 600, max: 1200, currency: 'USD' },
      automationPotential: 80,
      optimizationTips: ['Automate optimization', 'Use batch processing', 'Implement quality validation']
    },
    {
      id: 'asset-integration-testing',
      title: 'Asset Integration & Testing',
      description: 'Import assets into game engine, test functionality, and validate performance',
      type: 'implementation',
      order: 3,
      estimatedDuration: { min: 2, max: 3, unit: 'days' },
      requiredSkills: ['game-engine', 'asset-integration', 'testing'],
      requiredTools: ['game-engine', 'testing-framework', 'performance-tools'],
      dependencies: ['asset-optimization-lod-creation'], // Asset optimization
      deliverables: ['Integrated assets', 'Test results', 'Performance validation'],
      acceptanceCriteria: ['Assets integrated', 'Functionality tested', 'Performance validated'],
      riskLevel: 'low',
      costEstimate: { min: 400, max: 800, currency: 'USD' },
      automationPotential: 70,
      optimizationTips: ['Automate integration', 'Use automated testing', 'Implement performance monitoring']
    },
    {
      id: 'asset-management-documentation',
      title: 'Asset Management & Documentation',
      description: 'Organize asset library, create documentation, and establish maintenance procedures',
      type: 'documentation',
      order: 4,
      estimatedDuration: { min: 1, max: 2, unit: 'days' },
      requiredSkills: ['asset-management', 'documentation', 'organization'],
      requiredTools: ['asset-management-system', 'documentation-tools', 'version-control'],
      dependencies: ['asset-integration-testing'], // Asset integration
      deliverables: ['Asset library', 'Documentation', 'Maintenance procedures'],
      acceptanceCriteria: ['Assets organized', 'Documentation complete', 'Procedures established'],
      riskLevel: 'low',
      costEstimate: { min: 200, max: 400, currency: 'USD' },
      automationPotential: 60,
      optimizationTips: ['Automate asset management', 'Use documentation templates', 'Implement version control']
    }
  ],

  costAnalysis: {
    totalCost: 4200,
    breakdown: [
      { id: createId('style-guide', 1), description: 'Style guide and planning', type: 'one-time', amount: 600, currency: 'USD', frequency: 'one-time' },
      { id: createId('asset-creation', 1), description: 'Asset creation and modeling', type: 'one-time', amount: 1800, currency: 'USD', frequency: 'one-time' },
      { id: createId('optimization', 1), description: 'Optimization and LOD creation', type: 'one-time', amount: 900, currency: 'USD', frequency: 'one-time' },
      { id: createId('integration', 1), description: 'Integration and testing', type: 'one-time', amount: 600, currency: 'USD', frequency: 'one-time' },
      { id: createId('management', 1), description: 'Management and documentation', type: 'one-time', amount: 300, currency: 'USD', frequency: 'one-time' }
    ],
    currency: 'USD',
    calculationDate: new Date(),
    assumptions: ['3D modeling software available', 'Team of 2-3 artists', '2-4 week timeline'],
    riskFactors: ['Asset complexity', 'Performance requirements', 'Style consistency issues']
  },

  recommendedTools: [
    {
      id: createId('blender', 1),
      name: 'Blender',
      category: 'design',
      description: 'Free 3D modeling and animation software',
      website: 'https://blender.org',
      pricing: {
        model: 'free',
        notes: 'Completely free and open source'
      },
      features: ['3D modeling', 'Animation', 'Rendering', 'Video editing'],
      pros: ['Completely free', 'Powerful features', 'Active community', 'Regular updates'],
      cons: ['Steep learning curve', 'Complex interface', 'Limited support', 'Performance issues'],
      learningCurve: 'advanced',
      popularity: 8
    }
  ],

  optimizationSuggestions: [
    {
      category: 'efficiency',
      title: 'Asset Pipeline Automation',
      description: 'Automate asset optimization and LOD generation',
      impact: 'high',
      effort: 'medium',
      implementation: 'Set up automated asset processing workflows'
    }
  ],

  industryContext: {
    marketSize: 'Global 3D animation market valued at $15 billion',
    competition: 'High competition in game art market',
    regulations: ['Copyright laws', 'Asset licensing', 'Quality standards'],
    trends: ['Procedural generation', 'AI-assisted creation', 'Real-time rendering'],
    challenges: ['Asset optimization', 'Style consistency', 'Performance constraints'],
    opportunities: ['Asset marketplaces', 'Automation tools', 'Cross-platform assets']
  }
};

export const gameMusicTemplate: FlowTemplate = {
  id: 'game-music-1',
  name: 'Game Music & Audio Production',
  description: 'Complete workflow for music team to compose, produce, and integrate game audio assets.',
  category: 'creative-projects',
  difficulty: 'intermediate',
  targetAudience: 'small-team',
  estimatedDuration: { min: 2, max: 3, unit: 'weeks' },
  tags: ['game-audio', 'music-composition', 'sound-design', 'audio-integration', 'production'],
  thumbnail: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop',
  version: '1.0.0',
  author: 'Flow Team',
  authorName: 'Flow Team',
  lastUpdated: new Date(),
  createdAt: new Date(),
  isPublic: true,
  rating: 4.4,
  usageCount: 190,
  isUserGenerated: false,
  status: 'approved',

  steps: [
    {
      id: 'audio-design-planning',
      title: 'Audio Design & Planning',
      description: 'Define audio style, create music briefs, and plan sound design approach',
      type: 'planning',
      order: 0,
      estimatedDuration: { min: 2, max: 3, unit: 'days' },
      requiredSkills: ['audio-design', 'music-direction', 'sound-design'],
      requiredTools: ['audio-software', 'reference-library', 'planning-tools'],
      deliverables: ['Audio style guide', 'Music briefs', 'Sound design plan'],
      acceptanceCriteria: ['Style guide approved', 'Briefs clear', 'Plan comprehensive'],
      riskLevel: 'low',
      costEstimate: { min: 300, max: 600, currency: 'USD' },
      automationPotential: 20,
      optimizationTips: ['Use audio templates', 'Create reference libraries', 'Implement feedback systems']
    },
    {
      id: 'music-composition-production',
      title: 'Music Composition & Production',
      description: 'Compose and produce game music tracks, themes, and ambient audio',
      type: 'development',
      order: 1,
      estimatedDuration: { min: 4, max: 8, unit: 'days' },
      requiredSkills: ['music-composition', 'audio-production', 'arrangement'],
      requiredTools: ['daw-software', 'virtual-instruments', 'audio-plugins'],
      dependencies: ['audio-design-planning'], // Audio design
      deliverables: ['Music tracks', 'Themes', 'Ambient audio', 'Production files'],
      acceptanceCriteria: ['Tracks composed', 'Quality standards met', 'Files organized'],
      riskLevel: 'medium',
      costEstimate: { min: 800, max: 1600, currency: 'USD' },
      automationPotential: 30,
      optimizationTips: ['Use music templates', 'Implement batch processing', 'Automate mixing']
    },
    {
      id: 'sound-effects-foley-creation',
      title: 'Sound Effects & Foley Creation',
      description: 'Create sound effects, UI sounds, and environmental audio elements',
      type: 'development',
      order: 2,
      estimatedDuration: { min: 3, max: 5, unit: 'days' },
      requiredSkills: ['sound-design', 'foley-recording', 'audio-editing'],
      requiredTools: ['audio-software', 'recording-equipment', 'sound-libraries'],
      dependencies: ['audio-design-planning'], // Audio design
      deliverables: ['Sound effects', 'UI sounds', 'Environmental audio', 'Foley recordings'],
      acceptanceCriteria: ['Effects created', 'Quality standards met', 'Library organized'],
      riskLevel: 'medium',
      costEstimate: { min: 600, max: 1200, currency: 'USD' },
      automationPotential: 40,
      optimizationTips: ['Use sound libraries', 'Implement batch processing', 'Automate quality checks']
    },
    {
      id: 'audio-optimization-integration',
      title: 'Audio Optimization & Integration',
      description: 'Optimize audio files, create adaptive music systems, and integrate into game engine',
      type: 'implementation',
      order: 3,
      estimatedDuration: { min: 2, max: 4, unit: 'days' },
      requiredSkills: ['audio-optimization', 'game-audio', 'integration'],
      requiredTools: ['audio-optimization-tools', 'game-engine', 'adaptive-audio-system'],
      dependencies: ['music-composition-production', 'sound-effects-foley-creation'], // Music composition and sound effects
      deliverables: ['Optimized audio', 'Adaptive music system', 'Integrated audio'],
      acceptanceCriteria: ['Audio optimized', 'System functional', 'Integration complete'],
      riskLevel: 'medium',
      costEstimate: { min: 500, max: 1000, currency: 'USD' },
      automationPotential: 70,
      optimizationTips: ['Automate optimization', 'Use adaptive audio tools', 'Implement quality validation']
    },
    {
      id: 'audio-testing-finalization',
      title: 'Audio Testing & Finalization',
      description: 'Test audio in game context, gather feedback, and finalize audio implementation',
      type: 'testing',
      order: 4,
      estimatedDuration: { min: 1, max: 2, unit: 'days' },
      requiredSkills: ['audio-testing', 'feedback-collection', 'quality-assurance'],
      requiredTools: ['testing-framework', 'feedback-tools', 'audio-monitoring'],
      dependencies: ['audio-optimization-integration'], // Audio integration
      deliverables: ['Test results', 'Feedback report', 'Final audio assets'],
      acceptanceCriteria: ['Testing complete', 'Feedback incorporated', 'Assets finalized'],
      riskLevel: 'low',
      costEstimate: { min: 200, max: 400, currency: 'USD' },
      automationPotential: 50,
      optimizationTips: ['Automate testing', 'Use feedback systems', 'Implement quality monitoring']
    }
  ],

  costAnalysis: {
    totalCost: 3600,
    breakdown: [
      { id: createId('audio-design', 1), description: 'Audio design and planning', type: 'one-time', amount: 450, currency: 'USD', frequency: 'one-time' },
      { id: createId('music-production', 1), description: 'Music composition and production', type: 'one-time', amount: 1200, currency: 'USD', frequency: 'one-time' },
      { id: createId('sound-effects', 1), description: 'Sound effects and foley', type: 'one-time', amount: 900, currency: 'USD', frequency: 'one-time' },
      { id: createId('optimization', 1), description: 'Optimization and integration', type: 'one-time', amount: 750, currency: 'USD', frequency: 'one-time' },
      { id: createId('testing', 1), description: 'Testing and finalization', type: 'one-time', amount: 300, currency: 'USD', frequency: 'one-time' }
    ],
    currency: 'USD',
    calculationDate: new Date(),
    assumptions: ['Audio software available', 'Team of 1-2 audio professionals', '2-3 week timeline'],
    riskFactors: ['Audio quality requirements', 'Integration complexity', 'Performance constraints']
  },

  recommendedTools: [
    {
      id: createId('ableton-live', 1),
      name: 'Ableton Live',
      category: 'design',
      description: 'Digital audio workstation for music production',
      website: 'https://ableton.com',
      pricing: {
        model: 'one-time',
        startingPrice: 99,
        notes: 'Intro version available, full version for professionals'
      },
      features: ['Music production', 'Live performance', 'Audio effects', 'MIDI support'],
      pros: ['Professional quality', 'Live performance features', 'Extensive effects', 'Session view'],
      cons: ['Expensive', 'Steep learning curve', 'Resource intensive', 'Limited free trial'],
      learningCurve: 'advanced',
      popularity: 9
    }
  ],

  optimizationSuggestions: [
    {
      category: 'quality',
      title: 'Audio Optimization',
      description: 'Optimize audio files for game performance',
      impact: 'medium',
      effort: 'low',
      implementation: 'Use compression and format optimization tools'
    }
  ],

  industryContext: {
    marketSize: 'Global game audio market valued at $3 billion',
    competition: 'Moderate competition in game audio market',
    regulations: ['Copyright laws', 'Licensing requirements', 'Quality standards'],
    trends: ['Adaptive audio', 'Spatial audio', 'AI-generated music'],
    challenges: ['Performance optimization', 'File size constraints', 'Platform compatibility'],
    opportunities: ['Audio middleware', 'Licensing opportunities', 'Custom audio solutions']
  }
};

export const gameWebDevTemplate: FlowTemplate = {
  id: 'game-web-dev-1',
  name: 'Game Web Development & Services',
  description: 'Workflow for web development team to create game-related web services, APIs, and player portals.',
  category: 'software-development',
  difficulty: 'intermediate',
  targetAudience: 'small-team',
  estimatedDuration: { min: 3, max: 5, unit: 'weeks' },
  tags: ['web-development', 'api-development', 'game-services', 'player-portal', 'backend'],
  thumbnail: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=300&fit=crop',
  version: '1.0.0',
  author: 'Flow Team',
  authorName: 'Flow Team',
  lastUpdated: new Date(),
  createdAt: new Date(),
  isPublic: true,
  rating: 4.6,
  usageCount: 340,
  isUserGenerated: false,
  status: 'approved',

  steps: [
    {
      id: 'web-services-planning-architecture',
      title: 'Web Services Planning & Architecture',
      description: 'Plan web services architecture, API design, and database schema for game-related features',
      type: 'planning',
      order: 0,
      estimatedDuration: { min: 3, max: 5, unit: 'days' },
      requiredSkills: ['system-architecture', 'api-design', 'database-design'],
      requiredTools: ['architecture-tools', 'api-design-tools', 'database-design-software'],
      deliverables: ['System architecture', 'API specifications', 'Database schema'],
      acceptanceCriteria: ['Architecture approved', 'APIs designed', 'Schema finalized'],
      riskLevel: 'medium',
      costEstimate: { min: 600, max: 1200, currency: 'USD' },
      automationPotential: 40,
      optimizationTips: ['Use architecture templates', 'Automate API documentation', 'Implement design validation']
    },
    {
      id: 'backend-api-development',
      title: 'Backend API Development',
      description: 'Develop RESTful APIs, authentication systems, and backend services for game features',
      type: 'development',
      order: 1,
      estimatedDuration: { min: 5, max: 10, unit: 'days' },
      requiredSkills: ['backend-development', 'api-development', 'authentication'],
      requiredTools: ['backend-framework', 'database', 'api-testing-tools'],
      dependencies: ['web-services-planning-architecture'], // Web services planning
      deliverables: ['RESTful APIs', 'Authentication system', 'Backend services'],
      acceptanceCriteria: ['APIs functional', 'Authentication working', 'Services tested'],
      riskLevel: 'high',
      costEstimate: { min: 1000, max: 2000, currency: 'USD' },
      automationPotential: 60,
      optimizationTips: ['Use API frameworks', 'Implement automated testing', 'Use code generation']
    },
    {
      id: 'frontend-development-ui',
      title: 'Frontend Development & UI',
      description: 'Create player portal, admin interfaces, and web-based game management tools',
      type: 'development',
      order: 2,
      estimatedDuration: { min: 4, max: 8, unit: 'days' },
      requiredSkills: ['frontend-development', 'ui-design', 'user-experience'],
      requiredTools: ['frontend-framework', 'ui-library', 'design-tools'],
      dependencies: ['backend-api-development'], // Backend API development
      deliverables: ['Player portal', 'Admin interfaces', 'Management tools'],
      acceptanceCriteria: ['Interfaces functional', 'UI responsive', 'User experience good'],
      riskLevel: 'medium',
      costEstimate: { min: 800, max: 1600, currency: 'USD' },
      automationPotential: 50,
      optimizationTips: ['Use component libraries', 'Implement responsive design', 'Automate UI testing']
    },
    {
      id: 'integration-testing',
      title: 'Integration & Testing',
      description: 'Integrate web services with game, conduct comprehensive testing, and validate functionality',
      type: 'testing',
      order: 3,
      estimatedDuration: { min: 3, max: 5, unit: 'days' },
      requiredSkills: ['integration', 'testing', 'quality-assurance'],
      requiredTools: ['testing-framework', 'integration-tools', 'monitoring-software'],
      dependencies: ['frontend-development-ui'], // Frontend development
      deliverables: ['Integrated services', 'Test results', 'Quality validation'],
      acceptanceCriteria: ['Integration complete', 'Tests passed', 'Quality validated'],
      riskLevel: 'medium',
      costEstimate: { min: 600, max: 1200, currency: 'USD' },
      automationPotential: 80,
      optimizationTips: ['Automate integration', 'Use continuous testing', 'Implement monitoring']
    },
    {
      id: 'deployment-monitoring',
      title: 'Deployment & Monitoring',
      description: 'Deploy web services to production, set up monitoring, and establish maintenance procedures',
      type: 'deployment',
      order: 4,
      estimatedDuration: { min: 2, max: 3, unit: 'days' },
      requiredSkills: ['deployment', 'monitoring', 'devops'],
      requiredTools: ['deployment-tools', 'monitoring-platform', 'cloud-services'],
      dependencies: ['integration-testing'], // Integration and testing
      deliverables: ['Production deployment', 'Monitoring setup', 'Maintenance procedures'],
      acceptanceCriteria: ['Services deployed', 'Monitoring active', 'Procedures documented'],
      riskLevel: 'low',
      costEstimate: { min: 400, max: 800, currency: 'USD' },
      automationPotential: 90,
      optimizationTips: ['Automate deployment', 'Use monitoring tools', 'Implement alerting']
    }
  ],

  costAnalysis: {
    totalCost: 5100,
    breakdown: [
      { id: createId('planning', 1), description: 'Planning and architecture', type: 'one-time', amount: 900, currency: 'USD', frequency: 'one-time' },
      { id: createId('backend-development', 1), description: 'Backend API development', type: 'one-time', amount: 1500, currency: 'USD', frequency: 'one-time' },
      { id: createId('frontend-development', 1), description: 'Frontend development', type: 'one-time', amount: 1200, currency: 'USD', frequency: 'one-time' },
      { id: createId('integration', 1), description: 'Integration and testing', type: 'one-time', amount: 900, currency: 'USD', frequency: 'one-time' },
      { id: createId('deployment', 1), description: 'Deployment and monitoring', type: 'one-time', amount: 600, currency: 'USD', frequency: 'one-time' }
    ],
    currency: 'USD',
    calculationDate: new Date(),
    assumptions: ['Development tools available', 'Team of 2-3 developers', '3-5 week timeline'],
    riskFactors: ['Technical complexity', 'Integration challenges', 'Performance requirements']
  },

  recommendedTools: [
    {
      id: createId('node-js', 1),
      name: 'Node.js',
      category: 'backend',
      description: 'JavaScript runtime for server-side development',
      website: 'https://nodejs.org',
      pricing: {
        model: 'free',
        notes: 'Open source runtime environment'
      },
      features: ['Server-side JavaScript', 'NPM package manager', 'Event-driven', 'Non-blocking I/O'],
      pros: ['Fast development', 'Large ecosystem', 'JavaScript everywhere', 'Active community'],
      cons: ['Single-threaded', 'Callback complexity', 'Memory leaks', 'Debugging challenges'],
      learningCurve: 'intermediate',
      popularity: 9
    }
  ],

  optimizationSuggestions: [
    {
      category: 'speed',
      title: 'API Development',
      description: 'Use modern API frameworks for faster development',
      impact: 'high',
      effort: 'medium',
      implementation: 'Implement RESTful APIs with proper documentation'
    }
  ],

  industryContext: {
    marketSize: 'Global web development market valued at $40 billion',
    competition: 'High competition in web development market',
    regulations: ['Data protection laws', 'API standards', 'Security requirements'],
    trends: ['Microservices', 'Serverless architecture', 'API-first development'],
    challenges: ['Scalability', 'Security', 'Performance optimization'],
    opportunities: ['Cloud services', 'API marketplaces', 'Integration services']
  }
};

export const gameProgrammingTemplate: FlowTemplate = {
  id: 'game-programming-1',
  name: 'Game Programming & Core Systems',
  description: 'Focused workflow for programming team to develop core game systems, features, and technical infrastructure.',
  category: 'software-development',
  difficulty: 'advanced',
  targetAudience: 'small-team',
  estimatedDuration: { min: 4, max: 8, unit: 'weeks' },
  tags: ['game-programming', 'core-systems', 'game-engine', 'optimization', 'technical-infrastructure'],
  thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=300&fit=crop',
  version: '1.0.0',
  author: 'Flow Team',
  authorName: 'Flow Team',
  lastUpdated: new Date(),
  createdAt: new Date(),
  isPublic: true,
  rating: 4.8,
  usageCount: 520,
  isUserGenerated: false,
  status: 'approved',

  steps: [
    {
      id: 'technical-architecture-system-design',
      title: 'Technical Architecture & System Design',
      description: 'Design core game systems, technical architecture, and development framework',
      type: 'planning',
      order: 0,
      estimatedDuration: { min: 4, max: 6, unit: 'days' },
      requiredSkills: ['system-architecture', 'game-programming', 'technical-design'],
      requiredTools: ['architecture-tools', 'design-software', 'documentation-tools'],
      deliverables: ['Technical architecture', 'System design documents', 'Development framework'],
      acceptanceCriteria: ['Architecture approved', 'Systems designed', 'Framework established'],
      riskLevel: 'medium',
      costEstimate: { min: 800, max: 1600, currency: 'USD' },
      automationPotential: 30,
      optimizationTips: ['Use architecture patterns', 'Implement design validation', 'Create technical templates']
    },
    {
      id: 'core-systems-development',
      title: 'Core Systems Development',
      description: 'Develop core game systems including rendering, physics, audio, and input handling',
      type: 'development',
      order: 1,
      estimatedDuration: { min: 8, max: 15, unit: 'days' },
      requiredSkills: ['game-programming', 'system-development', 'optimization'],
      requiredTools: ['game-engine', 'development-tools', 'profiling-tools'],
      dependencies: ['technical-architecture-system-design'], // Technical architecture
      deliverables: ['Core systems', 'Rendering engine', 'Physics system', 'Audio system'],
      acceptanceCriteria: ['Systems functional', 'Performance targets met', 'Integration working'],
      riskLevel: 'high',
      costEstimate: { min: 1600, max: 3200, currency: 'USD' },
      automationPotential: 50,
      optimizationTips: ['Use development frameworks', 'Implement automated testing', 'Use profiling tools']
    },
    {
      id: 'game-features-implementation',
      title: 'Game Features Implementation',
      description: 'Implement game-specific features, mechanics, and gameplay systems',
      type: 'development',
      order: 2,
      estimatedDuration: { min: 6, max: 12, unit: 'days' },
      requiredSkills: ['game-programming', 'feature-development', 'mechanics-implementation'],
      requiredTools: ['game-engine', 'development-tools', 'version-control'],
      dependencies: ['core-systems-development'], // Core systems development
      deliverables: ['Game features', 'Mechanics implementation', 'Gameplay systems'],
      acceptanceCriteria: ['Features implemented', 'Mechanics working', 'Systems integrated'],
      riskLevel: 'high',
      costEstimate: { min: 1200, max: 2400, currency: 'USD' },
      automationPotential: 40,
      optimizationTips: ['Use feature frameworks', 'Implement modular design', 'Automate testing']
    },
    {
      id: 'performance-optimization-testing',
      title: 'Performance Optimization & Testing',
      description: 'Optimize game performance, conduct comprehensive testing, and fix critical issues',
      type: 'optimization',
      order: 3,
      estimatedDuration: { min: 4, max: 8, unit: 'days' },
      requiredSkills: ['performance-optimization', 'testing', 'debugging'],
      requiredTools: ['profiling-tools', 'testing-framework', 'debugging-tools'],
      dependencies: ['game-features-implementation'], // Game features implementation
      deliverables: ['Optimized performance', 'Test results', 'Bug fixes'],
      acceptanceCriteria: ['Performance optimized', 'Tests passed', 'Critical bugs fixed'],
      riskLevel: 'medium',
      costEstimate: { min: 800, max: 1600, currency: 'USD' },
      automationPotential: 70,
      optimizationTips: ['Automate performance testing', 'Use profiling tools', 'Implement continuous testing']
    },
    {
      id: 'documentation-knowledge-transfer',
      title: 'Documentation & Knowledge Transfer',
      description: 'Create technical documentation, establish coding standards, and transfer knowledge to team',
      type: 'documentation',
      order: 4,
      estimatedDuration: { min: 2, max: 3, unit: 'days' },
      requiredSkills: ['documentation', 'knowledge-transfer', 'communication'],
      requiredTools: ['documentation-tools', 'knowledge-base', 'communication-platform'],
      dependencies: ['performance-optimization-testing'], // Performance optimization
      deliverables: ['Technical documentation', 'Coding standards', 'Knowledge base'],
      acceptanceCriteria: ['Documentation complete', 'Standards established', 'Knowledge transferred'],
      riskLevel: 'low',
      costEstimate: { min: 400, max: 800, currency: 'USD' },
      automationPotential: 60,
      optimizationTips: ['Automate documentation', 'Use documentation templates', 'Implement knowledge sharing']
    }
  ],

  costAnalysis: {
    totalCost: 7200,
    breakdown: [
      { id: createId('technical-architecture', 1), description: 'Technical architecture and design', type: 'one-time', amount: 1200, currency: 'USD', frequency: 'one-time' },
      { id: createId('core-systems', 1), description: 'Core systems development', type: 'one-time', amount: 2400, currency: 'USD', frequency: 'one-time' },
      { id: createId('game-features', 1), description: 'Game features implementation', type: 'one-time', amount: 1800, currency: 'USD', frequency: 'one-time' },
      { id: createId('performance-optimization', 1), description: 'Performance optimization and testing', type: 'one-time', amount: 1200, currency: 'USD', frequency: 'one-time' },
      { id: createId('documentation', 1), description: 'Documentation and knowledge transfer', type: 'one-time', amount: 600, currency: 'USD', frequency: 'one-time' }
    ],
    currency: 'USD',
    calculationDate: new Date(),
    assumptions: ['Game engine available', 'Team of 3-4 programmers', '4-8 week timeline'],
    riskFactors: ['Technical complexity', 'Performance requirements', 'Integration challenges']
  },

  recommendedTools: [
    {
      id: createId('unreal-engine', 1),
      name: 'Unreal Engine',
      category: 'development',
      description: 'Advanced game development engine',
      website: 'https://unrealengine.com',
      pricing: {
        model: 'freemium',
        startingPrice: 0,
        notes: 'Free until $1 million in revenue, then 5% royalty'
      },
      features: ['Advanced graphics', 'Blueprints visual scripting', 'C++ programming', 'Real-time rendering'],
      pros: ['High-quality graphics', 'Powerful features', 'Free for indie developers', 'Active community'],
      cons: ['Steep learning curve', 'Resource intensive', 'Complex setup', 'Performance overhead'],
      learningCurve: 'advanced',
      popularity: 8
    }
  ],

  optimizationSuggestions: [
    {
      category: 'efficiency',
      title: 'Performance Optimization',
      description: 'Optimize core systems for better performance',
      impact: 'high',
      effort: 'high',
      implementation: 'Use profiling tools and optimize critical paths'
    }
  ],

  industryContext: {
    marketSize: 'Global game engine market valued at $3 billion',
    competition: 'High competition in game development market',
    regulations: ['Platform requirements', 'Performance standards', 'Content guidelines'],
    trends: ['Real-time rendering', 'AI integration', 'Cross-platform development'],
    challenges: ['Performance optimization', 'Platform compatibility', 'Development complexity'],
    opportunities: ['Engine licensing', 'Asset marketplaces', 'Development services']
  }
};

// Export all templates with additional templates
export const allTemplates: FlowTemplate[] = [
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
  { ...appDevelopmentTemplate, id: 'web-app-dev-1', name: 'Web Application Development', category: 'software-development' },
  { ...gameDesignTemplate, id: 'mobile-game-dev-1', name: 'Mobile Game Development', category: 'game-design' },
  { ...manufacturingTemplate, id: 'electronics-manufacturing-1', name: 'Electronics Manufacturing', category: 'manufacturing' },
  { ...marketingCampaignTemplate, id: 'social-media-marketing-1', name: 'Social Media Marketing', category: 'marketing' },
  { ...ecommerceSetupTemplate, id: 'dropshipping-business-setup-1', name: 'Dropshipping Business Setup', category: 'business-operations' },
  { ...contentCreationTemplate, id: 'video-content-creation-1', name: 'Video Content Creation', category: 'creative-projects' },
  { ...customerSupportTemplate, id: 'technical-support-system-1', name: 'Technical Support System', category: 'customer-service' },
  { ...hrRecruitmentTemplate, id: 'executive-recruitment-1', name: 'Executive Recruitment', category: 'human-resources' },
  { ...financialPlanningTemplate, id: 'business-financial-planning-1', name: 'Business Financial Planning', category: 'finance' },
  { ...researchProjectTemplate, id: 'market-research-project-1', name: 'Market Research Project', category: 'research-development' },
  { ...appDevelopmentTemplate, id: 'desktop-software-development-1', name: 'Desktop Software Development', category: 'software-development' },
  { ...gameDesignTemplate, id: 'vr-game-development-1', name: 'VR Game Development', category: 'game-design' },
  { ...manufacturingTemplate, id: 'textile-manufacturing-1', name: 'Textile Manufacturing', category: 'manufacturing' },
  { ...marketingCampaignTemplate, id: 'email-marketing-campaign-1', name: 'Email Marketing Campaign', category: 'marketing' },
  { ...ecommerceSetupTemplate, id: 'subscription-box-business-1', name: 'Subscription Box Business', category: 'business-operations' },
  { ...contentCreationTemplate, id: 'podcast-production-1', name: 'Podcast Production', category: 'creative-projects' },
  { ...customerSupportTemplate, id: 'live-chat-support-1', name: 'Live Chat Support', category: 'customer-service' },
  { ...hrRecruitmentTemplate, id: 'remote-team-hiring-1', name: 'Remote Team Hiring', category: 'human-resources' },
  { ...financialPlanningTemplate, id: 'investment-portfolio-planning-1', name: 'Investment Portfolio Planning', category: 'finance' },
  { ...researchProjectTemplate, id: 'clinical-research-study-1', name: 'Clinical Research Study', category: 'research-development' },
  { ...appDevelopmentTemplate, id: 'saas-platform-development-1', name: 'SaaS Platform Development', category: 'software-development' },
  { ...gameDesignTemplate, id: 'educational-game-development-1', name: 'Educational Game Development', category: 'game-design' },
  { ...manufacturingTemplate, id: 'food-manufacturing-1', name: 'Food Manufacturing', category: 'manufacturing' },
  { ...marketingCampaignTemplate, id: 'influencer-marketing-campaign-1', name: 'Influencer Marketing Campaign', category: 'marketing' },
  { ...ecommerceSetupTemplate, id: 'b2b-e-commerce-platform-1', name: 'B2B E-commerce Platform', category: 'business-operations' },
  { ...contentCreationTemplate, id: 'infographic-design-1', name: 'Infographic Design', category: 'creative-projects' },
  { ...customerSupportTemplate, id: 'multi-language-support-1', name: 'Multi-language Support', category: 'customer-service' },
  { ...hrRecruitmentTemplate, id: 'technical-talent-acquisition-1', name: 'Technical Talent Acquisition', category: 'human-resources' },
  { ...financialPlanningTemplate, id: 'retirement-planning-1', name: 'Retirement Planning', category: 'finance' },
  { ...researchProjectTemplate, id: 'user-experience-research-1', name: 'User Experience Research', category: 'research-development' },
  gameBalanceTemplate,
  gameMechanicsTemplate,
  gameArtTemplate,
  gameMusicTemplate,
  gameWebDevTemplate,
  gameProgrammingTemplate
];

// Template categories with descriptions
export const templateCategories = [
  {
    id: 'software-development',
    name: 'Software Development',
    description: 'Web apps, mobile apps, desktop software, and system development',
    icon: '💻',
    templateCount: 17
  },
  {
    id: 'game-design',
    name: 'Game Design',
    description: 'Video game development, from concept to release',
    icon: '🎮',
    templateCount: 14
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
    templateCount: 16
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

// Difficulty levels
export const difficultyLevels = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
  { value: 'expert', label: 'Expert' }
];

// Target audiences
export const targetAudiences = [
  { value: 'individual', label: 'Individual' },
  { value: 'small-team', label: 'Small Team' },
  { value: 'enterprise', label: 'Enterprise' }
];