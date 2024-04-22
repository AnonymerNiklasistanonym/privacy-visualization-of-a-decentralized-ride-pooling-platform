// Local imports
import styles from './Container.module.scss';
// Type imports
import type {PropsWithChildren} from 'react';

export interface ContainerProps {
  className?: string;
}

export default function Container({
  children,
  className,
  ...rest
}: PropsWithChildren<ContainerProps>) {
  let containerClassName = styles.container;

  if (className) {
    containerClassName = `${containerClassName} ${className}`;
  }

  return (
    <div className={containerClassName} {...rest}>
      {children}
    </div>
  );
}
