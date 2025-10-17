
export type DayOfWeek = 'Sunday' | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
export type TimeSlot = string; // e.g., "9:00 AM - 11:00 AM"

export interface Tutor {
  id: string;
  name: string;
  rating: number;
  reviewCount: number;
  location: string;
  subjects: string[];
  description: string;
  imageUrl: string;
  experience: number; // in years
  qualifications: string[];
  hourlyRate: number;
  availability: Partial<Record<DayOfWeek, TimeSlot[]>>;
  isVerified: boolean;
}

export interface Review {
  id: string;
  studentName: string;
  studentImageUrl: string;
  text: string;
}

export interface User {
  id: string;
  name: string;
  imageUrl: string;
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
}

export interface Conversation {
  id: string;
  participants: User[];
  messages: Message[];
}
