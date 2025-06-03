
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import PrivateRoute from "@/components/PrivateRoute";
import AdminLayout from "@/components/layouts/AdminLayout";
import AffiliatorLayout from "@/components/layouts/AffiliatorLayout";
import Login from "@/pages/Login";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AddCustomer from "@/pages/admin/AddCustomer";
import AffiliatorList from "@/pages/admin/AffiliatorList";
import AffiliatorDetail from "@/pages/admin/AffiliatorDetail";
import AddPayment from "@/pages/admin/AddPayment";
import PaymentHistoryAdmin from "@/pages/admin/PaymentHistoryAdmin";
import AffiliatorDashboard from "@/pages/affiliator/AffiliatorDashboard";
import PaymentHistory from "@/pages/affiliator/PaymentHistory";
import NotFound from "./pages/NotFound";
import ThemeToggle from "@/components/ThemeToggle";

const queryClient = new QueryClient();

const AppContent = () => {
  return (
    <>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        
        {/* Protected Admin Routes */}
        <Route 
          path="/admin" 
          element={
            <PrivateRoute roles={['ADMIN']}>
              <AdminLayout>
                <AdminDashboard />
              </AdminLayout>
            </PrivateRoute>
          } 
        />
        
        <Route 
          path="/admin/add-customer" 
          element={
            <PrivateRoute roles={['ADMIN']}>
              <AdminLayout>
                <AddCustomer />
              </AdminLayout>
            </PrivateRoute>
          } 
        />
        
        <Route 
          path="/admin/affiliators" 
          element={
            <PrivateRoute roles={['ADMIN']}>
              <AdminLayout>
                <AffiliatorList />
              </AdminLayout>
            </PrivateRoute>
          } 
        />
        
        <Route 
          path="/admin/affiliators/:id" 
          element={
            <PrivateRoute roles={['ADMIN']}>
              <AdminLayout>
                <AffiliatorDetail />
              </AdminLayout>
            </PrivateRoute>
          } 
        />
        
        <Route 
          path="/admin/payments" 
          element={
            <PrivateRoute roles={['ADMIN']}>
              <AdminLayout>
                <AddPayment />
              </AdminLayout>
            </PrivateRoute>
          } 
        />
        
        <Route 
          path="/admin/payments/affiliator/:id" 
          element={
            <PrivateRoute roles={['ADMIN']}>
              <AdminLayout>
                <PaymentHistoryAdmin />
              </AdminLayout>
            </PrivateRoute>
          } 
        />
        
        {/* Protected Affiliator Routes */}
        <Route 
          path="/affiliator" 
          element={
            <PrivateRoute roles={['AFFILIATOR']}>
              <AffiliatorLayout>
                <AffiliatorDashboard />
              </AffiliatorLayout>
            </PrivateRoute>
          } 
        />
        
        <Route 
          path="/affiliator/payments" 
          element={
            <PrivateRoute roles={['AFFILIATOR']}>
              <AffiliatorLayout>
                <PaymentHistory />
              </AffiliatorLayout>
            </PrivateRoute>
          } 
        />
        
        {/* Root redirect */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        {/* Catch-all 404 route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      
      <ThemeToggle />
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AuthProvider>
          <BrowserRouter>
            <AppContent />
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
