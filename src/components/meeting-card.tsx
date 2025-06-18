"use client";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";
import { Button } from "./ui/button";

interface MeetingCardProps {
  className: string;
  title: string;
  description: string;
  icon: ReactNode;
  handleClick: () => void;
  buttonText: string;
}
export default function MeetingCard({
  className,
  title,
  description,
  icon,
  handleClick,
  buttonText,
}: MeetingCardProps) {
  return (
    <div
      className={cn(
        "meeting-list bg-gray-700 text-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 group hover:bg-gradient-to-br hover:from-gray-700 hover:to-gray-800 cursor-pointer",
        className
      )}
      onClick={handleClick}
    >
      <div className="relative w-[35] h-[35] p-1">
        <span>{icon}</span>
      </div>
      <h2 className="text-xl pt-16 font-semibold">{title}</h2>
      <p>{description}</p>
      <Button
        className="mt-4 px-6 py-2 rounded cursor-pointer"
        variant="default"
      >
        {buttonText}
      </Button>
    </div>
  );
}
