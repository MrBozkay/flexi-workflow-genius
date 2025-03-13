
import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Clock, RotateCcw, Search, Filter, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';

const Executions = () => {
  const executions = [
    { 
      id: 'exec-001', 
      workflowName: 'Customer Onboarding', 
      status: 'completed', 
      startTime: new Date(Date.now() - 1000 * 60 * 30), 
      duration: '1m 20s',
      trigger: 'API'
    },
    { 
      id: 'exec-002', 
      workflowName: 'Data Sync', 
      status: 'failed', 
      startTime: new Date(Date.now() - 1000 * 60 * 60 * 2), 
      duration: '45s',
      trigger: 'Schedule'
    },
    { 
      id: 'exec-003', 
      workflowName: 'Email Campaign', 
      status: 'completed', 
      startTime: new Date(Date.now() - 1000 * 60 * 60 * 4), 
      duration: '2m 12s',
      trigger: 'Manual'
    },
    { 
      id: 'exec-004', 
      workflowName: 'Lead Scoring', 
      status: 'running', 
      startTime: new Date(Date.now() - 1000 * 60 * 5), 
      duration: '5m 0s',
      trigger: 'Webhook'
    },
    { 
      id: 'exec-005', 
      workflowName: 'Data Sync', 
      status: 'completed', 
      startTime: new Date(Date.now() - 1000 * 60 * 60 * 12), 
      duration: '50s',
      trigger: 'Schedule'
    },
    { 
      id: 'exec-006', 
      workflowName: 'Support Ticket Routing', 
      status: 'completed', 
      startTime: new Date(Date.now() - 1000 * 60 * 60 * 24), 
      duration: '15s',
      trigger: 'API'
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed': return <XCircle className="h-4 w-4 text-red-500" />;
      case 'running': return <Clock className="h-4 w-4 text-blue-500" />;
      default: return <AlertCircle className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed': 
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Completed</Badge>;
      case 'failed': 
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Failed</Badge>;
      case 'running': 
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Running</Badge>;
      default: 
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <AppLayout>
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Executions</h1>
            <p className="text-muted-foreground mt-1">
              Monitor and track your workflow executions
            </p>
          </div>
          <Button variant="outline" className="gap-2">
            <RotateCcw className="h-4 w-4" />
            <span>Refresh</span>
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="relative flex-1 max-w-md w-full">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search executions..." className="pl-9 w-full" />
          </div>
          
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Select defaultValue="all">
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="running">Running</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Recent Executions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="h-10 px-4 text-left font-medium">Status</th>
                      <th className="h-10 px-4 text-left font-medium">Workflow</th>
                      <th className="h-10 px-4 text-left font-medium">Trigger</th>
                      <th className="h-10 px-4 text-left font-medium">Started</th>
                      <th className="h-10 px-4 text-left font-medium">Duration</th>
                      <th className="h-10 px-4 text-left font-medium">ID</th>
                    </tr>
                  </thead>
                  <tbody>
                    {executions.map((execution) => (
                      <tr key={execution.id} className="border-b hover:bg-muted/50 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(execution.status)}
                            {getStatusBadge(execution.status)}
                          </div>
                        </td>
                        <td className="p-4 font-medium">{execution.workflowName}</td>
                        <td className="p-4">{execution.trigger}</td>
                        <td className="p-4">{execution.startTime.toLocaleTimeString()}</td>
                        <td className="p-4">{execution.duration}</td>
                        <td className="p-4 font-mono text-xs">{execution.id}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Executions;
