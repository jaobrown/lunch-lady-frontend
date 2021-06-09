import Link from "next/link";
import dayjs from "dayjs";
import CreateTransaction from "../CreateTransaction/CreateTransaction";
import SendMessageForm from "../SendMessageForm/SendMessageForm";
import formatMoney from "../../lib/formatMoney";

export default function Table({ loading, data }) {
  return (
    <div className="flex flex-col">
      <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
          <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Family Name
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Balance
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Last Messaged
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Add Transactions
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Message</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading && (
                  <tr className="">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 animate-pulse">
                      Loading Accounts...
                    </td>
                  </tr>
                )}
                {data &&
                  data.map((account, accountIdx) => {
                    const lastMessaged =
                      account.dateLastTextSent === "—"
                        ? "—"
                        : dayjs(account.dateLastTextSent).format("MMM DD");
                    return (
                      <tr
                        key={`${account.name}-${accountIdx}`}
                        className={
                          accountIdx % 2 === 0 ? "bg-white" : "bg-gray-50"
                        }
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          <Link href={`/account/${account.id}`}>
                            {account.name}
                          </Link>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                              ${
                                account.balance < 0
                                  ? "bg-red-100 text-red-800"
                                  : "bg-green-100 text-green-800"
                              }
                            `}
                          >
                            {formatMoney(account.balance)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {lastMessaged}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <CreateTransaction accountId={account.id} />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          {account.phone && (
                            <SendMessageForm
                              family={account.name}
                              phone={account.phone}
                              dateLastTextSent={account.dateLastTextSent}
                              initialMessage={"hello world"}
                              accountId={account.id}
                              needsTexted={account.needsTexted}
                            >
                              Message
                            </SendMessageForm>
                          )}
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
