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
  useLocation,
} from "@remix-run/react";
import styled from "@emotion/styled";
import { getUser } from "./session.server";
import { i18nextServer } from "~/integrations/i18n";
import { useTranslation } from "react-i18next";
import { useChangeLanguage } from "remix-i18next";
import { i18nCookie } from "./integrations/cookie";
import { shouldTrackUser } from "./utils";
import GDPR from "./components/common/GDPR";
import React from "react";
import * as gtag from "./gtag.client";

type LoaderData = {
  user: Awaited<ReturnType<typeof getUser>>;
  locale: string;
  track: boolean;
  gaTrackingId: string | undefined;
};

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "WatchList 📺",
  viewport: "width=device-width,initial-scale=1",
});

export async function loader({ request }: LoaderArgs) {
  const locale = await i18nextServer.getLocale(request);

  return json<LoaderData>(
    {
      user: await getUser(request),
      track: await shouldTrackUser(request),
      gaTrackingId: process.env.GA_TRACKING_ID,
      locale,
    },
    {
      headers: { "Set-Cookie": await i18nCookie.serialize(locale) },
    }
  );
}

export let handle = {
  i18n: "common",
};

const Body = styled.body`
  background: red;
`;

export default function App() {
  const { locale, track, gaTrackingId } = useLoaderData<typeof loader>();
  const { i18n } = useTranslation();
  const location = useLocation();

  useChangeLanguage(locale);

  React.useEffect(() => {
    if (track && gaTrackingId?.length) {
      gtag.pageview(location.pathname, gaTrackingId);
    }
  }, [gaTrackingId, location.pathname, track]);

  return (
    <html lang={locale || i18n.language} dir={i18n.dir()}>
      <head>
        <Meta />
        <Links />
      </head>
      <Body>
        {!track && <GDPR />}
        {process.env.NODE_ENV === "development" || !gaTrackingId
          ? null
          : track && (
              <>
                <script
                  async
                  src={`https://www.googletagmanager.com/gtag/js?id=${gaTrackingId}`}
                />
                <script
                  async
                  id="gtag-init"
                  dangerouslySetInnerHTML={{
                    __html: `
                      window.dataLayer = window.dataLayer || [];
                      function gtag(){dataLayer.push(arguments);}
                      gtag('js', new Date());
                      gtag('config', '${gaTrackingId}', {
                        page_path: window.location.pathname,
                      });
                  `,
                  }}
                />
              </>
            )}
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </Body>
    </html>
  );
}
