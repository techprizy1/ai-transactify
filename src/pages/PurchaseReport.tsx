
import Navbar from '@/components/Navbar';
import { SidebarProvider } from '@/components/ui/sidebar';
import AppSidebar from '@/components/AppSidebar';

const PurchaseReport = () => {
  return (
    <SidebarProvider>
      <div className="flex w-full min-h-screen">
        <AppSidebar />
        <div className="flex-1 min-h-screen pt-20">
          <Navbar />
          
          <main className="container mx-auto max-w-6xl px-4 py-10">
            <div className="text-center mb-12">
              <h1 className="text-3xl font-bold tracking-tight">Purchase Report</h1>
              <p className="mt-2 text-muted-foreground">
                View and analyze your purchase data
              </p>
            </div>
            
            <div className="glass-panel p-6">
              <h2 className="text-xl font-semibold mb-4">Coming Soon</h2>
              <p>The Purchase Report feature is under development.</p>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default PurchaseReport;
