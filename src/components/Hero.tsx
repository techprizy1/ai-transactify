
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden py-20 px-4">
      {/* Background elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-primary/5 animate-float" style={{ animationDelay: '0s' }}></div>
        <div className="absolute top-1/3 right-1/4 w-80 h-80 rounded-full bg-primary/5 animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-1/4 left-1/3 w-72 h-72 rounded-full bg-primary/5 animate-float" style={{ animationDelay: '2s' }}></div>
      </div>
      
      <div className="max-w-5xl mx-auto text-center z-10">
        <div className="space-y-6 animate-fade-in">
          <div className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Introducing AccountAI
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-tight">
            Transform your accounting with <br className="hidden md:block" />
            <span className="text-primary relative">
              artificial intelligence
              <span className="absolute bottom-1 left-0 w-full h-1 bg-primary/20 rounded-full"></span>
            </span>
          </h1>
          
          <p className="text-muted-foreground text-lg md:text-xl max-w-3xl mx-auto">
            Simply describe your business transactions in plain language, and our AI will automatically categorize and record them for you.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
            <Button asChild size="lg" className="w-full sm:w-auto px-8 py-6 text-base">
              <Link to="/transactions">Try it now <ArrowRight className="ml-2 h-5 w-5" /></Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="w-full sm:w-auto px-8 py-6 text-base">
              <Link to="/dashboard">View demo</Link>
            </Button>
          </div>
        </div>
        
        <div className="mt-20 glass-panel p-6 mx-auto max-w-4xl animate-fade-in-up">
          <div className="aspect-video rounded-lg overflow-hidden border border-border/50">
            <div className="w-full h-full bg-card flex items-center justify-center">
              <div className="text-center space-y-4 max-w-lg px-4">
                <p className="text-muted-foreground text-sm">Demo transaction:</p>
                <div className="glass-panel p-6 text-left">
                  <p className="font-medium">User input:</p>
                  <p className="text-muted-foreground mt-2">"Purchased new office equipment for $1,200 from Office Depot yesterday"</p>
                  
                  <div className="border-t border-border my-4"></div>
                  
                  <p className="font-medium">AI interpretation:</p>
                  <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                    <div className="space-y-1">
                      <p className="text-muted-foreground">Type:</p>
                      <p>Purchase</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-muted-foreground">Amount:</p>
                      <p>$1,200.00</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-muted-foreground">Date:</p>
                      <p>Yesterday</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-muted-foreground">Category:</p>
                      <p>Office Equipment</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
