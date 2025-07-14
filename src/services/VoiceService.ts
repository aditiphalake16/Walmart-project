export class VoiceService {
  private static recognition: SpeechRecognition | null = null;
  private static synthesis: SpeechSynthesis = window.speechSynthesis;
  private static isListening = false;
  private static GEMINI_API_KEY = 'AIzaSyCgeWYSWpTRn89MNgJ-xMQbCKirom2hPxs';
  private static GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${this.GEMINI_API_KEY}`;

  static initialize() {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      this.recognition = new SpeechRecognition();
      
      this.recognition.continuous = false;
      this.recognition.interimResults = false;
      this.recognition.lang = 'en-US';
      
      return true;
    }
    return false;
  }

  static startListening(): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!this.recognition) {
        if (!this.initialize()) {
          reject(new Error('Speech recognition not supported'));
          return;
        }
      }

      if (this.isListening) {
        reject(new Error('Already listening'));
        return;
      }

      this.isListening = true;
      
      this.recognition!.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        this.isListening = false;
        resolve(transcript);
      };

      this.recognition!.onerror = (event) => {
        this.isListening = false;
        reject(new Error(`Speech recognition error: ${event.error}`));
      };

      this.recognition!.onend = () => {
        this.isListening = false;
      };

      try {
        this.recognition!.start();
      } catch (error) {
        this.isListening = false;
        reject(error);
      }
    });
  }

  static stopListening() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
  }

  static async processVoiceCommand(command: string): Promise<string> {
    try {
      // Create context about the Walmart Grid Quantum system
      const systemContext = `
You are an AI assistant for Walmart Grid Quantum, an advanced hyperlocal logistics intelligence system. You help store managers and logistics coordinators with:

1. Inventory Management - Track stock levels, transfers between stores
2. Demand Forecasting - Predict product demand using AI
3. Route Optimization - Optimize delivery routes for efficiency and sustainability
4. Anomaly Detection - Detect fraud, spoilage, and unusual patterns
5. Inter-store Negotiations - Facilitate inventory transfers between stores
6. Eco Metrics - Track carbon footprint and sustainability goals

Current system data context:
- Stores: Andheri, Bandra, Malad (Mumbai region)
- Products: Groceries, Electronics, Clothing, Pharmacy items
- Fleet: Electric vehicles, hybrid vehicles for eco-friendly delivery
- Real-time monitoring of inventory levels, transfers, and anomalies

Respond as a helpful logistics assistant. Keep responses concise, actionable, and focused on logistics operations. If asked about specific data, provide realistic examples based on the store context.

User command: "${command}"
`;

      const response = await fetch(this.GEMINI_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: systemContext
            }]
          }]
        })
      });

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status}`);
      }

      const data = await response.json();
      const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || 
                        this.getFallbackResponse(command);

      return aiResponse;
    } catch (error) {
      console.error('Error processing voice command:', error);
      return this.getFallbackResponse(command);
    }
  }

  private static getFallbackResponse(command: string): string {
    const lowerCommand = command.toLowerCase();
    
    if (lowerCommand.includes('inventory')) {
      return "I can help you check inventory levels across all stores. Which store and product would you like to check?";
    }
    
    if (lowerCommand.includes('transfer') || lowerCommand.includes('send')) {
      return "I can help you initiate inventory transfers between stores. Which product and stores are involved?";
    }
    
    if (lowerCommand.includes('route') || lowerCommand.includes('delivery')) {
      return "I can optimize delivery routes for efficiency and sustainability. Would you like to see current routes or create new ones?";
    }
    
    if (lowerCommand.includes('anomaly') || lowerCommand.includes('alert')) {
      return "Let me check for any anomalies in the system. I'll scan for fraud, spoilage, and unusual patterns.";
    }
    
    if (lowerCommand.includes('carbon') || lowerCommand.includes('eco')) {
      return "I can provide sustainability metrics including carbon footprint and eco-friendly delivery options.";
    }
    
    return "I'm here to help with inventory management, route optimization, anomaly detection, and inter-store coordination. What would you like to know?";
  }

  static speak(text: string): Promise<void> {
    return new Promise((resolve) => {
      if (!this.synthesis) {
        resolve();
        return;
      }

      // Cancel any ongoing speech
      this.synthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 0.8;

      utterance.onend = () => resolve();
      utterance.onerror = () => resolve();

      this.synthesis.speak(utterance);
    });
  }

  static isCurrentlyListening(): boolean {
    return this.isListening;
  }

  static isSupported(): boolean {
    return 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
  }
}