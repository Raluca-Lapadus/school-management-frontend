import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import classes from './Loader.module.scss';
import { CircularProgressProps } from '@mui/material/CircularProgress/CircularProgress';

const Loader: React.FC<CircularProgressProps> = (props) => {
  return (
    <div className={classes.loaderWrapper}>
      <CircularProgress size={50} {...props} />
    </div>
  );
};

export default Loader;
