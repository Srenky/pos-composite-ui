import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Divider,
  Button,
} from "@mui/material";

interface OrderItem {
  id: number;
  name: string;
  quantity: number;
  price: number;
}

interface CreatedOrderCardProps {
  tableNumber: number;
  orderItems: OrderItem[];
  totalPrice: number;
  createdAt: string;
  done: boolean;
  onMarkAsReady: () => void;
}

const CreatedOrderCard: React.FC<CreatedOrderCardProps> = ({
  tableNumber,
  orderItems,
  totalPrice,
  createdAt,
  done,
  onMarkAsReady,
}: CreatedOrderCardProps) => {
  if (done) {
    return null;
  }

  return (
    <Card sx={{ marginBottom: 2, padding: 2 }}>
      <CardContent>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography variant="h6">Table {tableNumber}</Typography>
        </Box>

        <Typography variant="body2" color="text.secondary" gutterBottom>
          Created at: {new Date(createdAt).toLocaleString()}
        </Typography>

        {orderItems.map((item) => (
          <Box
            key={item.id}
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            flexWrap="wrap"
            my={1}
          >
            <Typography variant="body2" sx={{ flex: "1 1 auto" }}>
              {item.quantity}x {item.name}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                flex: "0 0 auto",
                minWidth: "80px",
                textAlign: "right",
              }}
            >
              ${item.price * item.quantity}
            </Typography>
          </Box>
        ))}

        <Divider sx={{ marginY: 2 }} />

        <Typography
          variant="h6"
          align="right"
          sx={{
            fontSize: {
              xs: "1.1rem",
              sm: "1.25rem",
            },
          }}
        >
          Total: ${totalPrice}
        </Typography>

        <Box mt={2} textAlign="center">
          <Button
            variant="contained"
            color="primary"
            onClick={onMarkAsReady}
            sx={{ width: "100%" }}
          >
            Mark as Ready
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default CreatedOrderCard;
