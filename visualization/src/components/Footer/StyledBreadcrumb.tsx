// Package imports
// > Components
import {Chip, styled} from '@mui/material';

const StyledBreadcrumb = styled(Chip)(({theme}) => {
  return {
    backgroundColor:
      theme.palette.mode === 'light'
        ? theme.palette.grey[100]
        : theme.palette.grey[800],
    color: theme.palette.text.primary,
    fontWeight: theme.typography.fontWeightRegular,
    height: theme.spacing(3),
  };
}) as typeof Chip;

export default StyledBreadcrumb;
