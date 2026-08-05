import { ToolDefinition, FileValidationResult } from '@shared/types';

export function validateFile(file: File, tool: ToolDefinition): FileValidationResult {
  if (!file) {
    return { valid: false, error: 'No file selected.' };
  }

  const maxSizeBytes = tool.maxSizeMB * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    return {
      valid: false,
      error: `File size (${(file.size / (1024 * 1024)).toFixed(1)}MB) exceeds the maximum allowed limit of ${tool.maxSizeMB}MB for ${tool.name}.`,
      fileSize: file.size,
      mimeType: file.type
    };
  }

  const fileExt = '.' + file.name.split('.').pop()?.toLowerCase();
  const isExtensionValid = tool.acceptedTypes.includes(fileExt);

  if (!isExtensionValid) {
    return {
      valid: false,
      error: `Invalid file format "${fileExt}". Accepted formats for ${tool.name}: ${tool.acceptedTypes.join(', ')}`,
      fileSize: file.size,
      mimeType: file.type
    };
  }

  return {
    valid: true,
    fileSize: file.size,
    mimeType: file.type
  };
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
