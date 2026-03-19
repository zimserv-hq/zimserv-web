// src/pages/PrivacyPage.tsx
import { useNavigate } from "react-router-dom";

const PrivacyPage = () => {
  const navigate = useNavigate();

  return (
    <>
      <style>{`
        .legal-page {
          min-height: 100vh;
          background: var(--color-bg-section);
          padding: 60px 0 80px;
          font-family: var(--font-primary);
        }
        .legal-container {
          max-width: 780px;
          margin: 0 auto;
          padding: 0 24px;
        }
        .legal-back {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: var(--color-text-secondary);
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          margin-bottom: 32px;
          background: none;
          border: none;
          padding: 0;
          transition: color 0.2s;
        }
        .legal-back:hover { color: var(--color-accent); }
        .legal-card {
          background: var(--color-bg);
          border: 1.5px solid var(--color-border);
          border-radius: var(--radius-xl);
          box-shadow: var(--shadow-md);
          padding: 48px 52px;
        }
        .legal-brand {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 36px;
          cursor: pointer;
        }
        .legal-brand img { height: 36px; width: auto; }
        .legal-brand-text {
          font-size: 20px;
          font-weight: 800;
          color: var(--color-primary);
          letter-spacing: -0.5px;
        }
        .legal-brand-accent { color: var(--color-accent); }
        .legal-title {
          font-size: 28px;
          font-weight: 800;
          color: var(--color-primary);
          letter-spacing: -0.8px;
          margin-bottom: 6px;
        }
        .legal-meta {
          font-size: 13px;
          color: var(--color-text-secondary);
          margin-bottom: 36px;
          line-height: 1.8;
          padding-bottom: 28px;
          border-bottom: 1.5px solid var(--color-border);
        }
        .legal-meta strong { color: var(--color-primary); }
        .legal-section { margin-bottom: 36px; }
        .legal-h2 {
          font-size: 17px;
          font-weight: 800;
          color: var(--color-primary);
          margin-bottom: 12px;
          padding-bottom: 8px;
          border-bottom: 1.5px solid var(--color-border);
        }
        .legal-h3 {
          font-size: 14px;
          font-weight: 700;
          color: var(--color-primary);
          margin: 16px 0 8px;
        }
        .legal-p {
          font-size: 14px;
          color: var(--color-text-secondary);
          line-height: 1.75;
          margin-bottom: 12px;
        }
        .legal-ul {
          margin: 8px 0 12px 0;
          padding-left: 20px;
        }
        .legal-ul li {
          font-size: 14px;
          color: var(--color-text-secondary);
          line-height: 1.75;
          margin-bottom: 6px;
        }
        .legal-ul li strong { color: var(--color-primary); }
        .legal-contact-box {
          background: var(--color-bg-section);
          border: 1.5px solid var(--color-border);
          border-radius: var(--radius-lg);
          padding: 20px 24px;
          margin-top: 12px;
          font-size: 14px;
          color: var(--color-text-secondary);
          line-height: 1.8;
        }
        .legal-contact-box strong { color: var(--color-primary); }
        .legal-contact-box a {
          color: var(--color-accent);
          text-decoration: none;
          font-weight: 600;
        }
        .legal-contact-box a:hover { text-decoration: underline; }
        .legal-footer {
          margin-top: 40px;
          padding-top: 24px;
          border-top: 1.5px solid var(--color-border);
          font-size: 13px;
          color: var(--color-text-secondary);
          text-align: center;
          line-height: 1.7;
        }
        .legal-footer a {
          color: var(--color-accent);
          font-weight: 600;
          text-decoration: none;
          cursor: pointer;
        }
        .legal-footer a:hover { text-decoration: underline; }
        @media (max-width: 640px) {
          .legal-card { padding: 28px 20px; }
          .legal-title { font-size: 22px; }
        }
      `}</style>

      <div className="legal-page">
        <div className="legal-container">
          <button className="legal-back" onClick={() => navigate(-1)}>
            ← Back
          </button>

          <div className="legal-card">
            {/* Brand */}
            <div className="legal-brand" onClick={() => navigate("/")}>
              <img src="/assets/log.png" alt="ZimServ" />
              <span className="legal-brand-text">
                ZIM<span className="legal-brand-accent">SERV</span>
              </span>
            </div>

            {/* Title & Meta */}
            <h1 className="legal-title">Privacy Policy</h1>
            <div className="legal-meta">
              <strong>Effective Date:</strong> 1 March 2026
              <br />
              <strong>Platform:</strong> www.zimserv.co.zw
              <br />
              <strong>Operated by:</strong> Pedzaworks Digital Solutions
              (Private) Limited
              <br />
              <strong>Jurisdiction:</strong> Republic of Zimbabwe
            </div>

            {/* 1. Introduction */}
            <div className="legal-section">
              <h2 className="legal-h2">1. Introduction</h2>
              <p className="legal-p">
                Pedzaworks Digital Solutions (Private) Limited ("Pedzaworks",
                "we", "us", "our"), the owner and operator of ZimServ
                (www.zimserv.co.zw), is committed to protecting the privacy and
                personal data of all individuals who use the Platform. This
                Privacy Policy ("Policy") sets out the basis on which we
                collect, use, store, share, and protect personal information
                obtained through your use of ZimServ.
              </p>
              <p className="legal-p">
                This Policy applies to all Users of the Platform, including
                registered Customers, Service Providers, and general visitors,
                and should be read in conjunction with our Terms of Service. By
                accessing or using the Platform, you acknowledge that you have
                read and understood this Policy and consent to the collection
                and processing of your personal data as described herein.
              </p>
              <p className="legal-p">
                This Policy is drafted in compliance with the{" "}
                <strong>Cyber and Data Protection Act [Chapter 12:07]</strong>{" "}
                of Zimbabwe and reflects internationally recognised principles
                of data protection and privacy.
              </p>
            </div>

            {/* 2. Definitions */}
            <div className="legal-section">
              <h2 className="legal-h2">2. Definitions</h2>
              <ul className="legal-ul">
                <li>
                  <strong>"Personal Data"</strong> — any information relating to
                  an identified or identifiable natural person, including name,
                  email address, phone number, and account identifiers.
                </li>
                <li>
                  <strong>"Processing"</strong> — any operation performed on
                  personal data, including collection, storage, use, disclosure,
                  and deletion.
                </li>
                <li>
                  <strong>"Data Controller"</strong> — Pedzaworks Digital
                  Solutions (Private) Limited, which determines the purposes and
                  means of processing personal data.
                </li>
                <li>
                  <strong>"Data Subject"</strong> — any individual whose
                  personal data is processed through the Platform.
                </li>
                <li>
                  <strong>"Lead Event"</strong> — an anonymously or
                  account-linked interaction recorded when a Customer engages
                  with a Provider listing, such as a click-to-call or
                  click-to-WhatsApp action.
                </li>
                <li>
                  <strong>"Third Party"</strong> — any individual or entity
                  other than the Data Subject and Pedzaworks Digital Solutions.
                </li>
                <li>
                  <strong>"Consent"</strong> — any freely given, specific,
                  informed, and unambiguous indication of the Data Subject's
                  agreement to the processing of their personal data.
                </li>
              </ul>
            </div>

            {/* 3. Data We Collect */}
            <div className="legal-section">
              <h2 className="legal-h2">3. Data We Collect</h2>
              <h3 className="legal-h3">
                3.1 Information Collected from Customers
              </h3>
              <ul className="legal-ul">
                <li>Full name — provided during registration</li>
                <li>
                  Email address — used for account authentication,
                  notifications, and communication
                </li>
                <li>
                  Password — stored in encrypted, hashed form; never stored in
                  plain text
                </li>
                <li>
                  Account activity data — including providers viewed, Lead
                  Events triggered, and reviews submitted
                </li>
                <li>
                  Device and usage data — including device type, browser type,
                  traffic source, and interaction timestamps
                </li>
              </ul>
              <p className="legal-p">
                We do not collect Customer telephone numbers, physical
                addresses, or payment information unless explicitly provided by
                you for a specific purpose.
              </p>

              <h3 className="legal-h3">
                3.2 Information Collected from Service Providers
              </h3>
              <ul className="legal-ul">
                <li>Full name and business/trading name</li>
                <li>Email address and password (stored in encrypted form)</li>
                <li>Phone number and WhatsApp contact number</li>
                <li>
                  Business description, service categories, and areas served
                </li>
                <li>Years of experience and pricing model</li>
                <li>Profile photographs and portfolio images</li>
                <li>
                  Verification documents — including government-issued
                  identification, professional licences, and trade
                  certifications
                </li>
                <li>Website URL (if provided) and languages spoken</li>
                <li>
                  Subscription and billing information (when subscription plans
                  are introduced)
                </li>
                <li>
                  Analytics and performance data — including profile views, Lead
                  Event counts, and interaction trends
                </li>
              </ul>

              <h3 className="legal-h3">
                3.3 Information Collected Automatically
              </h3>
              <ul className="legal-ul">
                <li>IP address (used for security and fraud detection only)</li>
                <li>Browser type and version, operating system</li>
                <li>
                  Referring URL, pages visited, and time spent on the Platform
                </li>
                <li>Device identifiers</li>
              </ul>

              <h3 className="legal-h3">3.4 Information from Lead Events</h3>
              <ul className="legal-ul">
                <li>
                  Provider identifier and event type (call, WhatsApp, website,
                  map)
                </li>
                <li>Device type, traffic source and channel, timestamp</li>
                <li>Customer account reference (for signed-in users only)</li>
              </ul>
            </div>

            {/* 4. How We Use Your Data */}
            <div className="legal-section">
              <h2 className="legal-h2">4. How We Use Your Personal Data</h2>
              <h3 className="legal-h3">
                4.1 To Operate and Deliver the Platform
              </h3>
              <ul className="legal-ul">
                <li>Creating and managing your account</li>
                <li>
                  Displaying Provider listings and facilitating Customer
                  discovery of services
                </li>
                <li>Recording and displaying reviews submitted by Customers</li>
                <li>
                  Tracking Lead Events and providing Providers with performance
                  analytics
                </li>
              </ul>
              <h3 className="legal-h3">4.2 To Communicate with You</h3>
              <ul className="legal-ul">
                <li>Sending account registration and verification emails</li>
                <li>
                  Notifying Providers of platform updates and policy changes
                </li>
                <li>
                  Responding to support requests, enquiries, and complaints
                </li>
              </ul>
              <h3 className="legal-h3">
                4.3 To Maintain Platform Safety and Integrity
              </h3>
              <ul className="legal-ul">
                <li>
                  Detecting, investigating, and preventing fraudulent or
                  unlawful activity
                </li>
                <li>Moderating Provider listings and Customer reviews</li>
                <li>Enforcing our Terms of Service and Platform policies</li>
              </ul>
              <h3 className="legal-h3">4.4 To Improve the Platform</h3>
              <ul className="legal-ul">
                <li>Analysing aggregated, anonymised usage data</li>
                <li>
                  Identifying technical issues and improving platform
                  performance
                </li>
              </ul>
              <h3 className="legal-h3">4.5 Legal Basis for Processing</h3>
              <ul className="legal-ul">
                <li>
                  <strong>Consent</strong> — where you have given explicit
                  consent for a specific purpose
                </li>
                <li>
                  <strong>Contractual necessity</strong> — where processing is
                  necessary for the performance of a contract
                </li>
                <li>
                  <strong>Legitimate interests</strong> — where processing
                  serves our legitimate business interests
                </li>
                <li>
                  <strong>Legal obligation</strong> — where required by
                  Zimbabwean law
                </li>
              </ul>
            </div>

            {/* 5. Verification Documents */}
            <div className="legal-section">
              <h2 className="legal-h2">
                5. Verification Documents and Sensitive Data
              </h2>
              <ul className="legal-ul">
                <li>Accessible only to authorised ZimServ administrators</li>
                <li>Never publicly displayed or shared with Customers</li>
                <li>Stored securely using access-controlled cloud storage</li>
                <li>
                  Retained only as long as necessary for verification and
                  platform integrity
                </li>
                <li>
                  Providers may request deletion by contacting{" "}
                  <a href="mailto:support@zimserv.co.zw">
                    support@zimserv.co.zw
                  </a>
                </li>
              </ul>
            </div>

            {/* 6. Sharing */}
            <div className="legal-section">
              <h2 className="legal-h2">6. Sharing of Personal Data</h2>
              <p className="legal-p">
                Pedzaworks Digital Solutions does not sell, rent, or trade
                personal data to any third party. We may share data in the
                following limited circumstances:
              </p>
              <h3 className="legal-h3">
                6.1 Service Providers and Technology Partners
              </h3>
              <ul className="legal-ul">
                <li>
                  Cloud hosting and storage providers (e.g., Supabase) for
                  secure infrastructure
                </li>
                <li>
                  Email and notification service providers for transactional
                  communications
                </li>
                <li>
                  Payment processors (e.g., Paynow, Pesapal) for subscription
                  billing when introduced
                </li>
              </ul>
              <h3 className="legal-h3">6.2 Legal and Regulatory Disclosure</h3>
              <p className="legal-p">
                We may disclose personal data where required by law, court
                order, or lawful request from a competent Zimbabwean authority.
              </p>
              <h3 className="legal-h3">6.3 Business Transfers</h3>
              <p className="legal-p">
                In the event of a merger or acquisition, personal data may be
                transferred to the acquiring entity subject to equivalent data
                protection obligations. Users will be notified in advance.
              </p>
            </div>

            {/* 7. Data Retention */}
            <div className="legal-section">
              <h2 className="legal-h2">7. Data Retention</h2>
              <ul className="legal-ul">
                <li>
                  <strong>Customer account data</strong> — retained for 24
                  months after account closure
                </li>
                <li>
                  <strong>Provider account and profile data</strong> — retained
                  for 36 months after account closure
                </li>
                <li>
                  <strong>Verification documents</strong> — deleted on request
                  or within 12 months of account closure
                </li>
                <li>
                  <strong>Lead Event data</strong> — retained for up to 36
                  months, then anonymised or deleted
                </li>
                <li>
                  <strong>Review data</strong> — published reviews retained
                  indefinitely; unpublished reviews deleted within 90 days
                </li>
                <li>
                  <strong>Technical and usage data</strong> — retained for up to
                  12 months
                </li>
              </ul>
            </div>

            {/* 8. Your Rights */}
            <div className="legal-section">
              <h2 className="legal-h2">8. Your Data Protection Rights</h2>
              <ul className="legal-ul">
                <li>
                  <strong>Right of Access</strong> — request a copy of the
                  personal data we hold about you
                </li>
                <li>
                  <strong>Right to Rectification</strong> — request correction
                  of inaccurate or incomplete data
                </li>
                <li>
                  <strong>Right to Erasure</strong> — request deletion of your
                  personal data where applicable
                </li>
                <li>
                  <strong>Right to Restriction</strong> — request that we
                  restrict processing in certain circumstances
                </li>
                <li>
                  <strong>Right to Data Portability</strong> — receive your data
                  in a structured, machine-readable format
                </li>
                <li>
                  <strong>Right to Object</strong> — object to processing based
                  on legitimate interests
                </li>
                <li>
                  <strong>Right to Withdraw Consent</strong> — withdraw consent
                  at any time without affecting prior processing
                </li>
              </ul>
              <p className="legal-p">
                To exercise any of these rights, submit a written request to{" "}
                <a
                  href="mailto:support@zimserv.co.zw"
                  style={{ color: "var(--color-accent)", fontWeight: 600 }}
                >
                  support@zimserv.co.zw
                </a>
                . We will respond within 30 days.
              </p>
            </div>

            {/* 9. Data Security */}
            <div className="legal-section">
              <h2 className="legal-h2">9. Data Security</h2>
              <ul className="legal-ul">
                <li>
                  Industry-standard encryption for data in transit (TLS/HTTPS)
                  and at rest
                </li>
                <li>
                  Secure, access-controlled cloud storage for all uploaded
                  documents and media
                </li>
                <li>
                  Password hashing using cryptographically secure algorithms —
                  never stored in plain text
                </li>
                <li>
                  Role-based access controls limiting internal access on a
                  need-to-know basis
                </li>
                <li>
                  Regular security reviews and monitoring of Platform
                  infrastructure
                </li>
              </ul>
            </div>

            {/* 10. Cookies */}
            <div className="legal-section">
              <h2 className="legal-h2">
                10. Cookies and Tracking Technologies
              </h2>
              <ul className="legal-ul">
                <li>
                  <strong>Strictly necessary cookies</strong> — essential for
                  Platform function including session management; cannot be
                  disabled
                </li>
                <li>
                  <strong>Analytical cookies</strong> — anonymised data about
                  Platform usage to improve performance
                </li>
                <li>
                  <strong>Preference cookies</strong> — remember your settings
                  across sessions
                </li>
              </ul>
              <p className="legal-p">
                You may control or disable non-essential cookies through your
                browser settings. Disabling certain cookies may affect Platform
                functionality.
              </p>
            </div>

            {/* 11. Children's Privacy */}
            <div className="legal-section">
              <h2 className="legal-h2">11. Children's Privacy</h2>
              <p className="legal-p">
                ZimServ is not directed at individuals under the age of 18. We
                do not knowingly collect personal data from minors. If you
                believe a minor has provided data without consent, contact us
                immediately at{" "}
                <a
                  href="mailto:support@zimserv.co.zw"
                  style={{ color: "var(--color-accent)", fontWeight: 600 }}
                >
                  support@zimserv.co.zw
                </a>
                .
              </p>
            </div>

            {/* 12. Third-Party Links */}
            <div className="legal-section">
              <h2 className="legal-h2">12. Third-Party Links</h2>
              <p className="legal-p">
                The Platform may contain links to third-party websites.
                Pedzaworks Digital Solutions is not responsible for the privacy
                practices of any external sites. We encourage you to review
                their privacy policies.
              </p>
            </div>

            {/* 13. International Transfers */}
            <div className="legal-section">
              <h2 className="legal-h2">13. International Data Transfers</h2>
              <p className="legal-p">
                ZimServ is operated from Zimbabwe and primarily intended for use
                within Zimbabwe. Due to cloud infrastructure, data may be
                processed on servers outside Zimbabwe. Where such transfers
                occur, appropriate safeguards are in place in accordance with
                Zimbabwean data protection law.
              </p>
            </div>

            {/* 14. Changes */}
            <div className="legal-section">
              <h2 className="legal-h2">14. Changes to This Privacy Policy</h2>
              <p className="legal-p">
                We reserve the right to amend this Policy at any time. Where
                amendments are material, registered Users will be notified via
                email at least 14 days before the amended Policy takes effect.
                Your continued use of the Platform following the effective date
                constitutes acceptance of the revised Policy.
              </p>
            </div>

            {/* 15. Contact */}
            <div className="legal-section">
              <h2 className="legal-h2">15. Contact and Complaints</h2>
              <div className="legal-contact-box">
                <strong>Data Controller:</strong> Pedzaworks Digital Solutions
                (Private) Limited
                <br />
                <strong>Operating as:</strong> ZimServ
                <br />
                <strong>Email:</strong>{" "}
                <a href="mailto:support@zimserv.co.zw">support@zimserv.co.zw</a>
                <br />
                <strong>Website:</strong>{" "}
                <a href="https://www.zimserv.co.zw">www.zimserv.co.zw</a>
                <br />
                <strong>Jurisdiction:</strong> Republic of Zimbabwe
              </div>
              <p className="legal-p" style={{ marginTop: 12 }}>
                If you are not satisfied with our response, you have the right
                to lodge a complaint with the relevant data protection authority
                in Zimbabwe under the Cyber and Data Protection Act [Chapter
                12:07].
              </p>
            </div>

            {/* Footer */}
            <div className="legal-footer">
              This Privacy Policy was last reviewed and updated on{" "}
              <strong>1 March 2026</strong>.<br />
              <span
                style={{ cursor: "pointer" }}
                onClick={() => navigate("/terms")}
              >
                View our <a>Terms of Service</a>
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PrivacyPage;
