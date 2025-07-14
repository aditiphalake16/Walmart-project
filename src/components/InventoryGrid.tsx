import React, { useState, useEffect } from 'react';
import { StoreManager } from '../services/StoreManager';
import { Package, AlertTriangle, Clock, CheckCircle } from 'lucide-react';

interface InventoryGridProps {
  storeId: string;
}

export const InventoryGrid: React.FC<InventoryGridProps> = ({ storeId }) => {
  const [inventory, setInventory] = useState<any[]>([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const storeData = StoreManager.getStoreData(storeId);
    setInventory(storeData?.inventory || []);
  }, [storeId]);

  const filteredInventory = inventory.filter(item => {
    if (filter === 'all') return true;
    if (filter === 'low') return item.quantity < item.reorderLevel;
    if (filter === 'expiring') return item.expiryDays < 7;
    if (filter === 'available') return item.quantity > item.reorderLevel;
    return true;
  });

  const getStatusColor = (item: any) => {
    if (item.quantity < item.reorderLevel) return 'text-red-400';
    if (item.expiryDays < 7) return 'text-yellow-400';
    return 'text-green-400';
  };

  const getStatusIcon = (item: any) => {
    if (item.quantity < item.reorderLevel) return <AlertTriangle className="w-4 h-4" />;
    if (item.expiryDays < 7) return <Clock className="w-4 h-4" />;
    return <CheckCircle className="w-4 h-4" />;
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Package className="w-6 h-6 text-purple-400" />
          <h3 className="text-xl font-semibold">Inventory Management</h3>
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm"
        >
          <option value="all">All Items</option>
          <option value="low">Low Stock</option>
          <option value="expiring">Expiring Soon</option>
          <option value="available">Available</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="text-left py-3 px-4">Product</th>
              <th className="text-left py-3 px-4">Category</th>
              <th className="text-left py-3 px-4">Quantity</th>
              <th className="text-left py-3 px-4">Reorder Level</th>
              <th className="text-left py-3 px-4">Expiry</th>
              <th className="text-left py-3 px-4">Status</th>
              <th className="text-left py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredInventory.map((item, index) => (
              <tr key={index} className="border-b border-gray-700 hover:bg-gray-700">
                <td className="py-3 px-4 font-medium">{item.product}</td>
                <td className="py-3 px-4 text-gray-400">{item.category}</td>
                <td className="py-3 px-4">
                  <span className={getStatusColor(item)}>{item.quantity}</span>
                </td>
                <td className="py-3 px-4">{item.reorderLevel}</td>
                <td className="py-3 px-4">
                  {item.expiryDays < 7 ? (
                    <span className="text-yellow-400">{item.expiryDays} days</span>
                  ) : (
                    <span className="text-gray-400">{item.expiryDays} days</span>
                  )}
                </td>
                <td className="py-3 px-4">
                  <div className={`flex items-center space-x-2 ${getStatusColor(item)}`}>
                    {getStatusIcon(item)}
                    <span className="text-xs">
                      {item.quantity < item.reorderLevel ? 'Low Stock' : 
                       item.expiryDays < 7 ? 'Expiring' : 'Available'}
                    </span>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="flex space-x-2">
                    <button className="text-blue-400 hover:text-blue-300 text-xs">
                      Transfer
                    </button>
                    <button className="text-green-400 hover:text-green-300 text-xs">
                      Reorder
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};