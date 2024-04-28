// Package imports
import {useIntl} from 'react-intl';
// > Components
import {Tab, Tabs} from '@mui/material';
// > Icons
import {
  Article as ArticleIcon,
  Map as MapIcon,
  Settings as SettingsIcon,
  TableRows as TableRowsIcon,
} from '@mui/icons-material';
// Type imports
import type {ReactElement} from 'react';

function a11yProps(index: number) {
  return {
    'aria-controls': `simple-tabpanel-${index}`,
    id: `simple-tab-${index}`,
  };
}

interface TabPanelInformation {
  labelIdI18n: string;
  index: number;
  icon: ReactElement;
}

const tabPanelInformation: ReadonlyArray<TabPanelInformation> = [
  {
    icon: <ArticleIcon />,
    index: 0,
    labelIdI18n: 'page.home.tab.overview.title',
  },
  {
    icon: <MapIcon />,
    index: 1,
    labelIdI18n: 'page.home.tab.map.title',
  },
  {
    icon: <TableRowsIcon />,
    index: 2,
    labelIdI18n: 'page.home.tab.blockchain.title',
  },
  {
    icon: <SettingsIcon />,
    index: 3,
    labelIdI18n: 'page.home.tab.settings.title',
  },
];

export interface TabPanelHeaderProps {
  stateValue: number;
  handleChange: (event: React.SyntheticEvent, newValue: number) => void;
}

export default function TabPanelHeader({
  stateValue,
  handleChange,
}: TabPanelHeaderProps) {
  const intl = useIntl();
  return (
    <>
      <Tabs
        value={stateValue}
        onChange={handleChange}
        aria-label="basic tabs example"
        centered
      >
        {tabPanelInformation.map(a => (
          <Tab
            key={a.index}
            label={intl.formatMessage({id: a.labelIdI18n})}
            icon={a.icon}
            {...a11yProps(a.index)}
          />
        ))}
      </Tabs>
    </>
  );
}
