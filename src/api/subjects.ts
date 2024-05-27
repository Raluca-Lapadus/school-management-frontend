import axios from "axios";

const baseURL = "http://localhost:8080/subjects";
const API = axios.create();

export const getSubjectsAPI = async () => {
  try {
    const response = await API.get(`${baseURL}`);
    return response.data;
  } catch (error) {
    return;
  }
};