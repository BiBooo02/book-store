import { useState } from 'react';
import { Star } from 'lucide-react';

const Rating = ({ rating = 0, onRatingChange, readonly = false, size = 'sm' }) => {
  const [hover, setHover] = useState(0);
  
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`${sizeClasses[size]} cursor-pointer transition-all duration-200 ${
            (hover || rating) >= star
              ? 'text-yellow-400 fill-yellow-400'
              : 'text-gray-300'
          }`}
          onClick={() => !readonly && onRatingChange?.(star)}
          onMouseEnter={() => !readonly && setHover(star)}
          onMouseLeave={() => !readonly && setHover(0)}
        />
      ))}
      {rating > 0 && (
        <span className="ml-1 text-sm text-gray-600">({rating.toFixed(1)})</span>
      )}
    </div>
  );
};

export default Rating;