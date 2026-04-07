import { fetchtenantFlags } from "./tenantFlag";
import { isFeatureEnabled } from "../../utils/FlagEvaluator";

let tenantFlags=[]

export const loadFeatureFlags=async(clientKey)=>{
    const data=await fetchtenantFlags()
    tenantFlags=data.flags || data || []
    return tenantFlags

}
export const getAllFeatureFlags=()=>{
    return tenantFlags
}
export const getFeatureFlags=(flagKey)=>{
    return tenantFlags.find((flag)=>flag.flagKey==flagKey)||null
}
export const checkFeatureFlag=(flagKey,userId)=>{
    const flag=getFeatureFlags(flagKey)
    return isFeatureEnabled(flag,userId)
}