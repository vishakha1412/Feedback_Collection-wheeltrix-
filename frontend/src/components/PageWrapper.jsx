import React from "react";
import { motion } from "framer-motion";
import { CircleAnimation } from "../Animation/CircleAnimation";

const PageWrapper = ({ children, className = "" }) => {
  return (
    <div className='bg-gradient-to-br from-green-100 via-white to-blue-200 h-full pt-5 min-h-screen bg-cover bg-center'
      
            style={{ backgroundImage: "url('/bg1.jpg')"}}>
      
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
</div>
  );
};

export default PageWrapper;
