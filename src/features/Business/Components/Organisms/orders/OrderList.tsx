import React from 'react';
import { List, Divider } from '@mui/material';
import OrderListItem from './OrderListItem';

interface OrderListProps {
  orders: any[];
  onAction: (action: string, orderId: number) => void;
}

const OrderList: React.FC<OrderListProps> = ({ orders, onAction }) => {
  return (
    <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
      {orders.map((order, index) => (
        <React.Fragment key={order.id}>
          <OrderListItem order={order} onAction={onAction} />
          {index < orders.length - 1 && <Divider variant="inset" />}
        </React.Fragment>
      ))}
    </List>
  );
};

export default OrderList;