import {
  SSM_API_KEY_CONNECT,
  SSM_API_SECRET_CONNECT,
  SSM_DEFAULT_POINT_ACCOUNT_ID,
  SSM_DEFAULT_POINT_SOURCE_ID,
  SSM_ENDPOINT_CONNECT,
  SSM_RETAILER_ID,
} from "@/constants/envs";
import { Request, User } from "@/lib/generated/prisma";
import { Requestor, TriggerEventResponse } from "@/types";
import { ofetch } from "ofetch";

const deposit = async ({
  request,
}: {
  request: Request & { requestor: User };
}) => {
  const auth = Buffer.from(
    `${SSM_API_KEY_CONNECT}:${SSM_API_SECRET_CONNECT}`
  ).toString("base64");

  return await ofetch<TriggerEventResponse>(
    `${SSM_ENDPOINT_CONNECT}/incentives/api/2.0/user_points/deposit`,
    {
      headers: { Authorization: `Basic ${auth}` },
      method: "POST",
      body: {
        retailer_id: SSM_RETAILER_ID,
        user_id: request.requestor.ssm_id,
        deposit_details: [
          {
            point_source_id: SSM_DEFAULT_POINT_SOURCE_ID,
            amount: request.baseMiles,
            point_account_id: SSM_DEFAULT_POINT_ACCOUNT_ID,
            rank: 0,
          },
        ],
        allow_partial_success: false,
        disable_event_publishing: false,
        culture: "en-US",
      },
    }
  );
};

export default deposit;
