import React from 'react';
import './Notification.css';
import { toast } from 'react-toastify';

export const notify = (message, type) => {
  toast[type](message);
};

const Notification = () => {
  return null;
};

export default Notification;