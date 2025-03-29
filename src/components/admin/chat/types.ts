
export interface Message {
  id: string;
  text: string;
  time: string;
  sender: 'user' | 'staff';
  status?: 'sent' | 'delivered' | 'read';
}

export interface UserInfo {
  firstName?: string;
  lastName?: string;
  roomNumber?: string;
}

export interface Chat {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  lastActivity: string;
  messages: Message[];
  unread: number;
  roomNumber?: string;
  userInfo?: UserInfo;
}

export interface ChatMessage {
  id: string;
  user_id: string;
  user_name: string;
  room_number?: string;
  recipient_id?: string;
  text: string;
  sender: 'user' | 'staff';
  status?: 'sent' | 'delivered' | 'read';
  created_at: string;
}
