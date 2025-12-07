export const validateImages = (value: string) => {
  if (!value.trim()) {
    return 'Images field cannot be empty';
  }

  const urls = value
    .split(',')
    .map((url) => url.trim())
    .filter((url) => url);
  const urlRegex = /^https?:\/\/[^\s$.?#].[^\s]*$/i;

  for (const url of urls) {
    if (!urlRegex.test(url)) {
      return 'Each image must be a valid URL (e.g., https://example.com/image.jpg)';
    }
  }

  return true;
};
