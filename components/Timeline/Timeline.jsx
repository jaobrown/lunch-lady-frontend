import * as React from "react";
import { CashIcon, ChatIcon, TrashIcon } from "@heroicons/react/solid";
import dayjs from "dayjs";
import gql from "graphql-tag";
import { useMutation, useQuery } from "@apollo/client";
import formatMoney from "../../lib/formatMoney";
import { ACCOUNT_QUERY } from "../Account/Account";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export const DELETE_TRANSACTION_MUTATION = gql`
  mutation DELETE_TRANSACTION_MUTATION($id: ID!) {
    deleteTransaction(id: $id) {
      id
    }
  }
`;

export default function Timeline({ events, editing, accountId }) {
  const [isEditing, setIsEditing] = React.useState(false);

  React.useEffect(() => {
    setIsEditing(editing);
  }, [editing]);

  const [deleteTransaction] = useMutation(DELETE_TRANSACTION_MUTATION, {
    refetchQueries: [{ query: ACCOUNT_QUERY, variables: { id: accountId } }],
  });

  return (
    <div className="flow-root">
      <ul className="-mb-8">
        {events.map((event, eventIdx) => {
          const eventDateTime = new Date(event.timestamp);
          const formattedDate = dayjs(event.timestamp).format("MMM D");
          return (
            <li
              key={`${event.timestamp}-${eventIdx}`}
              className={`${isEditing && event.textMessage ? "hidden" : ""}`}
            >
              <div className="relative pb-8">
                {eventIdx !== events.length - 1 ? (
                  <span
                    className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                    aria-hidden="true"
                  />
                ) : null}
                <div className="relative flex space-x-3">
                  <div>
                    {isEditing ? (
                      <button
                        onClick={() => {
                          deleteTransaction({
                            variables: {
                              id: event.id,
                            },
                          });
                        }}
                        className="bg-red-500 hover:bg-red-700 h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white"
                      >
                        <TrashIcon
                          className="h-5 w-5 text-white"
                          aria-hidden="true"
                        />
                      </button>
                    ) : (
                      <span
                        className={classNames(
                          event.textMessage ? `bg-blue-500` : `bg-green-500`,
                          "h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white"
                        )}
                      >
                        {event.textMessage ? (
                          <ChatIcon
                            className="h-5 w-5 text-white"
                            aria-hidden="true"
                          />
                        ) : (
                          <CashIcon
                            className="h-5 w-5 text-white"
                            aria-hidden="true"
                          />
                        )}
                      </span>
                    )}
                  </div>
                  <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                    <div>
                      {event.textMessage ? (
                        <p className="text-sm text-gray-500">
                          <strong className="text-gray-900 block">
                            Message sent
                          </strong>
                          <i className="font-italic">{event.textMessage}</i>
                        </p>
                      ) : (
                        <p className="text-sm text-gray-500">
                          <strong className="text-gray-900 block">
                            Transaction
                          </strong>
                          {formatMoney(event.amount)}
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
