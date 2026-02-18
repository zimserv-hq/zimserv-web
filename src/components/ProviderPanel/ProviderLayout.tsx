// src/components/ProviderPanel/ProviderLayout.tsx
import { useState, useEffect, useRef } from "react";
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
  ChevronsLeft,
  ChevronsRight,
  Moon,
  Sun,
  HelpCircle,
  Star,
  AlertCircle,
} from "lucide-react";
import { useDarkMode } from "../../contexts/DarkModeContext";
import { supabase } from "../../lib/supabaseClient";

const ProviderLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [, setSearchFocused] = useState(false);

  const [currentUser, setCurrentUser] = useState<any>(null);
  const [providerData, setProviderData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [unreadReviewsCount, setUnreadReviewsCount] = useState(0);
  const [activeJobsCount, setActiveJobsCount] = useState(0);
  const [notifications, setNotifications] = useState<any[]>([]);

  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const layoutRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  useEffect(() => {
    if (currentUser) {
      fetchProviderData();
      fetchCounts();
    }
  }, [currentUser]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (layoutRef.current && !layoutRef.current.contains(e.target as Node))
        return;
      const target = e.target as HTMLElement;
      if (!target.closest(".notification-wrapper")) setShowNotifications(false);
      if (!target.closest(".user-menu-wrapper")) setShowUserMenu(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchCurrentUser = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        navigate("/provider/login");
        return;
      }
      setCurrentUser(user);
    } catch {
      navigate("/provider/login");
    } finally {
      setLoading(false);
    }
  };

  const fetchProviderData = async () => {
    if (!currentUser?.email) return;
    const { data } = await supabase
      .from("providers")
      .select("id, full_name, business_name, status")
      .eq("email", currentUser.email)
      .single();
    if (data) setProviderData(data);
  };

  const fetchCounts = async () => {
    if (!currentUser?.email) return;
    const { data: provider } = await supabase
      .from("providers")
      .select("id")
      .eq("email", currentUser.email)
      .single();
    if (!provider) return;

    const [{ count: reviewCount }, { count: jobCount }] = await Promise.all([
      supabase
        .from("reviews")
        .select("*", { count: "exact", head: true })
        .eq("provider_id", provider.id)
        .is("provider_reply", null),
      supabase
        .from("provider_jobs")
        .select("*", { count: "exact", head: true })
        .eq("provider_id", provider.id)
        .in("status", ["pending", "in_progress"]),
    ]);

    setUnreadReviewsCount(reviewCount || 0);
    setActiveJobsCount(jobCount || 0);

    const notifs: any[] = [];
    if ((reviewCount || 0) > 0) {
      notifs.push({
        id: "reviews",
        title: "Pending Reviews",
        message: `You have ${reviewCount} review${reviewCount === 1 ? "" : "s"} awaiting your response`,
        icon: Star,
        link: "/provider/reviews",
        time: "Now",
        unread: true,
      });
    }
    if ((jobCount || 0) > 0) {
      notifs.push({
        id: "jobs",
        title: "Active Jobs",
        message: `You have ${jobCount} active job${jobCount === 1 ? "" : "s"} in progress`,
        icon: AlertCircle,
        link: "/provider/jobs",
        time: "Now",
        unread: true,
      });
    }
    setNotifications(notifs);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/provider/login");
  };

  const userName =
    providerData?.full_name ||
    currentUser?.user_metadata?.full_name ||
    "Provider";
  const userInitials = userName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
  const unreadCount = notifications.filter((n) => n.unread).length;

  const menuItems: {
    label: string;
    icon: any;
    path: string;
    badge?: number;
    badgeType?: string;
  }[] = [
    { label: "Dashboard", icon: LayoutDashboard, path: "/provider/dashboard" },
    { label: "My Profile", icon: User, path: "/provider/profile" },
    {
      label: "Jobs",
      icon: Briefcase,
      path: "/provider/jobs",
      badge: activeJobsCount,
      badgeType: "warning",
    },
    {
      label: "Reviews",
      icon: MessageSquare,
      path: "/provider/reviews",
      badge: unreadReviewsCount,
      badgeType: "info",
    },
  ];

  const isActive = (path: string) => {
    if (path === "/provider/dashboard") return location.pathname === path;
    return location.pathname.startsWith(path);
  };

  const getCurrentPageTitle = () => {
    const item = menuItems.find((m) => isActive(m.path));
    return item?.label || "Provider Portal";
  };

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          background: "var(--bg-primary)",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              width: "48px",
              height: "48px",
              border: "4px solid #e5e7eb",
              borderTopColor: "#FF6B35",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
              margin: "0 auto 16px",
            }}
          />
          <p style={{ color: "var(--text-secondary)" }}>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }

        body {
          margin: 0 !important;
          padding: 0 !important;
          font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        .provider-layout {
          display: flex;
          min-height: 100vh;
          background: var(--bg-primary);
        }

        @keyframes spin { to { transform: rotate(360deg); } }

        /* ===== CSS VARIABLES ===== */
        :root {
          --bg-primary: #f8f9fa;
          --bg-secondary: #ffffff;
          --text-primary: #1f2937;
          --text-secondary: #6b7280;
          --text-tertiary: #9ca3af;
          --border-color: #e5e7eb;
          --border-hover: #d1d5db;
          --card-bg: #ffffff;
          --card-shadow: rgba(0,0,0,0.08);
          --sidebar-bg: #ffffff;
          --topbar-bg: rgba(255, 255, 255, 0.95);
          --hover-bg: #f9fafb;
          --menu-hover: linear-gradient(90deg, #f9fafb 0%, #ffffff 100%);
          --menu-active: linear-gradient(135deg, #FFF4ED 0%, #FFF9F5 100%);
          --footer-bg: linear-gradient(180deg, transparent 0%, #fafafa 100%);
          --dropdown-bg: #ffffff;
          --search-bg: #f9fafb;
          --input-bg: #f9fafb;
          --input-border: #e5e7eb;
          --orange-primary: #FF6B35;
          --orange-hover: #E85A28;
          --orange-light: #FFF4ED;
          --orange-light-bg: #FFF4ED;
          --orange-shadow: rgba(255,107,53,0.15);
          --filter-bg: #f3f4f6;
          --filter-active-bg: #ffffff;
          --filter-hover-bg: rgba(255,107,53,0.08);
          --chip-bg: #f3f4f6;
          --disabled-bg: #f3f4f6;
          --section-title: #9ca3af;
          --main-bg: #f8f9fa;
          --topbar-border: #e5e7eb;
          --sidebar-border: #e5e7eb;
        }

        .dark-mode {
          --bg-primary: #111827;
          --bg-secondary: #1f2937;
          --text-primary: #f9fafb;
          --text-secondary: #d1d5db;
          --text-tertiary: #9ca3af;
          --border-color: #374151;
          --border-hover: #4b5563;
          --card-bg: #1f2937;
          --card-shadow: rgba(0,0,0,0.5);
          --sidebar-bg: #1f2937;
          --topbar-bg: rgba(31, 41, 55, 0.95);
          --hover-bg: #374151;
          --menu-hover: linear-gradient(90deg, #374151 0%, #1f2937 100%);
          --menu-active: linear-gradient(135deg, rgba(255,107,53,0.15) 0%, rgba(255,107,53,0.1) 100%);
          --footer-bg: linear-gradient(180deg, transparent 0%, #1a1f2e 100%);
          --dropdown-bg: #1f2937;
          --search-bg: #374151;
          --input-bg: #111827;
          --input-border: #374151;
          --orange-primary: #FF8A5B;
          --orange-hover: #FF6B35;
          --orange-light: rgba(255,107,53,0.15);
          --orange-light-bg: rgba(255,107,53,0.15);
          --orange-shadow: rgba(255,138,91,0.25);
          --filter-bg: #1f2937;
          --filter-active-bg: #111827;
          --filter-hover-bg: rgba(255,138,91,0.12);
          --chip-bg: #374151;
          --disabled-bg: #1f2937;
          --section-title: #6b7280;
          --main-bg: #111827;
          --topbar-border: #374151;
          --sidebar-border: #374151;
        }

        /* ===== SIDEBAR ===== */
        .sidebar {
          width: 280px;
          background: var(--sidebar-bg);
          border-right: 1px solid var(--border-color);
          display: flex;
          flex-direction: column;
          position: fixed;
          height: 100vh;
          left: 0;
          top: 0;
          z-index: 1000;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .sidebar.collapsed { width: 80px; }

        .sidebar-header {
          padding: 20px;
          border-bottom: 1px solid var(--border-color);
          position: relative;
        }

        .sidebar-logo {
          display: flex;
          align-items: center;
          gap: 12px;
          transition: all 0.3s ease;
        }

        .logo-icon {
          width: 48px;
          height: 48px;
          background: linear-gradient(135deg, var(--orange-primary) 0%, var(--orange-hover) 100%);
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          font-weight: 800;
          font-size: 22px;
          letter-spacing: -0.5px;
          box-shadow: 0 4px 16px rgba(255, 107, 53, 0.3);
          flex-shrink: 0;
          position: relative;
          overflow: hidden;
        }

        .logo-icon::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%);
          animation: shimmer 3s infinite;
        }

        @keyframes shimmer {
          0%, 100% { transform: translate(-50%, -50%) rotate(0deg); }
          50% { transform: translate(-50%, -50%) rotate(180deg); }
        }

        .logo-text {
          display: flex;
          flex-direction: column;
          opacity: 1;
          transition: opacity 0.3s ease;
        }

        .sidebar.collapsed .logo-text { opacity: 0; width: 0; overflow: hidden; }

        .logo-title {
          font-size: 22px;
          font-weight: 800;
          color: var(--text-primary);
          letter-spacing: -0.8px;
        }

        .logo-subtitle {
          font-size: 11px;
          color: var(--text-tertiary);
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-top: 2px;
        }

        .collapse-btn {
          position: absolute;
          right: -12px;
          top: 50%;
          transform: translateY(-50%);
          width: 24px;
          height: 24px;
          background: var(--card-bg);
          border: 1px solid var(--border-color);
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
          color: var(--text-secondary);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        }

        .collapse-btn:hover {
          background: var(--orange-primary);
          border-color: var(--orange-primary);
          color: #fff;
          box-shadow: 0 4px 12px rgba(255, 107, 53, 0.25);
        }

        /* Sidebar Menu */
        .sidebar-menu {
          flex: 1;
          padding: 12px;
          overflow-y: auto;
          overflow-x: hidden;
        }

        .sidebar-menu::-webkit-scrollbar { width: 6px; }
        .sidebar-menu::-webkit-scrollbar-track { background: transparent; }
        .sidebar-menu::-webkit-scrollbar-thumb { background: var(--border-color); border-radius: 3px; }
        .sidebar-menu::-webkit-scrollbar-thumb:hover { background: var(--border-hover); }

        .menu-section { margin-bottom: 24px; }

        .menu-section-title {
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.8px;
          color: var(--text-tertiary);
          padding: 8px 12px;
          transition: all 0.3s ease;
        }

        .sidebar.collapsed .menu-section-title { opacity: 0; height: 0; padding: 0; margin: 0; }

        .menu-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 14px;
          border-radius: 10px;
          color: var(--text-secondary);
          font-size: 15px;
          font-weight: 600;
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
          width: 4px;
          background: linear-gradient(180deg, var(--orange-primary) 0%, var(--orange-hover) 100%);
          transform: scaleY(0);
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          border-radius: 0 4px 4px 0;
        }

        .menu-item:hover {
          background: var(--menu-hover);
          color: var(--text-primary);
          transform: translateX(4px);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
        }

        .menu-item.active {
          background: var(--menu-active);
          color: var(--orange-primary);
          box-shadow: 0 4px 12px rgba(255, 107, 53, 0.12);
          transform: translateX(4px);
        }

        .menu-item.active::before { transform: scaleY(1); }

        .menu-icon {
          flex-shrink: 0;
          width: 20px;
          height: 20px;
          transition: transform 0.2s ease;
        }

        .menu-item:hover .menu-icon,
        .menu-item.active .menu-icon { transform: scale(1.1); }

        .menu-label {
          flex: 1;
          white-space: nowrap;
          opacity: 1;
          transition: opacity 0.3s ease;
        }

        .sidebar.collapsed .menu-label { opacity: 0; width: 0; }

        .menu-badge {
          font-size: 11px;
          font-weight: 700;
          padding: 3px 8px;
          border-radius: 12px;
          min-width: 22px;
          text-align: center;
          transition: all 0.3s ease;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .menu-badge.warning {
          background: linear-gradient(135deg, #FFA500 0%, #FF8C00 100%);
          color: #fff;
        }

        .menu-badge.info {
          background: linear-gradient(135deg, #3B82F6 0%, #2563EB 100%);
          color: #fff;
        }

        .sidebar.collapsed .menu-badge { opacity: 0; width: 0; padding: 0; }

        /* Sidebar Footer */
        .sidebar-footer {
          padding: 12px;
          border-top: 1px solid var(--border-color);
          background: var(--footer-bg);
        }

        .sidebar-footer-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 14px;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 600;
          color: var(--text-secondary);
          cursor: pointer;
          transition: all 0.2s ease;
          margin-bottom: 6px;
        }

        .sidebar-footer-item:hover {
          background: var(--hover-bg);
          color: var(--text-primary);
        }

        .sidebar-footer-item:hover .theme-icon { transform: rotate(180deg); }
        .theme-icon { transition: transform 0.3s ease; }
        .sidebar.collapsed .sidebar-footer-item span { opacity: 0; width: 0; }

        .user-menu-wrapper { position: relative; }

        .user-profile-btn {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          border-radius: 12px;
          background: var(--card-bg);
          border: 1.5px solid var(--border-color);
          cursor: pointer;
          transition: all 0.2s ease;
          width: 100%;
        }

        .user-profile-btn:hover {
          background: var(--hover-bg);
          border-color: var(--orange-primary);
          box-shadow: 0 4px 16px rgba(255, 107, 53, 0.12);
        }

        .user-avatar {
          width: 40px;
          height: 40px;
          border-radius: 12px;
          background: linear-gradient(135deg, #FF6B35 0%, #E85A28 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          font-weight: 700;
          font-size: 15px;
          flex-shrink: 0;
          box-shadow: 0 4px 12px rgba(255, 107, 53, 0.3);
          position: relative;
        }

        .user-avatar::after {
          content: '';
          position: absolute;
          bottom: 0;
          right: 0;
          width: 12px;
          height: 12px;
          background: #10b981;
          border: 2px solid var(--card-bg);
          border-radius: 50%;
        }

        .user-info {
          flex: 1;
          text-align: left;
          min-width: 0;
          transition: opacity 0.3s ease;
        }

        .sidebar.collapsed .user-info { opacity: 0; width: 0; }

        .user-name {
          font-size: 14px;
          font-weight: 700;
          color: var(--text-primary);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .user-role {
          font-size: 12px;
          color: var(--text-tertiary);
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.3px;
        }

        .user-menu-icon {
          flex-shrink: 0;
          color: var(--text-tertiary);
          transition: all 0.2s ease;
        }

        .sidebar.collapsed .user-menu-icon { opacity: 0; width: 0; }

        .user-profile-btn:hover .user-menu-icon {
          transform: rotate(180deg);
          color: var(--orange-primary);
        }

        .user-dropdown {
          position: absolute;
          bottom: 100%;
          left: 0;
          right: 0;
          margin-bottom: 8px;
          background: var(--dropdown-bg);
          border: 1.5px solid var(--border-color);
          border-radius: 12px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
          padding: 8px;
          animation: slideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          z-index: 100;
        }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .dropdown-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 12px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          color: var(--text-primary);
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .dropdown-item:hover {
          background: linear-gradient(135deg, #FFF4ED 0%, #FFF9F5 100%);
          color: var(--orange-primary);
          transform: translateX(2px);
        }

        .dropdown-item.danger { color: #ef4444; }

        .dropdown-item.danger:hover {
          background: linear-gradient(135deg, #FEE2E2 0%, #FECACA 100%);
          color: #DC2626;
        }

        /* ===== MAIN CONTENT ===== */
        .main-content {
          flex: 1;
          margin-left: 280px;
          min-height: 100vh;
          background: var(--bg-primary);
          transition: margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .main-content.expanded { margin-left: 80px; }

        /* ===== TOP BAR ===== */
        .top-bar {
          background: var(--topbar-bg);
          border-bottom: 1px solid var(--border-color);
          padding: 16px 28px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          position: sticky;
          top: 0;
          z-index: 100;
          backdrop-filter: blur(10px);
        }

        .top-bar-left {
          display: flex;
          align-items: center;
          gap: 20px;
          flex: 1;
        }

        .page-title-section {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .page-title {
          font-size: 22px;
          font-weight: 800;
          color: var(--text-primary);
          letter-spacing: -0.5px;
        }

        .page-breadcrumb {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          color: var(--text-tertiary);
          font-weight: 500;
        }

        .breadcrumb-separator { color: var(--border-hover); }
        .breadcrumb-current { color: var(--orange-primary); font-weight: 600; }

        .search-bar {
          flex: 1;
          max-width: 400px;
          position: relative;
        }

        .search-input {
          width: 100%;
          padding: 10px 16px 10px 40px;
          border: 1.5px solid var(--border-color);
          border-radius: 10px;
          font-size: 14px;
          font-weight: 500;
          color: var(--text-primary);
          transition: all 0.2s ease;
          background: var(--search-bg);
          outline: none;
          font-family: inherit;
        }

        .search-input:focus {
          border-color: var(--orange-primary);
          background: var(--card-bg);
          box-shadow: 0 0 0 3px rgba(255, 107, 53, 0.1);
        }

        .search-input::placeholder { color: var(--text-tertiary); }

        .search-icon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-tertiary);
          pointer-events: none;
          transition: color 0.2s ease;
        }

        .top-bar-right {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .top-bar-icon-btn {
          width: 42px;
          height: 42px;
          border-radius: 10px;
          border: 1.5px solid var(--border-color);
          background: var(--card-bg);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
          position: relative;
          color: var(--text-secondary);
        }

        .top-bar-icon-btn:hover {
          background: var(--hover-bg);
          border-color: var(--border-hover);
          color: var(--text-primary);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        }

        .top-bar-icon-btn.active {
          background: linear-gradient(135deg, #FFF4ED 0%, #FFF9F5 100%);
          border-color: var(--orange-primary);
          color: var(--orange-primary);
        }

        .notification-badge {
          position: absolute;
          top: -4px;
          right: -4px;
          min-width: 20px;
          height: 20px;
          background: linear-gradient(135deg, #ef4444 0%, #DC2626 100%);
          color: #fff;
          font-size: 10px;
          font-weight: 700;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid var(--card-bg);
          padding: 0 5px;
          box-shadow: 0 2px 8px rgba(239, 68, 68, 0.4);
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }

        /* Notification Dropdown */
        .notification-wrapper { position: relative; }

        .notification-dropdown {
          position: absolute;
          top: calc(100% + 12px);
          right: 0;
          width: 380px;
          background: var(--dropdown-bg);
          border: 1.5px solid var(--border-color);
          border-radius: 12px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
          animation: slideDown 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          overflow: hidden;
          z-index: 200;
        }

        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .notification-header {
          padding: 16px 20px;
          border-bottom: 1px solid var(--border-color);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .notification-title { font-size: 16px; font-weight: 700; color: var(--text-primary); }

        .mark-read-btn {
          font-size: 12px;
          font-weight: 600;
          color: var(--orange-primary);
          background: none;
          border: none;
          cursor: pointer;
          padding: 4px 8px;
          border-radius: 6px;
          transition: all 0.2s ease;
        }

        .mark-read-btn:hover { background: #FFF4ED; }

        .notification-list { max-height: 400px; overflow-y: auto; }

        .notification-item {
          padding: 16px 20px;
          border-bottom: 1px solid var(--border-color);
          cursor: pointer;
          transition: all 0.2s ease;
          position: relative;
          display: flex;
          gap: 12px;
          align-items: flex-start;
        }

        .notification-icon {
          width: 36px;
          height: 36px;
          border-radius: 8px;
          background: var(--orange-light-bg);
          color: var(--orange-primary);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .notification-content { flex: 1; min-width: 0; }

        .notification-item::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          height: 100%;
          width: 4px;
          background: var(--orange-primary);
          opacity: 0;
          transition: opacity 0.2s ease;
        }

        .notification-item:hover { background: var(--hover-bg); }
        .notification-item:hover::before { opacity: 1; }
        .notification-item.unread { background: rgba(255, 107, 53, 0.05); }

        .notification-item-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 4px;
        }

        .notification-item-title {
          font-size: 14px;
          font-weight: 700;
          color: var(--text-primary);
          flex: 1;
        }

        .notification-item-time {
          font-size: 12px;
          color: var(--text-tertiary);
          font-weight: 500;
          white-space: nowrap;
          margin-left: 8px;
        }

        .notification-item-message { font-size: 13px; color: var(--text-secondary); line-height: 1.5; }

        .notification-item.unread .notification-item-title::after {
          content: '';
          display: inline-block;
          width: 6px;
          height: 6px;
          background: var(--orange-primary);
          border-radius: 50%;
          margin-left: 6px;
        }

        .notification-footer { padding: 12px 20px; text-align: center; border-top: 1px solid var(--border-color); }

        .view-all-btn {
          font-size: 13px;
          font-weight: 600;
          color: var(--orange-primary);
          background: none;
          border: none;
          cursor: pointer;
          padding: 6px 12px;
          border-radius: 6px;
          transition: all 0.2s ease;
        }

        .view-all-btn:hover { background: #FFF4ED; }

        .notification-empty { padding: 40px 20px; text-align: center; color: var(--text-tertiary); }

        /* Mobile */
        .mobile-header { display: none; }
        .mobile-overlay { display: none; }

        .mobile-menu-btn {
          background: none;
          border: none;
          cursor: pointer;
          padding: 8px;
          border-radius: 8px;
          display: flex;
          color: var(--text-primary);
          transition: all 0.2s ease;
        }

        .mobile-menu-btn:hover { background: var(--hover-bg); }

        .mobile-header-left { display: flex; align-items: center; gap: 12px; }
        .mobile-header-right { display: flex; align-items: center; gap: 8px; }

        .mobile-icon-btn {
          width: 36px;
          height: 36px;
          border-radius: 8px;
          background: none;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: var(--text-secondary);
          position: relative;
          transition: all 0.2s ease;
        }

        .mobile-icon-btn:hover { background: var(--hover-bg); color: var(--text-primary); }

        /* ===== RESPONSIVE ===== */
        @media (max-width: 1024px) {
          .top-bar { padding: 16px 20px; }
          .search-bar { max-width: 300px; }
          .notification-dropdown { width: 340px; }
        }

        @media (max-width: 768px) {
          .sidebar { transform: translateX(-100%); box-shadow: none; }
          .sidebar.mobile-open { transform: translateX(0); box-shadow: 20px 0 60px rgba(0,0,0,0.3); }
          .sidebar.collapsed { width: 280px; }
          .collapse-btn { display: none; }
          .main-content { margin-left: 0; }
          .main-content.expanded { margin-left: 0; }
          .top-bar { display: none; }

          .mobile-header {
            display: flex;
            position: sticky;
            top: 0;
            background: var(--topbar-bg);
            border-bottom: 1px solid var(--border-color);
            padding: 16px 20px;
            z-index: 90;
            align-items: center;
            justify-content: space-between;
            backdrop-filter: blur(10px);
          }

          .mobile-overlay {
            display: none;
            position: fixed;
            inset: 0;
            background: rgba(0,0,0,0.6);
            z-index: 999;
            backdrop-filter: blur(4px);
          }

          .mobile-overlay.show { display: block; }

          .notification-dropdown {
            position: fixed;
            right: 16px;
            width: calc(100% - 32px);
            max-width: 380px;
          }
        }

        @media (max-width: 480px) {
          .logo-icon { width: 42px; height: 42px; font-size: 18px; }
          .logo-title { font-size: 18px; }
          .notification-dropdown { max-width: 100%; }
        }
      `}</style>

      <div
        className={`provider-layout ${isDarkMode ? "dark-mode" : ""}`}
        ref={layoutRef}
      >
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
            <button
              className="collapse-btn"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {sidebarCollapsed ? (
                <ChevronsRight size={14} strokeWidth={2.5} />
              ) : (
                <ChevronsLeft size={14} strokeWidth={2.5} />
              )}
            </button>
          </div>

          <nav className="sidebar-menu">
            <div className="menu-section">
              <div className="menu-section-title">Main Menu</div>
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`menu-item ${isActive(item.path) ? "active" : ""}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                  title={item.label}
                >
                  <item.icon className="menu-icon" strokeWidth={2.5} />
                  <span className="menu-label">{item.label}</span>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className={`menu-badge ${item.badgeType || "info"}`}>
                      {item.badge}
                    </span>
                  )}
                </Link>
              ))}
            </div>
          </nav>

          <div className="sidebar-footer">
            <div
              className="sidebar-footer-item"
              onClick={toggleDarkMode}
              title={
                isDarkMode ? "Switch to light mode" : "Switch to dark mode"
              }
            >
              {isDarkMode ? (
                <Sun size={18} strokeWidth={2} className="theme-icon" />
              ) : (
                <Moon size={18} strokeWidth={2} className="theme-icon" />
              )}
              <span>{isDarkMode ? "Light Mode" : "Dark Mode"}</span>
            </div>

            <div className="sidebar-footer-item">
              <HelpCircle size={18} strokeWidth={2} />
              <span>Help & Support</span>
            </div>

            <div className="user-menu-wrapper">
              <button
                className="user-profile-btn"
                onClick={() => setShowUserMenu(!showUserMenu)}
              >
                <div className="user-avatar">{userInitials}</div>
                <div className="user-info">
                  <div className="user-name" title={userName}>
                    {userName}
                  </div>
                  <div className="user-role">Provider</div>
                </div>
                <ChevronDown size={16} className="user-menu-icon" />
              </button>

              {showUserMenu && (
                <div className="user-dropdown">
                  <div
                    className="dropdown-item"
                    onClick={() => {
                      navigate("/provider/profile");
                      setShowUserMenu(false);
                    }}
                  >
                    <User size={16} strokeWidth={2.5} />
                    My Profile
                  </div>
                  <div className="dropdown-item">
                    <Settings size={16} strokeWidth={2.5} />
                    Settings
                  </div>
                  <div className="dropdown-item danger" onClick={handleLogout}>
                    <LogOut size={16} strokeWidth={2.5} />
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
              <div className="page-title-section">
                <div className="page-title">{getCurrentPageTitle()}</div>
                <div className="page-breadcrumb">
                  <span>Provider</span>
                  <span className="breadcrumb-separator">/</span>
                  <span className="breadcrumb-current">
                    {getCurrentPageTitle()}
                  </span>
                </div>
              </div>

              <div className="search-bar">
                <input
                  type="text"
                  className="search-input"
                  placeholder="Search anything..."
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                />
                <Search size={18} strokeWidth={2.5} className="search-icon" />
              </div>
            </div>

            <div className="top-bar-right">
              <div className="notification-wrapper">
                <button
                  className={`top-bar-icon-btn ${showNotifications ? "active" : ""}`}
                  onClick={() => setShowNotifications(!showNotifications)}
                  title="Notifications"
                >
                  <Bell size={18} strokeWidth={2.5} />
                  {unreadCount > 0 && (
                    <span className="notification-badge">{unreadCount}</span>
                  )}
                </button>

                {showNotifications && (
                  <div className="notification-dropdown">
                    <div className="notification-header">
                      <div className="notification-title">Notifications</div>
                      <button className="mark-read-btn">Mark all read</button>
                    </div>
                    <div className="notification-list">
                      {notifications.length > 0 ? (
                        notifications.map((notif) => (
                          <div
                            key={notif.id}
                            className={`notification-item ${notif.unread ? "unread" : ""}`}
                            onClick={() => {
                              navigate(notif.link);
                              setShowNotifications(false);
                            }}
                          >
                            <div className="notification-icon">
                              <notif.icon size={18} strokeWidth={2.5} />
                            </div>
                            <div className="notification-content">
                              <div className="notification-item-header">
                                <div className="notification-item-title">
                                  {notif.title}
                                </div>
                                <div className="notification-item-time">
                                  {notif.time}
                                </div>
                              </div>
                              <div className="notification-item-message">
                                {notif.message}
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="notification-empty">
                          <p>No new notifications</p>
                        </div>
                      )}
                    </div>
                    <div className="notification-footer">
                      <button className="view-all-btn">
                        View all notifications
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <button className="top-bar-icon-btn" title="Settings">
                <Settings size={18} strokeWidth={2.5} />
              </button>
            </div>
          </div>

          {/* Mobile Header */}
          <div className="mobile-header">
            <div className="mobile-header-left">
              <button
                className="mobile-menu-btn"
                onClick={() => setIsMobileMenuOpen(true)}
              >
                <Menu size={24} strokeWidth={2.5} />
              </button>
              <div className="sidebar-logo">
                <div className="logo-icon">Z</div>
                <div className="logo-text">
                  <div className="logo-title">ZimServ</div>
                </div>
              </div>
            </div>
            <div className="mobile-header-right">
              <button
                className="mobile-icon-btn"
                onClick={toggleDarkMode}
                title={isDarkMode ? "Light mode" : "Dark mode"}
              >
                {isDarkMode ? (
                  <Sun size={20} strokeWidth={2.5} />
                ) : (
                  <Moon size={20} strokeWidth={2.5} />
                )}
              </button>
              <div className="notification-wrapper">
                <button
                  className="mobile-icon-btn"
                  onClick={() => setShowNotifications(!showNotifications)}
                >
                  <Bell size={20} strokeWidth={2.5} />
                  {unreadCount > 0 && (
                    <span className="notification-badge">{unreadCount}</span>
                  )}
                </button>
                {showNotifications && (
                  <div className="notification-dropdown">
                    <div className="notification-header">
                      <div className="notification-title">Notifications</div>
                      <button className="mark-read-btn">Mark all read</button>
                    </div>
                    <div className="notification-list">
                      {notifications.length > 0 ? (
                        notifications.map((notif) => (
                          <div
                            key={notif.id}
                            className={`notification-item ${notif.unread ? "unread" : ""}`}
                            onClick={() => {
                              navigate(notif.link);
                              setShowNotifications(false);
                            }}
                          >
                            <div className="notification-icon">
                              <notif.icon size={18} strokeWidth={2.5} />
                            </div>
                            <div className="notification-content">
                              <div className="notification-item-header">
                                <div className="notification-item-title">
                                  {notif.title}
                                </div>
                                <div className="notification-item-time">
                                  {notif.time}
                                </div>
                              </div>
                              <div className="notification-item-message">
                                {notif.message}
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="notification-empty">
                          <p>No new notifications</p>
                        </div>
                      )}
                    </div>
                    <div className="notification-footer">
                      <button className="view-all-btn">
                        View all notifications
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <Outlet />
        </main>
      </div>
    </>
  );
};

export default ProviderLayout;
