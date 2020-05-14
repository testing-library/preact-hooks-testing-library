import flushMicroTasks from "./flush-microtasks";

type CleanupCallback = () => void;

let cleanupCallbacks: Set<CleanupCallback> = new Set();

export async function cleanup() {
  await flushMicroTasks();
  cleanupCallbacks.forEach((cb) => cb());
  cleanupCallbacks.clear();
}

export function addCleanup(callback: CleanupCallback) {
  cleanupCallbacks.add(callback);
}

export function removeCleanup(callback: CleanupCallback) {
  cleanupCallbacks.delete(callback);
}
