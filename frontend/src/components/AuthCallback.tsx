import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, CheckCircle, XCircle, Loader2 } from "lucide-react";

function AuthCallback() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        console.log("Auth callback triggered");
        
        // Get the current session
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Auth callback error:", error);
          setStatus('error');
          setMessage('Authentication failed. Please try again.');
          return;
        }

        if (session?.user) {
          console.log("User authenticated via callback:", session.user.email);
          setStatus('success');
          setMessage('Email confirmed successfully! Redirecting to dashboard...');
          
          // Redirect to dashboard after a short delay
          setTimeout(() => {
            navigate('/dashboard', { replace: true });
          }, 2000);
        } else {
          console.log("No session found in callback");
          setStatus('error');
          setMessage('No authentication session found. Please try signing in again.');
          
          // Redirect to auth page after a delay
          setTimeout(() => {
            navigate('/auth', { replace: true });
          }, 3000);
        }
      } catch (error) {
        console.error("Unexpected error in auth callback:", error);
        setStatus('error');
        setMessage('An unexpected error occurred. Please try again.');
        
        setTimeout(() => {
          navigate('/auth', { replace: true });
        }, 3000);
      }
    };

    // Handle the auth callback
    handleAuthCallback();
  }, [navigate]);

  const getStatusIcon = () => {
    switch (status) {
      case 'loading':
        return <Loader2 className="h-12 w-12 animate-spin text-primary" />;
      case 'success':
        return <CheckCircle className="h-12 w-12 text-green-500" />;
      case 'error':
        return <XCircle className="h-12 w-12 text-red-500" />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'loading':
        return 'text-primary';
      case 'success':
        return 'text-green-600';
      case 'error':
        return 'text-red-600';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-accent/10 p-6">
      <Card className="w-full max-w-md shadow-luxury">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="luxury-gradient p-3 rounded-2xl">
              <Building2 className="h-8 w-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Authentication</CardTitle>
          <CardDescription>
            Processing your authentication request
          </CardDescription>
        </CardHeader>
        
        <CardContent className="text-center space-y-6">
          <div className="flex justify-center">
            {getStatusIcon()}
          </div>
          
          <div className="space-y-2">
            <p className={`font-medium ${getStatusColor()}`}>
              {status === 'loading' && 'Verifying your email...'}
              {status === 'success' && 'Email Confirmed!'}
              {status === 'error' && 'Authentication Failed'}
            </p>
            <p className="text-sm text-muted-foreground">
              {message}
            </p>
          </div>

          {status === 'loading' && (
            <div className="space-y-2">
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-primary h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
              </div>
              <p className="text-xs text-muted-foreground">
                This may take a few moments...
              </p>
            </div>
          )}

          {status === 'error' && (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                You will be redirected to the sign-in page shortly.
              </p>
              <button 
                onClick={() => navigate('/auth')}
                className="text-sm text-primary hover:underline"
              >
                Go to Sign In
              </button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default AuthCallback;
