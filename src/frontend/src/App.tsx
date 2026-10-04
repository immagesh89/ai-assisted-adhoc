import { useState } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { ProductList } from "./features/products/ProductList";
import { SavedProductsList } from "./features/saved/SavedProductsList";
import { SaveButton } from "./features/saved/SaveButton";
import "./App.css";

// For demo purposes, using a fixed user ID as specified by the stubbed auth
const DEMO_USER_ID = "user-123";

function Home() {
  const [capMessage, setCapMessage] = useState("");
  return (
    <div>
      {capMessage && <p className="status-message" role="alert">{capMessage}</p>}
      <ProductList />
    </div>
  );
}

function Saved() {
  return <SavedProductsList userId={DEMO_USER_ID} />;
}

function App() {
  return (
    <BrowserRouter>
      <main className="app">
        <header className="app-header">
          <h1>Product Catalog</h1>
          <nav>
            <Link to="/">Home</Link> | <Link to="/saved">Saved</Link>
          </nav>
        </header>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/saved" element={<Saved />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
