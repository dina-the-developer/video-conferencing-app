import {
  CalendarClock,
  CalendarPlus,  
  CalendarCheck,
  Link,
  Disc,
  Home,
  StepBackIcon,
} from "lucide-react";
import { LucideIcon } from "lucide-react"; // Import the type for proper typing

export type MenuLinks = {
  id: string;
  title: string;
  path: string;
  icon: LucideIcon;
};

export const menuLinks: MenuLinks[] = [
  {
    id: "home",
    title: "Home",
    path: "/",
    icon: Home,
  },
  {
    id: "previous",
    title: "Previous",
    path: "/previous",
    icon: StepBackIcon,
  },
  {
    id: "upcoming",
    title: "Upcoming",
    path: "/upcoming",
    icon: CalendarClock,
  },
  {
    id: "recordings",
    title: "Recordings",
    path: "/recordings",
    icon: Disc,
  },
];

export type SessionPayload = {
  id: string;
  username: string;
  email: string;
  expiresAt: string;
};

export type UserPayload = {
  id: string;
  name: string;
  email: string;
  image: string;
  role: string;
};

export const user: UserPayload = {
  id: "b012-ec6ab82262db",
  name: "John Doe",
  email: "",
  image: "/icons/circle-user.png",
  role: "admin",
};

export type InitialValuesType = {
  date: Date;
  description: string;
  link: string;
};

export const initialValues: InitialValuesType = {
  date: new Date(),
  description: "",
  link: "",
};

export type MeetingState =
  | "isScheduleMeeting"
  | "isJoinMeeting"
  | "isInstantMeeting"
  | "isAllRecordings";

export type MeetingType = {
  id: number;
  name: string;
  description: string;
  icon: LucideIcon;
  buttonText: string;
  state: MeetingState;
  className: string;
};

export const meetingTypes: MeetingType[] = [
  {
    id: 1,
    name: "New Meeting",
    description: "Create a new meeting.",
    icon: CalendarPlus,
    buttonText: "Create",
    state: "isInstantMeeting",
    className: "",
  },
  {
    id: 2,
    name: "Join Meeting",
    description: "Join via invitation link.",
    icon: Link,
    buttonText: "Join",
    state: "isJoinMeeting",
    className: "",
  },
  {
    id: 3,
    name: "Schedule Meeting",
    description: "Schedule a new meeting.",
    icon: CalendarCheck,
    buttonText: "Schedule",
    state: "isScheduleMeeting",
    className: "col-start-1 row-start-2",
  },
  {
    id: 4,
    name: "View Recordings",
    description: "Listen to all recordings.",
    icon: Disc,
    buttonText: "Listen",
    state: "isAllRecordings",
    className: "col-start-2 row-start-2",
  },
];

export type meetingDialogType = {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
  title: string;
  children?: React.ReactNode;
  buttonText: string;
  handleClick: () => void;
  icon?: React.ReactNode;
};

export interface CallCardProps {
  title: string;
  date: string;
  isPreviousMeeting: boolean;
  link: string;
  handleClick: () => void;
  buttonText: string;
  icon: LucideIcon;
}

// export type callCardProps = {
//   title: string;
//   date: string;
//   isPreviousMeeting: boolean;
//   link: string;
//   handleClick: () => void;
//   buttonText: string;
//   icon: LucideIcon;
// };
