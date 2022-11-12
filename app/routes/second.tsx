import { useTranslation } from "react-i18next";
import { Link } from "@remix-run/react";

export let handle = {
  i18n: "common",
};

export default function SecondPage() {
  const { t, ready } = useTranslation("common");

  if (!ready) {
    return <div>Loading...</div>;
  }
  return (
    <div>
      <h1>{t("title")}</h1>
      <Link to="/third">Third</Link>
    </div>
  );
}
