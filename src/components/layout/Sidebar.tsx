import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import {
  LayoutDashboard,
  Users,
  TrendingUp,
  Calendar,
  Ticket,
  ShoppingCart,
  BarChart3,
  Settings,
  LogOut,
  Shield,
  Building2
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { userData, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const vendedorLinks = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/clientes', icon: Users, label: 'Clientes' },
    { to: '/pipeline', icon: TrendingUp, label: 'Pipeline de Ventas' },
    { to: '/reuniones', icon: Calendar, label: 'Reuniones' },
    { to: '/tickets', icon: Ticket, label: 'Tickets' },
    { to: '/pedidos', icon: ShoppingCart, label: 'Pedidos' },
    { to: '/analitica', icon: BarChart3, label: 'Analítica' },
    { to: '/configuracion', icon: Settings, label: 'Configuración' },
  ];

  const adminLinks = [
    { to: '/admin', icon: Shield, label: 'Panel Admin' },
    { to: '/dashboard', icon: LayoutDashboard, label: 'Mi Dashboard' },
    { to: '/clientes', icon: Users, label: 'Clientes' },
    { to: '/pipeline', icon: TrendingUp, label: 'Pipeline de Ventas' },
    { to: '/reuniones', icon: Calendar, label: 'Reuniones' },
    { to: '/tickets', icon: Ticket, label: 'Tickets' },
    { to: '/pedidos', icon: ShoppingCart, label: 'Pedidos' },
    { to: '/analitica', icon: BarChart3, label: 'Analítica' },
    { to: '/configuracion', icon: Settings, label: 'Configuración' },
  ];

  const links = userData?.rol === 'admin' ? adminLinks : vendedorLinks;

  return (
    <div className="bg-white h-screen w-64 shadow-lg flex flex-col border-r border-gray-200">
      {/* Logo y título */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-xl">
            <Building2 className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">CRM Pro</h1>
            <p className="text-sm text-gray-500">Sistema de Ventas</p>
          </div>
        </div>
      </div>

      {/* Información del usuario */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full flex items-center justify-center">
            <span className="text-blue-600 font-semibold">
              {userData?.nombre?.charAt(0)}{userData?.apellido?.charAt(0)}
            </span>
          </div>
          <div>
            <p className="font-medium text-gray-900">
              {userData?.nombre} {userData?.apellido}
            </p>
            <p className="text-sm text-gray-500 capitalize">
              {userData?.rol}
            </p>
          </div>
        </div>
      </div>

      {/* Navegación */}
      <nav className="flex-1 p-4 space-y-2">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border-r-2 border-blue-700 shadow-sm'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`
            }
          >
            <link.icon className="h-5 w-5" />
            <span className="font-medium">{link.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Botón de cerrar sesión */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="flex items-center space-x-3 px-4 py-3 w-full text-left text-gray-600 hover:bg-red-50 hover:text-red-700 rounded-lg transition-all duration-200"
        >
          <LogOut className="h-5 w-5" />
          <span className="font-medium">Cerrar Sesión</span>
        </button>
      </div>
    </div>
  );
};