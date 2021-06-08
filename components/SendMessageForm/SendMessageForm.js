import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XIcon } from "@heroicons/react/outline";
import { useMutation } from "@apollo/client";
import { gql } from "graphql-tag";
import useForm from "../../lib/useForm";
import formatPhone from "../../lib/formatPhone";
import { ACCOUNT_QUERY } from "../Account/Account";

const SEND_TEXT_MESSAGE_MUTATION = gql`
  mutation SEND_TEXT_MESSAGE_MUTATION($accountId: ID!, $textMessage: String!) {
    sendTextMessage(textMessage: $textMessage, accountId: $accountId) {
      id
    }
  }
`;

export default function SendMessageForm({
  phone = "",
  family = "family",
  initialMessage,
  dateLastTextSent,
  accountId,
  needsTexted,
  children,
}) {
  const [open, setOpen] = useState(false);
  const { inputs, handleChange } = useForm({
    message: initialMessage,
  });

  const [sendMessage] = useMutation(SEND_TEXT_MESSAGE_MUTATION, {
    variables: {
      textMessage: inputs.message,
      accountId: accountId,
    },
    refetchQueries: [{ query: ACCOUNT_QUERY, variables: { id: accountId } }],
  });

  // need to send phone number + message to api
  const submit = (e) => {
    e.preventDefault();
    sendMessage();
    setOpen(false);
  };

  return (
    <div className="relative">
      <button
        disabled={!needsTexted}
        onClick={() => setOpen(true)}
        className="text-blue-600 hover:text-blue-900 disabled:cursor-not-allowed disabled:opacity-30"
      >
        {children}
      </button>
      <Transition.Root show={open} as={Fragment}>
        <Dialog
          as="div"
          static
          className="fixed inset-0 overflow-hidden z-50"
          open={open}
          onClose={setOpen}
        >
          <div className="absolute inset-0 overflow-hidden">
            <Dialog.Overlay className="absolute inset-0" />

            <div className="fixed inset-y-0 right-0 pl-10 max-w-full flex">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <div className="w-screen max-w-md">
                  <div className="h-full divide-y divide-gray-200 flex flex-col bg-white shadow-xl">
                    <form className="h-full" onSubmit={submit}>
                      <div className="min-h-0 flex-1 flex flex-col py-6 overflow-y-scroll">
                        <div className="px-4 sm:px-6">
                          <div className="flex items-start justify-between">
                            <Dialog.Title className="text-lg font-medium text-gray-900 flex items-baseline flex-wrap">
                              {family}
                              <span className="text-sm text-gray-400 inline-block ml-2">
                                {formatPhone(phone)}
                              </span>
                              <span className="block w-full flex-shrink-0 text-sm text-gray-400">
                                Last messaged {dateLastTextSent}
                              </span>
                            </Dialog.Title>
                            <div className="ml-3 h-7 flex items-center">
                              <button
                                type="button"
                                className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                onClick={() => setOpen(false)}
                              >
                                <span className="sr-only">Close panel</span>
                                <XIcon className="h-6 w-6" aria-hidden="true" />
                              </button>
                            </div>
                          </div>
                        </div>
                        <div className="mt-6 relative flex-1 px-4 sm:px-6">
                          {/* Replace with your content */}
                          <div>
                            <label
                              htmlFor="message"
                              className="block text-sm font-medium text-gray-900"
                            >
                              Message
                            </label>
                            <div className="mt-1">
                              <textarea
                                id="message"
                                name="message"
                                required
                                rows={4}
                                className="block w-full shadow-sm sm:text-sm focus:ring-blue-500 focus:border-blue-500 border-gray-300 rounded-md"
                                value={inputs.message}
                                onChange={handleChange}
                              />
                            </div>
                          </div>
                          {/* /End replace */}
                        </div>
                      </div>
                      <div className="flex-shrink-0 px-4 py-4 flex justify-end">
                        <button
                          type="button"
                          className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          onClick={() => setOpen(false)}
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="ml-4 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          Send
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </div>
  );
}
