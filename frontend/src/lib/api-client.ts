import { ProcessingJobResponse } from '@shared/types';
import { processImageResizerClient, processPdfClient } from './client-engine';
import { API_BASE_URL } from './api-base';

export async function uploadAndProcessFiles(
  endpoint: string,
  files: File[],
  options?: Record<string, any>,
  onProgress?: (percent: number) => void
): Promise<{ downloadUrl: string; fileName: string; fileSize?: number }> {
  // If endpoint is image-resizer, try browser client engine first for instant sub-second performance & Netlify compatibility!
  if (endpoint === 'image-resizer') {
    try {
      onProgress?.(30);
      const res = await processImageResizerClient(files[0], options);
      onProgress?.(100);
      return res;
    } catch (err) {
      console.warn('Client-side resizer failed, falling back to server...', err);
    }
  }

  // Primary Server Request Path
  return new Promise((resolve, reject) => {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });

    if (options) {
      Object.keys(options).forEach(key => {
        formData.append(key, typeof options[key] === 'object' ? JSON.stringify(options[key]) : String(options[key]));
      });
    }

    const xhr = new XMLHttpRequest();
    xhr.open('POST', `${API_BASE_URL}/${endpoint}`);

    if (xhr.upload && onProgress) {
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percent = Math.round((event.loaded / event.total) * 90);
          onProgress(percent);
        }
      };
    }

    xhr.onload = async () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const res: ProcessingJobResponse = JSON.parse(xhr.responseText);
          
          if (res.jobId && res.status === 'queued') {
            onProgress?.(95);
            const result = await pollJobStatus(res.jobId);
            onProgress?.(100);
            resolve({
              downloadUrl: `${API_BASE_URL}${result.downloadUrl}`,
              fileName: result.fileName || 'converted_document.pdf',
              fileSize: result.fileSize
            });
          } else if (res.downloadUrl) {
            onProgress?.(100);
            const fullUrl = res.downloadUrl.startsWith('http') ? res.downloadUrl : `${API_BASE_URL}${res.downloadUrl}`;
            resolve({
              downloadUrl: fullUrl,
              fileName: res.fileName || 'converted_document.pdf',
              fileSize: res.fileSize
            });
          } else {
            reject(new Error(res.error || 'Server responded without download URL'));
          }
        } catch (e) {
          reject(new Error('Failed to parse server response'));
        }
      } else {
        // Fallback to client browser engine on Netlify server error
        try {
          onProgress?.(80);
          const clientResult = await processPdfClient(endpoint, files, options);
          onProgress?.(100);
          resolve(clientResult);
        } catch {
          try {
            const errRes = JSON.parse(xhr.responseText);
            reject(new Error(errRes.error || `Upload failed with status ${xhr.status}`));
          } catch {
            reject(new Error(`Upload failed with status ${xhr.status}`));
          }
        }
      }
    };

    xhr.onerror = async () => {
      // Automatic fallback for Netlify standalone deployment (when localhost:5000 is not reachable)
      try {
        onProgress?.(50);
        const clientResult = endpoint === 'image-resizer'
          ? await processImageResizerClient(files[0], options)
          : await processPdfClient(endpoint, files, options);
        onProgress?.(100);
        resolve(clientResult);
      } catch (err: any) {
        reject(new Error('Network error during file upload to server.'));
      }
    };

    xhr.send(formData);
  });
}

export async function pollJobStatus(jobId: string, intervalMs = 1000): Promise<ProcessingJobResponse> {
  while (true) {
    const res = await fetch(`${API_BASE_URL}/jobs/${jobId}`);
    if (!res.ok) {
      throw new Error(`Failed to check job status (${res.status})`);
    }
    const job: ProcessingJobResponse = await res.json();
    if (job.status === 'completed') {
      return job;
    }
    if (job.status === 'failed') {
      throw new Error(job.error || 'Conversion job failed on server.');
    }
    await new Promise(r => setTimeout(r, intervalMs));
  }
}
