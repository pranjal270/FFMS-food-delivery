export const fetchtenantFlags = async (clientKey) => {
  const flagsApiUrl =
    import.meta.env.VITE_FLAGS_API_URL ||
    import.meta.env.VITE_API_URL ||
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
