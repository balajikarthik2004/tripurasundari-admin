import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { AlignCenter, Columns, Layout, User, Lock, EyeOff, Eye } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/hooks/use-auth'

import logo from '@/assets/logo.png'
import templeBg from '@/assets/temple.png'

export const Route = createFileRoute('/login')({
  beforeLoad: ({ context }) => {
    if (context.auth.isAuthenticated) {
      throw redirect({
        to: "/",
      });
    }
  },
  component: LoginPage,
})

// Inline LoginForm adapted from the exact design constraints
function LoginForm({ isCustomized }: { isCustomized: boolean }) {
  const [showPassword, setShowPassword] = useState(false)
  const auth = useAuth()
  const navigate = useNavigate()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // A simple mock login
    auth.login('admin')
    navigate({ to: '/' })
  }

  return (
    <div className="w-full max-w-[320px] mx-auto flex flex-col justify-center">
      <h1 className="text-[28px] font-bold text-center text-foreground mb-8">Login</h1>
      <form onSubmit={handleSubmit} className="space-y-5 w-full">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-[12px] font-bold text-foreground capitalize tracking-wide">Email</Label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <User className="h-4 w-4 text-foreground " />
            </div>
            <Input
              id="email"
              placeholder="Enter your email address"
              className="login-input-enhanced pl-10 bg-muted border border-border rounded-xl h-11 text-sm shadow-none placeholder:text-muted-foreground"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-[12px] font-bold text-foreground capitalize tracking-wide">Password</Label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Lock className="h-4 w-4 text-foreground " />
            </div>
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              className="login-input-enhanced pl-10 pr-10 bg-muted border border-border rounded-xl h-11 text-sm shadow-none font-medium tracking-widest placeholder:tracking-normal placeholder:text-muted-foreground"
            />
            <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center">
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4">
          <Button type="submit" className="login-btn-premium text-white rounded-lg px-8 h-10 w-full sm:w-auto">
            Sign In
          </Button>
          <a href="#" className="text-[13px] font-bold text-foreground hover:text-foreground transition-colors">
            Forgot Password ?
          </a>
        </div>
      </form>
    </div>
  )
}

function LoginPage() {
  const [viewMode, setViewMode] = useState<'full' | 'compact'>('full');
  const [formSide, setFormSide] = useState<'left' | 'right'>('left');
  
  // Simulated state for compatibility with the user's provided code
  const customLogo = undefined;
  const customBackground = undefined;
  const brandName = "OMG Temple ERP";
  const isSuperAdmin = true;

  return (
    <div className="min-h-screen flex items-center justify-center font-sans transition-all duration-700 p-2 sm:p-4 relative overflow-hidden bg-background">
      <div className="md:hidden absolute inset-0 z-0">
        <img
          src={customBackground || templeBg}
          alt="Background"
          className="w-full h-full object-cover"
        />
        <div
          className="absolute inset-0 backdrop-blur-[2px]"
          style={{ backgroundColor: 'rgba(28, 44, 79, 0.4)' }}
        />
      </div>

      <div
        className={cn(
          'w-full overflow-hidden flex flex-col relative z-10 animate-scale-in transition-all duration-500',
          'shadow-2xl border border-white/20 md:border-border/60',
          'bg-card/95 md:bg-card backdrop-blur-sm md:backdrop-blur-none',
          'min-h-[420px] md:min-h-[500px] lg:min-h-[540px]',
          viewMode === 'full'
            ? 'max-w-4xl lg:max-w-5xl'
            : 'max-w-[360px] md:max-w-md',
          viewMode === 'full' && formSide === 'left' ? 'md:flex-row' : '',
          viewMode === 'full' && formSide === 'right'
            ? 'md:flex-row-reverse'
            : ''
        )}
        style={{ borderRadius: 'var(--radius)' }}
      >
        <div
          className={cn(
            'flex-1 p-4 sm:p-6 md:p-8 lg:p-10 flex flex-col justify-center items-center bg-transparent md:bg-card relative z-20'
          )}
        >
          <div className="flex items-center justify-center gap-3 mb-4 md:mb-8">
            <div className="w-12 h-12 rounded-lg bg-card border border-border/50 flex items-center justify-center shadow-sm overflow-hidden p-1.5">
              <img
                src={customLogo || logo}
                alt="Brand Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <span className="text-base font-display font-bold transition-colors duration-500 capitalize tracking-tight text-foreground">
              {brandName}
            </span>
          </div>

          <LoginForm isCustomized={!!customLogo} />

          <div className="w-full mt-3 md:mt-4 pt-4 md:pt-8 border-t border-border/40 flex flex-wrap items-center justify-center gap-3 lg:gap-4">
            {isSuperAdmin && (
              <div className="w-px h-4 bg-border hidden md:block" />
            )}

            <div className="hidden md:flex items-center gap-5">
              <button
                onClick={() =>
                  setViewMode((prev) => (prev === 'full' ? 'compact' : 'full'))
                }
                className="group flex items-center gap-2 text-[10px] font-bold text-muted-foreground hover:text-secondary transition-all duration-300 capitalize tracking-widest"
              >
                <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center group-hover:bg-muted/80 text-secondary">
                  {viewMode === 'full' ? (
                    <AlignCenter className="w-3.5 h-3.5" />
                  ) : (
                    <Columns className="w-3.5 h-3.5" />
                  )}
                </div>
                {viewMode === 'full' ? 'Compact' : 'Full'}
              </button>

              {viewMode === 'full' && (
                <button
                  onClick={() =>
                    setFormSide((prev) => (prev === 'left' ? 'right' : 'left'))
                  }
                  className="group flex items-center gap-2 text-[10px] font-bold text-muted-foreground hover:text-secondary transition-all duration-300 capitalize tracking-widest"
                >
                  <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center group-hover:bg-muted/80 text-secondary">
                    <Layout className="w-3.5 h-3.5" />
                  </div>
                  Swap
                </button>
              )}
            </div>
          </div>
        </div>
        {viewMode === 'full' && (
          <div
            className={cn(
              'hidden md:block md:w-[50%] relative overflow-hidden transition-all duration-500 group bg-card'
            )}
          >
            <img
              src={customBackground || templeBg}
              alt="Temple Sanctuary"
              className="absolute inset-0 w-full h-full object-cover object-center transition-all duration-1000 group-hover:scale-110"
            />

            <div
              className="absolute inset-0 opacity-80 transition-opacity duration-700 group-hover:opacity-90 mix-blend-multiply"
              style={{
                background: 'linear-gradient(var(--overlay-gradient-angle, 135deg), var(--theme-overlay-start), var(--theme-overlay-mid), var(--theme-overlay-end))'
              }}
            />

            <div className="absolute bottom-10 left-10 right-10 z-30 animate-fade-in-up">
              <p className="text-white/90 text-xs lg:text-sm font-medium capitalize tracking-[0.2em] drop-shadow-md">
                Divine Governance • {brandName}
              </p>
              <h2 className="text-white text-lg lg:text-3xl font-display font-bold capitalize tracking-tight drop-shadow-lg mt-1 lg:mt-2">
                Unified Temple ERP
              </h2>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default LoginPage;
