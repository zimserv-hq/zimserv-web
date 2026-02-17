// src/components/ProductSpecsDisplay.tsx
import type {
  CheckoutData,
  TShirtCheckoutData,
  FlagBannerCheckoutData,
  BottleCheckoutData,
  CanvasCheckoutData,
  CapCheckoutData,
} from "../types/checkout.types";

interface ProductSpecsDisplayProps {
  data: CheckoutData;
  className?: string;
}

const ProductSpecsDisplay = ({
  data,
  className = "item-specs",
}: ProductSpecsDisplayProps) => {
  // Helper to get cap color hex
  const getCapColorHex = (colorValue: string): string => {
    const colorMap: { [key: string]: string } = {
      white: "#FFFFFF",
      black: "#000000",
      red: "#DC143C",
      "navy-blue": "#001F3F",
      orange: "#FF6600",
      grey: "#6B6B6B",
      pink: "#FF69B4",
    };
    return colorMap[colorValue] || "#000000";
  };

  return (
    <div className={className}>
      {/* T-Shirt Details */}
      {data.productType === "tshirt" && (
        <>
          <div className="item-spec">
            <span className="item-spec-label">Type:</span>
            <span>
              {(data as TShirtCheckoutData).type
                .replace("-", " ")
                .toUpperCase()}
            </span>
          </div>
          <div className="item-spec">
            <span className="item-spec-label">Size:</span>
            <span>{data.size}</span>
          </div>
          <div className="item-spec">
            <span className="item-spec-label">Color:</span>
            <span
              className="color-swatch"
              style={{
                backgroundColor: (data as TShirtCheckoutData).color,
              }}
            />
          </div>
          <div className="item-spec">
            <span className="item-spec-label">Print Type:</span>
            <span>{(data as TShirtCheckoutData).printType.toUpperCase()}</span>
          </div>
          <div className="item-spec">
            <span className="item-spec-label">Print Locations:</span>
            <span>
              {(data as TShirtCheckoutData).printLocations.join(", ")}
            </span>
          </div>
        </>
      )}

      {/* Flag Banner Details */}
      {data.productType === "flag-banner" && (
        <>
          <div className="item-spec">
            <span className="item-spec-label">Size:</span>
            <span>{(data as FlagBannerCheckoutData).size}m</span>
          </div>
          <div className="item-spec">
            <span className="item-spec-label">Artwork:</span>
            <span>
              {(data as FlagBannerCheckoutData).needsArtwork
                ? "Professional Design Service"
                : "Own Artwork Provided"}
            </span>
          </div>
        </>
      )}

      {/* Bottle Details */}
      {data.productType === "bottle" && (
        <>
          <div className="item-spec">
            <span className="item-spec-label">Type:</span>
            <span>
              {(data as BottleCheckoutData).bottleType === "steel"
                ? "Stainless Steel"
                : "Plastic"}
            </span>
          </div>
          <div className="item-spec">
            <span className="item-spec-label">Size:</span>
            <span>{(data as BottleCheckoutData).size}</span>
          </div>
          <div className="item-spec">
            <span className="item-spec-label">Color:</span>
            <span
              className="color-swatch"
              style={{
                backgroundColor: (data as BottleCheckoutData).color,
              }}
            />
          </div>
          <div className="item-spec">
            <span className="item-spec-label">Print Type:</span>
            <span>
              {(data as BottleCheckoutData).printType === "screen" &&
                "Screen Printing"}
              {(data as BottleCheckoutData).printType === "digital" &&
                "Digital Printing"}
              {(data as BottleCheckoutData).printType === "laser" &&
                "Laser Engraving"}
              {(data as BottleCheckoutData).printType === "uv" && "UV Printing"}
            </span>
          </div>
          <div className="item-spec">
            <span className="item-spec-label">Print Area:</span>
            <span>
              {(data as BottleCheckoutData).printArea === "front"
                ? "Front Only"
                : "360° Wrap Around"}
            </span>
          </div>
          {(data as BottleCheckoutData).needsDesign && (
            <div className="item-spec">
              <span className="item-spec-label">Design Service:</span>
              <span style={{ color: "#e91e63", fontWeight: 600 }}>
                ✓ Included
              </span>
            </div>
          )}
        </>
      )}

      {/* ⭐ FIXED: Canvas Details - Matches your actual CanvasCheckoutData */}
      {data.productType === "canvas" && (
        <>
          <div className="item-spec">
            <span className="item-spec-label">Size:</span>
            <span>{(data as CanvasCheckoutData).size}</span>
          </div>
        </>
      )}

      {/* Cap Details */}
      {data.productType === "cap" && (
        <>
          <div className="item-spec">
            <span className="item-spec-label">Color:</span>
            <span
              className="color-swatch"
              style={{
                backgroundColor: getCapColorHex(
                  (data as CapCheckoutData).color,
                ),
                border:
                  (data as CapCheckoutData).color === "white"
                    ? "1px solid #d0d0d0"
                    : "none",
              }}
            />
            <span style={{ textTransform: "capitalize" }}>
              {(data as CapCheckoutData).color.replace("-", " ")}
            </span>
          </div>
          <div className="item-spec">
            <span className="item-spec-label">Panel Type:</span>
            <span>
              {(data as CapCheckoutData).panelType === "5-panel"
                ? "5 Panel"
                : "6 Panel"}
            </span>
          </div>
          <div className="item-spec">
            <span className="item-spec-label">Print Method:</span>
            <span>
              {(data as CapCheckoutData).printMethod === "embroidery" &&
                "Embroidery"}
              {(data as CapCheckoutData).printMethod === "heat-press" &&
                "Heat Press"}
              {(data as CapCheckoutData).printMethod === "screen-print" &&
                "Screen Print"}
            </span>
          </div>
          <div className="item-spec">
            <span className="item-spec-label">Artwork:</span>
            <span>
              {(data as CapCheckoutData).needsArtwork
                ? "Professional Design Service"
                : "Own Artwork Provided"}
            </span>
          </div>
        </>
      )}
    </div>
  );
};

export default ProductSpecsDisplay;
