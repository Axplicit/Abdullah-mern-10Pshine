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
} from "react-icons/fa";

const RichTextEditor = ({ value, onChange }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Image,
      Link.configure({ openOnClick: false }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    content: value,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });

  if (!editor) return null;

  const buttonStyle = (active) =>
    `
    p-2 rounded-lg text-sm
    transition-all duration-200 ease-out
    transform hover:-translate-y-0.5 hover:scale-105 active:scale-95
    ${
      active
        ? "bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 shadow-sm"
        : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:shadow-md"
    }
  `;

  const prevent = (e, action) => {
    e.preventDefault();
    action();
  };

  return (
    <div className="border rounded-xl overflow-hidden bg-white dark:bg-gray-900 shadow-sm backdrop-blur-md">
      
      {/* TOOLBAR */}
      <div className="flex flex-wrap gap-2 border-b bg-gray-50 dark:bg-gray-800 p-3">
        
        <button
          type="button"
          className={buttonStyle(editor.isActive("bold"))}
          onMouseDown={(e) =>
            prevent(e, () => editor.chain().focus().toggleBold().run())
          }
        >
          <FaBold />
        </button>

        <button
          type="button"
          className={buttonStyle(editor.isActive("italic"))}
          onMouseDown={(e) =>
            prevent(e, () => editor.chain().focus().toggleItalic().run())
          }
        >
          <FaItalic />
        </button>

        <button
          type="button"
          className={buttonStyle(editor.isActive("underline"))}
          onMouseDown={(e) =>
            prevent(e, () => editor.chain().focus().toggleUnderline().run())
          }
        >
          <FaUnderline />
        </button>

        <button
          type="button"
          className={buttonStyle(editor.isActive({ textAlign: "left" }))}
          onMouseDown={(e) =>
            prevent(e, () => editor.chain().focus().setTextAlign("left").run())
          }
        >
          <FaAlignLeft />
        </button>

        <button
          type="button"
          className={buttonStyle(editor.isActive({ textAlign: "center" }))}
          onMouseDown={(e) =>
            prevent(e, () => editor.chain().focus().setTextAlign("center").run())
          }
        >
          <FaAlignCenter />
        </button>

        <button
          type="button"
          className={buttonStyle(editor.isActive({ textAlign: "right" }))}
          onMouseDown={(e) =>
            prevent(e, () => editor.chain().focus().setTextAlign("right").run())
          }
        >
          <FaAlignRight />
        </button>

        <button
          type="button"
          className={buttonStyle(editor.isActive("bulletList"))}
          onMouseDown={(e) =>
            prevent(e, () => editor.chain().focus().toggleBulletList().run())
          }
        >
          <FaListUl />
        </button>

        <button
          type="button"
          className={buttonStyle(editor.isActive("orderedList"))}
          onMouseDown={(e) =>
            prevent(e, () => editor.chain().focus().toggleOrderedList().run())
          }
        >
          <FaListOl />
        </button>

        <button
          type="button"
          className={buttonStyle(editor.isActive("link"))}
          onClick={() => {
            const url = prompt("Enter link URL");
            if (url) editor.chain().focus().setLink({ href: url }).run();
          }}
        >
          <FaLink />
        </button>

        <button
          type="button"
          className={buttonStyle(false)}
          onClick={() => {
            const url = prompt("Enter image URL");
            if (url) editor.chain().focus().setImage({ src: url }).run();
          }}
        >
          <FaImage />
        </button>

      </div>

      {/* EDITOR CONTENT */}
      <EditorContent
        editor={editor}
        className="
          p-4 
          min-h-[160px] 
          prose 
          dark:prose-invert 
          max-w-none 
          focus:outline-none
        "
      />
    </div>
  );
};

export default RichTextEditor;
