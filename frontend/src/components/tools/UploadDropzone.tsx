import React, { useRef, useState } from 'react';
import { ToolDefinition } from '@shared/types';
import { validateFile, formatFileSize } from '../../lib/file-validation';
import { UploadCloud, FileText, Trash2, Plus } from 'lucide-react';
import { Button } from '../ui/Button';

interface UploadDropzoneProps {
  tool: ToolDefinition;
  multiple?: boolean;
  onFilesSelected: (files: File[]) => void;
  onError: (errorMsg: string) => void;
}

export const UploadDropzone: React.FC<UploadDropzoneProps> = ({
  tool,
  multiple = false,
  onFilesSelected,
  onError
}) => {
  const [isDragActive, setIsDragActive] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileValidationAndAdd = (newFiles: FileList | File[]) => {
    const fileArray = Array.from(newFiles);
    const validList: File[] = [];

    for (const f of fileArray) {
      const check = validateFile(f, tool);
      if (!check.valid) {
        onError(check.error || 'Invalid file uploaded');
        return;
      }
      validList.push(f);
    }

    const updated = multiple ? [...selectedFiles, ...validList] : validList;
    setSelectedFiles(updated);
    onFilesSelected(updated);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(true);
  };

  const handleDragLeave = () => {
    setIsDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileValidationAndAdd(e.dataTransfer.files);
    }
  };

  const removeFile = (index: number) => {
    const updated = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(updated);
    onFilesSelected(updated);
  };

  const moveFile = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= selectedFiles.length) return;
    const updated = [...selectedFiles];
    const [moved] = updated.splice(fromIndex, 1);
    updated.splice(toIndex, 0, moved);
    setSelectedFiles(updated);
    onFilesSelected(updated);
  };

  return (
    <div style={{ width: '100%', maxWidth: '720px', margin: '0 auto' }}>
      <input
        type="file"
        ref={fileInputRef}
        onChange={(e) => e.target.files && handleFileValidationAndAdd(e.target.files)}
        multiple={multiple}
        accept={tool.acceptedTypes.join(',')}
        style={{ display: 'none' }}
      />

      {selectedFiles.length === 0 ? (
        <div
          className={`dropzone ${isDragActive ? 'drag-active' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          tabIndex={0}
          onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && fileInputRef.current?.click()}
        >
          <div
            style={{
              width: '64px',
              height: '64px',
              backgroundColor: tool.accentColorToken,
              borderRadius: '16px',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}
          >
            <UploadCloud size={32} />
          </div>

          <h3 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '8px' }}>
            Choose {multiple ? 'files' : 'file'} or drop {multiple ? 'them' : 'it'} here
          </h3>

          <p style={{ color: 'var(--color-ink-500)', fontSize: '15px', marginBottom: '24px' }}>
            Accepts {tool.acceptedTypes.join(', ')} files up to {tool.maxSizeMB}MB
          </p>

          <Button variant="primary" size="lg" onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}>
            Select {tool.name.split(' ')[0]} {multiple ? 'Files' : 'File'}
          </Button>
        </div>
      ) : (
        <div
          style={{
            backgroundColor: 'var(--color-surface)',
            borderRadius: 'var(--radius-card)',
            border: '1px solid var(--color-border)',
            padding: '24px'
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px'
            }}
          >
            <h4 style={{ fontSize: '18px', fontWeight: 700 }}>
              Selected Files ({selectedFiles.length})
            </h4>
            {multiple && (
              <Button variant="secondary" size="sm" onClick={() => fileInputRef.current?.click()}>
                <Plus size={16} /> Add More Files
              </Button>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
            {selectedFiles.map((file, idx) => (
              <div
                key={`${file.name}-${idx}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 16px',
                  backgroundColor: 'var(--color-bg)',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--color-border)'
                }}
              >
                {multiple && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', cursor: 'grab' }}>
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => moveFile(idx, idx - 1)}
                      style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: '10px' }}
                    >
                      ▲
                    </button>
                    <button
                      type="button"
                      disabled={idx === selectedFiles.length - 1}
                      onClick={() => moveFile(idx, idx + 1)}
                      style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: '10px' }}
                    >
                      ▼
                    </button>
                  </div>
                )}
                <FileText size={24} color="var(--color-primary)" />
                <div style={{ flexGrow: 1, overflow: 'hidden' }}>
                  <div
                    style={{
                      fontWeight: 600,
                      fontSize: '15px',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}
                  >
                    {file.name}
                  </div>
                  <div style={{ fontSize: '13px', color: 'var(--color-ink-500)' }}>
                    {formatFileSize(file.size)}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeFile(idx)}
                  style={{
                    border: 'none',
                    background: 'none',
                    color: 'var(--color-error)',
                    cursor: 'pointer',
                    padding: '6px'
                  }}
                  title="Remove file"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
