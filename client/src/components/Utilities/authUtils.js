import axios from "axios";

export const verifyToken = async (token) => {
  try {
    const response = await axios.post("/api/auth/protect", { token });
    return { isValid: true, data: response.data }; // Token is valid
  } catch (error) {
    console.error("Invalid or expired token:", error);
    sessionStorage.clear(); // Clear invalid token
    window.location.href = "/login"; // Redirect to login
    return { isValid: false }; // Token is invalid
  }
};
