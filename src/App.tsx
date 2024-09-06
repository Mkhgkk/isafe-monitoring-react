import "./App.css";
import React, { useState, useEffect } from "react";
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

import { message } from "antd";

function App() {
  const [messageApi, contextHolder] = message.useMessage();
  const [systemStatus, setSystemStatus] = useState({ cpu: 0.0, gpu: 0.0 });
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!isConnected) return;
    messageApi.open({
      key: "updatable",
      type: "success",
      content: "Connected!",
      duration: 2,
    });
  }, [isConnected]);

  useEffect(() => {
    messageApi.open({
      key: "updatable",
      type: "loading",
      content: "Connecting...",
    });

    socket.connect();

    socket.on("connect", () => {
      setIsConnected(true);
      console.log("Connected to socket server");
    });

    socket.on("disconnect", () => {
      setIsConnected(false);
      console.log("Socket server disconnected");
    });

    socket.on("system_status", (data) => {
      setSystemStatus(data);
      // console.log("System Status: ", data);
    });

    return () => {
      socket.off("connect");
      socket.off("system_status");
      socket.disconnect();
    };
  }, []);

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path={"/"} element={<Root />}>
        <Route
          path="/"
          element={
            <MainLayout isConnected={isConnected} systemStatus={systemStatus} />
          }
        >
          <Route path="/" element={<MainPage />} />
          <Route path="/camera/:streamId" element={<CameraDetail />} />
        </Route>
      </Route>
    )
  );

  return (
    <>
      {contextHolder}
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <RouterProvider router={router} />
      </ThemeProvider>
    </>
  );
}

export default App;
