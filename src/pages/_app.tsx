import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { api } from "~/utils/api";
import { ConfigProvider, theme } from "antd";
import "~/styles/globals.css";
import { Provider } from "react-redux";
import { store } from "~/store/store";
import { Layout } from "~/components/Layout";

const MyApp: AppType<{ session: Session | null }> = ({ Component, pageProps: { session, ...pageProps } }) => {
  return (
    <SessionProvider session={session}>
      <Provider store={store}>
        <ConfigProvider theme={themeConfig}>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </ConfigProvider>
      </Provider>
    </SessionProvider>
  )
};

const themeConfig = {
  algorithm: theme.darkAlgorithm,
  token: {
    colorPrimary: '#7165F6',
  },
}

export default api.withTRPC(MyApp);
