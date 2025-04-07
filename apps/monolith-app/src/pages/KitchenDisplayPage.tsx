import React, { useState, useEffect } from "react";
import { Typography, Container, Grid } from "@mui/material";
import CreatedOrderCard from "../components/OrderCardKitchen";
import mqtt, { MqttClient } from "mqtt";

interface OrderItem {
  id: number;
  name: string;
  quantity: number;
  price: number;
}

interface KitchenOrder {
  tableNumber: number;
  orderItems: OrderItem[];
  totalPrice: number;
  createdAt: string;
  done: boolean;
}

const options = {
  // Clean session
  clean: true,
  connectTimeout: 4000,
  reconnectPeriod: 0,
  keepalive: 60,
  // Authentication
  clientId: "pos_kitchen_app_" + Math.random().toString(16).substring(2, 8),
  username: "pos_kitchen_app",
  password: "tQgKmB9uKxyFtCZ",
};

const KitchenPage: React.FC = () => {
  const [orders, setOrders] = useState<KitchenOrder[]>([]);
  const [client, setClient] = useState<MqttClient | null>(null);

  useEffect(() => {
    const client = mqtt.connect(
      "wss://ee3fe3db.ala.eu-central-1.emqxsl.com:8084/mqtt",
      options,
    );
    setClient(client);

    return () => {
      client.end();
    };
  }, []);

  useEffect(() => {
    if (client) {
      client.on("connect", () => {
        client.subscribe("order/new");
      });

      client.on("message", (topic, message) => {
        if (topic === "order/new") {
          const newOrder = JSON.parse(message.toString());
          setOrders((prevOrders) => [...prevOrders, newOrder]);
        }
      });
    }
  }, [client]);

  const handleOrderDone = (index: number) => {
    const updatedOrders = [...orders];
    updatedOrders[index].done = true;
    setOrders(updatedOrders);

    client?.publish("order/ready", `${updatedOrders[index].tableNumber}`);
  };

  return (
    <Container maxWidth="lg" sx={{ padding: 2 }}>
      <Typography
        variant="h5"
        sx={{
          marginBottom: 2,
          fontSize: {
            xs: "1.25rem",
            sm: "1.5rem",
          },
        }}
      >
        Kitchen Orders
      </Typography>

      {orders.filter((order) => !order.done).length === 0 && (
        <Typography variant="body1">No orders right now</Typography>
      )}

      <Grid container spacing={2}>
        {orders.map(
          (order, index) =>
            !order.done && (
              <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                <CreatedOrderCard
                  tableNumber={order.tableNumber}
                  orderItems={order.orderItems}
                  totalPrice={order.totalPrice}
                  createdAt={order.createdAt}
                  done={order.done}
                  onMarkAsReady={() => handleOrderDone(index)}
                />
              </Grid>
            ),
        )}
      </Grid>
    </Container>
  );
};

export default KitchenPage;
