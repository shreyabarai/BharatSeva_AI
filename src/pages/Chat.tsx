import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  ArrowLeft, CheckCircle, ChevronDown, ChevronUp, ExternalLink, 
  FileText, Info, Languages, Maximize2, MessageSquare, 
  Mic, MicOff, Minus, Send, Volume2, X
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useLang, type Lang } from "@/contexts/LanguageContext";
import ReactMarkdown from "react-markdown";
import { useSpeechToText } from "@/hooks/use-speech-to-text";
import { ChatMessage, processUserQuery, speakText, translateMessage } from "@/lib/chatbot-engine";
import { Scheme, schemes } from "@/data/schemes";
import { generateApplicationPDF } from "@/lib/pdf-utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const languages: { code: Lang; label: string }[] = [
  { code: "en", label: "English" },
  { code: "hi", label: "हिंदी" },
  { code: "mr", label: "मराठी" },
  { code: "pa", label: "ਪੰਜਾਬੀ" },
  { code: "ml", label: "മലയാളം" },
  { code: "ur", label: "اردو" },
];

const ChatCard = ({ scheme, profile }: { scheme: Scheme, profile?: any }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();
  const { t } = useLang();

  const handleExternalApply = () => {
    try {
      let url = scheme.applyUrl;
      if (profile) {
        // Attempt to append common query parameters for auto-fill (simulated/standardized)
        const params = new URLSearchParams();
        if (profile.name) params.append("name", profile.name);
        if (profile.age) params.append("age", profile.age.toString());
        if (profile.gender) params.append("gender", profile.gender);
        if (profile.income) params.append("income", profile.income.toString());
        if (profile.state) params.append("state", profile.state);
        if (profile.occupation) params.append("occupation", profile.occupation);
        
        const queryString = params.toString();
        url = url.includes("?") ? `${url}&${queryString}` : `${url}?${queryString}`;
      }
      window.open(url, "_blank");
    } catch (err) {
      console.error("Error opening external link:", err);
    }
  };

  return (
    <Card className="mb-3 overflow-hidden border-border shadow-sm hover:shadow-md transition-all duration-300 bg-card/50">
      <CardHeader className="p-4 pb-2">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-sm font-bold leading-tight text-foreground">
            {scheme.name}
          </CardTitle>
          <Badge variant="secondary" className="shrink-0 text-[10px] px-1.5 py-0">
            {scheme.category}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0 space-y-3">
        <p className="text-xs text-muted-foreground line-clamp-2">
          {scheme.description}
        </p>
        
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden space-y-3 pt-2 border-t border-border mt-2"
            >
              <div className="space-y-1">
                <p className="text-[11px] font-bold text-foreground flex items-center gap-1">
                  <CheckCircle className="h-3 w-3 text-success" /> {t("benefits")}
                </p>
                <p className="text-xs text-muted-foreground">{scheme.benefits}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[11px] font-bold text-foreground flex items-center gap-1">
                  <Info className="h-3 w-3 text-primary" /> {t("documents")}
                </p>
                <div className="flex flex-wrap gap-1">
                  {scheme.documents.map(doc => (
                    <Badge key={doc} variant="outline" className="text-[10px] font-normal py-0">
                      {doc}
                    </Badge>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex flex-col gap-2 pt-1">
          <div className="flex gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className="flex-1 h-8 text-[11px] gap-1 hover:bg-muted"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
              {isExpanded ? t("close") : t("details")}
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1 h-8 text-[11px] gap-1"
              onClick={() => navigate(`/eligibility?scheme=${scheme.id}`)}
            >
              <CheckCircle className="h-3.5 w-3.5" />
              {t("checkEligibility")}
            </Button>
          </div>
          
          <Button 
            variant="default" 
            size="sm" 
            className="w-full h-8 text-[11px] gap-1 bg-gradient-hero text-primary-foreground shadow-sm"
            onClick={handleExternalApply}
          >
            <ExternalLink className="h-3.5 w-3.5" />
            {profile ? t("applyNow") + " (Auto-fill)" : t("applyNow")}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const Chat = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { t, lang, setLang } = useLang();
  
  // State for Window Controls
  const [isMinimized, setIsMinimized] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  const [isFullPage, setIsFullPage] = useState(location.pathname === "/chat");

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const loadProfile = useCallback(() => {
    const userId = user?.uid || "guest";
    const savedProfile = localStorage.getItem(`user_profile_${userId}`);
    if (savedProfile) {
      try {
        setUserProfile(JSON.parse(savedProfile));
      } catch (e) {
        console.error("Failed to parse user profile", e);
      }
    }
  }, [user]);

  const loadChatMemory = useCallback(() => {
    const userId = user?.uid || "guest";
    const savedChat = localStorage.getItem(`chat_memory_${userId}`);
    if (savedChat) {
      try {
        const parsed = JSON.parse(savedChat);
        if (Array.isArray(parsed)) {
          setMessages(parsed);
        } else {
          resetToInitialGreeting();
        }
      } catch (e) {
        console.error("Failed to parse chat memory", e);
        resetToInitialGreeting();
      }
    } else {
      resetToInitialGreeting();
    }
  }, [user, lang, t]);

  const resetToInitialGreeting = useCallback(() => {
    const initialGreeting: ChatMessage = {
      id: "initial-1",
      role: "assistant",
      content: t("chatWelcome"),
      timestamp: Date.now(),
      type: "options",
      data: [
        { label: lang === "hi" ? "छात्रों के लिए योजनाएं" : "Schemes for students", query: "schemes for students" },
        { label: lang === "hi" ? "महिलाओं के लिए योजनाएं" : "Schemes for women", query: "schemes for women" },
        { label: lang === "hi" ? "पात्रता जांचें" : "Check Eligibility", query: "check eligibility" },
      ]
    };
    setMessages([initialGreeting]);
  }, [lang, t]);

  // Load everything on mount or user change
  useEffect(() => {
    loadProfile();
    loadChatMemory();
  }, [user, loadProfile, loadChatMemory]);

  // Save chat memory to localStorage
  useEffect(() => {
    if (messages && Array.isArray(messages) && messages.length > 0) {
      localStorage.setItem(`chat_memory_${user?.uid || "guest"}`, JSON.stringify(messages));
    }
  }, [messages, user]);

  // Reactive translation effect
  useEffect(() => {
    if (!messages || !Array.isArray(messages)) return;
    setMessages(prev => {
      if (!prev || !Array.isArray(prev)) return [];
      return prev.map(m => translateMessage(m, lang));
    });
  }, [lang]);

  const scrollToBottom = useCallback(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  useEffect(() => {
    if (!isMinimized) {
      scrollToBottom();
    }
  }, [messages, isTyping, isMinimized, scrollToBottom]);

  const handleSend = async (customInput?: string) => {
    const query = (customInput || input).trim();
    if (!query || isTyping) return;

    setInput("");
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: query,
      timestamp: Date.now(),
      type: "text"
    };

    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    // AI Processing Delay for realism
    setTimeout(() => {
      try {
        const response = processUserQuery(query, lang, messages);
        if (!response) {
          setIsTyping(false);
          return;
        }
        
        const botMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: response.content || "",
          timestamp: Date.now(),
          type: response.type || "text",
          data: response.data,
          formStep: response.formStep,
          formData: response.formData
        };

        setMessages(prev => [...prev, botMsg]);
        setIsTyping(false);
        
        // If form is completed, save profile
        if (response.formStep === "completed" && response.formData) {
          setUserProfile(response.formData);
          localStorage.setItem(`user_profile_${user?.uid || "guest"}`, JSON.stringify(response.formData));
        }

        // Auto-speak bot response
        speakText(response.content || "", lang);
      } catch (err) {
        console.error("Error processing query:", err);
        setIsTyping(false);
      }
    }, 1000);
  };

  const { isListening, startListening, stopListening } = useSpeechToText((text) => {
    setInput(text);
  }, lang);

  const toggleVoice = () => {
    if (isListening) stopListening();
    else startListening();
  };

  const handleClose = () => {
    if (isFullPage) {
      navigate("/home");
    } else {
      setIsOpen(false);
    }
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  const toggleMaximize = () => {
    if (isFullPage) {
      navigate(-1); // Go back if we were on full page
    } else {
      navigate("/chat");
    }
  };

  if (!isOpen) {
    return (
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-gradient-hero text-primary-foreground shadow-lg hover:shadow-xl transition-all flex items-center justify-center z-50"
      >
        <MessageSquare className="h-6 w-6" />
      </motion.button>
    );
  }

  // Safety check to prevent blank page if something critical is missing
  if (!t || !lang) return <div className="fixed inset-0 flex items-center justify-center bg-background text-muted-foreground">Loading Assistant...</div>;

  return (
    <motion.div 
      initial={isFullPage ? { opacity: 1 } : { y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className={`flex flex-col bg-background overflow-hidden shadow-2xl border border-border z-50 transition-all duration-300 ${
        isFullPage 
          ? "h-screen w-full" 
          : isMinimized 
            ? "h-14 w-80 fixed bottom-6 right-6 rounded-t-2xl" 
            : "h-[600px] w-[400px] fixed bottom-6 right-6 rounded-2xl"
      }`}
    >
      {/* Header with Controls */}
      <div className="flex-none border-b border-border bg-card/90 backdrop-blur-xl">
        <div className="flex h-14 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            {isFullPage && (
              <button onClick={() => navigate("/home")} className="text-muted-foreground hover:text-foreground transition-colors">
                <ArrowLeft className="h-5 w-5" />
              </button>
            )}
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-hero shadow-sm">
              <span className="text-xs font-bold text-primary-foreground">AI</span>
            </div>
            <div>
              <p className="text-sm font-bold text-foreground leading-none">{t("chatbot")}</p>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
                <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Online</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg">
                  <Languages className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {languages.map((l) => (
                  <DropdownMenuItem key={l.code} onClick={() => setLang(l.code)}>
                    {l.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg" onClick={toggleMinimize}>
              <Minus className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg" onClick={toggleMaximize}>
              <Maximize2 className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-destructive/10 hover:text-destructive" onClick={handleClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages Area */}
          <div 
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto scrollbar-hide bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-muted/20 via-transparent to-transparent"
          >
            <div className="mx-auto max-w-3xl px-4 py-6 space-y-6">
              <AnimatePresence initial={false}>
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div className={`flex flex-col max-w-[85%] ${msg.role === "user" ? "items-end" : "items-start"}`}>
                      <div
                        className={`relative rounded-2xl px-4 py-3 text-sm shadow-sm ${
                          msg.role === "user"
                            ? "bg-primary text-primary-foreground rounded-br-none"
                            : "bg-card text-foreground border border-border rounded-bl-none"
                        }`}
                      >
                        <div className="prose prose-sm dark:prose-invert max-w-none">
                          <ReactMarkdown>{msg.content}</ReactMarkdown>
                        </div>
                        
                        {/* TTS Button for Assistant */}
                        {msg.role === "assistant" && (
                          <button 
                            onClick={() => speakText(msg.content, lang)}
                            className="absolute -right-7 top-1 text-muted-foreground hover:text-primary transition-colors"
                          >
                            <Volume2 className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>

                      {/* Render Scheme Cards */}
                      {msg.type === "schemes" && msg.data && Array.isArray(msg.data) && (
                        <div className="mt-3 w-full grid gap-3 sm:grid-cols-1">
                          {msg.data.map((scheme: Scheme) => (
                            <ChatCard key={scheme.id} scheme={scheme} profile={userProfile} />
                          ))}
                        </div>
                      )}

                      {/* Render Suggestion Options */}
                      {msg.type === "options" && msg.data && Array.isArray(msg.data) && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {msg.data.map((opt: any, i: number) => (
                            <Button
                              key={i}
                              variant="outline"
                              size="sm"
                              className="text-xs h-8 rounded-full border-primary/20 hover:bg-primary/5 hover:border-primary transition-all bg-card/50"
                              onClick={() => handleSend(opt.query)}
                            >
                              {opt.label}
                            </Button>
                          ))}
                        </div>
                      )}

                      {/* Render PDF Download and Apply Button for Form Completion */}
                      {msg.formStep === "completed" && msg.formData && (
                        <div className="mt-3 w-full space-y-2">
                          <Button
                            onClick={() => generateApplicationPDF(msg.formData)}
                            className="w-full gap-2 bg-secondary text-secondary-foreground hover:bg-secondary/90 border border-border/50"
                          >
                            <FileText className="h-4 w-4" />
                            {lang === "hi" ? "आवेदन विवरण पीडीएफ" : "Application PDF"}
                          </Button>
                          
                          {msg.formData.schemeId && (
                            <Button
                              onClick={() => {
                                const scheme = schemes.find(s => s.id === msg.formData.schemeId);
                                if (scheme) {
                                  const params = new URLSearchParams();
                                  Object.entries(msg.formData).forEach(([key, value]) => {
                                    if (key !== 'schemeId' && key !== 'ref' && key !== 'date') {
                                      params.append(key, String(value));
                                    }
                                  });
                                  const url = scheme.applyUrl.includes("?") 
                                    ? `${scheme.applyUrl}&${params.toString()}` 
                                    : `${scheme.applyUrl}?${params.toString()}`;
                                  window.open(url, "_blank");
                                }
                              }}
                              className="w-full gap-2 bg-gradient-hero text-primary-foreground shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                            >
                              <ExternalLink className="h-4 w-4" />
                              {lang === "hi" ? "आधिकारिक पोर्टल पर जमा करें" : "Submit to Official Portal"}
                            </Button>
                          )}
                        </div>
                      )}
                      
                      <span className="text-[10px] text-muted-foreground mt-1 px-1">
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </motion.div>
                ))}

                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-start"
                  >
                    <div className="bg-card border border-border rounded-2xl rounded-bl-none px-4 py-3 shadow-sm">
                      <div className="flex gap-1.5 items-center h-4">
                        <motion.span 
                          animate={{ scale: [1, 1.5, 1] }} 
                          transition={{ repeat: Infinity, duration: 0.6 }}
                          className="h-1 w-1 rounded-full bg-primary" 
                        />
                        <motion.span 
                          animate={{ scale: [1, 1.5, 1] }} 
                          transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }}
                          className="h-1 w-1 rounded-full bg-primary" 
                        />
                        <motion.span 
                          animate={{ scale: [1, 1.5, 1] }} 
                          transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }}
                          className="h-1 w-1 rounded-full bg-primary" 
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              <div ref={bottomRef} className="h-4" />
            </div>
          </div>

          {/* Input Area */}
          <div className="flex-none border-t border-border bg-card/90 backdrop-blur-xl pb-safe">
            <div className="mx-auto max-w-3xl px-4 py-4 flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <div className="relative flex-1 group">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    placeholder={isListening ? t("voiceListening") : t("typeMessage")}
                    disabled={isTyping}
                    className="pr-12 h-12 rounded-2xl border-border bg-muted/30 focus-visible:ring-primary/20 transition-all"
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={toggleVoice}
                      className={`h-8 w-8 rounded-xl transition-all ${
                        isListening 
                          ? "bg-destructive/10 text-destructive animate-pulse" 
                          : "text-muted-foreground hover:text-primary"
                      }`}
                    >
                      {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                <Button
                  size="icon"
                  onClick={() => handleSend()}
                  disabled={!input.trim() || isTyping}
                  className="h-12 w-12 rounded-2xl bg-gradient-hero text-primary-foreground shadow-md hover:shadow-lg active:scale-95 transition-all"
                >
                  <Send className="h-5 w-5" />
                </Button>
              </div>
              <p className="text-[10px] text-center text-muted-foreground">
                {lang === "hi" ? "BHARATSeva AI गलतियाँ कर सकता है। महत्वपूर्ण जानकारी की पुष्टि करें।" : "BHARATSeva AI can make mistakes. Verify important info."}
              </p>
            </div>
          </div>
        </>
      )}
    </motion.div>
  );
};

export default Chat;
