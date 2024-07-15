'use client';

// Package imports
import {memo, useCallback, useEffect, useMemo, useState} from 'react';
// Type imports
import {ChangeEvent} from 'react';

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
  console.info('Render ComponentCollectionGreeting');
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [info, setInfo] = useState<{name: string; address: string}>({
    address: '',
    name: '',
  });

  useEffect(() => {
    console.info('First render (twice during dev)');
  }, []);
  useEffect(() => {
    console.debug('Address has changed', address);
  }, [address]);
  useEffect(() => {
    console.debug('Name has changed', name);
  }, [name]);
  useEffect(() => {
    console.debug('Info has changed', info);
  }, [info]);
  useEffect(() => {
    console.debug('Info.name has changed', info.name);
  }, [info.name]);
  useEffect(() => {
    console.debug('Info.name has changed', info.address);
  }, [info.address]);

  const onChangeName = useCallback<(e: ChangeEvent<HTMLInputElement>) => void>(
    e => {
      setName(e.target.value);
      setInfo(prev => ({...prev, name: e.target.value}));
    },
    []
  );
  const onChangeAddress = useCallback<
    (e: ChangeEvent<HTMLInputElement>) => void
  >(e => {
    setAddress(e.target.value);
    setInfo(prev => ({...prev, address: e.target.value}));
  }, []);

  const onClickButtonName = useCallback<() => void>(() => {
    setName(name);
    setInfo(prev => ({...prev, name}));
  }, [name]);
  const onClickButtonAddress = useCallback<() => void>(() => {
    setAddress(address);
    setInfo(prev => ({...prev, address}));
  }, [address]);

  return (
    <>
      <p>Test memo option to stop re-rendering of components</p>
      <label>
        Name{': '}
        <input value={name} onChange={onChangeName} />
      </label>
      <label>
        Address{': '}
        <input value={address} onChange={onChangeAddress} />
      </label>
      <button onClick={onClickButtonName}>Set to name to same value</button>
      <button onClick={onClickButtonAddress}>
        Set to address to same value
      </button>
      <Greeting name={name} />
      <GreetingMemo name={name} label="memo" />
      <Greeting2 info={info} />
      <Greeting2 info={info} label="memo" />
    </>
  );
}

/** Simple demo of when a state change triggers a rerender (primitive value) */
function Greeting({label, name}: {name: string; label?: string}) {
  // This will be rerendered every time the name prop is updated
  return (
    <h3>
      Hello{name && ', '}
      {name}! {label ? ` (${label})` : ''} [{new Date().toLocaleTimeString()}]
    </h3>
  );
}

const GreetingMemo = memo(Greeting);

/** Simple demo of when a state change triggers a rerender (object value) */
function Greeting2({
  info,
  label,
}: {
  info: {name: string; address: string};
  label?: string;
}) {
  // This memoized name variable is updated every time it's dependencies (e.g. info.name) change
  // Logic that does not depend on some frequently updating values can be scoped and rather be reused
  const name = useMemo<string>(() => {
    return (
      info.name &&
      ', ' + info.name + `[updated=${new Date().toLocaleTimeString()}]`
    );
  }, [info.name]);
  // This will be rerendered every time info is updated (even when it's just the info.address!)
  return (
    <h3>
      Hello{name}! (object{label ? ` ${label}` : ''}) [rendered=
      {new Date().toLocaleTimeString()}]
    </h3>
  );
}
