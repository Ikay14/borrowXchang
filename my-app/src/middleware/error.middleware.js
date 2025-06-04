import express from 'express';
import { HttpError } from '../utils/exception.js'; 

export const errorHandler = (err, req, res, next) => {
  if (err instanceof HttpError) {
    return res.status(err.status).json({ message: err.message });
  }

  console.error('Unhandled Error:', err);
  return res.status(500).json({ message: 'Something went wrong' });
};