export type CustomConfigType = {
  [key: string]: {
    type: string;
    options?: string[];
    default?: string | boolean;
    description?: string;
    group?: string;
  };
};
