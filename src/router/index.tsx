import React, { Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import DataPageLoding from "../components/DataPageLoding";
import MainLayout from "../Layout/MainLayout";
import DeputyLayout from "../Layout/DeputyLayout";
const Home = React.lazy(() => import("../view/Home"));
export default function Router() {
  return (
    <Suspense fallback={<DataPageLoding></DataPageLoding>}>
      <Routes>
        <Route path="/*" element={<MainLayout />}>
          <Route path=":address/">
            <Route index element={<Home />}></Route>
          </Route>
          <Route path="" element={<Home />}></Route>
        </Route>
        <Route path="/DeputyLayout" element={<DeputyLayout />}></Route>
      </Routes>
    </Suspense>
  );
}
