import {
  SSM_CLOUDPOS_API_SECRET,
  SSM_CLOUDPOS_API_USER,
  SSM_ENDPOINT_CLOUDPOS,
  SSM_LOCATION_STORE_ID,
  SSM_RETAILER_ID,
} from "@/constants/envs";
import { Request, User } from "@/lib/generated/prisma";
import { format } from "date-fns";
import { ofetch } from "ofetch";

const sendTransaction = async ({
  request,
}: {
  request: Request & { requestor: User };
}) => {
  const auth = Buffer.from(
    `${SSM_CLOUDPOS_API_USER}:${SSM_CLOUDPOS_API_SECRET}`
  ).toString("base64");

  const body = {
    store_id: SSM_LOCATION_STORE_ID,
    client_id: SSM_RETAILER_ID,
    user_id: request.requestor.ssm_id,
    request_id: "1",
    request_payload: {
      pos_employee_id: "1000",
      channel: request.type,
      transaction_id: "FIN" + format(new Date(), "yyyyMMddhhmmss"),
      subtotal: request.miles,
      open_time: "2018-09-20 09:30:00.000",
      modified_time: "2018-09-20 09:30:00.000",
      items: [
        {
          item_id: "0",
          line_id: "1",
          quantity: 1.0,
          unit_price: request.miles,
          tax_included: 0.0,
          subtotal: request.miles,
        },
      ],
      payments: [
        {
          receipt_code: "receipt-code-0815-21-99",
          payment_id: "10409444599",
          user_id: request.requestor.ssm_id,
          user_id_type: "SessionM_ID",
          amount: request.miles,
          type: "CASH",
          payment_time: "2018-09-20 09:30:00.2727288Z",
        },
      ],
      discounts: [],
    },
  };

  return await ofetch(`${SSM_ENDPOINT_CLOUDPOS}/api/2.0/send_transaction`, {
    method: "POST",
    headers: { Authorization: `Basic ${auth}` },
    body,
  });
};

export default sendTransaction;
