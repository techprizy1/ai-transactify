
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';

const Hero = () => {
  const isMobile = useIsMobile();
  
  return (
    <section className="relative min-h-[90vh] md:min-h-screen flex items-center justify-center overflow-hidden py-12 md:py-20 px-4">
      {/* Background elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 md:w-64 md:h-64 rounded-full bg-primary/5 animate-float" style={{ animationDelay: '0s' }}></div>
        <div className="absolute top-1/3 right-1/4 w-40 h-40 md:w-80 md:h-80 rounded-full bg-primary/5 animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-1/4 left-1/3 w-36 h-36 md:w-72 md:h-72 rounded-full bg-primary/5 animate-float" style={{ animationDelay: '2s' }}></div>
      </div>
      
      <div className="max-w-5xl mx-auto text-center z-10">
        <div className="space-y-4 md:space-y-6 animate-fade-in">
          <div className="inline-block px-3 py-1 md:px-4 md:py-1.5 rounded-full bg-primary/10 text-primary text-xs md:text-sm font-medium mb-3 md:mb-4">
            Introducing AccountAI
          </div>
          
          <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold tracking-tight leading-tight">
            Transform your accounting with <br className="hidden md:block" />
            <span className="text-primary relative">
              artificial intelligence
              <span className="absolute bottom-0.5 md:bottom-1 left-0 w-full h-0.5 md:h-1 bg-primary/20 rounded-full"></span>
            </span>
          </h1>
          
          <p className="text-base md:text-lg lg:text-xl max-w-3xl mx-auto text-muted-foreground">
            Simply describe your business transactions in plain language, and our AI will automatically categorize and record them for you.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4 pt-4 md:pt-6">
            <Button asChild size={isMobile ? "default" : "lg"} className="w-full sm:w-auto px-4 sm:px-8 py-2 md:py-6 text-sm md:text-base">
              <Link to="/transactions">Try it now <ArrowRight className="ml-1 md:ml-2 h-4 w-4 md:h-5 md:w-5" /></Link>
            </Button>
            <Button asChild variant="outline" size={isMobile ? "default" : "lg"} className="w-full sm:w-auto px-4 sm:px-8 py-2 md:py-6 text-sm md:text-base">
              <Link to="/dashboard">View demo</Link>
            </Button>
          </div>
        </div>
        
        <div className="mt-12 md:mt-20 glass-panel p-3 md:p-6 mx-auto max-w-4xl animate-fade-in-up">
          <div className="aspect-video rounded-lg overflow-hidden border border-border/50">
            <div className="w-full h-full bg-card flex items-center justify-center">
              <div className="text-center space-y-3 md:space-y-4 max-w-lg px-3 md:px-4">
                <p className="text-muted-foreground text-xs md:text-sm">Demo transaction:</p>
                <div className="glass-panel p-3 md:p-6 text-left">
                  <p className="font-medium text-sm md:text-base">User input:</p>
                  <p className="text-muted-foreground mt-1 md:mt-2 text-xs md:text-sm">
                    "Purchased new office equipment for $1,200 from Office Depot yesterday"
                  </p>
                  
                  <div className="border-t border-border my-3 md:my-4"></div>
                  
                  <p className="font-medium text-sm md:text-base">AI interpretation:</p>
                  <div className="mt-1 md:mt-2 grid grid-cols-2 gap-1 md:gap-2 text-xs md:text-sm">
                    <div className="space-y-0.5 md:space-y-1">
                      <p className="text-muted-foreground">Type:</p>
                      <p>Purchase</p>
                    </div>
                    <div className="space-y-0.5 md:space-y-1">
                      <p className="text-muted-foreground">Amount:</p>
                      <p>$1,200.00</p>
                    </div>
                    <div className="space-y-0.5 md:space-y-1">
                      <p className="text-muted-foreground">Date:</p>
                      <p>Yesterday</p>
                    </div>
                    <div className="space-y-0.5 md:space-y-1">
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
