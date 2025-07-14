import React, { useState, useEffect } from 'react';
import { DemandForecast } from './DemandForecast';
import { InventoryGrid } from './InventoryGrid';
import { DeliveryMap } from './DeliveryMap';
import { AnomalyDetector } from './AnomalyDetector';
import { EcoMetrics } from './EcoMetrics';
import { InventoryNegotiation } from './InventoryNegotiation';
import { StoreManager } from '../services/StoreManager';
import { Activity, TrendingUp, Truck, AlertTriangle, Leaf, Users } from 'lucide-react';

interface DashboardProps {
  currentStore: string;
}

export const Dashboard: React.FC<DashboardProps> = ({ currentStore }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [storeData, setStoreData] = useState(null);
  const [metrics, setMetrics] = useState({
    totalInventory: 0,
    pendingTransfers: 0,
    carbonSaved: 0,
    anomalies: 0
  });

  useEffect(() => {
    const data = StoreManager.getStoreData(currentStore);
    setStoreData(data);
    
    // Update metrics
    setMetrics({
      totalInventory: data?.inventory?.reduce((acc: number, item: any) => acc + item.quantity, 0) || 0,
      pendingTransfers: data?.transfers?.filter((t: any) => t.status === 'pending').length || 0,
      carbonSaved: Math.floor(Math.random() * 150) + 50,
      anomalies: data?.anomalies?.length || 0
    });
  }, [currentStore]);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Activity },
    { id: 'forecast', label: 'Demand Forecast', icon: TrendingUp },
    { id: 'inventory', label: 'Inventory', icon: Users },
    { id: 'delivery', label: 'Delivery Routes', icon: Truck },
    { id: 'anomalies', label: 'Anomalies', icon: AlertTriangle },
    { id: 'eco', label: 'Eco Metrics', icon: Leaf },
  ];

  return (
    <div className="space-y-6">
      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Inventory"
          value={metrics.totalInventory.toLocaleString()}
          change="+12%"
          positive={true}
          icon="📦"
        />
        <MetricCard
          title="Pending Transfers"
          value={metrics.pendingTransfers.toString()}
          change="-8%"
          positive={true}
          icon="🔄"
        />
        <MetricCard
          title="Carbon Saved (kg)"
          value={metrics.carbonSaved.toString()}
          change="+23%"
          positive={true}
          icon="🌱"
        />
        <MetricCard
          title="Anomalies"
          value={metrics.anomalies.toString()}
          change="+2"
          positive={false}
          icon="⚠️"
        />
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-700">
        <nav className="flex space-x-8">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === id
                  ? 'border-blue-500 text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-300'
              }`}
            >
              <Icon size={18} />
              <span>{label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="min-h-[600px]">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <DemandForecast storeId={currentStore} />
            <InventoryNegotiation storeId={currentStore} />
          </div>
        )}
        {activeTab === 'forecast' && <DemandForecast storeId={currentStore} />}
        {activeTab === 'inventory' && <InventoryGrid storeId={currentStore} />}
        {activeTab === 'delivery' && <DeliveryMap storeId={currentStore} />}
        {activeTab === 'anomalies' && <AnomalyDetector storeId={currentStore} />}
        {activeTab === 'eco' && <EcoMetrics storeId={currentStore} />}
      </div>
    </div>
  );
};

interface MetricCardProps {
  title: string;
  value: string;
  change: string;
  positive: boolean;
  icon: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, change, positive, icon }) => (
  <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-400 text-sm">{title}</p>
        <p className="text-2xl font-bold mt-1">{value}</p>
      </div>
      <div className="text-2xl">{icon}</div>
    </div>
    <div className="mt-4 flex items-center">
      <span className={`text-sm font-medium ${positive ? 'text-green-400' : 'text-red-400'}`}>
        {change}
      </span>
      <span className="text-gray-500 text-sm ml-2">vs last week</span>
    </div>
  </div>
);