import axios from "axios";

const baseURL = "http://localhost:8080/teachers";
const API = axios.create();

export const getTeachersAPI = async () => {
  try {
    const response = await API.get(`${baseURL}`);
    return response.data;
  } catch (error) {
    return;
  }
};

export const deleteTeachersAPI = async (id: number) => {
  try {
    const response = await API.delete(`${baseURL}/deleteTeacher/${id}`);
    return response.data;
  } catch (error) {
    return;
  }
};
