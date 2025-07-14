import React, { useState, useEffect } from 'react';
import { AuthLayout } from './components/AuthLayout';
import { UserProfile } from './components/UserProfile';
import { Dashboard } from './components/Dashboard';
import { VoiceInterface } from './components/VoiceInterface';
import { StoreManager } from './services/StoreManager';
import { AuthService } from './services/AuthService';
import { NotificationProvider } from './contexts/NotificationContext';
import { WebSocketProvider } from './contexts/WebSocketContext';
import { User, Settings } from 'lucide-react';

function App() {
  const [user, setUser] = useState<any>(null);
  const [currentStore, setCurrentStore] = useState('andheri');
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  useEffect(() => {
    // Check for existing authentication
    const existingUser = AuthService.getCurrentUser();
    if (existingUser) {
      setUser(existingUser);
      // Set default store based on user's location
      if (existingUser.storeLocation !== 'all') {
        setCurrentStore(existingUser.storeLocation);
      }
    }

    // Initialize the system
    StoreManager.initialize();
  }, []);

  const handleLogin = (userData: any) => {
    setUser(userData);
    if (userData.storeLocation !== 'all') {
      setCurrentStore(userData.storeLocation);
    }
  };

  const handleLogout = () => {
    AuthService.logout();
    setUser(null);
    setShowProfile(false);
  };

  // Show login screen if not authenticated
  if (!user) {
    return <AuthLayout onLogin={handleLogin} />;
  }

  // Show profile if requested
  if (showProfile) {
    return (
      <NotificationProvider>
        <div className="min-h-screen bg-gray-900 text-white">
          <header className="bg-gray-800 border-b border-gray-700 p-4">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-xl font-bold">W</span>
                </div>
                <div>
                  <h1 className="text-2xl font-bold">W-Grid Quantum</h1>
                  <p className="text-gray-400 text-sm">User Profile</p>
                </div>
              </div>
              <button
                onClick={() => setShowProfile(false)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-all"
              >
                Back to Dashboard
              </button>
            </div>
          </header>
          <main className="max-w-4xl mx-auto p-6">
            <UserProfile user={user} onLogout={handleLogout} />
          </main>
        </div>
      </NotificationProvider>
    );
  }
  return (
    <NotificationProvider>
      <WebSocketProvider>
        <div className="min-h-screen bg-gray-900 text-white">
          <header className="bg-gray-800 border-b border-gray-700 p-4">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center p-1">
                  <svg viewBox="0 0 100 100" className="w-full h-full">
                    <circle cx="50" cy="50" r="45" fill="#004c91" stroke="#ffc220" strokeWidth="3"/>
                    <path d="M50 15 L55 35 L75 35 L60 50 L65 70 L50 55 L35 70 L40 50 L25 35 L45 35 Z" fill="#ffc220"/>
                    <circle cx="50" cy="50" r="8" fill="#004c91"/>
                  </svg>
                </div>
                <div>
                  <h1 className="text-2xl font-bold">Walmart Grid Quantum</h1>
                  <p className="text-gray-400 text-sm">Hyperlocal Logistics Intelligence</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                {/* User Info */}
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold">{user.name.charAt(0).toUpperCase()}</span>
                  </div>
                  <div className="text-sm">
                    <p className="font-medium">{user.name}</p>
                    <p className="text-gray-400 text-xs">{user.role.replace('-', ' ')}</p>
                  </div>
                </div>

                {/* Store Selector - only show if user can access multiple stores */}
                {user.storeLocation === 'all' && (
                  <select 
                    value={currentStore} 
                    onChange={(e) => setCurrentStore(e.target.value)}
                    className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white"
                  >
                    <option value="andheri">Andheri Store</option>
                    <option value="bandra">Bandra Store</option>
                    <option value="malad">Malad Store</option>
                  </select>
                )}

                <button
                  onClick={() => setShowProfile(true)}
                  className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                  title="User Profile"
                >
                  <Settings className="w-5 h-5" />
                </button>
                
                <button
                  onClick={() => setIsVoiceActive(!isVoiceActive)}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                    isVoiceActive 
                      ? 'bg-red-600 hover:bg-red-700' 
                      : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  🎤 {isVoiceActive ? 'Stop Voice' : 'Start Voice'}
                </button>
              </div>
            </div>
          </header>

          <main className="max-w-7xl mx-auto p-6">
            <Dashboard currentStore={currentStore} />
          </main>

          {isVoiceActive && <VoiceInterface />}
        </div>
      </WebSocketProvider>
    </NotificationProvider>
  );
}

export default App;