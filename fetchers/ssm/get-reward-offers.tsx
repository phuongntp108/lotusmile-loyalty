import {
  SSM_API_KEY_CONNECT,
  SSM_API_SECRET_CONNECT,
  SSM_ENDPOINT_CONNECT,
  SSM_RETAILER_ID,
  SSM_REWARD_STORE_ID,
} from "@/constants/envs";
import { RedeemOfferResponse } from "@/types";
import { ofetch } from "ofetch";

const getRewardOffers = async () => {
  const auth = Buffer.from(
    `${SSM_API_KEY_CONNECT}:${SSM_API_SECRET_CONNECT}`
  ).toString("base64");

  return await ofetch<RedeemOfferResponse>(
    `${SSM_ENDPOINT_CONNECT}/offers/api/2.0/offers/rewardstores/get_reward_store_offers`,
    {
      method: "POST",
      headers: { Authorization: `Basic ${auth}` },
      body: {
        limit_to_only_active: false,
        exclude_free_offers: false,
        include_expired: true,
        skip: 0,
        take: 10,
        sort_column: "",
        sort_direction: "asc",
        reward_store_ids: [SSM_REWARD_STORE_ID],
        quantity: 1,
        retailer_id: SSM_RETAILER_ID,
        culture: "en-US",
      },
    }
  );
};

export default getRewardOffers;
