/**
 * FFMS (Feature Flag Management System) Core SDK
 * This is a generic, tenant-agnostic file.
 */

let tenantFlags = [];

// 1. API FETCH LOGIC
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
    throw new Error(`Failed to fetch flags: ${response.status}`);
  }

  const data = await response.json();
  return data;
};

// 2. DETERMINISTIC EVALUATION LOGIC
const getStableBucket = (input) => {
  let hash = 0;
  for (let i = 0; i < input.length; i += 1) {
    hash = (hash * 31 + input.charCodeAt(i)) >>> 0;
  }
  return hash % 100;
};

export const isFeatureEnabled = (flag, userId) => {
  if (!flag) return false;

  const enabled = flag.enabled ?? flag.isEnabled ?? false;
  if (!enabled) return false;

  const rollout = flag.rolloutPercentage == null ? 100 : Number(flag.rolloutPercentage);

  if (rollout >= 100) return true;
  if (!Number.isFinite(rollout) || rollout <= 0) return false;
  if (!userId) return false;

  const bucketInput = `${flag.flagKey}:${userId}`;
  const bucket = getStableBucket(bucketInput);

  return bucket < rollout;
};

// 3. STATE MANAGEMENT LOGIC
export const loadFeatureFlags = async (clientKey) => {
  const data = await fetchtenantFlags(clientKey);
  tenantFlags = Array.isArray(data) ? data : data.flags || [];
  return tenantFlags;
};

export const getAllFeatureFlags = () => {
  return [...tenantFlags];
};

export const getFeatureFlags = (flagKey) => {
  return tenantFlags.find((flag) => flag.flagKey === flagKey) || null;
};

export const checkFeatureFlag = (flagKey, userId) => {
  const flag = getFeatureFlags(flagKey);
  return isFeatureEnabled(flag, userId);
};