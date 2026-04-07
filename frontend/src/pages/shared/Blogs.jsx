import { useState, useEffect, useContext, useRef } from "react";
import { AuthContext } from "../../context/AuthContext";
import DashboardLayout from "../../components/layout/DashboardLayout";
import BookLoader from "../../components/common/BookLoader";
import RichTextEditor from "../../components/common/RichTextEditor";
import {
  getBlogs,
  createBlog,
  likeBlog,
  addComment,
  uploadFile,
  deleteBlog,
} from "../../services/blogService";
import "../../styles/blogs.css";
import "../../styles/editor.css";

// ── File type → emoji icon ───────────────────────────────
const fileIcon = (type = "") => {
  if (type.includes("pdf"))   return "📄";
  if (type.includes("word") || type.includes("docx")) return "📝";
  if (type.includes("image")) return "🖼️";
  if (type.includes("sheet") || type.includes("excel")) return "📊";
  if (type.includes("presentation") || type.includes("pptx")) return "📽️";
  return "📎";
};

// ── Main component ───────────────────────────────────────
const Blogs = () => {
  const { user } = useContext(AuthContext);
  const token = user?.token;
  const fileInputRef = useRef(null);

  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [expandedComments, setExpandedComments] = useState({});
  const [commentInputs, setCommentInputs] = useState({});
  const [submittingComment, setSubmittingComment] = useState({});
  const [likingId, setLikingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null); // blog being deleted

  // New blog form
  const [newTitle, setNewTitle]       = useState("");
  const [newContent, setNewContent]   = useState("");
  const [newIsPublic, setNewIsPublic] = useState(true);
  const [creating, setCreating]       = useState(false);

  // File attachments
  const [pendingFiles, setPendingFiles]     = useState([]); // { name, file }
  const [uploadedFiles, setUploadedFiles]   = useState([]); // { name, url, type }
  const [uploadingIdx, setUploadingIdx]     = useState(null);

  useEffect(() => { fetchBlogs(); }, []);

  const fetchBlogs = async () => {
    try {
      const data = await getBlogs(token);
      setBlogs(data);
    } catch {
      console.error("Blog fetch failed — is local backend running?");
    } finally {
      setLoading(false);
    }
  };

  // ── File selection ───────────────────────────────────
  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    setPendingFiles((prev) => [
      ...prev,
      ...files.map((f) => ({ name: f.name, file: f })),
    ]);
    e.target.value = "";
  };

  const removePending = (idx) =>
    setPendingFiles(pendingFiles.filter((_, i) => i !== idx));

  // ── Upload all pending files, then create blog ───────
  const handleCreate = async (e) => {
    e.preventDefault();
    // Strip HTML tags to check if content is truly empty
    const textOnly = newContent.replace(/<[^>]*>/g, "").trim();
    if (!newTitle.trim() || !textOnly) {
      alert("Please add a title and some content before publishing.");
      return;
    }
    setCreating(true);

    try {
      // Upload each pending file sequentially
      const uploaded = [...uploadedFiles];
      for (let i = 0; i < pendingFiles.length; i++) {
        setUploadingIdx(i);
        const fd = new FormData();
        fd.append("file", pendingFiles[i].file);
        const result = await uploadFile(fd, token);
        uploaded.push({ name: result.name, url: result.url, type: result.type });
      }
      setUploadingIdx(null);

      const created = await createBlog(
        { title: newTitle, content: newContent, isPublic: newIsPublic, attachments: uploaded },
        token
      );

      setBlogs([created, ...blogs]);
      // Reset form
      setNewTitle("");
      setNewContent("");
      setNewIsPublic(true);
      setPendingFiles([]);
      setUploadedFiles([]);
      setShowModal(false);
    } catch (err) {
      alert("Failed to publish. Ensure local backend is running on port 5000.");
      setUploadingIdx(null);
    } finally {
      setCreating(false);
    }
  };

  // ── Like ─────────────────────────────────────────────
  const handleLike = async (blogId) => {
    if (likingId) return; // prevent double-tap
    setLikingId(blogId);
    try {
      const updatedLikes = await likeBlog(blogId, token);
      setBlogs(blogs.map((b) => b._id === blogId ? { ...b, likes: updatedLikes } : b));
    } catch {}
    finally { setLikingId(null); }
  };

  // ── Comment ──────────────────────────────────────────
  const handleCommentSubmit = async (blogId) => {
    const text = commentInputs[blogId];
    if (!text?.trim()) return;
    setSubmittingComment({ ...submittingComment, [blogId]: true });
    try {
      const updatedComments = await addComment(blogId, text, token);
      setBlogs(blogs.map((b) => b._id === blogId ? { ...b, comments: updatedComments } : b));
      setCommentInputs({ ...commentInputs, [blogId]: "" });
    } catch {}
    finally {
      setSubmittingComment({ ...submittingComment, [blogId]: false });
    }
  };

  const toggleComments = (id) =>
    setExpandedComments({ ...expandedComments, [id]: !expandedComments[id] });

  const isLikedByMe = (blog) =>
    blog.likes?.some((id) => id === user?._id || id?._id === user?._id);

  // ── Delete ─────────────────────────────────────────────
  const handleDelete = async (blogId) => {
    if (!window.confirm("Delete this post? This cannot be undone.")) return;
    setDeletingId(blogId);
    try {
      await deleteBlog(blogId, token);
      setBlogs(blogs.filter((b) => b._id !== blogId));
    } catch {
      alert("Failed to delete. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  // ── Render ────────────────────────────────────────────
  return (
    <DashboardLayout>
      <div className="blogs-page">

        {/* Header */}
        <div className="blogs-header">
          <div>
            <h1>Community Blogs</h1>
            <p>Share your thoughts, discoveries, and learning journeys.</p>
          </div>
          <button className="btn-create-blog" onClick={() => setShowModal(true)}>
            + New Post
          </button>
        </div>

        {/* Feed */}
        {loading ? (
          <div className="blogs-feed">
            {[1, 2, 3].map((n) => (
              <div key={n} className="blog-skeleton">
                <div className="skel-line" style={{ height: 14, width: "30%" }} />
                <div className="skel-line" style={{ height: 22, width: "70%" }} />
                <div className="skel-line" style={{ height: 14, width: "100%" }} />
                <div className="skel-line" style={{ height: 14, width: "90%" }} />
                <div className="skel-line" style={{ height: 14, width: "80%" }} />
              </div>
            ))}
          </div>
        ) : blogs.length === 0 ? (
          <div className="blogs-empty">
            <div className="empty-icon">✍️</div>
            <h3>No posts yet</h3>
            <p>Be the first to share something with the community!</p>
            <button onClick={() => setShowModal(true)}>Create First Post</button>
          </div>
        ) : (
          <div className="blogs-feed">
            {blogs.map((blog) => (
              <div key={blog._id} className={`blog-card ${deletingId === blog._id ? "blog-card--deleting" : ""}`}>

                {/* Card header */}
                <div className="blog-card-header">
                  <div className="blog-avatar">
                    {blog.author?.name?.charAt(0).toUpperCase() || "?"}
                  </div>
                  <div className="blog-author-info">
                    <span className="author-name">{blog.author?.name || "Unknown"}</span>
                    <span className="author-meta">
                      {blog.author?.role} &bull;{" "}
                      {new Date(blog.createdAt).toLocaleDateString("en-US", {
                        month: "short", day: "numeric", year: "numeric",
                      })}
                    </span>
                  </div>
                  <span className={`blog-visibility-badge ${blog.isPublic ? "public" : "private"}`}>
                    {blog.isPublic ? "🌐 Public" : "🔒 Private"}
                  </span>

                  {/* Delete — only shown to the author */}
                  {(blog.author?._id === user?._id || blog.author === user?._id) && (
                    <button
                      className="blog-delete-btn"
                      onClick={() => handleDelete(blog._id)}
                      disabled={deletingId === blog._id}
                      title="Delete post"
                    >
                      {deletingId === blog._id ? <span className="btn-spin" /> : "🗑️"}
                    </button>
                  )}
                </div>


                {/* Title */}
                <h2 className="blog-title">{blog.title}</h2>

                {/* Rich HTML content */}
                <div
                  className="blog-body blog-rich-content"
                  dangerouslySetInnerHTML={{ __html: blog.content }}
                />

                {/* Attachments */}
                {blog.attachments?.length > 0 && (
                  <div className="attachments-list">
                    {blog.attachments.map((att, i) => (
                      <a
                        key={i}
                        href={att.url}
                        target="_blank"
                        rel="noreferrer"
                        className="attachment-chip"
                        title={att.name}
                      >
                        <span className="chip-icon">{fileIcon(att.type)}</span>
                        {att.name}
                      </a>
                    ))}
                  </div>
                )}

                {/* Actions */}
                <div className="blog-actions">
                  <button
                    className={`like-btn ${isLikedByMe(blog) ? "liked" : ""}`}
                    onClick={() => handleLike(blog._id)}
                    disabled={likingId === blog._id}
                  >
                    {likingId === blog._id
                      ? <span className="btn-spin" />
                      : isLikedByMe(blog) ? "❤️" : "🤍"
                    }
                    {" "}{blog.likes?.length || 0}
                    <span className="action-label">Like</span>
                  </button>
                  <button
                    className="comment-toggle-btn"
                    onClick={() => toggleComments(blog._id)}
                  >
                    💬 {blog.comments?.length || 0}
                    <span className="action-label">
                      {expandedComments[blog._id] ? "Hide" : "Comment"}
                    </span>
                  </button>
                </div>

                {/* Comments */}
                {expandedComments[blog._id] && (
                  <div className="comments-section">
                    {blog.comments?.length === 0 && (
                      <p className="no-comments">No comments yet. Start the conversation!</p>
                    )}
                    {blog.comments?.map((c, i) => (
                      <div key={i} className="comment-item">
                        <div className="comment-avatar">
                          {c.user?.name?.charAt(0).toUpperCase() || "?"}
                        </div>
                        <div className="comment-body">
                          <span className="comment-author">{c.user?.name}</span>
                          <p>{c.text}</p>
                        </div>
                      </div>
                    ))}
                    <div className="comment-input-row">
                      <div className="comment-avatar self-avatar">
                        {user?.name?.charAt(0).toUpperCase() || "?"}
                      </div>
                      <input
                        type="text"
                        placeholder="Write a comment…"
                        value={commentInputs[blog._id] || ""}
                        onChange={(e) =>
                          setCommentInputs({ ...commentInputs, [blog._id]: e.target.value })
                        }
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleCommentSubmit(blog._id);
                        }}
                      />
                      <button
                        onClick={() => handleCommentSubmit(blog._id)}
                        disabled={submittingComment[blog._id]}
                      >
                        {submittingComment[blog._id] ? "…" : "Post"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* ── Create Blog Modal ── */}
        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal-box" onClick={(e) => e.stopPropagation()}>

              <div className="modal-header">
                <h2>New Blog Post</h2>
                <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
              </div>

              <form onSubmit={handleCreate} style={{ position: "relative" }}>
                {creating && (
                  <div className="modal-creating-overlay">
                    <div className="modal-spinner" />
                    <p>
                      {uploadingIdx !== null
                        ? `Uploading file ${uploadingIdx + 1} of ${pendingFiles.length}…`
                        : "Publishing your post…"}
                    </p>
                  </div>
                )}

                {/* Title */}
                <div className="form-group">
                  <label>Title</label>
                  <input
                    type="text"
                    placeholder="Give your post a catchy title…"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    required
                  />
                </div>

                {/* Rich Text Editor */}
                <div className="form-group">
                  <label>Content</label>
                  <RichTextEditor
                    content={newContent}
                    onChange={setNewContent}
                  />
                </div>

                {/* File Upload Area */}
                <div className="form-group">
                  <label>Attachments</label>
                  <div className="upload-area" onClick={() => fileInputRef.current?.click()}>
                    <input
                      type="file"
                      ref={fileInputRef}
                      multiple
                      accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg,.gif,.webp,.pptx,.xlsx,.csv"
                      onChange={handleFileSelect}
                    />
                    <label>
                      <span className="upload-icon">📎</span>
                      <span>Click to attach files</span>
                      <span className="upload-hint">PDF, DOCX, Images, PPTX, XLSX — max 10 MB each</span>
                    </label>
                  </div>

                  {/* Pending file chips */}
                  {pendingFiles.length > 0 && (
                    <div className="pending-files">
                      {pendingFiles.map((pf, i) => (
                        <span key={i} className="pending-chip">
                          {fileIcon(pf.file.type)} {pf.name}
                          <button type="button" onClick={() => removePending(i)}>✕</button>
                        </span>
                      ))}
                    </div>
                  )}

                  {uploadingIdx !== null && (
                    <p style={{ fontSize: "13px", color: "#6b7280", marginBottom: "12px" }}>
                      Uploading file {uploadingIdx + 1} of {pendingFiles.length}…
                    </p>
                  )}
                </div>

                {/* Visibility */}
                <div className="visibility-toggle">
                  <span>Visibility</span>
                  <div className="vis-btns">
                    <button type="button" className={newIsPublic ? "active" : ""} onClick={() => setNewIsPublic(true)}>
                      🌐 Public
                    </button>
                    <button type="button" className={!newIsPublic ? "active" : ""} onClick={() => setNewIsPublic(false)}>
                      🔒 Private
                    </button>
                  </div>
                </div>

                <button type="submit" className="btn-submit-blog" disabled={creating}>
                  {creating
                    ? uploadingIdx !== null
                      ? `Uploading file ${uploadingIdx + 1}…`
                      : "Publishing…"
                    : "Publish Post"}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Blogs;
