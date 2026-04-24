export type FeedbackType = "interested" | "not_interested" | "attended";

export interface EventRecommendation {
  id: number;
  name: string;
  category: string;
  location: string;
  description: string;
}

export interface RecommendationResponse {
  recommendations: EventRecommendation[];
  explanation: string;
}

export interface HistoryResponse {
  session_id: string;
  history: Record<FeedbackType, string[]>;
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
