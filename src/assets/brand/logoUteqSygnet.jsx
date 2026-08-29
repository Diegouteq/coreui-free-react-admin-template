import React from 'react'

const LogoUteqSygnet = ({
  width = 32,
  height = 32,
  className = '',
  title = 'Smart Parking UTEQ',
  ...props
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 116 116"
    width={width}
    height={height}
    className={className}
    role="img"
    aria-label={title}
    {...props}
  >
    <title>{title}</title>

    <g fill="none" fillRule="evenodd">
      <rect x="6" y="8" width="100" height="100" rx="24" fill="#00843D" />
      <rect x="13" y="15" width="86" height="86" rx="19" stroke="#7EE2A8" strokeWidth="2" />
      <path
        fill="#FFFFFF"
        fillRule="nonzero"
        d="M28 29h31.5C79.3 29 91 39.2 91 55.5S79.3 82 59.5 82H49v15H28V29Zm21 17v19h10.5C66.8 65 71 61.6 71 55.5S66.8 46 59.5 46H49Z"
      />
      <path
        d="M68 28c8.8 0 16.6 3.9 22 10"
        stroke="#80D0FF"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path
        d="M72 37c5.1 0 9.8 2.2 13 5.8"
        stroke="#80D0FF"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <circle cx="78" cy="48" r="3.5" fill="#80D0FF" />
      <circle cx="87" cy="89" r="8" fill="#7EE2A8" />
      <path
        d="m83.5 89 2.4 2.5 4.8-5"
        stroke="#00843D"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
  </svg>
)

export { LogoUteqSygnet }
export default LogoUteqSygnet
