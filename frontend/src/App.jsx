import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Dashboard from "./pages/Dashboard.jsx";
import Products from "./pages/Products.jsx";
import Categories from "./pages/Categories.jsx";
import Inventory from "./pages/Inventory.jsx";
import MovementHistory from "./pages/MovementHistory.jsx";
import ProductDetails from "./pages/ProductDetails.jsx"; 

import "./App.css";
import MainLayout from "./layouts/MainLayout";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<MainLayout />}>

                    <Route path="/" element={<Dashboard />} />
                    <Route path="/products" element={<Products />} />
                    <Route path="/products/:id" element={<ProductDetails />} />
                    <Route path="/categories" element={<Categories />} />
                    <Route path="/inventory" element={<Inventory />} />
                    <Route path="/movements" element={<MovementHistory />} />
                    <Route path="*" element={<Navigate to="/" replace />} />

                </Route>
            </Routes>
        </BrowserRouter>
    )
}

export default App;