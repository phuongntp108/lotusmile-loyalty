import { SsmUseRegisterAPIParams } from "@/app/api/register/route";

export type UserRole = "admin" | "reviewer" | "viewer" | "member";
export type RequestStatus = "reviewing" | "approved" | "rejected";
export interface Session {
  sid: string;
  sess: unknown; // JSONB
  expire: Date;
}

interface TierOverview {
  id: string;
  tier_system_id: string;
  retailer_id: string;
  name: string;
  rank: number;
  status: number;
}

interface TierLevel {
  id: string;
  tier_system_id: string;
  tier_level_id: string;
  user_id: string;
  join_date: string; // ISO datetime string
  tier_overview: TierOverview;
  tier_progress: any[]; // có thể khai báo rõ hơn nếu biết cấu trúc
}

interface PointAccountDetail {
  account_name: string;
  user_point_account_id: string;
  point_account_id: string;
  grouping_label?: string;
  available_balance: number;
  life_time_value: number;
}

interface PointAccountBalances {
  retailer_id: string;
  user_id: string;
  summary: {
    total_points: number;
    life_time_points: number;
  };
  details: PointAccountDetail[];
}

interface TierDetails {
  tier_levels: TierLevel[];
  point_account_balances: PointAccountBalances;
}

export interface User {
  id: string; // UUID từ hệ thống
  external_id: string;
  opted_in: boolean;
  activated: boolean;
  proxy_ids: string[];
  available_points: number;
  test_points: number;
  unclaimed_achievement_count: number;
  email: string;
  gender: string; // ví dụ: 'm', 'f'
  dob: string; // yyyy-MM-dd
  created_at: string; // ISO date hoặc "YYYY-MM-DD HH:mm:ss"
  updated_at: string;
  country: string;
  suspended: boolean;
  last_name: string;
  first_name: string;
  registered_at: string;
  profile_photo_url: string | null;
  test_account: boolean;
  account_status: string; // ví dụ: 'good', 'suspended'
  tier: string; // ví dụ: 'Silver Tier'
  tier_system: string; // ví dụ: 'FlightLoyalty'
  tier_points: number;
  tier_entered_at: string;
  tier_resets_at: string;
  referrer_code: string | null;
  next_tier_points?: number;
  tier_details?: TierDetails;
}

export interface PointRequest {
  id: string;
  userId: string;
  flightNumber: string;
  departureAirport: string;
  arrivalAirport: string;
  departureDate: string;
  additionalNotes?: string | null;
  status?: RequestStatus; // default: "pending"
  pointsAwarded?: number; // default: 0
  rejectedReason?: string | null;
  reviewedBy?: string | null; // reviewer email
  reviewedAt?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export type RegisterUser = Omit<
  SsmUseRegisterAPIParams["user"],
  "opted_in" | "external_id_type" | "external_id"
>;

export interface LoginUser {
  email: string;
  password: string;
}

export interface Requestor {
  id: string;
  email: string;
  name: string | null;
}

export interface UserEvent {
  id: string;
  time_of_occurrence: string; // ISO datetime string
  retailer_id: string;
  event_lookup: string;
  user_id: string;
  is_session_m: boolean;
}

export interface TriggerEventResponse {
  status: string;
  payload: {
    user_event: UserEvent;
    event_saved_successfully: boolean;
    rules_processed_successfully: boolean;
    outcomes: {
      is_outcome_applied: boolean;
      discriminator: number;
      points_awarded: number;
    }[]; // có thể khai báo rõ hơn nếu biết cấu trúc outcomes
  };
}

export interface PointHistory {
  id: string;
  retailer_id: string;
  user_id: string;
  account_name: string;
  point_account_id: string;
  user_point_account_id: string;
  modification: number;
  amount_spent: number;
  amount_expired: number;
  audit_type: number;
  modification_type: string;
  modification_entity_id: string;
  spend_weight: number;
  point_source_id: string;
  point_source_name: string;
  time_of_occurrence: string; // ISO datetime
  create_date: string; // ISO datetime
  request_id: string;
  idempotency_id: string;
  transaction_id?: string; // optional, chỉ có ở một số record
}

export interface RedeemOfferPayload {
  rewardStoreOfferId: string;
}

export interface RewardStoreMedia {
  id: string;
  offer_id: string;
  uri: string;
  category_id: string;
  category_name: string;
  content_type: number;
  culture: string;
}

export interface OfferDetails {
  internal_name: string;
  title: string;
  description: string;
  terms: string;
  media: any[]; // Replace 'any' with a more specific type if available
  reward_store_media: RewardStoreMedia;
  points?: number;
  acquisition_start_date: string;
  acquisition_end_date?: string;
  pos_discount_id?: string;
  offer_status: number;
  offer_inventory_restrictions: any[]; // Replace 'any' if you know the structure
}

export interface RewardStoreOffer {
  id: string;
  root_offer_id: string;
  reward_store_id: string;
  price: number;
  start_date: string;
  end_date?: string;
  offer_details: OfferDetails;
}

export interface RedeemOfferResponsePayload {
  reward_store_offers: RewardStoreOffer[];
  total_rows: number;
  skip: number;
  take: number;
}

export interface RedeemOfferResponse {
  data: {
    status: string;
    payload: RedeemOfferResponsePayload;
  };
}
