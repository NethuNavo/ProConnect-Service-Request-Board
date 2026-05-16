'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { API_BASE } from '../../lib/api';

export default function LoginPage() {
  const [email, setEmail] = useState('admin@proconnect.test');
  const [password, setPassword] = useState('Password123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const body = await res.json();
      if (!res.ok) {
        throw new Error(body.message || 'Login failed');
      }

      localStorage.setItem('token', body.token);
      localStorage.setItem('userName', body.user.name || 'User');
      router.push('/');
    } catch (err) {
      setError(err.message || 'Unable to login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="page-shell">
      <header className="page-header smaller">
        <div className="brand">
          <img src="/assets/Logo.png" alt="ProConnect logo" className="brand-logo" />
          <div>
            <p className="brand-title">ProConnect</p>
            <p className="brand-subtitle">Service Request Board</p>
            <h1>Login</h1>
            <p className="subtitle">Sign in to post or delete service requests.</p>
          </div>
        </div>
        <a href="/" className="button secondary">Back to requests</a>
      </header>

      <form className="card form-card" onSubmit={handleSubmit}>
        <div className="form-row">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="admin@proconnect.test"
          />
        </div>

        <div className="form-row">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Password123"
          />
        </div>

        {error && <div className="feedback error">{error}</div>}

        <div className="form-actions">
          <button className="button primary" type="submit" disabled={loading}>
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </div>
      </form>
    </main>
  );
}
