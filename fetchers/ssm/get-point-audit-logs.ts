import {
  SSM_API_KEY_CONNECT,
  SSM_API_SECRET_CONNECT,
  SSM_ENDPOINT_CONNECT,
  SSM_RETAILER_ID,
} from "@/constants/envs";
import { TriggerEventResponse } from "@/types";
import { ofetch } from "ofetch";

const getPointAuditLogs = async ({ userId }: { userId: string }) => {
  const auth = Buffer.from(
    `${SSM_API_KEY_CONNECT}:${SSM_API_SECRET_CONNECT}`
  ).toString("base64");
  return await ofetch<TriggerEventResponse>(
    `${SSM_ENDPOINT_CONNECT}/incentives/api/2.0/user_points/fetch_point_audit_logs`,
    {
      headers: { Authorization: `Basic ${auth}` },
      method: "POST",
      body: {
        retailer_id: SSM_RETAILER_ID,
        user_id: userId,
        exclude_specified_modification_types: true,
        skip: 0,
        take: 50,
      },
    }
  );
};

export default getPointAuditLogs;
