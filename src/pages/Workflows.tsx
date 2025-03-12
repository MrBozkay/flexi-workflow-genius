
import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { WorkflowCanvas } from '@/components/workflow/WorkflowCanvas';

const Workflows = () => {
  return (
    <AppLayout>
      <div className="w-full h-full overflow-hidden">
        <WorkflowCanvas />
      </div>
    </AppLayout>
  );
};

export default Workflows;
