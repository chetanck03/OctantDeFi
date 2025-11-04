import React from 'react'
import { Outlet } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Navbar from './Navbar'
import Footer from './Footer'
import AIAssistant from './AIAssistant'

function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-neutral-950">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      <AIAssistant />
      </main>

      <Footer />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: 'linear-gradient(135deg, rgba(15, 15, 15, 0.95) 0%, rgba(10, 10, 10, 0.95) 100%)',
            color: '#f1f5f9',
            border: '1px solid rgba(147, 51, 234, 0.4)',
            borderRadius: '12px',
            backdropFilter: 'blur(16px)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6), 0 0 20px rgba(147, 51, 234, 0.2)',
            fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
            fontWeight: '500',
            minHeight: '64px',
            padding: '16px 20px',
          },
          success: {
            duration: 3000,
            style: {
              background: 'linear-gradient(135deg, rgba(15, 15, 15, 0.95) 0%, rgba(10, 10, 10, 0.95) 100%)',
              border: '1px solid rgba(16, 185, 129, 0.5)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6), 0 0 20px rgba(16, 185, 129, 0.3)',
            },
            iconTheme: {
              primary: '#10b981',
              secondary: '#f1f5f9',
            },
          },
          error: {
            duration: 4000,
            style: {
              background: 'linear-gradient(135deg, rgba(15, 15, 15, 0.95) 0%, rgba(10, 10, 10, 0.95) 100%)',
              border: '1px solid rgba(239, 68, 68, 0.5)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6), 0 0 20px rgba(239, 68, 68, 0.3)',
            },
            iconTheme: {
              primary: '#ef4444',
              secondary: '#f1f5f9',
            },
          },
          loading: {
            style: {
              background: 'linear-gradient(135deg, rgba(15, 15, 15, 0.95) 0%, rgba(10, 10, 10, 0.95) 100%)',
              border: '1px solid rgba(147, 51, 234, 0.5)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6), 0 0 20px rgba(147, 51, 234, 0.3)',
            },
            iconTheme: {
              primary: '#9945ff',
              secondary: '#f1f5f9',
            },
          },
        }}
      />
      
      {/* AI Assistant */}
      <AIAssistant />
    </div>
  )
}

export default Layout