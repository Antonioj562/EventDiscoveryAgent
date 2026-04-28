export type FeedbackType = "interested" | "not_interested" | "attended";

export interface EventRecommendation {
  id: string;
  name: string;
  category: string;
  location: string;
  description: string;
  venue: string;
  start: string;
  localDate: string;
  localTime: string;
  timezone: string;
  url: string;
  imageUrl: string;
  source: string;
}

export interface RecommendationResponse {
  recommendations: EventRecommendation[];
  explanation: string;
  meta?: {
    source: string;
    fallback_reason?: string | null;
    cached: boolean;
    attempts?: Array<{
      keyword: string;
      city: string;
      classificationName: string;
      attempt: number;
    }>;
  };
}

export interface HistoryResponse {
  session_id: string;
  history: Record<FeedbackType, EventRecommendation[]>;
}

export interface UserAccount {
  name: string;
  email: string;
  password: string;
}

export interface AuthUser {
  name: string;
  email: string;
  sessionId: string;
}
