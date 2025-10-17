
import React, { useState } from 'react';
import { api } from '../services/api';
import type { Tutor } from '../types';

interface MessageModalProps {
  tutor: Tutor;
  onClose: () => void;
}

const MessageModal: React.FC<MessageModalProps> = ({ tutor, onClose }) => {
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !currentUser) return;
    
    setIsSending(true);
    setError('');
    setSuccess('');

    try {
      await api.sendMessage({
        senderId: currentUser.id,
        receiverId: tutor.id,
        text: message
      });
      setSuccess('Message sent successfully!');
      setMessage('');
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      setError('Failed to send message. Please try again.');
      console.error(err);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center border-b pb-3 mb-4">
          <h2 className="text-xl font-bold text-gray-800">Message {tutor.name}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-800 text-3xl leading-none">&times;</button>
        </div>
        <form onSubmit={handleSubmit}>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Write your message here..."
            className="w-full h-32 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            required
            disabled={isSending}
            aria-label={`Message to ${tutor.name}`}
          ></textarea>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          {success && <p className="text-green-500 text-sm mt-2">{success}</p>}
          <div className="flex justify-end mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 mr-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 disabled:opacity-50"
              disabled={isSending}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300"
              disabled={isSending || !message.trim()}
            >
              {isSending ? 'Sending...' : 'Send'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MessageModal;
