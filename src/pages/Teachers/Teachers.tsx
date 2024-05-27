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
import {
  addTeacherAPI,
  deleteTeachersAPI,
  getTeachersAPI,
} from "../../api/teachers";
import Loader from "../../components/Loader/Loader";
import { useErrorStore } from "../../stores/error-store/error.store";
import { useFormik } from "formik";
import { getSubjectsAPI } from "../../api/subjects";
import * as Yup from "yup";
import classes from "./TeacherD.module.scss";

export const AddTeacherValidationSchema = Yup.object().shape({
  firstName: Yup.string().required("Required"),
  lastName: Yup.string().max(30, "Too Long!").required("Required"),
  numberOfOlympics: Yup.number().required("Required"),
  yearsOfExperience: Yup.number().required("Required"),
  subjectId: Yup.number().required("Required"),
});

const Teachers: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [teachers, setTeachers] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);
  const { setInfoBanner } = useErrorStore();
  const [chosenSubject, setChosenSubject] = useState<string>('');

  const formik = useFormik({
    initialValues: {
      lastName: "",
      firstName: "",
      numberOfOlympics: "",
      yearsOfExperience: "",
      subjectId: 0,
    },
    validationSchema: AddTeacherValidationSchema,
    onSubmit: async (values) => {
      try {
        await addTeacherAPI(values);
        getTeachers();
      } finally {
        setIsLoading(false);
      }
    },
  });

  useEffect(() => {
    getTeachers();
    getSubjects();
  }, [currentPage, rowsPerPage]);

  const getTeachers = async () => {
    try {
      const teachers = await getTeachersAPI();
      setTeachers(teachers);
      console.log(teachers);
    } finally {
      setIsLoading(false);
    }
  };

  const getSubjects = async () => {
    try {
      const res = await getSubjectsAPI();
      setSubjects(res);
      console.log(res);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteTeacher = async (id: number) => {
    try {
      await deleteTeachersAPI(id);
      getTeachers();
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

  const handleFilter = async (value: string) => {
    setChosenSubject(value);
    const res = await getTeachersAPI();
    const newTeachers = res.filter((teacher: {subject: {name: string}}) => teacher.subject.name === value);
    setTeachers(newTeachers);
  }

  if (isLoading) return <Loader />;

  return (
    <div className={classes.containerPage}>
      <div className={classes.containerAddTeacher}>
        <Typography variant="h4">Add teacher</Typography>
        <form>
          <div className={classes.container}>
            <TextField
              id="firstName"
              fullWidth
              label="First Name"
              required
              variant="outlined"
              name={"firstName"}
              value={formik.values.firstName || ""}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            <TextField
              id="lastName"
              fullWidth
              label="Last Name"
              required
              variant="outlined"
              name={"lastName"}
              value={formik.values.lastName || ""}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            <TextField
              id="numberOfOlympics"
              fullWidth
              label="Number of olympics"
              required
              type="number"
              variant="outlined"
              name={"numberOfOlympics"}
              value={formik.values.numberOfOlympics || ""}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            <TextField
              id="yearsOfExperience"
              fullWidth
              label="Years of experience"
              required
              type="number"
              variant="outlined"
              name={"yearsOfExperience"}
              value={formik.values.yearsOfExperience || ""}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
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
      <div className={classes.containerFilters}>
      <Typography variant="h4">Filter teachers</Typography>
        <FormControl fullWidth>
          <InputLabel id="subjectId">Subject</InputLabel>
          <Select
            labelId="subjectId"
            id="subjectId"
            value={chosenSubject || ""}
            label="Subject"
            onChange={(ev) => handleFilter(ev.target.value)}
          >
            {subjects.map((subject: { id: number; name: string }) => (
              <MenuItem key={subject.id} value={subject.name}>
                {subject.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
      <TableContainer>
        <Typography variant="h3">Teachers</Typography>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Years of experience</TableCell>
              <TableCell>First Name</TableCell>
              <TableCell>Last Name</TableCell>
              <TableCell>Number of olympics</TableCell>
              <TableCell>Subject</TableCell>
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
                {teachers.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      There is no data
                    </TableCell>
                  </TableRow>
                )}
                {teachers
                  .slice(
                    currentPage * rowsPerPage,
                    currentPage * rowsPerPage + rowsPerPage
                  )
                  .map((teacher: any) => (
                    <TableRow key={teacher.id}>
                      <TableCell>{teacher.id}</TableCell>
                      <TableCell>{teacher.yearsOfExperience}</TableCell>
                      <TableCell>{teacher.firstName}</TableCell>
                      <TableCell>{teacher.lastName}</TableCell>
                      <TableCell>{teacher.numberOfOlympics}</TableCell>
                      <TableCell>{teacher.subject?.name || "null"}</TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          onClick={() => deleteTeacher(teacher.id)}
                        >
                          Delete
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
        count={teachers?.length || 0}
        rowsPerPage={rowsPerPage}
        page={currentPage}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </div>
  );
};
export default Teachers;
