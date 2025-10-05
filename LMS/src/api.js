const BASE_URL = "https://lmsbackend-ep22.onrender.com";

export async function fetchAPI(endpoint, method = "GET", body = null) {
  const url = `${BASE_URL}${endpoint}`;
  const options = {
    method,
    headers: {
      "Content-Type": "application/json",
    },
  };

  try {
    const token = localStorage.getItem("token");
    if (token) {
      options.headers["x-auth-token"] = token;
    }
  } catch (error) {
    console.log("Error getting token:", error);
  }

  if (body && (method === "POST" || method === "PUT")) {
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(url, options);
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.msg || "Something went wrong");
    }
    return data;
  } catch (error) {
    console.error("API Fetch Error1:", error);
    throw error;
  }
}
