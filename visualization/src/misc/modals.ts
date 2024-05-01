// Type imports
import type {ReactSetState, ReactState} from './react';

export interface ErrorModalContentElement {
  title: string;
  error: Error;
  count: number;
}

export interface ErrorModalProps
  extends ErrorModalPropsSetStates,
    ErrorModalPropsErrorBuilder {
  stateErrorModalOpen: ReactState<boolean>;
}

export interface ErrorModalPropsSetStates {
  setStateErrorModalOpen: ReactSetState<boolean>;
  setStateErrorModalContent: ReactSetState<Array<ErrorModalContentElement>>;
}

export interface ErrorModalPropsErrorBuilder extends ErrorModalPropsSetStates {
  stateErrorModalContent: ReactState<Array<ErrorModalContentElement>>;
}

export const compareErrorModalContent = (
  title: string,
  error: Error,
  errorElement: ErrorModalContentElement
) =>
  errorElement.title === title &&
  errorElement.error.message === error.message &&
  errorElement.error.stack === error.stack;

export type ShowError = (message: string, error: Error) => void;

export function showErrorBuilder(
  props: ErrorModalPropsErrorBuilder,
  logError = true
): ShowError {
  return (title: string, error: Error) => {
    if (logError) {
      console.error(error);
    }
    // Append error or increase count
    const errorAlreadyInList = props.stateErrorModalContent.find(a =>
      compareErrorModalContent(title, error, a)
    );
    if (errorAlreadyInList) {
      props.setStateErrorModalContent(
        props.stateErrorModalContent.map(a => {
          if (compareErrorModalContent(title, error, a)) {
            a.count += 1;
          }
          return a;
        })
      );
    } else {
      props.setStateErrorModalContent([
        ...props.stateErrorModalContent,
        {
          count: 1,
          error,
          title,
        },
      ]);
      // Only open modal if new error is found
      props.setStateErrorModalOpen(true);
    }
  };
}
