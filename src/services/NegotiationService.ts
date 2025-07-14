export class NegotiationService {
  static getNegotiations(storeId: string) {
    const negotiations = [
      {
        id: 'NEG-001',
        product: 'Biscuits',
        fromStore: 'Andheri',
        toStore: 'Bandra',
        quantity: 50,
        status: 'pending',
        priority: 'high',
        distance: 8.5,
        estimatedCost: 180,
        timestamp: '2 hours ago',
        notes: 'Urgent request due to unexpected demand spike'
      },
      {
        id: 'NEG-002',
        product: 'Milk',
        fromStore: 'Malad',
        toStore: 'Andheri',
        quantity: 30,
        status: 'approved',
        priority: 'medium',
        distance: 12.3,
        estimatedCost: 220,
        timestamp: '1 hour ago',
        notes: 'Regular restocking - delivery scheduled for tomorrow'
      },
      {
        id: 'NEG-003',
        product: 'T-Shirt',
        fromStore: 'Bandra',
        toStore: 'Malad',
        quantity: 20,
        status: 'in_transit',
        priority: 'low',
        distance: 15.2,
        estimatedCost: 300,
        timestamp: '3 hours ago',
        notes: 'Seasonal clearance transfer'
      },
      {
        id: 'NEG-004',
        product: 'iPhone 15',
        fromStore: 'Andheri',
        toStore: 'Bandra',
        quantity: 3,
        status: 'rejected',
        priority: 'high',
        distance: 8.5,
        estimatedCost: 150,
        timestamp: '4 hours ago',
        notes: 'Insufficient stock at source location'
      },
      {
        id: 'NEG-005',
        product: 'Paracetamol',
        fromStore: 'Malad',
        toStore: 'Bandra',
        quantity: 25,
        status: 'completed',
        priority: 'medium',
        distance: 18.7,
        estimatedCost: 280,
        timestamp: '5 hours ago',
        notes: 'Emergency medical supply transfer - completed successfully'
      }
    ];

    return negotiations.filter(neg => 
      neg.fromStore.toLowerCase() === storeId || 
      neg.toStore.toLowerCase() === storeId
    );
  }

  static createNegotiation(request: any) {
    // Simulate AI-powered negotiation logic
    const negotiation = {
      id: `NEG-${Date.now()}`,
      ...request,
      status: 'pending',
      timestamp: 'Just now',
      estimatedCost: this.calculateTransferCost(request.distance, request.quantity),
      priority: this.calculatePriority(request)
    };

    return negotiation;
  }

  static calculateTransferCost(distance: number, quantity: number) {
    const baseRate = 5; // ₹5 per km
    const quantityFactor = Math.max(1, Math.floor(quantity / 10));
    return Math.round(distance * baseRate * quantityFactor);
  }

  static calculatePriority(request: any) {
    if (request.urgency === 'emergency') return 'critical';
    if (request.stockLevel < 0.1) return 'high';
    if (request.stockLevel < 0.3) return 'medium';
    return 'low';
  }

  static approveNegotiation(negotiationId: string) {
    // Simulate approval process
    return {
      success: true,
      message: 'Negotiation approved and transfer initiated',
      trackingId: `TRK-${Date.now()}`
    };
  }
}