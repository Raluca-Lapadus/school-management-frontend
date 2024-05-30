import { ReactNode } from "react";
import BannerInfo from "../components/BannerInfo/BannerInfo";
import { useErrorStore } from "../stores/error-store/error.store";
import classes from './PageLayout.module.scss';
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const PageLayout: React.FC<{children: ReactNode}> = ({ children }) => {
  const { bannerInfo } = useErrorStore();
  const navigate = useNavigate();

  return (
    <div className={classes.layoutPage}>
      {bannerInfo.message && (
        <BannerInfo
          severity={bannerInfo.severity}
          message={bannerInfo.message}
        />
      )}
      <Button variant='text' onClick={() => navigate('summary')}><ArrowBackIcon />Back summary</Button>
      <div className={classes.content}>{children}</div>
    </div>
  );
};

export default PageLayout;
