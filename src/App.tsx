import "mapbox-gl/dist/mapbox-gl.css";
import "./App.css";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Navigate,
  Route,
  RouterProvider,
} from "react-router-dom";
import MainPage from "./pages/MainPage";
import { ThemeProvider } from "./components/theme-provider";
import Root from "./pages/Root";
import { MainLayout } from "./pages/MainLayout";
import CameraDetail from "./pages/CameraDetail";
import EventDetail from "./pages/EventDetail";
import EventList from "./pages/EventList";
import StreamList from "./pages/StreamList";
import LoginPage from "./pages/LoginPage";
import AuthLayout from "./pages/AuthLayout";
import SignupPage from "./pages/SignupPage";
import { Toaster } from "@/components/ui/toaster";
import { ConnectionProvider } from "./context/ConnectionContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { AlertProvider } from "./context/AlertContext";
import SettingPage from "./pages/SettingPage";
import ProfilePage from "./pages/ProfilePage";
import { LocaleProvider } from "./components/locale-provider";
import HazardSettingPage from "./pages/HazardSettingPage";
import PatrolAreaPage from "./pages/PatrolAreaPage";

function App() {
  const queryClient = new QueryClient();

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path={"/"} element={<Root />}>
        <Route path="/" element={<MainLayout />}>
          <Route path="/" element={<Navigate to="/cameras" />} />
          <Route path="/cameras" element={<MainPage />} />
          <Route path="/cameras/:streamId" element={<CameraDetail />} />
          {/* <Route path="/schedules" element={<ScheduleList />} /> */}
          <Route path="/streams" element={<StreamList />} />
          <Route path="/events" element={<EventList />} />
          <Route path="/events/:eventId" element={<EventDetail />} />
          <Route
            path="/streams/hazard-area/:streamId"
            element={<HazardSettingPage />}
          />
          <Route
            path="/streams/patrol-area/:streamId"
            element={<PatrolAreaPage />}
          />
          <Route path="/settings" element={<SettingPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>
        <Route path="/" element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/sign-up" element={<SignupPage />} />
        </Route>
      </Route>
    )
  );

  return (
    <ConnectionProvider>
      <AlertProvider>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <LocaleProvider defaultLocale="en" storageKey="isafe-locale">
              <RouterProvider router={router} />
              <Toaster />
            </LocaleProvider>
          </ThemeProvider>
        </QueryClientProvider>
      </AlertProvider>
    </ConnectionProvider>
  );
}

export default App;
