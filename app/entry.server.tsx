import { PassThrough } from "stream";
import type { EntryContext } from "@remix-run/node";
import { Response } from "@remix-run/node";
import { RemixServer } from "@remix-run/react";
import isbot from "isbot";
import { renderToPipeableStream, renderToString } from "react-dom/server";
import createEmotionServer from "@emotion/server/create-instance";
import createEmotionCache from "./styles/createEmotionCache";
import ServerStyleContext from "./styles/server.context";
import { CacheProvider } from "@emotion/react";
import { I18nextProvider } from "react-i18next";
import { createI18nextServerInstance } from "./integrations/i18n";

const ABORT_DELAY = 5000;

export default function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext
) {
  const callbackName = isbot(request.headers.get("user-agent"))
    ? "onAllReady"
    : "onShellReady";

  const cache = createEmotionCache();
  const { extractCriticalToChunks } = createEmotionServer(cache);

  return new Promise(async (resolve, reject) => {
    let didError = false;

    const instance = await createI18nextServerInstance(request, remixContext);

    const html = renderToString(
      <ServerStyleContext.Provider value={null}>
        <CacheProvider value={cache}>
          <RemixServer context={remixContext} url={request.url} />
        </CacheProvider>
      </ServerStyleContext.Provider>
    );

    const chunks = extractCriticalToChunks(html);

    const { pipe, abort } = renderToPipeableStream(
      <I18nextProvider i18n={instance}>
        <ServerStyleContext.Provider value={chunks.styles}>
          <CacheProvider value={cache}>
            <RemixServer context={remixContext} url={request.url} />
          </CacheProvider>
        </ServerStyleContext.Provider>
      </I18nextProvider>,
      {
        [callbackName]: () => {
          const body = new PassThrough();

          responseHeaders.set("Content-Type", "text/html");

          resolve(
            new Response(body, {
              headers: responseHeaders,
              status: didError ? 500 : responseStatusCode,
            })
          );

          pipe(body);
        },
        onShellError: (err: unknown) => {
          reject(err);
        },
        onError: (error: unknown) => {
          didError = true;

          console.error(error);
        },
      }
    );

    setTimeout(abort, ABORT_DELAY);
  });
}
