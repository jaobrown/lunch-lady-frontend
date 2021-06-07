import gql from "graphql-tag";
import { useQuery } from "@apollo/client";
import Timeline from "../components/Timeline/Timeline";

const ACCOUNT_QUERY = gql`
  query ACCOUNT_QUERY {
    Account(where: { id: "608380edbbe567add6860f7c" }) {
      name
      balance
      phone
      timeline {
        textMessage
        amount
        timestamp
      }
    }
  }
`;

export default function Account() {
  const { data, error, loading } = useQuery(ACCOUNT_QUERY);

  if (loading) return "Loading...";

  if (error) return "An error has occurred: " + error.message;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            {data.Account.name}
          </h2>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <button
            type="button"
            className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Message
          </button>
        </div>
      </div>
      <section className="py-10">
        <div className="grid grid-cols-2 gap-10">
          <div className="bg-white rounded p-10">
            <h2 className="mb-4 font-bold text-2xl">Timeline</h2>
            <Timeline events={data.Account.timeline} />
          </div>
        </div>
      </section>
      <div>
        <pre>{JSON.stringify(data, 0, 2, null)}</pre>
      </div>
    </div>
  );
}
