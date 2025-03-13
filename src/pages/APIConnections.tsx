
import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Database, Plus, RefreshCw, Search, ExternalLink, Shield, Check, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';

const APIConnections = () => {
  const categories = [
    { id: 'all', name: 'All APIs' },
    { id: 'crm', name: 'CRM' },
    { id: 'marketing', name: 'Marketing' },
    { id: 'payment', name: 'Payment' },
    { id: 'database', name: 'Database' },
  ];

  const connections = [
    {
      id: 'salesforce',
      name: 'Salesforce',
      category: 'crm',
      description: 'Connect to Salesforce CRM for lead and opportunity management',
      status: 'connected',
      usageLimit: 1000,
      usageCurrent: 324,
      lastSync: new Date(Date.now() - 1000 * 60 * 30)
    },
    {
      id: 'hubspot',
      name: 'HubSpot',
      category: 'marketing',
      description: 'Integrate with HubSpot for marketing automation and CRM',
      status: 'connected',
      usageLimit: 1500,
      usageCurrent: 1200,
      lastSync: new Date(Date.now() - 1000 * 60 * 60 * 2)
    },
    {
      id: 'stripe',
      name: 'Stripe',
      category: 'payment',
      description: 'Process payments and manage subscriptions with Stripe',
      status: 'connected',
      usageLimit: 500,
      usageCurrent: 123,
      lastSync: new Date(Date.now() - 1000 * 60 * 60 * 5)
    },
    {
      id: 'mailchimp',
      name: 'Mailchimp',
      category: 'marketing',
      description: 'Email marketing and automation platform',
      status: 'error',
      usageLimit: 2000,
      usageCurrent: 1500,
      lastSync: new Date(Date.now() - 1000 * 60 * 60 * 24)
    },
    {
      id: 'airtable',
      name: 'Airtable',
      category: 'database',
      description: 'Flexible database and spreadsheet hybrid',
      status: 'disconnected',
      usageLimit: 0,
      usageCurrent: 0,
      lastSync: null
    },
    {
      id: 'postgres',
      name: 'PostgreSQL',
      category: 'database',
      description: 'Connect to your PostgreSQL database directly',
      status: 'connected',
      usageLimit: 5000,
      usageCurrent: 1280,
      lastSync: new Date(Date.now() - 1000 * 60 * 10)
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'connected': 
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Connected</Badge>;
      case 'error': 
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Error</Badge>;
      case 'disconnected': 
        return <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">Disconnected</Badge>;
      default: 
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected': return <Check className="h-4 w-4 text-green-500" />;
      case 'error': return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'disconnected': return <div className="h-4 w-4 rounded-full border-2 border-gray-300" />;
      default: return <AlertCircle className="h-4 w-4 text-yellow-500" />;
    }
  };

  return (
    <AppLayout>
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">API Connections</h1>
            <p className="text-muted-foreground mt-1">
              Connect and manage third-party APIs for your workflows
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2">
              <RefreshCw className="h-4 w-4" />
              <span>Refresh All</span>
            </Button>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              <span>Add Connection</span>
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search connections..." className="pl-9" />
          </div>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="mb-4">
            {categories.map(category => (
              <TabsTrigger key={category.id} value={category.id}>
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {categories.map(category => (
            <TabsContent key={category.id} value={category.id} className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {connections
                  .filter(conn => category.id === 'all' || conn.category === category.id)
                  .map(connection => (
                    <Card key={connection.id} className="hover:shadow-md transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex justify-between">
                          <div className="space-y-1">
                            <CardTitle className="text-lg font-semibold flex items-center gap-2">
                              {connection.name}
                            </CardTitle>
                            <CardDescription>
                              {getStatusBadge(connection.status)}
                            </CardDescription>
                          </div>
                          <Database className="h-8 w-8 text-primary/70" />
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-4">{connection.description}</p>
                        
                        {connection.status === 'connected' && (
                          <>
                            <div className="space-y-1 mb-3">
                              <div className="flex justify-between text-sm">
                                <span>API Usage</span>
                                <span className="font-medium">{connection.usageCurrent} / {connection.usageLimit}</span>
                              </div>
                              <Progress value={(connection.usageCurrent / connection.usageLimit) * 100} className="h-2" />
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Last synced: {connection.lastSync?.toLocaleTimeString()}
                            </div>
                          </>
                        )}
                      </CardContent>
                      <CardFooter className="flex justify-between border-t pt-4">
                        <Button 
                          variant={connection.status === 'disconnected' ? 'default' : 'outline'} 
                          size="sm" 
                          className="gap-1"
                        >
                          {connection.status === 'disconnected' ? (
                            <>
                              <Plus className="h-3.5 w-3.5" />
                              <span>Connect</span>
                            </>
                          ) : (
                            <>
                              <Shield className="h-3.5 w-3.5" />
                              <span>Settings</span>
                            </>
                          )}
                        </Button>
                        <Button variant="outline" size="sm" className="gap-1">
                          <ExternalLink className="h-3.5 w-3.5" />
                          <span>Docs</span>
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default APIConnections;
