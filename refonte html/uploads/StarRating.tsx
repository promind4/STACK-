import React from "react";
import { Star, StarHalf } from "lucide-react";

interface StarRatingProps {
    rating: number;
    size?: number;
    className?: string;
}

export const StarRating: React.FC<StarRatingProps> = ({
    rating,
    size = 16,
    className = "",
}) => {
    const roundedRating = Math.round(rating * 2) / 2;

    const renderStar = (index: number) => {
        if (index <= roundedRating) {
            return (
                <Star
                    key={index}
                    size={size}
                    className="fill-amber-500 text-amber-500"
                />
            );
        } else if (index - 0.5 === roundedRating) {
            return (
                <StarHalf
                    key={index}
                    size={size}
                    className="fill-amber-500 text-amber-500"
                />
            );
        } else {
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
