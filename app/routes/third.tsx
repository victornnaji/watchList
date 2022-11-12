import { useTranslation } from "react-i18next";
import { Link } from "@remix-run/react";

export let handle = {
  i18n: "common",
};

export default function ThirdPage() {
  const { t, ready } = useTranslation("common");

  if (!ready) {
    return <div>Loading...</div>;
  }
  return (
    <div>
      <h1>{t("content")}</h1>
      <Link to="/">first</Link>
    </div>
  );
}
