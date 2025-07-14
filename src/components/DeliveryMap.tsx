import React, { useState, useEffect } from 'react';
import { RouteOptimizer } from '../services/RouteOptimizer';
import { Map, Truck, Zap, Route } from 'lucide-react';

interface DeliveryMapProps {
  storeId: string;
}

export const DeliveryMap: React.FC<DeliveryMapProps> = ({ storeId }) => {
  const [routes, setRoutes] = useState<any[]>([]);
  const [selectedRoute, setSelectedRoute] = useState<any>(null);
  const [optimization, setOptimization] = useState('eco');

  useEffect(() => {
    const optimizedRoutes = RouteOptimizer.optimizeRoutes(storeId, optimization);
    setRoutes(optimizedRoutes);
    if (optimizedRoutes.length > 0) {
      setSelectedRoute(optimizedRoutes[0]);
    }
  }, [storeId, optimization]);

  const getRouteColor = (type: string) => {
    switch (type) {
      case 'eco': return 'text-green-400';
      case 'express': return 'text-blue-400';
      case 'pooled': return 'text-purple-400';
      default: return 'text-gray-400';
    }
  };

  const getVehicleIcon = (vehicleType: string) => {
    return vehicleType === 'electric' ? <Zap className="w-4 h-4" /> : <Truck className="w-4 h-4" />;
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Map className="w-6 h-6 text-green-400" />
          <h3 className="text-xl font-semibold">Delivery Route Optimization</h3>
        </div>
        <select
          value={optimization}
          onChange={(e) => setOptimization(e.target.value)}
          className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm"
        >
          <option value="eco">Eco-Friendly</option>
          <option value="time">Time Optimal</option>
          <option value="cost">Cost Optimal</option>
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Route List */}
        <div className="space-y-4">
          <h4 className="font-semibold text-gray-300">Active Routes</h4>
          {routes.map((route, index) => (
            <div
              key={index}
              onClick={() => setSelectedRoute(route)}
              className={`bg-gray-700 rounded-lg p-4 cursor-pointer transition-colors ${
                selectedRoute?.id === route.id ? 'ring-2 ring-blue-500' : 'hover:bg-gray-600'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`flex items-center space-x-2 ${getRouteColor(route.type)}`}>
                    {getVehicleIcon(route.vehicleType)}
                    <span className="font-medium">Route {route.id}</span>
                  </div>
                  <span className="text-xs bg-gray-600 px-2 py-1 rounded">
                    {route.type}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{route.distance} km</p>
                  <p className="text-xs text-gray-400">{route.estimatedTime}</p>
                </div>
              </div>
              
              <div className="mt-3 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="text-sm">
                    <span className="text-gray-400">Stops: </span>
                    <span className="text-white">{route.stops}</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-gray-400">Carbon: </span>
                    <span className="text-green-400">{route.carbonFootprint} kg</span>
                  </div>
                </div>
                <div className="text-sm">
                  <span className="text-gray-400">Cost: </span>
                  <span className="text-blue-400">₹{route.cost}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Route Details */}
        <div className="space-y-4">
          <h4 className="font-semibold text-gray-300">Route Details</h4>
          {selectedRoute && (
            <div className="bg-gray-700 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h5 className="font-medium">Route {selectedRoute.id}</h5>
                <span className={`px-2 py-1 rounded text-xs ${
                  selectedRoute.status === 'active' ? 'bg-green-600' : 'bg-yellow-600'
                }`}>
                  {selectedRoute.status}
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Vehicle:</span>
                  <span className="capitalize">{selectedRoute.vehicleType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Driver:</span>
                  <span>{selectedRoute.driver}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Estimated Time:</span>
                  <span>{selectedRoute.estimatedTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Fuel Efficiency:</span>
                  <span>{selectedRoute.fuelEfficiency}</span>
                </div>
              </div>

              <div className="mt-4 p-3 bg-gray-600 rounded">
                <h6 className="font-medium mb-2 flex items-center">
                  <Route className="w-4 h-4 mr-2" />
                  Delivery Stops
                </h6>
                <div className="space-y-2">
                  {selectedRoute.deliveryStops?.map((stop: any, index: number) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <span>{stop.location}</span>
                      <span className="text-gray-400">{stop.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};