import styles from '@styles/Home.module.scss';
// Type
import type {FC} from 'react';

interface DynamicTitleTimeProps {
  dateStringTimeState: string;
}

const DynamicTitleTime: FC<DynamicTitleTimeProps> = ({dateStringTimeState}) => {
  console.log('Update DynamicTitleTime');
  return (
    <h3 className={styles.title}>
      {
        //<p suppressHydrationWarning>Signal time: {dateStringTimeState}</p>
      }
      <p suppressHydrationWarning>Signal time: {dateStringTimeState}</p>
    </h3>
  );
};

interface DynamicTitleSpectatorProps {
  spectatorState: string;
}

const DynamicTitleSpectator: FC<DynamicTitleSpectatorProps> = ({
  spectatorState,
}) => {
  console.log('Update DynamicTitleSpectator');
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
  console.log('Update DynamicTitle');
  return (
    <>
      <DynamicTitleTime dateStringTimeState={dateStringTimeState} />
      <DynamicTitleSpectator spectatorState={spectatorState} />
    </>
  );
};

export default DynamicTitle;
