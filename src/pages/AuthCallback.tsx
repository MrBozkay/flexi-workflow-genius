
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/integrations/supabase/client'
import { toast } from 'sonner'

const AuthCallback = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const handleAuthCallback = async () => {
      console.log("Auth callback page - Starting auth callback processing")
      console.log("Current URL:", window.location.href)
      
      try {
        // Check if we have hash parameters (common in OAuth redirects)
        const hashParams = window.location.hash
        if (hashParams && (hashParams.includes('access_token') || hashParams.includes('error'))) {
          console.log("Detected hash parameters in URL, processing OAuth response directly")
          
          // Let Supabase handle the hash parameters by explicitly setting the session from the URL
          const { data, error } = await supabase.auth.getSession()
          
          if (error) {
            console.error("Error processing OAuth redirect:", error)
            throw error
          }
          
          if (data.session) {
            console.log("Successfully authenticated with OAuth. User:", data.session.user.email)
            // Clear the URL hash
            window.history.replaceState(null, document.title, window.location.pathname)
            toast.success('Successfully authenticated')
            
            // Add a delay to ensure the auth state is properly synced
            setTimeout(() => {
              navigate('/', { replace: true })
            }, 1000)
            return
          }
        }
        
        // Standard callback processing
        console.log("Processing standard callback")
        const { data, error } = await supabase.auth.getSession()
        
        if (error) throw error

        if (data.session) {
          console.log("Auth callback successful - User:", data.session.user.email)
          toast.success('Successfully authenticated')
          // Add a delay to ensure the auth state is properly synced
          setTimeout(() => {
            navigate('/', { replace: true })
          }, 1000)
        } else {
          console.log("Auth callback - No session found")
          setError('Authentication failed - No session found')
          toast.error('Authentication failed - No session found')
          setTimeout(() => {
            navigate('/auth', { replace: true })
          }, 1000)
        }
      } catch (err: any) {
        console.error("Auth callback error:", err)
        setError(err.message || 'Authentication error')
        toast.error('Authentication error: ' + (err.message || 'Unknown error'))
        setTimeout(() => {
          navigate('/auth', { replace: true })
        }, 1000)
      } finally {
        setLoading(false)
      }
    }

    handleAuthCallback()
  }, [navigate])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex flex-col items-center">
        {loading && (
          <>
            <div className="w-16 h-16 relative">
              <div className="absolute inset-0 rounded-full border-t-2 border-primary animate-spin"></div>
              <div className="absolute inset-4 rounded-full bg-primary/30"></div>
            </div>
            <p className="mt-4 text-lg font-medium">Finalizing authentication...</p>
          </>
        )}
        
        {error && !loading && (
          <div className="text-center">
            <p className="text-destructive">{error}</p>
            <Button 
              className="mt-4" 
              onClick={() => navigate('/auth', { replace: true })}
            >
              Return to login
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

export default AuthCallback
