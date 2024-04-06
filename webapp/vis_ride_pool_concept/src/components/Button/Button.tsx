import Link from 'next/link';
import styles from './Button.module.scss';
// Type imports
import type {FC} from 'react';

export interface ButtonProps {
  children: string;
  href?: string;
  onClick: () => void;
}

const Button: FC<ButtonProps> = ({children, href, ...rest}) => {
  const buttonClassName = styles.button;

  const buttonProps = {
    className: buttonClassName,
    ...rest,
  };

  if (href) {
    if (href.startsWith('/')) {
      return (
        <Link href={href} {...buttonProps}>
          {children}
        </Link>
      );
    }
    return (
      <a href={href} {...buttonProps}>
        {children}
      </a>
    );
  }

  return <button {...buttonProps}>{children}</button>;
};

export default Button;
