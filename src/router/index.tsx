import React, { Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import DataPageLoding from "../components/DataPageLoding";
import MainLayout from "../Layout/MainLayout";
import DeputyLayout from "../Layout/DeputyLayout";
const Swap = React.lazy(() => import("../view/Swap"));
const Bridge = React.lazy(() => import("../view/Bridge"));
export default function Router() {
  return (
    <Suspense fallback={<DataPageLoding></DataPageLoding>}>
      <Routes>
        <Route path="/*" element={<MainLayout />}>
          <Route path=":address/">
            <Route index element={<Swap />}></Route>
            <Route path="Swap" element={<Swap />}></Route>
            <Route path="Bridge" element={<Bridge />}></Route>
          </Route>
          <Route path="" element={<Swap />}></Route>
        </Route>
        <Route path="/DeputyLayout" element={<DeputyLayout />}></Route>
      </Routes>
    </Suspense>
  );
}
