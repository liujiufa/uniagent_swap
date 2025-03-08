import { useAppKitNetwork, useAppKitState } from "@reown/appkit/react";
import React from "react";
import SwapUni from "./SwapUni";

const SwapBox = () => {
  const { selectedNetworkId } = useAppKitState();
  const { caipNetwork, caipNetworkId, chainId, switchNetwork } =
    useAppKitNetwork();
  return <>{<SwapUni></SwapUni>}</>;
};

export default SwapBox;
