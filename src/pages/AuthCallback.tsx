
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/integrations/supabase/client'
import { toast } from 'sonner'

const AuthCallback = () => {
  const navigate = useNavigate()

  useEffect(() => {
    const handleAuthCallback = async () => {
      const { error } = await supabase.auth.getSession()
      
      if (error) {
        toast.error('Authentication error: ' + error.message)
        navigate('/auth')
        return
      }

      // Successful authentication
      toast.success('Successfully authenticated')
      navigate('/')
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
