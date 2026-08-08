import {
  Route,
  Routes,
} from "react-router";

import PublicLayout from "../layouts/PublicLayout";
import FamilyLayout from "../layouts/FamilyLayout";
import AdminLayout from "../layouts/AdminLayout";

import HomePage from "../pages/public/HomePage";
import LoginPage from "../pages/public/LoginPage";
import RegisterPage from "../pages/public/RegisterPage";
import ForgotPasswordPage from "../pages/public/ForgotPasswordPage";
import NotFoundPage from "../pages/public/NotFoundPage";

import FamilyDashboardPage from "../pages/family/FamilyDashboardPage";
import BasicInfoPage from "../pages/family/BasicInfoPage";
import WivesPage from "../pages/family/WivesPage";
import HousingPage from "../pages/family/HousingPage";
import ChildrenPage from "../pages/family/ChildrenPage";
import SpecialCasesPage from "../pages/family/SpecialCasesPage";
import MarriedDaughtersPage from "../pages/family/MarriedDaughtersPage";
import ReviewPage from "../pages/family/ReviewPage";

import AdminLoginPage from "../pages/admin/AdminLoginPage";
import DashboardPage from "../pages/admin/DashboardPage";
import FamiliesPage from "../pages/admin/FamiliesPage";
import ExportPage from "../pages/admin/ExportPage";
import SettingsPage from "../pages/admin/SettingsPage";

function AppRoutes() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route
          path="/"
          element={<HomePage />}
        />

        <Route
          path="/login"
          element={<LoginPage />}
        />

        <Route
          path="/register"
          element={<RegisterPage />}
        />

        <Route
          path="/forgot-password"
          element={<ForgotPasswordPage />}
        />
      </Route>

      <Route
        path="/family"
        element={<FamilyLayout />}
      >
        <Route
          index
          element={<FamilyDashboardPage />}
        />

        <Route
          path="basic-info"
          element={<BasicInfoPage />}
        />

        <Route
          path="wives"
          element={<WivesPage />}
        />

        <Route
          path="housing"
          element={<HousingPage />}
        />

        <Route
          path="children"
          element={<ChildrenPage />}
        />

        <Route
          path="special-cases"
          element={<SpecialCasesPage />}
        />

        <Route
          path="married-daughters"
          element={<MarriedDaughtersPage />}
        />

        <Route
          path="review"
          element={<ReviewPage />}
        />
      </Route>

      <Route
        path="/admin/login"
        element={<AdminLoginPage />}
      />

      <Route
        path="/admin"
        element={<AdminLayout />}
      >
        <Route
          index
          element={<DashboardPage />}
        />

        <Route
          path="families"
          element={<FamiliesPage />}
        />

        <Route
          path="export"
          element={<ExportPage />}
        />

        <Route
          path="settings"
          element={<SettingsPage />}
        />
      </Route>

      <Route
        path="*"
        element={<NotFoundPage />}
      />
    </Routes>
  );
}

export default AppRoutes;