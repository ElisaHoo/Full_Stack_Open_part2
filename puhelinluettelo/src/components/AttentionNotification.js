const AttentionNotification = ({ message }) => {
  if (message === null || message === "") {
    return null;
  }

  return <div className="attention">{message}</div>;
};

export default AttentionNotification;
