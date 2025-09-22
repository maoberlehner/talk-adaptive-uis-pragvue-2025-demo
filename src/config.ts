type Config = {
  perf: {
    caching: boolean;
    skeleton: boolean;
    modelSpeed: "slow" | "fast" | "ludicrous";
    streaming: boolean;
  };
};

export const config: Config = {
  perf: {
    caching: false,
    skeleton: false,
    modelSpeed: "slow",
    streaming: false,
  },
};
