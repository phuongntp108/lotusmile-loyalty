import { SSM_API_KEY, SSM_API_SECRET, SSM_ENDPOINT } from "@/constants/envs";
import { ofetch } from "ofetch";

interface SearchResponse {
  status: string;
  user: {
    id: string;
    opted_in: boolean;
    activated: boolean;
    available_points: number;
    test_points: number;
    unclaimed_achievement_count: number;
    email: string;
    gender: string;
    dob: string; // yyyy-MM-dd
    created_at: string; // ISO datetime string
    updated_at: string; // ISO datetime string
    country: string;
    suspended: boolean;
    last_name: string;
    first_name: string;
    registered_at: string; // ISO datetime string
    profile_photo_url: string;
    test_account: boolean;
    account_status: string;
    tier: string;
    tier_system: string;
    tier_points: number;
    tier_entered_at: string; // ISO datetime string
    tier_resets_at: string; // ISO datetime string
    referrer_code: string;
  };
}

const searchProfile = async (email: string) => {
  const ssmSearchEndpoint = `${SSM_ENDPOINT}/priv/v1/apps/${SSM_API_KEY}/users/search?email=${email}`;
  const auth = Buffer.from(`${SSM_API_KEY}:${SSM_API_SECRET}`).toString(
    "base64"
  );

  return await ofetch<SearchResponse>(ssmSearchEndpoint, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${auth}`,
    },
  });
};

export default searchProfile;
