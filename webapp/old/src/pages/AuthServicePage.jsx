import React, { useState } from 'react';
import { Typography, Container, List, Card, Box, CardContent, useTheme } from '@mui/material';

const DataCard = ({ title, description }) => {
  const theme = useTheme();

  return (
    <Box mb={4}>
      <Card sx={{ minWidth: 275, backgroundColor: theme.palette.background.paper }}>
        <CardContent>
          <Typography variant="h6" component="div">
            {title}
          </Typography>
          <Typography color="text.secondary">
            {description}
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

const AuthServicePage = () => {
  const [hideData, setHideData] = useState(true);

  const toggleShowData = () => {
    setHideData(!hideData);
  };

  const dataOthersCanSee = [
    { title: 'Your pseudonym', description: 'Description for Box 1' },
  ];


  return (
    <Container component="main" maxWidth="md" style={{ marginTop: '140px', paddingBottom: '4rem' }}>

      <Box mb={8} style={{ border: '1px solid black', borderRadius: '20px', padding: '1rem 2rem' }}>
        <Typography color={'#3B4AE0'} variant="h6" component="div" sx={{ flexGrow: 1, textAlign: 'left' }}>
          What is the Auth Service for?
        </Typography>
        <Typography variant='p' component="div" sx={{ flexGrow: 1, color: 'grey' }}>
          The Auth Service manages user sign-in and sign-up processes. Following authentication, all interactions are conducted under a pseudonym that changes with each login.<br />The Matching Service can request the rounded average rating from the Auth Providers pseudonyms.
        </Typography>
      </Box>

      <div style={{ display: 'flex' }}>
        <Typography color={'#3B4AE0'} variant="h6" component="div" sx={{ flexGrow: 1, textAlign: 'center', fontWeight: 'bold' }}>
          What the users can see about you
        </Typography>
      </div>

      <List>
        {dataOthersCanSee.map((item, index) => (
          <DataCard key={index} title={item.title} description={item.description} />
        ))}
      </List>

      <div style={{ display: 'flex' }}>
        <Typography color={'#3B4AE0'} variant="h6" component="div" sx={{ flexGrow: 1, textAlign: 'center', fontWeight: 'bold' }}>
          What the Auth Service needs to know
        </Typography>
      </div>

      <div style={{ position: 'relative' }}>
        {hideData &&
          <>
            <div style={{ position: 'absolute', top: '-4px', right: '-16px', bottom: '-16px', left: '-16px', backgroundColor: '#000000', zIndex: 10, opacity: .7, borderRadius: '20px' }}>
            </div>
            <div style={{ position: 'absolute', top: '-4px', right: '-16px', bottom: '-16px', left: '-16px', zIndex: 99, opacity: 1, color: '#FFFFFF', fontWeight: 'bold', fontSize: '1.5rem', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span onClick={toggleShowData} style={{ cursor: 'pointer' }}>Click to see data only provided to you</span>
            </div>
          </>
        }

        <List style={hideData ? { filter: 'blur(4px)' } : { filter: 'none' }}>
          <Box mb={4}>
            <Card sx={{ minWidth: 275, backgroundColor: '#FFFFFF' }}>
              <CardContent>
                <Typography variant="h6" component="div">
                  Personal Data
                </Typography>
                <Typography color="text.secondary">
                  Data is needed due to legal purposes
                  <ul>
                    <li>
                      First and last name
                    </li>
                    <li>
                      Home address
                    </li>
                    <li>
                      Date of birth
                    </li>
                  </ul>
                </Typography>
              </CardContent>
            </Card>
          </Box>

          <Box mb={4}>
            <Card sx={{ minWidth: 275, backgroundColor: '#FFFFFF' }}>
              <CardContent>
                <Typography variant="h6" component="div">
                  Your rating
                </Typography>
                <Typography color="text.secondary">
                  Rating you received
                  <ul>
                    <li>Example: 3.5</li>
                  </ul>
                </Typography>
              </CardContent>
            </Card>
          </Box>

          <Box mb={4}>
            <Card sx={{ minWidth: 275, backgroundColor: '#FFFFFF' }}>
              <CardContent>
                <Typography variant="h6" component="div">
                  Account Data
                </Typography>
                <Typography color="text.secondary">
                  <ul>
                    <li>
                      AccountID
                    </li>
                    <li>
                      Banned
                    </li>
                    <li>
                      Data hash
                    </li>
                  </ul>
                </Typography>
              </CardContent>
            </Card>
          </Box>

          <Box mb={4}>
            <Card sx={{ minWidth: 275, backgroundColor: '#FFFFFF' }}>
              <CardContent>
                <Typography variant="h6" component="div">
                  My pseudonyms
                </Typography>
                <Typography color="text.secondary">
                  <ul>
                    <li>asdlihasd8dhu3d8hd3d</li>
                    <li>asdlihasd8dhu3d8hd3d</li>
                    <li>asdlihasd8dhu3d8hd3d</li>
                  </ul>
                </Typography>
              </CardContent>
            </Card>
          </Box>
        </List>
        {!hideData &&
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <span style={{ color: '#3B4AE0', cursor: 'pointer' }} onClick={toggleShowData}>Hide Data</span>
          </div>
        }
      </div>
    </Container>
  );
};

export default AuthServicePage;