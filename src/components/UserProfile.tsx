import React, { useState } from 'react';
import { AuthService } from '../services/AuthService';
import { User, Mail, MapPin, Building, Shield, Settings, LogOut, Edit3 } from 'lucide-react';

interface UserProfileProps {
  user: any;
  onLogout: () => void;
}

export const UserProfile: React.FC<UserProfileProps> = ({ user, onLogout }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name,
    storeLocation: user.storeLocation,
    region: user.region
  });

  const handleSave = async () => {
    try {
      await AuthService.updateProfile(formData);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-600';
      case 'regional-head': return 'bg-purple-600';
      case 'store-manager': return 'bg-blue-600';
      case 'logistics-coordinator': return 'bg-green-600';
      case 'analyst': return 'bg-yellow-600';
      default: return 'bg-gray-600';
    }
  };

  const formatRole = (role: string) => {
    return role.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold flex items-center">
          <User className="w-6 h-6 mr-2 text-blue-400" />
          User Profile
        </h3>
        <div className="flex space-x-2">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2"
          >
            <Edit3 className="w-4 h-4" />
            <span>{isEditing ? 'Cancel' : 'Edit'}</span>
          </button>
          <button
            onClick={onLogout}
            className="px-3 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {/* Avatar and Basic Info */}
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <span className="text-2xl font-bold text-white">
              {user.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            {isEditing ? (
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="text-xl font-semibold bg-gray-700 border border-gray-600 rounded px-3 py-1 text-white"
              />
            ) : (
              <h4 className="text-xl font-semibold">{user.name}</h4>
            )}
            <div className="flex items-center space-x-2 mt-1">
              <span className={`px-2 py-1 rounded text-xs font-medium ${getRoleBadgeColor(user.role)}`}>
                {formatRole(user.role)}
              </span>
              <span className="text-sm text-gray-400">
                Last login: {new Date(user.lastLogin).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <Mail className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-400">Email</p>
                <p className="font-medium">{user.email}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <MapPin className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-400">Store Location</p>
                {isEditing ? (
                  <select
                    value={formData.storeLocation}
                    onChange={(e) => setFormData({ ...formData, storeLocation: e.target.value })}
                    className="bg-gray-700 border border-gray-600 rounded px-2 py-1 text-white text-sm"
                  >
                    <option value="andheri">Andheri Store</option>
                    <option value="bandra">Bandra Store</option>
                    <option value="malad">Malad Store</option>
                    <option value="all">All Stores</option>
                  </select>
                ) : (
                  <p className="font-medium capitalize">
                    {user.storeLocation === 'all' ? 'All Stores' : `${user.storeLocation} Store`}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <Building className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-400">Region</p>
                {isEditing ? (
                  <select
                    value={formData.region}
                    onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                    className="bg-gray-700 border border-gray-600 rounded px-2 py-1 text-white text-sm"
                  >
                    <option value="mumbai-west">Mumbai West</option>
                    <option value="mumbai-central">Mumbai Central</option>
                    <option value="mumbai-east">Mumbai East</option>
                    <option value="all">All Regions</option>
                  </select>
                ) : (
                  <p className="font-medium capitalize">
                    {user.region === 'all' ? 'All Regions' : user.region.replace('-', ' ')}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Shield className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-400">Permissions</p>
                <p className="font-medium text-sm">
                  {user.permissions.includes('*') ? 'Full Access' : `${user.permissions.length} permissions`}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Permissions List */}
        <div>
          <h5 className="font-semibold mb-3 flex items-center">
            <Settings className="w-5 h-5 mr-2 text-gray-400" />
            Access Permissions
          </h5>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {user.permissions.includes('*') ? (
              <span className="px-3 py-1 bg-red-600 rounded text-xs font-medium">
                Administrator Access
              </span>
            ) : (
              user.permissions.map((permission: string, index: number) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-gray-700 rounded text-xs font-medium"
                >
                  {permission.replace(':', ': ').replace('-', ' ')}
                </span>
              ))
            )}
          </div>
        </div>

        {isEditing && (
          <div className="flex space-x-3 pt-4 border-t border-gray-700">
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-sm font-medium transition-colors"
            >
              Save Changes
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg text-sm font-medium transition-colors"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
};