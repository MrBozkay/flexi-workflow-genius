
import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { supabase } from '@/integrations/supabase/client'
import { toast } from "sonner"
import { Mail, Lock, AlertCircle } from 'lucide-react'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { useNavigate } from 'react-router-dom'

interface AuthFormProps {
  mode: 'signin' | 'signup'
  onSuccess?: () => void
}

const formSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  fullName: z.string().optional()
})

export function AuthForm({ mode, onSuccess }: AuthFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showResendButton, setShowResendButton] = useState(false)
  const [emailForResend, setEmailForResend] = useState('')
  const navigate = useNavigate()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
      fullName: ''
    }
  })

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true)
    setError(null)
    setShowResendButton(false)

    try {
      if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({ 
          email: values.email, 
          password: values.password,
          options: {
            data: {
              full_name: values.fullName || ''
            }
          }
        })
        
        if (error) throw error
        
        toast.success("Account created! Please check your email to confirm your registration")
        if (onSuccess) onSuccess()
      } else {
        console.log("Attempting to sign in with:", values.email)
        const { error, data } = await supabase.auth.signInWithPassword({ 
          email: values.email, 
          password: values.password 
        })
        
        if (error) {
          // Handle "Email not confirmed" error specifically
          if (error.message.includes('Email not confirmed')) {
            setEmailForResend(values.email)
            setShowResendButton(true)
            throw new Error('Email not confirmed. Please check your inbox or resend the confirmation email.')
          }
          throw error
        }
        
        console.log("Sign in successful, user:", data.user?.email)
        toast.success("Signed in successfully")
        
        // Use navigate with replace to prevent back button issues
        console.log("Redirecting to home after login success")
        
        // Add a slight delay to let the auth state sync
        setTimeout(() => {
          console.log("Executing delayed navigation to home")
          navigate('/', { replace: true })
        }, 750)
      }
    } catch (err: any) {
      console.error("Authentication error:", err.message)
      setError(err.message || 'An error occurred')
      toast.error(err.message || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setLoading(true)
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      })
      
      if (error) throw error
      
      // The user will be redirected to Google for authentication
    } catch (err: any) {
      setError(err.message || 'Failed to sign in with Google')
      toast.error(err.message || 'Failed to sign in with Google')
      setLoading(false)
    }
  }

  const handleResendConfirmation = async () => {
    try {
      setLoading(true)
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: emailForResend,
      })

      if (error) throw error

      toast.success('Confirmation email resent. Please check your inbox.')
      setShowResendButton(false)
    } catch (err: any) {
      toast.error(err.message || 'Failed to resend confirmation email')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>{mode === 'signin' ? 'Sign In' : 'Sign Up'}</CardTitle>
        <CardDescription>
          {mode === 'signin' 
            ? 'Enter your credentials to access your account' 
            : 'Create a new account to get started'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="bg-destructive/15 p-3 rounded-md flex items-center gap-2 mb-4 text-sm text-destructive">
            <AlertCircle className="h-4 w-4" />
            <p>{error}</p>
          </div>
        )}
        
        {showResendButton && (
          <div className="mb-4">
            <Button 
              variant="outline" 
              className="w-full"
              onClick={handleResendConfirmation}
              disabled={loading}
            >
              Resend Confirmation Email
            </Button>
          </div>
        )}
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            {mode === 'signup' && (
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your full name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input className="pl-10" placeholder="Enter your email" {...field} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input 
                        className="pl-10" 
                        type="password" 
                        placeholder="Enter your password" 
                        {...field} 
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button 
              type="submit" 
              className="w-full" 
              disabled={loading}
            >
              {loading 
                ? mode === 'signin' ? 'Signing in...' : 'Signing up...' 
                : mode === 'signin' ? 'Sign In' : 'Sign Up'
              }
            </Button>
          </form>
        </Form>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
          </div>
        </div>

        <Button 
          variant="outline" 
          className="w-full" 
          onClick={handleGoogleLogin}
          disabled={loading}
        >
          <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          Google
        </Button>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-muted-foreground">
          {mode === 'signin' 
            ? "Don't have an account? " 
            : "Already have an account? "}
          <Button 
            variant="link" 
            className="p-0 h-auto font-normal" 
            onClick={() => {
              setError(null);
              setShowResendButton(false);
              if(onSuccess) onSuccess();
            }}
          >
            {mode === 'signin' ? 'Sign up' : 'Sign in'}
          </Button>
        </p>
      </CardFooter>
    </Card>
  )
}
