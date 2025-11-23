const Postcard = ({ children, className = '' }) => {
  return <div className={`postcard ${className}`}>{children}</div>;
};

export default Postcard;


