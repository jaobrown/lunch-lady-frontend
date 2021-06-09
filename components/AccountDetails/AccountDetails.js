import React from "react";
import formatMoney from "../../lib/formatMoney";
import formatPhone from "../../lib/formatPhone";

function AccountDetails({ balance, phone, loading }) {
  return (
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
            Contact details and balance info.
          </p>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
          <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">
                Current Balance
              </dt>
              <dd className="mt-1 text-sm text-gray-900">
                {loading ? <p>loading...</p> : formatMoney(balance)}
              </dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Phone</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {loading ? <p>loading...</p> : formatPhone(phone)}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}

export default AccountDetails;
