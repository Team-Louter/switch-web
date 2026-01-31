import { Outlet } from "react-router-dom";
import * as S from "./style"
import Topbar from "@/components/common/Topbar";

function Layout() {
  return (
    <S.Container>
      <S.HeaderSpacer />
      <Topbar />
      <Outlet />
    </S.Container>
  )
}

export default Layout;