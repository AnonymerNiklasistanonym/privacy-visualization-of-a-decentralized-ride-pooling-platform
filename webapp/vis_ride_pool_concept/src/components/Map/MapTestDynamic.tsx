import dynamic from 'next/dynamic';

const MapTestDynamic = dynamic(() => import('./MapTest'), {
  ssr: false,
});

export default MapTestDynamic;
