import { createContext, useContext, useState, useCallback } from "react"

const ApiContext = createContext()

export const useApi = () => {
  const context = useContext(ApiContext)
  if (!context) {
    throw new Error("useApi must be used within an ApiProvider")
  }
  return context
}

export const ApiProvider = ({ children }) => {
  const API_BASE_URL = "https://altakween-4nng-qsj6gwlpp-dexcoders-projects.vercel.app/api" // Update to match your backend port

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchData = useCallback(
    async (endpoint, options = {}) => {
      setLoading(true);
      setError(null);
      try {
        const headers = {
          "Content-Type": "application/json",
          ...options.headers,
        };
  
        // Retrieve token from localStorage
        let token = null;
        try {
          const storedUser = localStorage.getItem("altaqween_user");
          if (storedUser) {
            const user = JSON.parse(storedUser);
            token = user.token;
          }
        } catch (err) {
          console.error("Failed to read user from localStorage:", err);
        }
  
        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
        }
  
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
          method: options.method || "GET",
          headers,
          body: options.body ? JSON.stringify(options.body) : undefined,
          credentials: "include", // Important for cookies
        });
  
        const data = await response.json();
  
        if (!response.ok) {
          // If the response is not ok, throw an error with the error message from the server
          const error = new Error(data.message || "Request failed");
          error.response = { data, status: response.status };
          throw error;
        }
  
        return data;
      } catch (error) {
        console.error("API Error:", error);
        setError(error.message);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    []
  );
  
  // Helper methods
  const post = useCallback((endpoint, body) => {
    return fetchData(endpoint, {
      method: "POST",
      body,
    });
  }, [fetchData]);

  const get = useCallback((endpoint) => fetchData(endpoint, { method: "GET" }), [fetchData])
//   const post = useCallback(
//     (endpoint, body) =>
//       fetchData(endpoint, {
//         method: "POST",
//         body:
//           body && typeof FormData !== "undefined" && body instanceof FormData
//             ? body
//             : JSON.stringify(body),
//       }),
//     [fetchData],
//   )
  const put = useCallback(
    (endpoint, body) =>
      fetchData(endpoint, {
        method: "PUT",
        body:
          body && typeof FormData !== "undefined" && body instanceof FormData
            ? body
            : JSON.stringify(body),
      }),
    [fetchData],
  )
  const del = useCallback((endpoint) => fetchData(endpoint, { method: "DELETE" }), [fetchData])

  const value = {
    loading,
    error,
    get,
    post,
    put,
    del,
  }

  return <ApiContext.Provider value={value}>{children}</ApiContext.Provider>
}

export default ApiContext
