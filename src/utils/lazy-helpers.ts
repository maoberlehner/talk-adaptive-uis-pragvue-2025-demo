import { isArray, isFunction, isObject, isPromise } from "@/utils/type-helpers";

export type MaybePromise<T> = T | Promise<T>;

export type MaybeLazy<T> = MaybePromise<T> | (() => MaybePromise<T>);

export type UnwrapMaybeLazy<T> = T extends () => infer R ? Awaited<R> : Awaited<T>;

export const resolveDeep = async <T extends MaybeLazy<unknown>>(
  value: T,
): Promise<UnwrapMaybeLazy<T>> => {
  if (isPromise(value)) return resolveDeep(await value);
  if (isFunction(value)) return resolveDeep(await value());
  if (isArray(value)) return Promise.all(value.map(resolveDeep)) as UnwrapMaybeLazy<T>;
  if (isObject(value)) {
    const willBeEntries: MaybePromise<[number | string, unknown]>[] = [];
    for (const [key, v] of Object.entries(value)) {
      willBeEntries.push(resolveDeep(v).then((x) => [key, x]));
    }
    return Object.fromEntries(await Promise.all(willBeEntries)) as UnwrapMaybeLazy<T>;
  }

  return value as UnwrapMaybeLazy<T>;
};
