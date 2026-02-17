// src/components/ProviderPanel/AddJobModal.tsx
import { useState } from "react";
import {
  X,
  Briefcase,
  User,
  MapPin,
  DollarSign,
  Calendar,
  Mail,
  Phone,
} from "lucide-react";

interface AddJobModalProps {
  onClose: () => void;
}

const AddJobModal = ({ onClose }: AddJobModalProps) => {
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // TODO: Add job creation logic
    setTimeout(() => {
      setIsSubmitting(false);
      onClose();
    }, 1000);
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <>
      <style>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(4px);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          animation: fadeIn 0.2s ease;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .modal-container {
          background: #fff;
          border-radius: 16px;
          width: 100%;
          max-width: 600px;
          max-height: 90vh;
          overflow: hidden;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          animation: slideUp 0.3s ease;
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 24px;
          border-bottom: 1px solid #e3e5e8;
        }

        .modal-title-section {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .modal-icon {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          background: linear-gradient(135deg, #FF6B35 0%, #E85A28 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
        }

        .modal-title {
          font-size: 20px;
          font-weight: 600;
          color: #202124;
        }

        .close-btn {
          width: 36px;
          height: 36px;
          border-radius: 8px;
          border: 1px solid #e3e5e8;
          background: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.15s;
          color: #5f6368;
        }

        .close-btn:hover {
          background: #f8f9fa;
          border-color: #5f6368;
        }

        .modal-body {
          padding: 24px;
          overflow-y: auto;
          max-height: calc(90vh - 160px);
        }

        .form-grid {
          display: grid;
          gap: 20px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .form-label {
          font-size: 14px;
          font-weight: 500;
          color: #202124;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .form-input {
          padding: 12px 14px;
          border: 1px solid #dadce0;
          border-radius: 8px;
          font-size: 14px;
          font-family: inherit;
          transition: all 0.15s;
        }

        .form-input:focus {
          outline: none;
          border-color: #FF6B35;
          box-shadow: 0 0 0 3px rgba(255, 107, 53, 0.1);
        }

        .contact-type-toggle {
          display: flex;
          gap: 8px;
          padding: 4px;
          background: #f8f9fa;
          border-radius: 8px;
        }

        .toggle-btn {
          flex: 1;
          padding: 8px 12px;
          border: none;
          background: transparent;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 500;
          color: #5f6368;
          cursor: pointer;
          transition: all 0.15s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
        }

        .toggle-btn.active {
          background: #fff;
          color: #FF6B35;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        .modal-footer {
          padding: 20px 24px;
          border-top: 1px solid #e3e5e8;
          display: flex;
          justify-content: flex-end;
          gap: 12px;
        }

        .btn {
          padding: 10px 20px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          border: none;
        }

        .btn-cancel {
          background: #fff;
          color: #5f6368;
          border: 1px solid #dadce0;
        }

        .btn-cancel:hover {
          background: #f8f9fa;
        }

        .btn-submit {
          background: linear-gradient(135deg, #FF6B35 0%, #E85A28 100%);
          color: #fff;
        }

        .btn-submit:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(255, 107, 53, 0.3);
        }

        .btn-submit:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        @media (max-width: 768px) {
          .modal-container {
            max-height: 95vh;
          }

          .modal-header {
            padding: 20px;
          }

          .modal-body {
            padding: 20px;
          }

          .form-row {
            grid-template-columns: 1fr;
          }

          .modal-footer {
            padding: 16px 20px;
            flex-direction: column-reverse;
          }

          .btn {
            width: 100%;
          }
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
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">
                    <Briefcase size={16} />
                    Job Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    className="form-input"
                    placeholder="e.g., Emergency Geyser Repair"
                    value={formData.title}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <User size={16} />
                    Customer Name
                  </label>
                  <input
                    type="text"
                    name="customerName"
                    className="form-input"
                    placeholder="e.g., John Doe"
                    value={formData.customerName}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <MapPin size={16} />
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    className="form-input"
                    placeholder="e.g., Borrowdale, Harare"
                    value={formData.location}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <DollarSign size={16} />
                    Budget
                  </label>
                  <input
                    type="text"
                    name="budget"
                    className="form-input"
                    placeholder="e.g., $150 - $200"
                    value={formData.budget}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">
                      <Calendar size={16} />
                      Scheduled Date
                    </label>
                    <input
                      type="date"
                      name="scheduledDate"
                      className="form-input"
                      value={formData.scheduledDate}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      <Calendar size={16} />
                      Time
                    </label>
                    <input
                      type="time"
                      name="scheduledTime"
                      className="form-input"
                      value={formData.scheduledTime}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Customer Contact</label>
                  <div className="contact-type-toggle">
                    <button
                      type="button"
                      className={`toggle-btn ${formData.contactType === "phone" ? "active" : ""}`}
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          contactType: "phone",
                        }))
                      }
                    >
                      <Phone size={16} />
                      Phone
                    </button>
                    <button
                      type="button"
                      className={`toggle-btn ${formData.contactType === "email" ? "active" : ""}`}
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          contactType: "email",
                        }))
                      }
                    >
                      <Mail size={16} />
                      Email
                    </button>
                  </div>
                </div>

                {formData.contactType === "phone" ? (
                  <div className="form-group">
                    <label className="form-label">
                      <Phone size={16} />
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="customerPhone"
                      className="form-input"
                      placeholder="+263 77 123 4567"
                      value={formData.customerPhone}
                      onChange={handleChange}
                      required
                    />
                  </div>
                ) : (
                  <div className="form-group">
                    <label className="form-label">
                      <Mail size={16} />
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="customerEmail"
                      className="form-input"
                      placeholder="customer@email.com"
                      value={formData.customerEmail}
                      onChange={handleChange}
                      required
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-cancel"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-submit"
                disabled={isSubmitting}
              >
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
