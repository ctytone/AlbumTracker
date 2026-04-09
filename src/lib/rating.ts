export const MIN_RATING = 0.5;
export const MAX_RATING = 5;
export const RATING_STEP = 0.5;

export function clampToRatingStep(value: number) {
  const stepped = Math.round(value / RATING_STEP) * RATING_STEP;
  return Math.max(MIN_RATING, Math.min(MAX_RATING, Number(stepped.toFixed(1))));
}

export function calculateAlbumAverage(ratings: number[]) {
  if (!ratings.length) {
    return null;
  }

  const total = ratings.reduce((sum, rating) => sum + rating, 0);
  return Number((total / ratings.length).toFixed(2));
}

export function ratingLabel(rating: number | null) {
  if (rating === null) {
    return "Not listened to yet";
  }

  return `${rating.toFixed(1)} stars`;
}
