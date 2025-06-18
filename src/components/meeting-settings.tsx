"use client";
import { useCall, VideoPreview } from "@stream-io/video-react-sdk";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "./ui/label";

export default function MeetingSettings({
  setIsSetupCompleted,
}: {
  setIsSetupCompleted: (value: boolean) => void;
}) {
  const [isMicrophoneToggledOn, setIsMicrophoneToggledOn] = useState(false);
  const [isCameraToggledOn, setIsCameraToggledOn] = useState(false);
  const call = useCall();

  // console.log("call", call);
  // console.log(setIsCameraToggledOn);

  useEffect(() => {
    if (isMicrophoneToggledOn) {
      call?.microphone.disable();
    } else {
      call?.microphone.enable();
    }

    if (isCameraToggledOn) {
      call?.camera.disable();
    } else {
      call?.camera.enable();
    }

    if (!call) {
      throw new Error("useCall must be used within StreamCall component!");
    }
    return () => {
      call?.camera.enable();
      call?.microphone.enable();
    };
  }, [
    isMicrophoneToggledOn,
    isCameraToggledOn,
    call,
    call?.camera,
    call?.microphone,
  ]);

  // console.log("isMicrophoneToggledOn", isMicrophoneToggledOn);

  return (
    <div className="meeting-setup-wrapper flex flex-col w-full items-center justify-center">
      <h1 className="text-3xl text-center pb-4">Setup</h1>
      <div className="flex flex-col justify-center items-center">
        <VideoPreview
          className="flex flex-col w-full justify-center items-center"
          mirror={true}
        />
      </div>

      <div className="flex flex-col justify-center items-center w-full">
        <div className="flex flex-row justify-center items-center w-full gap-3 p-5">
          <Label htmlFor="microphone">
            <Switch
              id="microphone"
              checked={isMicrophoneToggledOn}
              onCheckedChange={(isMicrophoneToggledOn) => {
                setIsMicrophoneToggledOn(isMicrophoneToggledOn);
              }}
            />{" "}
            Microphone
          </Label>
          <Label htmlFor="camera">
            <Switch
              id="camera"
              checked={isCameraToggledOn}
              onCheckedChange={(isCameraToggledOn) => {
                setIsCameraToggledOn(isCameraToggledOn);
              }}
            />{" "}
            Camera
          </Label>
        </div>
      </div>
      <Button
        variant="default"
        className="rounded cursor-pointer"
        onClick={() => {
          call?.join();
          setIsSetupCompleted(true);
        }}
      >
        Join Meeting
      </Button>
    </div>
  );
}
