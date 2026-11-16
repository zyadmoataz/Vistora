"use client";

import React, { useEffect, useState } from "react";
import { useAuthStore } from "@/hooks/useAuthStore";
import { useToastStore } from "@/hooks/useToastStore";
import { sanitizePlainText } from "@/lib/securityHelpers";
import Badge from "./ui/Badge";
import Button from "./ui/Button";
import Input from "./ui/Input";
import { StarIcon } from "./ui/Icons";

interface ReviewItem {
  id: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
  verified: boolean;
}

const DEFAULT_REVIEWS: ReviewItem[] = [
  { id: "r-1", author: "Karim El-Sayed", rating: 5, comment: "Exceptional drape and stitching. Fits true to size and arrives in protective garment packaging.", date: "Nov 2026", verified: true },
  { id: "r-2", author: "Claire Laurent", rating: 5, comment: "Architectural silhouette without feeling rigid. Quickly became a staple piece in my wardrobe.", date: "Oct 2026", verified: true },
];

export default function ProductReviews({ productName, slug }: { productName: string; slug: string }) {
  const { user, isAuthenticated } = useAuthStore();
  const { addToast } = useToastStore();
  const [reviews, setReviews] = useState<ReviewItem[]>(DEFAULT_REVIEWS);
  const [rating, setRating] = useState(5);
  const [author, setAuthor] = useState("");
  const [comment, setComment] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const saved = localStorage.getItem(`vistora_reviews_v1_${slug}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) setReviews([...parsed, ...DEFAULT_REVIEWS]);
      }
    } catch {
      // Ignore parse errors
    }
  }, [slug]);

  useEffect(() => {
    if (user?.name && !author) setAuthor(user.name);
  }, [user, author]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanAuthor = sanitizePlainText(author || user?.name || "Verified Client", 50);
    const cleanComment = sanitizePlainText(comment, 400);
    if (cleanComment.length < 6) {
      addToast("Review too short", "error", "Please share at least 6 characters.");
      return;
    }

    const newReview: ReviewItem = {
      id: `rev-${Date.now()}`,
      author: cleanAuthor,
      rating,
      comment: cleanComment,
      date: new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" }),
      verified: isAuthenticated,
    };

    const userSaved = reviews.filter((r) => r.id.startsWith("rev-"));
    const nextUserSaved = [newReview, ...userSaved];
    if (typeof window !== "undefined") {
      localStorage.setItem(`vistora_reviews_v1_${slug}`, JSON.stringify(nextUserSaved));
    }
    setReviews([newReview, ...reviews]);
    setComment("");
    addToast("Review Published", "success", `Thank you for reviewing ${productName}.`);
  };

  const avg = (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1);

  return (
    <section aria-labelledby="reviews-heading" className="mt-20 pt-14 border-t border-slate-200">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-brand-700">Client Feedback</span>
          <h2 id="reviews-heading" className="text-2xl sm:text-3xl font-bold text-navy-950 mt-1">
            Verified Reviews ({reviews.length})
          </h2>
        </div>
        <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-full border border-slate-200">
          <StarIcon className="w-4 h-4 text-amber-500" />
          <span className="text-sm font-bold text-navy-950">{avg} / 5.0</span>
          <span className="text-xs text-slate-600">Average Rating</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 flex flex-col gap-4">
          {reviews.map((rev) => (
            <article key={rev.id} className="p-5 rounded-3xl border border-slate-200 bg-white shadow-soft flex flex-col gap-2.5">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-2.5">
                  <strong className="text-sm text-navy-950">{rev.author}</strong>
                  {rev.verified && <Badge variant="success">Verified Buyer</Badge>}
                </div>
                <span className="text-xs text-slate-600">{rev.date}</span>
              </div>
              <div className="flex items-center gap-1" aria-label={`Rated ${rev.rating} out of 5 stars`}>
                {[1, 2, 3, 4, 5].map((s) => (
                  <StarIcon key={s} className={`w-3.5 h-3.5 ${s <= rev.rating ? "text-amber-500" : "text-slate-300"}`} filled={s <= rev.rating} />
                ))}
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{rev.comment}</p>
            </article>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="lg:col-span-5 p-6 rounded-3xl bg-slate-50 border border-slate-200 h-max flex flex-col gap-4">
          <h3 className="text-base font-bold text-navy-950">Write a Review</h3>
          <div className="flex items-center gap-1.5" role="radiogroup" aria-label="Select star rating">
            {[1, 2, 3, 4, 5].map((s) => (
              <button key={s} type="button" onClick={() => setRating(s)} aria-label={`Rate ${s} stars`} className="p-1 text-amber-500 hover:scale-110 transition-transform">
                <StarIcon className="w-5 h-5" filled={s <= rating} />
              </button>
            ))}
          </div>
          <Input id="review-author" label="Your Name" required value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="e.g. Zyaad Moataz" />
          <div className="flex flex-col gap-1.5">
            <label htmlFor="review-comment" className="text-xs font-semibold text-slate-700">Review</label>
            <textarea id="review-comment" required rows={3} value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Share fit, materials, and experience..." className="w-full ring-1 ring-slate-300 focus:ring-2 focus:ring-brand-600 rounded-xl px-4 py-3 text-sm text-navy-950 bg-white outline-none resize-none" />
          </div>
          <Button type="submit" variant="secondary" fullWidth>Submit Review</Button>
        </form>
      </div>
    </section>
  );
}
