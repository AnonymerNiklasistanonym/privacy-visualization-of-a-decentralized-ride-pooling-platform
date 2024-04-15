// This file was copied from the global types directory, do not change!

export type ReactSetState<T> = (newValue: T) => void;
export type ReactState<T> = T;

export interface DefaultProps<T> {
  children?: T;
}
export interface DefaultPropsI18n<T> extends DefaultProps<T> {
  locale: string;
}

export interface DefaultPropsI18nHome {
  params: {
    locale: string;
  };
}

export interface DefaultPropsI18nRoot<T>
  extends DefaultProps<T>,
  DefaultPropsI18nHome {}

export interface MapIconProps {
  iconCustomerHTML: string;
  iconRideProviderHTML: string;
}
