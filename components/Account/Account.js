import { Fragment } from "react";
import Link from "next/link";
import gql from "graphql-tag";
import { useMutation, useQuery } from "@apollo/client";
import Timeline from "../Timeline/Timeline";
import formatMoney from "../../lib/formatMoney";
import formatPhone from "../../lib/formatPhone";
import SendMessageForm from "../SendMessageForm/SendMessageForm";
import dayjs from "dayjs";
import { InformationCircleIcon, PencilAltIcon } from "@heroicons/react/outline";
import useForm from "../../lib/useForm";

export const ACCOUNT_QUERY = gql`
  query ACCOUNT_QUERY($id: ID!) {
    Account(where: { id: $id }) {
      id
      name
      balance
      phone
      dateLastTextSent
      timeline {
        textMessage
        amount
        timestamp
      }
      notes {
        content
        timestamp
        id
      }
    }
  }
`;

export const CREATE_NOTE_MUTATION = gql`
  mutation CREATE_NOTE_MUTATION($content: String!, $accountId: ID!) {
    createNote(
      data: { content: $content, account: { connect: { id: $accountId } } }
    ) {
      id
    }
  }
`;

export default function Account({ id }) {
  const { data, error, loading } = useQuery(ACCOUNT_QUERY, {
    variables: {
      id,
    },
  });

  const { inputs, handleChange, clear } = useForm({
    note: "",
  });

  const [createNote] = useMutation(CREATE_NOTE_MUTATION, {
    variables: {
      content: inputs.note,
      accountId: data?.Account?.id,
    },
    refetchQueries: [{ query: ACCOUNT_QUERY, variables: { id } }],
  });

  // need to send phone number + message to api
  const submit = (e) => {
    e.preventDefault();
    createNote();
    clear();
  };

  if (loading) return "Loading...";

  if (error) return "An error has occurred: " + error.message;

  return (
    <Fragment>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 md:flex md:items-center md:justify-between md:space-x-5 lg:max-w-7xl lg:px-8">
        <div className="flex items-center space-x-5">
          {/* <div className="flex-shrink-0">
            <div className="relative">
              <img
                className="h-16 w-16 rounded-full"
                src="https://images.unsplash.com/photo-1463453091185-61582044d556?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=8&w=1024&h=1024&q=80"
                alt=""
              />
              <span
                className="absolute inset-0 shadow-inner rounded-full"
                aria-hidden="true"
              />
            </div>
          </div> */}
          <div>
            <Link href={"/"}>Back</Link>
            <h1 className="text-2xl font-bold text-gray-900">
              {data.Account.name}
            </h1>
            {/* <p className="text-sm font-medium text-gray-500">
              Applied for{" "}
              <a href="#" className="text-gray-900">
                Front End Developer
              </a>{" "}
              on <time dateTime="2020-08-25">August 25, 2020</time>
            </p> */}
          </div>
        </div>
        <div className="mt-6 flex flex-col-reverse justify-stretch space-y-4 space-y-reverse sm:flex-row-reverse sm:justify-end sm:space-x-reverse sm:space-y-0 sm:space-x-3 md:mt-0 md:flex-row md:space-x-3">
          <SendMessageForm
            family={data.Account.name}
            phone={data.Account.phone}
            dateLastTextSent={dayjs(data.Account.dateLastTextSent).format(
              "MMM DD"
            )}
            initialMessage={"hello world"}
            accountId={data.Account.id}
            needsTexted={true}
          >
            <span className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-blue-500">
              Message
            </span>
          </SendMessageForm>
        </div>
      </div>
      <div className="mt-8 max-w-3xl mx-auto grid grid-cols-1 gap-6 sm:px-6 lg:max-w-7xl lg:grid-flow-col-dense lg:grid-cols-3">
        <div className="space-y-6 lg:col-start-1 lg:col-span-2">
          {/* Description list*/}
          <section aria-labelledby="applicant-information-title">
            <div className="bg-white shadow sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h2
                  id="applicant-information-title"
                  className="text-lg leading-6 font-medium text-gray-900"
                >
                  Account Information
                </h2>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  Personal details and balance info.
                </p>
              </div>
              <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">
                      Current Balance
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {formatMoney(data.Account.balance)}
                    </dd>
                  </div>
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">Phone</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {formatPhone(data.Account.phone)}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </section>

          {/* Comments*/}
          <section aria-labelledby="notes-title">
            <div className="bg-white shadow sm:rounded-lg sm:overflow-hidden">
              <div className="divide-y divide-gray-200">
                <div className="px-4 py-5 sm:px-6">
                  <h2
                    id="notes-title"
                    className="text-lg font-medium text-gray-900"
                  >
                    Notes
                  </h2>
                </div>
                <div className="px-4 py-6 sm:px-6">
                  <ul className="space-y-8">
                    {data.Account.notes.map((note) => (
                      <li key={note.id}>
                        <div className="flex space-x-3">
                          <div className="flex-shrink-0">
                            {/* <img
                            className="h-10 w-10 rounded-full"
                            src={`https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixqx=sgpmfURmTW&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80`}
                            alt=""
                          /> */}
                            <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                              <InformationCircleIcon className="h-6 w-6 text-white" />
                            </div>
                          </div>
                          <div>
                            <div className="text-sm">
                              <a href="#" className="font-medium text-gray-900">
                                Lunch Lady
                              </a>
                            </div>
                            <div className="mt-1 text-sm text-gray-700">
                              <p>{note.content}</p>
                            </div>
                            <div className="mt-2 text-sm space-x-2">
                              <span className="text-gray-500 font-medium">
                                {dayjs(note.timestamp).format("MMM DD")}
                              </span>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-6 sm:px-6">
                <div className="flex space-x-3">
                  <div className="flex-shrink-0">
                    {/* <img
                      className="h-10 w-10 rounded-full"
                      src="https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixqx=sgpmfURmTW&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                      alt=""
                    /> */}
                    <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                      <PencilAltIcon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <form onSubmit={submit}>
                      <div>
                        <label htmlFor="note" className="sr-only">
                          About
                        </label>
                        <textarea
                          id="note"
                          name="note"
                          rows={3}
                          className="shadow-sm block w-full focus:ring-blue-500 focus:border-blue-500 sm:text-sm border border-gray-300 rounded-md"
                          placeholder="Add a note"
                          value={inputs.note}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="mt-3 flex items-center justify-between">
                        {/* <a
                          href="#"
                          className="group inline-flex items-start text-sm space-x-2 text-gray-500 hover:text-gray-900"
                        >
                          <QuestionMarkCircleIcon
                            className="flex-shrink-0 h-5 w-5 text-gray-400 group-hover:text-gray-500"
                            aria-hidden="true"
                          />
                          <span>Some HTML is okay.</span>
                        </a> */}
                        <button
                          type="submit"
                          className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          Add Note
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        <section
          aria-labelledby="timeline-title"
          className="lg:col-start-3 lg:col-span-1"
        >
          <div className="bg-white px-4 py-5 shadow sm:rounded-lg sm:px-6">
            <h2
              id="timeline-title"
              className="text-lg font-medium text-gray-900"
            >
              Timeline
            </h2>

            {/* Activity Feed */}
            <div className="mt-6 lg:max-h-96 lg:overflow-y-scroll">
              <Timeline events={data.Account.timeline} />
            </div>
            {/* <div className="mt-6 flex flex-col justify-stretch">
              <button
                type="button"
                className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Advance to offer
              </button>
            </div> */}
          </div>
        </section>
      </div>
    </Fragment>
  );
}
