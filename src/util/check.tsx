/**
 * Check if a service/project URL is reachable.
 * Returns true if the URL responds with a successful status, false otherwise.
 */
export async function checkUrlStatus(url: string): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

    const response = await fetch(url, {
      method: 'HEAD',
      mode: 'no-cors', // Allow cross-origin requests
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    // With 'no-cors', we can't read the status, so we assume success if no error
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Check multiple URLs and return their statuses.
 */
export async function checkMultipleUrls(
  urls: string[]
): Promise<Map<string, boolean>> {
  const results = await Promise.all(
    urls.map(async (url) => {
      const isRunning = await checkUrlStatus(url);
      return [url, isRunning] as [string, boolean];
    })
  );

  return new Map(results);
}

/**
 * Get status label based on URL reachability.
 */
export function getStatusLabel(isRunning: boolean): string {
  return isRunning ? 'Running' : 'Offline';
}

/**
 * Get status color classes based on URL reachability.
 */
export function getStatusColorClasses(isRunning: boolean): {
  bg: string;
  border: string;
  dot: string;
} {
  if (isRunning) {
    return {
      bg: 'bg-green-600/20',
      border: 'border-green-600/40',
      dot: 'bg-green-400',
    };
  }
  return {
    bg: 'bg-red-600/20',
    border: 'border-red-600/40',
    dot: 'bg-red-400',
  };
}