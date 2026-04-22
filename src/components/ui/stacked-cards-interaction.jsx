import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export function StackedCardsInteraction({ cards }) {
  const [stack, setStack] = useState(cards.map((c, i) => ({ ...c, _key: i })))
  const [isDragging, setIsDragging] = useState(false)

  const sendToBack = () => {
    setStack(prev => {
      const [first, ...rest] = prev
      return [...rest, { ...first, _key: Date.now() }]
    })
  }

  return (
    <div className="sc-root" onClick={!isDragging ? sendToBack : undefined}>
      <div className="sc-deck">
        {stack.map((card, i) => {
          const isTop = i === 0
          const offset = i * 12
          const rotation = i === 0 ? 0 : i % 2 === 0 ? i * 2 : -i * 2
          return (
            <motion.div
              key={card._key}
              className={`sc-card ${isTop ? 'sc-card--top' : ''}`}
              style={{ zIndex: stack.length - i }}
              drag={isTop ? 'x' : false}
              dragConstraints={{ left: -300, right: 300 }}
              dragElastic={0.18}
              onDragStart={() => setIsDragging(true)}
              onDragEnd={(_, info) => {
                setIsDragging(false)
                if (Math.abs(info.offset.x) > 80) sendToBack()
              }}
              animate={{
                y: -offset,
                scale: 1 - i * 0.04,
                rotate: rotation,
                filter: i === 0 ? 'none' : `brightness(${1 - i * 0.08})`,
              }}
              transition={{ type: 'spring', stiffness: 280, damping: 28 }}
              whileDrag={{ scale: 1.04, rotate: 0, cursor: 'grabbing' }}
            >
              {card.content}
            </motion.div>
          )
        })}
      </div>
      <p className="sc-hint">Cliquer ou glisser pour parcourir ↗</p>
    </div>
  )
}
