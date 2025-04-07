export const buildQueryString = <T extends Record<string, any>>(criteria?: Partial<T>): string | null => {
  if (!criteria || Object.keys(criteria).length === 0) {
    return null;
  }

  const queryParams = Object.entries(criteria)
    .filter(([_, value]) => value !== undefined && value !== null && value !== '')
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&');

  return queryParams ? `?${queryParams}` : null;
}; 