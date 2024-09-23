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
import EventDetail from "./pages/EventDetail";
import EventList from "./pages/EventList";
import StreamList from "./pages/StreamList";
import LoginPage from "./pages/LoginPage";
import AuthLayout from "./pages/AuthLayout";
import SignupPage from "./pages/SignupPage";

function App() {
  const [messageApi, contextHolder] = message.useMessage();
  const [systemStatus, setSystemStatus] = useState({ cpu: 0.0, gpu: 0.0 });
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!isConnected) {
      messageApi.open({
        key: "updatable",
        type: "loading",
        content: "Connecting...",
        duration: 0,
      });
    }

    if (isConnected) {
      messageApi.open({
        key: "updatable",
        type: "success",
        content: "Connected!",
        duration: 2,
      });
    }
  }, [isConnected]);

  useEffect(() => {
    messageApi.open({
      key: "updatable",
      type: "loading",
      content: "Connecting...",
      duration: 0,
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
          <Route path="/stream" element={<StreamList />} />
          <Route path="/camera/:streamId" element={<CameraDetail />} />
          <Route path="/event" element={<EventList />} />
          <Route path="/event/:eventId" element={<EventDetail />} />
        </Route>
        <Route path="/" element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/sign-up" element={<SignupPage />} />
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
