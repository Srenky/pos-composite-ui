import React, { useEffect, useState } from 'react';
import { Button, Typography, Box, Container, Snackbar } from '@mui/material';
import OrderDialog from './components/OrderMenu';
import CreatedOrderCard from './components/OrderCard';
import mqtt, { MqttClient } from 'mqtt';

interface OrderItem {
  id: number;
  name: string;
  quantity: number;
  price: number;
}

interface TableOrder {
  tableNumber: number;
  orderItems: OrderItem[];
  totalPrice: number;
  createdAt: string;
  done: boolean;
}

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
  clientId: 'pos_checkout_app_' + Math.random().toString(16).substring(2, 8),
  username: 'pos_checkout_app',
  password: 'Mfw5GnkL4eViEQi',
};

const App: React.FC = () => {
  const [client, setClient] = useState<MqttClient | null>(null);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [tableOrders, setTableOrders] = useState<TableOrder[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  // const [messageFromMAUI, setMessageFromMAUI] = useState<string>(
  //   'Waiting for message from MAUI...',
  // );

  const handleMessageFromMAUI = (event: MessageEvent) => {
    if (JSON.stringify(event.data).includes('fromMaui')) {
      // const parts = event.data.split(':'); // message format: "fromMaui:PaymentStatus"
      // setMessageFromMAUI(parts[1]);
    }
  };

  useEffect(() => {
    const fetchMenuItems = async () => {
      const response = await fetch(process.env.REST_API_URL!);
      const data = await response.json();
      setMenuItems(data);
    };

    fetchMenuItems();

    window.addEventListener('message', handleMessageFromMAUI);

    const client = mqtt.connect(process.env.MQTT_BROKER_URL!, options);
    setClient(client);

    return () => {
      window.removeEventListener('message', handleMessageFromMAUI);
      client.end();
    };
  }, []);

  useEffect(() => {
    if (client) {
      client.on('connect', () => {
        client.subscribe('order/ready');
        client.subscribe('menu/new');
        client.subscribe('menu/updated');
        client.subscribe('menu/remove');
      });

      client.on('message', (topic, message) => {
        switch (topic) {
          case 'order/ready': {
            const tableNumber = message.toString();
            setSnackbarMessage(`Order ready for table ${tableNumber}`);
            setOpenSnackbar(true);
            break;
          }

          case 'menu/new': {
            const newMenuItem = JSON.parse(message.toString());
            setMenuItems((prev) => [...prev, newMenuItem]);
            break;
          }

          case 'menu/updated': {
            const updatedMenuItem = JSON.parse(message.toString());
            setMenuItems((prev) => {
              const index = prev.findIndex(
                (item) => item.id === updatedMenuItem.id,
              );
              if (index !== -1) {
                const updatedItems = [...prev];
                updatedItems[index] = updatedMenuItem;
                return updatedItems;
              }
              return prev;
            });
            break;
          }

          case 'menu/remove': {
            const removedMenuItemId = parseInt(message.toString(), 10);
            setMenuItems((prev) =>
              prev.filter((item) => item.id !== removedMenuItemId),
            );
            break;
          }
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [client]);

  const handleAddOrder = (orderItems: OrderItem[]) => {
    const tableNumber = tableOrders.length + 1;
    const totalPrice = orderItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0,
    );

    const newTableOrder: TableOrder = {
      tableNumber,
      orderItems,
      totalPrice,
      createdAt: new Date().toISOString(),
      done: false,
    };

    setTableOrders((prev) => [...prev, newTableOrder]);

    //print time of publish
    // const startTime = Date.now();
    // console.log(new Date().toISOString());
    client?.publish(
      'order/new',
      JSON.stringify(newTableOrder),
      { qos: 2 },
      (err) => {
        if (!err) {
          // const latency = Date.now() - startTime;
          // console.log(`Latency for QoS 2: ${latency} ms`);
        }
      },
    );
  };

  return (
    <Container
      maxWidth="sm"
      sx={{ padding: 2, display: 'flex', flexDirection: 'column' }}
    >
      <Button
        variant="contained"
        onClick={() => setDialogOpen(true)}
        sx={{
          marginLeft: 'auto',
          marginRight: 'auto',
          marginBottom: 2,
          fontSize: {
            xs: '0.875rem', // Small font on mobile
            sm: '1rem',
          },
        }}
      >
        Create Order
      </Button>
      <OrderDialog
        menuItems={menuItems}
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onOrder={handleAddOrder}
      />
      <Typography
        variant="h5"
        sx={{
          marginBottom: 2,
          fontSize: {
            xs: '1.25rem', // Adjust font size for mobile
            sm: '1.5rem',
          },
        }}
      >
        Created Orders:
      </Typography>
      <Box>
        {tableOrders.length > 0 ? (
          tableOrders.map((order, index) => {
            return (
              <CreatedOrderCard
                key={index}
                tableNumber={order.tableNumber}
                orderItems={order.orderItems}
                totalPrice={order.totalPrice}
              />
            );
          })
        ) : (
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{
              textAlign: 'center',
              fontSize: {
                xs: '0.875rem', // Small font on mobile
                sm: '1rem',
              },
            }}
          >
            No orders have been created yet.
          </Typography>
        )}
      </Box>

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
