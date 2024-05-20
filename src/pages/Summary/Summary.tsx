import { Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Summary: React.FC = () => {
    const navigate = useNavigate();
    
  return (
    <>
    <Typography>Please select your role</Typography>
      <Button variant="contained" onClick={() =>  navigate('/teachers-dashboard')}>Teachers</Button>
      <Button variant="contained" onClick={() =>  navigate('/students-dashboard')}>Students</Button>
    </>
  );
};
export default Summary;
