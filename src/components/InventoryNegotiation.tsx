import React, { useState, useEffect } from 'react';
import { NegotiationService } from '../services/NegotiationService';
import { Users, ArrowRight, Clock, CheckCircle } from 'lucide-react';

interface InventoryNegotiationProps {
  storeId: string;
}

export const InventoryNegotiation: React.FC<InventoryNegotiationProps> = ({ storeId }) => {
  const [negotiations, setNegotiations] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('active');

  useEffect(() => {
    const allNegotiations = NegotiationService.getNegotiations(storeId);
    setNegotiations(allNegotiations);
  }, [storeId]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-400 bg-yellow-900';
      case 'approved': return 'text-green-400 bg-green-900';
      case 'rejected': return 'text-red-400 bg-red-900';
      case 'in_transit': return 'text-blue-400 bg-blue-900';
      default: return 'text-gray-400 bg-gray-900';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'approved': return <CheckCircle className="w-4 h-4" />;
      case 'in_transit': return <ArrowRight className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const filteredNegotiations = negotiations.filter(neg => {
    if (activeTab === 'active') return ['pending', 'approved', 'in_transit'].includes(neg.status);
    if (activeTab === 'completed') return ['completed', 'rejected'].includes(neg.status);
    return true;
  });

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Users className="w-6 h-6 text-blue-400" />
          <h3 className="text-xl font-semibold">Inventory Negotiations</h3>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveTab('active')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'active' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Active
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'completed' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Completed
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {filteredNegotiations.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <Users className="w-12 h-12 mx-auto mb-4" />
            <p>No {activeTab} negotiations found.</p>
          </div>
        ) : (
          filteredNegotiations.map((negotiation, index) => (
            <div key={index} className="bg-gray-700 rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className="text-blue-400 mt-1">
                    <ArrowRight className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h4 className="font-medium">{negotiation.product}</h4>
                      <span className={`px-2 py-1 rounded text-xs ${getStatusColor(negotiation.status)}`}>
                        <div className="flex items-center space-x-1">
                          {getStatusIcon(negotiation.status)}
                          <span>{negotiation.status.replace('_', ' ')}</span>
                        </div>
                      </span>
                    </div>
                    <div className="flex items-center space-x-6 text-sm text-gray-300">
                      <div>
                        <span className="text-gray-400">From: </span>
                        <span className="font-medium">{negotiation.fromStore}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">To: </span>
                        <span className="font-medium">{negotiation.toStore}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Quantity: </span>
                        <span className="font-medium">{negotiation.quantity}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  {negotiation.status === 'pending' && (
                    <>
                      <button className="px-3 py-1 bg-green-600 hover:bg-green-700 rounded text-xs">
                        Approve
                      </button>
                      <button className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-xs">
                        Reject
                      </button>
                    </>
                  )}
                  {negotiation.status === 'approved' && (
                    <button className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-xs">
                      Track
                    </button>
                  )}
                </div>
              </div>
              
              <div className="mt-3 flex items-center justify-between text-xs text-gray-400">
                <div className="flex items-center space-x-4">
                  <span>Priority: {negotiation.priority}</span>
                  <span>Distance: {negotiation.distance} km</span>
                  <span>Cost: ₹{negotiation.estimatedCost}</span>
                </div>
                <div>
                  <span>Requested: {negotiation.timestamp}</span>
                </div>
              </div>

              {negotiation.notes && (
                <div className="mt-2 p-2 bg-gray-600 rounded text-sm">
                  <span className="text-gray-400">Notes: </span>
                  <span>{negotiation.notes}</span>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};