import {
  SSM_API_KEY_CONNECT,
  SSM_API_SECRET_CONNECT,
  SSM_ENDPOINT_CONNECT,
  SSM_RETAILER_ID,
} from "@/constants/envs";
import { TriggerEventResponse } from "@/types";
import { ofetch } from "ofetch";

const triggerEvent = async ({
  userId,
  eventLookup,
}: {
  userId: string;
  eventLookup: string;
}) => {
  const auth = Buffer.from(
    `${SSM_API_KEY_CONNECT}:${SSM_API_SECRET_CONNECT}`
  ).toString("base64");
  return await ofetch<TriggerEventResponse>(
    `${SSM_ENDPOINT_CONNECT}/incentives/api/1.0/user_events/trigger_user_event`,
    {
      headers: { Authorization: `Basic ${auth}` },
      method: "POST",
      body: {
        retailer_id: SSM_RETAILER_ID,
        user_id: userId,
        event_lookup: eventLookup,
        culture: "en-US",
        include_progress: false,
      },
    }
  );
};

export default triggerEvent;
