'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNavigationStore, useAuthStore } from '@/stores';
import { mockUsers } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// AuthLoginView — Premium login screen
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 300, damping: 24 },
  },
};

export default function AuthLoginView() {
  const navigate = useNavigationStore((s) => s.navigate);
  const login = useAuthStore((s) => s.login);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      login(mockUsers[0]);
      navigate('home');
      setIsLoading(false);
    }, 1200);
  };

  const handleSocialLogin = (provider: string) => {
    setIsLoading(true);
    setTimeout(() => {
      login(mockUsers[0]);
      navigate('home');
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-8">
      <motion.div
        className="w-full max-w-md"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        <div className="rounded-2xl border border-border/50 bg-card p-6 shadow-xl sm:p-8">
          {/* ─── Logo ─── */}
          <motion.div
            className="mb-6 flex justify-center"
            variants={itemVariants}
          >
            <img
              src="/klika-logo.png"
              alt="KLIKA.LIVE"
              className="h-12 object-contain"
              onError={(e) => {
                // Fallback: show text logo if image fails
                (e.target as HTMLImageElement).style.display = 'none';
                (e.target as HTMLImageElement).parentElement!.innerHTML =
                  '<span class="text-3xl font-black tracking-tight text-primary">KLIKA</span><span class="text-3xl font-light tracking-tight text-muted-foreground">.LIVE</span>';
              }}
            />
          </motion.div>

          {/* ─── Welcome Heading ─── */}
          <motion.div className="mb-6 text-center" variants={itemVariants}>
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Welcome back
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Sign in to your account to continue
            </p>
          </motion.div>

          {/* ─── Form ─── */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <motion.div className="space-y-2" variants={itemVariants}>
              <Label htmlFor="email" className="text-sm font-medium">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-11 rounded-xl border-border/50 bg-background"
                autoComplete="email"
              />
            </motion.div>

            {/* Password */}
            <motion.div className="space-y-2" variants={itemVariants}>
              <Label htmlFor="password" className="text-sm font-medium">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-11 rounded-xl border-border/50 bg-background pr-10"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </motion.div>

            {/* Remember + Forgot */}
            <motion.div
              className="flex items-center justify-between"
              variants={itemVariants}
            >
              <div className="flex items-center gap-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) =>
                    setRememberMe(checked === true)
                  }
                  className="size-4"
                />
                <Label
                  htmlFor="remember"
                  className="cursor-pointer text-xs font-medium text-muted-foreground"
                >
                  Remember me
                </Label>
              </div>
              <button
                type="button"
                className="text-xs font-semibold text-primary hover:underline"
              >
                Forgot password?
              </button>
            </motion.div>

            {/* Submit Button */}
            <motion.div variants={itemVariants}>
              <Button
                type="submit"
                className="h-12 w-full rounded-xl text-sm font-semibold shadow-lg shadow-primary/20"
                disabled={isLoading}
              >
                {isLoading ? (
                  <motion.span
                    className="flex items-center gap-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <Loader2 size={16} className="animate-spin" />
                    Signing in...
                  </motion.span>
                ) : (
                  'Sign In'
                )}
              </Button>
            </motion.div>
          </form>

          {/* ─── Divider ─── */}
          <motion.div
            className="my-6 flex items-center gap-3"
            variants={itemVariants}
          >
            <Separator className="flex-1" />
            <span className="text-xs font-medium text-muted-foreground">
              or continue with
            </span>
            <Separator className="flex-1" />
          </motion.div>

          {/* ─── Social Login ─── */}
          <motion.div
            className="flex gap-3"
            variants={itemVariants}
          >
            <Button
              variant="outline"
              className="h-11 flex-1 rounded-xl gap-2 border-border/50 font-medium"
              onClick={() => handleSocialLogin('google')}
              disabled={isLoading}
            >
              <svg className="size-4" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
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
            <Button
              variant="outline"
              className="h-11 flex-1 rounded-xl gap-2 border-border/50 font-medium"
              onClick={() => handleSocialLogin('apple')}
              disabled={isLoading}
            >
              <svg className="size-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
              </svg>
              Apple
            </Button>
          </motion.div>

          {/* ─── Sign Up Link ─── */}
          <motion.p
            className="mt-6 text-center text-sm text-muted-foreground"
            variants={itemVariants}
          >
            Don&apos;t have an account?{' '}
            <button
              type="button"
              className="font-semibold text-primary hover:underline"
              onClick={() => navigate('auth-register')}
            >
              Sign up
            </button>
          </motion.p>
        </div>
      </motion.div>
    </div>
  );
}
