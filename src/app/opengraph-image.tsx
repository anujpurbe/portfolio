import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Anuj Purbe — Computer Engineering Undergraduate";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#09090f",
          color: "#f4f4f5",
          padding: "72px 80px",
          fontFamily: "ui-sans-serif, system-ui, sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 48,
              height: 48,
              borderRadius: 12,
              backgroundColor: "#5b8cff",
              color: "#09090f",
              fontSize: 22,
              fontWeight: 700,
            }}
          >
            AP
          </div>
          <div style={{ fontSize: 22, color: "#a1a1aa" }}>
            Computer Engineering Undergraduate
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 72, fontWeight: 700, letterSpacing: -2 }}>
            Anuj Purbe
          </div>
          <div
            style={{
              marginTop: 16,
              fontSize: 28,
              lineHeight: 1.5,
              color: "#a1a1aa",
              maxWidth: 820,
            }}
          >
            I build efficient, well-structured software — grounded in data
            structures, algorithms, and systems thinking.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            color: "#a1a1aa",
            fontSize: 20,
          }}
        >
          <span
            style={{
              width: 10,
              height: 10,
              borderRadius: 999,
              backgroundColor: "#34d399",
            }}
          />
          Open to Software Engineering Internships
        </div>
      </div>
    ),
    { ...size },
  );
}
