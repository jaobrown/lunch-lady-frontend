import React from "react";
import { useUser } from "../../lib/user";
import SignIn from "../SignIn/SignIn";

export default function RequireAuth({ children }) {
  const me = useUser();
  if (!me) return <SignIn />;
  return children;
}
