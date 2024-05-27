// Package imports
// > Components
import {Paper, styled} from '@mui/material';

const PaperContainer = styled(Paper)(({theme}) => ({
  padding: theme.spacing(2),
  ...theme.typography.body1,
}));
export default PaperContainer;
