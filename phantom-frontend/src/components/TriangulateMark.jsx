import { motion } from "framer-motion";
import PropTypes from "prop-types";

export function TriangulateMark({ size = 32, className, animate = true }) {
  const Wrapper = animate ? motion.svg : "svg";
  const wrapperProps = animate
    ? {
        initial: "rest",
        whileHover: "hover",
        animate: "rest",
        variants: {
          rest: {},
          hover: {},
        },
      }
    : {};

  return (
    <Wrapper
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      className={className}
      aria-hidden="true"
      {...wrapperProps}
    >
      <defs>
        <linearGradient id="tm-bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0B0F19" />
          <stop offset="100%" stopColor="#1E293B" />
        </linearGradient>
        <linearGradient id="tm-line" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00F2FE" />
          <stop offset="100%" stopColor="#8FF7FF" />
        </linearGradient>
        <radialGradient id="tm-node" cx="35%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#00F2FE" />
        </radialGradient>
        <filter id="tm-glow" x="-120%" y="-120%" width="340%" height="340%">
          <feGaussianBlur stdDeviation="3.2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <rect x="0" y="0" width="100" height="100" rx="24" fill="url(#tm-bg)" />

      <motion.circle
        cx="50"
        cy="55"
        r="15"
        fill="none"
        stroke="#00F2FE"
        strokeWidth="1.3"
        strokeDasharray="6.5 6"
        opacity="0.4"
        variants={{
          rest: { rotate: 0 },
          hover: { rotate: 90 },
        }}
        transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
        style={{ transformOrigin: "50px 55px" }}
      />

      {[
        { x1: 50, y1: 26, x2: 50, y2: 55 },
        { x1: 27, y1: 69, x2: 50, y2: 55 },
        { x1: 73, y1: 69, x2: 50, y2: 55 },
      ].map((l, i) => (
        <motion.line
          key={i}
          x1={l.x1}
          y1={l.y1}
          x2={l.x2}
          y2={l.y2}
          stroke="url(#tm-line)"
          strokeWidth="2.6"
          strokeLinecap="round"
          variants={{
            rest: { pathLength: 1, opacity: 1 },
            hover: { pathLength: [0.2, 1], opacity: [0.5, 1] },
          }}
          transition={{
            duration: 0.7,
            ease: [0.16, 1, 0.3, 1],
            delay: i * 0.08,
          }}
        />
      ))}

      <circle cx="50" cy="26" r="5" fill="url(#tm-node)" />
      <circle cx="27" cy="69" r="5" fill="url(#tm-node)" />
      <circle cx="73" cy="69" r="5" fill="url(#tm-node)" />

      <motion.circle
        cx="50"
        cy="55"
        r="5.5"
        fill="#00F2FE"
        filter="url(#tm-glow)"
        variants={{
          rest: { opacity: 0.9, scale: 1 },
          hover: { opacity: [0.9, 1, 0.9], scale: [1, 1.15, 1] },
        }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        style={{ transformOrigin: "50px 55px" }}
      />
    </Wrapper>
  );
}

TriangulateMark.propTypes = {
  size: PropTypes.number,
  className: PropTypes.string,
  animate: PropTypes.bool,
};
