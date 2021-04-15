import '@/styles/globals.css';

import App from "next/app";
import Layout from '@/components/Layout';
import { getSections } from "@/lib/cms";

function MyApp({ Component, pageProps }) {
  const { sections } = pageProps;
  const navigation = [
    { name: 'Home', href: '/', current: true },

    {
      name: 'Documentation',
      current: false,
      children: sections,
    },

    { name: 'GitHub', href: 'https://github.com/cueblox/blox', current: false },

  ]
  return (
    <Layout navigation={navigation}>
      <Component {...pageProps} />
    </Layout>

  )
}


// getInitialProps disables automatic static optimization for pages that don't
// have getStaticProps. So article, category and home pages still get SSG.
// Hopefully we can replace this with getStaticProps once this issue is fixed:
// https://github.com/vercel/next.js/discussions/10949
MyApp.getInitialProps = async (ctx) => {
  // Calls page's `getInitialProps` and fills `appProps.pageProps`
  const appProps = await App.getInitialProps(ctx);
  // Fetch global site settings from Strapi
  const sections = await getSections();
  // Pass the data to our page via props
  return { ...appProps, pageProps: { sections } };
};

export default MyApp;