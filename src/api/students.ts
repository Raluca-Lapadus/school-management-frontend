import axios from "axios";

const baseURL = "http://localhost:8080/students";
const API = axios.create();

export const getStudentsAPI = async () => {
  try {
    const response = await API.get(
      `${baseURL}`
    );
    return response.data;
  } catch (error) {
    return;
  }
};

export const addStudentAPI = async (body: {}) => {
  try {
    const response = await API.post(`${baseURL}/addStudent`, body);
    return response.data;
  } catch (error) {
    return;
  }
};