import React from 'react';
import { Star, StarHalf } from 'lucide-react';

interface StarRatingProps {
    rating: number; // The product rating (e.g., 4.6)
    size?: number; // Icon size in pixels
    className?: string; // Additional classes for the container
    showCount?: boolean; // Whether to separate distinct stars or just the visual
}

export const StarRating: React.FC<StarRatingProps> = ({
    rating,
    size = 16,
    className = ''
}) => {
    // Round to nearest 0.5
    // e.g. 4.6 -> 4.5
    // 4.2 -> 4.0
    // 4.8 -> 5.0
    const roundedRating = Math.round(rating * 2) / 2;

    // Generate stars
    const renderStar = (index: number) => {
        // index is 1, 2, 3, 4, 5
        if (index <= roundedRating) {
            // Full star (e.g. index 4 <= 4.5)
            return (
                <Star
                    key={index}
                    size={size}
                    className="fill-amber-500 text-amber-500"
                />
            );
        } else if (index - 0.5 === roundedRating) {
            // Half star (e.g. index 5 - 0.5 === 4.5)
            return (
                <StarHalf
                    key={index}
                    size={size}
                    className="fill-amber-500 text-amber-500"
                />
            );
        } else {
            // Empty star
            return (
                <Star
                    key={index}
                    size={size}
                    className="fill-transparent text-neutral-300"
                />
            );
        }
    };

    return (
        <div className={`flex items-center gap-0.5 ${className}`}>
            {[1, 2, 3, 4, 5].map((idx) => renderStar(idx))}
        </div>
    );
};
