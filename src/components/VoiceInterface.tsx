import React, { useState, useEffect } from 'react';
import { VoiceService } from '../services/VoiceService';
import { Mic, MicOff, Volume2, MessageCircle } from 'lucide-react';

export const VoiceInterface: React.FC = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const handleVoiceCommand = async (command: string) => {
      setIsProcessing(true);
      const result = await VoiceService.processVoiceCommand(command);
      setResponse(result);
      setIsProcessing(false);
    };

    if (transcript && !isListening) {
      handleVoiceCommand(transcript);
    }
  }, [transcript, isListening]);

  const startListening = () => {
    setIsListening(true);
    setTranscript('');
    setResponse('');
    // Simulate voice recognition
    setTimeout(() => {
      const commands = [
        "Should I send biscuits to Vashi?",
        "Show me inventory for Bandra store",
        "What's the carbon footprint for today's deliveries?",
        "Check anomalies in the system",
        "Optimize routes for electric vehicles"
      ];
      const randomCommand = commands[Math.floor(Math.random() * commands.length)];
      setTranscript(randomCommand);
      setIsListening(false);
    }, 2000);
  };

  const stopListening = () => {
    setIsListening(false);
  };

  return (
    <div className="fixed bottom-6 right-6 bg-gray-800 border border-gray-700 rounded-lg p-4 w-80 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <MessageCircle className="w-5 h-5 text-blue-400" />
          <h4 className="font-semibold">Voice Assistant</h4>
        </div>
        <button
          onClick={isListening ? stopListening : startListening}
          className={`p-2 rounded-full transition-colors ${
            isListening 
              ? 'bg-red-600 hover:bg-red-700' 
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
        </button>
      </div>

      {isListening && (
        <div className="mb-4 p-3 bg-blue-900 border border-blue-700 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-blue-300">Listening...</span>
          </div>
          <div className="flex space-x-1">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="w-2 bg-blue-400 rounded-full animate-pulse"
                style={{
                  height: `${Math.random() * 20 + 10}px`,
                  animationDelay: `${i * 0.1}s`
                }}
              ></div>
            ))}
          </div>
        </div>
      )}

      {transcript && (
        <div className="mb-4 p-3 bg-gray-700 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <Mic className="w-4 h-4 text-green-400" />
            <span className="text-sm text-gray-300">You said:</span>
          </div>
          <p className="text-sm text-white">{transcript}</p>
        </div>
      )}

      {isProcessing && (
        <div className="mb-4 p-3 bg-gray-700 rounded-lg">
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-400"></div>
            <span className="text-sm text-gray-300">Processing...</span>
          </div>
        </div>
      )}

      {response && (
        <div className="mb-4 p-3 bg-green-900 border border-green-700 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <Volume2 className="w-4 h-4 text-green-400" />
            <span className="text-sm text-green-300">Assistant:</span>
          </div>
          <p className="text-sm text-white">{response}</p>
        </div>
      )}

      <div className="text-xs text-gray-400 text-center">
        Say commands like "Show inventory" or "Check anomalies"
      </div>
    </div>
  );
};