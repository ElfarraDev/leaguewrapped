// wrapped-web/src/types/wrapped.types.ts
export interface WrappedData {
  SummonerName: string;
  SummonerLevel: number;
  Rank: string;
  Region: string;
  TimePlayed: {
    Hours: number;
    Days: number;
    Minutes: number;
    Seconds: number;
  };
  KDA: number;
  WinRate: number;
  KillsPerGame: number;
  DeathsPerGame: number;
  AssistsPerGame: number;
  KillParticipation: number;
  Wins: number;
  GamesPlayed: number;
  Losses: number;
  Multikills: {
    Pentakills: number;
    Quadrakills: number;
    TripleKills: number;
  };
  TopChampion: {
    Name: string;
    MasteryPoints: number;
    KDA: number;
    WinRate: number;
    GamesPlayed: number;
  };
  KDATrend: number;
  DamagePerMinute: number;
  MonthlyActivity: {
    Jan: number;
    Feb: number;
    Mar: number;
    Apr: number;
    May: number;
    Jun: number;
    Jul: number;
    Aug: number;
    Sep: number;
    Oct: number;
    Nov: number;
    Dec: number;
  };
  ChampionPool: Array<{
    Name: string;
    GamesPlayed: number;
    WinRate: number;
  }>;
  PerformanceProfile: {
    Mechanics: number;
    Farm: number;
    Objective: number;
    Teamwork: number;
    Vision: number;
  };
  Objectives: {
    Dragons: number;
    Barons: number;
    Heralds: number;
    TurretPlates: number;
    DragonTypes: {
      EARTH_DRAGON: number;
      CHEMTECH_DRAGON: number;
      WATER_DRAGON: number;
      FIRE_DRAGON: number;
      HEXTECH_DRAGON: number;
      AIR_DRAGON: number;
      ELDER_DRAGON: number;
    };
  };
  CombatStats: {
    FirstBloods: number;
    SoloKills: number;
    TowersDestroyed: number;
    HighestKillsGame: number;
    HighestDeathsGame: number;
    TotalTimeSpentDead: number;
  };
  Economy: {
    GoldEarned: number;
    GoldPerMinute: number;
    CSPerMinute: number;
    AverageDamageDealt: number;
    AverageDamageTaken: number;
    AvgGoldSpentPercentage: number;
  };
  Vision: {
    VisionScore: number;
    WardsPlaced: number;
    WardsKilled: number;
    ControlWards: number;
  };
  KeyInsights: {
    TotalKills: number;
    TotalAssists: number;
    GoldEarned: number;
    DamageDealt: number;
    TotalDeaths: number;
    WinStreak: number;
    GamesPlayed: number;
    DamageShare: number;
    HighestDamageGame: number;
    LowestDamageGame: number;
  };
  PerformanceHighlights: {
    WorstPerformance: {
      champion: string;
      kda: string;
      damage_dealt: number;
      game_duration_minutes: number;
    };
    BestPerformance: {
      champion: string;
      kda: string;
      damage_dealt: number;
      game_duration_minutes: number;
    };
  };
  BestChampionsByWinRate: Array<{
    Name: string;
    GamesPlayed: number;
    WinRate: number;
    KDA: number;
    MasteryPoints: number;
  }>;
  gameEndedInEarlySurrender: number;
  gameEndedInSurrender: number;
  other_stats: {
    elder_dragons: number;
    inhibitors: number;
    doubleKills: number;
    killstreaks_ended: number;
    bounty_collected: number;
    duration_s: number;
    DamageDealt: number;
    DamagePerMinute: number;
    LongestWinStreak: number;
    time_played: {
      seconds: number;
      minutes: number;
      hours: number;
      days: number;
    };
    kill_participation_avg: number;
    gold_per_min_avg: number;
    cs_per_min_avg: number;
    SummonerName: string;
    games_with_more_deaths_than_kills: number;
    games_with_zero_kills: number;
    games_with_most_deaths_on_team: number;
    games_with_most_deaths_in_game: number;
  };
  roast_summary?: {
    player_data: any;
  };
  ai_coach?: {
    player_id: string;
    season: string;
    summary: {
      games_analyzed: number;
      avg_kda: number;
      kill_participation_pct: number;
      damage_share_pct: number;
      gold_per_min: number;
      cs_per_min: number;
      vision_score_avg: number;
    };
    behavior_patterns: {
      early_game: {
        deaths_before_10_min: number;
        deaths_before_10_rate: number;
        cs_at_10_avg: number;
        first_recall_timing_avg_s: number;
        extended_trades_without_vision: any;
      };
      mid_game: {
        throw_index: number;
        fight_quality_score: any;
        facechecks: number;
        roam_success_rate: any;
        roam_count_avg: number;
      };
      late_game: {
        damage_uptime: number;
        teamfight_positioning_score: any;
        objective_presence: number;
      };
      positioning_analysis: {
        river_deaths: number;
        side_lane_deaths: number;
        jungle_deaths: number;
        facecheck_deaths: number;
      };
    };
    consistency: {
      death_variance: number;
      cs_variance: number;
      gold_variance: number;
      kda_variance: number;
      performance_floor: {
        kda: string;
        damage: number;
        impact_index: number;
      };
      performance_ceiling: {
        kda: string;
        damage: number;
        impact_index: number;
      };
    };
    tilt_analysis: {
      loss_streaks: number[];
      worst_streak: number;
      post_loss_performance_delta: number;
      tilt_likelihood: number;
    };
    macro: {
      objective_contribution: {
        herald: number;
        dragon: number;
        baron: number;
        tower_pressure: number;
      };
      vision_control: {
        vision_score_avg: number;
        wards_placed_per_game: number;
        wards_cleared_per_game: number;
        control_wards_per_game: number;
      };
    };
    mechanical_profile: {
      solo_kill_rate: number;
      damage_per_min: number;
      fight_dps_efficiency: number;
    };
  };
  player_dna?: {
    aggression: number;
    farm_priority: number;
    team_reliance: number;
    survivability: number;
    vision_control: number;
    objective_focus: number;
    adaptability: number;
    risk_taking: number;
    consistency: number;
    tilt_vulnerability: number;
    lane_cs_power: number;
    roam_activity: number;
    archetype: {
      type: string;
      description: string;
    };
  };
}
