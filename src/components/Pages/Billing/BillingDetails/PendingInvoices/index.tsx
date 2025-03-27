import { Alert, Box, Button, Grid } from "@mui/material";
import { PendingInvoicesItem } from "../PendingInvoicesItem";
import { TotalAmountDescription } from "@/components/shared/TotalAmountDescription";
import { TotalAmount } from "@/components/shared/TotalAmount";
import { StyledStikyWrap } from "../styled";

export const PendingInvoices = () => {
  return (
    <>
      <Grid container spacing={{ xs: "24px" }} columns={{ xs: 12, sm: 12 }}>
        <Grid item xs={12}>
          <Alert severity="warning">
            Your subscription expires in 5 days, please pay up
          </Alert>
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          <Box>
            <Grid
              container
              spacing={{ xs: "24px" }}
              columns={{ xs: 12, sm: 12 }}
            >
              <Grid item xs={12}>
                <PendingInvoicesItem />
              </Grid>

              <Grid item xs={12}>
                <PendingInvoicesItem />
              </Grid>

              <Grid item xs={12}>
                <PendingInvoicesItem />
              </Grid>

              <Grid item xs={12}>
                <PendingInvoicesItem />
              </Grid>

              <Grid item xs={12}>
                <PendingInvoicesItem />
              </Grid>

              <Grid item xs={12}>
                <PendingInvoicesItem />
              </Grid>

              <Grid item xs={12}>
                <PendingInvoicesItem />
              </Grid>

              <Grid item xs={12}>
                <PendingInvoicesItem />
              </Grid>
            </Grid>
          </Box>
        </Grid>

        <Grid item xs={12} sm={6} md={6}>
          <StyledStikyWrap>
            <TotalAmountDescription description="total PAYMENT">
              <TotalAmount usd="30" sats="30,000" />
            </TotalAmountDescription>
            <Button fullWidth size="large" variant="contained">
              Pay Now
            </Button>
          </StyledStikyWrap>
        </Grid>
      </Grid>
    </>
  );
};
