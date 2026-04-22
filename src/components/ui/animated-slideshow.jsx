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
            onHoverStart={() => setActive(i)}
            onClick={() => setActive(i)}
          >
            <motion.span
              className="as-num"
              animate={{ opacity: active === i ? 1 : 0.35 }}
              transition={{ duration: 0.25 }}
            >
              {slide.num}
            </motion.span>
            <div className="as-item-body">
              <motion.h3
                className="as-title"
                animate={{ x: active === i ? 8 : 0 }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
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
                    transition={{ duration: 0.3 }}
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
              transition={{ duration: 0.3 }}
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
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -24 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className={`as-visual as-visual--${active}`}>
              <div className="as-visual-bg" />
              <div className="as-visual-num">{slides[active]?.num}</div>
              <div className="as-visual-content">
                <h4 className="as-visual-title">{slides[active]?.title}</h4>
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
