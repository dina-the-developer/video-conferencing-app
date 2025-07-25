"use client";
import { logout } from "@/app/actions/auth";
export default function Logout() {
  return (
    <button
      onClick={() => {
        logout();
      }}
      className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
    >
      Logout
    </button>
  );
}
