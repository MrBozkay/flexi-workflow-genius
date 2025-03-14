
import express from 'express';
import cors from 'cors';
import { createClient } from '@supabase/supabase-js';
import { handleWorkflowRequest } from './api/workflowEndpoints';

// Get environment variables
const supabaseUrl = process.env.VITE_SUPABASE_URL as string;
const supabaseServiceKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY as string;

// Create a Supabase client with the service role key
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Create Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok', 
    timestamp: new Date().toISOString() 
  });
});

// Workflow API routes
app.use('/api/workflows', (req, res) => {
  handleWorkflowRequest(req)
    .then(response => {
      res.status(response.status || 200)
         .json(response.body || {});
    })
    .catch(error => {
      console.error('Error processing workflow request:', error);
      res.status(500).json({ 
        error: 'Internal Server Error', 
        message: error.message 
      });
    });
});

// Default 404 response
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Not Found', 
    message: 'The requested endpoint does not exist' 
  });
});

// Start server (when not being imported)
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

export default app;
