import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Typography,
  Box,
} from "@mui/material";
import { Add, Remove } from "@mui/icons-material";

interface MenuItem {
  id: number;
  name: string;
  price: number;
}

export interface OrderItem {
  id: number;
  name: string;
  quantity: number;
  price: number;
}

interface OrderDialogProps {
  menuItems: MenuItem[];
  open: boolean;
  onClose: () => void;
  onOrder: (order: OrderItem[]) => void;
}

const OrderDialog: React.FC<OrderDialogProps> = ({
  menuItems,
  open,
  onClose,
  onOrder,
}) => {
  const [quantities, setQuantities] = useState<Record<number, number>>({});

  useEffect(() => {
    const initialQuantities = menuItems.reduce(
      (acc, item) => ({ ...acc, [item.id]: 0 }),
      {},
    );
    setQuantities(initialQuantities);
  }, [menuItems]);

  const handleIncrement = (id: number) => {
    setQuantities((prev) => ({ ...prev, [id]: prev[id] + 1 }));
  };

  const handleDecrement = (id: number) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: prev[id] > 0 ? prev[id] - 1 : 0,
    }));
  };

  const handleCreateOrder = () => {
    const order: OrderItem[] = menuItems
      .filter((item) => quantities[item.id] > 0)
      .map((item) => ({
        id: item.id,
        name: item.name,
        quantity: quantities[item.id],
        price: item.price,
      }));
    onOrder(order);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Create an Order</DialogTitle>
      <DialogContent>
        <List>
          {menuItems.map((item) => (
            <ListItem key={item.id}>
              <ListItemText
                primary={item.name}
                secondary={`Price: $${item.price}`}
              />
              <Box display="flex" alignItems="center">
                <IconButton onClick={() => handleDecrement(item.id)}>
                  <Remove />
                </IconButton>
                <Typography variant="body1" sx={{ mx: 1 }}>
                  {quantities[item.id]}
                </Typography>
                <IconButton onClick={() => handleIncrement(item.id)}>
                  <Add />
                </IconButton>
              </Box>
            </ListItem>
          ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleCreateOrder} variant="contained" color="primary">
          Create Order
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default OrderDialog;
