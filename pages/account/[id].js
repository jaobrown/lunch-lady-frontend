import Account from "../../components/Account/Account";

export default function AccountPage({ query }) {
  return <Account id={query.id} />;
}
