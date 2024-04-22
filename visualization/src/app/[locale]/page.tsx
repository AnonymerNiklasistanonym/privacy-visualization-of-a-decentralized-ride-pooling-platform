// Local imports
import {getIntl} from '../../services/intl';
// > Components
import Navigation3 from '@components/Sort/Navigation3';
import SpeedDialTooltipOpen from '@components/Sort/SpeedDial';
import SearchAppBar from '@components/Sort/SearchBar';
import Tabs from '@components/Sort/Tabs';
// > Styles
import styles from '@styles/page.module.css';
// Type imports
import type {FC} from 'react';
import type {ReactPropsI18nHome} from '@globals/types/react';

const Home: FC<ReactPropsI18nHome> = async ({params: {locale}}) => {
  const intl = await getIntl(locale);

  //const graph = fetchJsonSimulation<SimulationEndpointGraph>('json/graph');

  return (
    <>
      <SearchAppBar />
      <div className={styles.container}>
        <main className={styles.main}>
          <h1 className={styles.title}>
            {
              // @ts-ignore
              intl.formatMessage(
                {id: 'page.home.title'},
                // Replace b chunks with actual JSX element
                {b: chunks => <b key="bold">{chunks}</b>}
              )
            }
          </h1>

          <p className={styles.description}>
            {intl.formatMessage({id: 'page.home.description'})}
          </p>

          <Navigation3 />

          <Tabs locale={locale} />

          <SpeedDialTooltipOpen />
        </main>
      </div>
    </>
  );
};

export default Home;
