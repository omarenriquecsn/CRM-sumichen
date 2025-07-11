import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthProvider";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { Login } from "./pages/auth/Login";
import { Register } from "./pages/auth/Register";
import { DashboardVendedor } from "./pages/dashboard/DashboardVendedor";
import { DashboardAdmin } from "./pages/dashboard/DashboardAdmin";
import { Clientes } from "./pages/clientes/Clientes";
import { ClienteDetalle } from "./pages/clientes/ClienteDetalle";
import { Pipeline } from "./pages/ventas/Pipeline";
import { Reuniones } from "./pages/reuniones/Reuniones";
import { Tickets } from "./pages/tickets/Tickets";
import { Pedidos } from "./pages/pedidos/Pedidos";
import { Analitica } from "./pages/analitica/Analitica";
import { Configuracion } from "./pages/configuracion/Configuracion";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import {ReactQueryDevtools} from '@tanstack/react-query-devtools'

const queryClientet = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClientet}>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Routes>
              {/* Rutas públicas */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Rutas protegidas */}
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Navigate to="/dashboard" replace />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardVendedor />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/admin"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <DashboardAdmin />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/clientes"
                element={
                  <ProtectedRoute>
                    <Clientes />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/clientes/:id"
                element={
                  <ProtectedRoute>
                    <ClienteDetalle />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/pipeline"
                element={
                  <ProtectedRoute>
                    <Pipeline />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/reuniones"
                element={
                  <ProtectedRoute>
                    <Reuniones />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/tickets"
                element={
                  <ProtectedRoute>
                    <Tickets />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/pedidos"
                element={
                  <ProtectedRoute>
                    <Pedidos />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/analitica"
                element={
                  <ProtectedRoute>
                    <Analitica />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/configuracion"
                element={
                  <ProtectedRoute>
                    <Configuracion />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
      <ReactQueryDevtools initialIsOpen={false}/>
    </QueryClientProvider>
  );
}

export default App;
