"use client";
import { StreamVideo, StreamVideoClient } from "@stream-io/video-react-sdk";
import { useEffect, useState } from "react";
import { user } from "@/constants";
import { tokenProvider } from "@/actions/stream.token.provider";
import Loading from "@/app/loading";

const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY;
const StreamVideoProvider = ({ children }: { children: React.ReactNode }) => {
  const [videoClient, setVideoClient] = useState<StreamVideoClient>();

  useEffect(() => {
    if (!user) {
      return;
    }

    if (!apiKey) throw new Error("Stream API key is missing");

    const client = new StreamVideoClient({
      apiKey,
      user: { id: user?.id, name: user?.name || user?.id },
      tokenProvider,
    });
    setVideoClient(client);
  }, []);

  if (!videoClient) {
    return (
      <div>
        <Loading />
      </div>
    );
  }

  return <StreamVideo client={videoClient}>{children}</StreamVideo>;
};

export default StreamVideoProvider;
