import React from "react";
import { TemplateBrowser } from "./templates/TemplateBrowser";
import PermanentDashboard from "./shared/PermanentDashboard";

const FlowTemplates = () => {
  return (
    <PermanentDashboard>
      <div className="flex-1 p-6">
        <TemplateBrowser />
      </div>
    </PermanentDashboard>
  );
};

export default FlowTemplates;
