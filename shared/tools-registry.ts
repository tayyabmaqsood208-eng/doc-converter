import { ToolDefinition, ToolCategory } from './types';

export const TOOL_CATEGORIES: { id: ToolCategory; label: string }[] = [
  { id: 'all', label: 'All Tools' },
  { id: 'organize', label: 'Organize PDF' },
  { id: 'optimize', label: 'Optimize PDF' },
  { id: 'convert-to-pdf', label: 'Convert to PDF' },
  { id: 'convert-from-pdf', label: 'Convert from PDF' },
  { id: 'security', label: 'PDF Security' },
];

export const TOOLS_REGISTRY: ToolDefinition[] = [
  {
    id: 'merge-pdf',
    name: 'Merge PDF',
    shortDescription: 'Combine multiple PDF files into a single document in your chosen order.',
    description: 'Merge two or more PDF files easily with drag-and-drop page reordering.',
    category: 'organize',
    accentColorToken: 'var(--accent-organize)',
    route: '/tools/merge-pdf',
    acceptedTypes: ['.pdf'],
    acceptedMimeTypes: ['application/pdf'],
    maxSizeMB: 50,
    badgeIcons: { primary: 'PDF', secondary: 'PDF' }
  },
  {
    id: 'split-pdf',
    name: 'Split PDF',
    shortDescription: 'Separate one PDF into individual pages or extract custom page ranges.',
    description: 'Extract specific pages or split your document into multiple smaller PDFs.',
    category: 'organize',
    accentColorToken: 'var(--accent-organize)',
    route: '/tools/split-pdf',
    acceptedTypes: ['.pdf'],
    acceptedMimeTypes: ['application/pdf'],
    maxSizeMB: 50,
    badgeIcons: { primary: 'PDF', secondary: 'CUT' }
  },
  {
    id: 'compress-pdf',
    name: 'Compress PDF',
    shortDescription: 'Reduce PDF file size while maintaining maximum layout and image quality.',
    description: 'Shrink large PDF files to optimize storage and email sharing.',
    category: 'optimize',
    accentColorToken: 'var(--accent-optimize)',
    route: '/tools/compress-pdf',
    acceptedTypes: ['.pdf'],
    acceptedMimeTypes: ['application/pdf'],
    maxSizeMB: 100,
    badgeIcons: { primary: 'PDF', secondary: 'ZIP' }
  },
  {
    id: 'pdf-to-word',
    name: 'PDF to Word',
    shortDescription: 'Convert PDF files to editable DOCX documents with high layout fidelity.',
    description: 'Transform your PDF into Microsoft Word format while preserving paragraphs, tables, and images.',
    category: 'convert-from-pdf',
    accentColorToken: 'var(--accent-word)',
    route: '/tools/pdf-to-word',
    acceptedTypes: ['.pdf'],
    acceptedMimeTypes: ['application/pdf'],
    maxSizeMB: 50,
    badgeIcons: { primary: 'PDF', secondary: 'DOC' }
  },
  {
    id: 'word-to-pdf',
    name: 'Word to PDF',
    shortDescription: 'Convert DOC and DOCX documents into clean, professional PDF files.',
    description: 'Make DOC and DOCX files easy to read by converting them to PDF format.',
    category: 'convert-to-pdf',
    accentColorToken: 'var(--accent-word)',
    route: '/tools/word-to-pdf',
    acceptedTypes: ['.doc', '.docx'],
    acceptedMimeTypes: [
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ],
    maxSizeMB: 50,
    badgeIcons: { primary: 'DOC', secondary: 'PDF' }
  },
  {
    id: 'pdf-to-ppt',
    name: 'PDF to PowerPoint',
    shortDescription: 'Turn PDF presentations into editable PPTX slides.',
    description: 'Convert PDF pages into editable Microsoft PowerPoint presentation slides.',
    category: 'convert-from-pdf',
    accentColorToken: 'var(--accent-ppt)',
    route: '/tools/pdf-to-ppt',
    acceptedTypes: ['.pdf'],
    acceptedMimeTypes: ['application/pdf'],
    maxSizeMB: 50,
    badgeIcons: { primary: 'PDF', secondary: 'PPT' }
  },
  {
    id: 'ppt-to-pdf',
    name: 'PowerPoint to PDF',
    shortDescription: 'Convert PPT and PPTX slides into crisp PDF presentations.',
    description: 'Make PPT and PPTX slideshows easy to view by converting them to PDF format.',
    category: 'convert-to-pdf',
    accentColorToken: 'var(--accent-ppt)',
    route: '/tools/ppt-to-pdf',
    acceptedTypes: ['.ppt', '.pptx'],
    acceptedMimeTypes: [
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation'
    ],
    maxSizeMB: 50,
    badgeIcons: { primary: 'PPT', secondary: 'PDF' }
  },
  {
    id: 'pdf-to-excel',
    name: 'PDF to Excel',
    shortDescription: 'Extract tabular data from PDF files into editable XLSX spreadsheets.',
    description: 'Pull data straight from PDFs into Excel spreadsheets in a few seconds.',
    category: 'convert-from-pdf',
    accentColorToken: 'var(--accent-excel)',
    route: '/tools/pdf-to-excel',
    acceptedTypes: ['.pdf'],
    acceptedMimeTypes: ['application/pdf'],
    maxSizeMB: 50,
    badgeIcons: { primary: 'PDF', secondary: 'XLS' }
  },
  {
    id: 'excel-to-pdf',
    name: 'Excel to PDF',
    shortDescription: 'Convert XLS and XLSX spreadsheets into formatted PDF documents.',
    description: 'Make EXCEL spreadsheets easy to read by converting them to PDF format.',
    category: 'convert-to-pdf',
    accentColorToken: 'var(--accent-excel)',
    route: '/tools/excel-to-pdf',
    acceptedTypes: ['.xls', '.xlsx'],
    acceptedMimeTypes: [
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ],
    maxSizeMB: 50,
    badgeIcons: { primary: 'XLS', secondary: 'PDF' }
  },
  {
    id: 'rotate-pdf',
    name: 'Rotate PDF',
    shortDescription: 'Rotate individual or all pages in your PDF by 90, 180, or 270 degrees.',
    description: 'Fix upside-down or sideways pages in your PDF document quickly.',
    category: 'organize',
    accentColorToken: 'var(--accent-organize)',
    route: '/tools/rotate-pdf',
    acceptedTypes: ['.pdf'],
    acceptedMimeTypes: ['application/pdf'],
    maxSizeMB: 50,
    badgeIcons: { primary: 'PDF', secondary: 'ROT' }
  },
  {
    id: 'watermark-pdf',
    name: 'Watermark PDF',
    shortDescription: 'Stamp text or image watermarks across your PDF pages.',
    description: 'Protect your intellectual property by overlaying custom text or image watermarks.',
    category: 'security',
    accentColorToken: 'var(--accent-security)',
    route: '/tools/watermark-pdf',
    acceptedTypes: ['.pdf'],
    acceptedMimeTypes: ['application/pdf'],
    maxSizeMB: 50,
    badgeIcons: { primary: 'PDF', secondary: 'WM' }
  },
  {
    id: 'protect-pdf',
    name: 'Protect PDF',
    shortDescription: 'Encrypt your PDF with a strong password to prevent unauthorized viewing.',
    description: 'Add password encryption to keep sensitive document content secure.',
    category: 'security',
    accentColorToken: 'var(--accent-security)',
    route: '/tools/protect-pdf',
    acceptedTypes: ['.pdf'],
    acceptedMimeTypes: ['application/pdf'],
    maxSizeMB: 50,
    badgeIcons: { primary: 'PDF', secondary: 'LOCK' }
  },
  {
    id: 'unlock-pdf',
    name: 'Unlock PDF',
    shortDescription: 'Remove password security from protected PDF files.',
    description: 'Decrypt password-protected PDFs so you can freely view and edit them.',
    category: 'security',
    accentColorToken: 'var(--accent-security)',
    route: '/tools/unlock-pdf',
    acceptedTypes: ['.pdf'],
    acceptedMimeTypes: ['application/pdf'],
    maxSizeMB: 50,
    badgeIcons: { primary: 'PDF', secondary: 'KEY' }
  },
  {
    id: 'edit-pdf',
    name: 'Edit PDF',
    shortDescription: 'Add text, drawings, shapes, and images directly onto PDF pages.',
    description: 'Annotate and edit PDF files online with text blocks, shapes, and signatures.',
    category: 'organize',
    accentColorToken: 'var(--accent-organize)',
    route: '/tools/edit-pdf',
    acceptedTypes: ['.pdf'],
    acceptedMimeTypes: ['application/pdf'],
    maxSizeMB: 50,
    badgeIcons: { primary: 'PDF', secondary: 'EDIT' }
  },
  {
    id: 'image-resizer',
    name: 'Image Resizer & KB Compressor',
    shortDescription: 'Resize image dimensions and compress photo size from 3MB down to 30KB, 50KB or custom resolution.',
    description: 'Compress JPG, PNG, or WEBP photos to target sizes (30KB, 50KB, 100KB, 200KB, 500KB) or custom pixel dimensions with high-fidelity quality.',
    category: 'optimize',
    accentColorToken: 'var(--accent-optimize)',
    route: '/tools/image-resizer',
    acceptedTypes: ['.jpg', '.jpeg', '.png', '.webp'],
    acceptedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
    maxSizeMB: 50,
    badgeIcons: { primary: 'IMG', secondary: 'RESIZE' }
  }
];

export function getToolById(id: string): ToolDefinition | undefined {
  return TOOLS_REGISTRY.find(t => t.id === id);
}
