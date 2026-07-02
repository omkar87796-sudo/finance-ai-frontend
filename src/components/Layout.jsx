import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { TrendingUp, Building2, User, LayoutDashboard } from 'lucide-react';

const navLinks = [
  { to: '/',          icon: TrendingUp,    label: 'Home'       },
  { to: '/company',  icon: Building2,     label: 'Company AI' },
  { to: '/employee', icon: User,          label: 'My Finance' },
  { to: '/dashboard',icon: LayoutDashboard,label: 'Dashboard'  },
];

export default function Layout() {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <nav style={{
        width: 220,
        background: 'var(--bg-secondary)',
        borderRight: '1px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
        padding: '24px 16px',
        position: 'fixed',
        height: '100vh',
        zIndex: 100,
      }}>
        {/* Logo */}
        <div style={{ marginBottom: 36 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 36, height: 36,
              background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
              borderRadius: 8,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <TrendingUp size={18} color="white" />
            </div>
            <div>
              <div style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 15, color: 'var(--text-primary)' }}>
                Finance AI
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Powered by Groq</div>
            </div>
          </div>
        </div>

        {/* Nav links */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {navLinks.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '10px 12px',
                borderRadius: 8,
                textDecoration: 'none',
                fontSize: 14,
                fontWeight: 500,
                color: isActive ? 'var(--accent-blue)' : 'var(--text-secondary)',
                background: isActive ? 'rgba(59,130,246,0.1)' : 'transparent',
                transition: 'all 0.2s',
              })}
            >
              <Icon size={16} />
              {label}
            </NavLink>
          ))}
        </div>

        {/* Bottom badge */}
        <div style={{ marginTop: 'auto', paddingTop: 24 }}>
          <div style={{
            background: 'rgba(16,185,129,0.1)',
            border: '1px solid rgba(16,185,129,0.2)',
            borderRadius: 8,
            padding: '10px 12px',
          }}>
            <div style={{ fontSize: 11, color: 'var(--accent-green)', fontWeight: 600, marginBottom: 2 }}>
              ● AI ONLINE
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
              llama3-70b · Groq Cloud
            </div>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main style={{ marginLeft: 220, flex: 1, minHeight: '100vh' }}>
        <Outlet />
      </main>
    </div>
  );
}
