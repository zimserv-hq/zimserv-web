// src/components/Footer/Footer.tsx
import {
  Facebook,
  Instagram,
  Twitter,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// Simple TikTok icon as inline SVG
const TikTokIcon = ({ size = 20 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M16.5 3a4.5 4.5 0 0 0 3 3V9a6.003 6.003 0 0 1-4-1.5V14a5 5 0 1 1-5-5 5.1 5.1 0 0 1 1 .1V11.7A2.999 2.999 0 1 0 13 14V3h3.5z" />
  </svg>
);

const CATEGORIES = [
  { name: "Plumbing", slug: "plumbing" },
  { name: "Electrical", slug: "electrical" },
  { name: "Cleaning", slug: "cleaning" },
  { name: "Automotive", slug: "automotive" },
  { name: "Painting", slug: "painting" },
  { name: "Carpentry", slug: "carpentry" },
  { name: "HVAC", slug: "hvac" },
  { name: "IT & Tech", slug: "it-tech" },
];

const Footer = () => {
  const navigate = useNavigate();

  const handleCategoryClick = (slug: string) => {
    navigate(`/category/${slug}`);
  };

  return (
    <>
      <style>{`
        .footer-wrapper {
          width: 100%;
          background: var(--primary-navy);
          margin-top: 80px;
          padding-top: 64px;
          position: relative;
        }

        .footer-wrapper::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, var(--accent-blue), var(--accent-blue-light));
        }

        .footer {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 40px;
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1.5fr;
          gap: 64px;
          padding-bottom: 48px;
        }

        .footer h3 {
          font-size: 18px;
          font-weight: 700;
          margin-bottom: 24px;
          color: var(--bg-white);
          position: relative;
          padding-bottom: 12px;
        }

        .footer h3::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 40px;
          height: 3px;
          background: var(--accent-blue);
          border-radius: 2px;
        }

        .company-description {
          color: var(--neutral-light);
          font-size: 15px;
          line-height: 1.7;
          margin-bottom: 24px;
        }

        .footer ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .footer li {
          margin-bottom: 14px;
          color: var(--neutral-light);
          font-size: 15px;
          cursor: pointer;
          transition: all 0.2s ease;
          padding-left: 0;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .footer li::before {
          content: '→';
          color: var(--accent-blue);
          opacity: 0;
          transform: translateX(-8px);
          transition: all 0.2s ease;
        }

        .footer li:hover {
          color: var(--accent-blue);
          transform: translateX(4px);
        }

        .footer li:hover::before {
          opacity: 1;
          transform: translateX(0);
        }

        .footer li a {
          color: inherit;
          text-decoration: none;
        }

        .contact-item {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          margin-bottom: 18px;
          font-size: 15px;
          color: var(--neutral-light);
          line-height: 1.6;
        }

        .contact-item svg {
          flex-shrink: 0;
          margin-top: 2px;
          color: var(--accent-blue);
        }

        .contact-item a {
          color: var(--neutral-light);
          text-decoration: none;
          transition: color 0.2s ease;
        }

        .contact-item a:hover {
          color: var(--accent-blue);
        }

        .social-row {
          display: flex;
          gap: 12px;
          margin-top: 24px;
        }

        .social-icon {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
          border: 2px solid transparent;
          color: var(--bg-white);
          text-decoration: none;
        }

        .social-icon:hover {
          background: var(--accent-blue);
          color: var(--bg-white);
          border-color: var(--accent-blue);
          transform: translateY(-4px);
          box-shadow: 0 8px 20px rgba(37, 99, 235, 0.4);
        }

        .copyright {
          margin-top: 0;
          padding: 24px 40px;
          text-align: center;
          background: rgba(0, 0, 0, 0.2);
          color: var(--neutral-light);
          font-size: 14px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          line-height: 1.6;
        }

        .copyright a {
          color: var(--accent-blue);
          text-decoration: none;
          font-weight: 600;
          transition: color 0.2s ease;
        }

        .copyright a:hover {
          color: var(--accent-blue-light);
        }

        /* 📱 RESPONSIVE */
        @media (max-width: 1200px) {
          .footer {
            padding: 0 32px;
            gap: 48px;
            grid-template-columns: 1.5fr 1fr 1fr 1.2fr;
          }
        }

        @media (max-width: 900px) {
          .footer {
            grid-template-columns: repeat(2, 1fr);
            gap: 40px;
          }
        }

        @media (max-width: 768px) {
          .footer-wrapper {
            margin-top: 60px;
            padding-top: 48px;
          }

          .footer {
            padding: 0 24px;
            padding-bottom: 40px;
          }

          .footer h3 {
            font-size: 17px;
            margin-bottom: 20px;
          }

          .company-description {
            font-size: 14px;
          }

          .footer li {
            font-size: 14px;
            margin-bottom: 12px;
          }

          .contact-item {
            font-size: 14px;
            margin-bottom: 16px;
          }

          .social-icon {
            width: 42px;
            height: 42px;
          }

          .copyright {
            font-size: 13px;
            padding: 20px 24px;
          }
        }

        @media (max-width: 480px) {
          .footer-wrapper {
            padding-top: 40px;
          }

          .footer {
            grid-template-columns: 1fr;
            gap: 36px;
            padding: 0 20px;
            padding-bottom: 32px;
          }

          .footer h3 {
            font-size: 16px;
            margin-bottom: 16px;
          }

          .company-description {
            font-size: 13px;
          }

          .footer li {
            font-size: 13px;
            margin-bottom: 11px;
          }

          .contact-item {
            font-size: 13px;
            margin-bottom: 14px;
          }

          .social-row {
            gap: 10px;
          }

          .social-icon {
            width: 40px;
            height: 40px;
          }

          .copyright {
            font-size: 12px;
            padding: 18px 20px;
          }
        }

        .footer li:focus,
        .social-icon:focus {
          outline: 2px solid var(--accent-blue);
          outline-offset: 2px;
        }

        @media (prefers-reduced-motion: reduce) {
          * {
            transition: none !important;
          }
        }
      `}</style>

      <div className="footer-wrapper">
        <div className="footer">
          {/* ZIMSERV - COMPANY SECTION */}
          <div>
            <h3>ZimServ</h3>
            <p className="company-description">
              Your trusted marketplace for finding verified service providers in
              Zimbabwe. Connecting customers with quality professionals for all
              your home and business service needs.
            </p>
            <div className="social-row">
              <a
                href="https://facebook.com/zimserv"
                className="social-icon"
                aria-label="Facebook"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Facebook size={20} />
              </a>

              <a
                href="https://instagram.com/zimserv"
                className="social-icon"
                aria-label="Instagram"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Instagram size={20} />
              </a>

              <a
                href="https://twitter.com/zimserv"
                className="social-icon"
                aria-label="Twitter"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Twitter size={20} />
              </a>

              <a
                href="https://www.tiktok.com/@zimserv"
                className="social-icon"
                aria-label="TikTok"
                target="_blank"
                rel="noopener noreferrer"
              >
                <TikTokIcon size={20} />
              </a>
            </div>
          </div>

          {/* POPULAR SERVICES SECTION */}
          <div>
            <h3>Popular Services</h3>
            <ul>
              {CATEGORIES.slice(0, 6).map((category) => (
                <li
                  key={category.slug}
                  onClick={() => handleCategoryClick(category.slug)}
                >
                  {category.name}
                </li>
              ))}
            </ul>
          </div>

          {/* QUICK LINKS SECTION */}
          <div>
            <h3>Quick Links</h3>
            <ul>
              <li onClick={() => navigate("/how-it-works")}>How It Works</li>
              <li onClick={() => navigate("/become-provider")}>
                Become a Provider
              </li>
              <li onClick={() => navigate("/about")}>About Us</li>
              <li onClick={() => navigate("/contact")}>Contact Us</li>
              <li onClick={() => navigate("/faq")}>FAQ</li>
              <li>
                <a
                  href="/legal/terms-and-conditions.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Terms & Conditions
                </a>
              </li>
              <li>
                <a
                  href="/legal/privacy-policy.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>

          {/* CONTACT INFO SECTION */}
          <div>
            <h3>Contact Us</h3>

            <div className="contact-item">
              <MapPin size={18} />
              <span>
                123 Business Center,
                <br />
                Harare, Zimbabwe
              </span>
            </div>

            <div className="contact-item">
              <Phone size={18} />
              <a href="tel:+263771234567">+263 77 123 4567</a>
            </div>

            <div className="contact-item">
              <Mail size={18} />
              <a href="mailto:info@zimserv.co.zw">info@zimserv.co.zw</a>
            </div>
          </div>
        </div>

        {/* COPYRIGHT */}
        <div className="copyright">
          © {new Date().getFullYear()} ZimServ. All rights reserved.
          <br />
          Connecting Zimbabweans with Trusted Service Providers
        </div>
      </div>
    </>
  );
};

export default Footer;
