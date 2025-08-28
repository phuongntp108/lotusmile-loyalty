import {
  SSM_API_KEY_CONNECT,
  SSM_API_SECRET_CONNECT,
  SSM_ENDPOINT_CONNECT,
  SSM_RETAILER_ID,
  SSM_REWARD_STORE_ID,
} from "@/constants/envs";
import { RedeemOfferPayload } from "@/types";
import { ofetch } from "ofetch";

const redeemOffer = async ({
  rewardStoreOfferId,
  userId,
}: RedeemOfferPayload & { userId: string }) => {
  const auth = Buffer.from(
    `${SSM_API_KEY_CONNECT}:${SSM_API_SECRET_CONNECT}`
  ).toString("base64");

  return await ofetch(
    `${SSM_ENDPOINT_CONNECT}/offers/api/2.0/offers/rewardstores/purchase_offer`,
    {
      method: "POST",
      headers: { Authorization: `Basic ${auth}` },
      body: {
        retailer_id: SSM_RETAILER_ID,
        user_id: userId,
        reward_store_id: SSM_REWARD_STORE_ID,
        reward_store_offer_id: rewardStoreOfferId,
        quantity: 1,
        culture: "en-US",
      },
    }
  );
};

export default redeemOffer;
