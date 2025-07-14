export class AnomalyService {
  static detectAnomalies(storeId: string) {
    const anomalies = [
      {
        type: 'inventory',
        severity: 'high',
        title: 'Unusual Stock Depletion',
        description: 'Bread inventory decreased by 40% in last 2 hours - significantly above normal consumption rate',
        confidence: 0.94,
        timestamp: '15 minutes ago',
        recommendations: [
          'Check POS system for bulk purchases',
          'Review inventory tracking logs',
          'Verify supplier delivery schedules',
          'Contact nearby stores for emergency stock'
        ]
      },
      {
        type: 'spoilage',
        severity: 'medium',
        title: 'Perishable Item Spoilage Alert',
        description: 'Milk products showing 25% higher spoilage rate than historical average',
        confidence: 0.87,
        timestamp: '32 minutes ago',
        recommendations: [
          'Check refrigeration unit temperature',
          'Review cold chain logistics',
          'Inspect product handling procedures',
          'Adjust inventory turnover strategy'
        ]
      },
      {
        type: 'fraud',
        severity: 'critical',
        title: 'Suspicious Transaction Pattern',
        description: 'Multiple high-value electronics transactions detected outside normal business hours',
        confidence: 0.91,
        timestamp: '5 minutes ago',
        recommendations: [
          'Review security camera footage',
          'Audit staff access logs',
          'Check transaction authentication',
          'Contact security personnel immediately'
        ]
      },
      {
        type: 'delivery',
        severity: 'low',
        title: 'Delivery Route Delay',
        description: 'Route R003 is 25 minutes behind schedule due to unexpected traffic conditions',
        confidence: 0.78,
        timestamp: '1 hour ago',
        recommendations: [
          'Notify customers of delay',
          'Reroute through alternative paths',
          'Update delivery time estimates',
          'Consider emergency backup vehicles'
        ]
      }
    ];

    // Simulate real-time anomaly detection
    return anomalies.slice(0, Math.floor(Math.random() * 4) + 1);
  }

  static getAnomalyTrends(storeId: string, period: string) {
    return {
      totalAnomalies: 24,
      resolvedAnomalies: 18,
      criticalAnomalies: 2,
      averageResolutionTime: '45 minutes',
      trends: [
        { type: 'inventory', count: 8, trend: '+12%' },
        { type: 'spoilage', count: 6, trend: '-8%' },
        { type: 'fraud', count: 3, trend: '+150%' },
        { type: 'delivery', count: 7, trend: '+5%' }
      ]
    };
  }

  static resolveAnomaly(anomalyId: string, resolution: string) {
    // Simulate anomaly resolution
    return {
      success: true,
      message: 'Anomaly resolved successfully',
      timestamp: new Date().toISOString()
    };
  }
}