'use client'

import React, { useState, useEffect } from 'react'
import { 
  PaperAirplaneIcon, 
  ArrowPathIcon, 
  UserCircleIcon,
  HeartIcon,
  BookOpenIcon,
  SparklesIcon
} from '@heroicons/react/24/outline'
import { motion, AnimatePresence } from 'framer-motion'

interface Message {
  content: string
  isUser: boolean
  id: string
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([
    { 
      content: "Welcome. I'm here to help guide you on your journey of self-discovery and healing through psychological principles.", 
      isUser: false,
      id: 'initial'
    }
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [showPersonalityMenu, setShowPersonalityMenu] = useState(false)
  const [currentPersonality, setCurrentPersonality] = useState<'psychologist' | 'religious' | 'friend'>('psychologist')

  const getAIAvatarColors = () => {
    switch (currentPersonality) {
      case 'psychologist':
        return 'from-emerald-400 to-primary';
      case 'religious':
        return 'from-amber-400 to-amber-600';
      case 'friend':
        return 'from-indigo-400 to-indigo-600';
      default:
        return 'from-emerald-400 to-primary';
    }
  };

  const getAIAvatarIcon = () => {
    switch (currentPersonality) {
      case 'psychologist':
        return BookOpenIcon;
      case 'religious':
        return SparklesIcon;
      case 'friend':
        return HeartIcon;
      default:
        return UserCircleIcon;
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const newMessage = { content: input, isUser: true, id: Date.now().toString() }
    setMessages(prev => [...prev, newMessage])
    setInput('')
    setIsTyping(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, newMessage],
          personality: currentPersonality,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const aiResponse = await response.json();
      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, {
        content: "I apologize, but I encountered an error. Please try again.",
        isUser: false,
        id: Date.now().toString()
      }]);
    } finally {
      setIsTyping(false);
    }
  }

  const handleRefresh = () => {
    setIsRefreshing(true)
    // Reset the chat to initial state
    setMessages([{ 
      content: "Welcome. I'm here to help guide you on your journey of self-discovery and healing through psychological principles.", 
      isUser: false,
      id: 'initial'
    }])
    
    setTimeout(() => {
      setIsRefreshing(false)
    }, 500)
  }

  useEffect(() => {
    const messagesContainer = document.getElementById('messages-container')
    if (messagesContainer) {
      messagesContainer.scrollTop = messagesContainer.scrollHeight
    }
  }, [messages])

  return (
    <div className="h-[100dvh] flex flex-col bg-gradient-to-b from-neutral-50 to-white dark:from-neutral-900 dark:to-neutral-950">
      <div 
        id="messages-container"
        className="flex-1 overflow-y-auto space-y-6 px-3 pt-6 pb-20"
      >
        <AnimatePresence initial={false}>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex ${message.isUser ? 'justify-end' : 'justify-start'} items-end space-x-3`}
            >
              {!message.isUser && (
                <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${getAIAvatarColors()} flex items-center justify-center text-white text-sm font-medium shadow-lg`}>
                  {React.createElement(getAIAvatarIcon(), { className: "w-5 h-5" })}
                </div>
              )}
              <div
                className={`group max-w-[80%] ${
                  message.isUser
                    ? 'bg-gradient-to-br from-primary to-primary/90 text-white rounded-[1.5rem] rounded-br-sm'
                    : 'peaceful-card rounded-[1.5rem] rounded-bl-sm'
                } px-6 py-3.5 shadow-sm transition-all duration-300 hover:shadow-md`}
              >
                <p className="text-[15px] leading-relaxed tracking-wide whitespace-pre-line break-words">
                  {message.content.split('\n').map((text, i) => (
                    <span key={i}>
                      {text}
                      {i < message.content.split('\n').length - 1 && <br />}
                    </span>
                  ))}
                </p>
              </div>
              {message.isUser && (
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-neutral-100 to-neutral-200 dark:from-neutral-800 dark:to-neutral-700 flex items-center justify-center text-neutral-600 dark:text-neutral-300 text-sm font-medium shadow-lg">
                  You
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
        
        {isTyping && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-end space-x-3"
          >
            <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${getAIAvatarColors()} flex items-center justify-center text-white text-sm font-medium shadow-lg`}>
              {React.createElement(getAIAvatarIcon(), { className: "w-5 h-5" })}
            </div>
            <div className="peaceful-card rounded-[1.5rem] rounded-bl-sm px-6 py-4 shadow-sm">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </motion.div>
        )}
      </div>

      <form onSubmit={sendMessage} className="sticky bottom-16 bg-transparent px-3 py-4">
        <div className="max-w-4xl mx-auto relative">
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10">
              <button
                type="button"
                onClick={handleRefresh}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-neutral-100/80 dark:bg-neutral-800/80 backdrop-blur-sm hover:bg-neutral-200/80 dark:hover:bg-neutral-700/80 transition-all duration-200"
              >
                <ArrowPathIcon 
                  className={`w-4 h-4 text-neutral-500 dark:text-neutral-400 ${isRefreshing ? 'animate-spin' : ''}`}
                />
              </button>
            </div>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="w-full bg-white/80 dark:bg-neutral-800/80 backdrop-blur-md text-neutral-900 dark:text-white placeholder-neutral-500 rounded-2xl py-4 px-14 pr-28 outline-none transition-all duration-200 shadow-sm hover:shadow-md focus:shadow-lg"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center space-x-2">
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowPersonalityMenu(!showPersonalityMenu)}
                  className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center transition-all duration-200 hover:bg-primary/90 hover:scale-105 active:scale-95 shadow-lg shadow-primary/25"
                >
                  <UserCircleIcon className="w-5 h-5" />
                </button>
                <AnimatePresence>
                  {showPersonalityMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 bottom-14 bg-white dark:bg-neutral-800 rounded-xl shadow-xl p-1.5 min-w-[200px] z-50 border border-neutral-200 dark:border-neutral-700"
                    >
                      <div className="space-y-1.5">
                        <button
                          onClick={() => {
                            setCurrentPersonality('psychologist')
                            setShowPersonalityMenu(false)
                          }}
                          className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-xl transition-all duration-200 group ${
                            currentPersonality === 'psychologist' 
                              ? 'bg-primary text-white' 
                              : 'hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300'
                          }`}
                        >
                          <BookOpenIcon className={`w-5 h-5 ${
                            currentPersonality === 'psychologist' 
                              ? 'text-white' 
                              : 'text-neutral-500 group-hover:text-neutral-700 dark:text-neutral-400 dark:group-hover:text-neutral-200'
                          }`} />
                          <span>Psychologist</span>
                        </button>
                        <button
                          onClick={() => {
                            setCurrentPersonality('religious')
                            setShowPersonalityMenu(false)
                          }}
                          className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-xl transition-all duration-200 group ${
                            currentPersonality === 'religious' 
                              ? 'bg-primary text-white' 
                              : 'hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300'
                          }`}
                        >
                          <SparklesIcon className={`w-5 h-5 ${
                            currentPersonality === 'religious' 
                              ? 'text-white' 
                              : 'text-neutral-500 group-hover:text-neutral-700 dark:text-neutral-400 dark:group-hover:text-neutral-200'
                          }`} />
                          <span>Religious</span>
                        </button>
                        <button
                          onClick={() => {
                            setCurrentPersonality('friend')
                            setShowPersonalityMenu(false)
                          }}
                          className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-xl transition-all duration-200 group ${
                            currentPersonality === 'friend' 
                              ? 'bg-primary text-white' 
                              : 'hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300'
                          }`}
                        >
                          <HeartIcon className={`w-5 h-5 ${
                            currentPersonality === 'friend' 
                              ? 'text-white' 
                              : 'text-neutral-500 group-hover:text-neutral-700 dark:text-neutral-400 dark:group-hover:text-neutral-200'
                          }`} />
                          <span>Friend</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <button
                type="submit"
                className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center transition-all duration-200 hover:bg-primary/90 hover:scale-105 active:scale-95 shadow-lg shadow-primary/25"
              >
                <PaperAirplaneIcon className="w-5 h-5 -rotate-45" />
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
