// import { createContext, useContext, useState, useCallback } from "react"

// const ApiContext = createContext()

// export const useApi = () => {
//   const context = useContext(ApiContext)
//   if (!context) {
//     throw new Error("useApi must be used within an ApiProvider")
//   }
//   return context
// }

// export const ApiProvider = ({ children }) => {
//   const API_BASE_URL = "https://altakween-4nng.vercel.app/api" // Update to match your backend port
//   // const API_BASE_URL = "http://localhost:8081/api" // Update to match your backend port

//   const [loading, setLoading] = useState(false)
//   const [error, setError] = useState(null)

//   const fetchData = useCallback(
//     async (endpoint, options = {}) => {
//       setLoading(true);
//       setError(null);
//       try {
//         const headers = {
//           "Content-Type": "application/json",
//           ...options.headers,
//         };
  
//         // Retrieve token from localStorage
//         let token = null;
//         try {
//           const storedUser = localStorage.getItem("altaqween_user");
//           if (storedUser) {
//             const user = JSON.parse(storedUser);
//             console.log('Stored user data:', user); // Debug log
            
//             // Get token directly from user object
//             token = user.token;
            
//             if (!token) {
//               console.warn("No token found in user object");
//               console.warn("Available user properties:", Object.keys(user));
//             }
//           } else {
//             console.warn("No user data found in localStorage");
//           }
//         } catch (err) {
//           console.error("Failed to read user from localStorage:", err);
//         }
  
//         if (token) {
//           console.log('Using token:', token.substring(0, 10) + '...'); // Log first 10 chars of token
//           headers["Authorization"] = `Bearer ${token}`;
//         } else {
//           console.warn("No authentication token available");
//         }
  
//         const response = await fetch(`${API_BASE_URL}${endpoint}`, {
//           method: options.method || "GET",
//           headers,
//           body: options.body ? JSON.stringify(options.body) : undefined,
//           credentials: "include", // Important for cookies
//         });
  
//         // Handle empty responses (like 204 No Content)
//         const contentType = response.headers.get("content-type");
//         let data;
        
//         if (contentType && contentType.includes("application/json")) {
//           data = await response.json();
//         } else {
//           data = await response.text();
//           // If the response is empty but the request was successful, return a success response
//           if (response.ok && (!data || data.trim() === '')) {
//             return { success: true };
//           }
//         }
  
//         if (!response.ok) {
//           // If the response is not ok, throw an error with the error message from the server
//           const error = new Error(data?.message || "Request failed");
//           error.response = { data, status: response.status };
//           throw error;
//         }

//         // Return the data with success status
//         return response.status === 204 ? { success: true } : data;  
//       } catch (error) {
//         console.error("API Error:", error);
//         setError(error.message);
//         throw error;
//       } finally {
//         setLoading(false);
//       }
//     },
//     []
//   );
  
//   // Helper methods
//   const post = useCallback((endpoint, body) => {
//     return fetchData(endpoint, {
//       method: "POST",
//       body,
//     });
//   }, [fetchData]);

//   const get = useCallback((endpoint) => fetchData(endpoint, { method: "GET" }), [fetchData])
// //   const post = useCallback(
// //     (endpoint, body) =>
// //       fetchData(endpoint, {
// //         method: "POST",
// //         body:
// //           body && typeof FormData !== "undefined" && body instanceof FormData
// //             ? body
// //             : JSON.stringify(body),
// //       }),
// //     [fetchData],
// //   )
//   const put = useCallback(
//     (endpoint, body) =>
//       fetchData(endpoint, {
//         method: "PUT",
//         body:
//           body && typeof FormData !== "undefined" && body instanceof FormData
//             ? body
//             : JSON.stringify(body),
//       }),
//     [fetchData],
//   )
//   const del = useCallback((endpoint) => fetchData(endpoint, { method: "DELETE" }), [fetchData])

//   const value = {
//     loading,
//     error,
//     get,
//     post,
//     put,
//     del,
//   }

//   return <ApiContext.Provider value={value}>{children}</ApiContext.Provider>
// }

// export default ApiContext



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
  // const API_BASE_URL = "http://localhost:8081/api"
  const API_BASE_URL = "https://altakween-4nng.vercel.app/api"
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchData = useCallback(async (endpoint, options = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const headers = {
        "Content-Type": "application/json",
        ...options.headers,
      };

      // Get token from localStorage
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

      const url = `${API_BASE_URL}${endpoint}`;
      console.log(`🌐 API Call: ${options.method || 'GET'} ${url}`);

      const response = await fetch(url, {
        method: options.method || "GET",
        headers,
        body: options.body ? JSON.stringify(options.body) : undefined,
      });

      // Check if response is OK
      if (!response.ok) {
        // Try to get error message from response
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (e) {
          // Response is not JSON
          console.log(e);
        }
        
        const error = new Error(errorMessage);
        error.status = response.status;
        throw error;
      }

      // Parse JSON response
      const data = await response.json();
      return data;

    } catch (error) {
      let errorMessage = 'An unexpected error occurred. Please try again later.';
      
      // Handle different types of connection errors
      if (error.message.includes('ECONNREFUSED')) {
        errorMessage = 'Unable to connect to the server. Please check your internet connection and try again.';
      } else if (error.message.includes('ECONNRESET')) {
        errorMessage = 'Connection to the server was interrupted. Please check your internet connection and try again.';
      } else if (error.message.includes('timeout')) {
        errorMessage = 'The request timed out. Please check your internet connection and try again.';
      } else if (error.message.includes('Network Error')) {
        errorMessage = 'Network error. Please check your internet connection and try again.';
      } else {
        errorMessage = error.message || errorMessage;
      }
      
      const enhancedError = new Error(errorMessage);
      enhancedError.status = error.status || 500;
      
      console.error("API Error:", {
        endpoint,
        error: enhancedError.message,
        status: enhancedError.status,
        originalError: error.message
      });
      
      setError(enhancedError.message);
      throw enhancedError;
    } finally {
      setLoading(false);
    }
  }, [API_BASE_URL]);

  const get = useCallback((endpoint) => fetchData(endpoint, { method: "GET" }), [fetchData]);
  const post = useCallback((endpoint, body) => fetchData(endpoint, { method: "POST", body }), [fetchData]);
  const put = useCallback((endpoint, body) => fetchData(endpoint, { method: "PUT", body }), [fetchData]);
  const del = useCallback((endpoint) => fetchData(endpoint, { method: "DELETE" }), [fetchData]);

  const value = {
    loading,
    error,
    get,
    post,
    put,
    del,
    API_BASE_URL
  }

  return <ApiContext.Provider value={value}>{children}</ApiContext.Provider>
}

export default ApiContext