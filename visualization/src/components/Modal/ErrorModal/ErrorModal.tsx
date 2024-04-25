// Package imports
// > Components
import {
  Box,
  Modal,
  List,
  ListSubheader,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Badge,
} from '@mui/material';
import ErrorIcon from '@mui/icons-material/Error';
import DeleteIcon from '@mui/icons-material/Delete';
// Type imports
import {compareErrorModalContent, type ErrorModalProps} from '@misc/modals';

const style = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  maxWidth: 1200,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default function ErrorModal({
  stateErrorModalOpen,
  stateErrorModalContent,
  setStateErrorModalOpen,
  setStateErrorModalContent,
}: ErrorModalProps) {
  // Close the modal when there is no content any more
  if (stateErrorModalContent.length === 0) {
    setStateErrorModalOpen(false);
  }
  return (
    <div>
      <Modal
        open={stateErrorModalOpen}
        onClose={() => setStateErrorModalOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <List
            sx={{width: '100%', bgcolor: 'background.paper'}}
            component="nav"
            aria-labelledby="nested-list-subheader"
            subheader={
              <ListSubheader component="div" id="nested-list-subheader">
                Errors
              </ListSubheader>
            }
          >
            {stateErrorModalContent.map((a, index) => {
              return (
                <ListItem
                  key={`content-${index}`}
                  secondaryAction={
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() => {
                        setStateErrorModalContent(
                          stateErrorModalContent.filter(
                            b => !compareErrorModalContent(b.title, b.error, a)
                          )
                        );
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  }
                >
                  <ListItemIcon>
                    {a.count > 1 ? (
                      <Badge color="secondary" badgeContent={a.count} max={999}>
                        <ErrorIcon />
                      </Badge>
                    ) : (
                      <ErrorIcon />
                    )}
                  </ListItemIcon>
                  <ListItemText
                    primary={`${a.title} (${a.error.name})`}
                    secondary={
                      a.error.message +
                      (a.error.stack ? `\nStack:\n${a.error.stack}` : '') +
                      (a.error.cause ? `\nCause:\n${a.error.cause}` : '')
                    }
                  />
                </ListItem>
              );
            })}
          </List>
        </Box>
      </Modal>
    </div>
  );
}
