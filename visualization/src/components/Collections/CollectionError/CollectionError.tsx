// Package imports
// > Components
import Link from 'next/link';

export interface CollectionErrorProps {
  /** The error code */
  code: string;
  /** The error message */
  message: string;
  /** Links to other pages (e.g. home page) */
  links: Array<{url: string; text: string}>;
}

/** Error page collection */
export default function CollectionError({
  code,
  links,
  message,
}: CollectionErrorProps) {
  return (
    <>
      <h1>
        {code} - {message}
      </h1>
      {links.map(a => (
        <Link key={a.url} href={a.url}>
          <a>{a.text}</a>
        </Link>
      ))}
    </>
  );
}
