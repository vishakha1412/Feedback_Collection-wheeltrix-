import React, { useState } from "react";
import { motion } from "framer-motion";

 
const StarRating = ({ value = 0, onChange, readOnly = false, size = "text-2xl" }) => {
  const [hoverValue, setHoverValue] = useState(0);
  const stars = [1, 2, 3, 4, 5];

  return (
    <div className={`inline-flex gap-1 ${size}`}>
      {stars.map((star) => {
        const filled = readOnly ? star <= value : star <= (hoverValue || value);

        return (
          <motion.span
            key={star}
            whileHover={!readOnly ? { scale: 1.25 } : {}}
            whileTap={!readOnly ? { scale: 0.9 } : {}}
            onClick={() => !readOnly && onChange && onChange(star)}
            onMouseEnter={() => !readOnly && setHoverValue(star)}
            onMouseLeave={() => !readOnly && setHoverValue(0)}
            className={`${filled ? "text-amber-400" : "text-gray-300"} ${
              readOnly ? "" : "cursor-pointer"
            } transition-colors`}
          >
            &#9733;
          </motion.span>
        );
      })}
    </div>
  );
};

export default StarRating;
