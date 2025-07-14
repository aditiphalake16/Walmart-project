import React, { useState, useEffect, useCallback } from 'react';
import { VoiceService } from '../services/VoiceService';
import { Mic, MicOff, Volume2, MessageCircle, AlertCircle, Loader } from 'lucide-react';

export const VoiceInterface: React.FC = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [error, setError] = useState('');
  const [isSupported, setIsSupported] = useState(true);

  useEffect(() => {
    setIsSupported(VoiceService.isSupported());
    if (!VoiceService.isSupported()) {
      setError('Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari.');
    }
  }, []);

  const startListening = useCallback(async () => {
    if (!isSupported) return;
    
    try {
      setError('');
      setIsListening(true);
      setTranscript('');
      setResponse('');
      
      const result = await VoiceService.startListening();
      setTranscript(result);
      setIsListening(false);
      
      // Process the command
      setIsProcessing(true);
      const aiResponse = await VoiceService.processVoiceCommand(result);
      setResponse(aiResponse);
      setIsProcessing(false);
      
      // Speak the response
      setIsSpeaking(true);
      await VoiceService.speak(aiResponse);
      setIsSpeaking(false);
      
    } catch (err: any) {
      setIsListening(false);
      setIsProcessing(false);
      setIsSpeaking(false);
      setError(err.message || 'An error occurred');
    }
  }, [isSupported]);

  const stopListening = useCallback(() => {
    VoiceService.stopListening();
    setIsListening(false);
  }, []);

  const clearConversation = useCallback(() => {
    setTranscript('');
    setResponse('');
    setError('');
  }, []);

  if (!isSupported) {
    return (
      <div className="fixed bottom-6 right-6 bg-gray-800 border border-red-500 rounded-lg p-4 w-80 shadow-lg">
        <div className="flex items-center space-x-2 text-red-400">
          <AlertCircle className="w-5 h-5" />
          <span className="text-sm">Speech recognition not supported</span>
        </div>
        <p className="text-xs text-gray-400 mt-2">
          Please use Chrome, Edge, or Safari for voice features.
        </p>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 bg-gray-800 border border-gray-700 rounded-lg p-4 w-80 shadow-lg max-h-96 overflow-y-auto">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <MessageCircle className="w-5 h-5 text-blue-400" />
          <h4 className="font-semibold">Walmart AI Assistant</h4>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={clearConversation}
            className="p-1 text-gray-400 hover:text-gray-300 transition-colors"
            title="Clear conversation"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
          <button
            onClick={isListening ? stopListening : startListening}
            disabled={isProcessing || isSpeaking}
            className={`p-2 rounded-full transition-colors ${
              isListening 
                ? 'bg-red-600 hover:bg-red-700 animate-pulse' 
                : isProcessing || isSpeaking
                ? 'bg-gray-600 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
            title={isListening ? 'Stop listening' : 'Start listening'}
          >
            {isProcessing || isSpeaking ? (
              <Loader className="w-4 h-4 animate-spin" />
            ) : isListening ? (
              <MicOff className="w-4 h-4" />
            ) : (
              <Mic className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-900 border border-red-700 rounded-lg">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-red-400" />
            <span className="text-sm text-red-300">Error</span>
          </div>
          <p className="text-sm text-red-200 mt-1">{error}</p>
        </div>
      )}

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
          <p className="text-xs text-blue-200 mt-2">
            Try: "Check inventory for Andheri store" or "Optimize delivery routes"
          </p>
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
            <Loader className="w-4 h-4 animate-spin text-blue-400" />
            <span className="text-sm text-gray-300">Processing with Gemini AI...</span>
          </div>
        </div>
      )}

      {isSpeaking && (
        <div className="mb-4 p-3 bg-purple-900 border border-purple-700 rounded-lg">
          <div className="flex items-center space-x-2">
            <Volume2 className="w-4 h-4 text-purple-400 animate-pulse" />
            <span className="text-sm text-purple-300">Speaking response...</span>
          </div>
        </div>
      )}

      {response && !isProcessing && (
        <div className="mb-4 p-3 bg-green-900 border border-green-700 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <Volume2 className="w-4 h-4 text-green-400" />
            <span className="text-sm text-green-300">AI Assistant:</span>
          </div>
          <p className="text-sm text-white whitespace-pre-wrap">{response}</p>
        </div>
      )}

      {!isListening && !isProcessing && !isSpeaking && !transcript && (
        <div className="text-center">
          <div className="text-xs text-gray-400 mb-2">
            Click the microphone to start
          </div>
          <div className="text-xs text-gray-500">
            Ask about inventory, routes, transfers, or anomalies
          </div>
        </div>
      )}
    </div>
  );
};