import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { AudioRecorder, encodeAudioForAPI, playAudioData } from '@/utils/audioUtils';

interface VoiceInterfaceProps {
  userInfo?: {
    name: string;
    email?: string;
    roomNumber?: string;
  };
  onTranscriptUpdate?: (transcript: string, isPartial: boolean) => void;
  onSpeakingChange?: (speaking: boolean) => void;
}

export const VoiceInterface: React.FC<VoiceInterfaceProps> = ({
  userInfo,
  onTranscriptUpdate,
  onSpeakingChange
}) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentTranscript, setCurrentTranscript] = useState('');
  
  const wsRef = useRef<WebSocket | null>(null);
  const audioRecorderRef = useRef<AudioRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    return () => {
      disconnect();
    };
  }, []);

  const connect = async () => {
    try {
      // Initialize audio context
      audioContextRef.current = new AudioContext({ sampleRate: 24000 });
      
      // Connect to our edge function WebSocket
      const wsUrl = `wss://qvhthjtzderafabfbfc.functions.supabase.co/openai-realtime-voice`;
      wsRef.current = new WebSocket(wsUrl);

      wsRef.current.onopen = () => {
        console.log('Connected to voice service');
        setIsConnected(true);
        startRecording();
        
        toast({
          title: "Voice Chat Connected",
          description: "You can now speak to the AI assistant",
        });
      };

      wsRef.current.onmessage = async (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log('Received:', data.type);

          switch (data.type) {
            case 'response.audio.delta':
              // Play audio response
              if (data.delta && audioContextRef.current) {
                const binaryString = atob(data.delta);
                const bytes = new Uint8Array(binaryString.length);
                for (let i = 0; i < binaryString.length; i++) {
                  bytes[i] = binaryString.charCodeAt(i);
                }
                await playAudioData(audioContextRef.current, bytes);
                setIsSpeaking(true);
                onSpeakingChange?.(true);
              }
              break;

            case 'response.audio.done':
              setIsSpeaking(false);
              onSpeakingChange?.(false);
              break;

            case 'conversation.item.input_audio_transcription.completed':
              // User speech transcription
              if (data.transcript) {
                setCurrentTranscript(data.transcript);
                onTranscriptUpdate?.(data.transcript, false);
              }
              break;

            case 'response.audio_transcript.delta':
              // AI response transcription (partial)
              if (data.delta) {
                onTranscriptUpdate?.(data.delta, true);
              }
              break;

            case 'response.audio_transcript.done':
              // AI response transcription complete
              onTranscriptUpdate?.('', false);
              break;

            case 'error':
              console.error('Voice service error:', data.message);
              toast({
                title: "Voice Error",
                description: data.message,
                variant: "destructive"
              });
              break;
          }
        } catch (error) {
          console.error('Error processing voice message:', error);
        }
      };

      wsRef.current.onclose = () => {
        console.log('Voice service disconnected');
        setIsConnected(false);
        setIsRecording(false);
        setIsSpeaking(false);
        onSpeakingChange?.(false);
      };

      wsRef.current.onerror = (error) => {
        console.error('WebSocket error:', error);
        toast({
          title: "Connection Error",
          description: "Failed to connect to voice service",
          variant: "destructive"
        });
      };

    } catch (error) {
      console.error('Error connecting to voice service:', error);
      toast({
        title: "Voice Setup Error",
        description: "Failed to initialize voice chat",
        variant: "destructive"
      });
    }
  };

  const startRecording = async () => {
    try {
      audioRecorderRef.current = new AudioRecorder((audioData) => {
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
          const base64Audio = encodeAudioForAPI(audioData);
          wsRef.current.send(JSON.stringify({
            type: 'input_audio_buffer.append',
            audio: base64Audio
          }));
        }
      });

      await audioRecorderRef.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
      toast({
        title: "Microphone Error",
        description: "Failed to access microphone",
        variant: "destructive"
      });
    }
  };

  const stopRecording = () => {
    if (audioRecorderRef.current) {
      audioRecorderRef.current.stop();
      audioRecorderRef.current = null;
      setIsRecording(false);
    }
  };

  const disconnect = () => {
    stopRecording();
    
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }

    setIsConnected(false);
    setIsSpeaking(false);
    setCurrentTranscript('');
    onSpeakingChange?.(false);
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4 bg-card rounded-lg border">
      <div className="flex items-center gap-4">
        {!isConnected ? (
          <Button onClick={connect} className="flex items-center gap-2">
            <Mic className="h-4 w-4" />
            Start Voice Chat
          </Button>
        ) : (
          <Button onClick={disconnect} variant="destructive" className="flex items-center gap-2">
            <MicOff className="h-4 w-4" />
            End Voice Chat
          </Button>
        )}
        
        {isConnected && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            {isRecording && (
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                Recording
              </div>
            )}
            {isSpeaking && (
              <div className="flex items-center gap-1">
                <Volume2 className="h-3 w-3" />
                AI Speaking
              </div>
            )}
          </div>
        )}
      </div>

      {currentTranscript && (
        <div className="w-full p-3 bg-muted rounded-md">
          <p className="text-sm font-medium mb-1">You said:</p>
          <p className="text-sm text-muted-foreground">{currentTranscript}</p>
        </div>
      )}

      {isConnected && (
        <div className="text-center text-sm text-muted-foreground">
          <p>Try saying:</p>
          <ul className="list-disc list-inside mt-1 space-y-1">
            <li>"I want extra pillows"</li>
            <li>"Book me a table for 2 at 7pm"</li>
            <li>"I need a massage tomorrow"</li>
            <li>"What restaurants are available?"</li>
          </ul>
        </div>
      )}
    </div>
  );
};