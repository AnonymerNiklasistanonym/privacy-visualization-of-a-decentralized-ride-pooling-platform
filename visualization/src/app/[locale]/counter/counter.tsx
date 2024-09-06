'use client';

// Package imports
import {useCallback, useEffect, useMemo, useRef, useState} from 'react';

export function ComponentCollectionButton() {
  const resetValue = useRef(0);
  const [stateCount, setStateCount] = useState(resetValue.current);
  useEffect(() => {
    console.log(`stateCount was updated to ${stateCount}`);
  }, [stateCount]);
  useEffect(() => {
    console.log('Runs only on the first render (twice during dev)');
  }, []);
  const onClickIncrease = useMemo(
    () => () => setStateCount(prev => prev + 1),
    []
  );
  const onClickReset = useCallback(() => setStateCount(resetValue.current), []);
  return (
    <>
      <p>Counter: {stateCount}</p>
      <button onClick={onClickIncrease}>Increase</button>
      <button onClick={onClickReset}>Reset</button>
    </>
  );
}
