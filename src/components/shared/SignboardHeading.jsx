const SignboardHeading = ({ children, variant = 'light' }) => {
  return (
    <div className={`signboard ${variant === 'dark' ? 'signboard--dark' : ''}`}>
      <h2 className="signboard__text">{children}</h2>
    </div>
  );
};

export default SignboardHeading;


