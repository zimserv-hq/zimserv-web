// src/pages/provider/ProviderJobs.tsx
import { useState } from "react";
import {
  Briefcase,
  Clock,
  CheckCircle,
  MapPin,
  Calendar,
  Eye,
  Plus,
  Phone,
  XCircle,
  Mail,
} from "lucide-react";
import PageHeader from "../../components/Admin/PageHeader";
import StatCard from "../../components/Admin/StatCard";
import SearchBar from "../../components/Admin/SearchBar";
import FilterDropdown from "../../components/Admin/FilterDropdown";
import AddJobModal from "../../components/ProviderPanel/AddJobModal";

interface Job {
  id: string;
  title: string;
  customerName: string;
  location: string;
  status: "pending" | "in_progress" | "completed" | "cancelled";
  createdAt: Date;
  scheduledDate?: Date;
  customerPhone?: string;
  customerEmail?: string;
}

const MOCK_JOBS: Job[] = [
  {
    id: "1",
    title: "Emergency Geyser Repair",
    customerName: "John D.",
    location: "Borrowdale, Harare",
    status: "in_progress",
    createdAt: new Date("2026-02-14T09:30:00"),
    scheduledDate: new Date("2026-02-15T10:00:00"),
    customerPhone: "+263 77 123 4567",
  },
  {
    id: "2",
    title: "Bathroom Renovation",
    customerName: "Sarah M.",
    location: "Avondale, Harare",
    status: "pending",
    createdAt: new Date("2026-02-13T14:20:00"),
    scheduledDate: new Date("2026-02-20T08:00:00"),
    customerEmail: "sarah.m@email.com",
  },
  {
    id: "3",
    title: "Kitchen Sink Installation",
    customerName: "Mike T.",
    location: "Mount Pleasant, Harare",
    status: "completed",
    createdAt: new Date("2026-02-10T11:00:00"),
    scheduledDate: new Date("2026-02-12T14:00:00"),
    customerPhone: "+263 77 345 6789",
  },
  {
    id: "4",
    title: "Toilet Repair",
    customerName: "Lisa K.",
    location: "Greendale, Harare",
    status: "cancelled",
    createdAt: new Date("2026-02-08T16:45:00"),
    customerEmail: "lisa.k@email.com",
  },
  {
    id: "5",
    title: "Shower Installation",
    customerName: "David W.",
    location: "Highlands, Harare",
    status: "in_progress",
    createdAt: new Date("2026-02-12T10:15:00"),
    scheduledDate: new Date("2026-02-16T09:00:00"),
    customerPhone: "+263 77 456 7890",
  },
  {
    id: "6",
    title: "Pipe Leak Fixing",
    customerName: "Robert K.",
    location: "Borrowdale, Harare",
    status: "pending",
    createdAt: new Date("2026-02-13T08:15:00"),
    scheduledDate: new Date("2026-02-17T11:00:00"),
    customerEmail: "robert.k@email.com",
  },
];

const ProviderJobs = () => {
  const [jobs, setJobs] = useState<Job[]>(MOCK_JOBS);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [showAddModal, setShowAddModal] = useState(false);

  const getFilteredJobs = () => {
    let filtered = jobs;

    if (filterStatus !== "All") {
      filtered = filtered.filter((j) => j.status === filterStatus);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (j) =>
          j.title.toLowerCase().includes(query) ||
          j.customerName.toLowerCase().includes(query) ||
          j.location.toLowerCase().includes(query),
      );
    }

    return filtered.sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
    );
  };

  const filteredJobs = getFilteredJobs();

  const stats = {
    total: jobs.length,
    inProgress: jobs.filter((j) => j.status === "in_progress").length,
    completed: jobs.filter((j) => j.status === "completed").length,
  };

  const filterOptions = [
    { label: "All Jobs", value: "All" },
    { label: "Pending", value: "pending" },
    { label: "In Progress", value: "in_progress" },
    { label: "Completed", value: "completed" },
    { label: "Cancelled", value: "cancelled" },
  ];

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "pending":
        return {
          bg: "#fef7e0",
          text: "#8f5d00",
          border: "#fbbf24",
          icon: Clock,
        };
      case "in_progress":
        return {
          bg: "#e8f0fe",
          text: "#1a73e8",
          border: "#1a73e8",
          icon: Briefcase,
        };
      case "completed":
        return {
          bg: "#e6f4ea",
          text: "#137333",
          border: "#34a853",
          icon: CheckCircle,
        };
      case "cancelled":
        return {
          bg: "#fce8e6",
          text: "#c5221f",
          border: "#ea4335",
          icon: XCircle,
        };
      default:
        return {
          bg: "#f8f9fa",
          text: "#5f6368",
          border: "#dadce0",
          icon: Briefcase,
        };
    }
  };

  const getStatusLabel = (status: string) => {
    return status
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const handleCompleteJob = (jobId: string) => {
    setJobs((prev) =>
      prev.map((job) =>
        job.id === jobId ? { ...job, status: "completed" as const } : job,
      ),
    );
  };

  const handleCancelJob = (jobId: string) => {
    setJobs((prev) =>
      prev.map((job) =>
        job.id === jobId ? { ...job, status: "cancelled" as const } : job,
      ),
    );
  };

  return (
    <>
      <style>{`
        .provider-jobs {
          padding: 24px;
          max-width: 1600px;
          margin: 0 auto;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 16px;
          margin-bottom: 23px;
        }

        .actions-bar {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 20px;
        }

        .search-wrapper {
          flex: 1;
          max-width: 500px;
          margin-top: 20px;
        }

        .add-job-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 16px;
          background: #FF6B35;
          color: #fff;
          border: none;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          white-space: nowrap;
          height: 44px;
        }

        .add-job-btn:hover {
          background: #E85A28;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(255, 107, 53, 0.3);
        }

        .jobs-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
          position: relative;
          z-index: 1;
        }

        .job-card {
          background: #fff;
          border: 1px solid #e3e5e8;
          border-radius: 12px;
          padding: 20px;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
          display: flex;
          flex-direction: column;
          position: relative;
          overflow: hidden;
        }

        .job-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(90deg, #FF6B35 0%, #E85A28 100%);
          transform: scaleX(0);
          transition: transform 0.3s ease;
        }

        .job-card:hover {
          border-color: #FF6B35;
          box-shadow: 0 4px 16px rgba(255, 107, 53, 0.15);
          transform: translateY(-2px);
        }

        .job-card:hover::before {
          transform: scaleX(1);
        }

        .job-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 16px;
          gap: 12px;
        }

        .job-title {
          font-size: 16px;
          font-weight: 600;
          color: #202124;
          line-height: 1.3;
          margin-bottom: 0;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          flex: 1;
        }

        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 6px 10px;
          border-radius: 6px;
          font-size: 11px;
          font-weight: 600;
          border: 1px solid;
          white-space: nowrap;
          text-transform: uppercase;
          letter-spacing: 0.3px;
          flex-shrink: 0;
        }

        .job-info {
          flex: 1;
          margin-bottom: 16px;
        }

        .info-row {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 10px;
          font-size: 13px;
          color: #5f6368;
        }

        .info-row:last-child {
          margin-bottom: 0;
        }

        .info-row svg {
          flex-shrink: 0;
        }

        .info-row strong {
          color: #202124;
          font-weight: 500;
        }

        .job-actions-section {
          display: flex;
          flex-direction: column;
          gap: 12px;
          padding-top: 16px;
          border-top: 1px solid #f1f3f4;
        }

        .job-date {
          font-size: 12px;
          color: #80868b;
        }

        .job-action-buttons {
          display: flex;
          gap: 8px;
        }

        .action-btn {
          flex: 1;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 8px 12px;
          border-radius: 6px;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.15s;
          border: 1px solid;
        }

        .action-btn.complete {
          background: #e6f4ea;
          color: #137333;
          border-color: #34a853;
        }

        .action-btn.complete:hover {
          background: #d4edda;
          transform: translateY(-1px);
        }

        .action-btn.cancel {
          background: #fce8e6;
          color: #c5221f;
          border-color: #ea4335;
        }

        .action-btn.cancel:hover {
          background: #f8d7da;
          transform: translateY(-1px);
        }

        .contact-actions {
          display: flex;
          gap: 6px;
        }

        .contact-btn {
          flex: 1;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 8px 12px;
          border-radius: 6px;
          border: 1px solid #dadce0;
          background: #fff;
          cursor: pointer;
          transition: all 0.15s;
          color: #5f6368;
          font-size: 13px;
          font-weight: 500;
        }

        .contact-btn:hover {
          background: #f8f9fa;
        }

        .contact-btn.phone:hover {
          border-color: #10b981;
          color: #10b981;
          background: #f0fdf4;
        }

        .contact-btn.whatsapp:hover {
          border-color: #25D366;
          color: #25D366;
          background: #f0fdf4;
        }

        .contact-btn.email:hover {
          border-color: #1a73e8;
          color: #1a73e8;
          background: #e8f0fe;
        }

        .empty-state {
          grid-column: 1 / -1;
          padding: 60px 20px;
          text-align: center;
          border: 1px dashed #dadce0;
          border-radius: 12px;
          background: #fafbfc;
        }

        .empty-icon {
          font-size: 48px;
          margin-bottom: 16px;
        }

        .empty-title {
          font-size: 18px;
          font-weight: 500;
          color: #202124;
          margin-bottom: 8px;
        }

        .empty-text {
          font-size: 14px;
          color: #5f6368;
        }

        /* Responsive Breakpoints */
        @media (max-width: 1200px) {
          .jobs-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        @media (max-width: 768px) {
          .provider-jobs {
            padding: 16px;
          }

          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
          }

          .actions-bar {
            flex-direction: column;
            align-items: stretch;
          }

          .search-wrapper {
            max-width: none;
          }

          .add-job-btn {
            width: 100%;
            justify-content: center;
          }

          .jobs-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
          }

          .job-card {
            padding: 16px;
          }

          .job-title {
            font-size: 15px;
          }

          .info-row {
            font-size: 12px;
          }

          .job-action-buttons {
            flex-direction: column;
          }

          .contact-actions {
            flex-direction: column;
          }
        }

        @media (max-width: 480px) {
          .provider-jobs {
            padding: 12px;
          }

          .stats-grid {
            gap: 10px;
          }

          .jobs-grid {
            grid-template-columns: 1fr;
            gap: 12px;
          }

          .job-header {
            flex-direction: column;
            align-items: flex-start;
          }

          .status-badge {
            align-self: flex-start;
          }
        }
      `}</style>

      <div className="provider-jobs">
        <PageHeader
          title="Jobs"
          subtitle="Manage your service requests and bookings"
          icon={Briefcase}
        />

        <div className="stats-grid">
          <StatCard
            label="Total Jobs"
            value={stats.total}
            icon={Briefcase}
            iconColor="orange"
          />
          <StatCard
            label="In Progress"
            value={stats.inProgress}
            icon={Briefcase}
            iconColor="blue"
          />
          <StatCard
            label="Completed"
            value={stats.completed}
            icon={CheckCircle}
            iconColor="green"
          />
        </div>

        <div className="actions-bar">
          <div className="search-wrapper">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search by job title, customer, or location..."
            />
          </div>
          <FilterDropdown
            options={filterOptions}
            value={filterStatus}
            onChange={setFilterStatus}
          />
          <button className="add-job-btn" onClick={() => setShowAddModal(true)}>
            <Plus size={18} strokeWidth={2.5} />
            Add New Job
          </button>
        </div>

        <div className="jobs-grid">
          {filteredJobs.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📋</div>
              <h3 className="empty-title">No jobs found</h3>
              <p className="empty-text">No jobs match your current filters</p>
            </div>
          ) : (
            filteredJobs.map((job) => {
              const statusConfig = getStatusConfig(job.status);
              return (
                <div key={job.id} className="job-card">
                  <div className="job-header">
                    <h3 className="job-title">{job.title}</h3>
                    <div
                      className="status-badge"
                      style={{
                        background: statusConfig.bg,
                        color: statusConfig.text,
                        borderColor: statusConfig.border,
                      }}
                    >
                      <statusConfig.icon size={12} strokeWidth={2.5} />
                      {getStatusLabel(job.status)}
                    </div>
                  </div>

                  <div className="job-info">
                    <div className="info-row">
                      <Eye size={14} />
                      <strong>{job.customerName}</strong>
                    </div>
                    <div className="info-row">
                      <MapPin size={14} />
                      {job.location}
                    </div>
                    {job.customerPhone && (
                      <div className="info-row">
                        <Phone size={14} />
                        <strong>{job.customerPhone}</strong>
                      </div>
                    )}
                    {job.customerEmail && (
                      <div className="info-row">
                        <Mail size={14} />
                        <strong>{job.customerEmail}</strong>
                      </div>
                    )}
                    {job.scheduledDate && (
                      <div className="info-row">
                        <Calendar size={14} />
                        {job.scheduledDate.toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    )}
                  </div>

                  <div className="job-actions-section">
                    <span className="job-date">
                      {job.createdAt.toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>

                    {job.status !== "completed" &&
                      job.status !== "cancelled" && (
                        <div className="job-action-buttons">
                          <button
                            className="action-btn complete"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCompleteJob(job.id);
                            }}
                          >
                            <CheckCircle size={14} />
                            Complete
                          </button>
                          <button
                            className="action-btn cancel"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCancelJob(job.id);
                            }}
                          >
                            <XCircle size={14} />
                            Cancel
                          </button>
                        </div>
                      )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {showAddModal && <AddJobModal onClose={() => setShowAddModal(false)} />}
      </div>
    </>
  );
};

export default ProviderJobs;
