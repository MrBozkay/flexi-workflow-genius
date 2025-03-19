
import React, { useState, useEffect } from 'react'
import { AuthForm } from '@/components/auth/AuthForm'
import { useAuth } from '@/contexts/AuthContext'
import { Navigate, useNavigate } from 'react-router-dom'
import { GitBranch, InfoIcon } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { supabase } from '@/integrations/supabase/client'
import { toast } from 'sonner'

const Auth = () => {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const { user, loading } = useAuth()
  const navigate = useNavigate()
  const [processingOAuth, setProcessingOAuth] = useState(false)

  console.log("Auth page - Initial state - User:", user?.email, "Loading:", loading)

  useEffect(() => {
    // Check if we have hash parameters (common in OAuth redirects)
    const handleHashRedirect = async () => {
      const hashParams = window.location.hash
      if (hashParams && (hashParams.includes('access_token') || hashParams.includes('error'))) {
        console.log("Auth page - Detected hash parameters in URL:", hashParams)
        setProcessingOAuth(true)
        
        try {
          // Process the hash params to establish session
          const { data, error } = await supabase.auth.getSession()
          
          if (error) {
            console.error("Auth page - Error processing hash redirect:", error)
            toast.error("Authentication failed: " + error.message)
            setProcessingOAuth(false)
            return
          }
          
          if (data.session) {
            console.log("Auth page - Successfully authenticated from hash")
            toast.success("Successfully authenticated")
            
            // Clear the URL hash
            window.history.replaceState(null, document.title, window.location.pathname)
            
            // Redirect to home after a delay
            setTimeout(() => {
              navigate('/', { replace: true })
            }, 1500)
          } else {
            console.log("Auth page - No session found after hash processing")
            setProcessingOAuth(false)
            toast.error("Authentication failed - No session found")
          }
        } catch (err: any) {
          console.error("Auth page - Error during hash processing:", err)
          toast.error("Authentication error: " + (err.message || "Unknown error"))
          setProcessingOAuth(false)
        }
      }
    }
    
    handleHashRedirect()
    
    // Extra safety check - if user is already authenticated, redirect to home
    if (!loading && user && !processingOAuth) {
      console.log("Auth page - User already logged in, redirecting to home")
      navigate('/', { replace: true })
    }
  }, [user, loading, navigate, processingOAuth])

  // Immediate redirect if user is already logged in before component fully mounts
  if (!loading && user && !processingOAuth) {
    console.log("Auth page - Immediate redirect to home")
    return <Navigate to="/" replace />
  }

  if (processingOAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 relative">
            <div className="absolute inset-0 rounded-full border-t-2 border-primary animate-spin"></div>
            <div className="absolute inset-4 rounded-full bg-primary/30"></div>
          </div>
          <p className="mt-4 text-lg font-medium">Finalizing authentication...</p>
        </div>
      </div>
    );
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
