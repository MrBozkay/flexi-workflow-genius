
import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { BarChart, Download, Calendar, ChevronDown, ArrowUpRight, ArrowDownRight, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ResponsiveContainer, BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line } from 'recharts';

const Analytics = () => {
  // Sample data for charts
  const executionData = [
    { name: 'Mon', executions: 45, failures: 3 },
    { name: 'Tue', executions: 52, failures: 1 },
    { name: 'Wed', executions: 48, failures: 2 },
    { name: 'Thu', executions: 61, failures: 4 },
    { name: 'Fri', executions: 58, failures: 0 },
    { name: 'Sat', executions: 30, failures: 1 },
    { name: 'Sun', executions: 27, failures: 0 },
  ];

  const apiCallsData = [
    { name: 'Mon', calls: 120 },
    { name: 'Tue', calls: 145 },
    { name: 'Wed', calls: 132 },
    { name: 'Thu', calls: 165 },
    { name: 'Fri', calls: 155 },
    { name: 'Sat', calls: 75 },
    { name: 'Sun', calls: 68 },
  ];

  const workflowsData = [
    { id: 1, name: 'Email Campaign', executions: 128, success: 120, failed: 8, avgTime: '1m 15s' },
    { id: 2, name: 'Data Sync', executions: 245, success: 242, failed: 3, avgTime: '45s' },
    { id: 3, name: 'Lead Generation', executions: 87, success: 85, failed: 2, avgTime: '2m 05s' },
    { id: 4, name: 'Customer Onboarding', executions: 62, success: 60, failed: 2, avgTime: '1m 30s' },
    { id: 5, name: 'Support Ticket Routing', executions: 104, success: 102, failed: 2, avgTime: '30s' },
  ];

  const timePeriodsOptions = [
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'quarter', label: 'This Quarter' },
    { value: 'year', label: 'This Year' },
  ];

  return (
    <AppLayout>
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
            <p className="text-muted-foreground mt-1">
              Monitor performance and metrics of your workflows
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="gap-2">
              <Calendar className="h-4 w-4" />
              <span>This Week</span>
              <ChevronDown className="h-4 w-4 ml-1" />
            </Button>
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              <span>Export</span>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Executions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-end">
                <div>
                  <div className="text-3xl font-bold">321</div>
                  <div className="flex items-center text-sm text-green-600">
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                    <span>12% from last week</span>
                  </div>
                </div>
                <Activity className="h-10 w-10 text-primary/50" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Success Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-end">
                <div>
                  <div className="text-3xl font-bold">96.5%</div>
                  <div className="flex items-center text-sm text-green-600">
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                    <span>2.1% from last week</span>
                  </div>
                </div>
                <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold">
                  97%
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">API Calls</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-end">
                <div>
                  <div className="text-3xl font-bold">860</div>
                  <div className="flex items-center text-sm text-red-600">
                    <ArrowDownRight className="h-3 w-3 mr-1" />
                    <span>5% from last week</span>
                  </div>
                </div>
                <BarChart className="h-10 w-10 text-primary/50" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="workflows">Workflows</TabsTrigger>
            <TabsTrigger value="apis">API Usage</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="mt-0 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Workflow Executions</CardTitle>
                <CardDescription>Executions and failures over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsBarChart
                      data={executionData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="executions" fill="#8884d8" name="Successful" />
                      <Bar dataKey="failures" fill="#ff8042" name="Failed" />
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="workflows" className="mt-0 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Workflow Performance</CardTitle>
                <CardDescription>Top workflows by execution</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b bg-muted/50">
                          <th className="h-10 px-4 text-left font-medium">Workflow</th>
                          <th className="h-10 px-4 text-left font-medium">Executions</th>
                          <th className="h-10 px-4 text-left font-medium">Success</th>
                          <th className="h-10 px-4 text-left font-medium">Failed</th>
                          <th className="h-10 px-4 text-left font-medium">Avg. Time</th>
                        </tr>
                      </thead>
                      <tbody>
                        {workflowsData.map((workflow) => (
                          <tr key={workflow.id} className="border-b hover:bg-muted/50 transition-colors">
                            <td className="p-4 font-medium">{workflow.name}</td>
                            <td className="p-4">{workflow.executions}</td>
                            <td className="p-4 text-green-600">{workflow.success}</td>
                            <td className="p-4 text-red-600">{workflow.failed}</td>
                            <td className="p-4">{workflow.avgTime}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="apis" className="mt-0 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>API Calls</CardTitle>
                <CardDescription>External API calls over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={apiCallsData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="calls" 
                        stroke="#8884d8" 
                        activeDot={{ r: 8 }}
                        name="API Calls"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default Analytics;
