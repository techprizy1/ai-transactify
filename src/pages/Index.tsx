
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import Hero from '@/components/Hero';
import { useIsMobile } from '@/hooks/use-mobile';

const Index = () => {
  const isMobile = useIsMobile();
  
  return (
    <div className="flex-1 min-h-screen overflow-x-hidden">
      <Hero />
      
      <section className="py-12 md:py-20 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-10 md:mb-16 animate-fade-in">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">How It Works</h2>
            <p className="mt-3 md:mt-4 text-sm md:text-base text-muted-foreground max-w-2xl mx-auto">
              AccountAI uses advanced AI to interpret your business transactions and organize them for you.
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
            {[
              {
                title: "Describe your transaction",
                description: "Tell us about your business transaction in plain language, just like you'd tell a colleague.",
                icon: "💬"
              },
              {
                title: "AI analysis",
                description: "Our advanced AI model interprets your description and extracts all relevant accounting information.",
                icon: "🧠"
              },
              {
                title: "Automatic categorization",
                description: "Each transaction is automatically categorized and recorded in your accounting system.",
                icon: "📊"
              }
            ].map((item, index) => (
              <div 
                key={index} 
                className="glass-panel p-4 md:p-6 text-center animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="inline-flex items-center justify-center p-3 md:p-4 rounded-full bg-primary/10 mb-3 md:mb-4">
                  <span className="text-xl md:text-2xl">{item.icon}</span>
                </div>
                <h3 className="text-lg md:text-xl font-medium mb-1 md:mb-2">{item.title}</h3>
                <p className="text-sm md:text-base text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      <section className="py-12 md:py-20 bg-muted/30">
        <div className="container mx-auto max-w-5xl px-4">
          <div className="glass-panel p-6 sm:p-8 md:p-12 lg:p-16 text-center animate-fade-in">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6">Ready to simplify your accounting?</h2>
            <p className="text-sm md:text-base text-muted-foreground max-w-xl mx-auto mb-6 md:mb-8">
              Join thousands of businesses using AI to streamline their financial processes and save valuable time.
            </p>
            <Button asChild size={isMobile ? "default" : "lg"} className="px-6 md:px-8">
              <Link to="/auth">Get Started</Link>
            </Button>
          </div>
        </div>
      </section>
      
      <footer className="py-8 md:py-12 px-4 bg-background">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <span className="text-lg md:text-xl font-medium">AccountAI</span>
              <span className="text-muted-foreground text-xs md:text-sm">&copy; {new Date().getFullYear()}</span>
            </div>
            <div className="flex space-x-4 md:space-x-6">
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Privacy</a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Terms</a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">About</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
