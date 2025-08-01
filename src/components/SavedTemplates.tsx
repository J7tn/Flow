import React from "react";
import { Link } from "react-router-dom";
import { PlusCircle, Search, FileText } from "lucide-react";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import PermanentDashboard from "./shared/PermanentDashboard";

const SavedTemplates = () => {
  // Mock data for saved templates
  const savedTemplates = [
    {
      id: "1",
      title: "Project Management",
      description: "Standard project management flow with milestones",
      steps: 12,
      category: "Business",
      lastUsed: "2023-06-10",
      usageCount: 5,
    },
    {
      id: "2",
      title: "Content Creation",
      description: "From ideation to publication flow",
      steps: 8,
      category: "Creative",
      lastUsed: "2023-06-08",
      usageCount: 3,
    },
    {
      id: "3",
      title: "Personal Goal Setting",
      description: "Step-by-step goal achievement process",
      steps: 6,
      category: "Personal",
      lastUsed: "2023-06-05",
      usageCount: 7,
    },
    {
      id: "4",
      title: "Event Planning",
      description: "Complete event planning and execution workflow",
      steps: 15,
      category: "Business",
      lastUsed: "2023-06-01",
      usageCount: 2,
    },
    {
      id: "5",
      title: "Product Launch",
      description: "End-to-end product launch process",
      steps: 20,
      category: "Marketing",
      lastUsed: "2023-05-28",
      usageCount: 4,
    },
    {
      id: "6",
      title: "Weekly Review",
      description: "Personal weekly review and planning template",
      steps: 5,
      category: "Personal",
      lastUsed: "2023-05-25",
      usageCount: 12,
    },
  ];

  return (
    <PermanentDashboard>
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <header className="border-b bg-card p-4 sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search templates..." className="pl-8" />
            </div>
            <div className="flex items-center space-x-4">
              <Button size="sm" asChild>
                <Link to="/workflow/new">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Create Template
                </Link>
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-6">
          <div className="mb-8">
            <h2 className="text-3xl font-bold tracking-tight mb-2">
              Saved Templates
            </h2>
            <p className="text-muted-foreground">
              Your personal collection of workflow templates.
            </p>
          </div>

          {/* Templates Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {savedTemplates.map((template) => (
              <Card key={template.id} className="overflow-hidden">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="h-5 w-5 mr-2 text-primary" />
                    {template.title}
                  </CardTitle>
                  <CardDescription>{template.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center mb-4">
                    <Badge variant="secondary">{template.category}</Badge>
                    <span className="text-sm text-muted-foreground">
                      {template.steps} steps
                    </span>
                  </div>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex justify-between">
                      <span>Last used:</span>
                      <span>{new Date(template.lastUsed).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Used:</span>
                      <span>{template.usageCount} times</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t pt-4 flex justify-between">
                  <Button variant="outline" size="sm">
                    Edit
                  </Button>
                  <Button size="sm" asChild>
                    <Link to={`/workflow/new?template=${template.id}`}>
                      Use Template
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          {/* Empty State */}
          {savedTemplates.length === 0 && (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No saved templates yet</h3>
              <p className="text-muted-foreground mb-4">
                Create your first template to get started with workflow automation.
              </p>
              <Button asChild>
                <Link to="/workflow/new">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Create Template
                </Link>
              </Button>
            </div>
          )}
        </main>
      </div>
    </PermanentDashboard>
  );
};

export default SavedTemplates; 