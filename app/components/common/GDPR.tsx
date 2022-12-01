import { useFetcher } from "@remix-run/react";

const GDPR = () => {
  const analyticsFetcher = useFetcher();

  return (
    <div
      style={{
        backgroundColor: "#ccc",
        padding: 10,
        position: "fixed",
        bottom: 0,
      }}
    >
      <analyticsFetcher.Form method="post" action="/enable-analytics">
        We use Cookies...
        <button name="accept-gdpr" value="true" type="submit">
          Accept
        </button>
      </analyticsFetcher.Form>
    </div>
  );
};

export default GDPR;
