import { Star } from "lucide-react";

interface StarRatingProps {
  rating: number;
  reviewCount?: number;
  size?: number;
}

const StarRating = ({ rating, reviewCount, size = 16 }: StarRatingProps) => {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={size}
          className={
            star <= Math.round(rating)
              ? "fill-primary text-primary"
              : "text-muted-foreground"
          }
        />
      ))}
      {reviewCount !== undefined && (
        <span className="text-xs text-muted-foreground ml-1">({reviewCount})</span>
      )}
    </div>
  );
};

export default StarRating;
