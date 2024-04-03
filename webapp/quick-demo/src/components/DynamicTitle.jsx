import styles from '@styles/Home.module.scss';


const DynamicTitleTime = ({ dateStringSignal }) => {
  console.log("Update DynamicTitleTime");
  return (
    <h3 className={styles.title}>
      <p suppressHydrationWarning>Signal time: {dateStringSignal.value}</p>
    </h3>
  )
}

const DynamicTitleSpectator = ({ spectatorSignal, spectatorState }) => {
  console.log("Update DynamicTitleSpectator");
  return (
    <h3 className={styles.title}>
      <p suppressHydrationWarning>Spectator: {spectatorState} (signal: {spectatorSignal.value})</p>
    </h3>
  )
}

export default function DynamicTitle({ dateStringSignal, spectatorSignal, spectatorState }) {
  console.log("Update DynamicTitle");
  return (
    <>
      <DynamicTitleTime dateStringSignal={dateStringSignal}/>
      <DynamicTitleSpectator spectatorSignal={spectatorSignal} spectatorState={spectatorState}/>
    </>
  )
}
