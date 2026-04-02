// Supabase が生成するDB型の仮置き
// 実際の環境: npx supabase gen types typescript --project-id <id> > types/database.ts

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          username: string;
          display_name: string | null;
          bio: string | null;
          avatar_url: string | null;
          skill_level: "beginner" | "intermediate" | "advanced" | "pro" | null;
          play_style: string | null;
          location: string | null;
          referral_code: string | null;
          referred_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          username: string;
          display_name?: string | null;
          bio?: string | null;
          avatar_url?: string | null;
          skill_level?: "beginner" | "intermediate" | "advanced" | "pro" | null;
          play_style?: string | null;
          location?: string | null;
          referral_code?: string | null;
          referred_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          username?: string;
          display_name?: string | null;
          bio?: string | null;
          avatar_url?: string | null;
          skill_level?: "beginner" | "intermediate" | "advanced" | "pro" | null;
          play_style?: string | null;
          location?: string | null;
          referred_by?: string | null;
          updated_at?: string;
        };
      };
      subscriptions: {
        Row: {
          id: string;
          user_id: string;
          status: string;
          plan: "free" | "pro" | "premium";
          stripe_customer_id: string | null;
          stripe_price_id: string | null;
          current_period_start: string | null;
          current_period_end: string | null;
          cancel_at_period_end: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          user_id: string;
          status: string;
          plan: "free" | "pro" | "premium";
          stripe_customer_id?: string | null;
          stripe_price_id?: string | null;
          current_period_start?: string | null;
          current_period_end?: string | null;
          cancel_at_period_end?: boolean;
        };
        Update: {
          status?: string;
          plan?: "free" | "pro" | "premium";
          stripe_customer_id?: string | null;
          stripe_price_id?: string | null;
          current_period_start?: string | null;
          current_period_end?: string | null;
          cancel_at_period_end?: boolean;
          updated_at?: string;
        };
      };
      referrals: {
        Row: {
          id: string;
          referrer_id: string;
          referred_id: string;
          referral_code: string;
          discount_pct: number;
          redeemed_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          referrer_id: string;
          referred_id: string;
          referral_code: string;
          discount_pct?: number;
          redeemed_at?: string | null;
        };
        Update: {
          redeemed_at?: string | null;
        };
      };
      coach_sessions: {
        Row: {
          id: string;
          user_id: string;
          messages: Json;
          title: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          messages?: Json;
          title?: string | null;
        };
        Update: {
          messages?: Json;
          title?: string | null;
          updated_at?: string;
        };
      };
      posts: {
        Row: {
          id: string;
          user_id: string;
          content: string;
          image_url: string | null;
          likes_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          content: string;
          image_url?: string | null;
          likes_count?: number;
        };
        Update: {
          content?: string;
          image_url?: string | null;
          likes_count?: number;
          updated_at?: string;
        };
      };
      post_likes: {
        Row: {
          post_id: string;
          user_id: string;
          created_at: string;
        };
        Insert: {
          post_id: string;
          user_id: string;
        };
        Update: Record<string, never>;
      };
      conversations: {
        Row: {
          id: string;
          participant1: string;
          participant2: string;
          last_message_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          participant1: string;
          participant2: string;
          last_message_at?: string;
        };
        Update: {
          last_message_at?: string;
        };
      };
      messages: {
        Row: {
          id: string;
          conversation_id: string;
          sender_id: string;
          content: string;
          read_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          conversation_id: string;
          sender_id: string;
          content: string;
          read_at?: string | null;
        };
        Update: {
          read_at?: string | null;
        };
      };
      events: {
        Row: {
          id: string;
          organizer_id: string | null;
          title: string;
          description: string | null;
          event_type: "tournament" | "practice" | "clinic";
          location: string;
          starts_at: string;
          ends_at: string | null;
          max_entrants: number | null;
          entry_fee_jpy: number;
          skill_levels: string[];
          stripe_price_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          organizer_id?: string | null;
          title: string;
          description?: string | null;
          event_type: "tournament" | "practice" | "clinic";
          location: string;
          starts_at: string;
          ends_at?: string | null;
          max_entrants?: number | null;
          entry_fee_jpy?: number;
          skill_levels?: string[];
          stripe_price_id?: string | null;
        };
        Update: {
          title?: string;
          description?: string | null;
          event_type?: "tournament" | "practice" | "clinic";
          location?: string;
          starts_at?: string;
          ends_at?: string | null;
          max_entrants?: number | null;
          entry_fee_jpy?: number;
          skill_levels?: string[];
        };
      };
      event_entries: {
        Row: {
          id: string;
          event_id: string;
          user_id: string;
          status: "confirmed" | "waitlisted" | "cancelled";
          payment_intent_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          event_id: string;
          user_id: string;
          status?: "confirmed" | "waitlisted" | "cancelled";
          payment_intent_id?: string | null;
        };
        Update: {
          status?: "confirmed" | "waitlisted" | "cancelled";
          payment_intent_id?: string | null;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}
