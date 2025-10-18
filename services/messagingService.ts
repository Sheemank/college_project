import type { Message, Conversation } from '../types';
import { api } from './api';

export interface RealtimeMessagePayload {
  message: Message;
  conversationId: string;
}

type MessageListener = (data: RealtimeMessagePayload) => void;

class MessagingService {
  private listeners: Set<MessageListener> = new Set();
  private connectedUserId: string | null = null;

  connect(userId: string) {
    this.connectedUserId = userId;
    console.debug(`Messaging service connected for user ${userId}`);
  }

  disconnect() {
    console.debug(`Messaging service disconnected for user ${this.connectedUserId}`);
    this.connectedUserId = null;
  }

  subscribe(callback: MessageListener) {
    this.listeners.add(callback);
  }

  unsubscribe(callback: MessageListener) {
    this.listeners.delete(callback);
  }

  private broadcast(data: RealtimeMessagePayload) {
    this.listeners.forEach(listener => listener(data));
  }

  public notifyNewMessage(data: RealtimeMessagePayload) {
    this.broadcast(data);
    this.simulateTutorResponse(data.message);
  }

  private simulateTutorResponse(originalMessage: Message) {
    // Only respond if the student sent the message
    if (originalMessage.senderId.includes('student')) {
      const tutorId = api.getTutorIdFromMessage(originalMessage);
      if (!tutorId) return;

      setTimeout(async () => {
        const responseText = `Thanks for your message! I'll get back to you about "${originalMessage.text.substring(0, 20)}..." shortly.`;
        
        // This internal method adds the message and returns the payload for broadcasting
        const payload = await api.internal_addMessage({
          senderId: tutorId,
          receiverId: originalMessage.senderId,
          text: responseText,
        });
        
        this.broadcast(payload);

      }, 2000); // 2 second delay for realism
    }
  }
}

// Export a singleton instance
export const messagingService = new MessagingService();