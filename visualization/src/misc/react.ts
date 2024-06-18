import type {Dispatch} from 'react';
import type {MessageFormatElement} from 'react-intl';

export type ReactHandleChange<T> = (
  event: React.SyntheticEvent,
  newValue: T
) => void;

export type ReactI18nMessages =
  | Record<string, string>
  | Record<string, MessageFormatElement[]>;

export interface ReactPropsI18n {
  locale: string;
  messages: ReactI18nMessages;
}

export interface ReactPropsI18nHome {
  params: {
    locale: string;
  };
}

//export type ReactSetState<T> = (newValue: T | ((prevValue: T) => T)) => void;
export type ReactSetState<T> = Dispatch<T>;
export type ReactState<T> = T;
