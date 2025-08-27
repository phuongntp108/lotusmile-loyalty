import {
  SSM_API_KEY_CONNECT,
  SSM_API_SECRET_CONNECT,
  SSM_DEFAULT_TIER_LEVEL_ID,
  SSM_DEFAULT_TIER_SYSTEM_ID,
  SSM_ENDPOINT_CONNECT,
  SSM_RETAILER_ID,
} from "@/constants/envs";
import { ofetch } from "ofetch";

const moveToDefaultTier = async ({ userId }: { userId: string }) => {
  const auth = Buffer.from(
    `${SSM_API_KEY_CONNECT}:${SSM_API_SECRET_CONNECT}`
  ).toString("base64");

  return await ofetch(
    `${SSM_ENDPOINT_CONNECT}/incentives/api/1.0/movement/move_user`,
    {
      method: "POST",
      headers: { Authorization: `Basic ${auth}` },
      body: {
        retailer_id: SSM_RETAILER_ID,
        tier_system_id: SSM_DEFAULT_TIER_SYSTEM_ID,
        tier_level_id: SSM_DEFAULT_TIER_LEVEL_ID,
        user_id: userId,
        process_intermediate_levels: true,
        evaluate_qualifying_rules: true,
        culture: "en-US",
      },
    }
  );
};

export default moveToDefaultTier;
