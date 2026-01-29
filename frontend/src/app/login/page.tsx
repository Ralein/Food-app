'use client';

import { useState } from 'react';
import { useMutation, gql } from '@apollo/client';
import { useRouter } from 'next/navigation';
import { setToken, setUser } from '@/lib/auth';

const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        id
        email
        name
        role
        country
      }
    }
  }
`;

import { FiSearch, FiShoppingCart, FiUser, FiEye, FiEyeOff } from 'react-icons/fi';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [login, { loading, error }] = useMutation(LOGIN_MUTATION);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data } = await login({ variables: { email, password } });
      setToken(data.login.token);
      setUser(data.login.user);
      router.push('/dashboard');
    } catch (err) {
      console.error('Login error:', err);
    }
  };

  const quickLogin = async (userEmail: string) => {
    setEmail(userEmail);
    const demoPassword = 'password123';
    setPassword(demoPassword);

    try {
      const { data } = await login({ variables: { email: userEmail, password: demoPassword } });
      setToken(data.login.token);
      setUser(data.login.user);
      router.push('/dashboard');
    } catch (err) {
      console.error('Login error:', err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="bg-surface p-10 rounded-2xl shadow-sm border border-border w-full max-w-md">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-accent/20 rounded-full mb-4">
            <span className="text-3xl">🌿</span>
          </div>
          <h1 className="text-3xl font-bold text-text-primary mb-2">Welcome Back</h1>
          <p className="text-text-secondary text-sm">Experience fresh, healthy meals delivered</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-text-primary">Email Address</label>
            <input
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-text-primary">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-4 pr-12 py-3 border border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary hover:text-primary transition-colors focus:outline-none"
              >
                {showPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-xs text-center border border-red-100 bg-red-50 py-2 rounded-lg">
              {error.message || 'Invalid credentials. Please try again.'}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white py-3 rounded-xl hover:bg-primary-hover transition-colors font-semibold shadow-md shadow-primary/10 disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-10 border-t border-border pt-8">
          <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider text-center mb-6">Demo Accounts</p>
          <div className="grid grid-cols-2 gap-3">
            {[
              { email: 'admin@india.com', label: 'Admin (IN)', color: 'bg-green-50 text-green-700' },
              { email: 'manager@india.com', label: 'Manager (IN)', color: 'bg-blue-50 text-blue-700' },
              { email: 'member@india.com', label: 'Member (IN)', color: 'bg-purple-50 text-purple-700' },
              { email: 'admin@america.com', label: 'Admin (US)', color: 'bg-red-50 text-red-700' },
            ].map((user) => (
              <button
                key={user.email}
                onClick={() => quickLogin(user.email)}
                className={`text-xs ${user.color} px-3 py-2.5 rounded-lg font-medium transition-opacity hover:opacity-80 border border-transparent hover:border-current/10`}
              >
                {user.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
