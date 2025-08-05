import classes from "./ErrorMessage.module.css";

const ErrorMessage = ({ children }: { children: React.ReactNode }) => {
  return <div className={classes.btnError}>{children}</div>;
};

export default ErrorMessage;
