import React, { useState, useEffect } from 'react';
import { AnomalyService } from '../services/AnomalyService';
import { AlertTriangle, Shield, TrendingDown, Clock } from 'lucide-react';

interface AnomalyDetectorProps {
  storeId: string;
}

export const AnomalyDetector: React.FC<AnomalyDetectorProps> = ({ storeId }) => {
  const [anomalies, setAnomalies] = useState<any[]>([]);
  const [filter, setFilter] = useState('all');
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    const detectAnomalies = () => {
      const detectedAnomalies = AnomalyService.detectAnomalies(storeId);
      setAnomalies(detectedAnomalies);
    };

    detectAnomalies();
    
    let interval: NodeJS.Timeout;
    if (autoRefresh) {
      interval = setInterval(detectAnomalies, 30000); // Refresh every 30 seconds
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [storeId, autoRefresh]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-400 bg-red-900';
      case 'high': return 'text-orange-400 bg-orange-900';
      case 'medium': return 'text-yellow-400 bg-yellow-900';
      case 'low': return 'text-blue-400 bg-blue-900';
      default: return 'text-gray-400 bg-gray-900';
    }
  };

  const getAnomalyIcon = (type: string) => {
    switch (type) {
      case 'inventory': return <AlertTriangle className="w-5 h-5" />;
      case 'fraud': return <Shield className="w-5 h-5" />;
      case 'spoilage': return <TrendingDown className="w-5 h-5" />;
      case 'delivery': return <Clock className="w-5 h-5" />;
      default: return <AlertTriangle className="w-5 h-5" />;
    }
  };

  const filteredAnomalies = anomalies.filter(anomaly => {
    if (filter === 'all') return true;
    return anomaly.severity === filter;
  });

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <AlertTriangle className="w-6 h-6 text-red-400" />
          <h3 className="text-xl font-semibold">Anomaly Detection</h3>
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm"
          >
            <option value="all">All Severities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              autoRefresh 
                ? 'bg-green-600 hover:bg-green-700' 
                : 'bg-gray-600 hover:bg-gray-700'
            }`}
          >
            {autoRefresh ? 'Auto-Refresh On' : 'Auto-Refresh Off'}
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {filteredAnomalies.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <Shield className="w-12 h-12 mx-auto mb-4" />
            <p>No anomalies detected. System is running smoothly.</p>
          </div>
        ) : (
          filteredAnomalies.map((anomaly, index) => (
            <div key={index} className="bg-gray-700 rounded-lg p-4 border-l-4 border-red-500">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <div className="text-red-400 mt-1">
                    {getAnomalyIcon(anomaly.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-medium">{anomaly.title}</h4>
                      <span className={`px-2 py-1 rounded text-xs ${getSeverityColor(anomaly.severity)}`}>
                        {anomaly.severity}
                      </span>
                    </div>
                    <p className="text-gray-300 text-sm mb-2">{anomaly.description}</p>
                    <div className="flex items-center space-x-4 text-xs text-gray-400">
                      <span>Type: {anomaly.type}</span>
                      <span>Confidence: {(anomaly.confidence * 100).toFixed(1)}%</span>
                      <span>Detected: {anomaly.timestamp}</span>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-xs">
                    Investigate
                  </button>
                  <button className="px-3 py-1 bg-green-600 hover:bg-green-700 rounded text-xs">
                    Resolve
                  </button>
                </div>
              </div>
              
              {anomaly.recommendations && (
                <div className="mt-3 p-3 bg-gray-600 rounded">
                  <h6 className="font-medium text-sm mb-2">Recommended Actions:</h6>
                  <ul className="text-sm text-gray-300 space-y-1">
                    {anomaly.recommendations.map((rec: string, idx: number) => (
                      <li key={idx} className="flex items-start">
                        <span className="text-blue-400 mr-2">•</span>
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};