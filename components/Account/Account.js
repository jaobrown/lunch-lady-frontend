import { Fragment } from "react";
import Link from "next/link";
import gql from "graphql-tag";
import { useQuery } from "@apollo/client";
import dayjs from "dayjs";
import formatMoney from "../../lib/formatMoney";
import formatPhone from "../../lib/formatPhone";
import SendMessageForm from "../SendMessageForm/SendMessageForm";
import Notes from "../Notes/Notes";
import ActivityFeed from "../ActivityFeed/ActivityFeed";
import AccountDetails from "../AccountDetails/AccountDetails";

export const ACCOUNT_QUERY = gql`
  query ACCOUNT_QUERY($id: ID!) {
    Account(where: { id: $id }) {
      id
      name
      balance
      phone
      dateLastTextSent
      timeline {
        id
        textMessage
        amount
        timestamp
      }
      notes {
        id
        content
        timestamp
        id
      }
    }
  }
`;

export default function Account({ id }) {
  const { data, error, loading } = useQuery(ACCOUNT_QUERY, {
    variables: {
      id,
    },
  });

  if (error) return "An error has occurred: " + error.message;

  return (
    <Fragment>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 md:flex md:items-center md:justify-between md:space-x-5 lg:max-w-7xl lg:px-8">
        <div className="flex items-center space-x-5">
          <div>
            <Link href={"/"}>&larr; Back</Link>
            <h1 className="text-2xl font-bold text-gray-900">
              {loading ? <p>loading...</p> : data.Account.name}
            </h1>
          </div>
        </div>
        <div className="mt-6 flex flex-col-reverse justify-stretch space-y-4 space-y-reverse sm:flex-row-reverse sm:justify-end sm:space-x-reverse sm:space-y-0 sm:space-x-3 md:mt-0 md:flex-row md:space-x-3">
          <SendMessageForm
            family={data?.Account.name}
            phone={data?.Account.phone}
            dateLastTextSent={
              dayjs(data?.Account.dateLastTextSent).format("MMM DD") || "—"
            }
            initialMessage={"hello world"}
            accountId={data?.Account.id}
            needsTexted={data?.Account.phone ? true : false}
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
          <AccountDetails
            loading={loading}
            phone={data?.Account.phone}
            balance={data?.Account.balance}
          />

          {/* Comments*/}
          <Notes loading={loading} data={data} />
        </div>

        <ActivityFeed
          loading={loading}
          events={data?.Account.timeline}
          id={id}
        />
      </div>
    </Fragment>
  );
}
