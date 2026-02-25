// src/pages/admin/ProviderDetailsHelpers.ts

export function mapStatus(dbStatus: string): string {
  const map: Record<string, string> = {
    active: "Active",
    pending_review: "Pending",
    needs_changes: "Pending",
    suspended: "Suspended",
    banned: "Banned",
  };
  return map[dbStatus] || "Unknown";
}

export function formatMediaType(mediaType: string): string {
  const map: Record<string, string> = {
    certificate: "Certificate",
    license: "Business License",
    id_document: "ID Document",
    insurance: "Insurance Certificate",
  };
  return map[mediaType] || mediaType.replace("_", " ").toUpperCase();
}

export function getDefaultAvatar(name: string): string {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&size=400&background=FF6B35&color=fff&bold=true`;
}

export function getFieldLabel(fieldName: string): string {
  const labels: Record<string, string> = {
    bio: "Description",
    years_experience: "Years of Experience",
    website: "Website",
    languages: "Languages",
    pricing_model: "Pricing Model",
    business_name: "Business Name",
    phone_number: "Phone Number",
    whatsapp_number: "WhatsApp Number",
    email: "Email",
    city: "City",
    call_available: "Call Availability",
    whatsapp_available: "WhatsApp Availability",
    profile_image_url: "Profile Image",
  };
  return labels[fieldName] || fieldName;
}

export function formatValue(value: any): string {
  if (Array.isArray(value)) return value.join(", ");
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (value === null || value === undefined) return "Not provided";
  return String(value);
}


// ─── CSS ─────────────────────────────────────────────────────────────────────

export const PROVIDER_DETAILS_CSS = `
  *, *::before, *::after {
    box-sizing: border-box;
  }

  .provider-details {
    padding: 28px;
    width: 100%;
    max-width: 100%;
    overflow-x: hidden;
    background: var(--bg-primary);
    min-height: 100vh;
  }

  .back-button {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 12px 20px;
    border-radius: 12px;
    border: 1.5px solid var(--border-color);
    background: var(--card-bg);
    color: var(--text-primary);
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4,0,0.2,1);
    margin-bottom: 24px;
  }
  .back-button:hover {
    background: var(--hover-bg);
    border-color: var(--border-hover);
    transform: translateX(-4px);
  }

  /* ── Pending Banner ── */
  .pending-edits-banner {
    background: linear-gradient(135deg, #FFF4ED 0%, #FFE8D9 100%);
    border: 2px solid var(--orange-primary);
    border-radius: 16px;
    padding: 20px 24px;
    margin-bottom: 24px;
    display: flex;
    align-items: center;
    gap: 16px;
    box-shadow: 0 4px 12px rgba(255,107,53,0.15);
    width: 100%;
  }
  .dark-mode .pending-edits-banner {
    background: rgba(255,107,53,0.15);
  }
  .pending-icon {
    width: 44px;
    height: 44px;
    border-radius: 12px;
    background: var(--orange-primary);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
  .pending-content {
    flex: 1;
    min-width: 0;
  }
  .pending-title {
    font-size: 15px;
    font-weight: 700;
    color: var(--text-primary);
    margin-bottom: 3px;
  }
  .pending-description {
    font-size: 13px;
    color: var(--text-secondary);
    line-height: 1.4;
  }
  .pending-actions {
    display: flex;
    gap: 12px;
    flex-shrink: 0;
  }
  .review-btn {
    padding: 10px 20px;
    border-radius: 10px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    border: none;
    background: var(--orange-primary);
    color: white;
    white-space: nowrap;
  }
  .review-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(255,107,53,0.3);
  }

  /* ── Header ── */
  .details-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 24px;
    margin-bottom: 32px;
    padding: 28px;
    background: var(--card-bg);
    border: 1.5px solid var(--border-color);
    border-radius: 16px;
    box-shadow: 0 2px 8px var(--card-shadow);
    width: 100%;
    min-width: 0;
  }
  .header-left {
    display: flex;
    gap: 24px;
    align-items: flex-start;
    flex: 1;
    min-width: 0;
    overflow: hidden;
  }
  .provider-avatar {
    width: 120px;
    height: 120px;
    border-radius: 16px;
    object-fit: cover;
    border: 2px solid var(--border-color);
    box-shadow: 0 4px 16px var(--card-shadow);
    flex-shrink: 0;
  }
  .provider-info {
    flex: 1;
    min-width: 0;
    overflow: hidden;
  }
  .provider-info h1 {
    font-size: 32px;
    font-weight: 800;
    color: var(--text-primary);
    margin-bottom: 12px;
    display: flex;
    align-items: center;
    gap: 12px;
    letter-spacing: -0.8px;
    flex-wrap: wrap;
    word-break: break-word;
  }
  .verified-badge { color: var(--verified-color); }
  .provider-meta {
    display: flex;
    gap: 20px;
    margin-bottom: 16px;
    flex-wrap: wrap;
  }
  .meta-item {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 15px;
    color: var(--text-secondary);
    font-weight: 500;
  }
  .status-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 8px 16px;
    border-radius: 20px;
    font-size: 13px;
    font-weight: 700;
  }
  .status-badge.active   { background: var(--success-bg);     color: var(--success-color); }
  .status-badge.pending  { background: var(--orange-light-bg); color: var(--orange-primary); }
  .status-badge.suspended { background: var(--danger-bg);     color: var(--danger-color); }

  .header-actions {
    display: flex;
    gap: 12px;
    flex-shrink: 0;
  }
  .action-btn-large {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    padding: 13px 24px;
    border-radius: 12px;
    font-size: 14px;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4,0,0.2,1);
    border: 1.5px solid;
    background: transparent;
    white-space: nowrap;
  }
  .action-btn-large.edit {
    border-color: var(--orange-primary);
    color: var(--orange-primary);
  }
  .action-btn-large.edit:hover {
    background: var(--orange-light-bg);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px var(--orange-shadow);
  }
  .action-btn-large.suspend {
    border-color: var(--danger-color);
    color: var(--danger-color);
  }
  .action-btn-large.suspend:hover {
    background: var(--danger-bg);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px var(--danger-shadow);
  }
  .action-btn-large.approve {
    border-color: #10b981;
    color: #10b981;
    background: rgba(16,185,129,0.06);
  }
  .action-btn-large.approve:hover {
    background: #10b981;
    color: #ffffff;
    transform: translateY(-2px);
    box-shadow: 0 4px 14px rgba(16,185,129,0.35);
  }

  /* ── Stats Grid ── */
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
    margin-bottom: 32px;
    width: 100%;
  }

  /* ── Tabs ── */
  .tabs-container {
    background: var(--card-bg);
    border: 1.5px solid var(--border-color);
    border-radius: 16px;
    overflow: hidden;
    margin-bottom: 24px;
    box-shadow: 0 2px 8px var(--card-shadow);
    width: 100%;
    min-width: 0;
  }
  .tabs-header {
    display: flex;
    border-bottom: 1.5px solid var(--border-color);
    background: var(--tabs-bg);
    padding: 0 8px;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
  }
  .tabs-header::-webkit-scrollbar { display: none; }
  .tab-button {
    padding: 16px 24px;
    border: none;
    background: transparent;
    color: var(--text-secondary);
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    position: relative;
    border-bottom: 2px solid transparent;
    display: inline-flex;
    align-items: center;
    gap: 7px;
    white-space: nowrap;
    flex-shrink: 0;
  }
  .tab-button:hover {
    color: var(--text-primary);
    background: var(--hover-bg);
  }
  .tab-button.active {
    color: var(--orange-primary);
    border-bottom-color: var(--orange-primary);
  }
  .tab-content { padding: 28px; }

  /* ── Content Grid ── */
  .content-grid {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 24px;
  }
  .card {
    background: var(--card-bg);
    border: 1.5px solid var(--border-color);
    border-radius: 14px;
    padding: 24px;
    box-shadow: 0 2px 8px var(--card-shadow);
    transition: all 0.3s ease;
    min-width: 0;
  }
  .card:hover {
    border-color: var(--border-hover);
    box-shadow: 0 4px 16px var(--card-shadow);
  }
  .card-title {
    font-size: 18px;
    font-weight: 700;
    color: var(--text-primary);
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .info-row {
    display: flex;
    justify-content: space-between;
    gap: 8px;
    padding: 14px 0;
    border-bottom: 1px solid var(--border-color);
  }
  .info-row:last-child { border-bottom: none; }
  .info-label {
    font-size: 14px;
    color: var(--text-secondary);
    font-weight: 500;
    flex-shrink: 0;
  }
  .info-value {
    font-size: 14px;
    color: var(--text-primary);
    font-weight: 600;
    text-align: right;
    word-break: break-word;
    min-width: 0;
  }

  .contact-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 14px;
    background: var(--chip-bg);
    border-radius: 12px;
    margin-bottom: 12px;
    transition: all 0.2s ease;
    min-width: 0;
  }
  .contact-item:hover {
    background: var(--hover-bg);
    transform: translateX(4px);
  }
  .contact-icon {
    width: 40px;
    height: 40px;
    border-radius: 10px;
    background: var(--orange-light-bg);
    color: var(--orange-primary);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
  .contact-info {
    flex: 1;
    min-width: 0;
  }
  .contact-label {
    font-size: 12px;
    color: var(--text-secondary);
    margin-bottom: 4px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  .contact-value {
    font-size: 14px;
    color: var(--text-primary);
    font-weight: 600;
    word-break: break-all;
    overflow-wrap: break-word;
  }

  .photos-grid {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 12px;
  }
  .photo-item {
    aspect-ratio: 1;
    border-radius: 10px;
    overflow: hidden;
    border: 1.5px solid var(--border-color);
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4,0,0.2,1);
  }
  .photo-item:hover {
    border-color: var(--orange-primary);
    transform: scale(1.03);
    box-shadow: 0 6px 18px var(--card-shadow);
  }
  .photo-item img { width: 100%; height: 100%; object-fit: cover; }

  .document-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
    padding: 16px;
    background: var(--chip-bg);
    border-radius: 12px;
    margin-bottom: 12px;
    transition: all 0.2s ease;
  }
  .document-item:hover { background: var(--hover-bg); }
  .document-left {
    display: flex;
    align-items: center;
    gap: 12px;
    min-width: 0;
    flex: 1;
  }
  .document-icon {
    width: 40px;
    height: 40px;
    border-radius: 10px;
    background: var(--orange-light-bg);
    color: var(--orange-primary);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
  .document-info { min-width: 0; }
  .document-info h4 {
    font-size: 14px;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 4px;
    word-break: break-word;
  }
  .document-date { font-size: 12px; color: var(--text-secondary); }
  .document-status {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    color: var(--success-color);
    font-weight: 700;
    padding: 6px 12px;
    background: var(--success-bg);
    border-radius: 8px;
    white-space: nowrap;
    flex-shrink: 0;
  }

  .tags { display: flex; flex-wrap: wrap; gap: 10px; }
  .tag {
    padding: 8px 14px;
    background: var(--chip-bg);
    color: var(--text-primary);
    font-size: 13px;
    font-weight: 600;
    border-radius: 8px;
    transition: all 0.2s ease;
  }
  .tag:hover {
    background: var(--orange-light-bg);
    color: var(--orange-primary);
    transform: translateY(-2px);
  }

  .description-text {
    color: var(--text-secondary);
    line-height: 1.8;
    font-size: 15px;
    word-break: break-word;
    overflow-wrap: break-word;
  }
  .empty-state {
    text-align: center;
    padding: 40px 20px;
    color: var(--text-secondary);
  }

  .file-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;              /* space between icon and text */
  padding: 4px 10px;
  font-size: 12px;
  border-radius: 999px;  /* pill shape */
  border: 1px solid transparent;
  cursor: pointer;
  line-height: 1;
  transition: background-color 0.15s ease, color 0.15s ease,
    border-color 0.15s ease, transform 0.1s ease;
}

/* Specific styling for the View button */
.view-btn {
  background-color: #eef4ff;
  color: #1d4ed8;
  border-color: #c7d2fe;
  margin-top: 10px;
}

.view-btn:hover {
  background-color: #dbe4ff;
  border-color: #a5b4fc;
  transform: translateY(-0.5px);
}

.view-btn:active {
  transform: translateY(0);
}

/* Make the icon align nicely */
.view-btn svg {
  flex-shrink: 0;
}


  /* ── CSS Variables ── */
  :root {
    --bg-primary: #f8f9fa;
    --text-primary: #111827;
    --text-secondary: #6b7280;
    --card-bg: #ffffff;
    --border-color: #e5e7eb;
    --border-hover: #d1d5db;
    --hover-bg: #f3f4f6;
    --chip-bg: #f9fafb;
    --tabs-bg: #fafbfc;
    --card-shadow: rgba(0,0,0,0.05);
    --orange-primary: #FF6B35;
    --orange-light-bg: #FFF4ED;
    --orange-shadow: rgba(255,107,53,0.2);
    --verified-color: #2563EB;
    --success-bg: #DCFCE7;
    --success-color: #15803D;
    --danger-color: #ef4444;
    --danger-bg: #FEE2E2;
    --danger-shadow: rgba(239,68,68,0.2);
  }
  .dark-mode {
    --bg-primary: #111827;
    --text-primary: #f9fafb;
    --text-secondary: #d1d5db;
    --card-bg: #1f2937;
    --border-color: #374151;
    --border-hover: #4b5563;
    --hover-bg: #374151;
    --chip-bg: #374151;
    --tabs-bg: #1f2937;
    --card-shadow: rgba(0,0,0,0.3);
    --orange-primary: #FF8A5B;
    --orange-light-bg: rgba(255,107,53,0.15);
    --orange-shadow: rgba(255,138,91,0.3);
    --verified-color: #60A5FA;
    --success-bg: rgba(21,128,61,0.2);
    --success-color: #4ADE80;
    --danger-color: #F87171;
    --danger-bg: rgba(239,68,68,0.15);
    --danger-shadow: rgba(248,113,113,0.3);
  }

  /* ════════════════════════════════════════
     RESPONSIVE
  ════════════════════════════════════════ */

  @media (max-width: 1024px) {
    .stats-grid {
      grid-template-columns: repeat(2, 1fr);
      gap: 14px;
    }
    .content-grid {
      grid-template-columns: 1fr;
      gap: 16px;
    }
    .photos-grid {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }
  }

  @media (max-width: 768px) {
    .provider-details { padding: 20px 16px; }

    .back-button {
      padding: 9px 14px;
      font-size: 13px;
      margin-bottom: 16px;
    }

    .pending-edits-banner {
      flex-wrap: wrap;
      padding: 14px 16px;
      gap: 10px;
      border-radius: 12px;
      margin-bottom: 16px;
    }
    .pending-icon { width: 36px; height: 36px; border-radius: 10px; }
    .pending-title { font-size: 14px; }
    .pending-description { font-size: 12px; }
    .pending-actions { width: 100%; }
    .review-btn {
      width: 100%;
      text-align: center;
      padding: 10px;
    }

    .details-header {
      flex-direction: column;
      padding: 16px;
      gap: 14px;
      margin-bottom: 16px;
    }
    .header-left {
      flex-direction: column;
      align-items: center;
      text-align: center;
      gap: 12px;
    }
    .provider-avatar {
      width: 80px;
      height: 80px;
      border-radius: 50%;
    }
    .provider-info h1 {
      font-size: 20px;
      justify-content: center;
      margin-bottom: 8px;
    }
    .provider-meta {
      justify-content: center;
      gap: 8px;
    }
    .meta-item { font-size: 12px; }

    .header-actions {
      width: 100%;
      flex-direction: row;
      gap: 10px;
    }
    .action-btn-large {
      flex: 1;
      justify-content: center;
      padding: 10px 8px;
      font-size: 13px;
      border-radius: 10px;
      min-width: 0;
      gap: 6px;
    }

    .stats-grid {
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
      margin-bottom: 16px;
    }

    .tabs-header { padding: 0 4px; }
    .tab-button {
      padding: 12px 10px;
      font-size: 12px;
      gap: 4px;
    }
    .tab-content { padding: 14px 12px; }

    .card { padding: 16px 12px; border-radius: 12px; }
    .card-title { font-size: 15px; margin-bottom: 12px; }

    .info-row { padding: 10px 0; }
    .info-label { font-size: 13px; }
    .info-value { font-size: 13px; }

    .photos-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 8px;
    }
    .content-grid { gap: 12px; }
    .tag { padding: 6px 10px; font-size: 12px; }
    .description-text { font-size: 14px; }

    .document-item { padding: 12px; }
    .document-info h4 { font-size: 13px; }
  }

  @media (max-width: 480px) {
    .provider-details { padding: 12px 10px; }
    .stats-grid {
      grid-template-columns: repeat(2, 1fr);
      gap: 10px;
    }
    .photos-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
    .document-item {
      flex-direction: column;
      align-items: flex-start;
    }
    .document-status {
      margin-top: 6px;
      align-self: flex-start;
    }
    .action-btn-large {
      font-size: 12px;
      padding: 9px 6px;
    }
  }
`;

