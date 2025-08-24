import { SSM_API_KEY, SSM_API_SECRET, SSM_ENDPOINT } from "@/constants/envs";
import { ofetch } from "ofetch";

const retrieveDetailProfile = async (userId: string) => {
  const ssmGetProfileDetailEndpoint = `${SSM_ENDPOINT}/priv/v1/apps/${SSM_API_KEY}/users/${userId}?show_identifiers=true&user[user_profile]=true&expand_incentives=true`;
  const auth = Buffer.from(`${SSM_API_KEY}:${SSM_API_SECRET}`).toString(
    "base64"
  );

  const profileRes = await ofetch(ssmGetProfileDetailEndpoint, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${auth}`,
    },
  });

  return profileRes;
};

export default retrieveDetailProfile;
