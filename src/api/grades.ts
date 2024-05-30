import axios from "axios";

const baseURL = "http://localhost:8080/grades";
const API = axios.create();

export const getGradeByStudentAPI = async (studentId: number) => {
  try {
    const response = await API.get(`${baseURL}/myGrade/${studentId}`);
    return response.data;
  } catch (error) {
    return;
  }
};

export const addGradeToStudentAPI = async (body: {}) => {
  try {
    const response = await API.post(`${baseURL}/addGrade`, body);
    return response.data;
  } catch (error) {
    return;
  }
};

export const deleteGradeByStudentAPI = async (id: number) => {
  try {
    const response = await API.delete(`${baseURL}/deleteGrade/${id}`);
    return response.data;
  } catch (error) {
    return;
  }
};

export const getGradesForSubjectAPI = async (
  studentId: number,
  subjectId: number
) => {
  try {
    const response = await API.get(
      `${baseURL}/getSubjectGrade/${studentId}/${subjectId}`
    );
    return response.data;
  } catch (error) {
    return;
  }
};

export const getAvarageGradeForSubjectAPI = async (
    studentId: number,
    subjectId: number
  ) => {
    try {
      const response = await API.get(
        `${baseURL}/getAverageGrade/${studentId}/${subjectId}`
      );
      return response.data;
    } catch (error) {
      return;
    }
  };

export const updateGradeToStudentAPI = async (body: {}) => {
    try {
      const response = await API.put(`${baseURL}/updateGrade`, body);
      return response.data;
    } catch (error) {
      return;
    }
  };
