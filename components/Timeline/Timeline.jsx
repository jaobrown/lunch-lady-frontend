/* This example requires Tailwind CSS v2.0+ */
import { CashIcon, UserIcon, ChatIcon } from "@heroicons/react/solid";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Timeline({ events }) {
  return (
    <div className="flow-root">
      <ul className="-mb-8">
        {events.map((event, eventIdx) => {
          let eventDate = new Date(event.timestamp);
          let day = eventDate.getDate();
          let month = eventDate.getMonth();
          return (
            <li key={`${event.timestamp}-${eventIdx}`}>
              <div className="relative pb-8">
                {eventIdx !== events.length - 1 ? (
                  <span
                    className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                    aria-hidden="true"
                  />
                ) : null}
                <div className="relative flex space-x-3">
                  <div>
                    <span
                      className={classNames(
                        event.amount ? `bg-green-500` : `bg-blue-500`,
                        "h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white"
                      )}
                    >
                      {event.amount ? (
                        <CashIcon
                          className="h-5 w-5 text-white"
                          aria-hidden="true"
                        />
                      ) : (
                        <ChatIcon
                          className="h-5 w-5 text-white"
                          aria-hidden="true"
                        />
                      )}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                    <div>
                      {event.amount ? (
                        <p className="text-sm text-gray-500">
                          <strong className="text-gray-900 block">
                            Transaction
                          </strong>
                          {event.amount}
                        </p>
                      ) : (
                        <p className="text-sm text-gray-500">
                          <strong className="text-gray-900 block">
                            Message sent
                          </strong>
                          <i className="font-italic">{event.textMessage}</i>
                        </p>
                      )}
                    </div>
                    <div className="text-right text-sm whitespace-nowrap text-gray-500">
                      <time dateTime={eventDate}>
                        {month} {day}
                      </time>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
