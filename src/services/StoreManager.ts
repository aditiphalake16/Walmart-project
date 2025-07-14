export class StoreManager {
  private static stores: Map<string, any> = new Map();

  static initialize() {
    // Initialize sample data for three stores
    this.stores.set('andheri', {
      name: 'Andheri Store',
      location: { lat: 19.1136, lng: 72.8697 },
      inventory: [
        { product: 'Bread', category: 'groceries', quantity: 120, reorderLevel: 50, expiryDays: 3 },
        { product: 'Milk', category: 'groceries', quantity: 80, reorderLevel: 30, expiryDays: 2 },
        { product: 'Biscuits', category: 'groceries', quantity: 200, reorderLevel: 100, expiryDays: 45 },
        { product: 'Rice', category: 'groceries', quantity: 300, reorderLevel: 150, expiryDays: 365 },
        { product: 'iPhone 15', category: 'electronics', quantity: 15, reorderLevel: 5, expiryDays: 1095 },
        { product: 'Samsung TV', category: 'electronics', quantity: 8, reorderLevel: 3, expiryDays: 730 },
        { product: 'T-Shirt', category: 'clothing', quantity: 45, reorderLevel: 20, expiryDays: 180 },
        { product: 'Jeans', category: 'clothing', quantity: 25, reorderLevel: 15, expiryDays: 180 },
        { product: 'Paracetamol', category: 'pharmacy', quantity: 60, reorderLevel: 25, expiryDays: 90 },
        { product: 'Vitamin C', category: 'pharmacy', quantity: 35, reorderLevel: 20, expiryDays: 180 }
      ],
      transfers: [
        { from: 'andheri', to: 'bandra', product: 'Biscuits', quantity: 50, status: 'pending', timestamp: '2 hours ago' },
        { from: 'malad', to: 'andheri', product: 'Milk', quantity: 30, status: 'approved', timestamp: '1 hour ago' }
      ],
      anomalies: [
        { type: 'spoilage', severity: 'high', product: 'Bread', description: 'Unusual spoilage detected' },
        { type: 'fraud', severity: 'medium', product: 'iPhone 15', description: 'Suspicious inventory movement' }
      ]
    });

    this.stores.set('bandra', {
      name: 'Bandra Store',
      location: { lat: 19.0596, lng: 72.8295 },
      inventory: [
        { product: 'Bread', category: 'groceries', quantity: 40, reorderLevel: 50, expiryDays: 3 },
        { product: 'Milk', category: 'groceries', quantity: 90, reorderLevel: 30, expiryDays: 2 },
        { product: 'Biscuits', category: 'groceries', quantity: 60, reorderLevel: 100, expiryDays: 45 },
        { product: 'Rice', category: 'groceries', quantity: 280, reorderLevel: 150, expiryDays: 365 },
        { product: 'iPhone 15', category: 'electronics', quantity: 12, reorderLevel: 5, expiryDays: 1095 },
        { product: 'Samsung TV', category: 'electronics', quantity: 5, reorderLevel: 3, expiryDays: 730 },
        { product: 'T-Shirt', category: 'clothing', quantity: 30, reorderLevel: 20, expiryDays: 180 },
        { product: 'Jeans', category: 'clothing', quantity: 18, reorderLevel: 15, expiryDays: 180 },
        { product: 'Paracetamol', category: 'pharmacy', quantity: 40, reorderLevel: 25, expiryDays: 90 },
        { product: 'Vitamin C', category: 'pharmacy', quantity: 28, reorderLevel: 20, expiryDays: 180 }
      ],
      transfers: [
        { from: 'andheri', to: 'bandra', product: 'Biscuits', quantity: 50, status: 'pending', timestamp: '2 hours ago' },
        { from: 'bandra', to: 'malad', product: 'T-Shirt', quantity: 20, status: 'approved', timestamp: '3 hours ago' }
      ],
      anomalies: [
        { type: 'inventory', severity: 'low', product: 'Bread', description: 'Low stock alert' }
      ]
    });

    this.stores.set('malad', {
      name: 'Malad Store',
      location: { lat: 19.1864, lng: 72.8493 },
      inventory: [
        { product: 'Bread', category: 'groceries', quantity: 150, reorderLevel: 50, expiryDays: 3 },
        { product: 'Milk', category: 'groceries', quantity: 20, reorderLevel: 30, expiryDays: 2 },
        { product: 'Biscuits', category: 'groceries', quantity: 180, reorderLevel: 100, expiryDays: 45 },
        { product: 'Rice', category: 'groceries', quantity: 400, reorderLevel: 150, expiryDays: 365 },
        { product: 'iPhone 15', category: 'electronics', quantity: 18, reorderLevel: 5, expiryDays: 1095 },
        { product: 'Samsung TV', category: 'electronics', quantity: 12, reorderLevel: 3, expiryDays: 730 },
        { product: 'T-Shirt', category: 'clothing', quantity: 15, reorderLevel: 20, expiryDays: 180 },
        { product: 'Jeans', category: 'clothing', quantity: 35, reorderLevel: 15, expiryDays: 180 },
        { product: 'Paracetamol', category: 'pharmacy', quantity: 80, reorderLevel: 25, expiryDays: 90 },
        { product: 'Vitamin C', category: 'pharmacy', quantity: 45, reorderLevel: 20, expiryDays: 180 }
      ],
      transfers: [
        { from: 'malad', to: 'andheri', product: 'Milk', quantity: 30, status: 'approved', timestamp: '1 hour ago' },
        { from: 'bandra', to: 'malad', product: 'T-Shirt', quantity: 20, status: 'approved', timestamp: '3 hours ago' }
      ],
      anomalies: [
        { type: 'inventory', severity: 'medium', product: 'T-Shirt', description: 'Stock below reorder level' },
        { type: 'delivery', severity: 'low', product: 'Milk', description: 'Delivery delay detected' }
      ]
    });
  }

  static getStoreData(storeId: string) {
    return this.stores.get(storeId);
  }

  static getAllStores() {
    return Array.from(this.stores.entries()).map(([id, data]) => ({ id, ...data }));
  }

  static updateInventory(storeId: string, product: string, quantity: number) {
    const store = this.stores.get(storeId);
    if (store) {
      const item = store.inventory.find((i: any) => i.product === product);
      if (item) {
        item.quantity = quantity;
      }
    }
  }

  static transferInventory(fromStore: string, toStore: string, product: string, quantity: number) {
    const from = this.stores.get(fromStore);
    const to = this.stores.get(toStore);
    
    if (from && to) {
      const fromItem = from.inventory.find((i: any) => i.product === product);
      const toItem = to.inventory.find((i: any) => i.product === product);
      
      if (fromItem && toItem && fromItem.quantity >= quantity) {
        fromItem.quantity -= quantity;
        toItem.quantity += quantity;
        return true;
      }
    }
    return false;
  }
}