import { Copy } from "lucide-react";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { CallCardProps } from "@/constants";

export default function CallCard({
  title,
  date,
  isPreviousMeeting,
  link,
  handleClick,
  buttonText,
  icon,
}: CallCardProps) {
  return (
    <div className="flex flex-col gap-3 p-4 bg-gray-800 text-white rounded shadow">
      {icon}
      <h1 className="text-xl">{title}</h1>
      <h4 className="text-sm">{date}</h4>
      <div className="flex flex-col justify-between gap-3">
        {!isPreviousMeeting && (
          <div className="flex gap-2">
            <Button
              onClick={handleClick}
              variant="default"
              className="rounded bg-[#0e78f9] hover:bg-[#0e78f6] px-6 cursor-pointer"
            >
              {buttonText}
            </Button>
            <Button
              onClick={() => {
                navigator.clipboard.writeText(link);
                toast("Meeting link Copied");
              }}
              variant="outline"
              className="rounded bg-gray-300 hover:bg-gray-200 px-6 cursor-pointer text-black"
            >
              <Copy className="mr-2" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
