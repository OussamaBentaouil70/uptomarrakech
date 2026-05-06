import { ImageResponse } from "next/og";

export const runtime = "nodejs";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 24,
          background: "#F8F2E8",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            fontSize: 20,
            fontWeight: "bold",
            color: "#C39A5A",
          }}
        >
          MMT
        </div>
      </div>
    ),
    {
      width: 32,
      height: 32,
    }
  );
}
