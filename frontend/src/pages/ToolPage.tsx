import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getToolById } from '@/data/tools-registry';
import { UploadDropzone } from '../components/tools/UploadDropzone';
import { ProcessingState } from '../components/tools/ProcessingState';
import { ResultDownload } from '../components/tools/ResultDownload';
import { Toast } from '../components/ui/Toast';
import { Button } from '../components/ui/Button';
import { uploadAndProcessFiles } from '../lib/api-client';
import { ArrowLeft } from 'lucide-react';

export const ToolPage: React.FC = () => {
  const { toolId } = useParams<{ toolId: string }>();
  const tool = getToolById(toolId || '');

  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<{ downloadUrl: string; fileName: string; fileSize?: number } | null>(null);
  const [toastError, setToastError] = useState<string | null>(null);

  const [rotationAngle, setRotationAngle] = useState(90);
  const [watermarkText, setWatermarkText] = useState('CONFIDENTIAL');
  const [password, setPassword] = useState('');
  const [pageRanges, setPageRanges] = useState('all');
  const [annotationText, setAnnotationText] = useState('Sample Annotation');
  const [targetKB, setTargetKB] = useState(30);
  const [outputFormat, setOutputFormat] = useState('jpeg');
  const [customWidth, setCustomWidth] = useState('');
  const [customHeight, setCustomHeight] = useState('');

  if (!tool) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '64px 0' }}>
        <h2>Tool Not Found</h2>
        <p style={{ margin: '16px 0 24px' }}>The requested document conversion tool does not exist.</p>
        <Link to="/">
          <Button variant="primary">Back to All Tools</Button>
        </Link>
      </div>
    );
  }

  const endpointMap: Record<string, string> = {
    'merge-pdf': 'merge',
    'split-pdf': 'split',
    'compress-pdf': 'compress',
    'word-to-pdf': 'convert-office-to-pdf',
    'ppt-to-pdf': 'convert-office-to-pdf',
    'excel-to-pdf': 'convert-office-to-pdf',
    'pdf-to-word': 'convert-pdf-to-office',
    'pdf-to-ppt': 'convert-pdf-to-office',
    'pdf-to-excel': 'convert-pdf-to-office',
    'rotate-pdf': 'rotate',
    'watermark-pdf': 'watermark',
    'protect-pdf': 'protect',
    'unlock-pdf': 'unlock',
    'edit-pdf': 'edit',
    'image-resizer': 'image-resizer'
  };

  const handleStartConversion = async () => {
    if (files.length === 0) {
      setToastError('Please select a file to process.');
      return;
    }

    setIsProcessing(true);
    setProgress(10);
    setToastError(null);

    const options: Record<string, any> = { toolId: tool.id };
    
    if (tool.id === 'rotate-pdf') options.rotationAngle = rotationAngle;
    if (tool.id === 'watermark-pdf') options.watermarkText = watermarkText;
    if (tool.id === 'protect-pdf' || tool.id === 'unlock-pdf') options.password = password;
    if (tool.id === 'split-pdf') options.pageRanges = pageRanges;
    if (tool.id === 'edit-pdf') options.annotations = JSON.stringify([{ pageNum: 1, text: annotationText, x: 50, y: 700 }]);

    if (tool.id === 'image-resizer') {
      options.targetKB = targetKB;
      options.format = outputFormat;
      if (customWidth) options.targetWidth = customWidth;
      if (customHeight) options.targetHeight = customHeight;
    }

    if (tool.id === 'pdf-to-word') options.targetFormat = 'docx';
    if (tool.id === 'pdf-to-ppt') options.targetFormat = 'pptx';
    if (tool.id === 'pdf-to-excel') options.targetFormat = 'xlsx';

    try {
      const endpoint = endpointMap[tool.id] || 'merge';
      const res = await uploadAndProcessFiles(endpoint, files, options, (p) => setProgress(p));
      setResult(res);
    } catch (err: any) {
      setToastError(err.message || 'Operation failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const resetState = () => {
    setFiles([]);
    setIsProcessing(false);
    setProgress(0);
    setResult(null);
    setToastError(null);
  };

  return (
    <div className="container" style={{ padding: '32px 0 64px' }}>
      <Link
        to="/"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          color: 'var(--color-ink-500)',
          textDecoration: 'none',
          marginBottom: '24px',
          fontWeight: 600,
          fontSize: '14px'
        }}
      >
        <ArrowLeft size={16} /> All PDF Tools
      </Link>

      {/* Tool Header */}
      <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 32px' }}>
        <h1 style={{ fontSize: '36px', fontWeight: 800, marginBottom: '12px' }}>
          {tool.name}
        </h1>
        <p style={{ fontSize: '16px', color: 'var(--color-ink-500)', lineHeight: '1.5' }}>
          {tool.description}
        </p>

        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '16px',
            flexWrap: 'wrap',
            marginTop: '16px',
            fontSize: '13px',
            color: 'var(--color-ink-500)'
          }}
        >
          <span style={{ backgroundColor: 'var(--color-surface)', padding: '4px 10px', borderRadius: '4px', border: '1px solid var(--color-border)' }}>
            Max Size: {tool.maxSizeMB}MB
          </span>
          <span style={{ backgroundColor: 'var(--color-surface)', padding: '4px 10px', borderRadius: '4px', border: '1px solid var(--color-border)' }}>
            Formats: {tool.acceptedTypes.join(', ')}
          </span>
          <span style={{ backgroundColor: 'var(--color-primary-light)', color: 'var(--color-primary)', padding: '4px 10px', borderRadius: '4px', fontWeight: 600 }}>
            Automated 1-Hour Purge
          </span>
        </div>
      </div>

      {/* Main Workspace */}
      {result ? (
        <ResultDownload
          downloadUrl={result.downloadUrl}
          fileName={result.fileName}
          fileSize={result.fileSize}
          onReset={resetState}
        />
      ) : isProcessing ? (
        <ProcessingState
          toolName={tool.name}
          progress={progress}
          statusMessage={`High-fidelity server-side ${tool.name.toLowerCase()} processing...`}
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', alignItems: 'center' }}>
          <UploadDropzone
            tool={tool}
            multiple={tool.id === 'merge-pdf'}
            onFilesSelected={setFiles}
            onError={setToastError}
          />

          {/* Option Controls based on Tool */}
          {files.length > 0 && (
            <div
              style={{
                backgroundColor: 'var(--color-surface)',
                borderRadius: 'var(--radius-card)',
                border: '1px solid var(--color-border)',
                padding: '24px',
                width: '100%',
                maxWidth: '720px',
                boxShadow: 'var(--shadow-card-default)'
              }}
            >
              <h4 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px' }}>
                Tool Options
              </h4>

              {tool.id === 'rotate-pdf' && (
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '8px' }}>
                    Select Rotation Angle:
                  </label>
                  <select
                    value={rotationAngle}
                    onChange={(e) => setRotationAngle(parseInt(e.target.value, 10))}
                    style={{ padding: '10px 14px', borderRadius: '6px', border: '1px solid var(--color-border)', width: '100%' }}
                  >
                    <option value={90}>90° Right (Clockwise)</option>
                    <option value={180}>180° Upside Down</option>
                    <option value={270}>270° Left (Counter-clockwise)</option>
                  </select>
                </div>
              )}

              {tool.id === 'watermark-pdf' && (
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '8px' }}>
                    Watermark Text Overlay:
                  </label>
                  <input
                    type="text"
                    value={watermarkText}
                    onChange={(e) => setWatermarkText(e.target.value)}
                    placeholder="e.g. CONFIDENTIAL, DRAFT"
                    style={{ padding: '10px 14px', borderRadius: '6px', border: '1px solid var(--color-border)', width: '100%' }}
                  />
                </div>
              )}

              {(tool.id === 'protect-pdf' || tool.id === 'unlock-pdf') && (
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '8px' }}>
                    Document Password:
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password..."
                    style={{ padding: '10px 14px', borderRadius: '6px', border: '1px solid var(--color-border)', width: '100%' }}
                  />
                </div>
              )}

              {tool.id === 'split-pdf' && (
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '8px' }}>
                    Page Ranges to Extract:
                  </label>
                  <input
                    type="text"
                    value={pageRanges}
                    onChange={(e) => setPageRanges(e.target.value)}
                    placeholder="e.g. all, 1-3, 5, 7-10"
                    style={{ padding: '10px 14px', borderRadius: '6px', border: '1px solid var(--color-border)', width: '100%' }}
                  />
                  <span style={{ fontSize: '12px', color: 'var(--color-ink-500)', marginTop: '4px', display: 'block' }}>
                    Use 'all' to split into single-page PDFs, or specify comma-separated ranges.
                  </span>
                </div>
              )}

              {tool.id === 'edit-pdf' && (
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '8px' }}>
                    Annotation Text Stamp:
                  </label>
                  <input
                    type="text"
                    value={annotationText}
                    onChange={(e) => setAnnotationText(e.target.value)}
                    placeholder="Text to overlay on PDF..."
                    style={{ padding: '10px 14px', borderRadius: '6px', border: '1px solid var(--color-border)', width: '100%' }}
                  />
                </div>
              )}

              {tool.id === 'image-resizer' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: 700, marginBottom: '8px' }}>
                      Target File Size (Compress e.g. 3MB → 30KB, 50KB):
                    </label>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>
                      {[30, 50, 100, 200, 500].map((size) => (
                        <button
                          key={size}
                          type="button"
                          onClick={() => setTargetKB(size)}
                          style={{
                            padding: '6px 14px',
                            borderRadius: '20px',
                            border: targetKB === size ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
                            backgroundColor: targetKB === size ? 'var(--color-primary-light)' : 'var(--color-surface)',
                            color: targetKB === size ? 'var(--color-primary)' : 'var(--color-ink-900)',
                            fontWeight: 700,
                            fontSize: '13px',
                            cursor: 'pointer'
                          }}
                        >
                          {size} KB ✨
                        </button>
                      ))}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <input
                        type="number"
                        value={targetKB}
                        onChange={(e) => setTargetKB(Math.max(5, parseInt(e.target.value || '30', 10)))}
                        min={5}
                        max={10000}
                        style={{ padding: '10px 14px', borderRadius: '8px', border: '1.5px solid var(--color-border)', width: '140px', backgroundColor: 'var(--color-surface)', color: 'var(--color-ink-900)', fontWeight: 700 }}
                      />
                      <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-ink-900)' }}>KB Target Limit</span>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
                        Custom Width (px) - Optional
                      </label>
                      <input
                        type="number"
                        value={customWidth}
                        onChange={(e) => setCustomWidth(e.target.value)}
                        placeholder="Auto scale"
                        style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--color-border)', width: '100%', backgroundColor: 'var(--color-surface)', color: 'var(--color-ink-900)' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
                        Custom Height (px) - Optional
                      </label>
                      <input
                        type="number"
                        value={customHeight}
                        onChange={(e) => setCustomHeight(e.target.value)}
                        placeholder="Auto scale"
                        style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--color-border)', width: '100%', backgroundColor: 'var(--color-surface)', color: 'var(--color-ink-900)' }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
                      Output Format:
                    </label>
                    <select
                      value={outputFormat}
                      onChange={(e) => setOutputFormat(e.target.value)}
                      style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--color-border)', width: '100%', backgroundColor: 'var(--color-surface)', color: 'var(--color-ink-900)', fontWeight: 600 }}
                    >
                      <option value="jpeg">JPG / JPEG (Best for size reduction)</option>
                      <option value="png">PNG (Preserve transparency)</option>
                      <option value="webp">WEBP (Modern web format)</option>
                    </select>
                  </div>
                </div>
              )}

              <Button
                variant="primary"
                size="lg"
                onClick={handleStartConversion}
                style={{ width: '100%', marginTop: '20px' }}
              >
                {tool.name} Now
              </Button>
            </div>
          )}
        </div>
      )}

      {toastError && (
        <Toast
          message={toastError}
          type="error"
          onClose={() => setToastError(null)}
        />
      )}
    </div>
  );
};
