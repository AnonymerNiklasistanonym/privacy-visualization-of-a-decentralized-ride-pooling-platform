import dynamic from 'next/dynamic';

const MapTestDynamic = dynamic(() => import('./Map'), {
  ssr: false,
});

export default MapTestDynamic;
