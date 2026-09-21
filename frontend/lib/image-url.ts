export function freshImageUrl(url: string, version?: string) {
  if (!url || url.startsWith("/")) return url;
  const key = version || url;
  return `${url}${url.includes("?") ? "&" : "?"}v=${encodeURIComponent(key)}`;
}
