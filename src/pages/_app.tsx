import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { api } from "~/utils/api";
import { ConfigProvider, theme } from "antd";
import { Layout } from "~/components/Layout";
import "~/styles/globals.css";

const MyApp: AppType<{ session: Session | null }> = ({ Component, pageProps: { session, ...pageProps } }) => {
  return (
    <SessionProvider session={session}>
      <ConfigProvider theme={themeConfig}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ConfigProvider>
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
