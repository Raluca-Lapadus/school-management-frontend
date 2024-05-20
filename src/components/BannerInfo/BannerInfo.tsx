import Typography from "@mui/material/Typography/Typography";
import { useErrorStore } from "../../stores/error-store/error.store";
import classNames from "classnames";
import CloseIcon from '@mui/icons-material/Close';
import classes from './BannerInfo.module.scss'

export interface BannerInfoInterface {
  message: string;
  severity: string;
}

const BannerInfo: React.FC<BannerInfoInterface> = ({message, severity}) => {
    const { setInfoBanner  } = useErrorStore();
    
    const backgroundBanner = classNames( {
      error: severity === 'Error',
      success: severity === "Success",
    });
  
    const closeInfo = () => {
      setInfoBanner("", "");
    };
  
    return (
      <div className={`${classes[backgroundBanner]} ${classes.layoutCard}`}>
        <Typography>{message}</Typography>
        <CloseIcon onClick={closeInfo} />
      </div>
    );
  };
export default BannerInfo;