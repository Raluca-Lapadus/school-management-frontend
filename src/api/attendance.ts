import axios from "axios";

const baseURL = "http://localhost:8080/attendances";
const API = axios.create();

export const getAttendancesAPI = async (
  studentId: number,
  subjectId: number
) => {
  try {
    const response = await API.get(
      `${baseURL}/getAttendances/${studentId}/${subjectId}`
    );
    return response.data;
  } catch (error) {
    return;
  }
};

export const deleteAttendanceAPI = async (id: number) => {
  try {
    const response = await API.delete(`${baseURL}/deleteAttendance/${id}`);
    return response.data;
  } catch (error) {
    return;
  }
};

export const addAttendanceAPI = async (body: {}, studentId: number) => {
  try {
    const response = await API.post(
      `${baseURL}/addAttendance/${studentId}`,
      body
    );
    return response.data;
  } catch (error) {
    return;
  }
};

export const modifyAttendanceAPI = async (body: {}) => {
  try {
    const response = await API.post(
      `${baseURL}/updateAttendance/`,
      body
    );
    return response.data;
  } catch (error) {
    return;
  }
};
