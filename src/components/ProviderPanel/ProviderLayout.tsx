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
  X,
  Clock,
  CheckCircle2,
  Globe,
  MapPin,
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
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  const [currentUser, setCurrentUser] = useState<any>(null);
  const [providerData, setProviderData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [unreadReviewsCount, setUnreadReviewsCount] = useState(0);
  const [activeJobsCount, setActiveJobsCount] = useState(0);
  const [notifications, setNotifications] = useState<any[]>([]);

  // ── Coverage modal state ──────────────────────────────────────────────────
  const [showCoverageModal, setShowCoverageModal] = useState(false);
  const [isSavingCoverage, setIsSavingCoverage] = useState(false);

  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const layoutRef = useRef<HTMLDivElement>(null);

  // Live clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  useEffect(() => {
    if (currentUser) {
      fetchProviderData();
      fetchCounts();
    }
  }, [currentUser]);

  // ── Realtime: listen for changes to jobs, reviews, and provider data ─────────
  useEffect(() => {
    if (!providerData?.id) return;

    const channel = supabase
      .channel(`layout-realtime-${providerData.id}`)
      // Provider row updated (name, photo, status)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "providers",
          filter: `id=eq.${providerData.id}`,
        },
        (payload) => {
          setProviderData((prev: any) => ({
            ...prev,
            full_name: payload.new.full_name ?? prev.full_name,
            business_name: payload.new.business_name ?? prev.business_name,
            status: payload.new.status ?? prev.status,
            profile_image_url:
              payload.new.profile_image_url ?? prev.profile_image_url,
          }));
        },
      )
      // New review inserted → re-fetch counts
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "reviews",
          filter: `provider_id=eq.${providerData.id}`,
        },
        () => fetchCounts(),
      )
      // Review updated (provider replied) → re-fetch counts
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "reviews",
          filter: `provider_id=eq.${providerData.id}`,
        },
        () => fetchCounts(),
      )
      // Job inserted or updated → re-fetch counts
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "provider_jobs",
          filter: `provider_id=eq.${providerData.id}`,
        },
        () => fetchCounts(),
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [providerData?.id]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".notification-wrapper")) setShowNotifications(false);
      if (!target.closest(".user-menu-wrapper")) setShowUserMenu(false);
      if (!target.closest(".mobile-search-wrapper")) setShowMobileSearch(false);
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
    if (!currentUser?.id) return;
    const { data } = await supabase
      .from("providers")
      .select(
        "id, full_name, business_name, status, profile_image_url, works_nationwide",
      )
      .eq("user_id", currentUser.id)
      .single();
    if (data) {
      setProviderData(data);
      // Show coverage modal only if works_nationwide has never been set
      if (
        data.works_nationwide === null ||
        data.works_nationwide === undefined
      ) {
        setShowCoverageModal(true);
      }
    }
  };

  const fetchCounts = async () => {
    if (!currentUser?.id) return;
    const { data: provider } = await supabase
      .from("providers")
      .select("id")
      .eq("user_id", currentUser.id)
      .single();
    if (!provider) return;

    const { count: reviewCount } = await supabase
      .from("reviews")
      .select("*", { count: "exact", head: true })
      .eq("provider_id", provider.id)
      .is("provider_reply", null);

    let jobCount = 0;
    try {
      const { count, error } = await supabase
        .from("provider_jobs")
        .select("*", { count: "exact", head: true })
        .eq("provider_id", provider.id)
        .in("status", ["pending", "in_progress"]);
      if (!error) jobCount = count || 0;
    } catch {}

    setUnreadReviewsCount(reviewCount || 0);
    setActiveJobsCount(jobCount);

    const notifs: any[] = [];
    if ((reviewCount || 0) > 0) {
      notifs.push({
        id: "reviews",
        title: "Pending Reviews",
        message: `${reviewCount} review${reviewCount === 1 ? "" : "s"} awaiting your response`,
        icon: Star,
        link: "/provider/reviews",
        time: "Now",
        unread: true,
        type: "warning",
      });
    }
    if (jobCount > 0) {
      notifs.push({
        id: "jobs",
        title: "Active Jobs",
        message: `${jobCount} active job${jobCount === 1 ? "" : "s"} in progress`,
        icon: AlertCircle,
        link: "/provider/jobs",
        time: "Now",
        unread: true,
        type: "info",
      });
    }
    setNotifications(notifs);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/provider/login");
  };

  // ── Coverage modal handler ─────────────────────────────────────────────────
  const handleCoverageSelect = async (isNationwide: boolean) => {
    if (!providerData?.id) return;
    setIsSavingCoverage(true);
    await supabase
      .from("providers")
      .update({ works_nationwide: isNationwide })
      .eq("id", providerData.id);
    setProviderData((prev: any) => ({
      ...prev,
      works_nationwide: isNationwide,
    }));
    setIsSavingCoverage(false);
    setShowCoverageModal(false);
  };

  const businessName = providerData?.business_name || "";
  const fullName =
    providerData?.full_name ||
    currentUser?.user_metadata?.full_name ||
    "Provider";
  const profileImageUrl = providerData?.profile_image_url || null;

  const userInitials = fullName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const unreadCount = notifications.filter((n) => n.unread).length;

  // Format clock
  const formatTime = (d: Date) =>
    d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  const formatDate = (d: Date) =>
    d.toLocaleDateString([], {
      weekday: "short",
      month: "short",
      day: "numeric",
    });

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

  const AvatarImage = ({
    size,
    radius,
    fontSize,
    showOnline = true,
    onlineDotSize = 12,
  }: {
    size: number;
    radius: number;
    fontSize: number;
    showOnline?: boolean;
    onlineDotSize?: number;
  }) => (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: radius,
        overflow: "hidden",
        flexShrink: 0,
        position: "relative",
        background: profileImageUrl
          ? "transparent"
          : "linear-gradient(135deg, #FF6B35 0%, #E85A28 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#fff",
        fontWeight: 700,
        fontSize,
        boxShadow: "0 4px 12px rgba(255,107,53,0.25)",
      }}
    >
      {profileImageUrl ? (
        <img
          src={profileImageUrl}
          alt={fullName}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = "none";
          }}
        />
      ) : (
        userInitials
      )}
      {showOnline && (
        <span
          style={{
            position: "absolute",
            bottom: 0,
            right: 0,
            width: onlineDotSize,
            height: onlineDotSize,
            background: "#10b981",
            border: "2px solid var(--card-bg)",
            borderRadius: "50%",
          }}
        />
      )}
    </div>
  );

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
              width: 48,
              height: 48,
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
        body { margin: 0 !important; padding: 0 !important;
          font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
          -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }
        .provider-layout { display: flex; min-height: 100vh; background: var(--bg-primary); }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(-6px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideInRight { from { opacity: 0; transform: translateX(16px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes pulse { 0%,100% { transform: scale(1); } 50% { transform: scale(1.1); } }
        @keyframes coverageModalIn { from { opacity: 0; transform: translateY(16px) scale(0.97); } to { opacity: 1; transform: translateY(0) scale(1); } }

        :root {
          --bg-primary: #f8f9fa; --bg-secondary: #ffffff;
          --text-primary: #1f2937; --text-secondary: #6b7280;
          --text-tertiary: #9ca3af; --border-color: #e5e7eb;
          --border-hover: #d1d5db; --card-bg: #ffffff;
          --card-shadow: rgba(0,0,0,0.08); --sidebar-bg: #ffffff;
          --topbar-bg: rgba(255,255,255,0.95); --hover-bg: #f9fafb;
          --menu-hover: linear-gradient(90deg, #f9fafb 0%, #ffffff 100%);
          --menu-active: linear-gradient(135deg, #FFF4ED 0%, #FFF9F5 100%);
          --footer-bg: linear-gradient(180deg, transparent 0%, #fafafa 100%);
          --dropdown-bg: #ffffff; --search-bg: #f9fafb;
          --orange-primary: #FF6B35; --orange-hover: #E85A28;
          --orange-light: #FFF4ED; --orange-light-bg: #FFF4ED;
          --orange-shadow: rgba(255,107,53,0.15);
          --main-bg: #f8f9fa; --topbar-border: #e5e7eb; --sidebar-border: #e5e7eb;
          --stat-bg: rgba(255,107,53,0.06);
          --glass-bg: rgba(255,255,255,0.85);
          --mobile-header-h: 64px;
        }
        .dark-mode {
          --bg-primary: #111827; --bg-secondary: #1f2937;
          --text-primary: #f9fafb; --text-secondary: #d1d5db;
          --text-tertiary: #9ca3af; --border-color: #374151;
          --border-hover: #4b5563; --card-bg: #1f2937;
          --card-shadow: rgba(0,0,0,0.5); --sidebar-bg: #1f2937;
          --topbar-bg: rgba(31,41,55,0.97); --hover-bg: #374151;
          --menu-hover: linear-gradient(90deg, #374151 0%, #1f2937 100%);
          --menu-active: linear-gradient(135deg, rgba(255,107,53,0.15) 0%, rgba(255,107,53,0.1) 100%);
          --footer-bg: linear-gradient(180deg, transparent 0%, #1a1f2e 100%);
          --dropdown-bg: #1f2937; --search-bg: #374151;
          --orange-primary: #FF8A5B; --orange-hover: #FF6B35;
          --orange-light: rgba(255,107,53,0.15);
          --orange-light-bg: rgba(255,107,53,0.15);
          --orange-shadow: rgba(255,138,91,0.25);
          --main-bg: #111827; --topbar-border: #374151; --sidebar-border: #374151;
          --stat-bg: rgba(255,107,53,0.1);
          --glass-bg: rgba(31,41,55,0.9);
        }

        /* ===== SIDEBAR ===== */
        .sidebar {
          width: 280px; background: var(--sidebar-bg);
          border-right: 1px solid var(--border-color);
          display: flex; flex-direction: column;
          position: fixed; height: 100vh; left: 0; top: 0;
          z-index: 1000; transition: all 0.3s cubic-bezier(0.4,0,0.2,1);
        }
        .sidebar.collapsed { width: 80px; }
        .sidebar-header { padding: 18px; border-bottom: 1px solid var(--border-color); position: relative; }
        .sidebar-logo { display: flex; align-items: center; gap: 12px; transition: all 0.3s ease; }
        .logo-text { display: flex; flex-direction: column; opacity: 1; transition: opacity 0.3s ease; }
        .sidebar.collapsed .logo-text { opacity: 0; width: 0; overflow: hidden; }
        .logo-title { font-size: 22px; font-weight: 800; color: var(--text-primary); letter-spacing: -0.8px; }
        .logo-subtitle { font-size: 11px; color: var(--text-tertiary); font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin-top: 2px; }
        .collapse-btn {
          position: absolute; right: -12px; top: 50%; transform: translateY(-50%);
          width: 24px; height: 24px; background: var(--card-bg);
          border: 1px solid var(--border-color); border-radius: 6px;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; transition: all 0.2s ease; color: var(--text-secondary);
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        }
        .collapse-btn:hover { background: var(--orange-primary); border-color: var(--orange-primary); color: #fff; }
        .sidebar-menu { flex: 1; padding: 12px; overflow-y: auto; overflow-x: hidden; }
        .sidebar-menu::-webkit-scrollbar { width: 6px; }
        .sidebar-menu::-webkit-scrollbar-track { background: transparent; }
        .sidebar-menu::-webkit-scrollbar-thumb { background: var(--border-color); border-radius: 3px; }
        .menu-section { margin-bottom: 24px; }
        .menu-section-title { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; color: var(--text-tertiary); padding: 8px 12px; transition: all 0.3s ease; }
        .sidebar.collapsed .menu-section-title { opacity: 0; height: 0; padding: 0; margin: 0; }
        .menu-item {
          display: flex; align-items: center; gap: 12px; padding: 12px 14px; border-radius: 10px;
          color: var(--text-secondary); font-size: 15px; font-weight: 600;
          cursor: pointer; transition: all 0.2s cubic-bezier(0.4,0,0.2,1);
          margin-bottom: 4px; text-decoration: none; position: relative; overflow: hidden;
        }
        .menu-item::before {
          content: ''; position: absolute; left: 0; top: 0; height: 100%; width: 4px;
          background: linear-gradient(180deg, var(--orange-primary) 0%, var(--orange-hover) 100%);
          transform: scaleY(0); transition: transform 0.3s cubic-bezier(0.4,0,0.2,1);
          border-radius: 0 4px 4px 0;
        }
        .menu-item:hover { background: var(--menu-hover); color: var(--text-primary); transform: translateX(4px); }
        .menu-item.active { background: var(--menu-active); color: var(--orange-primary); box-shadow: 0 4px 12px rgba(255,107,53,0.12); transform: translateX(4px); }
        .menu-item.active::before { transform: scaleY(1); }
        .menu-icon { flex-shrink: 0; width: 20px; height: 20px; transition: transform 0.2s ease; }
        .menu-item:hover .menu-icon, .menu-item.active .menu-icon { transform: scale(1.1); }
        .menu-label { flex: 1; white-space: nowrap; opacity: 1; transition: opacity 0.3s ease; }
        .sidebar.collapsed .menu-label { opacity: 0; width: 0; }
        .menu-badge { font-size: 11px; font-weight: 700; padding: 3px 8px; border-radius: 12px; min-width: 22px; text-align: center; transition: all 0.3s ease; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .menu-badge.warning { background: linear-gradient(135deg, #FFA500 0%, #FF8C00 100%); color: #fff; }
        .menu-badge.info { background: linear-gradient(135deg, #3B82F6 0%, #2563EB 100%); color: #fff; }
        .sidebar.collapsed .menu-badge { opacity: 0; width: 0; padding: 0; }
        .sidebar-footer { padding: 12px; border-top: 1px solid var(--border-color); background: var(--footer-bg); }
        .sidebar-footer-item { display: flex; align-items: center; gap: 12px; padding: 10px 14px; border-radius: 10px; font-size: 14px; font-weight: 600; color: var(--text-secondary); cursor: pointer; transition: all 0.2s ease; margin-bottom: 6px; }
        .sidebar-footer-item:hover { background: var(--hover-bg); color: var(--text-primary); }
        .sidebar-footer-item:hover .theme-icon { transform: rotate(180deg); }
        .theme-icon { transition: transform 0.3s ease; }
        .sidebar.collapsed .sidebar-footer-item span { opacity: 0; width: 0; }
        .user-menu-wrapper { position: relative; }
        .user-profile-btn { display: flex; align-items: center; gap: 12px; padding: 12px; border-radius: 12px; background: var(--card-bg); border: 1.5px solid var(--border-color); cursor: pointer; transition: all 0.2s ease; width: 100%; }
        .user-profile-btn:hover { background: var(--hover-bg); border-color: var(--orange-primary); box-shadow: 0 4px 16px rgba(255,107,53,0.12); }
        .user-identity { flex: 1; text-align: left; min-width: 0; transition: opacity 0.3s ease; }
        .sidebar.collapsed .user-identity { opacity: 0; width: 0; }
        .user-biz-name { font-size: 13px; font-weight: 700; color: var(--text-primary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 148px; }
        .user-role-label { font-size: 11px; color: var(--orange-primary); font-weight: 600; text-transform: uppercase; letter-spacing: 0.4px; margin-top: 1px; }
        .user-menu-icon { flex-shrink: 0; color: var(--text-tertiary); transition: all 0.2s ease; }
        .sidebar.collapsed .user-menu-icon { opacity: 0; width: 0; }
        .user-profile-btn:hover .user-menu-icon { transform: rotate(180deg); color: var(--orange-primary); }
        .user-dropdown { position: absolute; bottom: 100%; left: 0; right: 0; margin-bottom: 8px; background: var(--dropdown-bg); border: 1.5px solid var(--border-color); border-radius: 12px; box-shadow: 0 20px 60px rgba(0,0,0,0.15); padding: 8px; animation: slideUp 0.3s cubic-bezier(0.4,0,0.2,1); z-index: 100; }
        .dropdown-identity { padding: 10px 12px 12px; border-bottom: 1px solid var(--border-color); margin-bottom: 6px; }
        .dropdown-biz { font-size: 14px; font-weight: 700; color: var(--text-primary); word-break: break-word; }
        .dropdown-sub { font-size: 11px; color: var(--text-tertiary); margin-top: 2px; font-weight: 500; }
        .dropdown-item { display: flex; align-items: center; gap: 12px; padding: 10px 12px; border-radius: 8px; font-size: 14px; font-weight: 600; color: var(--text-primary); cursor: pointer; transition: all 0.15s ease; }
        .dropdown-item:hover { background: linear-gradient(135deg,#FFF4ED 0%,#FFF9F5 100%); color: var(--orange-primary); transform: translateX(2px); }
        .dropdown-item.danger { color: #ef4444; }
        .dropdown-item.danger:hover { background: linear-gradient(135deg,#FEE2E2 0%,#FECACA 100%); color: #DC2626; }

        /* ===== MAIN ===== */
        .main-content { flex: 1; margin-left: 280px; min-height: 100vh; background: var(--bg-primary); transition: margin-left 0.3s cubic-bezier(0.4,0,0.2,1); }
        .main-content.expanded { margin-left: 80px; }

        /* ===== DESKTOP TOP BAR ===== */
        .top-bar { background: var(--topbar-bg); border-bottom: 1px solid var(--border-color); padding: 19px 28px; display: flex; justify-content: space-between; align-items: center; position: sticky; top: 0; z-index: 100; backdrop-filter: blur(10px); }
        .top-bar-left { display: flex; align-items: center; gap: 20px; flex: 1; }
        .topbar-identity { display: flex; align-items: center; gap: 10px; flex-shrink: 0; }
        .topbar-biz-badge { display: flex; align-items: center; gap: 8px; padding: 6px 14px 6px 8px; background: var(--card-bg); border: 1.5px solid var(--border-color); border-radius: 40px; cursor: pointer; transition: all 0.2s ease; box-shadow: 0 1px 4px rgba(0,0,0,0.04); }
        .topbar-biz-badge:hover { border-color: var(--orange-primary); box-shadow: 0 2px 12px rgba(255,107,53,0.12); }
        .topbar-biz-name { font-size: 14px; font-weight: 700; color: var(--text-primary); max-width: 200px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; letter-spacing: -0.2px; }
        .topbar-biz-role { font-size: 10px; font-weight: 700; color: var(--orange-primary); text-transform: uppercase; letter-spacing: 0.5px; background: var(--orange-light-bg); padding: 2px 7px; border-radius: 6px; }

        /* Desktop clock widget */
        .topbar-clock { display: flex; align-items: center; gap: 8px; padding: 6px 14px; background: var(--card-bg); border: 1.5px solid var(--border-color); border-radius: 40px; }
        .topbar-clock-time { font-size: 14px; font-weight: 700; color: var(--text-primary); font-variant-numeric: tabular-nums; letter-spacing: 0.3px; }
        .topbar-clock-date { font-size: 12px; color: var(--text-tertiary); font-weight: 600; }
        .search-bar { flex: 1; max-width: 400px; position: relative; }
        .search-input { width: 100%; padding: 10px 16px 10px 40px; border: 1.5px solid var(--border-color); border-radius: 10px; font-size: 14px; font-weight: 500; color: var(--text-primary); transition: all 0.2s ease; background: var(--search-bg); outline: none; font-family: inherit; }
        .search-input:focus { border-color: var(--orange-primary); background: var(--card-bg); box-shadow: 0 0 0 3px rgba(255,107,53,0.1); }
        .search-input::placeholder { color: var(--text-tertiary); }
        .search-icon { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: var(--text-tertiary); pointer-events: none; }
        .top-bar-right { display: flex; align-items: center; gap: 8px; }
        .top-bar-icon-btn { width: 42px; height: 42px; border-radius: 10px; border: 1.5px solid var(--border-color); background: var(--card-bg); display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s ease; position: relative; color: var(--text-secondary); }
        .top-bar-icon-btn:hover { background: var(--hover-bg); border-color: var(--border-hover); color: var(--text-primary); transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.08); }
        .top-bar-icon-btn.active { background: linear-gradient(135deg,#FFF4ED 0%,#FFF9F5 100%); border-color: var(--orange-primary); color: var(--orange-primary); }
        .notification-badge { position: absolute; top: -4px; right: -4px; min-width: 20px; height: 20px; background: linear-gradient(135deg,#ef4444 0%,#DC2626 100%); color: #fff; font-size: 10px; font-weight: 700; border-radius: 10px; display: flex; align-items: center; justify-content: center; border: 2px solid var(--card-bg); padding: 0 5px; box-shadow: 0 2px 8px rgba(239,68,68,0.4); }
        .notification-badge.pulsing { animation: pulse 2s infinite; }
        .notification-wrapper { position: relative; }
        .notification-dropdown { position: absolute; top: calc(100% + 12px); right: 0; width: 380px; background: var(--dropdown-bg); border: 1.5px solid var(--border-color); border-radius: 16px; box-shadow: 0 20px 60px rgba(0,0,0,0.15); animation: slideDown 0.3s cubic-bezier(0.4,0,0.2,1); overflow: hidden; z-index: 200; }
        .notification-header { padding: 16px 20px; border-bottom: 1px solid var(--border-color); display: flex; justify-content: space-between; align-items: center; }
        .notification-title { font-size: 16px; font-weight: 700; color: var(--text-primary); }
        .mark-read-btn { font-size: 12px; font-weight: 600; color: var(--orange-primary); background: none; border: none; cursor: pointer; padding: 4px 8px; border-radius: 6px; transition: all 0.2s ease; }
        .mark-read-btn:hover { background: #FFF4ED; }
        .notification-list { max-height: 400px; overflow-y: auto; }
        .notification-item { padding: 14px 20px; border-bottom: 1px solid var(--border-color); cursor: pointer; transition: all 0.2s ease; position: relative; display: flex; gap: 12px; align-items: flex-start; }
        .notification-icon { width: 38px; height: 38px; border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .notif-icon-warning { background: rgba(255,165,0,0.12); color: #FFA500; }
        .notif-icon-info { background: rgba(59,130,246,0.12); color: #3B82F6; }
        .notification-content { flex: 1; min-width: 0; }
        .notification-item::before { content: ''; position: absolute; left: 0; top: 0; height: 100%; width: 3px; opacity: 0; transition: opacity 0.2s ease; }
        .notif-warning::before { background: #FFA500; }
        .notif-info::before { background: #3B82F6; }
        .notification-item:hover { background: var(--hover-bg); }
        .notification-item:hover::before { opacity: 1; }
        .notification-item.unread { background: rgba(255,107,53,0.04); }
        .notification-item-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 3px; }
        .notification-item-title { font-size: 14px; font-weight: 700; color: var(--text-primary); flex: 1; }
        .notification-item-time { font-size: 11px; color: var(--text-tertiary); font-weight: 500; white-space: nowrap; margin-left: 8px; }
        .notification-item-message { font-size: 13px; color: var(--text-secondary); line-height: 1.5; }
        .notification-item.unread .notification-item-title::after { content: ''; display: inline-block; width: 6px; height: 6px; background: var(--orange-primary); border-radius: 50%; margin-left: 6px; vertical-align: middle; }
        .notification-footer { padding: 12px 20px; text-align: center; border-top: 1px solid var(--border-color); }
        .view-all-btn { font-size: 13px; font-weight: 600; color: var(--orange-primary); background: none; border: none; cursor: pointer; padding: 6px 12px; border-radius: 6px; transition: all 0.2s ease; }
        .view-all-btn:hover { background: #FFF4ED; }
        .notification-empty { padding: 36px 20px; text-align: center; color: var(--text-tertiary); font-size: 14px; }

        /* ===== MOBILE HEADER ===== */
        .mobile-header { display: none; }
        .mobile-overlay { display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.6); z-index: 999; backdrop-filter: blur(4px); }
        .mobile-overlay.show { display: block; }
        .mobile-menu-btn { width: 40px; height: 40px; background: var(--card-bg); border: 1.5px solid var(--border-color); border-radius: 10px; display: flex; align-items: center; justify-content: center; cursor: pointer; color: var(--text-primary); transition: all 0.2s ease; flex-shrink: 0; }
        .mobile-menu-btn:hover { border-color: var(--orange-primary); color: var(--orange-primary); }

        /* ===== TOP-TIER MOBILE HEADER ===== */
        .mobile-header {
          display: none;
          flex-direction: column;
          position: sticky; top: 0;
          background: var(--topbar-bg);
          border-bottom: 1px solid var(--border-color);
          z-index: 90; backdrop-filter: blur(20px) saturate(1.8);
          -webkit-backdrop-filter: blur(20px) saturate(1.8);
        }

        /* Row 1 — Primary nav bar */
        .mobile-header-primary {
          display: flex; align-items: center;
          padding: 10px 14px; gap: 10px; min-height: 60px;
        }

        /* Row 2 — Quick stat strip */
        .mobile-stat-strip {
          display: flex; align-items: center; gap: 0;
          border-top: 1px solid var(--border-color);
          overflow: hidden;
        }
        .mobile-stat-item {
          flex: 1; display: flex; align-items: center; gap: 7px;
          padding: 8px 14px; cursor: pointer;
          transition: background 0.15s ease; position: relative;
          border-right: 1px solid var(--border-color);
        }
        .mobile-stat-item:last-child { border-right: none; }
        .mobile-stat-item:active { background: var(--hover-bg); }
        .mobile-stat-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
        .mobile-stat-dot.orange { background: var(--orange-primary); box-shadow: 0 0 0 3px rgba(255,107,53,0.18); }
        .mobile-stat-dot.blue { background: #3B82F6; box-shadow: 0 0 0 3px rgba(59,130,246,0.18); }
        .mobile-stat-dot.green { background: #10b981; box-shadow: 0 0 0 3px rgba(16,185,129,0.18); }
        .mobile-stat-label { font-size: 11px; color: var(--text-tertiary); font-weight: 600; white-space: nowrap; }
        .mobile-stat-value { font-size: 13px; font-weight: 800; color: var(--text-primary); }

        /* Clock in strip */
        .mobile-clock-item {
          display: flex; align-items: center; gap: 6px;
          padding: 8px 14px;
          border-right: 1px solid var(--border-color);
        }
        .mobile-clock-time { font-size: 13px; font-weight: 800; color: var(--text-primary); font-variant-numeric: tabular-nums; }
        .mobile-clock-date { font-size: 10px; color: var(--text-tertiary); font-weight: 600; letter-spacing: 0.2px; margin-top: 1px; }

        /* Identity block */
        .mobile-identity { display: flex; align-items: center; gap: 9px; flex: 1; min-width: 0; }
        .mobile-biz-name { font-size: 15px; font-weight: 800; color: var(--text-primary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; letter-spacing: -0.3px; max-width: 140px; }
        .mobile-biz-sub { font-size: 10px; color: var(--orange-primary); font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; margin-top: 1px; }

        /* Mobile action buttons */
        .mobile-header-right { display: flex; align-items: center; gap: 6px; margin-left: auto; flex-shrink: 0; }
        .mobile-icon-btn { width: 38px; height: 38px; border-radius: 10px; background: var(--card-bg); border: 1.5px solid var(--border-color); display: flex; align-items: center; justify-content: center; cursor: pointer; color: var(--text-secondary); position: relative; transition: all 0.2s ease; flex-shrink: 0; }
        .mobile-icon-btn:hover { border-color: var(--border-hover); color: var(--text-primary); }
        .mobile-icon-btn.active { background: var(--orange-light-bg); border-color: var(--orange-primary); color: var(--orange-primary); }
        .mobile-icon-btn:active { transform: scale(0.93); }

        /* Mobile avatar */
        .mobile-avatar-btn { width: 38px; height: 38px; border-radius: 10px; border: 2px solid var(--border-color); overflow: hidden; cursor: pointer; transition: all 0.2s ease; flex-shrink: 0; position: relative; background: linear-gradient(135deg, #FF6B35 0%, #E85A28 100%); display: flex; align-items: center; justify-content: center; color: #fff; font-size: 13px; font-weight: 700; }
        .mobile-avatar-btn img { width: 100%; height: 100%; object-fit: cover; }
        .mobile-avatar-btn:hover { border-color: var(--orange-primary); box-shadow: 0 2px 10px rgba(255,107,53,0.25); }
        .mobile-avatar-btn:active { transform: scale(0.93); }
        .mobile-avatar-btn::after { content: ''; position: absolute; bottom: -1px; right: -1px; width: 10px; height: 10px; background: #10b981; border: 2px solid var(--topbar-bg); border-radius: 50%; }

        /* Mobile search overlay */
        .mobile-search-wrapper { position: relative; }
        .mobile-search-overlay {
          position: fixed; top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0,0,0,0.4); z-index: 500; backdrop-filter: blur(4px);
          animation: fadeIn 0.2s ease;
        }
        .mobile-search-box {
          position: fixed; top: 16px; left: 16px; right: 16px; z-index: 501;
          background: var(--card-bg); border-radius: 14px;
          border: 1.5px solid var(--orange-primary);
          box-shadow: 0 12px 40px rgba(0,0,0,0.2);
          display: flex; align-items: center; gap: 10px; padding: 0 16px;
          animation: slideDown 0.25s cubic-bezier(0.4,0,0.2,1);
        }
        .mobile-search-input { flex: 1; height: 52px; border: none; background: transparent; font-size: 16px; color: var(--text-primary); font-family: inherit; font-weight: 500; outline: none; }
        .mobile-search-input::placeholder { color: var(--text-tertiary); }
        .mobile-search-close { background: none; border: none; cursor: pointer; color: var(--text-tertiary); padding: 4px; display: flex; transition: color 0.15s; }
        .mobile-search-close:hover { color: var(--text-primary); }

        /* Mobile user dropdown */
        .mobile-user-dropdown { position: fixed; top: auto; right: 16px; width: 240px; background: var(--dropdown-bg); border: 1.5px solid var(--border-color); border-radius: 16px; box-shadow: 0 20px 60px rgba(0,0,0,0.2); padding: 8px; animation: slideDown 0.25s cubic-bezier(0.4,0,0.2,1); z-index: 300; overflow: hidden; }
        .mobile-dropdown-header { padding: 12px 12px 13px; border-bottom: 1px solid var(--border-color); margin-bottom: 6px; display: flex; align-items: center; gap: 10px; }
        .mobile-dropdown-biz { font-size: 13px; font-weight: 700; color: var(--text-primary); word-break: break-word; line-height: 1.3; }
        .mobile-dropdown-role { font-size: 10px; color: var(--orange-primary); font-weight: 700; text-transform: uppercase; letter-spacing: 0.4px; margin-top: 2px; }

        /* Status badge on mobile */
        .mobile-status-badge {
          display: inline-flex; align-items: center; gap: 5px;
          background: rgba(16,185,129,0.12); color: #059669;
          border-radius: 6px; padding: 2px 8px; font-size: 10px; font-weight: 700;
          text-transform: uppercase; letter-spacing: 0.4px;
        }
        .status-dot { width: 5px; height: 5px; border-radius: 50%; background: #10b981; }

        /* ===== COVERAGE MODAL ===== */
        .coverage-modal-backdrop {
          position: fixed; inset: 0;
          background: rgba(0,0,0,0.55);
          backdrop-filter: blur(4px);
          z-index: 9999;
          display: flex; align-items: center; justify-content: center;
          padding: 16px;
        }
        .coverage-modal {
          background: var(--card-bg);
          border-radius: 20px;
          border: 1.5px solid var(--border-color);
          box-shadow: 0 24px 64px rgba(0,0,0,0.18);
          padding: 32px 28px;
          max-width: 440px;
          width: 100%;
          animation: coverageModalIn 0.35s cubic-bezier(0.34,1.56,0.64,1);
        }
        .coverage-modal-icon {
          width: 52px; height: 52px; border-radius: 14px;
          background: var(--orange-light); color: var(--orange-primary);
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 16px;
        }
        .coverage-modal h2 {
          font-size: 20px; font-weight: 800; color: var(--text-primary);
          margin-bottom: 8px; letter-spacing: -0.4px; text-align: center;
        }
        .coverage-modal p {
          font-size: 14px; color: var(--text-secondary);
          line-height: 1.6; max-width: 320px; margin: 0 auto;
          text-align: center;
        }
        .coverage-options { display: flex; flex-direction: column; gap: 12px; margin-top: 24px; }
        .coverage-option {
          display: flex; align-items: center; gap: 14px;
          padding: 16px 18px; border-radius: 12px; cursor: pointer;
          border: 1.5px solid var(--border-color); background: var(--card-bg);
          text-align: left; width: 100%;
          transition: border-color 0.2s ease, background 0.2s ease, transform 0.15s ease;
          font-family: inherit;
        }
        .coverage-option:hover:not(:disabled) {
          border-color: var(--orange-primary);
          background: var(--orange-light);
          transform: translateY(-1px);
        }
        .coverage-option:active:not(:disabled) { transform: translateY(0); }
        .coverage-option:disabled { opacity: 0.55; cursor: not-allowed; }
        .coverage-option-icon {
          width: 40px; height: 40px; border-radius: 10px; flex-shrink: 0;
          background: rgba(255,107,53,0.1); color: var(--orange-primary);
          display: flex; align-items: center; justify-content: center;
        }
        .coverage-option-title { font-size: 15px; font-weight: 700; color: var(--text-primary); margin-bottom: 2px; }
        .coverage-option-desc { font-size: 13px; color: var(--text-secondary); }
        .coverage-saving { text-align: center; font-size: 13px; color: var(--text-tertiary); margin-top: 14px; }

        /* ===== RESPONSIVE ===== */
        @media (max-width: 1024px) {
          .top-bar { padding: 16px 20px; }
          .search-bar { max-width: 280px; }
          .notification-dropdown { width: 340px; }
          .topbar-clock { display: none; }
        }
        @media (max-width: 768px) {
          .sidebar { transform: translateX(-100%); box-shadow: none; }
          .sidebar.mobile-open { transform: translateX(0); box-shadow: 20px 0 60px rgba(0,0,0,0.3); }
          .sidebar.collapsed { width: 280px; }
          .collapse-btn { display: none; }
          .main-content { margin-left: 0; }
          .main-content.expanded { margin-left: 0; }
          .top-bar { display: none; }
          .mobile-header { display: flex; }
          .notification-dropdown { position: fixed; top: auto; left: 12px; right: 12px; width: auto; max-width: 100%; border-radius: 16px; }
        }
        @media (max-width: 480px) {
          .mobile-header-primary { padding: 8px 12px; }
          .mobile-biz-name { font-size: 14px; max-width: 100px; }
          .coverage-modal { padding: 24px 18px; }
        }
        @media (max-width: 360px) {
          .mobile-biz-name { max-width: 80px; }
        }
      `}</style>

      <div
        className={`provider-layout ${isDarkMode ? "dark-mode" : ""}`}
        ref={layoutRef}
      >
        {/* ===== SIDEBAR ===== */}
        <aside
          className={`sidebar ${isMobileMenuOpen ? "mobile-open" : ""} ${sidebarCollapsed ? "collapsed" : ""}`}
        >
          <div className="sidebar-header">
            <div className="sidebar-logo">
              <img
                src="/assets/log.png"
                alt="ZimServ"
                style={{
                  width: 36,
                  height: 36,
                  objectFit: "contain",
                  borderRadius: 8,
                  flexShrink: 0,
                }}
              />
              <div className="logo-text">
                <div className="logo-title">ZimServ</div>
                <div className="logo-subtitle">Provider Portal</div>
              </div>
            </div>
            <button
              className="collapse-btn"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              title={sidebarCollapsed ? "Expand" : "Collapse"}
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
            <div className="sidebar-footer-item" onClick={toggleDarkMode}>
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
                <AvatarImage
                  size={40}
                  radius={12}
                  fontSize={15}
                  onlineDotSize={12}
                />
                <div className="user-identity">
                  <div
                    className="user-biz-name"
                    title={businessName || fullName}
                  >
                    {businessName || fullName}
                  </div>
                  <div className="user-role-label">Provider</div>
                </div>
                <ChevronDown size={16} className="user-menu-icon" />
              </button>

              {showUserMenu && (
                <div className="user-dropdown">
                  <div className="dropdown-identity">
                    <div className="dropdown-biz">
                      {businessName || fullName}
                    </div>
                    <div className="dropdown-sub">{fullName}</div>
                  </div>
                  <div
                    className="dropdown-item"
                    onClick={() => {
                      navigate("/provider/profile");
                      setShowUserMenu(false);
                    }}
                  >
                    <User size={16} strokeWidth={2.5} /> My Profile
                  </div>
                  <div className="dropdown-item">
                    <Settings size={16} strokeWidth={2.5} /> Settings
                  </div>
                  <div className="dropdown-item danger" onClick={handleLogout}>
                    <LogOut size={16} strokeWidth={2.5} /> Logout
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

        {/* ===== MAIN CONTENT ===== */}
        <main className={`main-content ${sidebarCollapsed ? "expanded" : ""}`}>
          {/* ===== DESKTOP TOP BAR ===== */}
          <div className="top-bar">
            <div className="top-bar-left">
              <div className="topbar-identity">
                <div
                  className="topbar-biz-badge"
                  onClick={() => navigate("/provider/profile")}
                  title={businessName || fullName}
                >
                  <AvatarImage
                    size={28}
                    radius={8}
                    fontSize={11}
                    showOnline={false}
                  />
                  <div>
                    <div className="topbar-biz-name">
                      {businessName || fullName}
                    </div>
                  </div>
                  <span className="topbar-biz-role">Provider</span>
                </div>
              </div>

              {/* Live clock — desktop */}
              <div className="topbar-clock">
                <Clock
                  size={14}
                  strokeWidth={2.5}
                  style={{ color: "var(--text-tertiary)" }}
                />
                <div>
                  <div className="topbar-clock-time">
                    {formatTime(currentTime)}
                  </div>
                </div>
                <div className="topbar-clock-date">
                  {formatDate(currentTime)}
                </div>
              </div>

              <div className="search-bar">
                <input
                  type="text"
                  className="search-input"
                  placeholder="Search jobs, reviews, profiles…"
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
                    <span
                      className={`notification-badge ${showNotifications ? "" : "pulsing"}`}
                    >
                      {unreadCount}
                    </span>
                  )}
                </button>

                {showNotifications && (
                  <div className="notification-dropdown">
                    <div className="notification-header">
                      <div className="notification-title">Notifications</div>
                      {unreadCount > 0 && (
                        <button
                          className="mark-read-btn"
                          onClick={() =>
                            setNotifications((p) =>
                              p.map((n) => ({ ...n, unread: false })),
                            )
                          }
                        >
                          Mark all read
                        </button>
                      )}
                    </div>
                    <div className="notification-list">
                      {notifications.length > 0 ? (
                        notifications.map((notif) => (
                          <div
                            key={notif.id}
                            className={`notification-item ${notif.unread ? "unread" : ""} notif-${notif.type}`}
                            onClick={() => {
                              navigate(notif.link);
                              setShowNotifications(false);
                            }}
                          >
                            <div
                              className={`notification-icon notif-icon-${notif.type}`}
                            >
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
                          <CheckCircle2
                            size={32}
                            strokeWidth={1.5}
                            style={{
                              margin: "0 auto 8px",
                              display: "block",
                              color: "#10b981",
                            }}
                          />
                          <p style={{ fontWeight: 600, marginBottom: 4 }}>
                            All caught up!
                          </p>
                          <p style={{ fontSize: 12 }}>
                            No pending actions right now.
                          </p>
                        </div>
                      )}
                    </div>
                    <div className="notification-footer">
                      <button
                        className="view-all-btn"
                        onClick={() => setShowNotifications(false)}
                      >
                        Close
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <button
                className="top-bar-icon-btn"
                title="Settings"
                onClick={() => navigate("/provider/profile")}
              >
                <Settings size={18} strokeWidth={2.5} />
              </button>
            </div>
          </div>

          {/* ===== TOP-TIER MOBILE HEADER ===== */}
          <div className="mobile-header">
            {/* Row 1: Primary nav bar */}
            <div className="mobile-header-primary">
              <button
                className="mobile-menu-btn"
                onClick={() => setIsMobileMenuOpen(true)}
                aria-label="Open menu"
              >
                <Menu size={20} strokeWidth={2.5} />
              </button>

              {/* Identity: name only */}
              <div className="mobile-identity">
                <div style={{ minWidth: 0 }}>
                  <div
                    className="mobile-biz-name"
                    title={businessName || fullName}
                  >
                    {businessName || fullName}
                  </div>
                  <div className="mobile-biz-sub">Provider</div>
                </div>
              </div>

              <div className="mobile-header-right">
                {/* Search toggle */}
                <div className="mobile-search-wrapper">
                  <button
                    className="mobile-icon-btn"
                    onClick={() => setShowMobileSearch(true)}
                    aria-label="Search"
                  >
                    <Search size={17} strokeWidth={2.5} />
                  </button>
                </div>

                {/* Theme toggle */}
                <button
                  className="mobile-icon-btn"
                  onClick={toggleDarkMode}
                  title={isDarkMode ? "Light mode" : "Dark mode"}
                >
                  {isDarkMode ? (
                    <Sun size={17} strokeWidth={2.5} />
                  ) : (
                    <Moon size={17} strokeWidth={2.5} />
                  )}
                </button>

                {/* Notifications */}
                <div className="notification-wrapper">
                  <button
                    className={`mobile-icon-btn ${showNotifications ? "active" : ""}`}
                    onClick={() => setShowNotifications(!showNotifications)}
                    aria-label="Notifications"
                  >
                    <Bell size={17} strokeWidth={2.5} />
                    {unreadCount > 0 && (
                      <span
                        className={`notification-badge ${showNotifications ? "" : "pulsing"}`}
                      >
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  {showNotifications && (
                    <div className="notification-dropdown">
                      <div className="notification-header">
                        <div className="notification-title">Notifications</div>
                        {unreadCount > 0 && (
                          <button
                            className="mark-read-btn"
                            onClick={() =>
                              setNotifications((p) =>
                                p.map((n) => ({ ...n, unread: false })),
                              )
                            }
                          >
                            Mark all read
                          </button>
                        )}
                      </div>
                      <div className="notification-list">
                        {notifications.length > 0 ? (
                          notifications.map((notif) => (
                            <div
                              key={notif.id}
                              className={`notification-item ${notif.unread ? "unread" : ""} notif-${notif.type}`}
                              onClick={() => {
                                navigate(notif.link);
                                setShowNotifications(false);
                              }}
                            >
                              <div
                                className={`notification-icon notif-icon-${notif.type}`}
                              >
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
                            <CheckCircle2
                              size={32}
                              strokeWidth={1.5}
                              style={{
                                margin: "0 auto 8px",
                                display: "block",
                                color: "#10b981",
                              }}
                            />
                            <p style={{ fontWeight: 600, marginBottom: 4 }}>
                              All caught up!
                            </p>
                            <p style={{ fontSize: 12 }}>
                              No pending actions right now.
                            </p>
                          </div>
                        )}
                      </div>
                      <div className="notification-footer">
                        <button
                          className="view-all-btn"
                          onClick={() => setShowNotifications(false)}
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Avatar / account */}
                <div className="user-menu-wrapper">
                  <button
                    className="mobile-avatar-btn"
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    aria-label="Account menu"
                  >
                    {profileImageUrl ? (
                      <img
                        src={profileImageUrl}
                        alt={fullName}
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                    ) : (
                      userInitials
                    )}
                  </button>

                  {showUserMenu && (
                    <div
                      className="mobile-user-dropdown"
                      style={{
                        top: "calc(100% + 12px)",
                        right: 0,
                        position: "absolute",
                      }}
                    >
                      <div className="mobile-dropdown-header">
                        <AvatarImage
                          size={36}
                          radius={10}
                          fontSize={13}
                          showOnline={true}
                          onlineDotSize={9}
                        />
                        <div style={{ minWidth: 0, flex: 1 }}>
                          <div className="mobile-dropdown-biz">
                            {businessName || fullName}
                          </div>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 6,
                              marginTop: 4,
                            }}
                          >
                            <span className="mobile-status-badge">
                              <span className="status-dot" />
                              Online
                            </span>
                          </div>
                        </div>
                      </div>
                      <div
                        className="dropdown-item"
                        onClick={() => {
                          navigate("/provider/profile");
                          setShowUserMenu(false);
                        }}
                      >
                        <User size={15} strokeWidth={2.5} /> My Profile
                      </div>
                      <div className="dropdown-item">
                        <Settings size={15} strokeWidth={2.5} /> Settings
                      </div>
                      <div
                        className="dropdown-item danger"
                        onClick={handleLogout}
                      >
                        <LogOut size={15} strokeWidth={2.5} /> Logout
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Row 2: Quick stat strip — clock + live metrics */}
            <div className="mobile-stat-strip">
              {/* Live clock */}
              <div className="mobile-clock-item">
                <Clock
                  size={12}
                  strokeWidth={2.5}
                  style={{ color: "var(--text-tertiary)", flexShrink: 0 }}
                />
                <div>
                  <div className="mobile-clock-time">
                    {formatTime(currentTime)}
                  </div>
                  <div className="mobile-clock-date">
                    {formatDate(currentTime)}
                  </div>
                </div>
              </div>

              {/* Active jobs */}
              <div
                className="mobile-stat-item"
                onClick={() => navigate("/provider/jobs")}
              >
                <span className="mobile-stat-dot orange" />
                <div>
                  <div className="mobile-stat-value">{activeJobsCount}</div>
                  <div className="mobile-stat-label">Active Jobs</div>
                </div>
              </div>

              {/* Pending reviews */}
              <div
                className="mobile-stat-item"
                onClick={() => navigate("/provider/reviews")}
              >
                <span className="mobile-stat-dot blue" />
                <div>
                  <div className="mobile-stat-value">{unreadReviewsCount}</div>
                  <div className="mobile-stat-label">Reviews</div>
                </div>
              </div>

              {/* Online status */}
              <div className="mobile-stat-item" style={{ borderRight: "none" }}>
                <span className="mobile-stat-dot green" />
                <div>
                  <div
                    className="mobile-stat-value"
                    style={{ color: "#10b981" }}
                  >
                    Live
                  </div>
                  <div className="mobile-stat-label">Status</div>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile full-screen search overlay */}
          {showMobileSearch && (
            <>
              <div
                className="mobile-search-overlay"
                onClick={() => setShowMobileSearch(false)}
              />
              <div className="mobile-search-box">
                <Search
                  size={18}
                  strokeWidth={2.5}
                  style={{ color: "var(--orange-primary)", flexShrink: 0 }}
                />
                <input
                  className="mobile-search-input"
                  type="text"
                  placeholder="Search jobs, reviews, profiles…"
                  autoFocus
                />
                <button
                  className="mobile-search-close"
                  onClick={() => setShowMobileSearch(false)}
                >
                  <X size={18} strokeWidth={2.5} />
                </button>
              </div>
            </>
          )}

          <Outlet />
        </main>

        {/* ===== COVERAGE MODAL ===== */}
        {showCoverageModal && (
          <div className="coverage-modal-backdrop">
            <div className="coverage-modal">
              <div className="coverage-modal-icon">
                <MapPin size={24} strokeWidth={2.5} />
              </div>
              <h2>Where do you work?</h2>
              <p>
                Let customers know your coverage area so you only receive
                relevant job requests.
              </p>

              <div className="coverage-options">
                {/* Nationwide */}
                <button
                  className="coverage-option"
                  onClick={() => handleCoverageSelect(true)}
                  disabled={isSavingCoverage}
                >
                  <div className="coverage-option-icon">
                    <Globe size={20} strokeWidth={2.5} />
                  </div>
                  <div>
                    <div className="coverage-option-title">Nationwide</div>
                    <div className="coverage-option-desc">
                      I can work anywhere in Zimbabwe
                    </div>
                  </div>
                </button>

                {/* Local Only */}
                <button
                  className="coverage-option"
                  onClick={() => handleCoverageSelect(false)}
                  disabled={isSavingCoverage}
                >
                  <div className="coverage-option-icon">
                    <MapPin size={20} strokeWidth={2.5} />
                  </div>
                  <div>
                    <div className="coverage-option-title">Local Only</div>
                    <div className="coverage-option-desc">
                      I serve specific areas or cities only
                    </div>
                  </div>
                </button>
              </div>

              {isSavingCoverage && (
                <p className="coverage-saving">Saving your preference…</p>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ProviderLayout;
