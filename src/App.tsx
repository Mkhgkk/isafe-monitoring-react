import "./App.css";
import React, {useEffect} from 'react';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import MainPage from "./pages/MainPage";
import { ThemeProvider } from "./components/theme-provider";
import Root from "./pages/Root";
import { MainLayout } from "./pages/MainLayout";
import CameraDetail from "./pages/CameraDetail";
import socket from "./services/socketService";

function App() {
  useEffect(() => {
    socket.connect()

    socket.on('connect', () => {
      console.log('Connected to socket server')
    })

    return () => {
      socket.off('connect')
      socket.disconnect()
    }
  },[])

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path={"/"} element={<Root />}>
        <Route path="/" element={<MainLayout />}>
          <Route path="/" element={<MainPage />} />
          <Route path="/camera/:streamId" element={<CameraDetail />} />
        </Route>
      </Route>
    )
  );

  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}

export default App;
