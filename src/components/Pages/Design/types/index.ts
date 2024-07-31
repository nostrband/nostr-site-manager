export type CustomConfigType = {
  [key: string]: {
    type: string;
    options?: string[];
    default: string;
    description?: string;
    group?: string;
  };
};
