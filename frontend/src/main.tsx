import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';


import './styles/tailwind.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
