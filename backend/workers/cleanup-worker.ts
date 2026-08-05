import { fileStore } from '../src/services/file-store';

const RETENTION_HOURS = parseFloat(process.env.RETENTION_HOURS || '1');
const CLEANUP_INTERVAL_MS = 15 * 60 * 1000; // Run every 15 minutes

export function startCleanupWorker() {
  console.log(`[CleanupWorker] Starting background file retention purge worker (Interval: 15m, Max File Age: ${RETENTION_HOURS}h)...`);
  
  // Run immediately on server boot
  try {
    const deletedCount = fileStore.purgeExpiredFiles(RETENTION_HOURS);
    console.log(`[CleanupWorker Initial Run] Purged ${deletedCount} expired temp files.`);
  } catch (err) {
    console.error('[CleanupWorker Initial Run] Error purging files:', err);
  }

  // Schedule interval
  setInterval(() => {
    try {
      const deletedCount = fileStore.purgeExpiredFiles(RETENTION_HOURS);
      if (deletedCount > 0) {
        console.log(`[CleanupWorker Scheduled Run] Purged ${deletedCount} expired temp files.`);
      }
    } catch (err) {
      console.error('[CleanupWorker Scheduled Run] Error purging files:', err);
    }
  }, CLEANUP_INTERVAL_MS);
}
