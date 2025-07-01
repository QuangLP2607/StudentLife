import React, { createContext, useState, useCallback } from "react";

export const TextEditorContext = createContext();

export const TextEditorProvider = ({ children }) => {
  const [visible, setVisible] = useState(false);
  const [initialContent, setInitialContent] = useState("");
  const [onSaveCallback, setOnSaveCallback] = useState(() => () => {});

  const openEditor = useCallback((content = "", onSave = () => {}) => {
    setInitialContent(content);
    setOnSaveCallback(() => onSave);
    setVisible(true);
  }, []);

  const closeEditor = useCallback(() => {
    setVisible(false);
    setInitialContent("");
    setOnSaveCallback(() => () => {});
  }, []);

  const handleSave = useCallback(
    (newContent) => {
      onSaveCallback(newContent);
      closeEditor();
    },
    [onSaveCallback, closeEditor]
  );

  return (
    <TextEditorContext.Provider
      value={{
        visible,
        initialContent,
        openEditor,
        closeEditor,
        handleSave,
      }}
    >
      {children}
    </TextEditorContext.Provider>
  );
};
