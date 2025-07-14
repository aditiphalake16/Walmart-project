import React, { createContext, useContext, useEffect, useState } from 'react';

interface WebSocketContextType {
  isConnected: boolean;
  lastMessage: any;
  sendMessage: (message: any) => void;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
};

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<any>(null);

  useEffect(() => {
    // Simulate WebSocket connection
    setIsConnected(true);
    
    // Simulate real-time updates
    const interval = setInterval(() => {
      const messageTypes = ['inventory_update', 'anomaly_detected', 'transfer_completed', 'route_optimized'];
      const randomType = messageTypes[Math.floor(Math.random() * messageTypes.length)];
      
      setLastMessage({
        type: randomType,
        timestamp: new Date().toISOString(),
        data: generateMockData(randomType)
      });
    }, 30000); // Every 30 seconds

    return () => {
      clearInterval(interval);
      setIsConnected(false);
    };
  }, []);

  const sendMessage = (message: any) => {
    // Simulate sending message
    console.log('Sending message:', message);
  };

  const generateMockData = (type: string) => {
    switch (type) {
      case 'inventory_update':
        return { product: 'Milk', store: 'Andheri', quantity: 85 };
      case 'anomaly_detected':
        return { type: 'spoilage', severity: 'medium', product: 'Bread' };
      case 'transfer_completed':
        return { from: 'Malad', to: 'Bandra', product: 'Biscuits', quantity: 50 };
      case 'route_optimized':
        return { routeId: 'R001', savings: '15% carbon reduction' };
      default:
        return {};
    }
  };

  return (
    <WebSocketContext.Provider value={{
      isConnected,
      lastMessage,
      sendMessage
    }}>
      {children}
    </WebSocketContext.Provider>
  );
};