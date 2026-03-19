// src/pages/TermsPage.tsx
import { useNavigate } from "react-router-dom";

const TermsPage = () => {
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
        .legal-highlight-box {
          background: rgba(255,107,53,0.05);
          border: 1.5px solid rgba(255,107,53,0.2);
          border-radius: var(--radius-lg);
          padding: 16px 20px;
          margin: 12px 0;
          font-size: 14px;
          color: var(--color-text-secondary);
          line-height: 1.75;
        }
        .legal-highlight-box strong { color: var(--color-primary); }
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
            <h1 className="legal-title">Terms of Service</h1>
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
              <h2 className="legal-h2">1. Introduction and Scope</h2>
              <p className="legal-p">
                These Terms of Service ("Terms", "Agreement") constitute a
                legally binding agreement between you ("User", "you", "your")
                and Pedzaworks Digital Solutions (Private) Limited
                ("Pedzaworks", "we", "us", "our"), the owner and operator of
                ZimServ, accessible at www.zimserv.co.zw ("the Platform").
              </p>
              <p className="legal-p">
                By accessing, registering on, or using the Platform in any
                capacity — whether as a Customer, Service Provider, or general
                visitor — you acknowledge that you have read, understood, and
                agree to be legally bound by these Terms, together with our
                Privacy Policy. If you do not agree with any part of these
                Terms, you must immediately cease use of the Platform.
              </p>
            </div>

            {/* 2. About ZimServ */}
            <div className="legal-section">
              <h2 className="legal-h2">2. About ZimServ</h2>
              <p className="legal-p">
                ZimServ is a digital service directory and discovery platform
                designed to connect consumers seeking local professional
                services with verified service providers through a structured,
                searchable, and mobile-optimised directory.
              </p>
              <div className="legal-highlight-box">
                <strong>
                  ZimServ operates exclusively as a discovery and visibility
                  platform.
                </strong>{" "}
                It does not:
                <ul
                  className="legal-ul"
                  style={{ marginTop: 8, marginBottom: 0 }}
                >
                  <li>
                    Process, hold, or facilitate payments between customers and
                    providers
                  </li>
                  <li>Schedule, book, or manage service appointments</li>
                  <li>
                    Act as an employer, agent, or contractor in relation to any
                    provider
                  </li>
                  <li>
                    Guarantee the quality, safety, or outcome of any service
                  </li>
                  <li>
                    Mediate contractual disputes between customers and providers
                  </li>
                </ul>
              </div>
              <p className="legal-p" style={{ marginTop: 12 }}>
                All service agreements, negotiations, and transactions are
                solely between the Customer and the Service Provider. Pedzaworks
                Digital Solutions is not a party to any such agreement.
              </p>
            </div>

            {/* 3. Definitions */}
            <div className="legal-section">
              <h2 className="legal-h2">3. Definitions</h2>
              <ul className="legal-ul">
                <li>
                  <strong>"Platform"</strong> — the ZimServ website, web
                  application, and associated digital products.
                </li>
                <li>
                  <strong>"Customer"</strong> — any registered user accessing
                  the Platform to search for and contact service providers.
                </li>
                <li>
                  <strong>"Service Provider" / "Provider"</strong> — any
                  individual, tradesperson, or business entity registered to
                  offer professional services.
                </li>
                <li>
                  <strong>"User"</strong> — collectively, Customers, Providers,
                  and any other persons accessing the Platform.
                </li>
                <li>
                  <strong>"Content"</strong> — all text, images, documents,
                  reviews, ratings, and other material submitted to or displayed
                  on the Platform.
                </li>
                <li>
                  <strong>"Lead Event"</strong> — an interaction recorded when a
                  Customer engages with a Provider listing (e.g., click-to-call,
                  click-to-WhatsApp).
                </li>
                <li>
                  <strong>"Subscription Plan"</strong> — a paid visibility
                  package for Providers, to be introduced at a future date.
                </li>
                <li>
                  <strong>"Verification"</strong> — the administrative review
                  process by which ZimServ validates a Provider's documentation.
                </li>
                <li>
                  <strong>"Account"</strong> — the registered user profile
                  created by a Customer or Provider.
                </li>
              </ul>
            </div>

            {/* 4. Registration */}
            <div className="legal-section">
              <h2 className="legal-h2">4. Registration and User Accounts</h2>
              <h3 className="legal-h3">4.1 Customer Accounts</h3>
              <p className="legal-p">
                By creating a Customer account, you agree to:
              </p>
              <ul className="legal-ul">
                <li>
                  Provide accurate, current, and complete registration
                  information
                </li>
                <li>Keep your login credentials strictly confidential</li>
                <li>
                  Accept full responsibility for all activity under your account
                </li>
                <li>
                  Notify us immediately of any unauthorised access to your
                  account
                </li>
              </ul>
              <h3 className="legal-h3">4.2 Service Provider Accounts</h3>
              <p className="legal-p">
                By registering as a Service Provider, you represent and warrant
                that:
              </p>
              <ul className="legal-ul">
                <li>
                  All submitted information is truthful, accurate, and not
                  misleading
                </li>
                <li>
                  You are legally authorised to operate within the Republic of
                  Zimbabwe
                </li>
                <li>
                  You hold all required professional licences and trade
                  certifications under Zimbabwean law
                </li>
                <li>
                  You are at least 18 years of age or a duly incorporated
                  business entity
                </li>
                <li>
                  Your listing does not infringe any third-party intellectual
                  property rights
                </li>
              </ul>
              <p className="legal-p">
                Provider accounts are subject to approval. Pedzaworks Digital
                Solutions reserves the right to decline, suspend, or remove any
                Provider account at its sole discretion.
              </p>
              <h3 className="legal-h3">4.3 Account Security</h3>
              <p className="legal-p">
                You are solely responsible for maintaining the confidentiality
                of your account credentials. We cannot guarantee absolute
                security and shall not be liable for unauthorised access
                resulting from your failure to secure your credentials.
              </p>
            </div>

            {/* 5. Provider Listings */}
            <div className="legal-section">
              <h2 className="legal-h2">
                5. Provider Listings and Profile Content
              </h2>
              <h3 className="legal-h3">5.1 Accuracy of Information</h3>
              <p className="legal-p">
                Service Providers are solely responsible for the accuracy,
                completeness, and legality of all profile content, including
                service descriptions, pricing, contact details, photographs, and
                documents.
              </p>
              <h3 className="legal-h3">5.2 Prohibited Profile Content</h3>
              <p className="legal-p">
                Providers must not include content that:
              </p>
              <ul className="legal-ul">
                <li>
                  Is false, misleading, or creates a false impression of
                  qualifications or services
                </li>
                <li>Infringes any third-party intellectual property right</li>
                <li>
                  Contains defamatory, obscene, offensive, or discriminatory
                  material
                </li>
                <li>
                  Includes personal information of any third party without their
                  consent
                </li>
                <li>
                  Violates any applicable Zimbabwean law or professional code of
                  conduct
                </li>
              </ul>
              <h3 className="legal-h3">5.3 Profile Moderation</h3>
              <p className="legal-p">
                ZimServ administrators reserve the right to review, edit,
                withhold, or remove any profile content in violation of these
                Terms. Providers will be notified where reasonably practicable
                before content is removed.
              </p>
            </div>

            {/* 6. Reviews */}
            <div className="legal-section">
              <h2 className="legal-h2">6. Customer Reviews and Ratings</h2>
              <h3 className="legal-h3">6.1 Eligibility</h3>
              <p className="legal-p">
                Only registered and signed-in Customers may submit reviews,
                ensuring accountability and authenticity.
              </p>
              <h3 className="legal-h3">6.2 Review Standards</h3>
              <ul className="legal-ul">
                <li>
                  Based on a genuine, first-hand experience with the Provider
                </li>
                <li>
                  Fair, honest, and accurately reflective of your experience
                </li>
                <li>
                  Free from defamatory, abusive, threatening, or discriminatory
                  content
                </li>
                <li>
                  Not submitted in exchange for any compensation or incentive
                </li>
              </ul>
              <h3 className="legal-h3">6.3 Review Moderation</h3>
              <p className="legal-p">
                All reviews are subject to pre-publication moderation. ZimServ
                reserves the right to reject or remove any review that violates
                these Terms without obligation to provide reasons.
              </p>
              <h3 className="legal-h3">6.4 Prohibited Review Conduct</h3>
              <ul className="legal-ul">
                <li>Submitting false, fabricated, or misleading reviews</li>
                <li>
                  Creating multiple accounts to submit duplicate or inflated
                  reviews
                </li>
                <li>
                  Submitting reviews to artificially inflate a Provider's rating
                </li>
                <li>
                  Offering or accepting inducements in exchange for reviews
                </li>
                <li>
                  Submitting reviews to damage a competitor without factual
                  basis
                </li>
              </ul>
            </div>

            {/* 7. Lead Tracking */}
            <div className="legal-section">
              <h2 className="legal-h2">
                7. Lead Tracking, Analytics, and Data Processing
              </h2>
              <p className="legal-p">
                ZimServ tracks certain interactions between Customers and
                Provider listings to provide Providers with performance
                analytics. Tracked Lead Events include click-to-call,
                click-to-WhatsApp, profile views, and website/map link
                interactions.
              </p>
              <p className="legal-p">
                Where a Customer is signed in, Lead Events may be associated
                with their account to maintain accurate interaction records.
                ZimServ does not share individual Customer identity with
                Providers beyond what is necessary and does not sell Customer
                data to any third party.
              </p>
            </div>

            {/* 8. Subscriptions */}
            <div className="legal-section">
              <h2 className="legal-h2">8. Subscriptions, Fees, and Billing</h2>
              <h3 className="legal-h3">8.1 Current Free Access</h3>
              <p className="legal-p">
                As of the Effective Date, ZimServ is provided to all Service
                Providers free of charge during the initial phase of operation.
              </p>
              <h3 className="legal-h3">
                8.2 Introduction of Subscription Plans
              </h3>
              <p className="legal-p">
                Pedzaworks intends to introduce tiered subscription plans at a
                future date. Before any plans are introduced, we commit to
                providing reasonable advance written notice, clearly
                communicating pricing and features, and ensuring no Provider is
                charged without explicit prior consent.
              </p>
              <h3 className="legal-h3">8.3 Billing and Payment</h3>
              <ul className="legal-ul">
                <li>
                  Subscriptions will be billed monthly or annually as selected
                </li>
                <li>
                  Accepted methods: EcoCash, Paynow, Pesapal, Visa, Mastercard,
                  bank transfer
                </li>
                <li>
                  All fees displayed in USD or Zimbabwe Gold (ZiG) as applicable
                </li>
                <li>
                  Non-payment may result in listing downgrade to free tier
                </li>
              </ul>
              <h3 className="legal-h3">8.4 Refund Policy</h3>
              <p className="legal-p">
                Subscription fees are generally non-refundable except where
                required by Zimbabwean consumer protection law or where we have
                failed to deliver the subscribed service. Refund requests must
                be submitted to{" "}
                <a
                  href="mailto:support@zimserv.co.zw"
                  style={{ color: "var(--color-accent)", fontWeight: 600 }}
                >
                  support@zimserv.co.zw
                </a>{" "}
                within 7 days of the disputed charge.
              </p>
              <h3 className="legal-h3">8.5 No Commission Model</h3>
              <p className="legal-p">
                ZimServ does not charge commissions on transactions between
                Customers and Providers. All revenue is derived exclusively from
                Provider subscription fees.
              </p>
            </div>

            {/* 9. Prohibited Conduct */}
            <div className="legal-section">
              <h2 className="legal-h2">9. Prohibited Conduct</h2>
              <ul className="legal-ul">
                <li>
                  Accessing the Platform through unauthorised means, including
                  hacking, scraping, or automated bots
                </li>
                <li>
                  Circumventing any security measure implemented on the Platform
                </li>
                <li>
                  Uploading or distributing malicious code, viruses, or harmful
                  content
                </li>
                <li>
                  Using the Platform for any fraudulent, deceptive, or unlawful
                  activity
                </li>
                <li>
                  Reproducing or commercially exploiting Platform content
                  without prior written consent
                </li>
                <li>
                  Impersonating any person, business, or entity including
                  ZimServ staff
                </li>
                <li>
                  Engaging in harassment, intimidation, or abusive conduct
                  toward any user or ZimServ personnel
                </li>
                <li>
                  Using the Platform in a manner likely to damage ZimServ's
                  reputation or operations
                </li>
              </ul>
            </div>

            {/* 10. Intellectual Property */}
            <div className="legal-section">
              <h2 className="legal-h2">10. Intellectual Property Rights</h2>
              <h3 className="legal-h3">10.1 Platform Ownership</h3>
              <p className="legal-p">
                The ZimServ Platform — including its name, logo, branding,
                design, source code, and all other materials — is the exclusive
                intellectual property of Pedzaworks Digital Solutions (Private)
                Limited. No User is granted any right or interest in Platform
                intellectual property except as expressly stated in these Terms.
              </p>
              <h3 className="legal-h3">10.2 Provider Content Licence</h3>
              <p className="legal-p">
                By submitting content to the Platform, Service Providers grant
                Pedzaworks a non-exclusive, royalty-free, worldwide licence to
                store, display, and distribute that content solely for the
                purpose of operating and promoting the Platform. This licence
                terminates upon removal of the content or closure of the
                Provider's account.
              </p>
              <h3 className="legal-h3">10.3 Reservation of Rights</h3>
              <p className="legal-p">
                All rights not expressly granted are reserved by Pedzaworks
                Digital Solutions. Unauthorised use of Platform intellectual
                property may give rise to civil or criminal liability under
                Zimbabwean law.
              </p>
            </div>

            {/* 11. Liability */}
            <div className="legal-section">
              <h2 className="legal-h2">
                11. Disclaimers and Limitation of Liability
              </h2>
              <h3 className="legal-h3">11.1 Platform Provided "As Is"</h3>
              <p className="legal-p">
                The Platform is provided on an "as is" and "as available" basis
                without warranties of any kind. We do not warrant that the
                Platform will be uninterrupted, error-free, or free from harmful
                components.
              </p>
              <h3 className="legal-h3">
                11.2 No Warranty on Provider Services
              </h3>
              <p className="legal-p">
                Pedzaworks makes no representation regarding the quality,
                safety, legality, or suitability of any Provider's services.
                Listing on ZimServ does not constitute an endorsement.
              </p>
              <h3 className="legal-h3">11.3 Limitation of Liability</h3>
              <p className="legal-p">
                To the maximum extent permitted by Zimbabwean law, Pedzaworks
                shall not be liable for any damages arising from your use of the
                Platform, any service arranged through the Platform,
                unauthorised access to your data, inaccuracies in Provider
                profiles, or any dispute between a Customer and a Provider.
              </p>
              <h3 className="legal-h3">11.4 Indemnification</h3>
              <p className="legal-p">
                You agree to indemnify and hold harmless Pedzaworks Digital
                Solutions and its directors, employees, and agents from any
                claims, liabilities, or expenses arising from your use of the
                Platform, your breach of these Terms, or your violation of any
                applicable law.
              </p>
            </div>

            {/* 12. Termination */}
            <div className="legal-section">
              <h2 className="legal-h2">
                12. Suspension, Termination, and Account Closure
              </h2>
              <h3 className="legal-h3">12.1 Termination by Pedzaworks</h3>
              <p className="legal-p">
                We reserve the right to suspend or permanently terminate any
                account at our sole discretion, including for material breach of
                these Terms, submission of false information, abusive or illegal
                conduct, or failure to maintain Zimbabwean professional
                licensing requirements.
              </p>
              <h3 className="legal-h3">12.2 Termination by the User</h3>
              <p className="legal-p">
                You may request account closure at any time by contacting{" "}
                <a
                  href="mailto:support@zimserv.co.zw"
                  style={{ color: "var(--color-accent)", fontWeight: 600 }}
                >
                  support@zimserv.co.zw
                </a>
                . Data will be handled in accordance with our Privacy Policy.
              </p>
              <h3 className="legal-h3">12.3 Effect of Termination</h3>
              <p className="legal-p">
                Upon Provider account termination, the Provider's listing will
                be removed from the Platform. Customer review history and
                interaction records will be handled per our data retention
                policy.
              </p>
            </div>

            {/* 13. Modifications */}
            <div className="legal-section">
              <h2 className="legal-h2">
                13. Modifications to the Platform and Terms
              </h2>
              <p className="legal-p">
                We reserve the right to modify, suspend, or discontinue any
                Platform feature at any time. Where amendments to these Terms
                are material, registered Users will be notified via email at
                least 14 days before changes take effect. Continued use of the
                Platform after the effective date constitutes acceptance of the
                revised Terms.
              </p>
            </div>

            {/* 14. Governing Law */}
            <div className="legal-section">
              <h2 className="legal-h2">
                14. Governing Law and Dispute Resolution
              </h2>
              <p className="legal-p">
                These Terms are governed by the laws of the Republic of
                Zimbabwe. Disputes shall first be resolved through good-faith
                negotiation. If unresolved within 30 days of written notice,
                either party may refer the matter to the competent courts of
                Zimbabwe.
              </p>
              <p className="legal-p">
                If any provision of these Terms is found to be invalid or
                unenforceable, that provision shall be severed and the remainder
                shall continue in full force and effect.
              </p>
            </div>

            {/* 15. General */}
            <div className="legal-section">
              <h2 className="legal-h2">15. General Provisions</h2>
              <ul className="legal-ul">
                <li>
                  <strong>Entire Agreement</strong> — These Terms, together with
                  the Privacy Policy, constitute the entire agreement between
                  you and Pedzaworks regarding use of ZimServ.
                </li>
                <li>
                  <strong>Waiver</strong> — Failure to enforce any right or
                  provision shall not constitute a waiver of that right.
                </li>
                <li>
                  <strong>Force Majeure</strong> — Pedzaworks shall not be
                  liable for delays caused by events beyond its reasonable
                  control including acts of God, power outages, or internet
                  disruptions.
                </li>
                <li>
                  <strong>Assignment</strong> — You may not assign your rights
                  under these Terms without our prior written consent.
                </li>
              </ul>
            </div>

            {/* 16. Contact */}
            <div className="legal-section">
              <h2 className="legal-h2">16. Contact Information</h2>
              <div className="legal-contact-box">
                <strong>Pedzaworks Digital Solutions (Private) Limited</strong>
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
            </div>

            {/* Footer */}
            <div className="legal-footer">
              These Terms of Service were last reviewed and updated on{" "}
              <strong>1 March 2026</strong>.<br />
              <span
                style={{ cursor: "pointer" }}
                onClick={() => navigate("/privacy")}
              >
                View our <a>Privacy Policy</a>
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TermsPage;
