export type SourceType = 'blog_url' | 'blog_text' | 'youtube' | 'audio' | 'pdf';

export type OutputFormat =
  | 'linkedin'
  | 'twitter_thread'
  | 'newsletter'
  | 'shorts_script'
  | 'carousel'
  | 'blog_summary';

export type Tone =
  | 'professional'
  | 'casual'
  | 'humorous'
  | 'inspirational'
  | 'educational';

export type Language = 'tr' | 'en';

export type ConversionStatus = 'pending' | 'processing' | 'completed' | 'failed';

export interface RepurposeRequest {
  source_type: SourceType;
  source_url?: string;
  source_text?: string;
  source_file?: string;
  formats: OutputFormat[];
  tone: Tone;
  language: Language;
  custom_prompt?: string;
}

export interface RepurposeResponse {
  conversion_id: string;
  status: ConversionStatus;
  estimated_seconds: number;
}

export interface ConversionOutput {
  id: string;
  format: OutputFormat;
  tone: Tone;
  content: string;
  content_json: Record<string, unknown> | null;
  word_count: number | null;
  is_edited: boolean;
  edited_content: string | null;
  created_at: string;
}

export interface ConversionResult {
  id: string;
  source_type: SourceType;
  title: string | null;
  language: Language;
  status: ConversionStatus;
  error_message: string | null;
  processing_time: number | null;
  created_at: string;
  outputs: ConversionOutput[];
}
