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
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          locale: 'tr' | 'en';
          timezone: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          locale?: 'tr' | 'en';
          timezone?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          locale?: 'tr' | 'en';
          timezone?: string;
          updated_at?: string;
        };
      };
      subscriptions: {
        Row: {
          id: string;
          user_id: string;
          ls_subscription_id: string | null;
          ls_customer_id: string | null;
          plan_slug: 'free' | 'starter' | 'pro';
          status: 'active' | 'cancelled' | 'expired' | 'past_due' | 'paused';
          billing_cycle: 'monthly' | 'yearly' | null;
          current_period_start: string | null;
          current_period_end: string | null;
          cancel_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          ls_subscription_id?: string | null;
          ls_customer_id?: string | null;
          plan_slug?: 'free' | 'starter' | 'pro';
          status?: 'active' | 'cancelled' | 'expired' | 'past_due' | 'paused';
          billing_cycle?: 'monthly' | 'yearly' | null;
          current_period_start?: string | null;
          current_period_end?: string | null;
          cancel_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          ls_subscription_id?: string | null;
          ls_customer_id?: string | null;
          plan_slug?: 'free' | 'starter' | 'pro';
          status?: 'active' | 'cancelled' | 'expired' | 'past_due' | 'paused';
          billing_cycle?: 'monthly' | 'yearly' | null;
          current_period_start?: string | null;
          current_period_end?: string | null;
          cancel_at?: string | null;
          updated_at?: string;
        };
      };
      conversions: {
        Row: {
          id: string;
          user_id: string;
          source_type: 'blog_url' | 'blog_text' | 'youtube' | 'audio' | 'pdf';
          source_url: string | null;
          source_text: string | null;
          source_file_url: string | null;
          title: string | null;
          language: 'tr' | 'en';
          status: 'pending' | 'processing' | 'completed' | 'failed';
          error_message: string | null;
          processing_time: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          source_type: 'blog_url' | 'blog_text' | 'youtube' | 'audio' | 'pdf';
          source_url?: string | null;
          source_text?: string | null;
          source_file_url?: string | null;
          title?: string | null;
          language?: 'tr' | 'en';
          status?: 'pending' | 'processing' | 'completed' | 'failed';
          error_message?: string | null;
          processing_time?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          source_url?: string | null;
          source_text?: string | null;
          source_file_url?: string | null;
          title?: string | null;
          language?: 'tr' | 'en';
          status?: 'pending' | 'processing' | 'completed' | 'failed';
          error_message?: string | null;
          processing_time?: number | null;
          updated_at?: string;
        };
      };
      outputs: {
        Row: {
          id: string;
          conversion_id: string;
          user_id: string;
          format:
            | 'linkedin'
            | 'twitter_thread'
            | 'newsletter'
            | 'shorts_script'
            | 'carousel'
            | 'blog_summary';
          tone:
            | 'professional'
            | 'casual'
            | 'humorous'
            | 'inspirational'
            | 'educational';
          content: string;
          content_json: Json | null;
          word_count: number | null;
          is_edited: boolean;
          edited_content: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          conversion_id: string;
          user_id: string;
          format:
            | 'linkedin'
            | 'twitter_thread'
            | 'newsletter'
            | 'shorts_script'
            | 'carousel'
            | 'blog_summary';
          tone?:
            | 'professional'
            | 'casual'
            | 'humorous'
            | 'inspirational'
            | 'educational';
          content: string;
          content_json?: Json | null;
          word_count?: number | null;
          is_edited?: boolean;
          edited_content?: string | null;
          created_at?: string;
        };
        Update: {
          content?: string;
          content_json?: Json | null;
          word_count?: number | null;
          is_edited?: boolean;
          edited_content?: string | null;
        };
      };
      usage: {
        Row: {
          id: string;
          user_id: string;
          period_start: string;
          period_end: string;
          conversions_used: number;
          conversions_limit: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          period_start: string;
          period_end: string;
          conversions_used?: number;
          conversions_limit?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          conversions_used?: number;
          conversions_limit?: number;
          updated_at?: string;
        };
      };
      templates: {
        Row: {
          id: string;
          name_tr: string;
          name_en: string;
          description_tr: string | null;
          description_en: string | null;
          format: string;
          tone: string;
          custom_prompt: string | null;
          is_premium: boolean;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          name_tr: string;
          name_en: string;
          description_tr?: string | null;
          description_en?: string | null;
          format: string;
          tone: string;
          custom_prompt?: string | null;
          is_premium?: boolean;
          sort_order?: number;
          created_at?: string;
        };
        Update: {
          name_tr?: string;
          name_en?: string;
          description_tr?: string | null;
          description_en?: string | null;
          format?: string;
          tone?: string;
          custom_prompt?: string | null;
          is_premium?: boolean;
          sort_order?: number;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}

export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row'];
export type InsertTables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Insert'];
export type UpdateTables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Update'];
