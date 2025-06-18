import { StreamVideoClient } from "@stream-io/video-client";
import { user } from "@/constants";
import { tokenProvider } from "@/actions/stream.token.provider"; // Your backend should generate this

export const getStreamClient = () => {
  return new StreamVideoClient({
    apiKey: process.env.NEXT_PUBLIC_STREAM_API_KEY!,
    user: {
      id: user.id,
      name: user.name,
    },
    tokenProvider,
  });
};
