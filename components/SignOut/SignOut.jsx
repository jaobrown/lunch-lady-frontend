import * as React from "react";
import { useMutation } from "@apollo/client";
import gql from "graphql-tag";
import { CURRENT_USER_QUERY } from "../../lib/user";

const SIGNOUT_MUTATION = gql`
  mutation {
    endSession
  }
`;

export default function SignOut({ className, children }) {
  const [signout] = useMutation(SIGNOUT_MUTATION, {
    refetchQueries: [{ query: CURRENT_USER_QUERY }],
  });

  return (
    <button type="button" onClick={signout} className={className}>
      {children}
    </button>
  );
}
