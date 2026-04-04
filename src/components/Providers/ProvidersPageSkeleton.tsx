// src/components/Providers/ProvidersPageSkeleton.tsx
import React from "react";

const S: React.CSSProperties = {
  background: "linear-gradient(90deg,#F0EDE8 25%,#E7E3DE 50%,#F0EDE8 75%)",
  backgroundSize: "200% 100%",
  animation: "skshimmer 1.5s ease-in-out infinite",
};

const SkeletonCard = ({}: { delay?: number }) => (
  <div
    style={{
      background: "#fff",
      border: "1px solid #E7E3DE",
      borderRadius: 20,
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
      boxShadow: "0 2px 8px rgba(28,25,23,.06),0 0 0 1px rgba(28,25,23,.04)",
    }}
  >
    {/* Image — use padding-top trick instead of aspect-ratio for reliability */}
    <div
      style={{
        position: "relative",
        width: "100%",
        paddingTop: "75%" /* 4:3 */,
      }}
    >
      <div
        style={{
          ...S,
          position: "absolute",
          inset: 0,
        }}
      />
    </div>

    {/* Body */}
    <div
      style={{
        padding: "16px 18px 18px",
        display: "flex",
        flexDirection: "column",
        flex: 1,
      }}
    >
      {/* Name + price pill */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: 12,
          marginBottom: 6,
        }}
      >
        <div style={{ ...S, height: 22, flex: 1, borderRadius: 6 }} />
        <div
          style={{
            ...S,
            height: 22,
            width: 80,
            borderRadius: 100,
            flexShrink: 0,
          }}
        />
      </div>

      {/* Tagline */}
      <div
        style={{
          ...S,
          height: 14,
          width: "55%",
          borderRadius: 5,
          marginBottom: 12,
        }}
      />

      {/* Meta chips */}
      <div style={{ display: "flex", gap: 6, marginBottom: 10 }}>
        <div style={{ ...S, height: 26, width: 95, borderRadius: 100 }} />
        <div style={{ ...S, height: 26, width: 82, borderRadius: 100 }} />
      </div>

      {/* Area tags */}
      <div style={{ display: "flex", gap: 5, marginBottom: 10 }}>
        <div style={{ ...S, height: 20, width: 60, borderRadius: 5 }} />
        <div style={{ ...S, height: 20, width: 52, borderRadius: 5 }} />
        <div style={{ ...S, height: 20, width: 44, borderRadius: 5 }} />
      </div>

      {/* Stars + count */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 3,
          marginBottom: 10,
        }}
      >
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            style={{
              ...S,
              width: 13,
              height: 13,
              borderRadius: 3,
              flexShrink: 0,
            }}
          />
        ))}
        <div
          style={{
            ...S,
            height: 13,
            width: 28,
            borderRadius: 4,
            marginLeft: 5,
            flexShrink: 0,
          }}
        />
        <div style={{ ...S, height: 12, width: 60, borderRadius: 4 }} />
      </div>

      {/* "X people viewed today" */}
      <div
        style={{
          ...S,
          height: 12,
          width: "44%",
          borderRadius: 4,
          marginBottom: 14,
        }}
      />

      {/* Divider */}
      <div style={{ height: 1, background: "#E7E3DE", marginBottom: 14 }} />

      {/* Buttons */}
      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr 40px", gap: 7 }}
      >
        <div style={{ ...S, height: 40, borderRadius: 8 }} />
        <div style={{ ...S, height: 40, borderRadius: 8 }} />
        <div style={{ ...S, height: 40, width: 40, borderRadius: 8 }} />
      </div>
    </div>
  </div>
);

const ProvidersPageSkeleton: React.FC = () => (
  <>
    <style>{`
      @keyframes skshimmer {
        0%   { background-position: -200% 0 }
        100% { background-position:  200% 0 }
      }
      .sk-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 20px;
      }
      @media (max-width: 1100px) { .sk-grid { grid-template-columns: repeat(2,1fr); } }
      @media (max-width: 640px)  { .sk-grid { grid-template-columns: 1fr; } }
    `}</style>

    {/* Skeleton pills row — matches .z-pills */}
    <div
      style={{
        display: "flex",
        gap: 7,
        flexWrap: "wrap",
        paddingBottom: 28,
        borderBottom: "1px solid #E7E3DE",
        marginBottom: 28,
      }}
    >
      {[96, 130, 74, 88, 210, 84, 120].map((w, i) => (
        <div
          key={i}
          style={{ ...S, height: 36, width: w, borderRadius: 100 }}
        />
      ))}
    </div>

    {/* Results bar */}
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 24,
      }}
    >
      <div style={{ ...S, height: 18, width: 150, borderRadius: 6 }} />
    </div>

    {/* Card grid */}
    <div className="sk-grid">
      {Array.from({ length: 6 }).map((_, i) => (
        <SkeletonCard key={i} delay={i * 0.05} />
      ))}
    </div>
  </>
);

export default ProvidersPageSkeleton;
