import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import AuthPage from './components/AuthPage/AuthPage';
import MainPage from './components/MainPage/MainPage';
import TablePage from './components/TablePage/TablePage';
import TableRow from './components/TableRow/TableRow'; 
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './styles/App.css';

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Главная страница авторизации */}
        <Route path="/" element={<AuthPage />} />

        {/* Главная страница приложения */}
        <Route path="/main" element={<MainPage />} />

        {/* Страница работы с таблицей (список строк) */}
        <Route path="/tables/:tableId/rows" element={<TablePage />} />

        {/* Страница работы с конкретной строкой (редактирование/удаление) */}
        <Route path="/tables/:tableId/rows/:rowId" element={<TableRow />} />

        {/* Если маршрут не найден */}
        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>

      {/* Уведомления (toast) */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </AuthProvider>
  );
}

export default App;