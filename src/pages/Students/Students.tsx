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
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { useEffect, useState } from "react";
import Loader from "../../components/Loader/Loader";
import { useErrorStore } from "../../stores/error-store/error.store";
import { useFormik } from "formik";
import * as Yup from "yup";
import classes from "./Students.module.scss";
import { addStudentAPI, getStudentsAPI } from "../../api/students";

export const AddStudentValidationSchema = Yup.object().shape({
  firstName: Yup.string().required("Required"),
  lastName: Yup.string().max(30, "Too Long!").required("Required"),
  email: Yup.string().required("Required"),
  profile: Yup.string().required("Required"),
  age: Yup.number().required("Required"),
});

const Students: React.FC<{getStudentIdForGrade: (id: number) => void}> = ({getStudentIdForGrade}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [students, setStudents] = useState([]);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);
  const { setInfoBanner } = useErrorStore();

  const formik = useFormik({
    initialValues: {
      lastName: "",
      firstName: "",
      profile: 0,
      email: "",
      age: 0,
    },
    validationSchema: AddStudentValidationSchema,
    onSubmit: async (values) => {
      try {
        await addStudentAPI(values);
        getStudents();
        setInfoBanner("Successfully added!", "Success");
      } finally {
        setIsLoading(false);
      }
    },
  });

  useEffect(() => {
    getStudents();
  }, [currentPage, rowsPerPage]);

  const getStudents = async () => {
    try {
      const teachers = await getStudentsAPI();
      setStudents(teachers);
    } finally {
      setIsLoading(false);
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

  const getStudentId = (id: number) => {
    getStudentIdForGrade(id);
  }

  if (isLoading) return <Loader />;

  return (
    <div className={classes.containerPage}>
      <div className={classes.containerAddTeacher}>
        <Typography variant="h4">Add student <AddCircleIcon /></Typography>
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
              id="age"
              fullWidth
              label="Age"
              required
              type="number"
              variant="outlined"
              name={"age"}
              value={formik.values.age || ""}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            <TextField
              id="email"
              fullWidth
              label="Email"
              required
              variant="outlined"
              name={"email"}
              value={formik.values.email || ""}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            <FormControl fullWidth>
              <InputLabel id="profile">Profile</InputLabel>
              <Select
                labelId="profile"
                id="profile"
                value={formik.values.profile || ""}
                label="Profile"
                onChange={(ev) =>
                  formik.setFieldValue("profile", ev?.target.value)
                }
              >
                <MenuItem value={"0"}>Real</MenuItem>
                <MenuItem value={"1"}>Uman</MenuItem>
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
      <TableContainer>
        <Typography variant="h3">Students</Typography>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>First Name</TableCell>
              <TableCell>Last Name</TableCell>
              <TableCell>Profile</TableCell>
              <TableCell>Age</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Grades</TableCell>
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
                {students.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      There is no data
                    </TableCell>
                  </TableRow>
                )}
                {students
                  .slice(
                    currentPage * rowsPerPage,
                    currentPage * rowsPerPage + rowsPerPage
                  )
                  .map((student: any) => (
                    <TableRow key={student.id}>
                      <TableCell>{student.id}</TableCell>
                      <TableCell>{student.firstName}</TableCell>
                      <TableCell>{student.lastName}</TableCell>
                      <TableCell>{student.profile}</TableCell>
                      <TableCell>{student.age}</TableCell>
                      <TableCell>{student.email}</TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          onClick={() => getStudentId(student.id)}
                        >
                          Grades
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
        count={students?.length || 0}
        rowsPerPage={rowsPerPage}
        page={currentPage}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </div>
  );
};
export default Students;
