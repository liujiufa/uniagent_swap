import React, { Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import DataPageLoding from "../components/DataPageLoding";
import MainLayout from "../Layout/MainLayout";
import DeputyLayout from "../Layout/DeputyLayout";
const SwapBox = React.lazy(() => import("../view/SwapBox"));
const Bridge = React.lazy(() => import("../view/Bridge"));
const LiquidityPledge = React.lazy(() => import("../view/LiquidityPledge"));
const LPPledge = React.lazy(() => import("../view/LPPledge"));
const SigleCoinPledge = React.lazy(() => import("../view/SigleCoinPledge"));
const Pool = React.lazy(() => import("../view/Pool"));
const PledgeRedeem = React.lazy(() => import("../view/PledgeRedeem"));
const SigleCoinPledgeRedeem = React.lazy(
  () => import("../view/SigleCoinPledgeRedeem")
);
const PersonCenter = React.lazy(() => import("../view/PersonCenter"));
export default function Router() {
  return (
    <Suspense fallback={<DataPageLoding></DataPageLoding>}>
      <Routes>
        <Route path="/*" element={<MainLayout />}>
          <Route path=":address/">
            <Route index element={<SwapBox />}></Route>
            <Route path="Swap" element={<SwapBox />}></Route>
            <Route path="Bridge" element={<Bridge />}></Route>
            <Route path="LiquidityPledge" element={<LiquidityPledge />}></Route>
            <Route path="LPPledge/:CoinId" element={<LPPledge />}></Route>
            <Route
              path="SigleCoinPledge/:CoinId"
              element={<SigleCoinPledge />}
            ></Route>
            <Route
              path="PledgeRedeem/:CoinId"
              element={<PledgeRedeem />}
            ></Route>
            <Route
              path="SigleCoinPledgeRedeem/:CoinId"
              element={<SigleCoinPledgeRedeem />}
            ></Route>
            <Route path="Pool" element={<Pool />}></Route>
            <Route path="PersonCenter" element={<PersonCenter />}></Route>
          </Route>
          <Route path="" element={<SwapBox />}></Route>
        </Route>
        <Route path="/DeputyLayout" element={<DeputyLayout />}></Route>
      </Routes>
    </Suspense>
  );
}
