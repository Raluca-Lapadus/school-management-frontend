import { ReactNode } from "react";
import BannerInfo from "../components/BannerInfo/BannerInfo";
import { useErrorStore } from "../stores/error-store/error.store";
import classes from './PageLayout.module.scss';

const PageLayout: React.FC<{children: ReactNode}> = ({ children }) => {
  const { bannerInfo } = useErrorStore();

  return (
    <div className={classes.layoutPage}>
      {bannerInfo.message && (
        <BannerInfo
          severity={bannerInfo.severity}
          message={bannerInfo.message}
        />
      )}
      <div className={classes.content}>{children}</div>
    </div>
  );
};

export default PageLayout;
