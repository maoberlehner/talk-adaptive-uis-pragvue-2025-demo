export const isPromise = <T = unknown>(value: unknown): value is PromiseLike<T> => {
  if (value === null) return false;
  const type = typeof value;
  if (type !== "object" && type !== "function") return false;
  try {
    const then = (value as { then?: unknown }).then;
    return typeof then === "function";
  } catch {
    return false;
  }
};

export const isFunction = (value: unknown) => typeof value === "function";

export const isArray = (value: unknown) => Array.isArray(value);

export const isObject = (value: unknown) => value !== null && typeof value === "object";
