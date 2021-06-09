import React from "react";
import gql from "graphql-tag";
import { useMutation, useQuery } from "@apollo/client";
import useForm from "../../lib/useForm";
import CurrencyInput from "../CurrencyInput/CurrencyInput";
import { ACCOUNT_QUERY } from "../Account/Account";

export const CREATE_TRANSACTION_MUTATION = gql`
  mutation CREATE_TRANSACTION_MUTATION($amount: Int!, $accountId: ID!) {
    createTransaction(
      data: { amount: $amount, account: { connect: { id: $accountId } } }
    ) {
      id
      account {
        id
        balance
      }
    }
  }
`;

function CreateTransaction({ accountId }) {
  const { inputs, handleChange, reset } = useForm({
    action: "-",
    amount: "",
  });

  const [createTransaction] = useMutation(CREATE_TRANSACTION_MUTATION, {
    refetchQueries: [{ query: ACCOUNT_QUERY, variables: { id: accountId } }],
  });

  async function submit(e) {
    e.preventDefault();
    const formattedAmount =
      Number(inputs.amount.replace(/[^0-9.-]+/g, "")) *
      (inputs.action === "-" ? -100 : 100);
    await createTransaction({
      variables: {
        accountId,
        amount: formattedAmount,
      },
    });
    reset();
  }

  return (
    <form onSubmit={submit} className="w-48">
      <div className="mt-1 flex focus-within:z-10 relative rounded-md shadow-sm">
        <div className="absolute inset-y-0 left-0 flex items-center">
          <label htmlFor={`action-${accountId}`} className="sr-only">
            action
          </label>
          <select
            value={inputs.action}
            onChange={handleChange}
            id={`action-${accountId}`}
            name="action"
            className="focus:ring-blue-500 focus:border-blue-500 h-full py-0 pl-3 pr-7 border-transparent bg-transparent text-gray-500 sm:text-sm rounded-md"
          >
            <option>-</option>
            <option>+</option>
          </select>
        </div>
        <CurrencyInput
          type="text"
          name="amount"
          id={`amount-${accountId}`}
          value={inputs.amount}
          onChange={handleChange}
          className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-16 sm:text-sm border-gray-300 rounded-l-md"
          placeholder="$3.50"
        />
        <button className="-ml-px relative inline-flex items-center space-x-2 px-4 py-2 border border-gray-300 text-sm font-medium rounded-r-md text-gray-700 bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500">
          <span>Add</span>
        </button>
      </div>
    </form>
  );
}

export default CreateTransaction;
