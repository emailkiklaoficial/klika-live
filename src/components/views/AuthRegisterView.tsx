'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Loader2, Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNavigationStore, useAuthStore } from '@/stores';
import { mockUsers } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// AuthRegisterView — Premium registration screen
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.08 },
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

// Password strength calculator
function getPasswordStrength(password: string): {
  score: number;
  label: string;
  color: string;
} {
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^a-zA-Z0-9]/.test(password)) score++;

  if (score <= 1) return { score: 1, label: 'Weak', color: 'bg-red-500' };
  if (score <= 2) return { score: 2, label: 'Fair', color: 'bg-amber-500' };
  if (score <= 3) return { score: 3, label: 'Good', color: 'bg-yellow-500' };
  if (score <= 4) return { score: 4, label: 'Strong', color: 'bg-emerald-500' };
  return { score: 5, label: 'Excellent', color: 'bg-emerald-600' };
}

// Requirement check
function getPasswordRequirements(password: string): {
  label: string;
  met: boolean;
}[] {
  return [
    { label: 'At least 8 characters', met: password.length >= 8 },
    { label: 'Uppercase & lowercase', met: /[a-z]/.test(password) && /[A-Z]/.test(password) },
    { label: 'Contains a number', met: /\d/.test(password) },
    { label: 'Special character', met: /[^a-zA-Z0-9]/.test(password) },
  ];
}

export default function AuthRegisterView() {
  const navigate = useNavigationStore((s) => s.navigate);
  const login = useAuthStore((s) => s.login);
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const passwordStrength = useMemo(() => getPasswordStrength(password), [password]);
  const passwordRequirements = useMemo(() => getPasswordRequirements(password), [password]);
  const passwordsMatch = confirmPassword.length === 0 || password === confirmPassword;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
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

  const isFormValid =
    fullName.trim().length > 0 &&
    username.trim().length > 0 &&
    email.trim().length > 0 &&
    password.length >= 8 &&
    password === confirmPassword &&
    acceptedTerms;

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-8">
      <motion.div
        className="w-full max-w-md"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        <div className="rounded-2xl border border-border/50 bg-card p-6 shadow-xl sm:p-8">
          {/* ─── Logo ─── */}
          <motion.div
            className="mb-5 flex justify-center"
            variants={itemVariants}
          >
            <img
              src="/klika-logo.png"
              alt="KLIKA.LIVE"
              className="h-12 object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
                (e.target as HTMLImageElement).parentElement!.innerHTML =
                  '<span class="text-3xl font-black tracking-tight text-primary">KLIKA</span><span class="text-3xl font-light tracking-tight text-muted-foreground">.LIVE</span>';
              }}
            />
          </motion.div>

          {/* ─── Heading ─── */}
          <motion.div className="mb-5 text-center" variants={itemVariants}>
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Create your account
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Join millions of buyers &amp; sellers on KLIKA
            </p>
          </motion.div>

          {/* ─── Form ─── */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* Full Name */}
            <motion.div className="space-y-1.5" variants={itemVariants}>
              <Label htmlFor="fullName" className="text-sm font-medium">
                Full Name
              </Label>
              <Input
                id="fullName"
                type="text"
                placeholder="John Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="h-11 rounded-xl border-border/50 bg-background"
                autoComplete="name"
              />
            </motion.div>

            {/* Username */}
            <motion.div className="space-y-1.5" variants={itemVariants}>
              <Label htmlFor="username" className="text-sm font-medium">
                Username
              </Label>
              <div className="relative">
                <span className="absolute top-1/2 left-3.5 -translate-y-1/2 text-sm font-medium text-muted-foreground">
                  @
                </span>
                <Input
                  id="username"
                  type="text"
                  placeholder="username"
                  value={username}
                  onChange={(e) =>
                    setUsername(e.target.value.replace(/[^a-zA-Z0-9_]/g, ''))
                  }
                  className="h-11 rounded-xl border-border/50 bg-background pl-8"
                  autoComplete="username"
                />
              </div>
            </motion.div>

            {/* Email */}
            <motion.div className="space-y-1.5" variants={itemVariants}>
              <Label htmlFor="regEmail" className="text-sm font-medium">
                Email
              </Label>
              <Input
                id="regEmail"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-11 rounded-xl border-border/50 bg-background"
                autoComplete="email"
              />
            </motion.div>

            {/* Password */}
            <motion.div className="space-y-1.5" variants={itemVariants}>
              <Label htmlFor="regPassword" className="text-sm font-medium">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="regPassword"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Create a strong password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-11 rounded-xl border-border/50 bg-background pr-10"
                  autoComplete="new-password"
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

              {/* Password strength indicator */}
              {password.length > 0 && (
                <motion.div
                  className="space-y-2"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                >
                  {/* Strength bar */}
                  <div className="flex items-center gap-2">
                    <div className="flex flex-1 gap-0.5">
                      {[1, 2, 3, 4, 5].map((level) => (
                        <div
                          key={level}
                          className={cn(
                            'h-1 flex-1 rounded-full transition-colors',
                            level <= passwordStrength.score
                              ? passwordStrength.color
                              : 'bg-muted'
                          )}
                        />
                      ))}
                    </div>
                    <span
                      className={cn(
                        'text-[10px] font-semibold capitalize',
                        passwordStrength.score <= 1
                          ? 'text-red-500'
                          : passwordStrength.score <= 2
                            ? 'text-amber-500'
                            : passwordStrength.score <= 3
                              ? 'text-yellow-600'
                              : 'text-emerald-600'
                      )}
                    >
                      {passwordStrength.label}
                    </span>
                  </div>

                  {/* Requirements checklist */}
                  <div className="grid grid-cols-2 gap-x-3 gap-y-1">
                    {passwordRequirements.map((req) => (
                      <div
                        key={req.label}
                        className="flex items-center gap-1.5 text-[11px]"
                      >
                        {req.met ? (
                          <Check size={12} className="text-emerald-500" />
                        ) : (
                          <X size={12} className="text-muted-foreground/40" />
                        )}
                        <span
                          className={cn(
                            req.met ? 'text-emerald-600' : 'text-muted-foreground/60'
                          )}
                        >
                          {req.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </motion.div>

            {/* Confirm Password */}
            <motion.div className="space-y-1.5" variants={itemVariants}>
              <Label htmlFor="confirmPassword" className="text-sm font-medium">
                Confirm Password
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Re-enter your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={cn(
                    'h-11 rounded-xl border-border/50 bg-background pr-10 transition-colors',
                    !passwordsMatch && 'border-red-300 focus-visible:ring-red-300'
                  )}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={
                    showConfirmPassword ? 'Hide password' : 'Show password'
                  }
                >
                  {showConfirmPassword ? (
                    <EyeOff size={16} />
                  ) : (
                    <Eye size={16} />
                  )}
                </button>
              </div>
              {!passwordsMatch && (
                <motion.p
                  className="text-[11px] font-medium text-red-500"
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  Passwords do not match
                </motion.p>
              )}
            </motion.div>

            {/* Terms Checkbox */}
            <motion.div
              className="flex items-start gap-2.5 pt-1"
              variants={itemVariants}
            >
              <Checkbox
                id="terms"
                checked={acceptedTerms}
                onCheckedChange={(checked) => setAcceptedTerms(checked === true)}
                className="mt-0.5 size-4"
              />
              <Label
                htmlFor="terms"
                className="cursor-pointer text-xs leading-relaxed text-muted-foreground"
              >
                I agree to the{' '}
                <span className="font-semibold text-foreground hover:underline">
                  Terms of Service
                </span>{' '}
                and{' '}
                <span className="font-semibold text-foreground hover:underline">
                  Privacy Policy
                </span>
              </Label>
            </motion.div>

            {/* Submit Button */}
            <motion.div variants={itemVariants}>
              <Button
                type="submit"
                className="h-12 w-full rounded-xl text-sm font-semibold shadow-lg shadow-primary/20"
                disabled={isLoading || !isFormValid}
              >
                {isLoading ? (
                  <motion.span
                    className="flex items-center gap-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <Loader2 size={16} className="animate-spin" />
                    Creating account...
                  </motion.span>
                ) : (
                  'Create Account'
                )}
              </Button>
            </motion.div>
          </form>

          {/* ─── Divider ─── */}
          <motion.div
            className="my-5 flex items-center gap-3"
            variants={itemVariants}
          >
            <Separator className="flex-1" />
            <span className="text-xs font-medium text-muted-foreground">
              or continue with
            </span>
            <Separator className="flex-1" />
          </motion.div>

          {/* ─── Social Login ─── */}
          <motion.div className="flex gap-3" variants={itemVariants}>
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

          {/* ─── Sign In Link ─── */}
          <motion.p
            className="mt-5 text-center text-sm text-muted-foreground"
            variants={itemVariants}
          >
            Already have an account?{' '}
            <button
              type="button"
              className="font-semibold text-primary hover:underline"
              onClick={() => navigate('auth-login')}
            >
              Sign in
            </button>
          </motion.p>
        </div>
      </motion.div>
    </div>
  );
}
