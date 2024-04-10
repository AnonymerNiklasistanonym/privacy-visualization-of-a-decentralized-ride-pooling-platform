import styles from '@styles/Home.module.scss';
// Type
import type {FC} from 'react';
import MyLocation from './MyLocation';

interface DynamicTitleTimeProps {
  dateStringTimeState: string;
}

const DynamicTitleTime: FC<DynamicTitleTimeProps> = ({dateStringTimeState}) => {
  return (
    <h3 className={styles.title}>
      {
        //<p suppressHydrationWarning>Signal time: {dateStringTimeState}</p>
      }
      <p>Signal time: {dateStringTimeState}</p>
    </h3>
  );
};

interface DynamicTitleSpectatorProps {
  spectatorState: string;
}

const DynamicTitleSpectator: FC<DynamicTitleSpectatorProps> = ({
  spectatorState,
}) => {
  return (
    <h3 className={styles.title}>
      <p>Spectator: {spectatorState}</p>
    </h3>
  );
};

interface DynamicTitleProps
  extends DynamicTitleTimeProps,
    DynamicTitleSpectatorProps {}

const DynamicTitle: FC<DynamicTitleProps> = ({
  dateStringTimeState,
  spectatorState,
}) => {
  return (
    <>
      <DynamicTitleTime dateStringTimeState={dateStringTimeState} />
      <MyLocation />
      <DynamicTitleSpectator spectatorState={spectatorState} />
    </>
  );
};

export default DynamicTitle;
