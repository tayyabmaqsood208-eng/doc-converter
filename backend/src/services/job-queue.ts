import { v4 as uuidv4 } from 'uuid';
import { ProcessingJobResponse } from '../../../shared/types';

interface JobData extends ProcessingJobResponse {
  createdAt: number;
  task?: () => Promise<{ downloadUrl: string; fileName: string; fileSize?: number }>;
}

const jobsMap = new Map<string, JobData>();

export const jobQueue = {
  createJob(task?: () => Promise<{ downloadUrl: string; fileName: string; fileSize?: number }>): string {
    const jobId = uuidv4();
    const job: JobData = {
      jobId,
      status: 'queued',
      progress: 0,
      createdAt: Date.now(),
      task
    };

    jobsMap.set(jobId, job);

    if (task) {
      // Execute in background
      setTimeout(async () => {
        try {
          jobQueue.updateJob(jobId, { status: 'processing', progress: 30 });
          const result = await task();
          jobQueue.updateJob(jobId, {
            status: 'completed',
            progress: 100,
            downloadUrl: result.downloadUrl,
            fileName: result.fileName,
            fileSize: result.fileSize
          });
        } catch (err: any) {
          jobQueue.updateJob(jobId, {
            status: 'failed',
            error: err.message || 'Processing failed'
          });
        }
      }, 50);
    }

    return jobId;
  },

  getJob(jobId: string): ProcessingJobResponse | undefined {
    const job = jobsMap.get(jobId);
    if (!job) return undefined;
    const { task, createdAt, ...res } = job;
    return res;
  },

  updateJob(jobId: string, updates: Partial<JobData>): void {
    const job = jobsMap.get(jobId);
    if (job) {
      Object.assign(job, updates);
    }
  }
};
