import { CashIcon, ChatIcon } from "@heroicons/react/solid";
import dayjs from "dayjs";
import formatMoney from "../../lib/formatMoney";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Timeline({ events }) {
  return (
    <div className="flow-root">
      <ul className="-mb-8">
        {events.map((event, eventIdx) => {
          const eventDateTime = new Date(event.timestamp);
          const formattedDate = dayjs(event.timestamp).format("MMM D");
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
                          {formatMoney(event.amount)}
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
                      <time dateTime={eventDateTime}>{formattedDate}</time>
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
