import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { deleteTeachersAPI, getTeachersAPI } from "../../api/teachers";
import Loader from "../../components/Loader/Loader";
import { useErrorStore } from "../../stores/error-store/error.store";

const TeacherD: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [teachers, setTeachers] = useState([]);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);
  const { setInfoBanner } = useErrorStore();

  useEffect(() => {
    getTeachers();
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

  const deleteTeacher = async (id: number) => {
    try {
      await deleteTeachersAPI(id);
      getTeachers();
    } catch (error: any) {
      setInfoBanner('There is an error', 'Error');
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
    <>
      <TableContainer>
        <Typography variant="h3">Teacher and Attendances</Typography>
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
                        <Button variant="contained" onClick={() => deleteTeacher(teacher.id)}>Delete</Button>
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
    </>
  );
};
export default TeacherD;
