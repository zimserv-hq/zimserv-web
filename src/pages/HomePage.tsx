import SEO from "../components/SEO";
import Hero from "../components/Hero/Hero";
import CategorySection from "../components/Home/CategorySection";
import HowItWorks from "../components/Home/HowItWorks";
import WhyChooseUs from "../components/Home/WhyChooseUs";
import FeaturedProviders from "../components/Home/FeaturedProviders";
import ProviderCTA from "../components/Home/ProviderCTA";

const HomePage = () => {
  return (
    <>
      <SEO
        title="Hire Plumbers, Electricians & More in Zimbabwe | ZimServ"
        description="Find trusted plumbers, electricians and more across Zimbabwe. Compare providers, read reviews and contact directly with no middlemen."
        keywords={[
          "service providers Zimbabwe",
          "hire plumber Harare",
          "electrician Bulawayo",
          "home services Zimbabwe",
          "verified service providers",
          "find handyman Zimbabwe",
          "ZimServ Zimbabwe",
        ]}
        url="/"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "ZimServ",
          url: "https://www.zimserv.co.zw",
          description:
            "Zimbabwe's trusted marketplace for verified service providers",
          potentialAction: {
            "@type": "SearchAction",
            target: {
              "@type": "EntryPoint",
              urlTemplate:
                "https://www.zimserv.co.zw/providers?q={search_term_string}",
            },
            "query-input": "required name=search_term_string",
          },
        }}
      />

      <Hero />
      <CategorySection />
      <FeaturedProviders />
      <HowItWorks />
      <WhyChooseUs />
      <ProviderCTA />

      {/* 🔥 SEO Content (Subtle, Clean, Powerful) */}
      <section
        style={{
          maxWidth: "800px",
          margin: "0 auto 60px",
          padding: "0 20px",
          textAlign: "center",
        }}
      >
        {/* Lightweight H1 (SEO boost, minimal visual impact) */}
        <h2
          style={{
            fontSize: "16px",
            marginBottom: "10px",
            fontWeight: 600,
            color: "var(--color-text-secondary)",
          }}
        >
          Trusted Service Providers Across Zimbabwe
        </h2>

        <p
          style={{
            fontSize: "14px",
            color: "var(--color-text-secondary)",
            lineHeight: "1.75",
            marginBottom: "12px",
          }}
        >
          ZimServ helps you find verified plumbers, electricians, cleaners,
          painters and more across Zimbabwe. Browse providers, compare reviews
          and contact directly with no middlemen.
        </p>

        <p
          style={{
            fontSize: "14px",
            color: "var(--color-text-secondary)",
            lineHeight: "1.75",
            marginBottom: "16px",
          }}
        >
          Popular services include plumbing, electrical work, carpentry, solar
          installation, painting, cleaning and appliance repair across Harare,
          Bulawayo, Mutare, Gweru and other major cities.
        </p>

        {/* Internal links (SEO authority boost) */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "8px",
            justifyContent: "center",
          }}
        >
          {[
            { label: "Plumbers in Harare", href: "/services/plumbing/harare" },
            {
              label: "Electricians in Harare",
              href: "/services/electrical/harare",
            },
            { label: "Painters in Harare", href: "/services/painting/harare" },
            {
              label: "Plumbers in Bulawayo",
              href: "/services/plumbing/bulawayo",
            },
            {
              label: "Electricians in Bulawayo",
              href: "/services/electrical/bulawayo",
            },
          ].map(({ label, href }) => (
            <a
              key={href}
              href={href}
              style={{
                fontSize: "13px",
                color: "var(--color-accent)",
                fontWeight: 600,
                textDecoration: "none",
                padding: "5px 12px",
                border: "1px solid var(--color-accent-light)",
                borderRadius: "var(--radius-full)",
                background: "var(--color-accent-soft)",
                transition: "all 0.2s",
              }}
            >
              {label}
            </a>
          ))}
        </div>
      </section>
    </>
  );
};

export default HomePage;
