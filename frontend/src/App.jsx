import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Categories from "./pages/Categories";
import Inventory from "./pages/Inventory";
import MovementHistory from "./pages/MovementHistory";

import "./App.css";
import MainLayout from "./layouts/MainLayout";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<MainLayout />}>

                    <Route path="/" element={<Dashboard />} />
                    <Route path="/products" element={<Products />} />
                    <Route path="/categories" element={<Categories />} />
                    <Route path="/inventory" element={<Inventory />} />
                    <Route path="/movements" element={<MovementHistory />} />
                    <Route path="*" element={<Navigate tp="/" replace />} />

                </Route>
            </Routes>
        </BrowserRouter>
    )
}

export default App;