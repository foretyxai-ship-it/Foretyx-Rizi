import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import LoginScreen from "@/screens/LoginScreen";
import EmployeeWorkspace from "@/screens/EmployeeWorkspace";
import AdminDashboard from "@/screens/AdminDashboard";

const queryClient = new QueryClient();

function AppContent() {
  console.log("AppContent rendering...");
  const { user } = useAuth();
  console.log("Current user:", user);

  if (!user) return <LoginScreen />;
  if (user.role === 'employee') return <EmployeeWorkspace />;
  return <AdminDashboard />;
}

const App = () => {
  console.log("App component starting...");
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <AppContent />
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
