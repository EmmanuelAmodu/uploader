import { SessionProvider } from "next-auth/react";
import "../styles/globals.css";
import PropTypes from "prop-types";
export default function _App({ Component, pageProps }) {
  return (
    <SessionProvider session={pageProps.session}>
      <Component {...pageProps} />
    </SessionProvider>
  );
}

_App.propTypes = {
  Component: PropTypes.elementType.isRequired,
  pageProps: PropTypes.object.isRequired,
};
