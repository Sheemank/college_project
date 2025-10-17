import type { Tutor, Review, User, Conversation, Message } from '../types';
import { messagingService, RealtimeMessagePayload } from './messagingService';

const allTutorsData: Tutor[] = [
  {
    id: '1',
    name: 'Dr. Eleanor Vance',
    rating: 4.9,
    reviewCount: 120,
    location: 'New York, NY',
    subjects: ['Physics', 'Calculus', 'Astrophysics'],
    description: 'PhD in Physics with 10+ years of tutoring experience. I make complex topics easy to understand.',
    imageUrl: 'https://picsum.photos/seed/eleanor/200/200',
    experience: 12,
    qualifications: ['PhD in Physics, MIT', 'M.S. in Applied Mathematics'],
    hourlyRate: 75,
    isVerified: true,
  },
  {
    id: '2',
    name: 'Samuel Jones',
    rating: 4.8,
    reviewCount: 85,
    location: 'San Francisco, CA',
    subjects: ['Computer Science', 'Python', 'Java'],
    description: 'Software Engineer at a top tech company. Passionate about teaching coding to beginners.',
    imageUrl: 'https://picsum.photos/seed/samuel/200/200',
    experience: 7,
    qualifications: ['B.S. in Computer Science, Stanford', 'Google Certified Developer'],
    hourlyRate: 60,
    isVerified: true,
  },
  {
    id: '3',
    name: 'Maria Garcia',
    rating: 5.0,
    reviewCount: 210,
    location: 'Miami, FL',
    subjects: ['Spanish', 'French', 'ESL'],
    description: 'Native Spanish speaker with a degree in linguistics. Let\'s make learning a new language fun!',
    imageUrl: 'https://picsum.photos/seed/maria/200/200',
    experience: 8,
    qualifications: ['M.A. in Linguistics', 'Certified Language Instructor'],
    hourlyRate: 45,
    isVerified: false,
  },
  {
    id: '4',
    name: 'David Chen',
    rating: 4.7,
    reviewCount: 95,
    location: 'Chicago, IL',
    subjects: ['Biology', 'Chemistry', 'MCAT Prep'],
    description: 'Medical student with a knack for breaking down hard science concepts for high school and college students.',
    imageUrl: 'https://picsum.photos/seed/david/200/200',
    experience: 4,
    qualifications: ['B.S. in Biology, UChicago', '99th Percentile MCAT Score'],
    hourlyRate: 65,
    isVerified: true,
  },
    {
    id: '5',
    name: 'Jessica Miller',
    rating: 4.9,
    reviewCount: 150,
    location: 'New York, NY',
    subjects: ['English', 'SAT Prep', 'Literature'],
    description: 'Published author and experienced SAT tutor. I help students craft compelling essays and ace their exams.',
    imageUrl: 'https://picsum.photos/seed/jessica/200/200',
    experience: 9,
    qualifications: ['M.F.A. in Creative Writing, Columbia', 'Certified SAT Instructor'],
    hourlyRate: 70,
    isVerified: true,
  },
  {
    id: '6',
    name: 'Ben Carter',
    rating: 4.6,
    reviewCount: 70,
    location: 'San Francisco, CA',
    subjects: ['History', 'Government', 'Debate'],
    description: 'History buff and debate coach. I love helping students develop critical thinking and public speaking skills.',
    imageUrl: 'https://picsum.photos/seed/ben/200/200',
    experience: 6,
    qualifications: ['M.A. in History, UC Berkeley'],
    hourlyRate: 50,
    isVerified: false,
  },
  {
    id: '7',
    name: 'Chloe Kim',
    rating: 4.8,
    reviewCount: 110,
    location: 'Los Angeles, CA',
    subjects: ['Art', 'Design', 'Adobe Photoshop'],
    description: 'Professional graphic designer helping aspiring artists build their portfolios and master digital tools.',
    imageUrl: 'https://picsum.photos/seed/chloe/200/200',
    experience: 10,
    qualifications: ['B.F.A. in Graphic Design, RISD', 'Adobe Certified Expert'],
    hourlyRate: 55,
    isVerified: true,
  },
];

const allReviewsData: Review[] = [
    { id: 'r1', studentName: 'Alex Johnson', studentImageUrl: 'https://picsum.photos/seed/alex/100/100', text: 'Dr. Vance made physics so much more approachable. My grades have improved significantly!' },
    { id: 'r2', studentName: 'Brenda Smith', studentImageUrl: 'https://picsum.photos/seed/brenda/100/100', text: 'Samuel is an amazing coding tutor. I went from knowing nothing to building my own web app.' },
    { id: 'r3', studentName: 'Carlos Diaz', studentImageUrl: 'https://picsum.photos/seed/carlos/100/100', text: 'Learning Spanish with Maria was fantastic! Her lessons are engaging and effective.' },
    { id: 'r4', studentName: 'Sophia Lee', studentImageUrl: 'https://picsum.photos/seed/sophia/100/100', text: 'David\'s MCAT prep was a game-changer. His strategies are top-notch and easy to follow.' },
    { id: 'r5', studentName: 'Ethan Williams', studentImageUrl: 'https://picsum.photos/seed/ethan/100/100', text: 'My SAT score went up 200 points thanks to Jessica. Highly recommend!' },
    { id: 'r6', studentName: 'Olivia Brown', studentImageUrl: 'https://picsum.photos/seed/olivia/100/100', text: 'Ben made history my favorite subject. His passion for the material is contagious.' },
];

const mockUsers: User[] = [
    { id: 'student1', name: 'Test Student', imageUrl: 'https://picsum.photos/seed/student/100/100'},
    ...allTutorsData.map(t => ({ id: t.id, name: t.name, imageUrl: t.imageUrl }))
];

let mockConversations: Conversation[] = [
    {
        id: 'c1',
        participants: [mockUsers[0], mockUsers[1]],
        messages: [
            { id: 'm1', senderId: 'student1', text: 'Hi Dr. Vance, I am interested in Physics tutoring.', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString() },
            { id: 'm2', senderId: '1', text: 'Hello! I would be happy to help. When are you available?', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 23).toISOString() },
        ],
    }
];

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const addMessage = (data: { senderId: string; receiverId: string; text: string }): { newMessage: Message, conversation: Conversation } => {
    const { senderId, receiverId, text } = data;
    
    let conversation = mockConversations.find(c => 
        c.participants.length === 2 &&
        c.participants.some(p => p.id === senderId) && 
        c.participants.some(p => p.id === receiverId)
    );

    const newMessage: Message = {
        id: `m${Date.now()}`,
        senderId,
        text,
        timestamp: new Date().toISOString(),
    };

    if (conversation) {
        conversation.messages.push(newMessage);
    } else {
        const sender = mockUsers.find(u => u.id === senderId);
        const receiver = mockUsers.find(u => u.id === receiverId);
        if(!sender || !receiver) throw new Error("User not found");
        const newConversation: Conversation = {
            id: `c${Date.now()}`,
            participants: [sender, receiver],
            messages: [newMessage],
        };
        mockConversations.push(newConversation);
        conversation = newConversation;
    }
    return { newMessage, conversation };
};


export const api = {
  getTopTutors: async (): Promise<Tutor[]> => {
    await delay(500);
    return allTutorsData.slice(0, 4);
  },
  searchTutors: async (query: { location?: string; subject?: string; offset?: number; limit?: number; minRate?: number; maxRate?: number; minExperience?: number; }): Promise<{tutors: Tutor[], hasMore: boolean}> => {
    await delay(800);
    let filteredTutors = allTutorsData;

    if (query.location) {
      filteredTutors = filteredTutors.filter(t => t.location.toLowerCase().includes(query.location!.toLowerCase()));
    }
    if (query.subject) {
      filteredTutors = filteredTutors.filter(t => t.subjects.some(s => s.toLowerCase().includes(query.subject!.toLowerCase())));
    }
    if (query.minRate) {
        filteredTutors = filteredTutors.filter(t => t.hourlyRate >= query.minRate!);
    }
    if (query.maxRate) {
        filteredTutors = filteredTutors.filter(t => t.hourlyRate <= query.maxRate!);
    }
    if (query.minExperience) {
        filteredTutors = filteredTutors.filter(t => t.experience >= query.minExperience!);
    }

    const offset = query.offset || 0;
    const limit = query.limit || 4;
    const paginatedTutors = filteredTutors.slice(offset, offset + limit);
    const hasMore = (offset + limit) < filteredTutors.length;
    
    return { tutors: paginatedTutors, hasMore };
  },
  getTutorById: async (id: string): Promise<Tutor | undefined> => {
    await delay(600);
    return allTutorsData.find(t => t.id === id);
  },
  getReviews: async (): Promise<Review[]> => {
    await delay(300);
    return allReviewsData;
  },
  registerUser: async (userData: any): Promise<{ success: boolean; message: string }> => {
    await delay(1000);
    console.log('Registering user:', userData);
    return { success: true, message: `Registration successful for ${userData.name}!` };
  },
  loginUser: async (credentials: any): Promise<{ success: boolean; message: string; token?: string; user?: User }> => {
    await delay(1000);
    console.log('Logging in with:', credentials);
    if (credentials.email === 'test@example.com' && credentials.password === 'password') {
      return { success: true, message: 'Login successful!', token: 'fake-jwt-token', user: mockUsers[0] };
    }
    return { success: false, message: 'Invalid email or password.' };
  },
  sendMessage: async (data: { senderId: string; receiverId: string; text: string }): Promise<Message> => {
    await delay(200); // Shorter delay for sending
    const { newMessage, conversation } = addMessage(data);
    messagingService.notifyNewMessage({ message: newMessage, conversationId: conversation.id });
    return newMessage;
  },
  getConversations: async(userId: string): Promise<Conversation[]> => {
    await delay(500);
    return mockConversations
        .filter(c => c.participants.some(p => p.id === userId))
        .sort((a,b) => new Date(b.messages[b.messages.length - 1].timestamp).getTime() - new Date(a.messages[a.messages.length - 1].timestamp).getTime());
  },
  getConversationById: async(conversationId: string): Promise<Conversation | undefined> => {
    await delay(400);
    return mockConversations.find(c => c.id === conversationId);
  },
  getTutorIdFromMessage: (message: Message): string | undefined => {
    const conversation = mockConversations.find(c => c.messages.some(m => m.id === message.id));
    const tutorParticipant = conversation?.participants.find(p => !p.id.includes('student'));
    return tutorParticipant?.id;
  },
  internal_addMessage: async (data: { senderId: string; receiverId: string; text: string }): Promise<RealtimeMessagePayload> => {
     await delay(100);
     const { newMessage, conversation } = addMessage(data);
     return { message: newMessage, conversationId: conversation.id };
  },
};