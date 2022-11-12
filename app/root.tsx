import type { LoaderArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import styled from "@emotion/styled";
import { getUser } from "./session.server";
import { i18nextServer } from "~/integrations/i18n";
import { useTranslation } from "react-i18next";
import { useChangeLanguage } from "remix-i18next";
import { i18nCookie } from "./integrations/i18n/cookie";

type LoaderData = {
  user: Awaited<ReturnType<typeof getUser>>;
  locale: string;
};

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "WatchList 📺",
  viewport: "width=device-width,initial-scale=1",
});

export async function loader({ request }: LoaderArgs) {
  let locale = await i18nextServer.getLocale(request);
  return json<LoaderData>({
    user: await getUser(request),
    locale,
  }, {
    headers: {"Set-Cookie": await i18nCookie.serialize(locale)}
  });
}

export let handle = {
  i18n: "common",
};

const Body = styled.body`
  background: red;
`;

export default function App() {
  const { locale } = useLoaderData<typeof loader>();
  const { i18n } = useTranslation();
  useChangeLanguage(locale);
  return (
    <html lang={locale || i18n.language} dir={i18n.dir()}>
      <head>
        <Meta />
        <Links />
      </head>
      <Body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </Body>
    </html>
  );
}
