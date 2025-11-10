export type RoastIntensity = "mild" | "medium" | "savage";

export interface RoastResponse {
  roast: string;
  intensity: RoastIntensity;
}

export interface EmbarrassingStats {
  gamesWithMoreDeathsThanKills: number;
  gamesWithZeroKills: number;
  gamesWithMostDeathsOnTeam: number;
  gamesWithMostDeathsInGame: number;
  highestDeathsGame: number;
  lowestDamageGame: number;
  worstPerformance: {
    champion: string;
    kda: string;
    damage_dealt: number;
  };
}
