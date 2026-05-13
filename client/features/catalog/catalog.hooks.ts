import { useQuery } from "@tanstack/react-query";
import { catalogApi } from "./catalog.api";

export const useProducts = (params?: {
  search?: string;
  categoryId?: string;
  sort?: "newest" | "price_asc" | "price_desc";
  page?: number;
  limit?: number;
}) =>
  useQuery({
    queryKey: ["products", params],
    queryFn: () => catalogApi.products(params),
  });

export const useProduct = (id: string) =>
  useQuery({
    queryKey: ["product", id],
    queryFn: () => catalogApi.product(id),
    enabled: Boolean(id),
  });

export const useCategories = () =>
  useQuery({
    queryKey: ["categories"],
    queryFn: catalogApi.categories,
  });
