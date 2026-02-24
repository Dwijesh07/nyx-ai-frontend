// App.jsx - No changes needed
import React from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./components/layout";
import Contact from "./pages/Contact";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsAndConditions from "./pages/TermsAndConditions";


import HomeChat from "./pages/HomeChat";
import Tools from "./pages/Tools";
import About from "./pages/About";
import Pricing from "./pages/Pricing";
import Account from "./pages/Account";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomeChat />} />
        <Route path="tools" element={<Tools />} />
        <Route path="about" element={<About />} />
        <Route path="pricing" element={<Pricing />} />
        <Route path="account" element={<Account />} />
        <Route path="contact" element={<Contact />} />
        <Route path="terms" element={<TermsAndConditions />} />
        <Route path="privacy" element={<PrivacyPolicy />} />
      </Route>
    </Routes>
  );
}