
# FlexiFlow

AI-powered workflow automation platform.

## Project Structure

```
src/
├── frontend/ # Frontend React application
│   ├── components/ # UI components
│   ├── contexts/ # React contexts
│   ├── hooks/ # Custom React hooks
│   ├── lib/ # Utility functions and helpers
│   └── pages/ # Page components
├── backend/ # Backend services (Supabase Edge Functions)
│   ├── api/ # API endpoints
│   └── services/ # Business logic
└── index.css # Global styles
```

## Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables:
   - Create a `.env` file in the root directory
   - Add the following variables:
     ```
     VITE_SUPABASE_URL=your_supabase_url
     VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
     ```

## Development

- Run the development server: `npm run dev`
- Build for production: `npm run build`

## Backend (Supabase)

The backend uses Supabase for:
- Authentication
- Database storage
- Edge Functions for API logic

### Supabase Setup

1. Create a Supabase project
2. Run the migrations in `supabase/migrations/` to set up the database schema
3. Deploy Edge Functions to Supabase

## Features

- User authentication
- Workflow creation and management
- Drag-and-drop workflow builder
- API integrations
- AI model connections
- Execution history and analytics

## License

MIT
