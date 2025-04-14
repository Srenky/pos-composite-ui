import React, { useState, useEffect } from "react";
import {
  Button,
  Container,
  Grid,
  Typography,
  Paper,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  MenuItem,
  Snackbar,
} from "@mui/material";
import mqtt, { MqttClient } from "mqtt";

interface MenuItem {
  id: number;
  name: string;
  price: number;
}

const options = {
  // Clean session
  clean: true,
  connectTimeout: 4000,
  reconnectPeriod: 0,
  keepalive: 60,
  // Authentication
  clientId: "pos_backoffice_app_" + Math.random().toString(16).substring(2, 8),
  username: "pos_backoffice_app",
  password: "etGh2twxQjbbYK3",
};

const App: React.FC = () => {
  const [client, setClient] = useState<MqttClient | null>(null);

  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [analytics, setAnalytics] = useState({
    totalEarnings: 0,
    totalOrders: 0,
  });

  useEffect(() => {
    const fetchMenuItems = async () => {
      const response = await fetch(process.env.REST_API_URL!);
      const data = await response.json();
      setMenuItems(data);
    };

    const fetchAnalytics = async () => {
      const response = await fetch(process.env.REST_API_URL!);
      const data = await response.json();
      setAnalytics(data);
    };

    fetchMenuItems();
    fetchAnalytics();

    const client = mqtt.connect(process.env.MQTT_BROKER_URL!, options);
    setClient(client);

    return () => {
      client.end();
    };
  }, []);

  useEffect(() => {
    if (client) {
      client.on("connect", () => {});

      client.on("message", (topic, message) => {});
    }
  }, [client]);

  const handleAddMenuItem = () => {
    setSelectedItem(null);
    setOpenDialog(true);
  };

  const handleEditMenuItem = (item: MenuItem) => {
    setSelectedItem(item);
    setOpenDialog(true);
  };

  const handleRemoveMenuItem = (itemId: number) => {
    setMenuItems(menuItems.filter((item) => item.id !== itemId));
    setSnackbarMessage("Item removed successfully");
    setOpenSnackbar(true);
    client?.publish("menu/remove", itemId.toString());
  };

  const handleSaveMenuItem = (name: string, price: number) => {
    if (selectedItem) {
      // Edit existing item
      setMenuItems(
        menuItems.map((item) =>
          item.id === selectedItem.id ? { ...item, name, price } : item,
        ),
      );
      setSnackbarMessage("Item updated successfully");
      client?.publish(
        "menu/updated",
        JSON.stringify({ id: selectedItem.id, name, price }),
      );
    } else {
      // Add new item
      const newItem = { id: menuItems.length + 1, name, price };
      setMenuItems([...menuItems, newItem]);
      setSnackbarMessage("New item added");
      client?.publish("menu/new", JSON.stringify(newItem));
    }
    setOpenDialog(false);
    setOpenSnackbar(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  return (
    <Container maxWidth="lg" sx={{ padding: 2 }}>
      {/* Analytics Section */}
      <Paper sx={{ padding: 3, marginBottom: 3 }}>
        <Typography variant="h5" sx={{ marginBottom: 2 }}>
          Analytics
        </Typography>
        <Typography variant="h6">
          Total Earnings: ${analytics.totalEarnings}
        </Typography>
        <Typography variant="h6">
          Total Orders: {analytics.totalOrders}
        </Typography>
      </Paper>

      {/* Menu Items Section */}
      <Typography variant="h5" sx={{ marginBottom: 2 }}>
        Menu Items
      </Typography>
      <Grid container spacing={2}>
        {menuItems.map((item) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={item.id}>
            <Paper
              sx={{
                padding: 2,
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <Box>
                <Typography variant="h6">{item.name}</Typography>
                <Typography variant="body2">${item.price}</Typography>
              </Box>
              <Box>
                <Button
                  onClick={() => handleEditMenuItem(item)}
                  variant="contained"
                  color="primary"
                  size="small"
                >
                  Edit
                </Button>
                <Button
                  onClick={() => handleRemoveMenuItem(item.id)}
                  variant="outlined"
                  color="error"
                  size="small"
                  sx={{ marginLeft: 1 }}
                >
                  Remove
                </Button>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Box mt={3} textAlign="center">
        <Button onClick={handleAddMenuItem} variant="contained" color="primary">
          Add New Menu Item
        </Button>
      </Box>

      {/* Dialog for Add/Edit Menu Item */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>
          {selectedItem ? "Edit Menu Item" : "Add New Menu Item"}
        </DialogTitle>
        <DialogContent>
          <TextField
            label="Item Name"
            variant="outlined"
            fullWidth
            defaultValue={selectedItem ? selectedItem.name : ""}
            sx={{ marginBottom: 2, marginTop: 2 }}
            id="menu-item-name"
          />
          <TextField
            label="Item Price"
            variant="outlined"
            fullWidth
            type="number"
            defaultValue={selectedItem ? selectedItem.price : ""}
            sx={{ marginBottom: 2 }}
            id="menu-item-price"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button
            onClick={() =>
              handleSaveMenuItem(
                (document.getElementById("menu-item-name") as HTMLInputElement)
                  .value,
                parseFloat(
                  (
                    document.getElementById(
                      "menu-item-price",
                    ) as HTMLInputElement
                  ).value,
                ),
              )
            }
            color="primary"
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        message={snackbarMessage}
      />
    </Container>
  );
};

export default App;
