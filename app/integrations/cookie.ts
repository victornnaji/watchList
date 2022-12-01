import { createCookie } from "@remix-run/node";

export let i18nCookie = createCookie('i18n', {
  sameSite: 'lax',
  path: '/',
})

export let gdprConsent = createCookie("gdpr-consent", {
  maxAge: 31536000, // One Year
});