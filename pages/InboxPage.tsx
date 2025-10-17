import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { messagingService, RealtimeMessagePayload } from '../services/messagingService';
import type { Conversation, User } from '../types';

const InboxPage = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null') as User | null;

  const fetchConversations = useCallback(async () => {
    if (!currentUser) {
        return;
    }
    // Set loading to false initially for subsequent fetches to avoid spinner on refresh
    setIsLoading(conversations.length === 0);
    try {
      const convos = await api.getConversations(currentUser.id);
      setConversations(convos);
    } catch (error) {
      console.error("Failed to fetch conversations", error);
    } finally {
      setIsLoading(false);
    }
  }, [currentUser, conversations.length]);

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    messagingService.connect(currentUser.id);
    fetchConversations();

    const handleNewMessage = (data: RealtimeMessagePayload) => {
        // Any new message should trigger a refresh of the inbox to update order and snippets.
        fetchConversations();
    };

    messagingService.subscribe(handleNewMessage);
    
    return () => {
        messagingService.unsubscribe(handleNewMessage);
        messagingService.disconnect();
    };
  }, [currentUser, navigate, fetchConversations]);

  if (isLoading) {
    return (
        <div className="flex justify-center items-center h-64">
          <div className="text-center">Loading conversations...</div>
        </div>
    );
  }
  
  const getOtherParticipant = (convo: Conversation) => {
    return convo.participants.find(p => p.id !== currentUser?.id);
  };
  
  const getLastMessage = (convo: Conversation) => {
    return convo.messages[convo.messages.length - 1];
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Inbox</h1>
      <div className="bg-white rounded-lg shadow-md">
        {conversations.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {conversations.map(convo => {
              const otherParticipant = getOtherParticipant(convo);
              const lastMessage = getLastMessage(convo);
              if (!otherParticipant || !lastMessage) return null;

              return (
                <li key={convo.id}>
                  <Link to={`/conversation/${convo.id}`} className="block hover:bg-gray-50 p-4 sm:p-6">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <img className="h-12 w-12 rounded-full object-cover" src={otherParticipant.imageUrl} alt={otherParticipant.name} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-md font-bold text-blue-600 truncate">{otherParticipant.name}</p>
                        <p className="text-sm text-gray-500 truncate">{lastMessage.senderId === currentUser?.id ? 'You: ' : ''}{lastMessage.text}</p>
                      </div>
                      <div className="text-sm text-gray-400 text-right flex-shrink-0">
                        {new Date(lastMessage.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                        <br/>
                        {new Date(lastMessage.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="text-center py-16">
            <h3 className="text-xl font-semibold text-gray-700">No conversations yet</h3>
            <p className="text-gray-500 mt-2">Start a conversation by contacting a tutor from their profile page.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default InboxPage;