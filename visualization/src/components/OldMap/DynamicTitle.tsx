import styles from '@styles/Home.module.scss';
// Type
import type {FC} from 'react';

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

type DynamicTitleProps = DynamicTitleSpectatorProps;

const DynamicTitle: FC<DynamicTitleProps> = ({
  //dateStringTimeState,
  spectatorState,
}) => {
  return (
    <>
      <DynamicTitleSpectator spectatorState={spectatorState} />
    </>
  );
};

export default DynamicTitle;
