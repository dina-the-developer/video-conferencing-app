"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { initialValues, MeetingState, user } from "@/constants";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Calendar } from "./ui/calendar";
import { Textarea } from "./ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { CalendarIcon, CheckCircle2Icon } from "lucide-react";

import { toast } from "sonner";

import { meetingTypes } from "@/constants";
import MeetingDialog from "./meeting-dialog";
import { DatetimePicker } from "@/components/ui/date-time-picker";

import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk";

import { cn } from "../lib/utils"; // Adjusting the path to point to the correct location
import { add, format } from "date-fns";

import Loading from "@/app/loading";
import MeetingCard from "./meeting-card";
import UpcomingMeeting from "./upcoming-meeting";

export default function MeetingTypes() {
  const router = useRouter();
  const [meetingState, setMeetingState] = useState<MeetingState | undefined>();
  const [values, setValues] = useState(initialValues);
  const [callDetails, setCallDetails] = useState<Call>();
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const client = useStreamVideoClient();

  const enrichedMeetingTypes = meetingTypes.map((type) => ({
    ...type,
    handleClick:
      type.state === "isAllRecordings"
        ? () => router.push("/recordings", { scroll: false })
        : () => setMeetingState(type.state),
  }));

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

      console.log("Meeting created successfully!");

      if (!values.description) {
        router.push(`/meeting/${call.id}`);
      }
    } catch (e) {
      console.error("Failed to create meeting", e);
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
    <main>
      <section className="meeting-list-container flex flex-col justify-center">
        <div className="grid grid-cols-4 grid-rows-2 gap-4">
          {enrichedMeetingTypes.map((type) => {
            const Icon = type.icon;
            return (
              <MeetingCard
                key={type.id}
                className={type.className}
                title={type.name}
                description={type.description}
                icon={
                  <Icon className="w-12 h-12 text-gray-300 group-hover:text-white group-hover:scale-110 transition-all duration-300" />
                }
                handleClick={type.handleClick}
                buttonText={type.buttonText}
              />
            );
          })}

          {!callDetails ? (
            <MeetingDialog
              isOpen={meetingState === "isScheduleMeeting"}
              onClose={() => setMeetingState(undefined)}
              title="Schedule a Meeting"
              buttonText="Create"
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
            </MeetingDialog>
          ) : (
            <MeetingDialog
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
          <MeetingDialog
            isOpen={meetingState === "isJoinMeeting"}
            onClose={() => setMeetingState(undefined)}
            title="Enter the meeting link to join."
            buttonText="Join"
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
                placeholder="https://example.com/meeting/b90d582f-e459-4d32-b012-ec6ab82262db"
              />
            </div>
          </MeetingDialog>

          <MeetingDialog
            isOpen={meetingState === "isInstantMeeting"}
            onClose={() => setMeetingState(undefined)}
            title="Start an Instant Meeting"
            buttonText="Start"
            handleClick={createMeeting}
          />
          <div className="col-span-2 row-span-2 col-start-3 row-start-1">
            <UpcomingMeeting />
          </div>
        </div>
      </section>
    </main>
  );
}
