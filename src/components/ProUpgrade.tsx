
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { Sparkles } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';

interface ProUpgradeProps {
  variant?: 'card' | 'inline' | 'minimal';
}

const ProUpgrade: React.FC<ProUpgradeProps> = ({ variant = 'card' }) => {
  const { upgradeAccount, isPro } = useAuth();
  
  if (isPro) {
    return null; // Don't show upgrade prompt for pro users
  }
  
  if (variant === 'minimal') {
    return (
      <Button onClick={upgradeAccount} variant="outline" size="sm" className="flex items-center">
        <Sparkles className="w-3.5 h-3.5 mr-1 text-amber-500" />
        <span>Upgrade</span>
      </Button>
    );
  }
  
  if (variant === 'inline') {
    return (
      <div className="flex items-center justify-between bg-muted/50 p-3 rounded-md">
        <div>
          <p className="font-medium">Upgrade to Pro</p>
          <p className="text-sm text-muted-foreground">Get unlimited transactions and advanced analytics</p>
        </div>
        <Button onClick={upgradeAccount} className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700">
          <Sparkles className="w-4 h-4 mr-1" /> Upgrade
        </Button>
      </div>
    );
  }
  
  return (
    <Card className="border-amber-200 bg-gradient-to-b from-amber-50/50 to-background">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Sparkles className="w-5 h-5 mr-2 text-amber-500" />
          Unlock Pro Features
        </CardTitle>
        <CardDescription>Take your financial tracking to the next level</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-start">
          <div className="mr-2 rounded-full bg-green-500/20 p-1">
            <svg className="h-3 w-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <p className="text-sm">Unlimited transactions</p>
        </div>
        <div className="flex items-start">
          <div className="mr-2 rounded-full bg-green-500/20 p-1">
            <svg className="h-3 w-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <p className="text-sm">Advanced financial analytics</p>
        </div>
        <div className="flex items-start">
          <div className="mr-2 rounded-full bg-green-500/20 p-1">
            <svg className="h-3 w-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <p className="text-sm">Priority support</p>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={upgradeAccount} 
          className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700"
        >
          <Sparkles className="w-4 h-4 mr-2" />
          Upgrade to Pro
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProUpgrade;
