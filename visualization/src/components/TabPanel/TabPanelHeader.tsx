// Package imports
import {useIntl} from 'react-intl';
// > Components
import {Tabs, Tab} from '@mui/material';
// > Icons
import ArticleIcon from '@mui/icons-material/Article';
import MapIcon from '@mui/icons-material/Map';
import TableRowsIcon from '@mui/icons-material/TableRows';
import SettingsIcon from '@mui/icons-material/Settings';
// Type imports
import type {ReactElement} from 'react';

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

interface TabPanelInformation {
  labelIdI18n: string;
  index: number;
  icon: ReactElement;
}

const tabPanelInformation: ReadonlyArray<TabPanelInformation> = [
  {
    labelIdI18n: 'page.home.tab.overview.title',
    icon: <ArticleIcon />,
    index: 0,
  },
  {
    labelIdI18n: 'page.home.tab.map.title',
    icon: <MapIcon />,
    index: 1,
  },
  {
    labelIdI18n: 'page.home.tab.blockchain.title',
    icon: <TableRowsIcon />,
    index: 2,
  },
  {
    labelIdI18n: 'page.home.tab.settings.title',
    icon: <SettingsIcon />,
    index: 3,
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
//<FormattedMessage tagName="p" id="common.footer" />
