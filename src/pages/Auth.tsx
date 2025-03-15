
import React, { useState, useEffect } from 'react'
import { AuthForm } from '@/components/auth/AuthForm'
import { useAuth } from '@/contexts/AuthContext'
import { Navigate, useNavigate } from 'react-router-dom'
import { GitBranch, InfoIcon } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'

const Auth = () => {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const { user, loading } = useAuth()
  const navigate = useNavigate()

  // Redirect if user is already logged in
  useEffect(() => {
    if (!loading && user) {
      navigate('/', { replace: true })
    }
  }, [user, loading, navigate])

  // If the initial check detects a user, show a immediate redirect
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
      
      {mode === 'signup' && (
        <Alert className="mb-4 max-w-md">
          <InfoIcon className="h-4 w-4" />
          <AlertDescription>
            After signing up, you'll need to confirm your email address before you can log in.
          </AlertDescription>
        </Alert>
      )}
      
      <AuthForm 
        mode={mode} 
        onSuccess={() => setMode(mode === 'signin' ? 'signup' : 'signin')} 
      />
    </div>
  )
}

export default Auth
