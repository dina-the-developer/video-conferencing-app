"use client";
import { Button } from "@/components/ui/button";
import { useSession } from "@/context/SessionContext";
import { useStreamVideoClient } from "@stream-io/video-react-sdk";
import { CopyIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
const Table = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => {
  return (
    <div className="flex flex-col items-start gap-2 xl:flex-row">
      <h1 className="text-base font-medium text-sky-1 lg:text-xl xl:min-w-32">
        {title}:
      </h1>
      <h1 className="truncate text-sm font-bold max-sm:max-w-[320px] lg:text-xl">
        {description}
      </h1>
    </div>
  );
};

export default function PersonalRoom() {
  // Use the session context to get the user information.
  const { user } = useSession();
  const userId = user?.id;
  const client = useStreamVideoClient();
  const router = useRouter();

  console.log(user);

  const startRoom = async () => {
    if (!userId || !client) return;

    const newCall = client.call("default", userId!);
    const call = await newCall.getOrCreate({
      data: {
        custom: {
          description: "Personal Room",
        },
        starts_at: new Date().toISOString(),
      },
    });
    if (!call) {
      throw new Error("Call failed");
    }

    router.push(`/meeting/${userId}`, { scroll: false });
  };

  const meetingLink = `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${userId}`;
  return (
    <section className="flex size-full flex-col gap-10 text-white bg-gray-800 p-5 rounded ">
      <h1 className="text-xl font-bold lg:text-3xl">{`${user?.username}'s Meeting Room`}</h1>
      <div className="flex w-full flex-col gap-8 xl:max-w-[900px]">
        <Table title="Meeting ID" description={userId!} />
        <Table title="Invite Link" description={meetingLink} />
      </div>
      <div className="flex gap-5">
        <Button
          className="rounded cursor-pointer"
          variant="default"
          onClick={startRoom}
        >
          Start Meeting
        </Button>
        <Button
          variant="default"
          className="rounded cursor-pointer"
          onClick={() => {
            navigator.clipboard.writeText(meetingLink);
            toast("Link Copied");
          }}
        >
          <CopyIcon /> Copy Invitation
        </Button>
      </div>
    </section>
  );
}
