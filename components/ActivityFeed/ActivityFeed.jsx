import React, { useState } from "react";
import Timeline from "../Timeline/Timeline";
import { PencilIcon, XIcon } from "@heroicons/react/outline";

function ActivityFeed({ loading, events, id }) {
  const [editing, setEditing] = useState(false);
  return (
    <section
      aria-labelledby="timeline-title"
      className="lg:col-start-3 lg:col-span-1"
    >
      <div className="bg-white px-4 py-5 shadow sm:rounded-lg sm:px-6">
        <div className="flex items-center justify-between">
          <h2 id="timeline-title" className="text-lg font-medium text-gray-900">
            Timeline
          </h2>
          <div className="group">
            <button
              onClick={() => setEditing(() => !editing)}
              className="group-hover:bg-gray-100 h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white -mr-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {editing ? (
                <XIcon className="h-5 w-5 text-gray-300 group-hover:text-gray-400" />
              ) : (
                <PencilIcon className="h-5 w-5 text-gray-300 group-hover:text-gray-400" />
              )}
            </button>
          </div>
        </div>

        {/* Activity Feed */}
        <div className="mt-6 lg:max-h-96 lg:overflow-y-scroll">
          {loading ? (
            <p>loading...</p>
          ) : (
            <Timeline events={events} editing={editing} accountId={id} />
          )}
        </div>
      </div>
    </section>
  );
}

export default ActivityFeed;
