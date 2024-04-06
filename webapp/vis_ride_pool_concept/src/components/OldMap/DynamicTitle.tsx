import styles from '@styles/Home.module.scss';
// Type
import type {FC} from 'react';
import type {Signal} from '@preact/signals-react';

interface DynamicTitleTimeProps {
  dateStringSignal: Signal<string>;
}

const DynamicTitleTime: FC<DynamicTitleTimeProps> = ({dateStringSignal}) => {
  console.log('Update DynamicTitleTime');
  return (
    <h3 className={styles.title}>
      <p suppressHydrationWarning>Signal time: {dateStringSignal.value}</p>
    </h3>
  );
};

interface DynamicTitleSpectatorProps {
  spectatorSignal: Signal<string>;
  spectatorState: string;
}

const DynamicTitleSpectator: FC<DynamicTitleSpectatorProps> = ({
  spectatorSignal,
  spectatorState,
}) => {
  console.log('Update DynamicTitleSpectator');
  return (
    <h3 className={styles.title}>
      <p suppressHydrationWarning>
        Spectator: {spectatorState} (signal: {spectatorSignal.value})
      </p>
    </h3>
  );
};

interface DynamicTitleProps
  extends DynamicTitleTimeProps,
    DynamicTitleSpectatorProps {}

const DynamicTitle: FC<DynamicTitleProps> = ({
  dateStringSignal,
  spectatorSignal,
  spectatorState,
}) => {
  console.log('Update DynamicTitle');
  return (
    <>
      <DynamicTitleTime dateStringSignal={dateStringSignal} />
      <DynamicTitleSpectator
        spectatorSignal={spectatorSignal}
        spectatorState={spectatorState}
      />
    </>
  );
};

export default DynamicTitle;
