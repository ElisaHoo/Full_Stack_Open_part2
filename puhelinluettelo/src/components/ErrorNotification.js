const ErrorNotification = ({ message }) => {
  // If message's value is null, nothing is rendered.
  if (message === null || message === "") {
    return null;
  }

  return <div className="error">{message}</div>;
};

export default ErrorNotification;
