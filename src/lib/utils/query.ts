import qs from "query-string";
import { formatPriceFilterLabel } from "@/lib/utils/currency";

type QueryValue = string | number | boolean | null | undefined | string[] | number[] | boolean[];
type QueryObject = Record<string, QueryValue>;

function toURLSearchParams(search: string): URLSearchParams {
  const raw = search.startsWith("?") ? search.slice(1) : search;
  return new URLSearchParams(raw);
}

export function parseQuery(search: string): QueryObject {
  const parsed = qs.parse(search, { arrayFormat: "bracket" });
  return parsed as QueryObject;
}

export function stringifyQuery(query: QueryObject): string {
  return qs.stringify(query, { skipNull: true, skipEmptyString: true, arrayFormat: "bracket" });
}

export function withUpdatedParams(pathname: string, currentSearch: string, updates: QueryObject): string {
  const current = parseQuery(currentSearch);
  const next: QueryObject = { ...current };

  Object.entries(updates).forEach(([key, value]) => {
    if (value === undefined || value === null || (Array.isArray(value) && value.length === 0)) {
      delete next[key];
    } else {
      next[key] = value as QueryValue;
    }
  });

  const search = stringifyQuery(next);
  return search ? `${pathname}?${search}` : pathname;
}

export function toggleArrayParam(
  pathname: string,
  currentSearch: string,
  key: string,
  value: string
): string {
  const params = toURLSearchParams(currentSearch);
  const current = new Set(getArrayParam(currentSearch, key));
  if (current.has(value)) {
    current.delete(value);
  } else {
    current.add(value);
  }
  params.delete(key);
  params.delete(`${key}[]`);
  for (const v of current) {
    params.append(key, v);
  }
  const next = params.toString();
  return next ? `${pathname}?${next}` : pathname;
}

export function setParam(
  pathname: string,
  currentSearch: string,
  key: string,
  value: string | number | null | undefined
): string {
  const params = toURLSearchParams(currentSearch);
  if (value === null || value === undefined) {
    params.delete(key);
  } else {
    params.set(key, String(value));
  }
  const next = params.toString();
  return next ? `${pathname}?${next}` : pathname;
}

export function removeParams(pathname: string, currentSearch: string, keys: string[]): string {
  const params = toURLSearchParams(currentSearch);
  for (const key of keys) {
    params.delete(key);
    params.delete(`${key}[]`);
  }
  const next = params.toString();
  return next ? `${pathname}?${next}` : pathname;
}

export function getArrayParam(search: string, key: string): string[] {
  const params = toURLSearchParams(search);
  const values = params.getAll(key);
  if (values.length) return values;
  return params.getAll(`${key}[]`);
}

export function getStringParam(search: string, key: string): string | undefined {
  const q = parseQuery(search);
  const v = q[key];
  if (v === undefined) return undefined;
  return Array.isArray(v) ? (v[0] ? String(v[0]) : undefined) : String(v);
}
/* New helpers for products */

export type NormalizedProductFilters = {
  search?: string;
  genderSlugs: string[];
  sizeSlugs: string[];
  colorSlugs: string[];
  brandSlugs: string[];
  categorySlugs: string[];
  priceMin?: number;
  priceMax?: number;
  priceRanges: Array<[number | undefined, number | undefined]>;
  sort: "featured" | "newest" | "price_asc" | "price_desc";
  page: number;
  limit: number;
};

export function parseFilterParams(sp: Record<string, string | string[] | undefined>): NormalizedProductFilters {
  const getArr = (k: string) => {
    const v1 = sp[k];
    const v2 = sp[`${k}[]`];
    const arr1 = Array.isArray(v1) ? v1.map(String) : v1 === undefined ? [] : [String(v1)];
    const arr2 = Array.isArray(v2) ? (v2 as string[]).map(String) : v2 === undefined ? [] : [String(v2 as string)];
    return [...arr1, ...arr2];
  };
  const getStr = (k: string) => {
    const v = sp[k] ?? sp[`${k}[]`];
    if (v === undefined) return undefined;
    return Array.isArray(v) ? (v[0] ? String(v[0]) : undefined) : String(v);
  };

  const search = getStr("search")?.trim() || undefined;

  const genderSlugs = getArr("gender").map((s) => s.toLowerCase());
  const sizeSlugs = getArr("size").map((s) => s.toLowerCase());
  const colorSlugs = getArr("color").map((s) => s.toLowerCase());
  const brandSlugs = getArr("brand").map((s) => s.toLowerCase());
  const categorySlugs = getArr("category").map((s) => s.toLowerCase());

  const priceRangesStr = getArr("price");
  const priceRanges: Array<[number | undefined, number | undefined]> = priceRangesStr
    .map((r) => {
      const [minStr, maxStr] = String(r).split("-");
      const min = minStr ? Number(minStr) : undefined;
      const max = maxStr ? Number(maxStr) : undefined;
      return [Number.isNaN(min as number) ? undefined : min, Number.isNaN(max as number) ? undefined : max] as [
        number | undefined,
        number | undefined
      ];
    })
    .filter(() => true);

  const priceMin = getStr("priceMin") ? Number(getStr("priceMin")) : undefined;
  const priceMax = getStr("priceMax") ? Number(getStr("priceMax")) : undefined;

  const sortParam = getStr("sort");
  const sort: NormalizedProductFilters["sort"] =
    sortParam === "price_asc" || sortParam === "price_desc" || sortParam === "newest" || sortParam === "featured"
      ? sortParam
      : "newest";

  const page = Math.max(1, Number(getStr("page") ?? 1) || 1);
  const limitRaw = Number(getStr("limit") ?? 24) || 24;
  const limit = Math.max(1, Math.min(limitRaw, 60));

  return {
    search,
    genderSlugs,
    sizeSlugs,
    colorSlugs,
    brandSlugs,
    categorySlugs,
    priceMin: priceMin !== undefined && !Number.isNaN(priceMin) ? priceMin : undefined,
    priceMax: priceMax !== undefined && !Number.isNaN(priceMax) ? priceMax : undefined,
    priceRanges,
    sort,
    page,
    limit,
  };
}

export function buildProductQueryObject(filters: NormalizedProductFilters) {
  return filters;
}

export type ActiveFilterBadge = {
  id: string;
  label: string;
  href: string;
};

function searchQueryString(sp: Record<string, string | string[] | undefined>): string {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(sp)) {
    if (value === undefined) continue;
    if (Array.isArray(value)) {
      for (const v of value) params.append(key, v);
    } else {
      params.set(key, value);
    }
  }
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

export function buildActiveFilterBadges(
  pathname: string,
  sp: Record<string, string | string[] | undefined>,
): ActiveFilterBadge[] {
  const search = searchQueryString(sp);
  const badges: ActiveFilterBadge[] = [];

  const searchQuery = typeof sp.search === "string" ? sp.search : sp.search?.[0];
  if (searchQuery) {
    badges.push({
      id: `search-${searchQuery}`,
      label: `Search: ${searchQuery}`,
      href: removeParams(pathname, search, ["search", "page"]),
    });
  }

  const appendArrayBadges = (
    key: "gender" | "size" | "color" | "price",
    values: string[],
    labelFn: (value: string) => string,
  ) => {
    for (const value of values) {
      badges.push({
        id: `${key}-${value}`,
        label: labelFn(value),
        href: toggleArrayParam(pathname, search, key, value),
      });
    }
  };

  appendArrayBadges(
    "gender",
    (sp.gender ? (Array.isArray(sp.gender) ? sp.gender : [sp.gender]) : []).map(String),
    (g) => g[0].toUpperCase() + g.slice(1),
  );
  appendArrayBadges(
    "size",
    (sp.size ? (Array.isArray(sp.size) ? sp.size : [sp.size]) : []).map(String),
    (s) => `Size: ${s}`,
  );
  appendArrayBadges(
    "color",
    (sp.color ? (Array.isArray(sp.color) ? sp.color : [sp.color]) : []).map(String),
    (c) => c[0].toUpperCase() + c.slice(1).replace("-", " "),
  );

  (sp.price ? (Array.isArray(sp.price) ? sp.price : [sp.price]) : []).forEach((p) => {
    const [minRaw, maxRaw] = String(p).split("-");
    badges.push({
      id: `price-${p}`,
      label: formatPriceFilterLabel(
        minRaw !== "" ? Number(minRaw) : undefined,
        maxRaw !== "" ? Number(maxRaw) : undefined,
      ),
      href: toggleArrayParam(pathname, search, "price", String(p)),
    });
  });

  return badges;
}

export function clearProductFiltersUrl(
  pathname: string,
  sp: Record<string, string | string[] | undefined>,
): string {
  return removeParams(pathname, searchQueryString(sp), ["gender", "size", "color", "price", "search", "page"]);
}
