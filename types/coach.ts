export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  created_at: string;
}

export interface CoachSession {
  id: string;
  user_id: string;
  messages: ChatMessage[];
  title: string | null;
  created_at: string;
  updated_at: string;
}
