import React, { useState, useEffect, useRef } from 'react'
import { MessageCircle, X, Minimize2, Maximize2, Bot, Sparkles, Send, User } from 'lucide-react'
import { WALLETX_SYSTEM_PROMPT, getFallbackResponse } from '../lib/walletxSystemPrompt'

const AIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! 👋 I'm WalletX's Smart Assistant. How can I help you today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [conversationId, setConversationId] = useState(null)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640)
  const messagesEndRef = useRef(null)
  const chatContainerRef = useRef(null)

  // WalletX AI API configuration 
  const WALLETX_API_KEY = import.meta.env.VITE_WALLETX_API_KEY
  const WALLETX_API_URL = import.meta.env.VITE_WALLETX_URL

  // Handle window resize for responsiveness
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640)
    }
    
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Prevent background scroll when AI assistant is open in mobile
  useEffect(() => {
    if (isMobile && isOpen && !isMinimized) {
      // Prevent background scroll
      document.body.style.overflow = 'hidden'
      document.body.style.position = 'fixed'
      document.body.style.top = '0'
      document.body.style.left = '0'
      document.body.style.right = '0'
      document.body.style.bottom = '0'
    } else {
      // Restore background scroll
      document.body.style.overflow = ''
      document.body.style.position = ''
      document.body.style.top = ''
      document.body.style.left = ''
      document.body.style.right = ''
      document.body.style.bottom = ''
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = ''
      document.body.style.position = ''
      document.body.style.top = ''
      document.body.style.left = ''
      document.body.style.right = ''
      document.body.style.bottom = ''
    }
  }, [isMobile, isOpen, isMinimized])

  // Initialize WalletX AI
  useEffect(() => {
    console.log('WalletX AI Assistant initialized successfully')
    setIsLoaded(true)
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Auto scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  // Initialize conversation
  useEffect(() => {
    if (isOpen && !conversationId) {
      const newConversationId = `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      setConversationId(newConversationId)
      setIsLoaded(true)
    }
  }, [isOpen])

  // Send message to WalletX AI backend
  const sendToWalletXAI = async (message) => {
    try {
      console.log('Sending message to WalletX AI:', message)
      
      if (!WALLETX_API_KEY || WALLETX_API_KEY === 'undefined') {
        throw new Error('WalletX AI service not configured')
      }

      // Use the comprehensive WalletX system prompt
      const response = await fetch(`${WALLETX_API_URL}?key=${WALLETX_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `${WALLETX_SYSTEM_PROMPT}\n\nUser: ${message}\n\nWalletX AI:`
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          },
          safetySettings: [
            {
              category: "HARM_CATEGORY_HARASSMENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_HATE_SPEECH",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_DANGEROUS_CONTENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            }
          ]
        })
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(`WalletX AI error: ${errorData.error?.message || response.statusText}`)
      }
      
      const data = await response.json()
      console.log('WalletX AI response:', data)
      
      if (data.candidates && data.candidates.length > 0) {
        const responseText = data.candidates[0].content.parts[0].text
        return [{ text: responseText }]
      }
      
      throw new Error('No response from WalletX AI')
      
    } catch (error) {
      console.log('Using WalletX AI fallback responses:', error.message)
      
      // Use intelligent fallback responses from system prompt
      const fallbackResponse = getFallbackResponse(message)
      return [{ text: fallbackResponse }]
    }
  }

  // Handle sending messages
  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    const userMessage = {
      id: Date.now(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsTyping(true)

    // Send to WalletX AI and get response
    const botResponses = await sendToWalletXAI(inputValue)
    
    setIsTyping(false)

    // Add bot responses
    botResponses.forEach((response, index) => {
      setTimeout(() => {
        const botMessage = {
          id: Date.now() + index,
          text: response.text || response.message || 'I received your message!',
          sender: 'bot',
          timestamp: new Date()
        }
        setMessages(prev => [...prev, botMessage])
      }, index * 500)
    })
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const toggleChat = () => {
    if (isOpen) {
      setIsOpen(false)
      setIsMinimized(false)
    } else {
      setIsOpen(true)
      setUnreadCount(0)
    }
  }

  const minimizeChat = () => {
    setIsMinimized(true)
  }

  const maximizeChat = () => {
    setIsMinimized(false)
    setUnreadCount(0)
  }

  const closeChat = () => {
    setIsOpen(false)
    setIsMinimized(false)
  }

  // Helper function to parse and render markdown text
  const parseMarkdown = (text) => {
    if (!text) return text
    
    // Split text by markdown patterns and render them
    const parts = []
    
    // Regular expressions for markdown patterns
    const patterns = [
      { regex: /\*\*(.*?)\*\*/g, tag: 'strong' }, // Bold **text**
      { regex: /\*(.*?)\*/g, tag: 'em' },        // Italic *text*
      { regex: /`(.*?)`/g, tag: 'code' },       // Code `text`
      { regex: /__(.*?)__/g, tag: 'strong' },   // Bold __text__
      { regex: /_(.*?)_/g, tag: 'em' }          // Italic _text_
    ]
    
    const matches = []
    
    // Find all matches
    patterns.forEach(pattern => {
      let match
      pattern.regex.lastIndex = 0 // Reset regex state
      while ((match = pattern.regex.exec(text)) !== null) {
        matches.push({
          start: match.index,
          end: match.index + match[0].length,
          content: match[1],
          tag: pattern.tag,
          fullMatch: match[0]
        })
      }
    })
    
    // Sort matches by position and remove overlaps
    matches.sort((a, b) => a.start - b.start)
    
    // Remove overlapping matches
    const filteredMatches = []
    matches.forEach(match => {
      if (!filteredMatches.some(existing => 
        match.start < existing.end && match.end > existing.start
      )) {
        filteredMatches.push(match)
      }
    })
    
    // Build the result
    let lastIndex = 0
    
    filteredMatches.forEach((match, index) => {
      // Add text before match
      if (match.start > lastIndex) {
        const beforeText = text.slice(lastIndex, match.start)
        if (beforeText) {
          parts.push(beforeText)
        }
      }
      
      // Add the formatted text
      const key = `markdown-${index}-${match.start}`
      if (match.tag === 'strong') {
        parts.push(<strong key={key} className="font-bold text-white">{match.content}</strong>)
      } else if (match.tag === 'em') {
        parts.push(<em key={key} className="italic text-yellow-200">{match.content}</em>)
      } else if (match.tag === 'code') {
        parts.push(<code key={key} className="bg-gray-700 px-1.5 py-0.5 rounded text-sm font-mono text-green-300">{match.content}</code>)
      }
      
      lastIndex = match.end
    })
    
    // Add remaining text
    if (lastIndex < text.length) {
      const remainingText = text.slice(lastIndex)
      if (remainingText) {
        parts.push(remainingText)
      }
    }
    
    return parts.length > 0 ? parts : text
  }

  return (
    <>
      {/* AI Assistant Button */}
      <div className="fixed bottom-6 right-6 z-[9999]">
        {!isOpen && (
          <button
            onClick={toggleChat}
            className="
              ai-assistant-button
              relative
              bg-purple-600
              text-white
              border-none
              rounded-full
              w-16 h-16
              flex items-center justify-center
              cursor-pointer
              shadow-[0_10px_25px_rgba(124,58,237,0.4),0_0_40px_rgba(124,58,237,0.2)]
              transition-all duration-300
              z-[9999]
              animate-[float_3s_ease-in-out_infinite,gradientShift_4s_ease_infinite,pulse_2s_infinite]
              overflow-visible
            "
            style={{
              background: 'linear-gradient(45deg, #7c3aed, #3b82f6, #8b5cf6, #06b6d4)',
              backgroundSize: '400% 400%'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'scale(1.15) translateY(-2px)'
              e.target.style.boxShadow = '0 15px 35px rgba(124, 58, 237, 0.6), 0 0 50px rgba(124, 58, 237, 0.3)'
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'scale(1)'
              e.target.style.boxShadow = '0 10px 25px rgba(124, 58, 237, 0.4), 0 0 40px rgba(124, 58, 237, 0.2)'
            }}
            aria-label="Open AI Assistant"
          >
            <MessageCircle size={24} className="animate-[iconBounce_2s_ease-in-out_infinite_alternate]" />
            
            {/* Unread Indicator */}
            {unreadCount > 0 && (
              <span className="
                absolute -top-2 -right-2
                bg-red-500
                text-white
                rounded-full
                w-5 h-5
                flex items-center justify-center
                text-xs
                font-bold
              ">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
            
            {/* Animated Sparkle Effects */}
            <Sparkles 
              size={16} 
              className="
                absolute -top-1 -right-1
                text-yellow-400
                animate-[smoothSparkle_3s_ease-in-out_infinite]
              " 
            />
            <Sparkles 
              size={12} 
              className="
                absolute top-2 -left-1.5
                text-yellow-500
                animate-[smoothSparkle_3.5s_ease-in-out_infinite_0.8s]
              " 
            />
            <Sparkles 
              size={10} 
              className="
                absolute -bottom-0.5 right-2
                text-yellow-400
                animate-[smoothSparkle_4s_ease-in-out_infinite_1.6s]
              " 
            />
            
            {/* Rotating Ring Effect */}
            <div className="
              absolute -inset-2
              border-2 border-transparent
              border-t-purple-500/50
              border-r-blue-500/50
              rounded-full
              animate-[rotate_3s_linear_infinite]
            " />
          </button>
        )}

        {/* Chat Window */}
        {isOpen && (
          <div className={`
            fixed 
            ${isMobile ? 'inset-0' : 'bottom-6 right-6'}
            ${isMobile ? 'w-full h-full' : (isMinimized ? 'w-80 h-16' : 'w-96 h-[600px]')}
            ${isMobile ? '' : 'max-h-[90vh]'}
            z-[10000]
            bg-gray-900
            ${isMobile ? 'border-none rounded-none' : 'border border-gray-600 rounded-2xl'}
            shadow-2xl
            overflow-hidden
            flex flex-col
          `}>
            {/* Fixed Header */}
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-4 flex items-center justify-between text-white flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center relative">
                  <Bot size={20} className="text-purple-600" />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white animate-pulse" />
                </div>
                <div>
                  <h3 className="text-base font-semibold m-0">
                    WalletX Assistant
                  </h3>
                  <p className="text-xs opacity-80 m-0">
                    {isLoaded ? 'Advanced AI • Online' : 'Connecting...'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
               
                
                <button
                  onClick={closeChat}
                  className="bg-white/20 hover:bg-white/30 border-none rounded p-1.5 text-white cursor-pointer transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Chat Content */}
            {!isMinimized && (
              <div className="flex-1 bg-black flex flex-col min-h-0">
                {/* Scrollable Messages Container */}
                <div 
                  ref={chatContainerRef}
                  className={`flex-1 overflow-y-auto overflow-x-hidden ${isMobile ? 'p-3' : 'p-4'} flex flex-col gap-3 min-h-0 scroll-smooth`}
                  style={{
                    ...(isMobile && {
                      WebkitOverflowScrolling: 'touch',
                      overscrollBehavior: 'contain'
                    })
                  }}
                  onScroll={(e) => {
                    if (isMobile) {
                      e.stopPropagation()
                    }
                  }}
                >
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} items-start gap-2`}
                    >
                      {message.sender === 'bot' && (
                        <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                          <Bot size={16} className="text-white" />
                        </div>
                      )}
                      
                      <div className={`
                        ${isMobile ? 'max-w-[85%]' : 'max-w-[70%]'}
                        ${isMobile ? 'px-3 py-2' : 'px-4 py-3'}
                        rounded-2xl
                        ${message.sender === 'user' 
                          ? 'bg-purple-600 rounded-br-sm' 
                          : 'bg-gray-800 rounded-bl-sm'
                        }
                        text-white text-sm leading-relaxed break-words whitespace-pre-wrap
                      `}>
                        {parseMarkdown(message.text)}
                      </div>
                      
                      {message.sender === 'user' && (
                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                          <User size={16} className="text-white" />
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {/* Typing Indicator */}
                  {isTyping && (
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                        <Bot size={16} className="text-white" />
                      </div>
                      <div className="px-4 py-3 rounded-2xl rounded-bl-sm bg-gray-800 text-gray-400 text-sm">
                        <div className="flex gap-1 items-center">
                          <span>WalletX Assistant is thinking</span>
                          <div className="flex gap-0.5">
                            <div className="w-1 h-1 bg-purple-600 rounded-full animate-bounce [animation-delay:0s]" />
                            <div className="w-1 h-1 bg-purple-600 rounded-full animate-bounce [animation-delay:0.2s]" />
                            <div className="w-1 h-1 bg-purple-600 rounded-full animate-bounce [animation-delay:0.4s]" />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>
                
                {/* Fixed Input Area */}
                <div className={`flex-shrink-0 ${isMobile ? 'p-3' : 'p-4'} border-t border-gray-600 bg-gray-900`}>
                  <div className="flex gap-2 items-end">
                    <textarea
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Ask me anything about WalletX..."
                      className={`
                        flex-1 resize-none border border-gray-600 rounded-xl
                        ${isMobile ? 'p-2.5 min-h-[36px]' : 'p-3 min-h-[40px]'}
                        bg-gray-800 text-white text-sm outline-none max-h-[120px]
                        placeholder-gray-400 focus:border-purple-500 transition-colors
                      `}
                      rows={1}
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={!inputValue.trim() || isTyping}
                      className={`
                        ${isMobile ? 'p-2.5' : 'p-3'}
                        ${inputValue.trim() && !isTyping 
                          ? 'bg-purple-600 hover:bg-purple-700' 
                          : 'bg-gray-600 cursor-not-allowed'
                        }
                        border-none rounded-xl text-white flex items-center justify-center
                        transition-all duration-200 disabled:opacity-50
                      `}
                    >
                      <Send size={isMobile ? 14 : 16} />
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            {/* Minimized State */}
            {isMinimized && (
              <div className="flex-1 bg-black flex items-center px-4 text-gray-400 text-sm">
                {unreadCount > 0 
                  ? `${unreadCount} new message${unreadCount > 1 ? 's' : ''}` 
                  : 'Chat minimized'}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Mobile Backdrop - Only show for non-mobile or when needed */}
      {isOpen && !isMinimized && !isMobile && (
        <div 
          className="fixed inset-0 bg-black/20 z-[9998]"
          onClick={closeChat}
        />
      )}

      {/* CSS Keyframes for animations */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }
        
        @keyframes iconBounce {
          0% { transform: scale(1) rotate(0deg); }
          25% { transform: scale(1.05) rotate(2deg); }
          50% { transform: scale(1.1) rotate(5deg); }
          75% { transform: scale(1.05) rotate(2deg); }
          100% { transform: scale(1) rotate(0deg); }
        }
        
        @keyframes smoothSparkle {
          0% { 
            opacity: 0.2; 
            transform: scale(0.6) rotate(0deg) translateY(0px);
            filter: brightness(0.8);
          }
          25% {
            opacity: 0.6;
            transform: scale(0.9) rotate(90deg) translateY(-2px);
            filter: brightness(1.1);
          }
          50% { 
            opacity: 1; 
            transform: scale(1.3) rotate(180deg) translateY(-4px);
            filter: brightness(1.4) drop-shadow(0 0 8px currentColor);
          }
          75% {
            opacity: 0.8;
            transform: scale(1.1) rotate(270deg) translateY(-2px);
            filter: brightness(1.2);
          }
          100% {
            opacity: 0.2;
            transform: scale(0.6) rotate(360deg) translateY(0px);
            filter: brightness(0.8);
          }
        }
        
        @keyframes rotate {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes typing {
          0%, 60%, 100% {
            transform: translateY(0);
            opacity: 0.4;
          }
          30% {
            transform: translateY(-10px);
            opacity: 1;
          }
        }
        
        .ai-assistant-button {
          position: relative;
          overflow: visible;
        }
        
        .ai-assistant-button::before {
          content: '';
          position: absolute;
          top: -4px;
          left: -4px;
          right: -4px;
          bottom: -4px;
          background: linear-gradient(45deg, #7c3aed, #3b82f6, #8b5cf6, #06b6d4);
          background-size: 400% 400%;
          border-radius: 50%;
          z-index: -1;
          animation: gradientShift 3s ease infinite;
          opacity: 0.3;
          filter: blur(8px);
        }
        
        .ai-assistant-button:hover::before {
          opacity: 0.6;
          filter: blur(12px);
        }
      `}</style>


    </>
  )
}

export default AIAssistant