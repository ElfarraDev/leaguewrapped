"use client";

import { create } from "zustand";
import { WrappedData } from "@/types/wrapped.types";
import { wrappedService } from "@/services/wrapped.service";

interface WrappedStore {
  data: WrappedData | null;
  loading: boolean;
  error: string | null;
  fetchData: (summoner: string, region: string) => Promise<void>;
  setData: (data: WrappedData) => void;
  reset: () => void;
}

export const useWrappedStore = create<WrappedStore>((set) => ({
  data: null,
  loading: false,
  error: null,

  fetchData: async (summoner: string, region: string) => {
    set({ loading: true, error: null });
    try {
      const data = await wrappedService.fetchWrappedData(summoner, region);
      set({ data, loading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to fetch data",
        loading: false,
      });
    }
  },

  setData: (data: WrappedData) => set({ data }),

  reset: () => set({ data: null, loading: false, error: null }),
}));
