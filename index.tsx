import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { db, auth } from "firebase-lucid"
import Product from './model/Product';
import Order from './model/Order';
import User from './model/User';

db.initialize({
  apiKey: "AIzaSyBRSVfwY5fLQXASAGsegaH0TI9YLzFC0_I",
  authDomain: "mockup-13f9d.firebaseapp.com",
  projectId: "mockup-13f9d",
  storageBucket: "mockup-13f9d.firebasestorage.app",
  messagingSenderId: "1098898745490",
  appId: "1:1098898745490:web:5a5b1f77d823a7bd3ede4b",
})
// console.log(
//   await Product.create({
//     name: "Product B",
//     content: "This is product B",
//     description: "Detailed description of product B",
//     price: 99.99,
//     status: true,
//     tags: ["electronics", "gadget"],
//   })
  
// )

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
// const user = await User.create({
//   name: "Jphn"
// })

// const products = await Product.query().get()

// await Order.create({
//   buyer_id: user.id || "",
//   product_ids: products.map((p) => p.id),
// })