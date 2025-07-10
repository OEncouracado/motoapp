import {
  Box,
  Card,
  CardContent,
  Chip,
  Grid,
  Paper,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { SparkLineChart } from "@mui/x-charts";

export default function Dashb() {
  const theme = useTheme();
  return (
    <Box
      component={Paper}
      className="bg-dark text-light p-3"
      sx={{ flexGrow: 1 }}
    >
      <Typography variant="h4" component="h1" sx={{ p: 2 }}>
        Dashboard
      </Typography>
      <Grid container spacing={2} columns={12}>
        <Grid item size={3}>
          <Card
            variant="outlined"
            className="bg-dark text-light border-white"
            sx={{ height: "100%", flexGrow: 1 }}
          >
            <CardContent>
              <Typography component="h2" variant="subtitle2" gutterBottom>
                Clientes
              </Typography>
              <Stack
                direction="column"
                sx={{
                  justifyContent: "space-between",
                  flexGrow: "1",
                  gap: 1,
                }}
              >
                <Stack sx={{ justifyContent: "space-between" }}>
                  <Stack
                    direction="row"
                    sx={{
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography variant="h4" component="p">
                      {"1000"}
                    </Typography>
                    <Chip size="small" color="primary" label={"Teste"} />
                  </Stack>
                </Stack>
                <Box sx={{ width: "100%", height: 50 }}>
                  {/* <SparkLineChart
                    color="primary"
                    data={[10, 20, 30, 40, 50, 60, 70, 80, 90, 100]}
                    area
                    showHighlight
                    showTooltip
                    xAxis={{
                      scaleType: "band",
                      data: [
                        "Jan",
                        "Feb",
                        "Mar",
                        "Apr",
                        "May",
                        "Jun",
                        "Jul",
                        "Aug",
                        "Sep",
                        "Oct",
                      ],
                    }}
                    // sx={{
                    //   [`& .${areaElementClasses.root}`]: {
                    //     fill: `url(#area-gradient-${value})`,
                    //   },
                    // }}
                  ></SparkLineChart> */}
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
