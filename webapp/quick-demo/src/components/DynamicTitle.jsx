import styles from '@styles/Home.module.scss';

export default function DynamicTitle({ titleDate }) {
  console.log("Update DynamicTitle");
  return (
    <h2 className={styles.title}>
      <p suppressHydrationWarning>({titleDate.value})</p>
    </h2>
  )
}
