
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import Invoice from "./pages/Invoice";
import Profile from "./pages/Profile";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import SalesReport from "./pages/SalesReport";
import PurchaseOrders from "./pages/PurchaseOrders";
import PurchaseReport from "./pages/PurchaseReport";
import ExpenseReport from "./pages/ExpenseReport";
import PLAccount from "./pages/PLAccount";
import BalanceSheet from "./pages/BalanceSheet";
import FinancialAnalysis from "./pages/FinancialAnalysis";
import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/components/AppSidebar";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public routes without sidebar */}
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="*" element={<NotFound />} />
            
            {/* Protected routes with sidebar */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <SidebarProvider>
                  <div className="flex w-full min-h-screen">
                    <AppSidebar />
                    <Dashboard />
                  </div>
                </SidebarProvider>
              </ProtectedRoute>
            } />
            <Route path="/transactions" element={
              <ProtectedRoute>
                <SidebarProvider>
                  <div className="flex w-full min-h-screen">
                    <AppSidebar />
                    <Transactions />
                  </div>
                </SidebarProvider>
              </ProtectedRoute>
            } />
            <Route path="/invoice" element={
              <ProtectedRoute>
                <SidebarProvider>
                  <div className="flex w-full min-h-screen">
                    <AppSidebar />
                    <Invoice />
                  </div>
                </SidebarProvider>
              </ProtectedRoute>
            } />
            <Route path="/sales-report" element={
              <ProtectedRoute>
                <SidebarProvider>
                  <div className="flex w-full min-h-screen">
                    <AppSidebar />
                    <SalesReport />
                  </div>
                </SidebarProvider>
              </ProtectedRoute>
            } />
            <Route path="/purchase-orders" element={
              <ProtectedRoute>
                <SidebarProvider>
                  <div className="flex w-full min-h-screen">
                    <AppSidebar />
                    <PurchaseOrders />
                  </div>
                </SidebarProvider>
              </ProtectedRoute>
            } />
            <Route path="/purchase-report" element={
              <ProtectedRoute>
                <SidebarProvider>
                  <div className="flex w-full min-h-screen">
                    <AppSidebar />
                    <PurchaseReport />
                  </div>
                </SidebarProvider>
              </ProtectedRoute>
            } />
            <Route path="/expense-report" element={
              <ProtectedRoute>
                <SidebarProvider>
                  <div className="flex w-full min-h-screen">
                    <AppSidebar />
                    <ExpenseReport />
                  </div>
                </SidebarProvider>
              </ProtectedRoute>
            } />
            
            {/* New Reporting routes */}
            <Route path="/pl-account" element={
              <ProtectedRoute>
                <SidebarProvider>
                  <div className="flex w-full min-h-screen">
                    <AppSidebar />
                    <PLAccount />
                  </div>
                </SidebarProvider>
              </ProtectedRoute>
            } />
            <Route path="/balance-sheet" element={
              <ProtectedRoute>
                <SidebarProvider>
                  <div className="flex w-full min-h-screen">
                    <AppSidebar />
                    <BalanceSheet />
                  </div>
                </SidebarProvider>
              </ProtectedRoute>
            } />
            <Route path="/financial-analysis" element={
              <ProtectedRoute>
                <SidebarProvider>
                  <div className="flex w-full min-h-screen">
                    <AppSidebar />
                    <FinancialAnalysis />
                  </div>
                </SidebarProvider>
              </ProtectedRoute>
            } />
            
            <Route path="/profile" element={
              <ProtectedRoute>
                <SidebarProvider>
                  <div className="flex w-full min-h-screen">
                    <AppSidebar />
                    <Profile />
                  </div>
                </SidebarProvider>
              </ProtectedRoute>
            } />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
