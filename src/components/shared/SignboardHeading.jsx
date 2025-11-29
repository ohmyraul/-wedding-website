const SignboardHeading = ({ children, variant = 'light' }) => {
  return (
    <div 
      className={`signboard ${variant === 'dark' ? 'signboard--dark' : ''}`}
      role="heading"
      aria-level="2"
      tabIndex={-1}
      onMouseDown={(e) => e.preventDefault()}
      onClick={(e) => e.preventDefault()}
    >
      <h2 className="signboard__text">{children}</h2>
    </div>
  );
};

export default SignboardHeading;


