"use client";
import Loading from "@/app/loading";
import MeetingRoom from "@/components/meeting-room";
import MeetingSettings from "@/components/meeting-settings";
import { useGetCallById } from "@/hooks/use-get-call-by-ids";
import { StreamCall, StreamTheme } from "@stream-io/video-react-sdk";
import { useParams } from "next/navigation";
import { useState } from "react";

export default function MeetingPage() {
  const { id } = useParams<{ id: string }>();
  const [isSetupCompleted, setIsSetupCompleted] = useState(false);

  const { call, isCallLoading } = useGetCallById(id);

  if (isCallLoading) return <Loading />;

  return (
    <div className="text-white">
      <StreamCall call={call}>
        <StreamTheme>
          {!isSetupCompleted ? (
            <MeetingSettings setIsSetupCompleted={setIsSetupCompleted} />
          ) : (
            <MeetingRoom />
          )}
        </StreamTheme>
      </StreamCall>
    </div>
  );
}
