import { WrappedData } from "@/types/wrapped.types";

export const wrappedService = {
  async fetchWrappedData(
    summoner: string,
    region: string,
  ): Promise<WrappedData> {
    // Call your Next.js API route
    const response = await fetch(`/api/wrapped/${summoner}/${region}`);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error || `Failed to fetch data: ${response.statusText}`,
      );
    }

    const data = await response.json();
    return data;
  },
};
