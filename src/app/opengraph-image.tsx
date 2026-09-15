import { ImageResponse } from "next/og";
import { readFileSync } from "fs";
import { join } from "path";

export const alt = "shift culture";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const logoPath = join(
    process.cwd(),
    "public/brand/shift-culture-logo-outlined.png"
  );
  const logoSrc = `data:image/png;base64,${readFileSync(logoPath).toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0a0a0a",
          color: "#f7f6f3",
        }}
      >
        <img
          src={logoSrc}
          width={132}
          height={117}
          alt=""
          style={{ marginBottom: 36 }}
        />
        <div style={{ display: "flex", fontSize: 88 }}>shift culture</div>
        <div
          style={{
            display: "flex",
            fontSize: 26,
            letterSpacing: 6,
            textTransform: "uppercase",
            opacity: 0.55,
            marginTop: 28,
          }}
        >
          drop 001
        </div>
      </div>
    ),
    { ...size }
  );
}
