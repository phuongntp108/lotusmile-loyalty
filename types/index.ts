import { SsmUseRegisterAPIParams } from "@/app/api/register/route";

export type UserRole = "admin" | "reviewer" | "viewer" | "member";
export type RequestStatus = "reviewing" | "approved" | "rejected";
export interface Session {
  sid: string;
  sess: unknown; // JSONB
  expire: Date;
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

export interface PointHistory {
  id: string;
  userId: string;
  type: string; // "earned" | "redeemed"
  points: number;
  description: string;
  createdAt?: Date;
}

export interface UserWithRelations extends User {
  pointRequests?: PointRequest[];
  pointHistory?: PointHistory[];
}

export interface PointRequestWithUser extends PointRequest {
  user: User;
}

export interface PointHistoryWithUser extends PointHistory {
  user: User;
}

export type RegisterUser = Omit<
  SsmUseRegisterAPIParams["user"],
  "opted_in" | "external_id_type" | "external_id"
>;

export interface LoginUser {
  email: string;
  password: string;
}

export type UpsertUser = Omit<User, "id" | "createdAt" | "updatedAt">;

export interface InsertPointRequest {
  flightNumber: string;
  departureAirport: string;
  arrivalAirport: string;
  departureDate: string;
  additionalNotes?: string;
}

export interface InsertPointHistory {
  userId: string;
  type: string; // "earned" | "redeemed"
  points: number;
  description: string;
}

export interface ApproveRequest {
  reviewerEmail: string;
  pointsAwarded?: number;
}

export interface RejectRequest {
  reviewerEmail: string;
  reason: string;
}

export interface AdminListRequests {
  page?: number; // default: 1
  pageSize?: number; // default: 20
  status?: string;
  memberName?: string;
  dateFrom?: string;
  dateTo?: string;
  sort?: "submittedAt" | "status" | "memberName";
  order?: "asc" | "desc";
}

export interface Requestor {
  id: string;
  email: string;
  name: string | null;
}
