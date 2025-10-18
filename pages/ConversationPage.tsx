import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { messagingService, RealtimeMessagePayload } from '../services/messagingService';
import type { Conversation, Message, User } from '../types';
import PaperAirplaneIcon from '../components/icons/PaperAirplaneIcon';
import ReadReceiptIcon from '../components/icons/ReadReceiptIcon';

const ConversationPage = () => {
  const { id } = useParams<{ id: string }>();
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [readMessageIds, setReadMessageIds] = useState(new Set<string>());
  const navigate = useNavigate();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const [currentUser] = useState<User | null>(() => {
    const userJson = localStorage.getItem('currentUser');
    return userJson ? JSON.parse(userJson) : null;
  });

  const visibilityTimers = useRef<Map<string, number>>(new Map());
  const observer = useRef<IntersectionObserver | null>(null);
  const messageNodeRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  // Ref to hold the latest conversation state for use in stable callbacks
  const conversationRef = useRef(conversation);
  useEffect(() => {
    conversationRef.current = conversation;
  }, [conversation]);


  // Cleanup timers on component unmount
  useEffect(() => {
    return () => {
        visibilityTimers.current.forEach(timerId => clearTimeout(timerId));
    };
  }, []);

  const markMessageAsRead = useCallback((messageId: string) => {
    setReadMessageIds(prevReadIds => {
      if (prevReadIds.has(messageId)) {
        return prevReadIds;
      }
      const newSet = new Set(prevReadIds);
      newSet.add(messageId);
      return newSet;
    });
  }, []);

  // Setup and teardown the observer.
  useEffect(() => {
    observer.current = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                const messageId = entry.target.getAttribute('data-message-id');
                if (!messageId) return;

                const timerId = visibilityTimers.current.get(messageId);

                if (entry.isIntersecting) {
                    if (!timerId) {
                        const newTimerId = window.setTimeout(() => {
                            markMessageAsRead(messageId);
                            visibilityTimers.current.delete(messageId);
                        }, 2000);
                        visibilityTimers.current.set(messageId, newTimerId);
                    }
                } else {
                    if (timerId) {
                        clearTimeout(timerId);
                        visibilityTimers.current.delete(messageId);
                    }
                }
            });
        },
        { threshold: 0.8 } // Message is considered "seen" if 80% is visible
    );

    const currentObserver = observer.current;

    return () => {
        currentObserver?.disconnect();
    };
  }, [markMessageAsRead]);
  
  const messageRefCallback = useCallback((messageId: string) => (node: HTMLDivElement | null) => {
    const map = messageNodeRefs.current;
    const currentObserver = observer.current;
    if (!currentObserver) return;

    const oldNode = map.get(messageId);
    if (oldNode) {
        currentObserver.unobserve(oldNode);
        map.delete(messageId);
    }

    if (node) {
        map.set(messageId, node);
        currentObserver.observe(node);
    }
  }, []);

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    if (!id) {
        navigate('/inbox');
        return;
    }
    
    messagingService.connect(currentUser.id);

    const fetchConversation = async () => {
      setIsLoading(true);
      try {
        const convo = await api.getConversationById(id);
        setConversation(convo || null);
      } catch (error) {
        console.error("Failed to fetch conversation", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchConversation();

    const handleNewMessage = (data: RealtimeMessagePayload) => {
        if (data.conversationId === id) {
            setConversation(prev => {
                if (!prev || prev.messages.some(m => m.id === data.message.id)) {
                    return prev;
                }
                return { ...prev, messages: [...prev.messages, data.message] };
            });
        }
    };

    messagingService.subscribe(handleNewMessage);

    return () => {
        messagingService.unsubscribe(handleNewMessage);
        messagingService.disconnect();
    };
  }, [id, currentUser, navigate]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation?.messages]);

  const otherParticipant = conversation?.participants.find(p => p.id !== currentUser?.id);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentUser || !otherParticipant) return;
    
    setIsSending(true);
    const textToSend = newMessage;
    setNewMessage(''); // Clear input immediately

    try {
        await api.sendMessage({
            senderId: currentUser.id,
            receiverId: otherParticipant.id,
            text: textToSend,
        });
    } catch (error) {
        console.error("Failed to send message", error);
        setNewMessage(textToSend); // Restore message on error
    } finally {
        setIsSending(false);
    }
  }

  if (isLoading) {
    return <div className="text-center py-20">Loading conversation...</div>;
  }

  if (!conversation || !otherParticipant) {
    return <div className="text-center py-20">Conversation not found.</div>;
  }

  return (
    <div className="container mx-auto h-[calc(100vh-150px)] flex flex-col bg-white shadow-lg rounded-lg my-4">
       <div className="p-4 border-b flex items-center space-x-4 sticky top-0 bg-white z-10">
            <Link to="/inbox" className="text-indigo-600 hover:text-indigo-800 p-2 rounded-full hover:bg-slate-100" aria-label="Back to Inbox">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            </Link>
            <img src={otherParticipant.imageUrl} alt={otherParticipant.name} className="w-10 h-10 rounded-full object-cover" />
            <h1 className="text-xl font-bold text-slate-800">{otherParticipant.name}</h1>
       </div>
      <div className="flex-1 overflow-y-auto p-4 bg-slate-50">
        {conversation.messages.map((message) => {
          const isMyMessage = message.senderId === currentUser?.id;
          return (
          <div 
            key={message.id}
            ref={isMyMessage ? messageRefCallback(message.id) : null}
            data-message-id={message.id}
            className={`flex items-end ${isMyMessage ? 'justify-end' : 'justify-start'} mb-4`}
          >
            { !isMyMessage && <img src={otherParticipant.imageUrl} alt={otherParticipant.name} className="w-8 h-8 rounded-full object-cover mr-3" />}
            <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${isMyMessage ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-slate-200 text-slate-800 rounded-bl-none'}`}>
              <p className="text-sm">{message.text}</p>
              <div className={`text-xs mt-1 flex items-center ${isMyMessage ? 'justify-end text-indigo-200' : 'justify-end text-slate-500'}`}>
                <span>{new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                {isMyMessage && readMessageIds.has(message.id) && (
                    <ReadReceiptIcon className="w-5 h-5 ml-1" />
                )}
            </div>
            </div>
             { isMyMessage && <img src={currentUser?.imageUrl} alt={currentUser?.name} className="w-8 h-8 rounded-full object-cover ml-3" />}
          </div>
        )})}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 bg-white border-t sticky bottom-0">
        <form onSubmit={handleSendMessage} className="flex items-center space-x-2 sm:space-x-4">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 p-3 border border-slate-300 rounded-full focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            disabled={isSending}
            aria-label="Message input"
          />
          <button
            type="submit"
            className="bg-indigo-600 text-white p-3 rounded-full hover:bg-indigo-700 disabled:bg-indigo-300 flex-shrink-0 transition-colors"
            disabled={isSending || !newMessage.trim()}
            aria-label="Send message"
          >
            <PaperAirplaneIcon className="w-6 h-6" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ConversationPage;