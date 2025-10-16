import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/home.js';
import Discover from './components/discover.js';
import Login from './components/login';
import MyOrdersPage from './components/myorderspage.js';
import SignUp from './components/signup.js';
import ResetPassword from './components/ResetPassword';
import Profile from './components/profile.js';
import Header from './components/header/Header.js';
import TermsAndConditions from './components/terms.js';
import Explore from './components/explore.js';
import SearchResults from './components/searchresults.js';
import Cart from './components/cart.js';
import Spinner from './components/spinner.js';
import BasicPlansCart from './components/basicplanscart.js';
import StandardPlansCart from './components/standardplanscart.js';
import PremiumPlansCart from './components/premiumplanscart.js';
import SEOComponent from './components/SEOComponent'; // Import SEO component

function App() {
  return (
    <Router>
      <Header />
      <SEOComponent /> {/* Add SEO component here to apply global SEO tags */}
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/discover" element={<Discover />} />
        <Route path="/basicplanscart" element={<BasicPlansCart />} />
        <Route path="/standardplanscart" element={<StandardPlansCart />} />
        <Route path="/premiumplanscart" element={<PremiumPlansCart />} />
        <Route path="/login" element={<Login />} />
        <Route path="/myorderspage" element={<MyOrdersPage />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/spinner" element={<Spinner />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/" element={<Explore />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/TermsAndConditions" element={<TermsAndConditions />} />
      </Routes>
    </Router>
  );
}

export default App;
