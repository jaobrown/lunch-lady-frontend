import "@fontsource/inter";
import "tailwindcss/tailwind.css";
import { ApolloProvider } from "@apollo/client";
import Page from "../components/Page/Page";
import withData from "../lib/withData";
import NextNprogress from "nextjs-progressbar";

function MyApp({ Component, pageProps, apollo }) {
  return (
    <ApolloProvider client={apollo}>
        <NextNprogress
          color="#5046e4"
          startPosition={0.3}
          stopDelayMs={200}
          height="2"
        />
        <Page>
          <Component {...pageProps} />
        </Page>
    </ApolloProvider>
  );
}

MyApp.getInitialProps = async function ({ Component, ctx }) {
  let pageProps = {};
  if (Component.getInitialProps) {
    pageProps = await Component.getInitialProps(ctx);
  }
  pageProps.query = ctx.query;
  return { pageProps };
};

export default withData(MyApp);
