"use server";

import { user } from "@/constants";
import { clientProvider } from "@/providers/StreamClient";
export async function tokenProvider() {
  console.log("User", user);
  if (!user) throw new Error("User not logged in");

  const client = clientProvider();

  if (!client) throw new Error("Client not initialized");
  const exp = Math.round(new Date().getTime() / 1000 + 60 * 60);

  const issued = Math.floor(Date.now() / 1000) - 60;
  const token = await client.generateUserToken({
    user_id: user.id,
    exp,
    issued,
  });

  return token;
}
