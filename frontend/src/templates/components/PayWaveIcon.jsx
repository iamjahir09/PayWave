
function PayWaveIcon({ name, size = 28, color = "#172B3A" }) {
  const common = {
    fill: "none",
    stroke: color,
    strokeWidth: 2.2,
    strokeLinecap: "round",
    strokeLinejoin: "round",
  };

  const orange = {
    fill: "none",
    stroke: "#F28C28",
    strokeWidth: 2.2,
    strokeLinecap: "round",
    strokeLinejoin: "round",
  };

  const icons = {
    send: (
      <>
        <path {...common} d="M8 34 38 8 27 40 21 26 8 34Z" />
        <path {...common} d="m21 26 17-18" />
        <path {...orange} d="M29 8h9v9" />
        <path {...orange} d="M8 40c6 2 11 1 16-2" />
      </>
    ),

    receive: (
      <>
        <path {...common} d="M40 14 10 40l11-32 6 14 13-8Z" />
        <path {...common} d="m27 22-17 18" />
        <path {...orange} d="M10 31v9h9" />
        <path {...orange} d="M40 7c-5-2-10-1-15 2" />
      </>
    ),

    scan: (
      <>
        <path {...common} d="M17 7H9a2 2 0 0 0-2 2v8" />
        <path {...common} d="M31 7h8a2 2 0 0 1 2 2v8" />
        <path {...common} d="M7 31v8a2 2 0 0 0 2 2h8" />
        <path {...common} d="M41 31v8a2 2 0 0 1-2 2h-8" />
        <path {...common} d="M16 16h7v7h-7zM27 16h6v7h-6zM16 27h7v6h-7z" />
        <path {...orange} d="M28 28h2v2h-2zM33 33h4" />
      </>
    ),

    bank: (
      <>
        <path {...common} d="m6 18 18-11 18 11H6Z" />
        <path {...common} d="M9 21h30M7 40h34" />
        <path {...common} d="M12 23v14M20 23v14M28 23v14M36 23v14" />
        <path {...orange} d="M18 14h12" />
      </>
    ),

    home: (
      <>
        <path {...common} d="m6 22 18-15 18 15" />
        <path {...common} d="M11 20v20h26V20" />
        <path {...common} d="M20 40V28h8v12" />
        <path {...orange} d="M34 12c3 2 5 4 7 7" />
      </>
    ),

    history: (
      <>
        <path {...common} d="M8 17a17 17 0 1 1-2 13" />
        <path {...common} d="M6 8v10h10" />
        <path {...common} d="M24 14v11l8 5" />
        <path {...orange} d="M24 14v11" />
      </>
    ),

    wallet: (
      <>
        <path {...common} d="M9 13h27a4 4 0 0 1 4 4v20H10a4 4 0 0 1-4-4V12a5 5 0 0 1 5-5h23" />
        <path {...common} d="M6 14h30a4 4 0 0 1 4 4v4H27a5 5 0 0 0 0 10h13" />
        <path {...orange} d="M29 27h2" />
      </>
    ),

    profile: (
      <>
        <circle {...common} cx="24" cy="15" r="8" />
        <path {...common} d="M8 41c1-9 7-14 16-14s15 5 16 14H8Z" />
        <path {...orange} d="M17 35c4 3 10 3 14 0" />
      </>
    ),

    upi: (
      <>
        <path {...common} d="M8 13h32v22H8z" />
        <path {...common} d="M14 20h20M14 27h12" />
        <path {...orange} d="m29 31 5-4-5-4" />
      </>
    ),

    security: (
      <>
        <path {...common} d="M24 5 39 11v11c0 10-6 17-15 21C15 39 9 32 9 22V11l15-6Z" />
        <path {...common} d="m17 24 5 5 10-11" />
        <path {...orange} d="m22 29 5-5" />
      </>
    ),

    support: (
      <>
        <path {...common} d="M7 25v-4a17 17 0 0 1 34 0v4" />
        <path {...common} d="M7 24h5v11H9a3 3 0 0 1-3-3v-5a3 3 0 0 1 1-3Z" />
        <path {...common} d="M41 24h-5v11h3a3 3 0 0 0 3-3v-5a3 3 0 0 0-1-3Z" />
        <path {...common} d="M36 35c-2 5-6 6-12 6" />
        <path {...orange} d="M24 41h-4" />
      </>
    ),

    mobile: (
      <>
        <rect {...common} x="13" y="5" width="22" height="38" rx="5" />
        <path {...common} d="M19 10h10M19 36h10" />
        <path {...orange} d="M24 17v10M19 22h10" />
      </>
    ),

    electricity: (
      <>
        <path {...common} d="M27 5 12 27h12l-3 16 16-23H25l2-15Z" />
        <path {...orange} d="M27 5 25 20M18 33h8" />
      </>
    ),

    television: (
      <>
        <rect {...common} x="6" y="10" width="36" height="26" rx="4" />
        <path {...common} d="m17 5 7 5 7-5M17 41h14M24 36v5" />
        <path {...orange} d="M13 17h22v12H13z" />
      </>
    ),

    water: (
      <>
        <path {...common} d="M24 5C19 13 11 22 11 29a13 13 0 0 0 26 0c0-7-8-16-13-24Z" />
        <path {...orange} d="M17 29c0 4 3 7 7 7" />
        <path {...common} d="M30 23c2 2 3 4 3 7" />
      </>
    ),

    split: (
      <>
        <path {...common} d="M10 12h12a7 7 0 0 1 7 7v10a7 7 0 0 0 7 7h3" />
        <path {...common} d="m33 30 6 6-6 6" />
        <path {...common} d="M10 36h5a7 7 0 0 0 7-7V19a7 7 0 0 1 7-7h4" />
        <path {...orange} d="m28 6 6 6-6 6" />
        <circle cx="10" cy="12" r="3" fill="#F28C28" />
        <circle cx="10" cy="36" r="3" fill="#F28C28" />
      </>
    ),

    request: (
      <>
        <path {...common} d="M9 13h30v25H9z" />
        <path {...common} d="M16 20h16M16 26h9M24 32h10" />
        <path {...orange} d="m29 27 5 5-5 5" />
      </>
    ),

    reminder: (
      <>
        <path {...common} d="M12 32h24l-3-5V19a9 9 0 0 0-18 0v8l-3 5Z" />
        <path {...common} d="M20 37a4 4 0 0 0 8 0" />
        <path {...orange} d="M24 14v9l5 3M7 17c1-5 4-9 8-11" />
      </>
    ),
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      aria-hidden="true"
    >
      {icons[name] || icons.home}
    </svg>
  );
}

export default PayWaveIcon;
