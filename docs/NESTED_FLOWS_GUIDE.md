# Nested Flows System Guide

## Overview

The Nested Flows system allows users to create hierarchical workflow structures where flows can contain sub-flows, creating a tree-like organization. This enables complex project management with goals, projects, tasks, and subtasks.

## Architecture

### Flow Types

The system supports four main flow types:

1. **Goal** - High-level objectives (e.g., "Launch a successful product")
2. **Project** - Major initiatives (e.g., "Develop mobile app")
3. **Task** - Specific work items (e.g., "Design user interface")
4. **Subtask** - Detailed actions (e.g., "Create wireframes")

### Database Structure

#### Core Tables

- `workflow_instances` - Main flows with hierarchy support
- `nested_flow_templates` - Reusable flow templates
- `flow_relationships` - Complex relationships between flows
- `flow_template_relationships` - Template hierarchy

#### Key Fields

- `parent_flow_id` - References the parent flow
- `root_flow_id` - References the top-level flow in the hierarchy
- `depth_level` - How deep the flow is in the hierarchy (0 = root)
- `path` - Materialized path for efficient queries (e.g., "/123/456/789")
- `flow_type` - The type of flow (goal, project, task, subtask)

### Hierarchy Management

#### Path-Based Navigation

The system uses materialized paths for efficient hierarchical queries:

```
Goal: /123
├── Project: /123/456
│   ├── Task: /123/456/789
│   └── Task: /123/456/790
└── Project: /123/457
    └── Task: /123/457/791
```

#### Automatic Path Updates

Database triggers automatically update paths when flows are moved:

```sql
CREATE OR REPLACE FUNCTION update_flow_path()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.parent_flow_id IS NOT NULL THEN
    SELECT path || '/' || id::text INTO NEW.path 
    FROM public.workflow_instances 
    WHERE id = NEW.parent_flow_id;
  ELSE
    NEW.path = '/' || NEW.id::text;
  END IF;
  
  NEW.depth_level = array_length(string_to_array(NEW.path, '/'), 1) - 1;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

## Usage Examples

### Creating a Nested Flow Structure

```typescript
// Create a goal
const goal = await nestedFlowApi.createFlow({
  name: "Launch Successful Product",
  description: "Bring our product to market successfully",
  flow_type: "goal"
});

// Create a project under the goal
const project = await nestedFlowApi.createFlow({
  name: "Develop Mobile App",
  description: "Build the mobile application",
  flow_type: "project",
  parent_flow_id: goal.id
});

// Create tasks under the project
const task1 = await nestedFlowApi.createFlow({
  name: "Design User Interface",
  description: "Create wireframes and mockups",
  flow_type: "task",
  parent_flow_id: project.id
});

const task2 = await nestedFlowApi.createFlow({
  name: "Implement Backend",
  description: "Build the server-side functionality",
  flow_type: "task",
  parent_flow_id: project.id
});

// Create subtasks
const subtask1 = await nestedFlowApi.createFlow({
  name: "Create Wireframes",
  description: "Design basic wireframes",
  flow_type: "subtask",
  parent_flow_id: task1.id
});
```

### Working with Flow Trees

```typescript
// Get the complete tree structure
const tree = await nestedFlowApi.getFlowTree();

// Get a specific branch
const branch = await nestedFlowApi.getFlowTree(projectId);

// Get all descendants of a flow
const descendants = await nestedFlowApi.getFlowDescendants(goalId);

// Get all ancestors of a flow
const ancestors = await nestedFlowApi.getFlowAncestors(subtaskId);
```

### Progress Calculation

Progress is automatically calculated for each flow including all descendants:

```typescript
// Get progress for a flow and all its children
const progress = await nestedFlowApi.calculateFlowProgress(projectId);

// Progress is calculated as:
// (completed steps in this flow + all descendants) / (total steps in this flow + all descendants)
```

## UI Components

### NestedFlowTree Component

The main component for displaying and managing nested flows:

```tsx
import { NestedFlowTree } from '@/components/workflow/NestedFlowTree';

function MyFlowsPage() {
  const [selectedFlowId, setSelectedFlowId] = useState<string>();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Flow Tree Sidebar */}
      <div className="lg:col-span-1">
        <NestedFlowTree
          onFlowSelect={setSelectedFlowId}
          selectedFlowId={selectedFlowId}
        />
      </div>
      
      {/* Flow Details */}
      <div className="lg:col-span-2">
        {selectedFlowId && <FlowDetails flowId={selectedFlowId} />}
      </div>
    </div>
  );
}
```

### Features

- **Expandable/Collapsible Nodes** - Click chevron to expand/collapse children
- **Visual Hierarchy** - Indentation and icons show flow types
- **Progress Indicators** - Progress bars show completion status
- **Context Menus** - Right-click for actions (edit, duplicate, delete)
- **Drag & Drop** - Move flows between parents (planned)
- **Search & Filter** - Find specific flows (planned)

## Template System

### Creating Reusable Templates

Templates can include sub-flow references:

```typescript
const template = await nestedFlowApi.createFlowTemplate({
  name: "Software Development Project",
  flow_type: "project",
  steps: [
    { title: "Requirements Gathering", type: "task" },
    { title: "Design", type: "task" },
    { title: "Development", type: "task" },
    { title: "Testing", type: "task" },
    { title: "Deployment", type: "task" }
  ],
  sub_flows: [
    "design-process-template",
    "development-workflow-template",
    "testing-checklist-template"
  ]
});
```

### Using Templates

```typescript
// Create a flow from a template
const newProject = await nestedFlowApi.createFlowFromTemplate(
  templateId,
  parentFlowId // optional
);

// This will create the main flow and all its sub-flows
```

## Best Practices

### Flow Organization

1. **Start with Goals** - Create high-level goals first
2. **Break Down Projects** - Divide goals into manageable projects
3. **Define Tasks** - Break projects into specific tasks
4. **Add Subtasks** - Detail complex tasks with subtasks

### Naming Conventions

- **Goals**: Use outcome-focused language ("Increase Revenue by 50%")
- **Projects**: Use action-oriented names ("Redesign Website")
- **Tasks**: Use specific action verbs ("Create User Personas")
- **Subtasks**: Use detailed descriptions ("Interview 5 customers")

### Depth Guidelines

- **Maximum Depth**: 5 levels (Goal → Project → Task → Subtask → Action)
- **Optimal Depth**: 3-4 levels for most use cases
- **Avoid Over-nesting**: Too many levels can become unwieldy

### Performance Considerations

1. **Path Queries** - Use path-based queries for hierarchy operations
2. **Lazy Loading** - Load children on demand for large trees
3. **Caching** - Cache frequently accessed tree structures
4. **Indexing** - Ensure proper database indexes on path and parent fields

## Migration from Flat Structure

If you're migrating from a flat flow structure:

1. **Run Schema Updates** - Execute the nested-flows-schema.sql
2. **Update Existing Flows** - Set appropriate flow types and hierarchy
3. **Migrate Templates** - Convert existing templates to nested templates
4. **Update UI Components** - Replace flat lists with tree components

## API Reference

### Core Methods

```typescript
// Flow Management
nestedFlowApi.createFlow(payload: CreateFlowPayload)
nestedFlowApi.updateFlow(flowId: string, payload: UpdateFlowPayload)
nestedFlowApi.deleteFlow(flowId: string)
nestedFlowApi.getFlow(flowId: string)

// Hierarchy Operations
nestedFlowApi.getFlowTree(rootFlowId?: string)
nestedFlowApi.moveFlow(payload: MoveFlowPayload)
nestedFlowApi.duplicateFlow(payload: DuplicateFlowPayload)
nestedFlowApi.getFlowDescendants(flowId: string)
nestedFlowApi.getFlowAncestors(flowId: string)

// Progress & Analytics
nestedFlowApi.calculateFlowProgress(flowId: string)
nestedFlowApi.getFlowAnalytics(flowId: string)

// Templates
nestedFlowApi.getFlowTemplates(filters?: FlowTemplateFilters)
nestedFlowApi.createFlowFromTemplate(templateId: string, parentFlowId?: string)

// Import/Export
nestedFlowApi.exportFlows(flowIds: string[])
nestedFlowApi.importFlows(importData: FlowImport)
```

### Type Definitions

```typescript
type FlowType = 'goal' | 'project' | 'task' | 'subtask';

interface WorkflowInstance {
  id: string;
  name: string;
  flow_type: FlowType;
  parent_flow_id?: string;
  root_flow_id?: string;
  depth_level: number;
  path: string;
  progress?: number;
  children?: WorkflowInstance[];
}

interface FlowTreeNode {
  id: string;
  name: string;
  flow_type: FlowType;
  progress: number;
  depth_level: number;
  children: FlowTreeNode[];
  is_expanded?: boolean;
}
```

## Troubleshooting

### Common Issues

1. **Circular References** - Prevent flows from referencing themselves
2. **Deep Nesting** - Limit hierarchy depth to maintain performance
3. **Path Updates** - Ensure triggers are working for path updates
4. **Progress Calculation** - Verify progress includes all descendants

### Performance Optimization

1. **Database Indexes** - Ensure indexes on path, parent_flow_id, root_flow_id
2. **Query Optimization** - Use path-based queries for hierarchy operations
3. **Caching Strategy** - Cache tree structures for frequently accessed data
4. **Lazy Loading** - Load children on demand for large hierarchies

## Future Enhancements

### Planned Features

1. **Drag & Drop** - Visual flow reordering
2. **Advanced Filtering** - Filter by type, status, progress
3. **Bulk Operations** - Select multiple flows for batch actions
4. **Flow Dependencies** - Define dependencies between flows
5. **Time Tracking** - Track time spent on flows and sub-flows
6. **Resource Allocation** - Assign team members to flows
7. **Gantt Charts** - Visual timeline representation
8. **Flow Templates** - Share and reuse flow structures

### Integration Opportunities

1. **Calendar Integration** - Sync flow deadlines with calendar
2. **Notification System** - Alert on flow progress and deadlines
3. **Reporting Dashboard** - Analytics and progress reports
4. **Export Options** - Export to PDF, Excel, or project management tools
5. **API Integration** - Connect with external project management tools 