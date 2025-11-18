/**
 * Check if a service/project URL is reachable.
 * Returns true if the URL responds (even with CORS restrictions), false on network errors.
 * Note: With 'no-cors' mode, we cannot read HTTP status codes due to browser security.
 * This only detects if the service is reachable at the network level.
 */
export async function checkUrlStatus(url: string): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

    await fetch(url, {
      method: 'GET', // Changed to GET as some servers don't support HEAD
      mode: 'no-cors', // Required to avoid CORS errors
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    // With 'no-cors', response.type will be 'opaque'
    // We can't read status, but if fetch succeeds, the server is reachable
    return true;
  } catch (error) {
    // Network error, timeout, or DNS failure
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