import { useState, useCallback, useRef, useEffect } from "react";
import { toast } from "sonner";

export const useSpeechToText = (onResult: (text: string) => void, lang: string = "en") => {
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  const onResultRef = useRef(onResult);

  // Map app lang to recognition lang
  const langMap: Record<string, string> = {
    en: "en-IN",
    hi: "hi-IN",
    pa: "pa-IN",
    ml: "ml-IN",
    ur: "ur-IN",
    mr: "mr-IN"
  };

  // Keep onResult callback updated
  useEffect(() => {
    onResultRef.current = onResult;
  }, [onResult]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        console.error("Stop error:", e);
      }
      setIsListening(false);
    }
  }, []);

  const startListening = useCallback(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      toast.error("Speech recognition is not supported in this browser. Please use Chrome or Edge.");
      return;
    }

    // Always create a new instance to avoid state issues from previous sessions
    if (recognitionRef.current) {
      stopListening();
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = langMap[lang] || "en-IN";

    recognition.onstart = () => {
      setIsListening(true);
      toast.info("Listening... Please speak now.");
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      if (transcript) {
        onResultRef.current(transcript);
        toast.success(`Recognized: "${transcript}"`);
      }
      setIsListening(false);
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error);
      setIsListening(false);
      
      switch (event.error) {
        case 'not-allowed':
          toast.error("Microphone access denied. Please enable it in your browser settings.");
          break;
        case 'no-speech':
          toast.warning("No speech was detected. Please try again.");
          break;
        case 'network':
          toast.error("Network error. Speech recognition requires an internet connection.");
          break;
        default:
          toast.error(`Speech error: ${event.error}`);
      }
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    try {
      recognition.start();
    } catch (err) {
      console.error("Failed to start speech recognition:", err);
      toast.error("Could not start microphone. Please try again.");
      setIsListening(false);
    }
  }, [stopListening]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  return { isListening, startListening, stopListening };
};
