#!/bin/bash

# Function to generate a random order in JSON format
generate_order() {
  # Random table number between 1 and 10
  tableNumber=$(((RANDOM % 10) + 1))

  # Random number of order items (1 to 3 items)
  num_items=$(((RANDOM % 12) + 10))

  # List of possible items
  items=("Pizza" "Burger" "Pasta" "Salad" "Sushi")

  orderItems=""
  totalPrice=0

  for ((i = 0; i < num_items; i++)); do
    # Choose a random item from the list
    itemIndex=$((RANDOM % ${#items[@]}))
    name=${items[$itemIndex]}

    # Random quantity between 1 and 5
    quantity=$(((RANDOM % 5) + 1))

    # Random price between 5 and 20
    price=$(((RANDOM % 16) + 5))

    # Add to total price (quantity * price)
    totalPrice=$((totalPrice + quantity * price))

    # Build the JSON object for this item; "id" is a sequential number starting at 1
    item_json=$(printf '{"id": %d, "name": "%s", "quantity": %d, "price": %d}' "$((i + 1))" "$name" "$quantity" "$price")

    # Append comma-separated items
    if [ $i -eq 0 ]; then
      orderItems="$item_json"
    else
      orderItems="$orderItems, $item_json"
    fi
  done

  # Construct the full JSON order
  json=$(printf '{"tableNumber": %d, "orderItems": [%s], "totalPrice": %d, "done": false}' "$tableNumber" "$orderItems" "$totalPrice")

  echo "$json"
}

# Function to send the generated order with a POST request
send_order() {
  order=$(generate_order)
  echo "Sending order: $order"

  # Using --silent and --output /dev/null to fire-and-forget
  curl -X POST http://localhost:8080/orders \
    -H "Content-Type: application/json" \
    -d "$order" --silent --output /dev/null &
}

counter=0
# go until counter is 100
while [ $counter -lt 100 ]; do
  echo "Sending order"
  send_order
  echo "Order sent"
  counter=$((counter + 1))
  # sleep for random time between 1 and 3 seconds
  sleep $(((RANDOM % 5) + 1))
done
