// Local imports
import styles from './Container.module.scss';
// Type imports
import type {FC, ReactNode} from 'react';

export interface ContainerProps {
  children?: ReactNode;
  className?: string;
}

const Container: FC<ContainerProps> = ({children, className, ...rest}) => {
  let containerClassName = styles.container;

  if (className) {
    containerClassName = `${containerClassName} ${className}`;
  }

  return (
    <div className={containerClassName} {...rest}>
      {children}
    </div>
  );
};

export default Container;
