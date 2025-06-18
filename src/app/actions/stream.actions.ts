"use server";

import { StreamClient } from "@stream-io/node-sdk";
import { currentSession } from "@/lib/session";

const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY;
const apiSecret = process.env.STREAM_API_SECRET;

export async function tokenProvider() {
  const session = await currentSession();
  console.log("Session in tokenProvider", session);
  if (!session || !session.id) {
    throw new Error("User not logged in");
  }

  if (!apiKey) throw new Error("Stream API key not provided");
  if (!apiSecret) throw new Error("Stream API secret not provided");

  const client = new StreamClient(apiKey, apiSecret, { timeout: 3000 });
  const exp = Math.floor(Date.now() / 1000) + 60 * 60; // 1 hour expiry
  const issued = Math.floor(Date.now() / 1000) - 60;
  const id = session.id;

  console.log("serverId:", id);
  const token = client.generateUserToken({
    user_id: id as string,
    exp,
    issued,
  });

  return token;
}
