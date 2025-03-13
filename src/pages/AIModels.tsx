
import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Bot, Plus, Settings, ExternalLink, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const AIModels = () => {
  const modelCategories = [
    { id: 'all', name: 'All Models' },
    { id: 'text', name: 'Text Generation' },
    { id: 'vision', name: 'Vision' },
    { id: 'speech', name: 'Speech' },
    { id: 'embedding', name: 'Embeddings' },
  ];

  const aiModels = [
    {
      id: 'openai-gpt4',
      name: 'GPT-4 Turbo',
      provider: 'OpenAI',
      category: 'text',
      description: 'Most capable GPT model for complex tasks',
      connected: true,
      featured: true
    },
    {
      id: 'anthropic-claude3',
      name: 'Claude 3 Opus',
      provider: 'Anthropic',
      category: 'text',
      description: 'Advanced reasoning with longer context',
      connected: true,
      featured: true
    },
    {
      id: 'openai-dalle3',
      name: 'DALL-E 3',
      provider: 'OpenAI',
      category: 'vision',
      description: 'Generate images from text descriptions',
      connected: false,
      featured: false
    },
    {
      id: 'stability-sdxl',
      name: 'Stable Diffusion XL',
      provider: 'Stability AI',
      category: 'vision',
      description: 'High-quality image generation model',
      connected: true,
      featured: false
    },
    {
      id: 'openai-whisper',
      name: 'Whisper',
      provider: 'OpenAI',
      category: 'speech',
      description: 'Speech recognition and transcription',
      connected: false,
      featured: false
    },
    {
      id: 'openai-embeddings',
      name: 'Text Embeddings v3',
      provider: 'OpenAI',
      category: 'embedding',
      description: 'Convert text to numerical vectors',
      connected: true,
      featured: false
    }
  ];

  return (
    <AppLayout>
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">AI Models</h1>
            <p className="text-muted-foreground mt-1">
              Connect and manage AI models for your workflows
            </p>
          </div>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            <span>Connect New Model</span>
          </Button>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search AI models..." className="pl-9" />
          </div>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="mb-4">
            {modelCategories.map(category => (
              <TabsTrigger key={category.id} value={category.id}>
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {modelCategories.map(category => (
            <TabsContent key={category.id} value={category.id} className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {aiModels
                  .filter(model => category.id === 'all' || model.category === category.id)
                  .map(model => (
                    <Card key={model.id} className={`overflow-hidden ${model.featured ? 'border-primary/30' : ''}`}>
                      {model.featured && (
                        <div className="bg-primary/10 py-1 px-3 text-xs text-primary text-center font-medium">
                          Featured Model
                        </div>
                      )}
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start">
                          <div className="space-y-1">
                            <CardTitle className="text-lg font-semibold flex items-center gap-2">
                              {model.name}
                              {model.connected && (
                                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-xs">
                                  Connected
                                </Badge>
                              )}
                            </CardTitle>
                            <CardDescription className="text-sm">
                              <span className="font-medium">{model.provider}</span> • {getCategoryName(model.category)}
                            </CardDescription>
                          </div>
                          <Bot className="h-8 w-8 text-primary/70" />
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-4">{model.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Enabled</span>
                          <Switch checked={model.connected} />
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between border-t pt-4">
                        <Button variant="outline" size="sm" className="gap-1">
                          <Settings className="h-3.5 w-3.5" />
                          <span>Settings</span>
                        </Button>
                        <Button variant="outline" size="sm" className="gap-1">
                          <ExternalLink className="h-3.5 w-3.5" />
                          <span>Documentation</span>
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

function getCategoryName(category: string): string {
  switch (category) {
    case 'text': return 'Text Generation';
    case 'vision': return 'Vision';
    case 'speech': return 'Speech';
    case 'embedding': return 'Embeddings';
    default: return category;
  }
}

export default AIModels;
