'use client';

// Package imports
import {memo, useState} from 'react';

export default function Demo() {
  return (
    <div>
      <main>
        <h1>Demo</h1>
        <ComponentCollectionGreeting />
      </main>
    </div>
  );
}

export function ComponentCollectionGreeting() {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  return (
    <>
      <p>Test memo option to stop re-rendering of components</p>
      <label>
        Name{': '}
        <input value={name} onChange={e => setName(e.target.value)} />
      </label>
      <label>
        Address{': '}
        <input value={address} onChange={e => setAddress(e.target.value)} />
      </label>
      <Greeting name={name} />
      <GreetingMemo name={name + ' (memo)'} />
    </>
  );
}

function Greeting({name}: {name: string}) {
  console.log(
    `Greeting (${name}) was rendered at ${new Date().toLocaleTimeString()}`
  );
  return (
    <h3>
      Hello{name && ', '}
      {name}!
    </h3>
  );
}

const GreetingMemo = memo(Greeting);
