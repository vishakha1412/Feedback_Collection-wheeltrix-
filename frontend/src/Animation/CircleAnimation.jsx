import { motion } from "framer-motion";

export const CircleAnimation = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(25)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-6 h-6 rounded-full"
          style={{
            background: "radial-gradient(circle, pink, lavender, teal)",
          }}
          initial={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            rotate: Math.random() * 360,
            scale: Math.random() * 0.8 + 0.5,
          }}
          animate={{
            y: [null, -150],
            rotate: [null, Math.random() * 360],
            opacity: [1, 0],
          }}
          transition={{
            duration: Math.random() * 8 + 5,
            repeat: Infinity,
            delay: Math.random() * 5,
          }}
        />
      ))}
    </div>
  );
};
