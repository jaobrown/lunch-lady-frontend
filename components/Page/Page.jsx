import RequireAuth from "../RequireAuth/RequireAuth";

export default function Page({ children }) {
  return <RequireAuth>{children}</RequireAuth>;
}
