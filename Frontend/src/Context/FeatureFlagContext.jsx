import { createContext, useContext, useEffect, useState } from "react";
import {
  loadFeatureFlags,
  getAllFeatureFlags,
  checkFeatureFlag,
} from "../services/featureFlags";

const FeatureFlagContext = createContext(null);
export const FeatureFlagProvider = ({
  children,
  clientKey,
  currentUserId,
}) => {
  const [flags, setFlags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(()=>{
    const initFlags=async()=>{
        try{
            setLoading(true)
            setError("")
            await loadFeatureFlags(clientKey);
            setFlags(getAllFeatureFlags())
        }catch(err){
            console.error("Feature flag load error:", err);
            setError("Failed to load feature flags");
        }finally{
            setLoading(false)
        }
    }
    if(clientKey){
        initFlags()
    }
  },[clientKey])
  const isEnabled = (flagKey) => {
    return checkFeatureFlag(flagKey, currentUserId);
  }
  return (
    <FeatureFlagContext.Provider value={{flags,loading,error,isEnabled}}>
        {children}

    </FeatureFlagContext.Provider>
  )
}
export const useFeatureFlags = () => {
  const context = useContext(FeatureFlagContext);
   if (!context) {
    throw new Error("useFeatureFlags must be used inside FeatureFlagProvider");
  }

  return context;

}

