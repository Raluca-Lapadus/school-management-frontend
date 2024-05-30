import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import Loader from "../../components/Loader/Loader";
import { useErrorStore } from "../../stores/error-store/error.store";
import { useFormik } from "formik";
import { getSubjectsAPI } from "../../api/subjects";
import * as Yup from "yup";
import classes from "./TeacherD.module.scss";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import {
  addAttendanceAPI,
  deleteAttendanceAPI,
  getAttendancesAPI,
} from "../../api/attendance";
import { getStudentsAPI } from "../../api/students";
import DeleteIcon from '@mui/icons-material/Delete';

export const AddAttendanceValidationSchema = Yup.object().shape({
  date: Yup.string().required("Required"),
  studentId: Yup.number().required("Required"),
  subjectId: Yup.number().required("Required"),
});

export const ViewAttendanceValidationSchema = Yup.object().shape({
  studentId: Yup.number().required("Required"),
  subjectId: Yup.number().required("Required"),
});

const Attendance: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [attendances, setAttendances] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [students, setStudents] = useState([]);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);
  const { setInfoBanner } = useErrorStore();

  const formik = useFormik({
    initialValues: {
      studentId: 0,
      date: "",
      subjectId: 0,
    },
    validationSchema: AddAttendanceValidationSchema,
    onSubmit: async (values) => {
      try {
        await addAttendanceAPI(
          { subjectId: values.subjectId, date: values.date },
          values.studentId
        );
        getAttendances(values.studentId, values.subjectId);
        setInfoBanner('Successfully added!', 'Success')
      } finally {
        setIsLoading(false);
      }
    },
  });

  const formikViewAttendances = useFormik({
    initialValues: {
      studentId: 0,
      subjectId: 0,
    },
    validationSchema: ViewAttendanceValidationSchema,
    onSubmit: async (values) => {
      try {
        const res = await getAttendancesAPI(values.studentId, values.subjectId);
        setAttendances(res);
      } finally {
        setIsLoading(false);
      }
    },
  });

  useEffect(() => {
    getSubjects();
    getStudents();
  }, [currentPage, rowsPerPage]);

  const getAttendances = async (studentId: number, subjectId: number) => {
    try {
      const res = await getAttendancesAPI(studentId, subjectId);
      setAttendances(res);
    } finally {
      setIsLoading(false);
    }
  };

  const getSubjects = async () => {
    try {
      const subjects = await getSubjectsAPI();
      setSubjects(subjects);
    } finally {
      setIsLoading(false);
    }
  };

  const getStudents = async () => {
    try {
      const students = await getStudentsAPI();
      setStudents(students);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteAttendance = async (id: number) => {
    try {
      await deleteAttendanceAPI(id);
      const newAtt = [...attendances];
      const idx = newAtt.findIndex((elem: any) => elem.id === id);
      if (idx !== -1) {
        newAtt.splice(idx, 1);
      }
      setAttendances([...newAtt]);
      setInfoBanner('Successfully deleted!', 'Success')
    } catch (error: any) {
      setInfoBanner("There is an error", "Error");
    }
  };

  const handleChangePage = (_event: unknown, newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    setCurrentPage(0);
  };

  if (isLoading) return <Loader />;

  return (
    <div className={classes.containerPage}>
      <div className={classes.containerAddTeacher}>
        <Typography variant="h4">Add absence <AddCircleIcon /></Typography>
        <form>
          <div className={classes.container}>
            <FormControl fullWidth>
              <InputLabel id="studentId">Student</InputLabel>
              <Select
                labelId="studentId"
                id="studentId"
                value={formik.values.studentId || ""}
                label="Student"
                onChange={(ev) =>
                  formik.setFieldValue("studentId", ev?.target.value)
                }
              >
                {students.map(
                  (student: {
                    id: number;
                    firstName: string;
                    lastName: string;
                  }) => (
                    <MenuItem key={student.id} value={student.id}>
                      {student.firstName} {student.lastName}
                    </MenuItem>
                  )
                )}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel id="subjectId">Subject</InputLabel>
              <Select
                labelId="subjectId"
                id="subjectId"
                value={formik.values.subjectId || ""}
                label="Subject"
                onChange={(ev) =>
                  formik.setFieldValue("subjectId", ev?.target.value)
                }
              >
                {subjects.map((subject: { id: number; name: string }) => (
                  <MenuItem key={subject.id} value={subject.id}>
                    {subject.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              id="date"
              fullWidth
              required
              variant="outlined"
              name={"date"}
              type="date"
              value={formik.values.date || ""}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {isLoading && <Loader />}
            {!isLoading && (
              <Button
                variant="contained"
                onClick={formik.submitForm}
                disabled={!formik.isValid}
              >
                Submit
              </Button>
            )}
          </div>
        </form>
      </div>

      <div className={classes.containerAddTeacher}>
        <Typography variant="h4">View absence</Typography>
        <form>
          <div className={classes.container}>
            <FormControl fullWidth>
              <InputLabel id="studentId">Student</InputLabel>
              <Select
                labelId="studentId"
                id="studentId"
                value={formikViewAttendances.values.studentId || ""}
                label="Student"
                onChange={(ev) =>
                  formikViewAttendances.setFieldValue(
                    "studentId",
                    ev?.target.value
                  )
                }
              >
                {students.map(
                  (student: {
                    id: number;
                    firstName: string;
                    lastName: string;
                  }) => (
                    <MenuItem key={student.id} value={student.id}>
                      {student.firstName} {student.lastName}
                    </MenuItem>
                  )
                )}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel id="subjectId">Subject</InputLabel>
              <Select
                labelId="subjectId"
                id="subjectId"
                value={formikViewAttendances.values.subjectId || ""}
                label="Subject"
                onChange={(ev) =>
                  formikViewAttendances.setFieldValue(
                    "subjectId",
                    ev?.target.value
                  )
                }
              >
                {subjects.map((subject: { id: number; name: string }) => (
                  <MenuItem key={subject.id} value={subject.id}>
                    {subject.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {/* date input */}
            {isLoading && <Loader />}
            {!isLoading && (
              <Button
                variant="contained"
                onClick={formikViewAttendances.submitForm}
                disabled={!formikViewAttendances.isValid}
              >
                Submit
              </Button>
            )}
          </div>
        </form>
      </div>
      <TableContainer>
        <Typography variant="h3">Absences</Typography>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Delete</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <Loader />
                </TableCell>
              </TableRow>
            ) : (
              <>
                {attendances.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      There is no data
                    </TableCell>
                  </TableRow>
                )}
                {attendances
                  .slice(
                    currentPage * rowsPerPage,
                    currentPage * rowsPerPage + rowsPerPage
                  )
                  .map((attendance: any) => (
                    <TableRow key={attendance.id}>
                      <TableCell>{attendance.id}</TableCell>
                      <TableCell>{attendance.date}</TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          onClick={() => deleteAttendance(attendance.id)}
                        >
                          <DeleteIcon /> Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
              </>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={attendances?.length || 0}
        rowsPerPage={rowsPerPage}
        page={currentPage}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </div>
  );
};
export default Attendance;
