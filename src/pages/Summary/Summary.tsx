import { Box, Button, Container, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import styles from './Summary.module.scss';
import SchoolIcon from '@mui/icons-material/School';

const Summary: React.FC = () => {
    const navigate = useNavigate();
    
  return (
    <Container className={styles.container}>
      <Typography className={styles.title}>
        Welcome to our app <SchoolIcon/> , please choose your role
      </Typography>
      <Box className={styles.buttonGroup}>
        <Button
          className={styles.button}
          variant="contained"
          onClick={() => navigate('/teachers-dashboard')}
        >
          Teachers
        </Button>
        <Button
          className={styles.button}
          variant="contained"
          onClick={() => navigate('/students-dashboard')}
        >
          Students
        </Button>
      </Box>
    </Container>
  );
};
export default Summary;
