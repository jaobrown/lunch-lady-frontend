import { Fragment, useEffect, useState } from "react";
import { gql } from "graphql-tag";
import { useQuery } from "@apollo/client";
import { SearchIcon } from "@heroicons/react/solid";
import Table from "../components/Table/Table";

export const ALL_ACCOUNTS_QUERY = gql`
  query ALL_ACCOUNTS_QUERY {
    allAccounts(sortBy: [name_ASC]) {
      id
      name
      phone
      balance
      needsTexted
      dateLastTextSent
    }
  }
`;

export default function Home() {
  const [accounts, setAccounts] = useState([]);
  const [q, setQ] = useState("");

  const { data, error, loading } = useQuery(ALL_ACCOUNTS_QUERY);

  useEffect(() => {
    setAccounts(data?.allAccounts || []);
  }, [data]);

  function search(rows) {
    return rows.filter((row) => row.name.toLowerCase().indexOf(q) > -1);
  }

  if (error) return "An error has occurred: " + error.message;

  return (
    <Fragment>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">All Accounts</h1>
        <div className="w-64">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 sr-only"
          >
            Search
          </label>
          <div className="flex rounded-md shadow-sm">
            <div className="relative flex items-stretch flex-grow focus-within:z-10">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </div>
              <input
                type="text"
                name="email"
                id="email"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                className="focus:ring-blue-500 focus:border-blue-500 block text- w-full rounded-md pl-10 sm:text-sm border-gray-300"
                placeholder="Jared Brown"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="py-4">
          <Table loading={loading} data={search(accounts)} />
        </div>
      </div>
    </Fragment>
  );
}
