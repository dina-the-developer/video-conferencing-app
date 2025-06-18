"use client";

import { useEffect, useState } from "react";
import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk";
export default function UpcomingMeeting() {
  const client = useStreamVideoClient();
  const [calls, setCalls] = useState<Call[]>([]);
  const now = new Date();

  useEffect(() => {
    const fetchCalls = async () => {
      if (!client) return;
      const result = await client.queryCalls({
        filter_conditions: {
          type: { $eq: "default" },
          starts_at: { $gt: now.toISOString() },
        },
        sort: [{ field: "starts_at", direction: -1 }],
        limit: 2,
        watch: true,
      });

      setCalls(result.calls);
      console.log(result);
    };

    fetchCalls();
  });

  if (!calls) {
    return <div className="text-white">Loading...</div>;
  }

  return (
    <div className="upcoming-meeting text-white">
      <div className="p-4 meeting-details bg-gray-800 rounded-xl shadow">
        <div className="bg-gray-900 rounded-xl p-4 mb-4">
          <h2 className="text-5xl text-center">
            {new Date().getHours()}:{new Date().getMinutes()}{" "}
            {new Date().getHours() < 12 ? "AM" : "PM"}
          </h2>
          <p className="text-center text-lg">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        </div>
        <h3 className="text-2xl">Upcoming Meeting</h3>
        <p className="text-md pb-5">Join us for our next meeting!</p>
        {calls.length === 0 ? (
          <p className="text-sm">No upcoming meetings found.</p>
        ) : (
          calls.map((call) => {
            const title = call.state.custom?.description || call.id;
            const startsAt = call.state.startsAt
              ? new Date(call.state.startsAt).toLocaleString()
              : "No start time";

            // Generate joinable call URL (customize as needed)
            const callUrl = `/meeting/${call.id}`;

            return (
              <div key={call.id} className="bg-gray-700 p-4 mb-4">
                <h2 className="text-xl font-semibold">{title}</h2>
                <p className="text-sm text-gray-300 pb-2">
                  Starts at: {startsAt}
                </p>
                <a
                  href={callUrl}
                  className="inline-block mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Join Call
                </a>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
