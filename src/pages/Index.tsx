
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import Hero from '@/components/Hero';

const Index = () => {
  return (
    <div className="flex-1 min-h-screen overflow-x-hidden">
      <Hero />
      
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-3xl font-bold tracking-tight">How It Works</h2>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
              AccountAI uses advanced AI to interpret your business transactions and organize them for you.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
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
                className="glass-panel p-6 text-center animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="inline-flex items-center justify-center p-4 rounded-full bg-primary/10 mb-4">
                  <span className="text-2xl">{item.icon}</span>
                </div>
                <h3 className="text-xl font-medium mb-2">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto max-w-5xl px-4">
          <div className="glass-panel p-8 sm:p-12 md:p-16 text-center animate-fade-in">
            <h2 className="text-3xl font-bold mb-6">Ready to simplify your accounting?</h2>
            <p className="text-muted-foreground max-w-xl mx-auto mb-8">
              Join thousands of businesses using AI to streamline their financial processes and save valuable time.
            </p>
            <Button asChild size="lg" className="px-8">
              <Link to="/auth">Get Started</Link>
            </Button>
          </div>
        </div>
      </section>
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-3xl font-bold tracking-tight">Contact Us</h2>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
              Have questions? We're here to help you get started with AccountAI.
            </p>
          </div>
          <div className="glass-panel p-8 animate-fade-in">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
          <div className="mb-6">
            <h3 className="text-xl font-medium mb-2">Email</h3>
            <a href="mailto:contact@accountai.com" className="text-primary hover:underline">
              contact@accountai.com
            </a>
          </div>
          <div className="mb-6">
            <h3 className="text-xl font-medium mb-2">Phone</h3>
            <a href="tel:+1-555-123-4567" className="text-primary hover:underline">
              +91 8695018620
            </a>
          </div>
          <div>
            <h3 className="text-xl font-medium mb-2">Office Hours</h3>
            <p className="text-muted-foreground">Monday - Saturday</p>
            <p className="text-muted-foreground">9:00 AM - 8:00 PM IST</p>
          </div>
              </div>
              <div className="flex flex-col justify-center">
          <p className="text-muted-foreground mb-4">
            Follow us on social media for updates and tips:
          </p>
          <div className="flex gap-4">
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Twitter</a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">LinkedIn</a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Facebook</a>
          </div>
              </div>
            </div>
          </div>
        </div>
            </section>
      
      
      <footer className="py-12 px-4 bg-background">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <span className="text-xl font-medium">AccountAI</span>
              <span className="text-muted-foreground text-sm">&copy; {new Date().getFullYear()}</span>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Privacy</a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Terms</a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">About</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
