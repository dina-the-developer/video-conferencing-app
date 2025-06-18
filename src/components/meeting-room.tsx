import { cn } from "@/lib/utils";
import {
  SpeakerLayout,
  PaginatedGridLayout,
  CallParticipantsList,
  CallControls,
  CallingState,
  CallStatsButton,
  useCallStateHooks,
} from "@stream-io/video-react-sdk";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LayoutList, User } from "lucide-react";
import { Button } from "./ui/button";
import Loading from "@/app/loading";
import EndCallButton from "./end-call-button";

type CallLayoutType = "speaker-left" | "speaker-right" | "grid";

export default function MeetingRoom() {
  const searchParams = useSearchParams();
  const isPersonalRoom = !!searchParams.get("personal");
  const router = useRouter();
  const [layout, setLayout] = useState<CallLayoutType>("speaker-left");
  const [showParticipants, setShowParticipants] = useState(false);
  const { useCallCallingState } = useCallStateHooks();

  const callingState = useCallCallingState();

  if (callingState !== CallingState.JOINED) return <Loading />;

  const CallLayout = () => {
    switch (layout) {
      case "speaker-left":
        return <SpeakerLayout participantsBarPosition="left" />;
      case "speaker-right":
        return <SpeakerLayout participantsBarPosition="right" />;
      case "grid":
        return <PaginatedGridLayout />;
      default:
        break;
    }
  };

  return (
    <section className="meeting-room-wrapper flex flex-col w-full justify-center text-white">
      <div className="meeting-room flex items-center justify-center size-full">
        <CallLayout />
        <div
          className={cn("h-[calc(100vh-86px)] hidden ml-2", {
            "show-block": showParticipants,
          })}
        >
          <CallParticipantsList onClose={() => setShowParticipants(false)} />
        </div>
        <div className="absolute bottom-20 flex w-full items-center justify-center gap-5">
          <CallControls onLeave={() => router.push("/")} />
          <DropdownMenu>
            <div className="flex items-center">
              <DropdownMenuTrigger className="rounded-2xl cursor-pointer bg-[#19232d] hover:bg-[#323b44] py-2 px-4">
                <LayoutList size={20} className="text-white" />
              </DropdownMenuTrigger>
            </div>

            <DropdownMenuContent>
              {["Grid", "Speaker-Left", "Speaker-Right"].map((item, index) => {
                return (
                  <DropdownMenuItem
                    key={index}
                    onClick={() =>
                      setLayout(item.toLowerCase() as CallLayoutType)
                    }
                  >
                    <DropdownMenuLabel>{item}</DropdownMenuLabel>
                  </DropdownMenuItem>
                );
              })}
              <DropdownMenuSeparator />
            </DropdownMenuContent>
          </DropdownMenu>

          <CallStatsButton />
          <Button
            className="rounded-2xl cursor-pointer bg-[#19232d] hover:bg-[#323b44] py-2 px-3"
            onClick={() => setShowParticipants((prev) => !prev)}
          >
            <User size={20} className="text-white" />
          </Button>
          {!isPersonalRoom && <EndCallButton />}
        </div>
      </div>
    </section>
  );
}
