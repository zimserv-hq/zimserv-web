// src/components/ProviderPanel/AddJobModal.tsx
import { useState } from "react";
import { X, Briefcase, User, MapPin, DollarSign, Calendar, Mail, Phone, Loader2 } from "lucide-react";
import { supabase } from "../../lib/supabaseClient";

interface AddJobModalProps {
  onClose: () => void;
  providerId?: string | null;
  onJobAdded?: () => void;
}

const AddJobModal = ({ onClose, providerId, onJobAdded }: AddJobModalProps) => {
  const [formData, setFormData] = useState({
    title: "",
    customerName: "",
    location: "",
    budget: "",
    scheduledDate: "",
    scheduledTime: "",
    contactType: "phone" as "phone" | "email",
    customerPhone: "",
    customerEmail: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const scheduledDate = formData.scheduledDate
        ? formData.scheduledTime
          ? `${formData.scheduledDate}T${formData.scheduledTime}:00`
          : formData.scheduledDate
        : null;

      const jobData: any = {
        provider_id: providerId,
        title: formData.title,
        customer_name: formData.customerName,
        location: formData.location,
        budget: formData.budget || null,
        scheduled_date: scheduledDate,
        status: "pending",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      if (formData.contactType === "phone") {
        jobData.customer_phone = formData.customerPhone;
      } else {
        jobData.customer_email = formData.customerEmail;
      }

      const { error: insertError } = await supabase.from("provider_jobs").insert(jobData);
      if (insertError) throw insertError;

      onJobAdded?.();
      onClose();
    } catch (err: any) {
      console.error("Error adding job:", err);
      setError(err.message || "Failed to add job. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <>
      <style>{`
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(6px);
          z-index: 2000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          animation: overlayFadeIn 0.2s ease;
        }

        @keyframes overlayFadeIn { from { opacity: 0; } to { opacity: 1; } }

        .modal-container {
          background: var(--card-bg);
          border: 1.5px solid var(--border-color);
          border-radius: 16px;
          width: 100%;
          max-width: 560px;
          max-height: 90vh;
          overflow: hidden;
          box-shadow: 0 24px 64px rgba(0, 0, 0, 0.3);
          animation: modalSlideUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        @keyframes modalSlideUp {
          from { opacity: 0; transform: translateY(20px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        .modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px 24px;
          border-bottom: 1.5px solid var(--border-color);
        }

        .modal-title-section { display: flex; align-items: center; gap: 12px; }

        .modal-icon {
          width: 42px;
          height: 42px;
          border-radius: 12px;
          background: linear-gradient(135deg, #FF6B35 0%, #E85A28 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          box-shadow: 0 4px 12px rgba(255, 107, 53, 0.3);
          flex-shrink: 0;
        }

        .modal-title {
          font-size: 18px;
          font-weight: 700;
          color: var(--text-primary);
          letter-spacing: -0.3px;
        }

        .close-btn {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          border: 1.5px solid var(--border-color);
          background: var(--hover-bg);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.15s;
          color: var(--text-secondary);
        }

        .close-btn:hover {
          background: var(--border-color);
          color: var(--text-primary);
        }

        .modal-body {
          padding: 20px 24px;
          overflow-y: auto;
          max-height: calc(90vh - 160px);
        }

        .form-grid { display: grid; gap: 16px; }

        .form-group { display: flex; flex-direction: column; gap: 6px; }

        .form-label {
          font-size: 12px;
          font-weight: 700;
          color: var(--text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .form-input {
          padding: 11px 14px;
          border: 1.5px solid var(--input-border);
          border-radius: 10px;
          font-size: 14px;
          font-family: inherit;
          transition: all 0.2s ease;
          background: var(--input-bg);
          color: var(--text-primary);
          outline: none;
          width: 100%;
          box-sizing: border-box;
        }

        .form-input:focus {
          border-color: var(--orange-primary);
          box-shadow: 0 0 0 3px var(--orange-shadow);
          background: var(--card-bg);
        }

        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }

        .contact-toggle {
          display: flex;
          gap: 4px;
          padding: 4px;
          background: var(--filter-bg);
          border-radius: 10px;
          border: 1.5px solid var(--border-color);
        }

        .toggle-btn {
          flex: 1;
          padding: 9px 12px;
          border: none;
          background: transparent;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 600;
          color: var(--text-secondary);
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
        }

        .toggle-btn.active {
          background: var(--filter-active-bg);
          color: var(--orange-primary);
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .error-msg {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 14px;
          background: #fee2e2;
          color: #dc2626;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 500;
          border: 1px solid #fca5a5;
        }

        .modal-footer {
          padding: 16px 24px;
          border-top: 1.5px solid var(--border-color);
          display: flex;
          justify-content: flex-end;
          gap: 10px;
        }

        .modal-btn {
          padding: 11px 20px;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          border: none;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-family: inherit;
        }

        .modal-btn-cancel {
          background: var(--hover-bg);
          color: var(--text-secondary);
          border: 1.5px solid var(--border-color);
        }

        .modal-btn-cancel:hover {
          background: var(--border-color);
          color: var(--text-primary);
        }

        .modal-btn-submit {
          background: linear-gradient(135deg, #FF6B35 0%, #E85A28 100%);
          color: #fff;
          border: none;
          box-shadow: 0 4px 12px rgba(255, 107, 53, 0.3);
        }

        .modal-btn-submit:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 6px 16px rgba(255, 107, 53, 0.4);
        }

        .modal-btn-submit:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

        @media (max-width: 640px) {
          .modal-overlay { padding: 0; align-items: flex-end; }
          .modal-container { max-width: 100%; border-radius: 20px 20px 0 0; max-height: 95vh; }
          .form-row { grid-template-columns: 1fr; }
          .modal-footer { flex-direction: column-reverse; }
          .modal-btn { width: 100%; justify-content: center; }
        }
      `}</style>

      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-container" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <div className="modal-title-section">
              <div className="modal-icon">
                <Briefcase size={20} />
              </div>
              <h2 className="modal-title">Add New Job</h2>
            </div>
            <button className="close-btn" onClick={onClose}>
              <X size={18} />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="form-grid">
                {error && (
                  <div className="error-msg">
                    <X size={14} />
                    {error}
                  </div>
                )}

                <div className="form-group">
                  <label className="form-label"><Briefcase size={12} />Job Title</label>
                  <input type="text" name="title" className="form-input" placeholder="e.g., Emergency Geyser Repair" value={formData.title} onChange={handleChange} required />
                </div>

                <div className="form-group">
                  <label className="form-label"><User size={12} />Customer Name</label>
                  <input type="text" name="customerName" className="form-input" placeholder="e.g., John Doe" value={formData.customerName} onChange={handleChange} required />
                </div>

                <div className="form-group">
                  <label className="form-label"><MapPin size={12} />Location</label>
                  <input type="text" name="location" className="form-input" placeholder="e.g., Borrowdale, Harare" value={formData.location} onChange={handleChange} required />
                </div>

                <div className="form-group">
                  <label className="form-label"><DollarSign size={12} />Budget (Optional)</label>
                  <input type="text" name="budget" className="form-input" placeholder="e.g., $150 – $200" value={formData.budget} onChange={handleChange} />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label"><Calendar size={12} />Scheduled Date</label>
                    <input type="date" name="scheduledDate" className="form-input" value={formData.scheduledDate} onChange={handleChange} />
                  </div>
                  <div className="form-group">
                    <label className="form-label"><Calendar size={12} />Time</label>
                    <input type="time" name="scheduledTime" className="form-input" value={formData.scheduledTime} onChange={handleChange} />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Customer Contact</label>
                  <div className="contact-toggle">
                    <button type="button" className={`toggle-btn ${formData.contactType === "phone" ? "active" : ""}`} onClick={() => setFormData((p) => ({ ...p, contactType: "phone" }))}>
                      <Phone size={14} />Phone
                    </button>
                    <button type="button" className={`toggle-btn ${formData.contactType === "email" ? "active" : ""}`} onClick={() => setFormData((p) => ({ ...p, contactType: "email" }))}>
                      <Mail size={14} />Email
                    </button>
                  </div>
                </div>

                {formData.contactType === "phone" ? (
                  <div className="form-group">
                    <label className="form-label"><Phone size={12} />Phone Number</label>
                    <input type="tel" name="customerPhone" className="form-input" placeholder="+263 77 123 4567" value={formData.customerPhone} onChange={handleChange} required />
                  </div>
                ) : (
                  <div className="form-group">
                    <label className="form-label"><Mail size={12} />Email Address</label>
                    <input type="email" name="customerEmail" className="form-input" placeholder="customer@email.com" value={formData.customerEmail} onChange={handleChange} required />
                  </div>
                )}
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" className="modal-btn modal-btn-cancel" onClick={onClose}>Cancel</button>
              <button type="submit" className="modal-btn modal-btn-submit" disabled={isSubmitting}>
                {isSubmitting ? <Loader2 size={16} className="spin" /> : <Briefcase size={16} />}
                {isSubmitting ? "Adding Job..." : "Add Job"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddJobModal;
