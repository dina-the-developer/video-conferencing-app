"use client";

import { useRouter } from "next/navigation";
import CallCard from "./call-card";
import { useGetCalls } from "@/hooks/use-get-calls";
import Loading from "@/app/loading";
import { Call, CallRecording } from "@stream-io/video-react-sdk";
import { useEffect, useState } from "react";
import { Disc, StepBack, StepForward } from "lucide-react";

export default function CallLists({
  type,
}: {
  type: "upcoming" | "previous" | "recordings";
}) {
  const router = useRouter();
  const { previousCalls, upcomingCalls, callRecordings, isLoading } =
    useGetCalls();
  const [recordings, setRecordings] = useState<CallRecording[]>([]);

  const getCalls = () => {
    switch (type) {
      case "upcoming":
        return upcomingCalls;
      case "previous":
        return previousCalls;
      case "recordings":
        return recordings;
      default:
        return [];
    }
  };

  const getNoCallsMessage = () => {
    switch (type) {
      case "upcoming":
        return "No Upcoming Calls";
      case "previous":
        return "No Previous Calls";
      case "recordings":
        return "No Call Recordings";
      default:
        return "";
    }
  };

  useEffect(() => {
    const fetchRecordings = async () => {
      const callData = await Promise.all(
        callRecordings?.map((meeting) => meeting.queryRecordings()) ?? []
      );

      const recordings = callData
        .filter((call) => call.recordings.length > 0)
        .flatMap((call) => call.recordings);
      setRecordings(recordings);
    };

    if (type === "recordings") {
      fetchRecordings();
    }
  }, [type, callRecordings]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loading />
      </div>
    );
  }

  const calls = getCalls();
  const noCallsMessage = getNoCallsMessage();

  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-3">
        {calls && calls.length > 0 ? (
          calls.map((meeting: Call | CallRecording, index) => (
            <CallCard
              key={index}
              icon={
                type === "previous"
                  ? StepBack
                  : type === "upcoming"
                  ? StepForward
                  : Disc
              }
              title={
                (meeting as Call).state?.custom?.description ||
                (meeting as CallRecording).filename?.substring(0, 20) ||
                "No Description"
              }
              date={
                (meeting as Call).state?.startsAt?.toLocaleString() ||
                (meeting as CallRecording).start_time?.toLocaleString()
              }
              isPreviousMeeting={type === "previous"}
              link={
                type === "recordings"
                  ? (meeting as CallRecording).url
                  : `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${
                      (meeting as Call).id
                    }`
              }
              handleClick={
                type === "recordings"
                  ? () => {
                      router.push(`${(meeting as CallRecording).url}`);
                    }
                  : () => {
                      router.push(`/meeting/${(meeting as Call).id}`);
                    }
              }
              buttonText={type === "recordings" ? "Download" : "Join"}
            />
          ))
        ) : (
          <h1 className="text-2xl font-bold text-white">{noCallsMessage}</h1>
        )}
      </div>
    </div>
  );
}
