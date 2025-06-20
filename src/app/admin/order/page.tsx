import React from 'react';

const OrderPage = () => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Order Management</h1>
        <button className="rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700">
          Add New Order
        </button>
      </div>
      <div className="rounded-lg border bg-white p-6 shadow-sm">
        <p className="text-gray-600">Order management interface will be displayed here.</p>
      </div>
    </div>
  );
};

export default OrderPage; 