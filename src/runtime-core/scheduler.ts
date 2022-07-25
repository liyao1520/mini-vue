const queue: any[] = [];

let isFlushPending = false;

export function queueJobs(job) {
  if (!queue.includes(job)) {
    queue.push(job);
  }
  queueFlush();
}
function queueFlush() {
  if (isFlushPending) return;
  nextTick(flushJobs);
}
function flushJobs() {
  isFlushPending = false;
  while (queue.length) {
    const job = queue.shift();
    job && job();
  }
}
export function nextTick(fn) {
  const p = Promise.resolve();
  return fn ? p.then(fn) : p;
}
