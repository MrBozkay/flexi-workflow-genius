
import React, { useState } from 'react'
import { AuthForm } from '@/components/auth/AuthForm'
import { useAuth } from '@/frontend/contexts/AuthContext'
import { Navigate } from 'react-router-dom'
import { GitBranch } from 'lucide-react'

const Auth = () => {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const { user, loading } = useAuth()

  // Redirect if user is already logged in
  if (!loading && user) {
    return <Navigate to="/" replace />
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <div className="mb-8 flex flex-col items-center">
        <div className="w-12 h-12 rounded-lg bg-primary flex items-center justify-center mb-2">
          <GitBranch className="w-6 h-6 text-primary-foreground" />
        </div>
        <h1 className="text-3xl font-bold">FlexiFlow</h1>
        <p className="text-muted-foreground mt-1">AI-powered workflow automation</p>
      </div>
      
      <AuthForm 
        mode={mode} 
        onSuccess={() => setMode(mode === 'signin' ? 'signup' : 'signin')} 
      />
    </div>
  )
}

export default Auth
