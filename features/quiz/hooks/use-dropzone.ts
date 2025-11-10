import { useCallback, useRef, useState } from "react";

interface UseDropzoneProps {
  accept: readonly string[];
  maxSize: number;
  onDrop: (acceptedFiles: File[], rejectedFiles: File[]) => void;
}

export function useDropzone({ accept, maxSize, onDrop }: UseDropzoneProps) {
  const [isDragActive, setIsDragActive] = useState(false);
  const [isDragReject, setIsDragReject] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dragCounter = useRef(0);

  const validateFiles = useCallback(
    (files: File[]) => {
      const accepted: File[] = [];
      const rejected: File[] = [];

      files.forEach((file) => {
        if (accept.includes(file.type) && file.size <= maxSize) {
          accepted.push(file);
        } else {
          rejected.push(file);
        }
      });

      return { accepted, rejected };
    },
    [accept, maxSize]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragActive(false);
      setIsDragReject(false);
      dragCounter.current = 0;

      const files = Array.from(e.dataTransfer.files);
      const { accepted, rejected } = validateFiles(files);
      onDrop(accepted, rejected);
    },
    [validateFiles, onDrop]
  );

  const handleDragEnter = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      dragCounter.current++;

      if (dragCounter.current === 1) {
        setIsDragActive(true);
        const items = Array.from(e.dataTransfer.items);
        const hasInvalidFile = items.some(
          (item) => !accept.includes(item.type)
        );
        setIsDragReject(hasInvalidFile);
      }
    },
    [accept]
  );

  const handleDragLeave = useCallback(() => {
    dragCounter.current--;
    if (dragCounter.current === 0) {
      setIsDragActive(false);
      setIsDragReject(false);
    }
  }, []);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files ? Array.from(e.target.files) : [];
      const { accepted, rejected } = validateFiles(files);
      onDrop(accepted, rejected);
    },
    [validateFiles, onDrop]
  );

  const getRootProps = useCallback(
    () => ({
      onDrop: handleDrop,
      onDragOver: (e: React.DragEvent) => e.preventDefault(),
      onDragEnter: handleDragEnter,
      onDragLeave: handleDragLeave,
      onClick: () => inputRef.current?.click(),
      role: "button" as const,
      tabIndex: 0,
      onKeyDown: (e: React.KeyboardEvent) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          inputRef.current?.click();
        }
      },
    }),
    [handleDrop, handleDragEnter, handleDragLeave]
  );

  const getInputProps = useCallback(
    () => ({
      ref: inputRef,
      type: "file" as const,
      accept: accept.join(","),
      onChange: handleChange,
      className: "sr-only",
    }),
    [accept, handleChange]
  );

  return { getRootProps, getInputProps, isDragActive, isDragReject };
}
