import { memo, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const FadeInWhenVisible = memo(({ children, delay = 0, className = '' }) => {
  const controls = useAnimation();
  const [ref, inView] = useInView({ 
    triggerOnce: true, 
    threshold: 0.1, 
    rootMargin: '100px' 
  });

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [inView, controls]);

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={controls}
      variants={{
        hidden: { opacity: 0, y: 30 },
        visible: { 
          opacity: 1, 
          y: 0,
          transition: { duration: 0.4, delay, ease: [0.25, 0.1, 0.25, 1] }
        }
      }}
    >
      {children}
    </motion.div>
  );
});

FadeInWhenVisible.displayName = 'FadeInWhenVisible';

export default FadeInWhenVisible;


