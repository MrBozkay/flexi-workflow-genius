
-- Create the necessary tables for the workflow application

-- Workflows table to store workflow definitions
CREATE TABLE IF NOT EXISTS public.workflows (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    nodes JSONB NOT NULL DEFAULT '[]'::JSONB,
    edges JSONB NOT NULL DEFAULT '[]'::JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    is_public BOOLEAN DEFAULT FALSE,
    tags TEXT[] DEFAULT '{}'::TEXT[]
);

-- RLS policy for workflows
ALTER TABLE public.workflows ENABLE ROW LEVEL SECURITY;

-- Allow users to see their own workflows
CREATE POLICY "Users can view their own workflows" 
ON public.workflows 
FOR SELECT 
USING (auth.uid() = user_id);

-- Allow users to insert their own workflows
CREATE POLICY "Users can insert their own workflows" 
ON public.workflows 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own workflows
CREATE POLICY "Users can update their own workflows" 
ON public.workflows 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Allow users to delete their own workflows
CREATE POLICY "Users can delete their own workflows" 
ON public.workflows 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create the workflow executions table
CREATE TABLE IF NOT EXISTS public.workflow_executions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workflow_id UUID NOT NULL REFERENCES public.workflows(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    status TEXT NOT NULL CHECK (status IN ('pending', 'running', 'completed', 'failed')),
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    input_data JSONB DEFAULT '{}'::JSONB,
    output_data JSONB DEFAULT '{}'::JSONB,
    error TEXT
);

-- RLS policy for workflow executions
ALTER TABLE public.workflow_executions ENABLE ROW LEVEL SECURITY;

-- Allow users to see their own workflow executions
CREATE POLICY "Users can view their own workflow executions" 
ON public.workflow_executions 
FOR SELECT 
USING (auth.uid() = user_id);

-- Allow users to insert their own workflow executions
CREATE POLICY "Users can insert their own workflow executions" 
ON public.workflow_executions 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create index for workflow executions
CREATE INDEX idx_workflow_executions_workflow_id ON public.workflow_executions(workflow_id);
CREATE INDEX idx_workflow_executions_user_id ON public.workflow_executions(user_id);
CREATE INDEX idx_workflow_executions_status ON public.workflow_executions(status);

-- Create API connections table
CREATE TABLE IF NOT EXISTS public.api_connections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    service_type TEXT NOT NULL,
    auth_type TEXT NOT NULL,
    credentials JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_used_at TIMESTAMP WITH TIME ZONE
);

-- RLS policy for API connections
ALTER TABLE public.api_connections ENABLE ROW LEVEL SECURITY;

-- Allow users to see their own API connections
CREATE POLICY "Users can view their own API connections" 
ON public.api_connections 
FOR SELECT 
USING (auth.uid() = user_id);

-- Allow users to insert their own API connections
CREATE POLICY "Users can insert their own API connections" 
ON public.api_connections 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own API connections
CREATE POLICY "Users can update their own API connections" 
ON public.api_connections 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Allow users to delete their own API connections
CREATE POLICY "Users can delete their own API connections" 
ON public.api_connections 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create functions for updated_at timestamps
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add trigger for workflows table
CREATE TRIGGER update_workflows_modified
BEFORE UPDATE ON public.workflows
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

-- Add trigger for api_connections table
CREATE TRIGGER update_api_connections_modified
BEFORE UPDATE ON public.api_connections
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();
