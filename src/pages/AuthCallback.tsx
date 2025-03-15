
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/integrations/supabase/client'
import { toast } from 'sonner'

const AuthCallback = () => {
  const navigate = useNavigate()

  useEffect(() => {
    const handleAuthCallback = async () => {
      console.log("Auth callback page - Starting auth callback processing")
      
      // Process the OAuth callback
      const { data, error } = await supabase.auth.getSession()
      
      if (error) {
        console.error("Auth callback error:", error)
        toast.error('Authentication error: ' + error.message)
        navigate('/auth')
        return
      }

      if (data.session) {
        console.log("Auth callback successful - User:", data.session.user.email)
        // Successful authentication
        toast.success('Successfully authenticated')
        navigate('/')
      } else {
        console.log("Auth callback - No session found")
        toast.error('Authentication failed - No session found')
        navigate('/auth')
      }
    }

    handleAuthCallback()
  }, [navigate])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex flex-col items-center">
        <div className="w-16 h-16 relative">
          <div className="absolute inset-0 rounded-full border-t-2 border-primary animate-spin"></div>
          <div className="absolute inset-4 rounded-full bg-primary/30"></div>
        </div>
        <p className="mt-4 text-lg font-medium">Finalizing authentication...</p>
      </div>
    </div>
  )
}

export default AuthCallback
