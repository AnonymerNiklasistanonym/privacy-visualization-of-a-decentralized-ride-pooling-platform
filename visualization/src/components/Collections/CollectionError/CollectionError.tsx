// Package imports
// > Components
import Link from 'next/link';

export interface CollectionErrorProps {
  code: string;
  message: string;
  links: Array<{url: string; text: string}>;
}

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
