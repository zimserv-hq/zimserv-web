// src/App.tsx
import { Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import ScrollToTop from "./components/ScrollToTop";
import ProtectedRoute from "./components/ProtectedRoute";

// Public Pages
import HomePage from "./pages/HomePage";
import ProvidersPage from "./pages/ProvidersPage";
import CategoriesPage from "./pages/CategoriesPage";
import ProviderProfilePage from "./pages/ProviderProfilePage";
import BecomeProviderPage from "./pages/BecomeProviderPage";
import ProviderOnboarding from "./pages/ProviderOnboarding";

// ✅ NEW: Auth Pages
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import AuthCallbackPage from "./pages/AuthCallbackPage";

import HostRedirector from "./components/HostRedirector";

// Admin Pages
import AdminLayout from "./components/Admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProviders from "./pages/admin/AdminProviders";
import AdminProviderDetails from "./pages/admin/AdminProviderDetails";
import AdminReviews from "./pages/admin/AdminReviews";
import AdminCategories from "./pages/admin/AdminCategories";
import AdminApplications from "./pages/admin/AdminApplications";
import AdminApplicationDetails from "./pages/admin/AdminApplicationDetails";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminManagement from "./pages/admin/AdminManagement";

// Provider Panel Pages
import ProviderLayout from "./components/ProviderPanel/ProviderLayout";
import ProviderLogin from "./pages/provider/ProviderLogin";
import ProviderDashboard from "./pages/provider/ProviderDashboard";
import ProviderJobs from "./pages/provider/ProviderJobs";
import ProviderReviews from "./pages/provider/ProviderReviews";
import ProviderProfile from "./pages/provider/ProviderProfile";

function App() {
  return (
    <>
      <ScrollToTop />
      <HostRedirector />

      <Routes>
        {/* ── ADMIN ─────────────────────────────────────────── */}
        <Route path="/admin" element={<Navigate to="/admin/login" replace />} />
        <Route path="/admin/login" element={<AdminLogin />} />

        <Route
          path="/admin"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="applications" element={<AdminApplications />} />
          <Route
            path="applications/:id"
            element={<AdminApplicationDetails />}
          />
          <Route path="providers" element={<AdminProviders />} />
          <Route path="providers/:id" element={<AdminProviderDetails />} />
          <Route path="reviews" element={<AdminReviews />} />
          <Route path="categories" element={<AdminCategories />} />
          <Route path="users" element={<AdminUsers />} />
          <Route
            path="management"
            element={
              <ProtectedRoute requiredRole="super_admin">
                <AdminManagement />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* ── PROVIDER PANEL ────────────────────────────────── */}
        <Route
          path="/provider"
          element={<Navigate to="/provider/login" replace />}
        />
        <Route path="/provider/login" element={<ProviderLogin />} />

        <Route
          path="/provider"
          element={
            <ProtectedRoute requiredRole="provider">
              <ProviderLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<ProviderDashboard />} />
          <Route path="jobs" element={<ProviderJobs />} />
          <Route path="reviews" element={<ProviderReviews />} />
          <Route path="profile" element={<ProviderProfile />} />
        </Route>

        {/* ── AUTH — no Header/Footer (standalone pages) ────── */}
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/auth/callback" element={<AuthCallbackPage />} />

        {/* ── PUBLIC ────────────────────────────────────────── */}
        <Route
          path="/"
          element={
            <>
              <Header />
              <HomePage />
              <Footer />
            </>
          }
        />
        <Route
          path="/providers"
          element={
            <>
              <Header />
              <ProvidersPage />
              <Footer />
            </>
          }
        />
        <Route
          path="/categories"
          element={
            <>
              <Header />
              <CategoriesPage />
              <Footer />
            </>
          }
        />
        <Route
          path="/become-provider"
          element={
            <>
              <Header />
              <BecomeProviderPage />
              <Footer />
            </>
          }
        />
        <Route
          path="/provider/onboarding"
          element={
            <>
              <Header />
              <ProviderOnboarding />
              <Footer />
            </>
          }
        />
        <Route
          path="/providers/:slug"
          element={
            <>
              <Header />
              <ProviderProfilePage />
              <Footer />
            </>
          }
        />

        {/* ── 404 ───────────────────────────────────────────── */}
        <Route
          path="*"
          element={
            <>
              <Header />
              <div style={{ padding: "100px 20px", textAlign: "center" }}>
                <h1>404 - Page Not Found</h1>
              </div>
              <Footer />
            </>
          }
        />
      </Routes>
    </>
  );
}

export default App;
