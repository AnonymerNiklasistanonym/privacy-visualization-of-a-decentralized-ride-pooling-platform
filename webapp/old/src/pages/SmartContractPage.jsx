import React from "react";
import { Typography, Container, Grid, Paper, Box } from '@mui/material';
import IncognitoIcon from "@mui/icons-material/PermIdentity";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import HandshakeIcon from "@mui/icons-material/Handshake";
import Rating from "@mui/lab/Rating";


const SmartContractPage = () => {
  return (
    <Container component="main" maxWidth="md" style={{ marginTop: '140px', paddingBottom: '4rem' }}>

      <Box mb={8} style={{ border: '1px solid black', borderRadius: '20px', padding: '1rem 2rem' }}>
        <Typography color={'#3B4AE0'} variant="h6" component="div" sx={{ flexGrow: 1, textAlign: 'left' }}>
          What is the Smart Contract for?
        </Typography>
        <Typography variant='p' component="div" sx={{ flexGrow: 1, color: 'grey' }}>
          The smart contract outlines an agreement between a pseudonymized ride provider (Driver) and a pseudonymized ride requester (Passenger). Both parties, the ride provider and the requester, can provide feedback to each other.
        </Typography>
      </Box>

      <Paper >
        <Grid
          container
          spacing={3}
          alignItems="center"
          justify="center"
          justifyContent="center"
        >
          <div style={{ "padding": "20px" }}>
            <div style={{ marginBottom: 10 }}>
              <Rating value={2.5} precision={0.5} readOnly />
            </div>
            <div style={{ "text-align": "center" }}>Driver's Rating</div>
          </div>
        </Grid>
        <Grid container spacing={3} alignItems="center" justify="center">
          <Grid item xs={12} sm={4} style={{textAlign: "center"}}>
            <DirectionsCarIcon fontSize="large" />
            <Typography variant="h6">Ride provider</Typography>
            <Typography variant="p">fkuhkdfkdfh8euhiudf8his7ifaasd</Typography>
          </Grid>
          <Grid item xs={12} sm={4} style={{textAlign: "center"}}>
            <HandshakeIcon fontSize="large" />
          </Grid>
          <Grid item xs={12} sm={4} style={{textAlign: "center"}}>
            <IncognitoIcon fontSize="large" />
            <Typography variant="h6">Ride requestor</Typography>
            <Typography variant="p">askdhal37dauhd8dhai2h8dhda8d2h</Typography>
          </Grid>
        </Grid>
        <Grid
          container
          spacing={3}
          alignItems="center"
          justify="center"
          justifyContent="center"
          marginTop="10px"
        >
          <div style={{ "padding": "20px" }}>
            <div style={{ marginBottom: 10 }}>
              <Rating value={2.5} precision={0.5} readOnly />
            </div>
            <div style={{ "text-align": "center" }}>Rahul's Rating</div>
          </div>
        </Grid>
      </Paper>
    </Container>
  );
};

export default SmartContractPage;
