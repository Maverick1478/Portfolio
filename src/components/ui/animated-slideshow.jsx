import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export function AnimatedSlideshow({ slides }) {
  const [active, setActive] = useState(0)

  return (
    <div className="as-root">
      {/* Left: list */}
      <div className="as-list">
        {slides.map((slide, i) => (
          <motion.div
            key={i}
            className={`as-item ${active === i ? 'as-item--active' : ''}`}
            onMouseEnter={() => setActive(i)}
            onClick={() => setActive(i)}
          >
            <motion.span
              className="as-num"
              animate={{ opacity: active === i ? 1 : 0.4 }}
              transition={{ duration: 0.2 }}
            >
              {slide.num}
            </motion.span>
            <div className="as-item-body">
              <motion.h3
                className="as-title"
                animate={{ x: active === i ? 6 : 0 }}
                transition={{ type: 'spring', stiffness: 380, damping: 28 }}
              >
                {slide.title}
              </motion.h3>
              <AnimatePresence>
                {active === i && (
                  <motion.div
                    className="as-tags"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.28 }}
                  >
                    {slide.items.map(item => (
                      <span key={item} className="tag">{item}</span>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <motion.div
              className="as-line"
              animate={{ scaleX: active === i ? 1 : 0 }}
              initial={{ scaleX: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            />
          </motion.div>
        ))}
      </div>

      {/* Right: visual panel */}
      <div className="as-panel">
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            className="as-panel-inner"
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.98 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className={`as-visual as-visual--${active}`}>
              <div className="as-visual-bg" />
              <div className="as-visual-num">{slides[active]?.num}</div>

              {/* progress dots */}
              <div className="as-visual-dots">
                {slides.map((_, i) => (
                  <button
                    key={i}
                    className={`as-visual-dot ${active === i ? 'as-visual-dot--active' : ''}`}
                    onClick={() => setActive(i)}
                    aria-label={`Slide ${i + 1}`}
                  />
                ))}
              </div>

              <div className="as-visual-content">
                <h4 className="as-visual-title">{slides[active]?.title}</h4>
                <div className="as-visual-sep" />
                <p className="as-visual-desc">{slides[active]?.description}</p>
                <div className="as-visual-tags">
                  {slides[active]?.items.map(item => (
                    <span key={item} className="as-vtag">{item}</span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
