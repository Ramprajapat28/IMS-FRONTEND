// Shared utility functions

/**
 * Formats a date to a localized string
 */
export const formatDate = (date: Date | string, locale = "en-US"): string => {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

/**
 * Formats a number as currency
 */
export const formatCurrency = (
  amount: number,
  currency = "INR",
  locale = "en-IN"
): string => {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(amount);
};

/**
 * Resolves a product image URL from various formats (string, object, array, JSON)
 */
export const resolveUrl = (image: any): string => {
  if (!image) return "";

  // 1. Handle Array (extract first item)
  if (Array.isArray(image)) {
    if (image.length === 0) return "";
    const first = image[0];
    return typeof first === 'object' ? (first.file_path || first.cdnUrl || first.url || "") : String(first);
  }

  // 2. Handle Object (single image object)
  if (typeof image === 'object') {
    return image.file_path || image.cdnUrl || image.url || "";
  }

  // 3. Handle String (potential JSON)
  if (typeof image === 'string') {
    if (image.startsWith('{') || image.startsWith('[')) {
      try {
        const parsed = JSON.parse(image);
        if (Array.isArray(parsed) || typeof parsed === 'object') {
          if (Array.isArray(parsed)) {
            if (parsed.length === 0) return "";
            const first = parsed[0];
            return typeof first === 'object' ? (first.file_path || first.cdnUrl || first.url || "") : String(first);
          }
          return parsed.file_path || parsed.cdnUrl || parsed.url || "";
        }
      } catch {
        return image;
      }
    }
    return image;
  }
  return "";
};

/**
 * Generates a unique ID
 */
export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Debounce function
 */
export const debounce = <T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

/**
 * Classnames utility for conditional class joining
 */
export const cn = (...classes: (string | boolean | undefined | null)[]): string => {
  return classes.filter(Boolean).join(" ");
};

/**
 * Truncates text to a specified length
 */
export const truncate = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
};

/**
 * Capitalizes the first letter of a string
 */
export const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};
