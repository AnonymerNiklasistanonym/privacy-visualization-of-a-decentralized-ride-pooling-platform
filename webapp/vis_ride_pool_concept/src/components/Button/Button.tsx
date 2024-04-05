import Link from 'next/link';
import styles from './Button.module.scss';

export interface ButtonProps {
  children: string;
  href?: string;
  onClick: () => void;
}

const Button = ({children, href, ...rest}: ButtonProps) => {
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
