import React, { useEffect, useState } from "react";
import NetInfo from "@react-native-community/netinfo";

export default function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    (async () => {
      setIsOnline((await NetInfo.fetch()).isConnected);
    })();
    const unsubscribe = NetInfo.addEventListener((state) =>
      setIsOnline(state.isConnected)
    );

    return () => unsubscribe();
  }, []);

  return isOnline;
}
