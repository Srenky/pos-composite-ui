import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Divider,
  Button,
} from '@mui/material';

interface OrderItem {
  id: number;
  name: string;
  quantity: number;
  price: number;
}

interface CreatedOrderCardProps {
  tableNumber: number; // Example to group orders by table
  orderItems: OrderItem[];
  totalPrice: number;
}

const CreatedOrderCard: React.FC<CreatedOrderCardProps> = ({
  tableNumber,
  orderItems,
  totalPrice,
}) => {
  const sendMessageToMAUI = (amountToPay: number) => {
    window.location.href = `http://csharp.pay?amount=${amountToPay}`;
  };

  return (
    <Card sx={{ marginBottom: 2, padding: 2 }}>
      <CardContent>
        {/* Table Header */}
        <Typography variant="h6" gutterBottom>
          Table {tableNumber}
        </Typography>

        {/* Order Items */}
        {orderItems.map((item) => (
          <Box
            key={item.id}
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            flexWrap="wrap"
            my={1}
          >
            <Typography variant="body2" sx={{ flex: '1 1 auto' }}>
              {item.quantity}x {item.name}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                flex: '0 0 auto',
                minWidth: '80px',
                textAlign: 'right',
              }}
            >
              ${item.price * item.quantity}
            </Typography>
          </Box>
        ))}

        {/* Divider */}
        <Divider sx={{ marginY: 2 }} />

        {/* Total Cost */}
        <Typography
          variant="h6"
          align="right"
          sx={{
            fontSize: {
              xs: '1.1rem', // Adjust font size for small screens
              sm: '1.25rem',
            },
          }}
        >
          Total: ${totalPrice}
        </Typography>

        {/* Button to pay for the order */}
        <Box display="flex" justifyContent="flex-end" mt={2}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => sendMessageToMAUI(totalPrice)}
          >
            Pay for order
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default CreatedOrderCard;
