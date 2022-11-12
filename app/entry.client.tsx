import * as React from "react";
import { RemixBrowser } from "@remix-run/react";
import { startTransition, StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";
import { CacheProvider } from "@emotion/react";

import createEmotionCache from "./styles/createEmotionCache";
import ClientStyleContext from "./styles/client.context";
import { I18nClientProvider, initI18nextClient } from "./integrations/i18n";

interface ClientCacheProviderProps {
  children: React.ReactNode;
}
function ClientCacheProvider({ children }: ClientCacheProviderProps) {
  const [cache, setCache] = React.useState(createEmotionCache());

  const reset = React.useCallback(() => {
    setCache(createEmotionCache());
  }, []);

  return (
    <ClientStyleContext.Provider value={{ reset }}>
      <CacheProvider value={cache}>{children}</CacheProvider>
    </ClientStyleContext.Provider>
  );
}

const hydrate = () => {
  startTransition(() => {
    hydrateRoot(
      document,
      <StrictMode>
        <ClientCacheProvider>
          <I18nClientProvider>
            <RemixBrowser />
          </I18nClientProvider>
        </ClientCacheProvider>
      </StrictMode>
    );
  });
};

initI18nextClient(hydrate);
