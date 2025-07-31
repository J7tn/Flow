import React from "react";
import { TemplateBrowser } from "./templates/TemplateBrowser";
import PermanentDashboard from "./shared/PermanentDashboard";
import { useAuth } from "@/contexts/AuthContext";

const FlowTemplates = () => {
  const { user } = useAuth();

  // If user is authenticated, show with dashboard layout
  if (user) {
    return (
      <PermanentDashboard>
        <div className="flex-1 p-6">
          <TemplateBrowser />
        </div>
      </PermanentDashboard>
    );
  }

  // If user is not authenticated, show standalone templates page
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Workflow Templates</h1>
          <p className="text-gray-600">Browse our collection of workflow templates to optimize your processes</p>
        </div>
        <TemplateBrowser />
      </div>
    </div>
  );
};

export default FlowTemplates;
