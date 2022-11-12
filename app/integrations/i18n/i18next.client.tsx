import i18next from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import Backend from "i18next-http-backend";
import { I18nextProvider, initReactI18next } from "react-i18next";
import { getInitialNamespaces } from "remix-i18next";

import { config } from "./config";

export function initI18nextClient(hydrate: IdleRequestCallback) {
  i18next
    .use(initReactI18next)
    .use(LanguageDetector)
    .use(Backend)
    .init({
      ...config,
      ns: getInitialNamespaces(),
      backend: {
        loadPath: "/locales/{{lng}}/{{ns}}.json",
      },
      detection: {
        order: ["htmlTag"],
        caches: [],
      },
    })
    .then(() => {
      if (window.requestIdleCallback) {
        window.requestIdleCallback(hydrate);
      } else {
        window.setTimeout(hydrate, 1);
      }
    });
}

export function I18nClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <I18nextProvider i18n={i18next}>{children}</I18nextProvider>;
}