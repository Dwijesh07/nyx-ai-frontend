import React, { useState, useRef, useEffect } from "react";
import axios from "axios";

export default function HomeChat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [url, setUrl] = useState("");
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [currentConversationId, setCurrentConversationId] = useState(null);
  const messagesContainerRef = useRef(null);
  const messagesEndRef = useRef(null);
  const chatInterfaceRef = useRef(null); // Add this ref for scrolling

  useEffect(() => {
    const timer = setTimeout(() => {
      scrollToBottom();
    }, 50);
    
    return () => clearTimeout(timer);
  }, [messages, isLoading]);

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      const container = messagesContainerRef.current;
      container.scrollTop = container.scrollHeight;
    }
  };
  
  useEffect(() => {
    fetchConversations();
    startNewChat();
  }, []);

  const fetchConversations = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/chat");
      setConversations(res.data.conversations);
    } catch (error) {
      console.error("Failed to load conversations:", error);
    }
  };

  const startNewChat = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/chat/new");
      setCurrentConversationId(res.data.conversationId);
      setMessages(res.data.conversation.messages);
      fetchConversations();
    } catch (error) {
      console.error("Failed to start new chat:", error);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() && !file && !url) return;

    if (!currentConversationId) {
      await startNewChat();
    }

    const userMessage = {
      id: Date.now(),
      content: input,
      role: "user",
      timestamp: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    const userInput = input;
    setInput("");
    setUrl("");
    setFile(null);
    
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("conversationId", currentConversationId);
      if (userInput) formData.append("message", userInput);
      if (url) formData.append("url", url);
      if (file) formData.append("file", file);

      const res = await axios.post("http://localhost:5000/api/chat/message", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMessages(res.data.conversation.messages);
      fetchConversations();
    } catch (error) {
      console.error("Failed to send message:", error);
      const errorMessage = {
        id: Date.now() + 1,
        content: "Sorry, I encountered an error. Please try again.",
        role: "assistant",
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); // Prevent default to avoid new line
      handleSend(e);
    }
  };

  const handleQuickQuestion = (question) => {
    setInput(question);
  };

  const loadConversation = async (conversationId) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/chat/${conversationId}`);
      setCurrentConversationId(conversationId);
      setMessages(res.data.conversation.messages);
    } catch (error) {
      console.error("Failed to load conversation:", error);
    }
  };

  const deleteConversation = async (conversationId) => {
    try {
      await axios.delete(`http://localhost:5000/api/chat/${conversationId}`);
      fetchConversations();
      if (currentConversationId === conversationId) {
        startNewChat();
      }
    } catch (error) {
      console.error("Failed to delete conversation:", error);
    }
  };

  return (
    <>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="section-container text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 gradient-text">
            Chat with Nyx
          </h2>
          <p className="text-xl text-body mb-8 max-w-3xl mx-auto">
            Your intelligent AI companion powered by NYXD1. Ask anything, get instant help with studies, work, creative projects, and everyday tasks.
          </p>
          <div className="inline-block premium-card px-6 py-3 interactive-glow">
            <span className="text-sm font-semibold text-accent-blue">NYXD1 Enhanced Model • Real AI Responses • Multi-Language Support</span>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="section-container">
        {/* Features Grid */}
        <div className="premium-card p-8 mb-10 interactive-glow">
          <h2 className="text-2xl font-bold mb-6 text-center text-headline">What I Can Help You With</h2>
          <p className="text-body mb-8 text-center">From everyday tasks to complex problems</p>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            <div className="tool-card interactive-glow">
              <div>🎓</div>
              <div className="font-semibold text-headline">Students</div>
              <p className="text-xs mt-1 text-body">Homework, research, essays</p>
            </div>

            <div className="tool-card interactive-glow">
              <div>💼</div>
              <div className="font-semibold text-headline">Professionals</div>
              <p className="text-xs mt-1 text-body">Documents, analysis, reports</p>
            </div>

            <div className="tool-card interactive-glow">
              <div>👨‍🏫</div>
              <div className="font-semibold text-headline">Teachers</div>
              <p className="text-xs mt-1 text-body">Lesson plans, content, grading</p>
            </div>

            <div className="tool-card interactive-glow">
              <div>⚖️</div>
              <div className="font-semibold text-headline">Lawyers</div>
              <p className="text-xs mt-1 text-body">Research, contracts, cases</p>
            </div>

            <div className="tool-card interactive-glow">
              <div>🔧</div>
              <div className="font-semibold text-headline">Everyone</div>
              <p className="text-xs mt-1 text-body">Daily tasks, advice, planning</p>
            </div>
          </div>
        </div>

        {/* Chat Interface - Added ref here */}
        <div 
          ref={chatInterfaceRef}
          className="premium-card max-w-4xl mx-auto interactive-glow"
        >
          {/* Chat Header */}
          <div className="bg-gradient-to-r from-accent-blue/20 to-accent-blue/10 p-4 border-b border-accent-blue/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
                <h2 className="text-headline font-semibold">Nyx AI Chat</h2>
                <span className="text-xs bg-accent-blue/20 text-accent-blue px-2 py-1 rounded">NYXD1 Enhanced • Real AI</span>
              </div>
              <div className="text-body text-sm hidden md:block">
                Connected to Backend • Real Responses
              </div>
            </div>
          </div>

          {/* Messages Container */}
          <div 
            ref={messagesContainerRef}
            className="h-[500px] overflow-y-auto p-4 bg-primary-dark/50 scrollbar-blue"
          >
            {messages.length > 0 ? (
              messages.map((msg) => (
                <div
                  key={msg.timestamp || msg.id}
                  className={`flex ${msg.role === "assistant" ? "justify-start" : "justify-end"} mb-6`}
                >
                  {msg.role === "assistant" && (
                    <div className="flex-shrink-0 mr-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-br from-accent-blue to-accent-blue-dark">
                        <span className="text-white text-sm font-medium">Nyx</span>
                      </div>
                    </div>
                  )}
                  
                  <div className={`max-w-[80%] ${msg.role === "assistant" ? "" : "ml-auto"}`}>
                    <div className={`message-bubble ${msg.role === "assistant" ? "ai" : "user"}`}>
                      <div className="whitespace-pre-wrap leading-relaxed text-sm">
                        {msg.content}
                      </div>
                      <div className={`text-xs mt-2 ${msg.role === "assistant" ? "text-body" : "text-white/70"}`}>
                        {msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        }) : 'Just now'}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-gradient-to-br from-accent-blue to-accent-blue-dark rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-white text-2xl font-bold">N</span>
                </div>
                <h3 className="text-xl font-bold text-headline mb-2">How can I help you today?</h3>
                <p className="text-body mb-6">I'm Nyx, your AI assistant powered by NYXD1.</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-lg mx-auto">
                  {[
                    "Explain quantum computing",
                    "Help write a cover letter",
                    "Plan a trip to Paris",
                    "Latest AI research?",
                    "Python script for data",
                    "Easy dinner recipes",
                    "Explain photosynthesis",
                    "Math homework help"
                  ].map((question, index) => (
                    <button
                      key={index}
                      onClick={() => setInput(question)}
                      className="p-3 bg-primary-light/30 border border-primary-light rounded-lg 
                                 hover:bg-primary-light/50 hover:border-accent-blue transition-colors text-left text-sm interactive-glow"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {isLoading && (
              <div className="flex justify-start mb-6">
                <div className="flex-shrink-0 mr-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent-blue to-accent-blue-dark flex items-center justify-center">
                    <span className="text-white text-sm font-medium">N</span>
                  </div>
                </div>
                <div className="bg-primary-light border border-primary-light rounded-2xl rounded-tl-none px-4 py-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-accent-blue rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-accent-blue rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-accent-blue rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-primary-light/30 p-4 bg-primary-medium/50">
            <div className="max-w-3xl mx-auto">
              <form onSubmit={handleSend} className="relative">
                <div className="flex items-end gap-3">
                  <div className="flex-1">
                    <textarea
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={handleKeyPress}
                      placeholder="Message Nyx..."
                      className="input-field min-h-[56px] max-h-[200px]"
                      rows="1"
                      disabled={isLoading}
                      onInput={(e) => {
                        e.target.style.height = 'auto';
                        e.target.style.height = Math.min(e.target.scrollHeight, 200) + 'px';
                      }}
                    />
                  </div>
                  
                  <button
                    type="submit"
                    disabled={isLoading || !input.trim()}
                    className={`px-6 py-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 font-medium interactive-glow
                               ${isLoading || !input.trim()
                                ? "bg-primary-light/50 text-body cursor-not-allowed"
                                : "btn-primary"
                               }`}
                  >
                    {isLoading ? (
                      <>
                        <div className="loading-spinner"></div>
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <span>Send</span>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                      </>
                    )}
                  </button>
                </div>
              </form>
              
              <div className="mt-3 text-xs text-body text-center">
                Nyx can help with anything. Press Enter to send, Shift+Enter for new line.
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Features */}
        <div className="section-container">
          <h2 className="text-2xl font-bold mb-6 text-center text-headline">Why Chat with Nyx?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="feature-card interactive-glow">
              <div className="text-4xl mb-2">🤖</div>
              <h3 className="font-semibold mb-2 text-headline">Real AI Responses</h3>
              <p className="text-body text-sm">
                Powered by Groq API with NYXD1 model - not simulated responses.
              </p>
            </div>
            <div className="feature-card interactive-glow">
              <div className="text-4xl mb-2">🌐</div>
              <h3 className="font-semibold mb-2 text-headline">24/7 Availability</h3>
              <p className="text-body text-sm">
                Get instant help anytime, anywhere with real backend processing.
              </p>
            </div>
            <div className="feature-card interactive-glow">
              <div className="text-4xl mb-2">💡</div>
              <h3 className="font-semibold mb-2 text-headline">Context-Aware</h3>
              <p className="text-body text-sm">
                Remembers conversation history for personalized responses.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-accent-blue/10 to-accent-blue/5 border border-accent-blue/30 
                        text-white mt-12 py-12 text-center rounded-xl interactive-glow">
          <h2 className="text-3xl font-bold mb-4 text-headline">Ready for Real AI Assistance?</h2>
          <p className="mb-6 text-body">Start chatting now with our real backend-powered AI.</p>
          <button
            onClick={() => chatInterfaceRef.current?.scrollIntoView({ behavior: "smooth" })}
            className="btn-primary interactive-glow"
          >
            Start Chatting
          </button>
        </div>
      </section>
    </>
  );
}