import dynamic from 'next/dynamic';

const MapDynamic = dynamic(() => import('./Map'), {
  ssr: false,
});

export default MapDynamic;
