import { useState, useEffect, useRef } from "react";
import { getPublicBlogs } from "../../services/blogService";
import "../../styles/blogfeed.css";

// Map mime type → readable label
const fileIcon = (type = "") => {
  if (type.includes("pdf"))   return "📄";
  if (type.includes("word") || type.includes("docx")) return "📝";
  if (type.includes("image")) return "🖼️";
  if (type.includes("sheet") || type.includes("excel")) return "📊";
  if (type.includes("presentation") || type.includes("pptx")) return "📽️";
  return "📎";
};

// Gradient palette for author avatars — cycles through them
const GRADIENTS = [
  "linear-gradient(135deg, #216299 0%, #82baf7 100%)",
  "linear-gradient(135deg, #059669 0%, #6ee7b7 100%)",
  "linear-gradient(135deg, #7c3aed 0%, #c4b5fd 100%)",
  "linear-gradient(135deg, #d97706 0%, #fcd34d 100%)",
  "linear-gradient(135deg, #db2777 0%, #f9a8d4 100%)",
];

const BlogFeed = () => {
  const [blogs, setBlogs]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive]   = useState(0);   // index of visible card
  const timerRef = useRef(null);

  useEffect(() => {
    getPublicBlogs()
      .then(setBlogs)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Auto-advance carousel every 5 seconds
  useEffect(() => {
    if (!blogs.length) return;
    timerRef.current = setInterval(() => {
      setActive((prev) => (prev + 1) % blogs.length);
    }, 5000);
    return () => clearInterval(timerRef.current);
  }, [blogs]);

  const goTo = (idx) => {
    setActive(idx);
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setActive((prev) => (prev + 1) % blogs.length);
    }, 5000);
  };

  // ── Loading skeleton ────────────────────────────────────
  if (loading) {
    return (
      <div className="blog-feed-container">
        <div className="blog-feed-header">
          <h2>Community Voices</h2>
          <p>See what learners and educators are talking about.</p>
        </div>
        <div className="bfc-skeleton-wrap">
          {[1, 2].map((n) => (
            <div key={n} className="bfc-skeleton">
              <div className="bfc-skel-line" style={{ width: "40%", height: 12 }} />
              <div className="bfc-skel-line" style={{ width: "70%", height: 20 }} />
              <div className="bfc-skel-line" style={{ width: "100%", height: 12 }} />
              <div className="bfc-skel-line" style={{ width: "85%", height: 12 }} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ── Empty ───────────────────────────────────────────────
  if (!blogs.length) {
    return (
      <div className="blog-feed-container">
        <div className="blog-feed-header">
          <h2>Community Voices</h2>
          <p>See what learners and educators are talking about.</p>
        </div>
        <div className="bfc-empty">
          <span className="bfc-empty-icon">✍️</span>
          <h3>No public posts yet</h3>
          <p>Log in and be the first to share something!</p>
        </div>
      </div>
    );
  }

  const blog = blogs[active];
  const initials = blog.author?.name?.charAt(0).toUpperCase() || "?";
  const gradient = GRADIENTS[active % GRADIENTS.length];

  return (
    <div className="blog-feed-container">
      {/* Header */}
      <div className="blog-feed-header">
        <h2>Community Voices</h2>
        <p>See what learners and educators are talking about.</p>
      </div>

      {/* Card */}
      <div className="bfc-card-stage">
        <div className="bfc-card" key={blog._id}>

          {/* Author row */}
          <div className="bfc-card-author">
            <div className="bfc-avatar" style={{ background: gradient }}>
              {initials}
            </div>
            <div>
              <span className="bfc-author-name">{blog.author?.name || "Unknown"}</span>
              <span className="bfc-author-meta">
                {blog.author?.role || "member"}
                {" · "}
                {new Date(blog.createdAt).toLocaleDateString("en-US", {
                  month: "short", day: "numeric", year: "numeric",
                })}
              </span>
            </div>
            <span className="bfc-public-badge">🌐 Public</span>
          </div>

          {/* Title */}
          <h3 className="bfc-title">{blog.title}</h3>

          {/* Rich HTML content — rendered exactly as written */}
          <div
            className="bfc-preview"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />

          {/* Attachments */}
          {blog.attachments?.length > 0 && (
            <div className="bfc-attachments">
              {blog.attachments.slice(0, 3).map((att, i) => (
                <span key={i} className="bfc-att-chip">
                  {fileIcon(att.type)} {att.name}
                </span>
              ))}
              {blog.attachments.length > 3 && (
                <span className="bfc-att-chip">+{blog.attachments.length - 3} more</span>
              )}
            </div>
          )}

          {/* Stats */}
          <div className="bfc-stats">
            <span className="bfc-stat">❤️ {blog.likes?.length || 0} likes</span>
            <span className="bfc-stat">💬 {blog.comments?.length || 0} comments</span>
          </div>
        </div>
      </div>

      {/* Dot navigation */}
      <div className="bfc-dots">
        {blogs.map((_, i) => (
          <button
            key={i}
            className={`bfc-dot ${i === active ? "bfc-dot--active" : ""}`}
            onClick={() => goTo(i)}
            aria-label={`Go to post ${i + 1}`}
          />
        ))}
      </div>

      {/* Progress bar */}
      <div className="bfc-progress-track">
        <div className="bfc-progress-bar" key={active} />
      </div>

      {/* CTA */}
      <p className="bfc-cta">
        Sign in to like and comment on the posts.
      </p>
    </div>
  );
};

export default BlogFeed;
