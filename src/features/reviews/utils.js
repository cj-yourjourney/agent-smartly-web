const PASS_RE = /\b(pass|passed|passing)\b/i

export function pickFeaturedReviews(reviews = [], limit = 6) {
  return reviews
    .filter((r) => r.rating >= 4 && r.content && r.content.trim().length >= 60)
    .map((r) => ({
      review: r,
      score:
        (r.rating === 5 ? 2 : 0) +
        (PASS_RE.test(r.content) ? 3 : 0) +
        (r.title ? 1 : 0) +
        (r.content.length <= 450 ? 1 : 0)
    }))
    .sort(
      (a, b) =>
        b.score - a.score ||
        new Date(b.review.created_at) - new Date(a.review.created_at)
    )
    .slice(0, limit)
    .map((x) => x.review)
}
