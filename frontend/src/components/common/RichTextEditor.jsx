import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";
import "../../styles/editor.css";

// ── Toolbar Button ──────────────────────────────────────
const ToolBtn = ({ onClick, active, title, children }) => (
  <button
    type="button"
    onClick={onClick}
    title={title}
    className={`tool-btn ${active ? "tool-btn--active" : ""}`}
  >
    {children}
  </button>
);

// ── Divider ─────────────────────────────────────────────
const Sep = () => <span className="tool-sep" />;

// ── Highlight colours ───────────────────────────────────
const HIGHLIGHTS = [
  { color: "#fef08a", label: "Yellow" },
  { color: "#bbf7d0", label: "Green"  },
  { color: "#bfdbfe", label: "Blue"   },
  { color: "#fecaca", label: "Red"    },
  { color: "#e9d5ff", label: "Purple" },
];

// ── Main component ───────────────────────────────────────
const RichTextEditor = ({ content, onChange }) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Underline,
      Highlight.configure({ multicolor: true }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Placeholder.configure({
        placeholder: "What’s on your mind? Share your thoughts, discoveries or learning journeys…",
      }),
    ],
    content,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });

  if (!editor) return null;

  return (
    <div className="rich-editor-wrap">
      {/* ── Toolbar ── */}
      <div className="editor-toolbar">

        {/* Headings */}
        <ToolBtn
          title="Heading 1"
          active={editor.isActive("heading", { level: 1 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        >H1</ToolBtn>
        <ToolBtn
          title="Heading 2"
          active={editor.isActive("heading", { level: 2 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        >H2</ToolBtn>
        <ToolBtn
          title="Heading 3"
          active={editor.isActive("heading", { level: 3 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        >H3</ToolBtn>

        <Sep />

        {/* Inline formatting */}
        <ToolBtn title="Bold"          active={editor.isActive("bold")}          onClick={() => editor.chain().focus().toggleBold().run()}><strong>B</strong></ToolBtn>
        <ToolBtn title="Italic"        active={editor.isActive("italic")}        onClick={() => editor.chain().focus().toggleItalic().run()}><em>I</em></ToolBtn>
        <ToolBtn title="Underline"     active={editor.isActive("underline")}     onClick={() => editor.chain().focus().toggleUnderline().run()}><span style={{textDecoration:"underline"}}>U</span></ToolBtn>
        <ToolBtn title="Strikethrough" active={editor.isActive("strike")}        onClick={() => editor.chain().focus().toggleStrike().run()}><s>S</s></ToolBtn>
        <ToolBtn title="Code"          active={editor.isActive("code")}          onClick={() => editor.chain().focus().toggleCode().run()}>{"</>"}</ToolBtn>

        <Sep />

        {/* Highlight swatches */}
        {HIGHLIGHTS.map((h) => (
          <button
            key={h.color}
            type="button"
            title={`Highlight ${h.label}`}
            className="tool-swatch"
            style={{ background: h.color }}
            onClick={() =>
              editor.isActive("highlight", { color: h.color })
                ? editor.chain().focus().unsetHighlight().run()
                : editor.chain().focus().setHighlight({ color: h.color }).run()
            }
          />
        ))}

        <Sep />

        {/* Lists */}
        <ToolBtn title="Bullet List"   active={editor.isActive("bulletList")}   onClick={() => editor.chain().focus().toggleBulletList().run()}>• List</ToolBtn>
        <ToolBtn title="Ordered List"  active={editor.isActive("orderedList")}  onClick={() => editor.chain().focus().toggleOrderedList().run()}>1. List</ToolBtn>
        <ToolBtn title="Blockquote"    active={editor.isActive("blockquote")}   onClick={() => editor.chain().focus().toggleBlockquote().run()}>" Quote</ToolBtn>
        <ToolBtn title="Code Block"    active={editor.isActive("codeBlock")}    onClick={() => editor.chain().focus().toggleCodeBlock().run()}>Block</ToolBtn>

        <Sep />

        {/* Alignment */}
        <ToolBtn title="Align Left"    active={editor.isActive({ textAlign: "left" })}    onClick={() => editor.chain().focus().setTextAlign("left").run()}>⇤</ToolBtn>
        <ToolBtn title="Align Center"  active={editor.isActive({ textAlign: "center" })}  onClick={() => editor.chain().focus().setTextAlign("center").run()}>≡</ToolBtn>
        <ToolBtn title="Align Right"   active={editor.isActive({ textAlign: "right" })}   onClick={() => editor.chain().focus().setTextAlign("right").run()}>⇥</ToolBtn>

        <Sep />

        {/* History */}
        <ToolBtn title="Undo" onClick={() => editor.chain().focus().undo().run()}>↩</ToolBtn>
        <ToolBtn title="Redo" onClick={() => editor.chain().focus().redo().run()}>↪</ToolBtn>
      </div>

      {/* ── Editor Canvas ── */}
      <EditorContent editor={editor} className="editor-canvas" />
    </div>
  );
};

export default RichTextEditor;
