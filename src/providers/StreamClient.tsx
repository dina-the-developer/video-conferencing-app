import { StreamClient } from "@stream-io/node-sdk";

const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY;
const apiSecret = process.env.STREAM_API_SECRET;
export const clientProvider = () => {
  if (!apiKey) throw new Error("API key not provided");
  if (!apiSecret) throw new Error("Secret key not provided");

  const client = new StreamClient(apiKey, apiSecret, { timeout: 3000 });
  if (!client) throw new Error("Client not initialized");

  return client;
};
