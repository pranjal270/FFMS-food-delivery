/**
 * FFMS (Feature Flag Management System) — Core SDK
 * 
 * Framework-agnostic vanilla JS implementation.
 * Handles fetching, caching, and evaluating feature flags.
 * Does not contain React, Vue, or Angular specific code.
 */

let tenantFlags = [];

export const fetchTenantFlags = async (clientKey) => {
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

export const isFeatureEnabled = (flag, userAssignments) => {
  if (!flag) return false;

  const enabled = flag.enabled ?? flag.isEnabled ?? false;
  if (!enabled) return false;

  // If a feature is fully rolled out (100%), everyone gets it, including guests
  const rollout =
    flag.rolloutPercentage == null ? 100 : Number(flag.rolloutPercentage);

  if (rollout >= 100) return true;

  if (!userAssignments || typeof userAssignments !== "object") return false;

  return userAssignments[flag.flagKey] === "A";
};

export const loadFeatureFlags = async (clientKey) => {
  const data = await fetchTenantFlags(clientKey);
  tenantFlags = Array.isArray(data) ? data : data.flags || [];
  return tenantFlags;
};

export const getAllFeatureFlags = () => {
  return [...tenantFlags];
};

export const getFeatureFlag = (flagKey) => {
  return tenantFlags.find((flag) => flag.flagKey === flagKey) || null;
};

export const checkFeatureFlag = (flagKey, userAssignments) => {
  const flag = getFeatureFlag(flagKey);
  return isFeatureEnabled(flag, userAssignments);
};
