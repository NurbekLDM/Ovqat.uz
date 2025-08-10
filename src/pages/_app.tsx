import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { UserProvider } from "@/context/UserContext";
import Navbar from "@/components/Navbar_new";
import { NotificationContainer } from "@/components/Notification";
import { useNotification } from "@/hooks/useNotification";
import { NextComponentType, NextPageContext } from "next";

function AppContent({
  Component,
  pageProps,
}: {
  Component: NextComponentType<NextPageContext>;
  pageProps: Record<string, unknown>;
}) {
  const { notifications, removeNotification } = useNotification();

  return (
    <>
      <Navbar />
      <Component {...pageProps} />
      <NotificationContainer
        notifications={notifications}
        onClose={removeNotification}
      />
    </>
  );
}

export default function App({ Component, pageProps }: AppProps) {
  return (
    <UserProvider>
      <AppContent Component={Component} pageProps={pageProps} />
    </UserProvider>
  );
}
