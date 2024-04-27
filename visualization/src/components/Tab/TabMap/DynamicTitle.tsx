// Local imports
import styles from '@styles/Home.module.scss';

interface DynamicTitleProps {
  spectatorState: string;
}

export default function DynamicTitle({spectatorState}: DynamicTitleProps) {
  return (
    <h3 className={styles.title}>
      <p>Spectator: {spectatorState}</p>
    </h3>
  );
}
