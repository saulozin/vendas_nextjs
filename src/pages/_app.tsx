import type { AppProps } from 'next/app';
import 'bulma/css/bulma.css';
//theme
import "primereact/resources/themes/md-light-indigo/theme.css";
//core
import "primereact/resources/primereact.min.css";
import 'primeflex/primeflex.css';
import 'components/common/loader/loader.css';
import { SessionProvider } from "next-auth/react";

export default function App({ 
  Component, 
  pageProps: {session, ...pageProps},
}: AppProps) {
  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
    </SessionProvider>
  )
}
