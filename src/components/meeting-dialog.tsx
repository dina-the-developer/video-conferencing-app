import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
} from "@/components/ui/dialog";
import { meetingDialogType } from "@/constants";
import { Button } from "./ui/button";
export default function MeetingDialog({
  isOpen,
  onClose,
  className,
  title,
  children,
  buttonText,
  handleClick,
  icon,
}: meetingDialogType) {
  return (
    <div className="flex flex-col">
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogOverlay className="DialogOverlay fixed inset-0 bg-black/30">
          <DialogContent
            className={`DialogContent bg-gray-950 border-0 text-white ${className}`}
          >
            <DialogHeader>
              {icon && (
                <div className="flex items-center justify-center mb-2">
                  {icon}
                </div>
              )}
              <DialogTitle className="text-2xl text-white text-center">
                {title}
              </DialogTitle>
              <DialogDescription></DialogDescription>
            </DialogHeader>
            <div className="flex flex-col">{children}</div>
            <DialogFooter className="flex justify-end">
              <Button
                variant="outline"
                className="rounded text-black cursor-pointer w-full"
                onClick={handleClick}
              >
                {buttonText}
              </Button>
            </DialogFooter>
          </DialogContent>
        </DialogOverlay>
      </Dialog>
    </div>
  );
}
