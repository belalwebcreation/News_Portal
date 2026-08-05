// src/layouts/PublicLayout.jsx
import { Outlet } from "react-router-dom";
import Header from "../components/home/Header/Header";
import Footer from "../components/home/Footer";

const PublicLayout = () => (
  <>
    <Header />
    <Outlet />
    <Footer />
  </>
);

export default PublicLayout;