import React from "react";
import PermanentDashboard from "./shared/PermanentDashboard";

const Home = () => {
  return (
    <PermanentDashboard>
      <div className="flex-1 p-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Welcome to Flow</h1>
          <p className="text-lg text-muted-foreground mb-8">
            Your workflow management application is working! 🎉
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6 border rounded-lg">
              <h2 className="text-xl font-semibold mb-2">Templates</h2>
              <p className="text-muted-foreground">
                Browse workflow templates for various industries and processes.
              </p>
            </div>
            
            <div className="p-6 border rounded-lg">
              <h2 className="text-xl font-semibold mb-2">Workflows</h2>
              <p className="text-muted-foreground">
                Create and manage your custom workflows with our visual builder.
              </p>
            </div>
            
            <div className="p-6 border rounded-lg">
              <h2 className="text-xl font-semibold mb-2">Analytics</h2>
              <p className="text-muted-foreground">
                Track progress and analyze performance with detailed insights.
              </p>
            </div>
          </div>
        </div>
      </div>
    </PermanentDashboard>
  );
};

export default Home;
