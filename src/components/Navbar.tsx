
import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { CircleDollarSign, LineChart, PlusCircle, Home, LogOut, User, FileText } from "lucide-react";
import { useAuth } from '@/context/AuthContext';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const Navbar = () => {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const getInitials = () => {
    if (!user || !user.email) return '?';
    return user.email.charAt(0).toUpperCase();
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
      scrolled ? 'bg-white/80 dark:bg-black/80 backdrop-blur-md shadow-sm' : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <CircleDollarSign className="w-8 h-8 text-primary" />
          <span className="text-xl font-medium">AccountAI</span>
        </Link>
        
        <nav className="hidden md:flex items-center space-x-1">
          <Button asChild variant="ghost" className={location.pathname === '/' ? 'bg-muted' : ''}>
            <Link to="/" className="flex items-center space-x-1">
              <Home className="w-4 h-4 mr-1" />
              <span>Home</span>
            </Link>
          </Button>
          
          {user && (
            <>
              <Button asChild variant="ghost" className={location.pathname === '/dashboard' ? 'bg-muted' : ''}>
                <Link to="/dashboard" className="flex items-center space-x-1">
                  <LineChart className="w-4 h-4 mr-1" />
                  <span>Dashboard</span>
                </Link>
              </Button>
              <Button asChild variant="ghost" className={location.pathname === '/transactions' ? 'bg-muted' : ''}>
                <Link to="/transactions" className="flex items-center space-x-1">
                  <PlusCircle className="w-4 h-4 mr-1" />
                  <span>New Transaction</span>
                </Link>
              </Button>
              <Button asChild variant="ghost" className={location.pathname === '/invoice' ? 'bg-muted' : ''}>
                <Link to="/invoice" className="flex items-center space-x-1">
                  <FileText className="w-4 h-4 mr-1" />
                  <span>Invoice</span>
                </Link>
              </Button>
            </>
          )}
        </nav>
        
        <div className="flex items-center space-x-4">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full h-8 w-8">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>{getInitials()}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => navigate('/profile')}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button variant="outline" size="sm" className="hidden md:flex" onClick={() => navigate('/auth')}>
                Sign In
              </Button>
              <Button size="sm" className="hidden md:flex" onClick={() => navigate('/auth')}>
                Get Started
              </Button>
            </>
          )}
          
          {/* Mobile menu button */}
          <Button variant="ghost" size="icon" className="md:hidden">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-menu">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
