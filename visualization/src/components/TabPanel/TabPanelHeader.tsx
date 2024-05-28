// Package imports
import {useIntl} from 'react-intl';
// > Components
import {Tab, Tabs} from '@mui/material';
// Local imports
// > Components
import {
  TabBlockchainIcon,
  TabMapIcon,
  TabOverviewIcon,
  TabSettingsIcon,
} from '@components/Icons';
// Type imports
import type {ReactElement} from 'react';
import type {ReactState} from '@misc/react';

interface TabPanelInformation {
  labelIdI18n: string;
  index: number;
  icon: ReactElement;
}

const tabPanelInformation: ReadonlyArray<TabPanelInformation> = [
  {
    icon: <TabOverviewIcon />,
    index: 0,
    labelIdI18n: 'page.home.tab.overview.title',
  },
  {
    icon: <TabMapIcon />,
    index: 1,
    labelIdI18n: 'page.home.tab.map.title',
  },
  {
    icon: <TabBlockchainIcon />,
    index: 2,
    labelIdI18n: 'page.home.tab.blockchain.title',
  },
  {
    icon: <TabSettingsIcon />,
    index: 3,
    labelIdI18n: 'page.home.tab.settings.title',
  },
];

export interface TabPanelHeaderProps {
  stateTabIndex: ReactState<number>;
  handleChangeTabIndex: (event: React.SyntheticEvent, newValue: number) => void;
}

export default function TabPanelHeader({
  stateTabIndex,
  handleChangeTabIndex,
}: TabPanelHeaderProps) {
  const intl = useIntl();
  return (
    <Tabs value={stateTabIndex} onChange={handleChangeTabIndex} centered>
      {tabPanelInformation.map(a => (
        <Tab
          key={a.index}
          label={intl.formatMessage({id: a.labelIdI18n})}
          icon={a.icon}
        />
      ))}
    </Tabs>
  );
}
