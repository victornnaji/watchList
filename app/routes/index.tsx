import { Link } from "@remix-run/react";
import styled from '@emotion/styled';
import { useOptionalUser } from "~/utils";

const Main = styled.main`
  background: red;
`

export default function Index() {
  const user = useOptionalUser();
  return (
    <Main className="">
      hello { user?.email }
    </Main>
  );
}
