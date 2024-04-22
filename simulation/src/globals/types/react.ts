// This file was copied from the global types directory, do not change!

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
