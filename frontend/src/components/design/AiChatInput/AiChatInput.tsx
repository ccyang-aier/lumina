"use client";

import { useState, useRef, useEffect, type KeyboardEvent, type ReactNode } from "react";
import { Code, Sparkles, Paperclip, Scissors, X, FileText, FileCode, FileImage, File as FileIcon, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./AiChatInput.module.css";
import { CodeReference } from "@/components/layout/SidePanelContext";

interface AiChatInputProps {
  onSend?: (message: string, attachments?: File[], codeRef?: CodeReference) => void;
  placeholder?: string;
  className?: string;
  value?: string;
  onChange?: (value: string) => void;
  codeRef?: CodeReference | null;
  onClearCodeRef?: () => void;
}

interface Attachment {
  file: File;
  id: string;
  status: 'uploading' | 'done' | 'error';
}

export function AiChatInput({
  onSend,
  placeholder = "Ask anything",
  className,
  value: propValue,
  onChange: propOnChange,
  codeRef,
  onClearCodeRef,
}: AiChatInputProps) {
  const [internalValue, setInternalValue] = useState("");
  const isControlled = propValue !== undefined;
  
  const value = isControlled ? propValue : internalValue;
  
  const handleChange = (newValue: string) => {
    if (!isControlled) setInternalValue(newValue);
    propOnChange?.(newValue);
  };

  const [searchActive, setSearchActive] = useState(false);
  const [files, setFiles] = useState<Attachment[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 108)}px`;
  }, [value]);

  const handleSend = () => {
    const trimmed = value.trim();
    if (!trimmed && files.length === 0 && !codeRef) return;
    
    const validFiles = files.filter(f => f.status === 'done').map(f => f.file);
    
    // Pass files along with the message if the parent component supports it
    onSend?.(trimmed, validFiles, codeRef || undefined);
    handleChange("");
    setFiles([]);
    if (textareaRef.current) textareaRef.current.style.height = "auto";
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter") {
      if (e.ctrlKey || e.shiftKey) return;
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles: Attachment[] = Array.from(e.target.files).map(file => ({
        file,
        id: Math.random().toString(36).substring(7),
        status: 'uploading'
      }));
      
      setFiles((prev) => [...prev, ...newFiles]);

      // Simulate upload process
      newFiles.forEach(attachment => {
        setTimeout(() => {
          setFiles(prev => prev.map(f => 
            f.id === attachment.id ? { ...f, status: 'done' } : f
          ));
        }, 1500 + Math.random() * 1000); // Random delay between 1.5s and 2.5s
      });
    }
    // Reset input value so same file can be selected again if needed
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemoveFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const handleScreenshot = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: { cursor: "always" },
        audio: false,
      });
      
      const video = document.createElement("video");
      video.srcObject = stream;
      video.play();

      video.onloadedmetadata = () => {
        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext("2d");
        
        // Wait a brief moment to ensure video frame is ready
        setTimeout(() => {
          ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);
          
          // Stop all tracks to release the screen/window
          stream.getTracks().forEach((track) => track.stop());
          
          canvas.toBlob((blob) => {
            if (blob) {
              const file = new File([blob], `screenshot-${Date.now()}.png`, { type: "image/png" });
              const attachment: Attachment = {
                file,
                id: Math.random().toString(36).substring(7),
                status: 'uploading'
              };
              setFiles((prev) => [...prev, attachment]);
              
              // Simulate upload
              setTimeout(() => {
                setFiles(prev => prev.map(f => 
                  f.id === attachment.id ? { ...f, status: 'done' } : f
                ));
              }, 1000);
            }
          }, "image/png");
        }, 300); // 300ms delay to capture the content
      };
    } catch (err) {
      console.error("Screenshot cancelled or failed:", err);
    }
  };

  return (
    <div className={`${styles.container} ${className || ""}`}>
      {/* Code Reference Pill (Above input) */}
      <AnimatePresence>
        {codeRef && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="px-4 pt-3 pb-1"
          >
            <div className="flex items-center gap-2 max-w-full w-fit bg-muted/50 border border-border/50 rounded-full pl-3 pr-2 py-1.5 text-xs text-muted-foreground group relative overflow-hidden">
              <Code className="w-3.5 h-3.5 shrink-0 text-primary/70" />
              <span className="truncate max-w-[200px] font-mono">
                {codeRef.preview || "Code Snippet"}
              </span>
              <button
                onClick={onClearCodeRef}
                className="ml-1 p-0.5 rounded-full hover:bg-background/80 hover:text-foreground transition-colors cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {files.length > 0 && (
        <div className={styles.filePreviewList}>
          {files.map((attachment) => (
            <FilePreviewItem 
              key={attachment.id} 
              attachment={attachment} 
              onRemove={() => handleRemoveFile(attachment.id)} 
            />
          ))}
        </div>
      )}

      <textarea
        ref={textareaRef}
        rows={1}
        className={styles.input}
        placeholder={codeRef ? "Ask about this code..." : placeholder}
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        onKeyDown={handleKeyDown}
      />

      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        style={{ display: "none" }}
        onChange={handleFileSelect}
        multiple
      />

      <div className={styles.buttonRow}>
        {/*
          Tip wraps searchWrapper so the tooltip sits OUTSIDE the overflow:hidden
          clipping context of searchWrapper, staying perfectly centered above.
        */}
        <Tip label="联网搜索">
          <div
            className={`${styles.searchWrapper} ${searchActive ? styles.searchWrapperActive : ""}`}
          >
            <button
              className={`${styles.searchBtn} ${searchActive ? styles.searchBtnActive : ""}`}
              type="button"
              onClick={() => setSearchActive((v) => !v)}
            >
              <GlobeIcon active={searchActive} />
              <span className={styles.searchText}>Search</span>
            </button>
          </div>
        </Tip>

        {/* Tool buttons */}
        <div className={styles.toolGroup}>
          <Tip label="语音输入">
            <button className={`${styles.toolBtn} ${styles.voice}`} type="button">
              <VoiceIcon />
            </button>
          </Tip>

          <Tip label="上传文件或图片">
            <button 
              className={`${styles.toolBtn} ${styles.image}`} 
              type="button"
              onClick={() => fileInputRef.current?.click()}
            >
              <Paperclip size={16} />
            </button>
          </Tip>

          <Tip label="截屏">
            <button 
              className={`${styles.toolBtn} ${styles.camera}`} 
              type="button"
              onClick={handleScreenshot}
            >
              <Scissors size={16} />
            </button>
          </Tip>

          <Tip label="发送消息">
            <button className={styles.generateBtn} type="button" onClick={handleSend}>
              <Sparkles size={12} />
              Generate
            </button>
          </Tip>
        </div>
      </div>
    </div>
  );
}

/* ─── File Preview Item Component ───────────────────────────────────────────── */

function FilePreviewItem({ attachment, onRemove }: { attachment: Attachment; onRemove: () => void }) {
  const { file, status } = attachment;
  
  const getFileIcon = () => {
    if (status === 'uploading') {
      return (
        <div className={styles.loadingSpinner}>
          <Loader2 className="animate-spin text-primary" size={20} />
        </div>
      );
    }

    if (file.type.startsWith('image/')) {
      // Use thumbnail for images
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const [preview, setPreview] = useState<string | null>(null);
      // eslint-disable-next-line react-hooks/rules-of-hooks
      useEffect(() => {
        const url = URL.createObjectURL(file);
        setPreview(url);
        return () => URL.revokeObjectURL(url);
      }, [file]);
      
      if (preview) {
        return <img src={preview} alt="preview" className={styles.fileIconImage} />;
      }
      return <FileImage className="text-purple-500" size={20} />;
    }
    
    if (file.type.includes('pdf')) {
      return <FileText className="text-red-500" size={20} />;
    }
    
    if (file.type.includes('html') || file.type.includes('code') || file.type.includes('json') || file.name.endsWith('.tsx') || file.name.endsWith('.ts')) {
      return <FileCode className="text-orange-500" size={20} />;
    }

    return <FileIcon className="text-blue-500" size={20} />;
  };

  const getFileTypeLabel = () => {
    if (status === 'uploading') return 'Uploading...';
    if (file.type.startsWith('image/')) return 'Image';
    if (file.type.includes('pdf')) return 'PDF';
    if (file.type.includes('html')) return 'HTML';
    return 'File';
  };

  return (
    <div className={styles.filePreviewCard}>
      <div className={styles.fileIconWrapper}>
        {getFileIcon()}
      </div>
      <div className={styles.fileInfo}>
        <span className={styles.fileName} title={file.name}>{file.name}</span>
        <span className={styles.fileType}>{getFileTypeLabel()}</span>
      </div>
      <button
        type="button"
        className={styles.removeFileBtn}
        onClick={onRemove}
      >
        <X size={12} />
      </button>
    </div>
  );
}

/* ─── Tooltip — centered directly above the trigger ────────────────────────── */

function Tip({ children, label }: { children: ReactNode; label: string }) {
  const [show, setShow] = useState(false);

  return (
    <div
      className={styles.tipAnchor}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}
      <AnimatePresence>
        {show && (
          <motion.div
            key="tip"
            initial={{ opacity: 0, y: 4, scale: 0.88 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.88 }}
            transition={{ duration: 0.12 }}
            className="pointer-events-none absolute bottom-full left-1/2 mb-1.5 -translate-x-1/2 whitespace-nowrap rounded-md bg-foreground/90 px-2 py-0.5 text-[10px] font-medium text-background shadow-md z-[200]"
          >
            {label}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Icon sub-components ──────────────────────────────────────────────────── */

function GlobeIcon({ active }: { active?: boolean }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      width="15"
      height="15"
      stroke="currentColor"
      strokeWidth={active ? "1.9" : "1.6"}
      strokeLinecap="round"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c-2.5 3-4 5.5-4 9s1.5 6 4 9M12 3c2.5 3 4 5.5 4 9s-1.5 6-4 9" />
    </svg>
  );
}

function VoiceIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" width="16" height="16">
      <path d="M9.5 4C8.67157 4 8 4.67157 8 5.5V18.5C8 19.3284 8.67157 20 9.5 20C10.3284 20 11 19.3284 11 18.5V5.5C11 4.67157 10.3284 4 9.5 4Z" fill="currentColor" className={styles.bar1} />
      <path d="M13 8.5C13 7.67157 13.6716 7 14.5 7C15.3284 7 16 7.67157 16 8.5V15.5C16 16.3284 15.3284 17 14.5 17C13.6716 17 13 16.3284 13 15.5V8.5Z" fill="currentColor" className={styles.bar2} />
      <path d="M4.5 9C3.67157 9 3 9.67157 3 10.5V13.5C3 14.3284 3.67157 15 4.5 15C5.32843 15 6 14.3284 6 13.5V10.5C6 9.67157 5.32843 9 4.5 9Z" fill="currentColor" className={styles.bar3} />
      <path d="M19.5 9C18.6716 9 18 9.67157 18 10.5V13.5C18 14.3284 18.6716 15 19.5 15C20.3284 15 21 14.3284 21 13.5V10.5C21 9.67157 20.3284 9 19.5 9Z" fill="currentColor" className={styles.bar4} />
    </svg>
  );
}
