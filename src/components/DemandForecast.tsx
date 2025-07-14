import React, { useState, useEffect } from 'react';
import { MLService } from '../services/MLService';
import { TrendingUp, Calendar, Package } from 'lucide-react';

interface DemandForecastProps {
  storeId: string;
}

export const DemandForecast: React.FC<DemandForecastProps> = ({ storeId }) => {
  const [forecast, setForecast] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const generateForecast = async () => {
      setLoading(true);
      const forecastData = await MLService.generateDemandForecast(storeId, selectedCategory);
      setForecast(forecastData);
      setLoading(false);
    };

    generateForecast();
  }, [storeId, selectedCategory]);

  const categories = ['all', 'groceries', 'electronics', 'clothing', 'pharmacy'];

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <TrendingUp className="w-6 h-6 text-blue-400" />
          <h3 className="text-xl font-semibold">Demand Forecast</h3>
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm"
        >
          {categories.map(cat => (
            <option key={cat} value={cat}>
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
        </div>
      ) : (
        <div className="space-y-4">
          {forecast.map((item, index) => (
            <div key={index} className="bg-gray-700 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Package className="w-5 h-5 text-purple-400" />
                  <div>
                    <h4 className="font-medium">{item.product}</h4>
                    <p className="text-sm text-gray-400">{item.category}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-blue-400">{item.predictedDemand}</p>
                  <p className="text-sm text-gray-400">units</p>
                </div>
              </div>
              
              <div className="mt-3 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-400">Next 7 days</span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-sm">
                    <span className="text-gray-400">Confidence: </span>
                    <span className={`font-medium ${item.confidence > 0.8 ? 'text-green-400' : 'text-yellow-400'}`}>
                      {(item.confidence * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="text-sm">
                    <span className="text-gray-400">Trend: </span>
                    <span className={`font-medium ${item.trend > 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {item.trend > 0 ? '+' : ''}{item.trend}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};