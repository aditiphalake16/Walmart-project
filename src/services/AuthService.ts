interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  storeLocation: string;
  region: string;
  avatar?: string;
  permissions: string[];
  lastLogin?: string;
}

export class AuthService {
  private static users: Map<string, User> = new Map();
  private static currentUser: User | null = null;

  static {
    // Initialize demo users
    this.users.set('manager@andheri.store', {
      id: '1',
      name: 'Rajesh Kumar',
      email: 'manager@andheri.store',
      role: 'store-manager',
      storeLocation: 'andheri',
      region: 'mumbai-west',
      permissions: ['inventory:read', 'inventory:write', 'transfers:create', 'reports:read'],
      lastLogin: '2024-01-15T10:30:00Z'
    });

    this.users.set('regional@mumbai.region', {
      id: '2',
      name: 'Priya Sharma',
      email: 'regional@mumbai.region',
      role: 'regional-head',
      storeLocation: 'all',
      region: 'mumbai-west',
      permissions: ['inventory:read', 'transfers:approve', 'reports:read', 'analytics:read', 'users:manage'],
      lastLogin: '2024-01-15T09:15:00Z'
    });

    this.users.set('admin@wgrid.com', {
      id: '3',
      name: 'Admin User',
      email: 'admin@wgrid.com',
      role: 'admin',
      storeLocation: 'all',
      region: 'all',
      permissions: ['*'],
      lastLogin: '2024-01-15T08:00:00Z'
    });
  }

  static async login(email: string, password: string): Promise<User> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Demo password is always 'demo123'
    if (password !== 'demo123') {
      throw new Error('Invalid email or password');
    }

    const user = this.users.get(email);
    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Update last login
    user.lastLogin = new Date().toISOString();
    this.currentUser = user;

    // Store in localStorage for persistence
    localStorage.setItem('wgrid_user', JSON.stringify(user));
    localStorage.setItem('wgrid_token', this.generateToken(user));

    return user;
  }

  static async register(userData: any): Promise<User> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Check if user already exists
    if (this.users.has(userData.email)) {
      throw new Error('User with this email already exists');
    }

    const newUser: User = {
      id: Date.now().toString(),
      name: userData.name,
      email: userData.email,
      role: userData.role,
      storeLocation: userData.storeLocation,
      region: userData.region,
      permissions: this.getPermissionsByRole(userData.role),
      lastLogin: new Date().toISOString()
    };

    this.users.set(userData.email, newUser);
    this.currentUser = newUser;

    // Store in localStorage for persistence
    localStorage.setItem('wgrid_user', JSON.stringify(newUser));
    localStorage.setItem('wgrid_token', this.generateToken(newUser));

    return newUser;
  }

  static logout(): void {
    this.currentUser = null;
    localStorage.removeItem('wgrid_user');
    localStorage.removeItem('wgrid_token');
  }

  static getCurrentUser(): User | null {
    if (this.currentUser) {
      return this.currentUser;
    }

    // Try to restore from localStorage
    const storedUser = localStorage.getItem('wgrid_user');
    const storedToken = localStorage.getItem('wgrid_token');

    if (storedUser && storedToken) {
      try {
        const user = JSON.parse(storedUser);
        if (this.validateToken(storedToken, user)) {
          this.currentUser = user;
          return user;
        }
      } catch (error) {
        // Invalid stored data, clear it
        this.logout();
      }
    }

    return null;
  }

  static isAuthenticated(): boolean {
    return this.getCurrentUser() !== null;
  }

  static hasPermission(permission: string): boolean {
    const user = this.getCurrentUser();
    if (!user) return false;

    // Admin has all permissions
    if (user.permissions.includes('*')) return true;

    return user.permissions.includes(permission);
  }

  static canAccessStore(storeId: string): boolean {
    const user = this.getCurrentUser();
    if (!user) return false;

    // Admin and regional heads can access all stores
    if (user.storeLocation === 'all') return true;

    return user.storeLocation === storeId;
  }

  private static getPermissionsByRole(role: string): string[] {
    const rolePermissions = {
      'store-manager': ['inventory:read', 'inventory:write', 'transfers:create', 'reports:read'],
      'regional-head': ['inventory:read', 'transfers:approve', 'reports:read', 'analytics:read', 'users:manage'],
      'logistics-coordinator': ['routes:read', 'routes:write', 'deliveries:manage', 'vehicles:manage'],
      'analyst': ['reports:read', 'analytics:read', 'forecasts:read'],
      'admin': ['*']
    };

    return rolePermissions[role as keyof typeof rolePermissions] || [];
  }

  private static generateToken(user: User): string {
    // Simple token generation for demo purposes
    const payload = {
      userId: user.id,
      email: user.email,
      role: user.role,
      exp: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
    };

    return btoa(JSON.stringify(payload));
  }

  private static validateToken(token: string, user: User): boolean {
    try {
      const payload = JSON.parse(atob(token));
      return payload.userId === user.id && payload.exp > Date.now();
    } catch {
      return false;
    }
  }

  static async updateProfile(updates: Partial<User>): Promise<User> {
    const user = this.getCurrentUser();
    if (!user) throw new Error('Not authenticated');

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));

    const updatedUser = { ...user, ...updates };
    this.users.set(user.email, updatedUser);
    this.currentUser = updatedUser;

    localStorage.setItem('wgrid_user', JSON.stringify(updatedUser));

    return updatedUser;
  }

  static async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (currentPassword !== 'demo123') {
      throw new Error('Current password is incorrect');
    }

    if (newPassword.length < 6) {
      throw new Error('New password must be at least 6 characters long');
    }

    // In a real app, this would update the password in the database
    console.log('Password changed successfully');
  }
}