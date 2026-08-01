import type { ReactElement } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { Toaster } from 'sonner'
import { AuthProvider, useAuth } from './lib/auth'
import { AdminDashboard } from './pages/AdminDashboard'
import { ApplicationForm } from './pages/ApplicationForm'
import { AuthPage } from './pages/AuthPage'
import { CustomerDashboard } from './pages/CustomerDashboard'
import { LandingPage } from './pages/LandingPage'
import { MockSitePage } from './pages/MockSitePage'
import { PolicyPage } from './pages/PolicyPage'
import { PremiumLeadPage } from './pages/PremiumLeadPage'

function ProtectedRoute({ children, adminOnly = false }: { children: ReactElement; adminOnly?: boolean }) {
  const { user, isAdmin, loading } = useAuth()
  if (loading) return <div className="min-h-screen bg-cloud-50 p-8"><div className="skeleton h-40 rounded-3xl" /></div>
  if (!user) return <Navigate to="/auth" replace />
  if (adminOnly && !isAdmin) return <Navigate to="/dashboard" replace />
  return children
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/apply" element={<ApplicationForm />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/demo-sites/:slug/:page?" element={<MockSitePage />} />
        <Route path="/software-consultation" element={<PremiumLeadPage />} />
        <Route path="/terms" element={<PolicyPage pageKey="terms" />} />
        <Route path="/privacy" element={<PolicyPage pageKey="privacy" />} />
        <Route path="/program-guidelines" element={<PolicyPage pageKey="program-guidelines" />} />
        <Route path="/acceptable-use" element={<PolicyPage pageKey="acceptable-use" />} />
        <Route path="/refund-cancellation" element={<PolicyPage pageKey="refund-cancellation" />} />
        <Route path="/accessibility" element={<PolicyPage pageKey="accessibility" />} />
        <Route path="/contact" element={<PolicyPage pageKey="contact" />} />
        <Route path="/dashboard" element={<ProtectedRoute><CustomerDashboard /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toaster richColors position="top-right" />
    </AuthProvider>
  )
}
