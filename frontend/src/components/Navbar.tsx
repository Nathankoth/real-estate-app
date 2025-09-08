import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X, ArrowRight, LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';

export function Navbar() {
  const { user, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  
  const handleSignOut = async () => {
    await signOut();
    setOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 backdrop-blur-xl bg-black/40 border-b border-white/10 shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
        {/* Logo & Brand */}
        <Link to="/" className="flex items-center space-x-3">
          <img
            src="/vistaforge-logo.png"
            alt="Vista Forge Logo"
            className="h-8 w-8"
          />
          <span className="text-white font-bold text-lg">
            Vista Forge
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-8 text-white font-medium">
          <a href="#features" className="hover:text-yellow-400 transition">
            Features
          </a>
          <a href="#benefits" className="hover:text-yellow-400 transition">
            Benefits
          </a>
          <Link to="/pricing" className="hover:text-yellow-400 transition">
            Pricing
          </Link>
        </div>

        {/* Desktop Actions & Mobile Toggle */}
        <div className="flex items-center space-x-4">
          {user ? (
            <div className="hidden md:flex items-center space-x-3">
              <Link to="/dashboard">
                <Button className="luxury-gradient shadow-button">
                  Dashboard
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Button 
                variant="ghost" 
                className="text-white hover:text-yellow-400"
                onClick={handleSignOut}
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <>
              <Link to="/auth" className="hidden md:block">
                <Button variant="ghost" className="text-white hover:text-yellow-400">
                  Sign In
                </Button>
              </Link>
              <Link to="/auth" className="hidden md:block">
                <Button className="luxury-gradient shadow-button">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </>
          )}
          
          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white"
            onClick={() => setOpen(!open)}
          >
            {open ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {open && (
        <div className="md:hidden bg-black/80 backdrop-blur-xl border-t border-white/10 p-6 space-y-4 text-white font-medium">
          <a href="#features" className="block hover:text-yellow-400 py-2" onClick={() => setOpen(false)}>
            Features
          </a>
          <a href="#benefits" className="block hover:text-yellow-400 py-2" onClick={() => setOpen(false)}>
            Benefits
          </a>
          <Link to="/pricing" className="block hover:text-yellow-400 py-2" onClick={() => setOpen(false)}>
            Pricing
          </Link>
          
          <div className="pt-4 border-t border-white/20 space-y-3">
            {user ? (
              <>
                <Link to="/dashboard" onClick={() => setOpen(false)}>
                  <Button className="w-full luxury-gradient shadow-button">
                    Dashboard
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Button 
                  variant="ghost" 
                  className="w-full text-white hover:text-yellow-400"
                  onClick={handleSignOut}
                >
                  Sign Out
                  <LogOut className="ml-2 h-4 w-4" />
                </Button>
              </>
            ) : (
              <>
                <Link to="/auth" onClick={() => setOpen(false)}>
                  <Button variant="ghost" className="w-full text-white hover:text-yellow-400">
                    Sign In
                  </Button>
                </Link>
                <Link to="/auth" onClick={() => setOpen(false)}>
                  <Button className="w-full luxury-gradient shadow-button">
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}