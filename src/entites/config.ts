export type ConfigPropsGap = "2" | "4" | "6" | "8";

export const gapMap: Record<ConfigPropsGap, string> = {
  "2": "gap-2",
  "4": "gap-4",
  "6": "gap-6",
  "8": "gap-8",
};

export type ConfigColSpan =
  | "12"
  | "6"
  | "md:6"
  | "lg:6"
  | "4"
  | "md:4"
  | "lg:4"
  | "3"
  | "md:3"
  | "lg:3"
  | "2"
  | "md:2"
  | "lg:2";

export const colSpanMap = {
  "12": "col-span-12",
  "6": "col-span-6",
  "md:6": "md:col-span-6",
  "lg:6": "lg:col-span-6",
  "4": "col-span-4",
  "md:4": "md:col-span-4",
  "lg:4": "lg:col-span-4",
  "3": "col-span-3",
  "md:3": "md:col-span-3",
  "lg:3": "lg:col-span-3",
  "2": "col-span-2",
  "md:2": "md:col-span-2",
  "lg:2": "lg:col-span-2",
};

export type ConfigDataSource = string;

export interface ConfigComponent {
  children?: ConfigComponent[];
  component: string;
  dataSources?: ConfigDataSource[];
}

export interface Config {
  children: ({ colSpan?: ConfigColSpan[] } & ConfigComponent)[];
  dataSources?: ConfigDataSource[];
}
