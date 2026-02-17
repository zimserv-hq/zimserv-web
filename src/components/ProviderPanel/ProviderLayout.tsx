// src/components/ProviderPanel/ProviderLayout.tsx
import { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation, Link } from "react-router-dom";
import {
  LayoutDashboard,
  Briefcase,
  MessageSquare,
  User,
  LogOut,
  Menu,
  ChevronDown,
  Bell,
  Settings,
  Search,
} from "lucide-react";

const ProviderLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [sidebarCollapsed] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".user-menu-wrapper")) {
        setShowUserMenu(false);
      }
    };

    if (showUserMenu) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [showUserMenu]);

  const handleLogout = () => {
    // TODO: Add confirmation modal
    // TODO: Clear provider auth state
    navigate("/provider/login");
  };

  const menuItems = [
    { label: "Dashboard", icon: LayoutDashboard, path: "/provider/dashboard" },
    { label: "Profile", icon: User, path: "/provider/profile" },
    {
      label: "Jobs",
      icon: Briefcase,
      path: "/provider/jobs",
      badge: "5",
    },
    {
      label: "Reviews",
      icon: MessageSquare,
      path: "/provider/reviews",
      badge: "12",
    },
  ];

  const isActive = (path: string) => {
    if (path === "/provider/dashboard") return location.pathname === path;
    return location.pathname.startsWith(path);
  };

  return (
    <>
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          margin: 0 !important;
          padding: 0 !important;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        .provider-layout {
          display: flex;
          min-height: 100vh;
          background: #f8f9fa;
        }

        /* ===== SIDEBAR ===== */
        .sidebar {
          width: 280px;
          background: #ffffff;
          border-right: 1px solid #e9ecef;
          display: flex;
          flex-direction: column;
          position: fixed;
          height: 100vh;
          left: 0;
          top: 0;
          z-index: 1000;
          box-shadow: 2px 0 8px rgba(0, 0, 0, 0.02);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .sidebar.collapsed {
          width: 80px;
        }

        /* Sidebar Header */
        .sidebar-header {
          padding: 24px 20px;
          border-bottom: 1px solid #e9ecef;
        }

        .sidebar-logo {
          display: flex;
          align-items: center;
          gap: 12px;
          transition: all 0.3s ease;
        }

        .logo-icon {
          width: 44px;
          height: 44px;
          background: linear-gradient(135deg, #FF6B35 0%, #E85A28 100%);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          font-weight: 700;
          font-size: 20px;
          box-shadow: 0 4px 12px rgba(255, 107, 53, 0.25);
          flex-shrink: 0;
        }

        .logo-text {
          display: flex;
          flex-direction: column;
          opacity: 1;
          transition: opacity 0.3s ease;
        }

        .sidebar.collapsed .logo-text {
          opacity: 0;
          display: none;
        }

        .logo-title {
          font-size: 20px;
          font-weight: 700;
          color: #1f2937;
          letter-spacing: -0.5px;
        }

        .logo-subtitle {
          font-size: 12px;
          color: #6b7280;
          font-weight: 500;
        }

        /* Sidebar Menu */
        .sidebar-menu {
          flex: 1;
          padding: 16px 12px;
          overflow-y: auto;
          overflow-x: hidden;
        }

        .sidebar-menu::-webkit-scrollbar {
          width: 6px;
        }

        .sidebar-menu::-webkit-scrollbar-track {
          background: transparent;
        }

        .sidebar-menu::-webkit-scrollbar-thumb {
          background: #e5e7eb;
          border-radius: 3px;
        }

        .sidebar-menu::-webkit-scrollbar-thumb:hover {
          background: #d1d5db;
        }

        .menu-section-title {
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: #9ca3af;
          padding: 16px 12px 8px;
          transition: opacity 0.3s ease;
        }

        .sidebar.collapsed .menu-section-title {
          opacity: 0;
          height: 0;
          padding: 0;
        }

        .menu-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          border-radius: 10px;
          color: #6b7280;
          font-size: 15px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          margin-bottom: 4px;
          text-decoration: none;
          position: relative;
          overflow: hidden;
        }

        .menu-item::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          height: 100%;
          width: 3px;
          background: #FF6B35;
          transform: scaleY(0);
          transition: transform 0.2s ease;
        }

        .menu-item:hover {
          background: #f9fafb;
          color: #1f2937;
          transform: translateX(2px);
        }

        .menu-item.active {
          background: linear-gradient(90deg, #FFF4ED 0%, #FFF9F5 100%);
          color: #FF6B35;
          font-weight: 600;
          box-shadow: 0 2px 8px rgba(255, 107, 53, 0.08);
        }

        .menu-item.active::before {
          transform: scaleY(1);
        }

        .menu-icon {
          flex-shrink: 0;
          width: 20px;
          height: 20px;
        }

        .menu-label {
          flex: 1;
          white-space: nowrap;
          opacity: 1;
          transition: opacity 0.3s ease;
        }

        .sidebar.collapsed .menu-label {
          opacity: 0;
          width: 0;
        }

        .menu-badge {
          background: #FF6B35;
          color: #fff;
          font-size: 11px;
          font-weight: 600;
          padding: 2px 6px;
          border-radius: 10px;
          min-width: 20px;
          text-align: center;
          transition: opacity 0.3s ease;
        }

        .sidebar.collapsed .menu-badge {
          opacity: 0;
          width: 0;
        }

        /* Sidebar Footer */
        .sidebar-footer {
          padding: 16px 12px;
          border-top: 1px solid #e9ecef;
        }

        .user-menu-wrapper {
          position: relative;
        }

        .user-profile-btn {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          border-radius: 10px;
          background: #f9fafb;
          border: 1px solid #e5e7eb;
          cursor: pointer;
          transition: all 0.2s ease;
          width: 100%;
        }

        .user-profile-btn:hover {
          background: #f3f4f6;
          border-color: #d1d5db;
        }

        .user-avatar {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          font-weight: 600;
          font-size: 14px;
          flex-shrink: 0;
        }

        .user-info {
          flex: 1;
          text-align: left;
          min-width: 0;
          transition: opacity 0.3s ease;
        }

        .sidebar.collapsed .user-info {
          opacity: 0;
          width: 0;
        }

        .user-name {
          font-size: 14px;
          font-weight: 600;
          color: #1f2937;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .user-role {
          font-size: 12px;
          color: #6b7280;
        }

        .user-menu-icon {
          flex-shrink: 0;
          color: #9ca3af;
          transition: transform 0.2s ease, opacity 0.3s ease;
        }

        .sidebar.collapsed .user-menu-icon {
          opacity: 0;
          width: 0;
        }

        .user-profile-btn:hover .user-menu-icon {
          transform: rotate(180deg);
        }

        .user-dropdown {
          position: absolute;
          bottom: 100%;
          left: 12px;
          right: 12px;
          margin-bottom: 8px;
          background: #fff;
          border: 1px solid #e5e7eb;
          border-radius: 10px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.12);
          padding: 6px;
          animation: slideUp 0.2s ease;
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .dropdown-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 12px;
          border-radius: 6px;
          font-size: 14px;
          color: #374151;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .dropdown-item:hover {
          background: #f9fafb;
          color: #FF6B35;
        }

        .dropdown-item.danger {
          color: #ef4444;
        }

        .dropdown-item.danger:hover {
          background: #FEE2E2;
        }

        .logout-btn {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          border-radius: 10px;
          color: #ef4444;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          background: none;
          border: none;
          width: 100%;
        }

        .logout-btn:hover {
          background: #FEE2E2;
        }

        /* ===== MAIN CONTENT ===== */
        .main-content {
          flex: 1;
          margin-left: 280px;
          min-height: 100vh;
          background: #f8f9fa;
          transition: margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .main-content.expanded {
          margin-left: 80px;
        }

        /* Top Bar */
        .top-bar {
          background: #ffffff;
          border-bottom: 1px solid #e9ecef;
          padding: 16px 28px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          position: sticky;
          top: 0;
          z-index: 100;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);
        }

        .top-bar-left {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .page-breadcrumb {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          color: #6b7280;
        }

        .breadcrumb-separator {
          color: #d1d5db;
        }

        .breadcrumb-current {
          color: #1f2937;
          font-weight: 600;
        }

        .top-bar-right {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .top-bar-icon-btn {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          border: 1px solid #e5e7eb;
          background: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
          position: relative;
        }

        .top-bar-icon-btn:hover {
          background: #f9fafb;
          border-color: #d1d5db;
        }

        .notification-badge {
          position: absolute;
          top: -4px;
          right: -4px;
          width: 18px;
          height: 18px;
          background: #ef4444;
          color: #fff;
          font-size: 10px;
          font-weight: 600;
          border-radius: 9px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid #fff;
        }

        /* Mobile Header */
        .mobile-header {
          display: none;
        }

        .mobile-overlay {
          display: none;
        }

        /* ===== RESPONSIVE ===== */
        @media (max-width: 1024px) {
          .top-bar {
            padding: 16px 20px;
          }
        }

        @media (max-width: 768px) {
          .sidebar {
            transform: translateX(-100%);
          }

          .sidebar.mobile-open {
            transform: translateX(0);
          }

          .sidebar.collapsed {
            width: 280px;
          }

          .main-content {
            margin-left: 0;
          }

          .main-content.expanded {
            margin-left: 0;
          }

          .top-bar {
            display: none;
          }

          .mobile-header {
            display: flex;
            position: sticky;
            top: 0;
            background: #fff;
            border-bottom: 1px solid #e9ecef;
            padding: 16px 20px;
            z-index: 90;
            align-items: center;
            justify-content: space-between;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
          }

          .mobile-menu-btn {
            background: none;
            border: none;
            cursor: pointer;
            padding: 8px;
            border-radius: 8px;
            display: flex;
            color: #374151;
            transition: background 0.2s ease;
          }

          .mobile-menu-btn:hover {
            background: #f3f4f6;
          }

          .mobile-overlay {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            z-index: 999;
            backdrop-filter: blur(4px);
            animation: fadeIn 0.2s ease;
          }

          .mobile-overlay.show {
            display: block;
          }

          @keyframes fadeIn {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }
        }
      `}</style>

      <div className="provider-layout">
        {/* Sidebar */}
        <aside
          className={`sidebar ${isMobileMenuOpen ? "mobile-open" : ""} ${sidebarCollapsed ? "collapsed" : ""}`}
        >
          <div className="sidebar-header">
            <div className="sidebar-logo">
              <div className="logo-icon">Z</div>
              <div className="logo-text">
                <div className="logo-title">ZimServ</div>
                <div className="logo-subtitle">Provider Portal</div>
              </div>
            </div>
          </div>

          <nav className="sidebar-menu">
            <div className="menu-section-title">Main Menu</div>
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`menu-item ${isActive(item.path) ? "active" : ""}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <item.icon className="menu-icon" strokeWidth={2} />
                <span className="menu-label">{item.label}</span>
                {item.badge && <span className="menu-badge">{item.badge}</span>}
              </Link>
            ))}
          </nav>

          <div className="sidebar-footer">
            <div className="user-menu-wrapper">
              <button
                className="user-profile-btn"
                onClick={() => setShowUserMenu(!showUserMenu)}
              >
                <div className="user-avatar">PR</div>
                <div className="user-info">
                  <div className="user-name">Provider Name</div>
                  <div className="user-role">Service Provider</div>
                </div>
                <ChevronDown size={16} className="user-menu-icon" />
              </button>

              {showUserMenu && (
                <div className="user-dropdown">
                  <div
                    className="dropdown-item"
                    onClick={() => navigate("/provider/profile")}
                  >
                    <User size={16} />
                    My Profile
                  </div>
                  <div className="dropdown-item">
                    <Settings size={16} />
                    Settings
                  </div>
                  <div className="dropdown-item danger" onClick={handleLogout}>
                    <LogOut size={16} />
                    Logout
                  </div>
                </div>
              )}
            </div>
          </div>
        </aside>

        {/* Mobile overlay */}
        <div
          className={`mobile-overlay ${isMobileMenuOpen ? "show" : ""}`}
          onClick={() => setIsMobileMenuOpen(false)}
        />

        {/* Main content */}
        <main className={`main-content ${sidebarCollapsed ? "expanded" : ""}`}>
          {/* Desktop Top Bar */}
          <div className="top-bar">
            <div className="top-bar-left">
              <div className="page-breadcrumb">
                <span>Provider</span>
                <span className="breadcrumb-separator">/</span>
                <span className="breadcrumb-current">
                  {menuItems.find((item) => isActive(item.path))?.label ||
                    "Dashboard"}
                </span>
              </div>
            </div>
            <div className="top-bar-right">
              <button className="top-bar-icon-btn">
                <Search size={18} strokeWidth={2} />
              </button>
              <button className="top-bar-icon-btn">
                <Bell size={18} strokeWidth={2} />
                <span className="notification-badge">3</span>
              </button>
              <button className="top-bar-icon-btn">
                <Settings size={18} strokeWidth={2} />
              </button>
            </div>
          </div>

          {/* Mobile Header */}
          <div className="mobile-header">
            <button
              className="mobile-menu-btn"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu size={24} strokeWidth={2} />
            </button>
            <div className="sidebar-logo">
              <div className="logo-icon">Z</div>
              <div className="logo-text">
                <div className="logo-title">ZimServ</div>
              </div>
            </div>
            <button className="mobile-menu-btn">
              <Bell size={20} strokeWidth={2} />
            </button>
          </div>

          <Outlet />
        </main>
      </div>
    </>
  );
};

export default ProviderLayout;
