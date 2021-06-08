import { Fragment, useState } from "react";
import { Switch } from "@headlessui/react";
import Table from "../components/Table/Table";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Home() {
  const [enabled, setEnabled] = useState(true);
  return (
    <Fragment>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 flex justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">
          Account Balances
        </h1>
        <Switch.Group
          as="div"
          className="flex items-center justify-between flex-grow max-w-lg"
        >
          <Switch.Label as="span" className="flex-grow flex flex-col" passive>
            <span className="text-sm font-medium text-gray-900">Show All</span>
            <span className="text-sm text-gray-500">
              By default, only people who need to be texted will be shown.
            </span>
          </Switch.Label>
          <Switch
            checked={enabled}
            onChange={setEnabled}
            className={classNames(
              enabled ? "bg-blue-600" : "bg-gray-200",
              "relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            )}
          >
            <span className="sr-only">Filter</span>
            <span
              aria-hidden="true"
              className={classNames(
                enabled ? "translate-x-5" : "translate-x-0",
                "pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200"
              )}
            />
          </Switch>
        </Switch.Group>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="py-4">
          <Table all={enabled} />
        </div>
      </div>
    </Fragment>
  );
}
