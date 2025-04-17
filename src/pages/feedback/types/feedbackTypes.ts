
export interface FeedbackType {
  id: string;
  guest_name: string;
  guest_email: string;
  rating: number;
  comment?: string;
  created_at: string;
  updated_at?: string;
}
