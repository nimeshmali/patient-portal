import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import Layout from '@/components/layout/Layout';
import Home from '@/pages/Home';
import UploadDocument from '@/pages/UploadDocument';
import ViewDocuments from '@/pages/ViewDocuments';
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="upload" element={<UploadDocument />} />
          <Route path="documents" element={<ViewDocuments />} />
        </Route>
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
}

export default App;