/**
 * FFMS (Feature Flag Management System) Core SDK
 * 
 * This file contains the complete logic for fetching, storing, 
 * and evaluating feature flags.
 * can be dropped into any client application.
 */

let tenantFlags = [];  


export const fetchtenantFlags = async (clientKey) => {

  const flagsApiUrl =
    import.meta.env?.VITE_FLAGS_API_URL ||
    import.meta.env?.VITE_API_URL ||
    "http://localhost:5000";

  if (!clientKey) {
    throw new Error("Missing tenant client key");
  }

  const response = await fetch(`${flagsApiUrl}/api/flags`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-client-key": clientKey,
    },
  });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch tenant flags: ${response.status} ${response.statusText}`
    );
  }

  const data = await response.json();
  return data;
};



const getStableBucket = (input) => {  //hashing logic (rolllout)
  let hash = 0;

  for (let i = 0; i < input.length; i += 1) {
    hash = (hash * 31 + input.charCodeAt(i)) >>> 0;
  }

  return hash % 100;
};

export const isFeatureEnabled = (flag, userId) => { //deterministic evaluation logic
  if (!flag) return false;

  const enabled = flag.enabled ?? flag.isEnabled ?? false;
  if (!enabled) return false;

  const rollout =
    flag.rolloutPercentage == null ? 100 : Number(flag.rolloutPercentage);

  if (rollout >= 100) return true;
  if (!Number.isFinite(rollout) || rollout <= 0) return false;
  if (!userId) return false;

  const bucketInput = `${flag.flagKey}:${userId}`;
  const bucket = getStableBucket(bucketInput);

  return bucket < rollout;
}

export const loadFeatureFlags = async (clientKey) => {
  const data = await fetchtenantFlags(clientKey);
  tenantFlags = Array.isArray(data) ? data : data.flags || [];
  return tenantFlags;
};

export const getAllFeatureFlags = () => {
  return tenantFlags;
};

export const getFeatureFlags = (flagKey) => {
  return tenantFlags.find((flag) => flag.flagKey === flagKey) || null;
};

export const checkFeatureFlag = (flagKey, userId) => {
  const flag = getFeatureFlags(flagKey);
  return isFeatureEnabled(flag, userId);
};
