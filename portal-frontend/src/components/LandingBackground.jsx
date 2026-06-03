import { motion } from 'framer-motion';
import { PawPrint } from './PawPrint.jsx';

/**
 * Decorative paw-print backdrop for the landing page.
 *
 * Hand-positioned (rather than tiled) so the placement feels intentional —
 * varied sizes, varied rotations, varied opacities, asymmetric distribution.
 * Sits behind page content via z-0, with the actual content lifted to z-10.
 *
 * Pointer-events disabled so it never interferes with clicks. Hidden from
 * screen readers. Animated in with a slow stagger so the page doesn't appear
 * cluttered on first paint.
 */

// Position units in % of the page container.
// `rotate` in degrees, `opacity` is the resting opacity (gets multiplied by accent).
const PAWS = [
  { left:  '4%', top:  '7%', size: 34, rotate:  18, opacity: 0.045 },
  { left: '88%', top: '12%', size: 28, rotate: -22, opacity: 0.05  },
  { left: '11%', top: '28%', size: 22, rotate:  45, opacity: 0.04  },
  { left: '78%', top: '34%', size: 38, rotate:  -5, opacity: 0.05  },
  { left: '46%', top: '4%',  size: 18, rotate:   8, opacity: 0.035 },
  { left: '24%', top: '52%', size: 30, rotate: 110, opacity: 0.05  },
  { left: '92%', top: '58%', size: 26, rotate:  35, opacity: 0.045 },
  { left:  '7%', top: '72%', size: 36, rotate: -25, opacity: 0.05  },
  { left: '60%', top: '78%', size: 22, rotate:  60, opacity: 0.04  },
  { left: '38%', top: '88%', size: 30, rotate: -40, opacity: 0.045 },
  { left: '83%', top: '85%', size: 18, rotate:  15, opacity: 0.04  },
  { left: '52%', top: '40%', size: 16, rotate:  90, opacity: 0.03  },
];

export function LandingBackground() {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 pointer-events-none overflow-hidden text-accent"
    >
      {PAWS.map((p, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: p.opacity }}
          transition={{
            duration: 1.4,
            delay:  0.6 + (i * 0.06),
            ease:   'easeOut',
          }}
          className="absolute"
          style={{
            left:  p.left,
            top:   p.top,
            transform: `rotate(${p.rotate}deg)`,
          }}
        >
          <PawPrint size={p.size} />
        </motion.div>
      ))}
    </div>
  );
}

export default LandingBackground;
