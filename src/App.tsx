import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppLayout } from "./components/layout/AppLayout";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { UserProvider } from "./contexts/UserContext";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Income from "./pages/Income";
import Expenses from "./pages/Expenses";
import Budgets from "./pages/Budgets";
import SharedGoals from "./pages/SharedGoals";
import Subscriptions from "./pages/Subscriptions";
import { SettingsLayout } from "./pages/settings/SettingsLayout";
import { ProfileSettingsPage } from "./pages/settings/ProfileSettingsPage";
import AccountsPage from "./pages/settings/AccountsPage";
import { MembersPage } from "./pages/settings/MembersPage";
import { NotificationsPage } from "./pages/settings/NotificationsPage";
import { FinancialDataLayout } from "./pages/settings/FinancialDataLayout";
import { AccountPreferencesLayout } from "./pages/settings/AccountPreferencesLayout";
import IncomeSourcesPage from "./pages/settings/IncomeSourcesPage";
import CategoriesPage from "./pages/settings/CategoriesPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <UserProvider>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="/" element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }>
              <Route index element={<Dashboard />} />
              <Route path="income" element={<Income />} />
              <Route path="expenses" element={<Expenses />} />
              <Route path="budgets" element={<Budgets />} />
              <Route path="shared-goals" element={<SharedGoals />} />
              <Route path="subscriptions" element={<Subscriptions />} />
              <Route path="settings">
                <Route index element={<Navigate to="profile" replace />} />
                <Route path="profile" element={<ProfileSettingsPage />} />
                <Route path="accounts" element={<AccountsPage />} />
                <Route path="members" element={<MembersPage />} />
                <Route path="notifications" element={<NotificationsPage />} />
                <Route path="categories" element={<CategoriesPage />} />
                <Route path="financial-data" element={<FinancialDataLayout />}>
                  <Route index element={<Navigate to="accounts" replace />} />
                  <Route path="accounts" element={<AccountsPage />} />
                  <Route path="income-sources" element={<IncomeSourcesPage />} />
                </Route>
                <Route path="preferences" element={<AccountPreferencesLayout />}>
                  <Route index element={<Navigate to="profile" replace />} />
                  <Route path="profile" element={<ProfileSettingsPage />} />
                  <Route path="notifications" element={<NotificationsPage />} />
                  <Route path="members" element={<MembersPage />} />
                </Route>
              </Route>
            </Route>
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </UserProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
