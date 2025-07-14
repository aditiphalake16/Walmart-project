export class EcoService {
  static getEcoMetrics(storeId: string, period: string) {
    return {
      carbonFootprint: 245,
      carbonChange: -15,
      energyConsumption: 1240,
      energyChange: -8,
      wasteRecycled: 85,
      wasteChange: +23,
      efficiencyScore: 87,
      efficiencyChange: +12,
      
      evFleet: [
        {
          id: 'EV-001',
          type: 'Electric Van',
          status: 'active',
          batteryLevel: 85,
          range: 180
        },
        {
          id: 'EV-002',
          type: 'Electric Bike',
          status: 'active',
          batteryLevel: 92,
          range: 120
        },
        {
          id: 'EV-003',
          type: 'Electric Truck',
          status: 'charging',
          batteryLevel: 45,
          range: 85
        }
      ],
      
      sustainabilityGoals: [
        {
          title: 'Carbon Neutral Deliveries',
          progress: 78,
          target: 'By Q2 2025'
        },
        {
          title: 'Waste Reduction',
          progress: 65,
          target: '50% reduction'
        },
        {
          title: 'Energy Efficiency',
          progress: 82,
          target: '90% renewable energy'
        },
        {
          title: 'Plastic-Free Packaging',
          progress: 45,
          target: '100% biodegradable'
        }
      ],
      
      carbonOffsets: [
        {
          program: 'Forest Restoration',
          type: 'Tree Planting',
          credits: 125,
          impact: 250
        },
        {
          program: 'Solar Farm',
          type: 'Renewable Energy',
          credits: 89,
          impact: 178
        },
        {
          program: 'Ocean Cleanup',
          type: 'Marine Conservation',
          credits: 67,
          impact: 134
        }
      ]
    };
  }

  static calculateRouteEmissions(distance: number, vehicleType: string) {
    const emissionFactors = {
      'electric': 0,
      'hybrid': 0.17,
      'diesel': 0.25,
      'petrol': 0.23
    };

    return distance * (emissionFactors[vehicleType as keyof typeof emissionFactors] || 0.25);
  }

  static optimizeForSustainability(routes: any[]) {
    return routes.sort((a, b) => a.carbonFootprint - b.carbonFootprint);
  }
}