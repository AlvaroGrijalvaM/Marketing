/**
 * Loads a single image and returns a Promise that resolves when the image
 * is fully loaded, or rejects if loading fails.
 * @param {string} src - The image source URL
 * @returns {Promise<HTMLImageElement>}
 */
export function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
    img.src = src;
  });
}

/**
 * Loads multiple images concurrently using Promise.allSettled so that
 * individual failures do not block the whole batch.
 * @param {string[]} sources - Array of image source URLs
 * @returns {Promise<PromiseSettledResult<HTMLImageElement>[]>}
 */
export function loadImages(sources) {
  const promises = sources.map((src) => loadImage(src));
  return Promise.allSettled(promises);
}