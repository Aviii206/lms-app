import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { getBlogs, likeBlog } from "../../services/blogService";
import "../../styles/dashboard-blogs.css";

/**
 * A compact blog preview strip for the dashboard.
 * Shows the latest 3 public (or user-owned) blog posts.
 * Supports like toggling. Clicking "View All" goes to /blogs.
 */
const DashboardBlogSection = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await getBlogs(user?.token);
        setBlogs(data.slice(0, 3)); // Show only latest 3
      } catch {
        // silently fail — blogs are optional
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const handleLike = async (e, blogId) => {
    e.stopPropagation();
    try {
      const updatedLikes = await likeBlog(blogId, user?.token);
      setBlogs(blogs.map((b) =>
        b._id === blogId ? { ...b, likes: updatedLikes } : b
      ));
    } catch {}
  };

  const isLikedByMe = (blog) =>
    blog.likes?.some((id) => id === user?._id || id?._id === user?._id);

  if (loading || blogs.length === 0) return null;

  return (
    <div className="db-blogs-section">
      <div className="section-header">
        <h3>Community Blogs</h3>
        <a
          href="/blogs"
          className="view-all"
          onClick={(e) => { e.preventDefault(); navigate("/blogs"); }}
        >
          View All →
        </a>
      </div>

      <div className="db-blogs-grid">
        {blogs.map((blog) => (
          <div
            key={blog._id}
            className="db-blog-card"
            onClick={() => navigate("/blogs")}
          >
            <div className="db-blog-top">
              <div className="db-blog-avatar">
                {blog.author?.name?.charAt(0).toUpperCase() || "?"}
              </div>
              <div>
                <span className="db-blog-author">{blog.author?.name}</span>
                <span className="db-blog-date">
                  {new Date(blog.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>
              <span className={`db-vis-dot ${blog.isPublic ? "public" : "private"}`}>
                {blog.isPublic ? "🌐" : "🔒"}
              </span>
            </div>

            <h4 className="db-blog-title">{blog.title}</h4>
            <div
              className="db-blog-snippet"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />

            <div className="db-blog-footer">
              <button
                className={`db-like-btn ${isLikedByMe(blog) ? "liked" : ""}`}
                onClick={(e) => handleLike(e, blog._id)}
              >
                {isLikedByMe(blog) ? "❤️" : "🤍"} {blog.likes?.length || 0}
              </button>
              <span className="db-comment-count">
                💬 {blog.comments?.length || 0}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardBlogSection;
