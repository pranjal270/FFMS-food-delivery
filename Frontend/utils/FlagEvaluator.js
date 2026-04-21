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

  const rollout =
    flag.rolloutPercentage == null ? 100 : Number(flag.rolloutPercentage);

  if (rollout >= 100) return true;
  if (!Number.isFinite(rollout) || rollout <= 0) return false;
  if (!userId) return false;

  const bucketInput = `${flag.flagKey}:${userId}`;
  const bucket = getStableBucket(bucketInput);

  return bucket < rollout;
};
