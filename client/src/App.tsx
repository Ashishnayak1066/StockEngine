import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import CompanyList from "@/pages/CompanyList";
import StockDetails from "@/pages/StockDetails";
import Predictions from "@/pages/Predictions";
import Analytics from "@/pages/Analytics";
import Portfolio from "@/pages/Portfolio";
import Settings from "@/pages/Settings";
import Login from "@/pages/Login";
import SignUp from "@/pages/SignUp";
import { AuthProvider, ProtectedRoute } from "@/context/AuthContext";

function Router() {
  return (
    <Switch>
      <Route path="/login" component={Login} />
      <Route path="/signup" component={SignUp} />
      
      {/* Protected Routes */}
      <Route path="/">
        {() => <ProtectedRoute component={CompanyList} />}
      </Route>
      <Route path="/stock/:ticker">
        {(params) => <ProtectedRoute component={StockDetails} params={params} />}
      </Route>
      <Route path="/predictions">
        {() => <ProtectedRoute component={Predictions} />}
      </Route>
      <Route path="/analytics">
        {() => <ProtectedRoute component={Analytics} />}
      </Route>
      <Route path="/portfolio">
        {() => <ProtectedRoute component={Portfolio} />}
      </Route>
      <Route path="/settings">
        {() => <ProtectedRoute component={Settings} />}
      </Route>

      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
