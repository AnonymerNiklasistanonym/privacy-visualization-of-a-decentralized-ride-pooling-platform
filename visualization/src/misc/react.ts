import type {Dispatch, ReducerWithoutAction} from 'react';
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

/** React state setter (fallback since sometimes (prev) => ... is not parsed correct by the typescript compiler) */
export type ReactSetState<T> = (newValue: T | ((prevValue: T) => T)) => void;
/** React state that should not be edited */
export type ReactState<T> = Readonly<T>;
// TODO
//export type ReactState<T> = Readonly<T>;
