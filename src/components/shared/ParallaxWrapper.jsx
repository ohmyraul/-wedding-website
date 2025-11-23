import { memo, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

const ParallaxWrapper = memo(({ 
  children, 
  offset = 50, 
  className = '', 
  hoverEffect = false 
}) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start']
  });

  const y = useTransform(scrollYProgress, [0, 1], [offset, -offset]);
  const smoothY = useSpring(y, { stiffness: 120, damping: 20, mass: 0.2 });

  return (
    <motion.div 
      ref={ref} 
      style={{ y: smoothY }} 
      className={className}
      whileHover={hoverEffect ? { scale: 1.02, rotate: 0 } : undefined}
      whileTap={hoverEffect ? { scale: 0.98 } : undefined}
      transition={hoverEffect ? { type: 'spring', stiffness: 220, damping: 18 } : undefined}
    >
      {children}
    </motion.div>
  );
});

ParallaxWrapper.displayName = 'ParallaxWrapper';

export default ParallaxWrapper;

