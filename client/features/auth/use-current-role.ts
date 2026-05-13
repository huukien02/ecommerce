"use client";

import { useMe } from "./auth.hooks";

export const useCurrentRole = () => {
  const { data, isLoading } = useMe();
  return {
    role: data?.data?.role,
    isAdmin: data?.data?.role === "admin",
    isLoading,
  };
};
