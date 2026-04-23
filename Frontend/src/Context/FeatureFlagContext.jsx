import { createContext, useContext, useEffect, useState } from "react";
import {
  loadFeatureFlags,
  getAllFeatureFlags,
  isFeatureEnabled,
} from "../services/ffms";

const FeatureFlagContext = createContext(null);

export const FeatureFlagProvider = ({ children, clientKey, currentUserId }) => {
  const [flags, setFlags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const initFlags = async (showLoader = false) => {
      try {
        if (showLoader) setLoading(true);
        setError(null);

        await loadFeatureFlags(clientKey);

        if (isMounted) {
          const updatedFlags = getAllFeatureFlags();
          setFlags(updatedFlags);
        }
      } catch (err) {
        console.error("Feature flag load error:", err);
        if (isMounted) setError("Failed to load feature flags");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    if (clientKey) {
      initFlags(true);
      const refreshInterval = window.setInterval(() => initFlags(false), 10000);

      return () => {
        isMounted = false;
        window.clearInterval(refreshInterval);
      };
    }
  }, [clientKey]);

  const isEnabled = (flagKey) => {
    // Fallsback check for ID in case flagKey in DB is an ObjectId string
    const flag = flags.find((item) => item.flagKey === flagKey || item._id === flagKey);
    return isFeatureEnabled(flag, currentUserId);
  };

  return (
    <FeatureFlagContext.Provider value={{ flags, loading, error, isEnabled }}>
      {children}
    </FeatureFlagContext.Provider>
  );
};

export const useFeatureFlags = () => {
  const context = useContext(FeatureFlagContext);
  if (!context) throw new Error("useFeatureFlags must be used inside Provider");
  return context;
};