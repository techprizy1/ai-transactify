import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { 
  Home, 
  LineChart, 
  PlusCircle, 
  FileText, 
  ShoppingCart, 
  TrendingUp, 
  TrendingDown,
  User,
  LogOut,
  Receipt,
  Settings,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from '@/context/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CircleDollarSign } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useState, useEffect } from 'react';

export function AppSidebar() {
  const location = useLocation();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  const isActive = (path: string) => location.pathname === path;

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const getInitials = () => {
    if (!user || !user.email) return '?';
    return user.email.charAt(0).toUpperCase();
  };

  return (
    <Sidebar className="bg-gradient-to-b from-background to-background/80 backdrop-blur-sm border-r border-border/30">
      <SidebarContent>
        {/* Logo/Brand */}
        <SidebarGroup className="py-6">
          <Link to="/" className="flex items-center space-x-3 px-6">
            <div className="relative">
              <div className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-primary to-purple-600 opacity-75 blur"></div>
              <CircleDollarSign className="relative w-9 h-9 text-primary-foreground bg-primary rounded-full p-1.5" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">AccountAI</span>
          </Link>
        </SidebarGroup>

        {/* Main Navigation */}
        <SidebarGroup className="px-3">
          <SidebarGroupContent>
            <SidebarMenu>
              {mounted && ['/', '/dashboard', '/transactions'].map((path, i) => {
                const isCurrentActive = isActive(path);
                const icons = {
                  '/': <Home className={`${isCurrentActive ? 'text-primary' : ''}`} />,
                  '/dashboard': <LineChart className={`${isCurrentActive ? 'text-primary' : ''}`} />,
                  '/transactions': <PlusCircle className={`${isCurrentActive ? 'text-primary' : ''}`} />
                };
                const labels = {
                  '/': 'Home',
                  '/dashboard': 'Dashboard',
                  '/transactions': 'New Transaction'
                };
                const tooltips = {
                  '/': 'Home',
                  '/dashboard': 'Dashboard',
                  '/transactions': 'New Transaction'
                };
                
                return (
                  <div key={path} className="animate-fadeIn" style={{ animationDelay: `${i * 100}ms` }}>
                    <SidebarMenuItem>
                      <SidebarMenuButton 
                        asChild 
                        isActive={isCurrentActive} 
                        tooltip={tooltips[path as keyof typeof tooltips]}
                        className={`${isCurrentActive ? 'bg-primary/10 hover:bg-primary/15' : 'hover:bg-accent/50'} transition-all duration-200 rounded-lg my-1`}
                      >
                        <Link to={path} className="flex items-center gap-3 p-2.5 pl-3">
                          {icons[path as keyof typeof icons]}
                          <span className={`${isCurrentActive ? 'font-medium text-primary' : ''}`}>
                            {labels[path as keyof typeof labels]}
                          </span>
                          {isCurrentActive && (
                            <div
                              className="absolute left-0 w-1 h-6 bg-primary rounded-r-full"
                            />
                          )}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </div>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Sales Group */}
        <SidebarGroup className="mt-6 px-3">
          <SidebarGroupLabel className="px-4 text-xs uppercase tracking-widest text-muted-foreground/80 font-semibold">
            Sales
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mounted && ['/invoice', '/sales-report'].map((path, i) => {
                const isCurrentActive = isActive(path);
                const icons = {
                  '/invoice': <FileText className={`${isCurrentActive ? 'text-primary' : ''}`} />,
                  '/sales-report': <TrendingUp className={`${isCurrentActive ? 'text-primary' : ''}`} />
                };
                const labels = {
                  '/invoice': 'Invoice',
                  '/sales-report': 'Sales Report'
                };
                const tooltips = {
                  '/invoice': 'Invoice',
                  '/sales-report': 'Sales Report'
                };
                
                return (
                  <div key={path} className="animate-fadeIn" style={{ animationDelay: `${(i + 3) * 100}ms` }}>
                    <SidebarMenuItem>
                      <SidebarMenuButton 
                        asChild 
                        isActive={isCurrentActive} 
                        tooltip={tooltips[path as keyof typeof tooltips]}
                        className={`${isCurrentActive ? 'bg-primary/10 hover:bg-primary/15' : 'hover:bg-accent/50'} transition-all duration-200 rounded-lg my-1`}
                      >
                        <Link to={path} className="flex items-center gap-3 p-2.5 pl-3">
                          {icons[path as keyof typeof icons]}
                          <span className={`${isCurrentActive ? 'font-medium text-primary' : ''}`}>
                            {labels[path as keyof typeof labels]}
                          </span>
                          {isCurrentActive && (
                            <div
                              className="absolute left-0 w-1 h-6 bg-primary rounded-r-full"
                            />
                          )}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </div>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Purchase Group */}
        <SidebarGroup className="mt-6 px-3">
          <SidebarGroupLabel className="px-4 text-xs uppercase tracking-widest text-muted-foreground/80 font-semibold">
            Purchase
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mounted && ['/purchase-orders', '/purchase-report'].map((path, i) => {
                const isCurrentActive = isActive(path);
                const icons = {
                  '/purchase-orders': <ShoppingCart className={`${isCurrentActive ? 'text-primary' : ''}`} />,
                  '/purchase-report': <TrendingDown className={`${isCurrentActive ? 'text-primary' : ''}`} />
                };
                const labels = {
                  '/purchase-orders': 'Purchase Orders',
                  '/purchase-report': 'Purchase Report'
                };
                const tooltips = {
                  '/purchase-orders': 'Purchase Orders',
                  '/purchase-report': 'Purchase Report'
                };
                
                return (
                  <div key={path} className="animate-fadeIn" style={{ animationDelay: `${(i + 5) * 100}ms` }}>
                    <SidebarMenuItem>
                      <SidebarMenuButton 
                        asChild 
                        isActive={isCurrentActive} 
                        tooltip={tooltips[path as keyof typeof tooltips]}
                        className={`${isCurrentActive ? 'bg-primary/10 hover:bg-primary/15' : 'hover:bg-accent/50'} transition-all duration-200 rounded-lg my-1`}
                      >
                        <Link to={path} className="flex items-center gap-3 p-2.5 pl-3">
                          {icons[path as keyof typeof icons]}
                          <span className={`${isCurrentActive ? 'font-medium text-primary' : ''}`}>
                            {labels[path as keyof typeof labels]}
                          </span>
                          {isCurrentActive && (
                            <div
                              className="absolute left-0 w-1 h-6 bg-primary rounded-r-full"
                            />
                          )}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </div>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Expense Group */}
        <SidebarGroup className="mt-6 px-3">
          <SidebarGroupLabel className="px-4 text-xs uppercase tracking-widest text-muted-foreground/80 font-semibold">
            Expense
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mounted && ['/expense-report'].map((path, i) => {
                const isCurrentActive = isActive(path);
                const icons = {
                  '/expense-report': <Receipt className={`${isCurrentActive ? 'text-primary' : ''}`} />
                };
                const labels = {
                  '/expense-report': 'Expense Report'
                };
                const tooltips = {
                  '/expense-report': 'Expense Report'
                };
                
                return (
                  <div key={path} className="animate-fadeIn" style={{ animationDelay: `${(i + 7) * 100}ms` }}>
                    <SidebarMenuItem>
                      <SidebarMenuButton 
                        asChild 
                        isActive={isCurrentActive} 
                        tooltip={tooltips[path as keyof typeof tooltips]}
                        className={`${isCurrentActive ? 'bg-primary/10 hover:bg-primary/15' : 'hover:bg-accent/50'} transition-all duration-200 rounded-lg my-1`}
                      >
                        <Link to={path} className="flex items-center gap-3 p-2.5 pl-3">
                          {icons[path as keyof typeof icons]}
                          <span className={`${isCurrentActive ? 'font-medium text-primary' : ''}`}>
                            {labels[path as keyof typeof labels]}
                          </span>
                          {isCurrentActive && (
                            <div
                              className="absolute left-0 w-1 h-6 bg-primary rounded-r-full"
                            />
                          )}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </div>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      {/* Footer with user profile or auth options */}
      <SidebarFooter className="p-4 border-t border-border/30 bg-muted/30 backdrop-blur-sm">
        {user ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full h-10 w-10 p-0 relative overflow-hidden ring-2 ring-primary/10 hover:ring-primary/30 transition-all duration-200">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-gradient-to-br from-primary to-purple-600 text-primary-foreground font-medium">
                        {getInitials()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="flex flex-col p-2 gap-1.5 border-b pb-2 mb-1">
                    <span className="font-medium">{user.email}</span>
                    {user.email && <span className="text-xs text-muted-foreground">{user.email}</span>}
                  </div>
                  <DropdownMenuItem onClick={() => navigate('/profile')} className="py-2 cursor-pointer">
                    <User className="mr-2 h-4 w-4 text-primary" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/settings')} className="py-2 cursor-pointer">
                    <Settings className="mr-2 h-4 w-4 text-primary" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleSignOut} className="py-2 cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4 text-destructive" />
                    <span className="text-destructive">Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              {user.email && (
                <div className="ml-3 flex flex-col">
                  <span className="text-sm font-medium">User</span>
                  <span className="text-xs text-muted-foreground">{user.email}</span>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <Button variant="outline" size="sm" onClick={() => navigate('/auth')} className="w-full justify-start">
              <User className="mr-2 h-4 w-4" />
              Sign In
            </Button>
            <Button size="sm" onClick={() => navigate('/auth')} className="w-full bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-700">
              Get Started
            </Button>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}

export default AppSidebar;
