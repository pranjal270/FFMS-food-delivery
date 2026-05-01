/**
 * FFMS (Feature Flag Management System) — Backend SDK
 * 
 * Framework-agnostic backend logic.
 * Handles rollout assignment at signup and provides schema fields.
 */

const ffmsUserFields = {
  featureFlagAssignments: {
    type: Map,
    of: String,   // "A" (feature ON) or "B" (feature OFF)
    default: new Map()
  }
}

const fetchActiveFlags = async (apiUrl, clientKey) => {
  const response = await fetch(`${apiUrl}/api/flags`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-client-key": clientKey,
    },
  })

  if (!response.ok) {
    throw new Error(
      `FFMS: Failed to fetch flags — ${response.status} ${response.statusText}`
    )
  }

  const data = await response.json()
  return data.flags || []
}

const generateFlagAssignments = (flags) => {
  const assignments = {}

  for (const flag of flags) {
    if (!flag.isEnabled) continue

    const rollout = flag.rolloutPercentage ?? 100
    const randomValue = Math.random() // 0 to 1

    assignments[flag.flagKey] = randomValue < rollout / 100 ? "A" : "B"
  }

  return assignments
}

const assignFlagsOnSignup = async (user, { apiUrl, clientKey }) => {
  try {
    if (!clientKey || !apiUrl) {
      console.warn("FFMS: Missing apiUrl or clientKey — skipping flag assignment")
      return {}
    }

    const flags = await fetchActiveFlags(apiUrl, clientKey)
    const assignments = generateFlagAssignments(flags)

    user.featureFlagAssignments = new Map(Object.entries(assignments))
    await user.save()

    return assignments
  } catch (error) {
    console.error("FFMS: Feature flag assignment error:", error.message)
    return {}
  }
}

const getFFMSAssignments = (user) => {
  if (!user?.featureFlagAssignments) return {}

  return user.featureFlagAssignments instanceof Map
    ? Object.fromEntries(user.featureFlagAssignments)
    : user.featureFlagAssignments
}

module.exports = {
  ffmsUserFields,
  assignFlagsOnSignup,
  getFFMSAssignments,
  fetchActiveFlags,
  generateFlagAssignments,
}
