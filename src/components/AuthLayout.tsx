import React, { useState } from 'react';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';
import { Shield, Zap, TrendingUp, Users } from 'lucide-react';

interface AuthLayoutProps {
  onLogin: (user: any) => void;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center p-4">
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Left Side - Branding */}
        <div className="text-white space-y-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 bg-white rounded-xl flex items-center justify-center p-3">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <circle cx="50" cy="50" r="45" fill="#004c91" stroke="#ffc220" strokeWidth="3"/>
                  <path d="M50 15 L55 35 L75 35 L60 50 L65 70 L50 55 L35 70 L40 50 L25 35 L45 35 Z" fill="#ffc220"/>
                  <circle cx="50" cy="50" r="8" fill="#004c91"/>
                </svg>
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Walmart Grid Quantum
                </h1>
                <p className="text-xl text-gray-300">AI-Powered Hyperlocal Logistics Intelligence</p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Smart Demand Forecasting</h3>
                <p className="text-gray-300">AI-powered SKU-level demand prediction using XGBoost and Prophet models</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
                <Zap className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Eco-Aware Routing</h3>
                <p className="text-gray-300">Electric vehicle optimization and carbon footprint minimization</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Inter-Store Negotiation</h3>
                <p className="text-gray-300">Automated inventory transfers and peer-to-peer coordination</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Anomaly Detection</h3>
                <p className="text-gray-300">Real-time fraud detection and supply chain monitoring</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 bg-opacity-50 rounded-lg p-6 border border-gray-700">
            <h4 className="text-lg font-semibold mb-3">Trusted by Leading Retailers</h4>
            <div className="flex items-center space-x-6 text-gray-400">
              <span className="text-2xl font-bold">Walmart</span>
              <span className="text-2xl font-bold">Target</span>
              <span className="text-2xl font-bold">Costco</span>
            </div>
          </div>
        </div>

        {/* Right Side - Auth Form */}
        <div className="bg-gray-800 bg-opacity-80 backdrop-blur-sm rounded-2xl p-8 border border-gray-700 shadow-2xl">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-2">
              {isLogin ? 'Welcome Back' : 'Join W-Grid Quantum'}
            </h2>
            <p className="text-gray-400">
              {isLogin 
                ? 'Sign in to access your logistics dashboard' 
                : 'Create your account to get started'
              }
            </p>
          </div>

          {isLogin ? (
            <LoginForm onLogin={onLogin} />
          ) : (
            <RegisterForm onRegister={onLogin} />
          )}

          <div className="mt-8 text-center">
            <p className="text-gray-400">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-blue-400 hover:text-blue-300 font-semibold transition-colors"
              >
                {isLogin ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-700">
            <p className="text-xs text-gray-500 text-center">
              By signing in, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};