import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";

import {
  FaBold,
  FaItalic,
  FaUnderline,
  FaAlignLeft,
  FaAlignCenter,
  FaAlignRight,
  FaListUl,
  FaListOl,
  FaLink,
  FaImage,
  FaCode,
} from "react-icons/fa";

const RichTextEditor = ({ value, onChange }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({ openOnClick: false }),
      Image,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) return null;

  const exec = (e, action) => {
    e.preventDefault();
    action();
  };

  const addImage = () => {
    const url = prompt("Enter image URL");
    if (url) editor.chain().focus().setImage({ src: url }).run();
  };

  const addLink = () => {
    const url = prompt("Enter link URL");
    if (url) {
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: url })
        .run();
    }
  };

  const btn = (active) => ({
    border: "none",
    background: active ? "#e0e7ff" : "transparent",
    color: active ? "#4338ca" : "#333",
    cursor: "pointer",
    padding: "6px",
    borderRadius: "4px",
    fontSize: "16px",
  });

  return (
    <div style={{ border: "1px solid #ccc", borderRadius: "6px" }}>
      {/* Toolbar */}
      <div
        style={{
          display: "flex",
          gap: "6px",
          padding: "6px",
          borderBottom: "1px solid #ddd",
          background: "#f9f9f9",
          flexWrap: "wrap",
        }}
      >
        <button type="button" style={btn(editor.isActive("bold"))}
          onMouseDown={(e) => exec(e, () => editor.chain().focus().toggleBold().run())}>
          <FaBold />
        </button>

        <button type="button" style={btn(editor.isActive("italic"))}
          onMouseDown={(e) => exec(e, () => editor.chain().focus().toggleItalic().run())}>
          <FaItalic />
        </button>

        <button type="button" style={btn(editor.isActive("underline"))}
          onMouseDown={(e) => exec(e, () => editor.chain().focus().toggleUnderline().run())}>
          <FaUnderline />
        </button>

        <button type="button" style={btn(editor.isActive({ textAlign: "left" }))}
          onMouseDown={(e) => exec(e, () => editor.chain().focus().setTextAlign("left").run())}>
          <FaAlignLeft />
        </button>

        <button type="button" style={btn(editor.isActive({ textAlign: "center" }))}
          onMouseDown={(e) => exec(e, () => editor.chain().focus().setTextAlign("center").run())}>
          <FaAlignCenter />
        </button>

        <button type="button" style={btn(editor.isActive({ textAlign: "right" }))}
          onMouseDown={(e) => exec(e, () => editor.chain().focus().setTextAlign("right").run())}>
          <FaAlignRight />
        </button>

        <button type="button" style={btn(editor.isActive("bulletList"))}
          onMouseDown={(e) => exec(e, () => editor.chain().focus().toggleBulletList().run())}>
          <FaListUl />
        </button>

        <button type="button" style={btn(editor.isActive("orderedList"))}
          onMouseDown={(e) => exec(e, () => editor.chain().focus().toggleOrderedList().run())}>
          <FaListOl />
        </button>

        <button type="button" style={btn(editor.isActive("link"))} onClick={addLink}>
          <FaLink />
        </button>

        <button type="button" style={btn(false)} onClick={addImage}>
          <FaImage />
        </button>

        <button type="button" style={btn(editor.isActive("codeBlock"))}
          onMouseDown={(e) => exec(e, () => editor.chain().focus().toggleCodeBlock().run())}>
          <FaCode />
        </button>
      </div>

      {/* Editor */}
      <EditorContent editor={editor} className="editor-content" />
    </div>
  );
};

export default RichTextEditor;
