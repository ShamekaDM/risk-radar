import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8000"; // Your FastAPI backend

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const fetchThreats = async () => {
  try {
    const response = await api.get("/threats/");
    return response.data;
  } catch (error) {
    console.error("Error fetching threats:", error);
    return [];
  }
};

export const addThreat = async (threatData) => {
  try {
    const response = await api.post("/threats/", threatData);
    return response.data;
  } catch (error) {
    console.error("Error adding threat:", error);
    return null;
  }
};

export default api;
