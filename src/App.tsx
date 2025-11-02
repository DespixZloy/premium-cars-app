import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { HomePage } from './pages/HomePage';
import { BrandsPage } from './pages/BrandsPage';
import { BrandPage } from './pages/BrandPage';
import { CarPage } from './pages/CarPage';
import { ReviewsPage } from './pages/ReviewsPage';
import { SellPage } from './pages/SellPage';
import { CommissionPage } from './pages/CommissionPage';
import { OrderPage } from './pages/OrderPage';
import { VideoPage } from './pages/VideoPage';
import { ContactsPage } from './pages/ContactsPage';
import { ScrollToTop } from './components/ScrollToTop'

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/brands" element={<BrandsPage />} />
          <Route path="/brand/:slug" element={<BrandPage />} />
          <Route path="/car/:id" element={<CarPage />} />
          <Route path="/reviews" element={<ReviewsPage />} />
          <Route path="/sell" element={<SellPage />} />
          <Route path="/commission" element={<CommissionPage />} />
          <Route path="/order" element={<OrderPage />} />
          <Route path="/video" element={<VideoPage />} />
          <Route path="/contacts" element={<ContactsPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
