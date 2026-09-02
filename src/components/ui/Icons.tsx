import type { ReactElement } from "react";

type LineIconProps = {
  color?: string;
  size?: number;
  strokeWidth?: number;
};

/* ============================================================
 * Flaticon Style Vector Icons (https://www.flaticon.com/)
 * ============================================================ */

const CHICKEN_PATH =
  "M65.0,11.0L73.0,28.0L76.0,23.0L80.0,11.0L88.0,25.0L93.0,11.0L94.0,16.0L98.0,24.0L102.0,20.0L110.0,19.0L115.0,23.0L117.0,27.0L117.0,35.0L114.0,43.0L101.0,54.0L99.0,59.0L100.0,67.0L110.0,78.0L111.0,81.0L110.0,88.0L107.0,96.0L103.0,102.0L99.0,104.0L91.0,104.0L87.0,108.0L83.0,124.0L81.0,128.0L74.0,134.0L69.0,133.0L64.0,130.0L60.0,126.0L56.0,118.0L56.0,102.0L61.0,89.0L61.0,82.0L57.0,79.0L49.0,79.0L48.0,80.0L39.0,79.0L36.0,77.0L32.0,65.0L34.0,54.0L39.0,47.0L40.0,35.0L46.0,38.0L49.0,37.0L49.0,20.0L60.0,31.0L62.0,29.0L65.0,11.0ZM117.0,55.0L135.0,65.0L147.0,77.0L154.0,88.0L159.0,102.0L169.0,121.0L177.0,132.0L192.0,147.0L202.0,154.0L214.0,160.0L235.0,166.0L257.0,167.0L258.0,166.0L267.0,166.0L275.0,164.0L308.0,162.0L309.0,161.0L329.0,159.0L359.0,152.0L377.0,144.0L405.0,117.0L429.0,99.0L431.0,98.0L444.0,99.0L451.0,103.0L451.0,106.0L449.0,110.0L457.0,114.0L460.0,118.0L460.0,126.0L456.0,132.0L460.0,140.0L460.0,148.0L457.0,154.0L453.0,158.0L446.0,162.0L458.0,165.0L460.0,167.0L460.0,170.0L458.0,174.0L451.0,181.0L457.0,186.0L457.0,191.0L455.0,195.0L449.0,201.0L441.0,206.0L438.0,211.0L437.0,216.0L437.0,243.0L436.0,244.0L439.0,255.0L438.0,271.0L436.0,275.0L428.0,281.0L427.0,299.0L424.0,306.0L420.0,310.0L419.0,321.0L415.0,334.0L405.0,353.0L398.0,362.0L387.0,373.0L373.0,383.0L360.0,390.0L340.0,408.0L333.0,411.0L321.0,411.0L313.0,408.0L304.0,401.0L298.0,398.0L291.0,396.0L281.0,396.0L269.0,401.0L261.0,407.0L258.0,411.0L249.0,414.0L234.0,414.0L221.0,409.0L210.0,398.0L202.0,382.0L193.0,369.0L177.0,353.0L148.0,334.0L133.0,322.0L114.0,303.0L104.0,289.0L82.0,245.0L74.0,222.0L68.0,191.0L68.0,158.0L69.0,157.0L69.0,145.0L76.0,145.0L83.0,142.0L92.0,131.0L97.0,115.0L101.0,115.0L109.0,111.0L114.0,106.0L120.0,95.0L122.0,86.0L121.0,74.0L116.0,65.0L111.0,61.0L111.0,59.0L117.0,55.0ZM86.0,68.0L87.0,65.0L84.0,63.0L75.0,63.0L68.0,70.0L73.0,73.0L80.0,73.0L86.0,68.0ZM24.0,78.0L25.0,81.0L19.0,88.0L20.0,89.0L26.0,83.0L33.0,88.0L27.0,88.0L16.0,93.0L16.0,90.0L19.0,83.0L24.0,78.0ZM461.0,89.0L475.0,89.0L485.0,92.0L486.0,97.0L484.0,100.0L491.0,104.0L495.0,109.0L495.0,117.0L491.0,123.0L495.0,131.0L495.0,139.0L492.0,145.0L481.0,153.0L482.0,154.0L492.0,155.0L495.0,158.0L495.0,161.0L493.0,165.0L487.0,171.0L492.0,177.0L492.0,182.0L490.0,186.0L485.0,191.0L474.0,198.0L467.0,205.0L463.0,212.0L456.0,233.0L451.0,241.0L448.0,243.0L448.0,219.0L449.0,214.0L458.0,208.0L467.0,197.0L468.0,194.0L467.0,180.0L471.0,173.0L471.0,165.0L470.0,162.0L467.0,159.0L471.0,151.0L471.0,138.0L469.0,132.0L471.0,128.0L472.0,120.0L470.0,113.0L462.0,104.0L461.0,98.0L454.0,91.0L461.0,89.0ZM136.0,131.0L145.0,140.0L150.0,150.0L152.0,147.0L152.0,142.0L149.0,136.0L145.0,132.0L139.0,129.0L135.0,130.0ZM119.0,146.0L124.0,154.0L126.0,161.0L126.0,166.0L127.0,167.0L130.0,163.0L131.0,159.0L130.0,154.0L128.0,150.0L122.0,144.0L119.0,143.0L118.0,145.0ZM134.0,147.0L136.0,154.0L136.0,166.0L137.0,167.0L141.0,163.0L142.0,154.0L139.0,147.0L135.0,143.0L133.0,144.0L133.0,146.0ZM164.0,157.0L170.0,168.0L171.0,176.0L173.0,178.0L175.0,176.0L176.0,167.0L173.0,161.0L169.0,157.0L165.0,155.0L163.0,156.0ZM148.0,161.0L152.0,170.0L153.0,182.0L154.0,183.0L158.0,177.0L158.0,170.0L156.0,165.0L150.0,159.0L148.0,158.0L147.0,160.0ZM121.0,172.0L126.0,180.0L128.0,186.0L128.0,192.0L129.0,193.0L131.0,192.0L133.0,188.0L133.0,182.0L130.0,176.0L126.0,172.0L123.0,170.0L120.0,171.0ZM140.0,181.0L146.0,191.0L148.0,202.0L149.0,203.0L152.0,198.0L151.0,188.0L145.0,181.0L141.0,179.0L139.0,180.0ZM159.0,191.0L167.0,203.0L168.0,210.0L170.0,211.0L172.0,208.0L172.0,200.0L165.0,191.0L161.0,189.0L158.0,190.0ZM136.0,203.0L139.0,213.0L138.0,223.0L139.0,224.0L144.0,218.0L144.0,209.0L141.0,203.0L137.0,199.0L135.0,200.0L135.0,202.0ZM336.0,241.0L375.0,242.0L404.0,248.0L405.0,247.0L404.0,246.0L385.0,239.0L359.0,234.0L324.0,234.0L323.0,235.0L305.0,237.0L286.0,242.0L262.0,251.0L237.0,264.0L226.0,271.0L215.0,280.0L217.0,281.0L245.0,266.0L284.0,251.0L313.0,244.0L325.0,243.0L326.0,242.0L335.0,242.0L336.0,241.0ZM356.0,409.0L364.0,459.0L371.0,467.0L394.0,479.0L389.0,483.0L380.0,483.0L372.0,479.0L371.0,480.0L370.0,490.0L368.0,494.0L363.0,499.0L359.0,501.0L353.0,500.0L348.0,495.0L310.0,496.0L309.0,495.0L299.0,495.0L294.0,493.0L291.0,494.0L288.0,497.0L289.0,491.0L294.0,487.0L340.0,485.0L348.0,483.0L341.0,420.0L348.0,416.0L356.0,409.0ZM224.0,423.0L240.0,426.0L251.0,425.0L217.0,477.0L231.0,487.0L237.0,489.0L239.0,492.0L239.0,498.0L237.0,494.0L235.0,493.0L231.0,494.0L225.0,487.0L220.0,485.0L214.0,485.0L208.0,492.0L204.0,494.0L192.0,494.0L191.0,493.0L156.0,494.0L155.0,493.0L140.0,493.0L134.0,490.0L129.0,491.0L126.0,493.0L129.0,489.0L139.0,485.0L156.0,484.0L157.0,483.0L165.0,483.0L175.0,481.0L188.0,474.0L194.0,468.0L224.0,423.0Z";

/** Celé kura / Sliepka (Flaticon Poultry silhouette) */
export function ChickenLineIcon({ color = "#135E4B", size = 24 }: LineIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 512 512" fill="none">
      <path d={CHICKEN_PATH} fill={color} fillRule="evenodd" />
    </svg>
  );
}

/** Kurací erb / ikona (plná / fázová) */
export function ChickenIcon({ color = "rgba(255,255,255,0.9)", size = 26 }: LineIconProps) {
  return <ChickenLineIcon color={color} size={size} />;
}

/** Naporcované kura / stehno (Flaticon Drumstick) */
export function DrumstickIcon({ color = "#135E4B", size = 24, strokeWidth = 1.8 }: LineIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* Mäsová časť */}
      <path
        d="M18.8 4.2C16.4 1.8 12.5 2.2 9.8 4.9C7.8 6.9 7.2 9.8 8.1 12.2L4.6 15.7C4.1 15.3 3.4 15.3 2.9 15.8C2.3 16.4 2.3 17.3 2.9 17.9C3.1 18.1 3.1 18.4 2.9 18.6C2.3 19.2 2.3 20.1 2.9 20.7C3.5 21.3 4.4 21.3 5 20.7C5.2 20.5 5.5 20.5 5.7 20.7C6.3 21.3 7.2 21.3 7.8 20.7C8.3 20.2 8.3 19.5 7.9 19L11.4 15.5C13.8 16.4 16.7 15.8 18.7 13.8C21.4 11.1 21.2 6.6 18.8 4.2Z"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Zárez na pečenom mäsku */}
      <path
        d="M13.5 7.5C14.5 8.5 15.5 9.5 16.5 10.5"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Len prsia / steak (Flaticon Meat Cutlet) */
export function MeatIcon({ color = "#135E4B", size = 24, strokeWidth = 1.8 }: LineIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* Obrys steaku / mäsa */}
      <path
        d="M19.5 7.5C21.5 11 20 16 16.5 18.5C13 21 8.5 20.5 5 18C2.5 16 2.5 12.5 4.5 9.5C6.5 6.5 11 4 15 4.5C17.5 4.8 18.5 6 19.5 7.5Z"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Kosť / mramorovanie v strede */}
      <circle cx="10" cy="11.5" r="2.5" stroke={color} strokeWidth={strokeWidth} />
      <path
        d="M12.5 12.5C14.5 13.5 16.5 14 17.5 13"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Krmivo / pšeničný klas (Flaticon Wheat Grain) */
export function FeedIcon({ color = "#135E4B", size = 24, strokeWidth = 1.8 }: LineIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* Hlavná stonka */}
      <path d="M4 20L11 13M11 13L20 4M11 13L15 9" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      {/* Zrná v pároch */}
      <path d="M11 5C11 7 13 8 15 8C15 6 14 4 11 5Z" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M15 9C17 9 18 11 18 13C16 13 14 12 15 9Z" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8 8C8 10 10 11 12 11C12 9 11 7 8 8Z" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 12C14 12 15 14 15 16C13 16 11 15 12 12Z" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 11C5 13 7 14 9 14C9 12 8 10 5 11Z" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 15C11 15 12 17 12 19C10 19 8 18 9 15Z" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Lieky / kapsula a tabletka (Flaticon Medication / Pills) */
export function MedicationIcon({ color = "#135E4B", size = 24, strokeWidth = 1.8 }: LineIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* Kapsula */}
      <rect x="3.5" y="7.5" width="13" height="7" rx="3.5" transform="rotate(-45 10 11)" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
      <line x1="7.5" y1="8.5" x2="12.5" y2="13.5" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      {/* Guľatá tabletka */}
      <circle cx="17.5" cy="17.5" r="4" stroke={color} strokeWidth={strokeWidth} />
      <line x1="15" y1="17.5" x2="20" y2="17.5" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    </svg>
  );
}

/** Materiál / kľúč (Flaticon Wrench Tool) */
export function ToolIcon({ color = "#135E4B", size = 24, strokeWidth = 1.8 }: LineIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M14.7 6.3C13.5 5.1 11.7 4.7 10.1 5.3L12.5 7.7L10.7 9.5L8.3 7.1C7.7 8.7 8.1 10.5 9.3 11.7C10.3 12.7 11.7 13.1 13 12.8L18.4 18.2C19 18.8 20 18.8 20.6 18.2C21.2 17.6 21.2 16.6 20.6 16L15.2 10.6C15.5 9.3 15.1 7.9 14.7 6.3Z"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="6.5" cy="17.5" r="3" stroke={color} strokeWidth={strokeWidth} />
      <line x1="4.5" y1="17.5" x2="8.5" y2="17.5" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    </svg>
  );
}

/** Balík / krabica (Flaticon Package) */
export function PackageIcon({ color = "#135E4B", size = 24, strokeWidth = 1.8 }: LineIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M12 3L20 7.5V16.5L12 21L4 16.5V7.5L12 3Z"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M12 12V21M12 12L20 7.5M12 12L4 7.5" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7.5 5.5L15.5 10" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    </svg>
  );
}

/** Zákazník / profil (Flaticon User) */
export function UserIcon({ color = "#135E4B", size = 24, strokeWidth = 1.8 }: LineIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* Hlava */}
      <circle cx="12" cy="7.5" r="4" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
      {/* Telo / ramená */}
      <path
        d="M4.5 20C4.5 16.4 7.9 13.5 12 13.5C16.1 13.5 19.5 16.4 19.5 20"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Objednávky / zoznam (Flaticon Clipboard List) */
export function ClipboardIcon({ color = "#135E4B", size = 24, strokeWidth = 1.8 }: LineIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* Doska */}
      <rect x="4" y="5" width="16" height="16" rx="3" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
      {/* Klip */}
      <path
        d="M9 5V4C9 3.4 9.4 3 10 3H14C14.6 3 15 3.4 15 4V5"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Riadky */}
      <line x1="8" y1="10" x2="16" y2="10" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      <line x1="8" y1="14" x2="14" y2="14" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      <line x1="8" y1="18" x2="12" y2="18" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    </svg>
  );
}

/** Nákupy / taška (Flaticon Shopping Bag) */
export function ShoppingBagIcon({ color = "#135E4B", size = 24, strokeWidth = 1.8 }: LineIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* Telo tašky */}
      <path
        d="M5 8.5H19L17.5 20.5C17.4 21.3 16.7 22 15.9 22H8.1C7.3 22 6.6 21.3 6.5 20.5L5 8.5Z"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Rukoväť */}
      <path
        d="M9 11V6.5C9 4.8 10.3 3.5 12 3.5C13.7 3.5 15 4.8 15 6.5V11"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function BagIcon() {
  return <ShoppingBagIcon color="rgba(255,255,255,0.7)" size={20} strokeWidth={1.8} />;
}

/** Zabijačka / mäsiarsky nôž / sekáč (Flaticon Cleaver Knife) */
export function KnifeIcon({ color = "#135E4B", size = 24, strokeWidth = 1.8 }: LineIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* Sekáč / čepeľ */}
      <path
        d="M3 5H18C18.6 5 19 5.4 19 6V13C19 14.7 17.7 16 16 16H3V5Z"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Otvor na zavesenie */}
      <circle cx="15.5" cy="8" r="1" fill={color} />
      {/* Rukoväť */}
      <path
        d="M3 13.5V18.5C3 19.3 3.7 20 4.5 20C5.3 20 6 19.3 6 18.5V16"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Štatistiky / graf (Flaticon Analytics Bar Chart) */
export function ChartIcon({ color = "#135E4B", size = 24, strokeWidth = 1.8 }: LineIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* Osy */}
      <path d="M3 20.5H21" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      {/* Stĺpce */}
      <rect x="5" y="13" width="3.5" height="7.5" rx="1.5" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
      <rect x="10.25" y="8" width="3.5" height="12.5" rx="1.5" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
      <rect x="15.5" y="4" width="3.5" height="16.5" rx="1.5" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Úhyn / lebka (Flaticon Skull) */
export function SkullIcon({ color = "#C0392B", size = 24, strokeWidth = 1.8 }: LineIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* Hlava lebky */}
      <path
        d="M12 2.5C6.8 2.5 3 6.3 3 11.5C3 14.8 5 17.5 7.5 18.8V20C7.5 20.8 8.2 21.5 9 21.5H15C15.8 21.5 16.5 20.8 16.5 20V18.8C19 17.5 21 14.8 21 11.5C21 6.3 17.2 2.5 12 2.5Z"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Očné jamky */}
      <circle cx="8.5" cy="11.5" r="1.8" fill={color} />
      <circle cx="15.5" cy="11.5" r="1.8" fill={color} />
      {/* Nosný otvor */}
      <path d="M12 14.5L11.5 16H12.5L12 14.5Z" fill={color} />
      {/* Zuby */}
      <line x1="10" y1="19" x2="10" y2="21.5" stroke={color} strokeWidth={strokeWidth * 0.8} />
      <line x1="14" y1="19" x2="14" y2="21.5" stroke={color} strokeWidth={strokeWidth * 0.8} />
    </svg>
  );
}

/** Peniaze / bankovka (Flaticon Cash Note) */
export function MoneyIcon({ color = "#135E4B", size = 24, strokeWidth = 1.8 }: LineIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect x="2.5" y="5.5" width="19" height="13" rx="2.5" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="12" r="3.5" stroke={color} strokeWidth={strokeWidth} />
      <path d="M6 9V9.01M18 15V15.01" stroke={color} strokeWidth={strokeWidth * 1.2} strokeLinecap="round" />
    </svg>
  );
}

/** Euro v kruhu (Flaticon Euro Coin) */
export function EuroIcon({ color = "#111111", size = 20, strokeWidth = 1.8 }: LineIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9.5" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
      <path
        d="M15.5 8C14.5 7 13 6.5 11.5 7C9.5 7.8 8.5 10 8.5 12C8.5 14 9.5 16.2 11.5 17C13 17.5 14.5 17 15.5 16"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <line x1="7" y1="10.5" x2="13.5" y2="10.5" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      <line x1="7" y1="13.5" x2="13.5" y2="13.5" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    </svg>
  );
}

/** Účtenka s € (Flaticon Receipt Euro) */
export function ReceiptEuroIcon({ color = "#135E4B", size = 20, strokeWidth = 1.8 }: LineIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M5 3.5V20.5L7.5 19L10 20.5L12 19L14 20.5L16.5 19L19 20.5V3.5C19 2.7 18.3 2 17.5 2H6.5C5.7 2 5 2.7 5 3.5Z"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <line x1="8.5" y1="6.5" x2="15.5" y2="6.5" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      <line x1="8.5" y1="10" x2="13" y2="10" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      <path d="M13.5 13.5C12.5 13 11.5 13.5 11 14.5C10.5 15.5 11 16.5 12 17C13 17.5 14 17 14.5 16" stroke={color} strokeWidth={strokeWidth * 0.9} strokeLinecap="round" />
      <line x1="9.5" y1="14.8" x2="13" y2="14.8" stroke={color} strokeWidth={strokeWidth * 0.8} strokeLinecap="round" />
      <line x1="9.5" y1="16.2" x2="13" y2="16.2" stroke={color} strokeWidth={strokeWidth * 0.8} strokeLinecap="round" />
    </svg>
  );
}

/** Telefón (Flaticon Phone Handset) */
export function PhoneIcon({ color = "#135E4B", size = 24, strokeWidth = 1.8 }: LineIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M5.5 3.5H9L10.5 7.5L8.5 9.5C9.8 12.3 11.7 14.2 14.5 15.5L16.5 13.5L20.5 15V18.5C20.5 19.6 19.6 20.5 18.5 20.5C10.2 20.5 3.5 13.8 3.5 5.5C3.5 4.4 4.4 3.5 5.5 3.5Z"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Kalendár (Flaticon Calendar) */
export function CalendarIcon({ color = "#4CB572", size = 18, strokeWidth = 1.8 }: LineIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect x="3.5" y="5.5" width="17" height="15" rx="3" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
      <line x1="3.5" y1="10" x2="20.5" y2="10" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      <line x1="8" y1="3" x2="8" y2="6.5" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      <line x1="16" y1="3" x2="16" y2="6.5" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      <circle cx="8" cy="14" r="1" fill={color} />
      <circle cx="12" cy="14" r="1" fill={color} />
      <circle cx="16" cy="14" r="1" fill={color} />
    </svg>
  );
}

/** Klíčok / rast (Flaticon Sprout) */
export function SproutIcon({ color = "#FFFFFF", size = 20, strokeWidth = 1.8 }: LineIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M12 21V10" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      <path
        d="M12 10C12 5.5 7.5 5 7.5 5C7.5 9.5 12 10 12 10Z"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 13C12 9.5 16 9 16 9C16 12.5 12 13 12 13Z"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M5 21H19" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    </svg>
  );
}

/** Vyhľadávanie (Flaticon Search) */
export function SearchIcon({ color = "#135E4B", size = 16, strokeWidth = 1.8 }: LineIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="11" cy="11" r="7" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
      <line x1="16.5" y1="16.5" x2="21" y2="21" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    </svg>
  );
}

/** Filter (Flaticon Filter Funnel) */
export function FilterIcon({ color = "#135E4B", size = 16, strokeWidth = 1.8 }: LineIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M4 5H20L14 12.5V18.5L10 20.5V12.5L4 5Z"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Checkmark (Flaticon Check) */
export function CheckIcon({ color = "white", size = 14, strokeWidth = 2.4 }: LineIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M4.5 12.5L9.5 17.5L19.5 6.5" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function CheckSmallIcon({ color = "white", size = 12 }: LineIconProps) {
  return <CheckIcon color={color} size={size} strokeWidth={2.4} />;
}

/** Krížik / Zavrieť (Flaticon Close) */
export function CloseIcon({ color = "white", size = 18, strokeWidth = 2.2 }: LineIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <line x1="5" y1="5" x2="19" y2="19" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      <line x1="19" y1="5" x2="5" y2="19" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    </svg>
  );
}

/** Vypnutie / Odhlásenie (power ikona) */
export function PowerIcon({ color = "#135E4B", size = 18, strokeWidth = 2 }: LineIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M12 2.8v8.4" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      <path d="M18.4 6.6a9 9 0 1 1-12.8 0" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Plus (Flaticon Plus) */
export function PlusIcon({ color = "white", size = 20, strokeWidth = 2.2 }: LineIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <line x1="12" y1="4" x2="12" y2="20" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      <line x1="4" y1="12" x2="20" y2="12" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    </svg>
  );
}

/** Kruh (Flaticon Circle) */
export function CircleIcon({ color = "#111111", size = 20, strokeWidth = 1.8 }: LineIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9.5" stroke={color} strokeWidth={strokeWidth} />
    </svg>
  );
}

/** Hamburger Menu (Flaticon Menu) */
export function BurgerIcon({ color = "white", size = 22, strokeWidth = 2 }: LineIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <line x1="4" y1="6" x2="20" y2="6" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      <line x1="4" y1="12" x2="20" y2="12" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      <line x1="4" y1="18" x2="20" y2="18" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    </svg>
  );
}

/** Šípka späť (Flaticon Angle Left) */
export function BackIcon({ color = "#135E4B", size = 18, strokeWidth = 2.2 }: LineIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M15 19L8 12L15 5" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Chevron doprava (Flaticon Angle Right) */
export function ChevronRightIcon({ color = "#BBBBBB", size = 16, strokeWidth = 2 }: LineIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M9 5L16 12L9 19" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Chevron dole (Flaticon Angle Down) */
export function ChevronDownIcon({ color = "#135E4B", rotated = false, size = 16, strokeWidth = 2 }: { color?: string; rotated?: boolean; size?: number; strokeWidth?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      style={{
        transform: rotated ? "rotate(180deg)" : "none",
        transition: "transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      <path d="M6 9L12 15L18 9" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Šípka doľava (Flaticon Arrow Left) */
export function ArrowLeftIcon({ color = "#135E4B", size = 18, strokeWidth = 2 }: LineIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M19 12H5M5 12L11 6M5 12L11 18" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Šípka doprava (Flaticon Arrow Right) */
export function ArrowRightIcon({ color = "#135E4B", size = 18, strokeWidth = 2 }: LineIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M5 12H19M19 12L13 6M19 12L13 18" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ============================================================
 * Mapovania ikon (kľúč → React element)
 * ============================================================ */

/** Kategórie výdavkov */
export const expenseIcons: Record<string, ReactElement> = {
  krmivo: <FeedIcon size={20} />,
  lek: <MedicationIcon size={20} />,
  material: <ToolIcon size={20} />,
  kurcata: <ChickenLineIcon size={20} />,
  ine: <PackageIcon size={20} />,
};

/** Typy produktov */
export const productIcons: Record<string, ReactElement> = {
  cele: <ChickenLineIcon size={20} />,
  porcie: <DrumstickIcon size={20} />,
  prsia: <MeatIcon size={20} />,
};

/** Navigačné menu */
export const menuIcons: Record<string, ReactElement> = {
  zakaznici: <UserIcon size={22} color="#135E4B" />,
  objednavky: <ClipboardIcon size={22} color="#135E4B" />,
  nakupy: <ShoppingBagIcon size={22} color="#135E4B" />,
  zabijacka: <KnifeIcon size={22} color="#135E4B" />,
  statistiky: <ChartIcon size={22} color="#135E4B" />,
};