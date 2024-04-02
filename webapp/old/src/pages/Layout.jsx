import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { ToggleButtonGroup, ToggleButton, Typography, useTheme } from '@mui/material';
import { withStyles } from '@mui/styles';

const StyledToggleButton = withStyles({
  root: {
    textTransform: 'none', // This line prevents the text from being uppercase
  },
})(ToggleButton);

const Layout = () => {
  const [alignment, setAlignment] = React.useState('matching-service');
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();

  const handleChange = (_event, newAlignment) => {
    if (alignment === newAlignment || newAlignment === null) return
    setAlignment(newAlignment);
    console.log("Set alignment to", newAlignment)
    navigate(`/${process.env.REACT_APP_HOME_PAGE}${newAlignment}`);
    console.log("Navigate to", `/${process.env.REACT_APP_HOME_PAGE}${newAlignment}`)
  };

  React.useEffect(() => {
    const path = location.pathname
      .replace(process.env.REACT_APP_HOME_PAGE, '')
      .replace('/', '');
    if (path && path !== alignment) {
      setAlignment(path);
      console.log("Set alignment to", path)
    }
  }, [location, alignment]);

  return (
    <div style={{ backgroundColor: theme.palette.backgroundColor }}>
      <header style={{
        backgroundColor: 'rgba(255, 255, 255, .85)',
        position: 'fixed',
        top: '0',
        left: '0',
        right: '0',
        borderRadius: '20px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        padding: '1rem',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}>
        <Typography variant="h6" style={{ fontSize: '1rem', fontWeight: 'bold', textAlign: 'center' }}>Check what data different services can access</Typography>
        <ToggleButtonGroup
          color="primary"
          value={alignment}
          exclusive
          onChange={handleChange}
          aria-label="Service"
        >
          <StyledToggleButton value="matching-service">Matching Service</StyledToggleButton>
          <StyledToggleButton value="auth-service">Authentication Service</StyledToggleButton>
          <StyledToggleButton value="smart-contract">Smart Contracts</StyledToggleButton>
        </ToggleButtonGroup>
      </header>
      <main><Outlet /></main>
    </div>
  );
};

export default Layout;
