
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import { Badge } from '@/components/ui/badge';
import { Crown, CreditCard, Settings as SettingsIcon } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';

const Settings = () => {
  const { toast } = useToast();
  const { user, isPro, setIsPro } = useAuth();
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Demo effect: load settings from localStorage
    const savedEmailNotifications = localStorage.getItem('emailNotifications') === 'true';
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    
    setEmailNotifications(savedEmailNotifications);
    setDarkMode(savedDarkMode);
  }, []);
  
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Demo effect: save settings to localStorage
    localStorage.setItem('emailNotifications', emailNotifications.toString());
    localStorage.setItem('darkMode', darkMode.toString());
    
    toast({
      title: "Settings saved",
      description: "Your preferences have been updated successfully.",
    });
  };
  
  const handleUpgradeToPro = () => {
    // In a real application, this would redirect to a payment processor
    // For this demo, we'll just toggle the Pro status
    setIsPro(true);
    toast({
      title: "Upgraded to Pro!",
      description: "You now have access to all premium features.",
    });
  };
  
  const handleDowngradeToFree = () => {
    setIsPro(false);
    toast({
      title: "Downgraded to Beta",
      description: "Your account has been downgraded to the Beta plan.",
    });
  };

  return (
    <div className="flex-1 p-8 pt-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">Manage your account settings and preferences.</p>
        </div>
      </div>
      
      {/* Subscription Plans */}
      <Card className="mb-8">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Subscription Plan</CardTitle>
              <CardDescription>Manage your subscription and billing</CardDescription>
            </div>
            <Badge variant={isPro ? "default" : "outline"} className="flex items-center gap-1">
              {isPro ? (
                <>
                  <Crown className="h-3 w-3" />
                  <span>PRO</span>
                </>
              ) : (
                <span>BETA</span>
              )}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Beta Plan */}
            <Card className={`border-2 ${!isPro ? 'border-primary' : 'border-muted'}`}>
              <CardHeader>
                <CardTitle>Beta Plan</CardTitle>
                <CardDescription>Limited functionality for new users</CardDescription>
                <div className="text-3xl font-bold mt-2">Free</div>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center">
                    <span className="mr-2">✅</span>
                    Record transactions with AI
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2">✅</span>
                    Basic financial reports
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2">⚠️</span>
                    Limited to 5 transactions per day
                  </li>
                  <li className="flex items-center text-muted-foreground">
                    <span className="mr-2">❌</span>
                    Advanced financial analysis
                  </li>
                  <li className="flex items-center text-muted-foreground">
                    <span className="mr-2">❌</span>
                    Bulk transaction import
                  </li>
                </ul>
                
                {isPro ? (
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={handleDowngradeToFree}
                  >
                    Downgrade to Beta
                  </Button>
                ) : (
                  <Button 
                    variant="secondary" 
                    className="w-full"
                    disabled
                  >
                    Current Plan
                  </Button>
                )}
              </CardContent>
            </Card>
            
            {/* Pro Plan */}
            <Card className={`border-2 ${isPro ? 'border-primary' : 'border-muted'}`}>
              <CardHeader>
                <CardTitle>Pro Plan</CardTitle>
                <CardDescription>Full access to all features</CardDescription>
                <div className="text-3xl font-bold mt-2">₹499<span className="text-sm font-normal">/month</span></div>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center">
                    <span className="mr-2">✅</span>
                    Record transactions with AI
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2">✅</span>
                    Advanced financial reports
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2">✅</span>
                    <strong>Unlimited</strong> transactions
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2">✅</span>
                    Advanced financial analysis
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2">✅</span>
                    Bulk transaction import
                  </li>
                </ul>
                
                {isPro ? (
                  <Button 
                    variant="secondary" 
                    className="w-full"
                    disabled
                  >
                    Current Plan
                  </Button>
                ) : (
                  <Button 
                    variant="default" 
                    className="w-full"
                    onClick={handleUpgradeToPro}
                  >
                    <CreditCard className="mr-2 h-4 w-4" />
                    Upgrade to Pro
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
          
          <div className="text-sm text-muted-foreground">
            <p>
              For demonstration purposes, you can freely switch between Beta and Pro plans.
              In a production application, this would involve a payment processor integration.
            </p>
          </div>
        </CardContent>
      </Card>
      
      {/* General Settings Form */}
      <form onSubmit={handleSaveSettings}>
        <Card>
          <CardHeader>
            <CardTitle>General Settings</CardTitle>
            <CardDescription>Manage your application preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive email notifications about activity and updates
                  </p>
                </div>
                <Switch 
                  checked={emailNotifications}
                  onCheckedChange={setEmailNotifications}
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Dark Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    Switch between light and dark theme
                  </p>
                </div>
                <Switch 
                  checked={darkMode}
                  onCheckedChange={setDarkMode}
                />
              </div>
            </div>
            
            <div className="flex justify-end">
              <Button type="submit">
                <SettingsIcon className="mr-2 h-4 w-4" />
                Save Settings
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
};

export default Settings;
