import React, { useEffect, useState } from "react";
import {
  Editor,
  EditorState,
  RichUtils,
  convertToRaw,
  convertFromRaw,
  Modifier,
} from "draft-js";
import "draft-js/dist/Draft.css";

const DraftEditor = () => {
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );

  useEffect(() => {
    const savedContent = localStorage.getItem("editorContent");
    if (savedContent) {
      const contentState = convertFromRaw(JSON.parse(savedContent));
      setEditorState(EditorState.createWithContent(contentState));
    }
  }, []);

  const handleSave = () => {
    const contentState = editorState.getCurrentContent();
    localStorage.setItem(
      "editorContent",
      JSON.stringify(convertToRaw(contentState))
    );
  };

  const handleChange = (newEditorState) => {
    setEditorState(newEditorState);
  };

  const styleMap = {
    RED: { color: "red" },
    BOLD: { fontWeight: "bold" },
    UNDERLINE: { textDecoration: "underline" },
  };

  const replaceString = (newState, selection, startOffset) => {
    return Modifier.replaceText(
      newState.getCurrentContent(),
      selection.merge({
        anchorOffset: 0,
        focusOffset: startOffset + 1,
      }),
      " ",
      newState.getCurrentInlineStyle()
    );
  };

  const handleBeforeInput = (chars) => {
    const currentContent = editorState.getCurrentContent();
    const selection = editorState.getSelection();
    const startKey = selection.getStartKey();
    const startOffset = selection.getStartOffset();
    const block = currentContent.getBlockForKey(startKey);
    const text = block.getText().slice(0, startOffset) + chars;

    let newState;
    if (text === "# ") {
      newState = RichUtils.toggleBlockType(editorState, "header-one");

      const newContentState = replaceString(newState, selection, startOffset);

      setEditorState(
        EditorState.push(newState, newContentState, "change-block-type")
      );

      return "handled";
    } else if (text === "* ") {
      newState = RichUtils.toggleInlineStyle(editorState, "BOLD");

      const newContentState = replaceString(newState, selection, startOffset);

      setEditorState(
        EditorState.push(newState, newContentState, "change-inline-style")
      );

      return "handled";
    } else if (text === "** ") {
      newState = RichUtils.toggleInlineStyle(editorState, "RED");

      const newContentState = replaceString(newState, selection, startOffset);

      setEditorState(
        EditorState.push(newState, newContentState, "change-inline-style")
      );

      return "handled";
    } else if (text === "*** ") {
      newState = RichUtils.toggleInlineStyle(editorState, "UNDERLINE");

      const newContentState = replaceString(newState, selection, startOffset);

      setEditorState(
        EditorState.push(newState, newContentState, "change-inline-style")
      );

      return "handled";
    }
    return "not-handled";
  };

  return (
    <div style={{ padding: "20px" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-around",
        }}
      >
        <h1>Demo editor by Prabhat</h1>
        <button onClick={handleSave} style={{ padding: "10px" }}>
          Save
        </button>
      </div>
      <div
        style={{
          border: "3px solid #ccc",
          padding: "10px",
          minHeight: "75vh",
        }}
      >
        <Editor
          editorState={editorState}
          onChange={handleChange}
          handleBeforeInput={handleBeforeInput}
          customStyleMap={styleMap}
        />
      </div>
      <div>{JSON.stringify(convertToRaw(editorState.getCurrentContent()))}</div>
    </div>
  );
};

export default DraftEditor;
