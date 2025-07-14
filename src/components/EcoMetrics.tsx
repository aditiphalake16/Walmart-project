import React, { useState, useEffect } from 'react';
import { EcoService } from '../services/EcoService';
import { Leaf, Zap, Recycle, TrendingUp } from 'lucide-react';

interface EcoMetricsProps {
  storeId: string;
}

export const EcoMetrics: React.FC<EcoMetricsProps> = ({ storeId }) => {
  const [metrics, setMetrics] = useState<any>(null);
  const [period, setPeriod] = useState('week');

  useEffect(() => {
    const ecoMetrics = EcoService.getEcoMetrics(storeId, period);
    setMetrics(ecoMetrics);
  }, [storeId, period]);

  if (!metrics) return <div>Loading...</div>;

  const MetricCard = ({ title, value, unit, change, icon: Icon, color }: any) => (
    <div className="bg-gray-700 rounded-lg p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Icon className={`w-6 h-6 ${color}`} />
          <div>
            <p className="text-sm text-gray-400">{title}</p>
            <p className="text-xl font-bold">{value} {unit}</p>
          </div>
        </div>
        <div className="text-right">
          <p className={`text-sm font-medium ${change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {change >= 0 ? '+' : ''}{change}%
          </p>
          <p className="text-xs text-gray-500">vs last {period}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Leaf className="w-6 h-6 text-green-400" />
          <h3 className="text-xl font-semibold">Sustainability Metrics</h3>
        </div>
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm"
        >
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="quarter">This Quarter</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <MetricCard
          title="Carbon Footprint"
          value={metrics.carbonFootprint}
          unit="kg CO₂"
          change={metrics.carbonChange}
          icon={Leaf}
          color="text-green-400"
        />
        <MetricCard
          title="Energy Consumption"
          value={metrics.energyConsumption}
          unit="kWh"
          change={metrics.energyChange}
          icon={Zap}
          color="text-yellow-400"
        />
        <MetricCard
          title="Waste Diverted"
          value={metrics.wasteRecycled}
          unit="kg"
          change={metrics.wasteChange}
          icon={Recycle}
          color="text-blue-400"
        />
        <MetricCard
          title="Efficiency Score"
          value={metrics.efficiencyScore}
          unit="/100"
          change={metrics.efficiencyChange}
          icon={TrendingUp}
          color="text-purple-400"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* EV Fleet Status */}
        <div className="bg-gray-700 rounded-lg p-4">
          <h4 className="font-semibold mb-4 flex items-center">
            <Zap className="w-5 h-5 mr-2 text-green-400" />
            Electric Vehicle Fleet
          </h4>
          <div className="space-y-3">
            {metrics.evFleet.map((vehicle: any, index: number) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${vehicle.status === 'active' ? 'bg-green-400' : 'bg-gray-500'}`}></div>
                  <div>
                    <p className="font-medium">{vehicle.id}</p>
                    <p className="text-sm text-gray-400">{vehicle.type}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{vehicle.batteryLevel}%</p>
                  <p className="text-xs text-gray-400">{vehicle.range} km range</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sustainability Goals */}
        <div className="bg-gray-700 rounded-lg p-4">
          <h4 className="font-semibold mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-purple-400" />
            Sustainability Goals
          </h4>
          <div className="space-y-4">
            {metrics.sustainabilityGoals.map((goal: any, index: number) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">{goal.title}</span>
                  <span className="text-sm text-gray-400">{goal.progress}% complete</span>
                </div>
                <div className="w-full bg-gray-600 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${goal.progress >= 80 ? 'bg-green-400' : goal.progress >= 60 ? 'bg-yellow-400' : 'bg-red-400'}`}
                    style={{ width: `${goal.progress}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-400 mt-1">Target: {goal.target}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Carbon Offset Programs */}
      <div className="mt-6 bg-gray-700 rounded-lg p-4">
        <h4 className="font-semibold mb-4 flex items-center">
          <Recycle className="w-5 h-5 mr-2 text-blue-400" />
          Carbon Offset Programs
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {metrics.carbonOffsets.map((offset: any, index: number) => (
            <div key={index} className="bg-gray-600 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{offset.program}</p>
                  <p className="text-sm text-gray-400">{offset.type}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-green-400">{offset.credits} credits</p>
                  <p className="text-xs text-gray-400">{offset.impact} kg CO₂</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};