export interface ReactPropsI18n {
  locale: string;
}

export interface ReactPropsI18nHome {
  params: {
    locale: string;
  };
}

export type ReactSetState<T> = (newValue: T) => void;
export type ReactState<T> = T;
