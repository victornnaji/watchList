import styled from "@emotion/styled";
import { useOptionalUser } from "~/utils";
import { useTranslation } from "react-i18next";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import type { LoaderArgs } from "@remix-run/node";
import React from "react";


const Main = styled.main`
  background: #fff;
`;

export let handle = {
  i18n: "common",
};

export const loader = async ({ request }: LoaderArgs) => {
  return json({
    lngs: {
      en: { nativeName: "English" },
      de: { nativeName: "Deutsch" },
    },
  });
};

export default function Index() {
  const user = useOptionalUser();
  const { lngs } = useLoaderData();
  const { t } = useTranslation();

  return (
    <Main className="">
      <div>
        {Object.keys(lngs).map((lng) => (
          <Link
            key={lng}
            style={{
              marginRight: 5,
            }}
            to={`/?lng=${lng}`}
          >
            {lngs[lng].nativeName}
          </Link>
        ))}
        <h1>{t("greeting")}</h1>
        <Link to="/second">{t('second')}</Link>
      </div>
    </Main>
  );
}
