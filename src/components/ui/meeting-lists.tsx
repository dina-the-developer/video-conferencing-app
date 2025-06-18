"use client";
import {
  CalendarIcon,
  CheckCircle2Icon,
  PersonStandingIcon,
  Plus,
  Video,
} from "lucide-react";
import React, { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import MeetingCard from "./meeting-card";
import MeetingModal from "./meeting-modal";
import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk";
import { toast } from "sonner";
import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { cn } from "../lib/utils"; // Adjusting the path to point to the correct location
import { add, format } from "date-fns";
import Loading from "@/app/loading";
import { Input } from "./ui/input";
import { DatetimePicker } from "@/components/ui/date-time-picker";

export default function MeetingLists() {
  const router = useRouter();
  const [meetingState, setMeetingState] = useState<
    | "isScheduleMeeting"
    | "isJoiningMeeting"
    | "isInstantMeeting"
    | "isAllRecordings"
    | undefined
  >(undefined);
  const meetings = [
    {
      title: "New Meeting",
      description: "Setup a new meeting",
      className: "bg-[#FF742E]",
      icon: <Plus />,
      handleClick: () => setMeetingState("isInstantMeeting"),
    },
    {
      title: "Join Meeting",
      description: "Via invitation link",
      className: "bg-[#0E78F9]",
      icon: <PersonStandingIcon />,
      handleClick: () => setMeetingState("isJoiningMeeting"),
    },
    {
      title: "Schedule Meeting",
      description: "Plan your meeting",
      className: "bg-[#830EF9]",
      icon: <CalendarIcon />,
      handleClick: () => setMeetingState("isScheduleMeeting"),
    },
    {
      title: "View Recordings",
      description: "Meeting recordings",
      className: "bg-[#F9A90E]",
      icon: <Video />,
      handleClick: () => router.push("/recordings", { scroll: false }),
    },
  ];
  const initialValues = {
    date: new Date(),
    description: "",
    link: "",
  };
  const { user } = useUser();
  const [values, setValues] = useState(initialValues);
  const [callDetails, setCallDetails] = useState<Call>();
  const client = useStreamVideoClient();
  const [date, setDate] = React.useState<Date | undefined>(new Date());

  const createMeeting = async () => {
    if (!user || !client) {
      return;
    }
    try {
      const id = crypto.randomUUID();
      const call = client.call("default", id);

      if (!call) {
        throw new Error("Call failed");
      }
      const startsAt = values.date
        ? values.date.toISOString()
        : new Date().toISOString();

      const description = values.description || "Instant Meeting";

      await call.getOrCreate({
        data: {
          starts_at: startsAt,
          custom: {
            description,
          },
        },
      });

      setCallDetails(call);

      toast("Meeting created successfully!");

      if (!values.description) {
        router.push(`/meeting/${call.id}`);
      }
    } catch (e) {
      console.error("Failed to create meeting", e);
      toast("Failed to create Meeting");
      return;
    }

    if (!client || !user) return <Loading />;
  };

  /**
   * carry over the current time when a user clicks a new day
   * instead of resetting to 00:00
   */
  const handleSelect = (newDay: Date | undefined) => {
    if (!newDay) return;
    if (!date) {
      setDate(newDay);
      return;
    }
    const diff = newDay.getTime() - date.getTime();
    const diffInDays = diff / (1000 * 60 * 60 * 24);
    const newDateFull = add(date, { days: Math.ceil(diffInDays) });
    setDate(newDateFull);
    const newDate = new Date(newDateFull);
    setValues({
      ...values,
      date: newDate,
    });
  };

  const meetingLink = `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${callDetails?.id}`;

  return (
    <section className="meeting-list-container">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
        {meetings.map((meeting, index) => {
          return (
            <MeetingCard
              icon={meeting.icon}
              className={meeting.className}
              key={index}
              title={meeting.title}
              description={meeting.description}
              handleClick={meeting.handleClick}
            />
          );
        })}
      </div>
      {!callDetails ? (
        <MeetingModal
          isOpen={meetingState === "isScheduleMeeting"}
          onClose={() => setMeetingState(undefined)}
          title="Schedule a Meeting"
          buttonText="Create Meeting"
          handleClick={createMeeting}
        >
          <div className="flex flex-col gap-1">
            <Label className="py-3 text-sm" htmlFor="description">
              Add Description
            </Label>
            <Textarea
              name="description"
              value={values.description}
              onChange={(e) =>
                setValues({ ...values, description: e.target.value })
              }
              className="w-full p-2 border border-gray-400 rounded"
              rows={3}
              placeholder="Meeting Description (optional)"
            />
          </div>
          <div className="flex flex-col gap-1">
            <Label className="py-3 text-sm" htmlFor="description">
              Choose a Date and Time
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal bg-transparent hover:bg-transparent text-white hover:text-white",
                    !date && "text-muted-foreground rounded"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? (
                    format(date, "PPP HH:mm:ss")
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(d) => handleSelect(d)}
                  initialFocus
                />
                <div className="p-3 border-t border-border">
                  <DatetimePicker setDate={setDate} date={date} />
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </MeetingModal>
      ) : (
        <MeetingModal
          isOpen={meetingState === "isScheduleMeeting"}
          onClose={() => setMeetingState(undefined)}
          icon={<CheckCircle2Icon width={50} height={50} />}
          title="Meeting Created"
          buttonText="Copy Meeting Link"
          className="text-center"
          handleClick={() => {
            navigator.clipboard.writeText(meetingLink);
            toast("Meeting link copied to clipboard!");
          }}
        />
      )}

      <MeetingModal
        isOpen={meetingState === "isJoiningMeeting"}
        onClose={() => setMeetingState(undefined)}
        title="Join Meeting"
        buttonText="Join Meeting"
        className="text-center"
        handleClick={() => {
          if (!values.link) {
            toast("Paste the meeting link");
          }
          router.push(values.link);
        }}
      >
        <div className="flex flex-col gap-1">
          <Label className="py-3 text-sm" htmlFor="meeting-link">
            Meeting Link
          </Label>
          <Input
            name="meeting-link"
            onChange={(e) => setValues({ ...values, link: e.target.value })}
            className="w-full p-2 border border-gray-400 rounded focus-visible:ring-0 focus-visible:ring-offset-0"
            placeholder="Meeting link"
          />
        </div>
      </MeetingModal>

      <MeetingModal
        isOpen={meetingState === "isInstantMeeting"}
        onClose={() => setMeetingState(undefined)}
        title="Start an Instant Meeting"
        buttonText="Start Meeting"
        className="text-center"
        handleClick={createMeeting}
      />
    </section>
  );
}
