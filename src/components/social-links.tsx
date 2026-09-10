type SocialLinksProps = {
  location: "header" | "footer";
};

const socialLinks = [
  {
    label: "Instagram d’Iltiŕ",
    href: "https://www.instagram.com/_iltir/",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
        <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.8" />
        <circle cx="12" cy="12" r="4.25" stroke="currentColor" strokeWidth="1.8" />
        <circle cx="17.4" cy="6.7" r="1" fill="currentColor" />
      </svg>
    ),
  },
  {
    label: "YouTube d’Iltiŕ",
    href: "https://www.youtube.com/@ILTI%C5%94_ILTIR",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
        <path
          d="M21 12c0-2.25-.25-4.05-.54-4.92a2.8 2.8 0 0 0-1.77-1.77C17.35 4.86 12 4.86 12 4.86s-5.35 0-6.69.45a2.8 2.8 0 0 0-1.77 1.77C3.25 7.95 3 9.75 3 12s.25 4.05.54 4.92a2.8 2.8 0 0 0 1.77 1.77c1.34.45 6.69.45 6.69.45s5.35 0 6.69-.45a2.8 2.8 0 0 0 1.77-1.77c.29-.87.54-2.67.54-4.92Z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
        <path d="m10.2 9.25 4.6 2.75-4.6 2.75v-5.5Z" fill="currentColor" />
      </svg>
    ),
  },
];

export function SocialLinks({ location }: SocialLinksProps) {
  return (
    <nav className={`social-links social-links--${location}`} aria-label="Xarxes socials d’Iltiŕ">
      {socialLinks.map(({ label, href, icon }) => (
        <a key={label} href={href} aria-label={label} target="_blank" rel="noopener noreferrer">
          {icon}
        </a>
      ))}
    </nav>
  );
}
