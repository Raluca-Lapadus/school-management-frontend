import {
    AppBar,
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
    Toolbar,
    Typography,
  } from "@mui/material";
  import { useEffect, useState } from "react";
  import Loader from "../../components/Loader/Loader";
  import { useErrorStore } from "../../stores/error-store/error.store";
  import { useFormik } from "formik";
  import { getSubjectsAPI } from "../../api/subjects";
  import * as Yup from "yup";
  import classes from "./Grades.module.scss";
  import {
    addGradeToStudentAPI,
    deleteGradeByStudentAPI,
    getAvarageGradeForSubjectAPI,
    getGradeByStudentAPI,
    getGradesForSubjectAPI,
    updateGradeToStudentAPI,
  } from "../../api/grades";
  import { getStudentsAPI } from "../../api/students";
  import { Link } from 'react-scroll';
  import ModeEditIcon from '@mui/icons-material/ModeEdit';
  import CheckIcon from '@mui/icons-material/Check';
  import DeleteIcon from '@mui/icons-material/Delete';
  import AddCircleIcon from '@mui/icons-material/AddCircle';
  import FilterAltIcon from '@mui/icons-material/FilterAlt';

  export const AddGradeValidationSchema = Yup.object().shape({
    grade: Yup.number().required("Required"),
    studentId: Yup.number().required("Required"),
    subjectId: Yup.number().required("Required"),
  });
  
  export const FilterGradeValidationSchema = Yup.object().shape({
    studentId: Yup.number().required("Required"),
    subjectId: Yup.number().required("Required"),
  });
  
  const Grades: React.FC<{ studentId: number | null }> = ({ studentId }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [grades, setGrades] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [students, setStudents] = useState([]);
    const [currentPage, setCurrentPage] = useState<number>(0);
    const [rowsPerPage, setRowsPerPage] = useState<number>(5);
    const { setInfoBanner } = useErrorStore();
    const [filteredGrades, setFilteredGrades] = useState([]);
    const [updatingGrade, setUpdatingGrade] = useState<null | number>(null);
    const [newGrade, setNewgrade] = useState<number>();
    const [avarage, setAvarage] = useState<number>();
  
    const formik = useFormik({
      initialValues: {
        studentId: 0,
        grade: 0,
        subjectId: 0,
      },
      validationSchema: AddGradeValidationSchema,
      onSubmit: async (values) => {
        try {
          await addGradeToStudentAPI(values);
          getGrades();
          setInfoBanner("Successfully added!", "Success");
        } finally {
          setIsLoading(false);
        }
      },
    });
  
    const formikFilters = useFormik({
      initialValues: {
        studentId: 0,
        subjectId: 0,
      },
      validationSchema: FilterGradeValidationSchema,
      onSubmit: async (values) => {
        try {
          const res = await getGradesForSubjectAPI(
            values.studentId,
            values.subjectId
          );
          setFilteredGrades(res);
          setInfoBanner("Successfully filtered!", "Success");
        } finally {
          setIsLoading(false);
        }
  
        try {
          const resAvarager = await getAvarageGradeForSubjectAPI(
            values.studentId,
            values.subjectId
          );
          setAvarage(resAvarager);
          setInfoBanner("Successfully filtered!", "Success");
        } finally {
          setIsLoading(false);
        }
      },
    });
  
    useEffect(() => {
      getSubjects();
      getStudents();
    }, [currentPage, rowsPerPage, studentId]);
  
    useEffect(() => {
      getGrades();
    }, [studentId]);
  
    const getGrades = async () => {
      if (studentId) {
        setIsLoading(true);
        try {
          const studentGrades = await getGradeByStudentAPI(studentId);
          setGrades(studentGrades);
        } finally {
          setIsLoading(false);
        }
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
  
    const getSubjects = async () => {
      try {
        const res = await getSubjectsAPI();
        setSubjects(res);
      } finally {
        setIsLoading(false);
      }
    };
  
    const deleteGrade = async (id: number) => {
      try {
        await deleteGradeByStudentAPI(id);
        getGrades();
        setInfoBanner("Successfully deleted!", "Success");
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
  
    const updateGrade = async (id: number) => {
      try {
        setUpdatingGrade(null);
          await updateGradeToStudentAPI({gradeId: id, newGrade: newGrade});
          getGrades();
      } finally {
        setIsLoading(false);
      }
    };
  
    if (isLoading) return <Loader />;
  
    return (
      <div className={classes.containerPage}>
        <AppBar position="static">
        <Toolbar>
          <Link to="add-grade" smooth={true} duration={500} className={classes.navLink}>
            <Button color="inherit">Add Grade</Button>
          </Link>
          <Link to="grades-list" smooth={true} duration={500} className={classes.navLink}>
            <Button color="inherit">Grades List</Button>
          </Link>
          <Link to="filter-grades" smooth={true} duration={500} className={classes.navLink}>
            <Button color="inherit">Filter Grades</Button>
          </Link>
          <Link to="average-grade" smooth={true} duration={500} className={classes.navLink}>
            <Button color="inherit">Average Grade</Button>
          </Link>
        </Toolbar>
      </AppBar>
  
        <div id="add-grade" className={classes.containerAddTeacher}>
          <Typography variant="h4">Add grade <AddCircleIcon /></Typography>
          <form>
            <div className={classes.container}>
              <FormControl fullWidth>
                <InputLabel id="studentId">Students</InputLabel>
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
              <TextField
                id="grade"
                fullWidth
                label="Grade"
                required
                type="number"
                variant="outlined"
                name={"grade"}
                value={formik.values.grade || ""}
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
  
        <div id="grades-list">
          <Typography variant="h3">Grades</Typography>
          <TableContainer>
            <Table aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>First Name</TableCell>
                  <TableCell>Last Name</TableCell>
                  <TableCell>Subject</TableCell>
                  <TableCell>Grade</TableCell>
                  <TableCell>Profile</TableCell>
                  <TableCell>Delete</TableCell>
                  <TableCell>Update</TableCell>
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
                    {grades.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={7} align="center">
                          There is no data
                        </TableCell>
                      </TableRow>
                    )}
                    {grades
                      .slice(
                        currentPage * rowsPerPage,
                        currentPage * rowsPerPage + rowsPerPage
                      )
                      .map((grade: any) => (
                        <TableRow key={grade.id}>
                          <TableCell>{grade.id}</TableCell>
                          <TableCell>{grade.student.firstName}</TableCell>
                          <TableCell>{grade.student.lastName}</TableCell>
                          <TableCell>{grade.student.profile}</TableCell>
                          <TableCell>{grade.subject?.name || "null"}</TableCell>
                          {!updatingGrade && <TableCell>{grade.grade}</TableCell>}
                          {updatingGrade === grade.id && (
                            <TableCell>
                              <TextField
                                id="grade"
                                fullWidth
                                label="Grade"
                                required
                                type="number"
                                variant="outlined"
                                name={"grade"}
                                value={newGrade || ""}
                                onChange={(ev) =>
                                  setNewgrade(parseInt(ev.target.value))
                                }
                              />
                            </TableCell>
                          )}
                          <TableCell>
                            <Button
                              variant="contained"
                              onClick={() => deleteGrade(grade.id)}
                            >
                              <DeleteIcon /> Delete
                            </Button>
                          </TableCell>
                          {!updatingGrade && (
                            <TableCell>
                              <Button
                                variant="contained"
                                onClick={() => setUpdatingGrade(grade.id)}
                              >
                                <ModeEditIcon /> Update
                              </Button>
                            </TableCell>
                          )}
                          {updatingGrade && (
                            <TableCell>
                              <Button
                                variant="contained"
                                onClick={() => updateGrade(grade.id)}
                              >
                                <CheckIcon /> Save
                              </Button>
                            </TableCell>
                          )}
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
            count={grades?.length || 0}
            rowsPerPage={rowsPerPage}
            page={currentPage}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </div>
  
        <div id="filter-grades">
          <form>
            <Typography variant="h4">Filter grades <FilterAltIcon /></Typography>
            <div className={classes.containerFilters}>
              <FormControl fullWidth>
                <InputLabel id="studentId">Students</InputLabel>
                <Select
                  labelId="studentId"
                  id="studentId"
                  value={formikFilters.values.studentId || ""}
                  label="Student"
                  onChange={(ev) =>
                    formikFilters.setFieldValue("studentId", ev?.target.value)
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
                  value={formikFilters.values.subjectId || ""}
                  label="Subject"
                  onChange={(ev) =>
                    formikFilters.setFieldValue("subjectId", ev?.target.value)
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
                  onClick={formikFilters.submitForm}
                  disabled={!formikFilters.isValid}
                >
                  Submit
                </Button>
              )}
            </div>
          </form>
        </div>
  
        <div id="average-grade">
          <Typography variant="h5">
            Average for the chosen subject: {avarage}
          </Typography>
        </div>
  
        <TableContainer>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Grade</TableCell>
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
                  {filteredGrades.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} align="center">
                        There is no data
                      </TableCell>
                    </TableRow>
                  )}
                  {filteredGrades
                    .slice(
                      currentPage * rowsPerPage,
                      currentPage * rowsPerPage + rowsPerPage
                    )
                    .map((grade: any) => (
                      <TableRow key={grade.id}>
                        <TableCell>{grade.id}</TableCell>
                        <TableCell>{grade.grade}</TableCell>
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
          count={filteredGrades?.length || 0}
          rowsPerPage={rowsPerPage}
          page={currentPage}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </div>
    );
  };
  export default Grades;
  