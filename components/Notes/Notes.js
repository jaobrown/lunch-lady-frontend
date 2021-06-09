import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import dayjs from "dayjs";
import {
  InformationCircleIcon,
  PencilAltIcon,
  PencilIcon,
  QuestionMarkCircleIcon,
  XIcon,
  TrashIcon,
} from "@heroicons/react/outline";
import gql from "graphql-tag";
import useForm from "../../lib/useForm";
import { ACCOUNT_QUERY } from "../Account/Account";

export const CREATE_NOTE_MUTATION = gql`
  mutation CREATE_NOTE_MUTATION($content: String!, $accountId: ID!) {
    createNote(
      data: { content: $content, account: { connect: { id: $accountId } } }
    ) {
      id
    }
  }
`;

export const DELETE_NOTE_MUTATION = gql`
  mutation DELETE_NOTE_MUTATION($id: ID!) {
    deleteNote(id: $id) {
      id
    }
  }
`;

function Notes({ loading, data }) {
  const [editing, setEditing] = useState(false);
  const { inputs, handleChange, clear } = useForm({
    note: "",
  });

  const [createNote] = useMutation(CREATE_NOTE_MUTATION, {
    variables: {
      content: inputs.note,
      accountId: data?.Account?.id,
    },
    refetchQueries: [
      { query: ACCOUNT_QUERY, variables: { id: data?.Account?.id } },
    ],
  });

  const [deleteNote] = useMutation(DELETE_NOTE_MUTATION, {
    refetchQueries: [
      { query: ACCOUNT_QUERY, variables: { id: data?.Account?.id } },
    ],
  });

  const submit = (e) => {
    e.preventDefault();
    createNote();
    clear();
  };

  return (
    <section aria-labelledby="notes-title">
      <div className="bg-white shadow sm:rounded-lg sm:overflow-hidden">
        <div className="divide-y divide-gray-200">
          <div className="px-4 py-5 sm:px-6 flex items-center justify-between">
            <h2 id="notes-title" className="text-lg font-medium text-gray-900">
              Notes
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
          <div className="px-4 py-6 sm:px-6">
            <ul className="space-y-8">
              {loading ? (
                <p>loading...</p>
              ) : data.Account.notes.length ? (
                data.Account.notes.map((note) => (
                  <li key={note.id}>
                    <div className="flex space-x-3">
                      <div className="flex-shrink-0">
                        {editing ? (
                          <button
                            onClick={() => {
                              deleteNote({
                                variables: {
                                  id: note.id,
                                },
                              });
                            }}
                            className="bg-red-500 hover:bg-red-700 h-10 w-10 rounded-full flex items-center justify-center "
                          >
                            <TrashIcon
                              className="h-6 w-6 text-white"
                              aria-hidden="true"
                            />
                          </button>
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                            <InformationCircleIcon className="h-6 w-6 text-white" />
                          </div>
                        )}
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
                ))
              ) : (
                <p>Nothing yet 🙂</p>
              )}
            </ul>
          </div>
        </div>
        <div className="bg-gray-50 px-4 py-6 sm:px-6">
          <div className="flex space-x-3">
            <div className="flex-shrink-0">
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
                    required
                    value={inputs.note}
                    onChange={handleChange}
                  />
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <div className="group inline-flex items-start text-sm space-x-2 text-gray-500 hover:text-gray-900">
                    <QuestionMarkCircleIcon
                      className="flex-shrink-0 h-5 w-5 text-gray-400 group-hover:text-gray-500"
                      aria-hidden="true"
                    />
                    <span>These are just notes for you.</span>
                  </div>
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
  );
}

export default Notes;
