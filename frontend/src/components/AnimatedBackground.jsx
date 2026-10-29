import React, { useEffect, useRef, useState } from 'react'
import { useTheme } from '../context/ThemeContext'

/**
 * AnimatedBackground
 * High performance Canvas-based live backgrounds with 7 styles.
 * Zero external 3D libraries, respects prefers-reduced-motion & document.hidden.
 */
export default function AnimatedBackground() {
  const { activeBgStyle, liveBg, darkMode } = useTheme()
  const canvasRef = useRef(null)
  const animFrameIdRef = useRef(null)
  const transitionAlphaRef = useRef(1)
  const currentStyleRef = useRef(activeBgStyle)
  const [displayedStyleName, setDisplayedStyleName] = useState(activeBgStyle)

  useEffect(() => {
    currentStyleRef.current = activeBgStyle
    setDisplayedStyleName(activeBgStyle)
  }, [activeBgStyle])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let width = (canvas.width = window.innerWidth)
    let height = (canvas.height = window.innerHeight)

    const handleResize = () => {
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
      initParticles()
    }
    window.addEventListener('resize', handleResize)

    // Reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // ─── Particle State Initializers ───────────────────────────────────────
    let stars = []
    let networkNodes = []
    let shapes = []
    let glassBlobs = []
    let auroraTime = 0
    let pastelTime = 0

    function initParticles() {
      // 1. Galaxy Stars (160 stars with depth, twinkle speed, and drift)
      stars = []
      const starCount = Math.min(180, Math.floor((width * height) / 8000))
      for (let i = 0; i < starCount; i++) {
        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius: Math.random() * 1.8 + 0.4,
          alpha: Math.random() * 0.8 + 0.2,
          speed: Math.random() * 0.25 + 0.05,
          twinkleSpeed: Math.random() * 0.02 + 0.008,
          hue: Math.random() > 0.6 ? 260 : Math.random() > 0.3 ? 280 : 35, // Purple, Violet, Soft Peach
        })
      }

      // 2. AI Network Nodes (45 nodes connected by distance)
      networkNodes = []
      const nodeCount = Math.min(50, Math.floor((width * height) / 22000))
      for (let i = 0; i < nodeCount; i++) {
        networkNodes.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.6,
          vy: (Math.random() - 0.5) * 0.6,
          radius: Math.random() * 2.5 + 1.8,
          pulse: Math.random() * Math.PI * 2,
        })
      }

      // 3. 3D Floating Shapes (8 geometric objects)
      shapes = []
      const shapeTypes = ['cube', 'octahedron', 'torusRing', 'prism']
      for (let i = 0; i < 9; i++) {
        shapes.push({
          type: shapeTypes[i % shapeTypes.length],
          x: Math.random() * width,
          y: Math.random() * height,
          size: Math.random() * 45 + 30,
          rotX: Math.random() * Math.PI,
          rotY: Math.random() * Math.PI,
          rotZ: Math.random() * Math.PI,
          vRotX: (Math.random() - 0.5) * 0.012,
          vRotY: (Math.random() - 0.5) * 0.015,
          vRotZ: (Math.random() - 0.5) * 0.008,
          vx: (Math.random() - 0.5) * 0.35,
          vy: (Math.random() - 0.5) * 0.35,
          color: i % 2 === 0 ? 'rgba(112, 71, 235, 0.45)' : 'rgba(255, 179, 138, 0.55)',
        })
      }

      // 4. Glassmorphism orbs (5 large floating gradient orbs)
      glassBlobs = []
      for (let i = 0; i < 6; i++) {
        glassBlobs.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius: Math.random() * 140 + 100,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          hue: i % 2 === 0 ? 'rgba(200, 184, 255, 0.28)' : 'rgba(255, 179, 138, 0.24)',
        })
      }
    }

    initParticles()

    // ─── Renderers for Each of the 7 Styles ─────────────────────────────────

    // 1. Cosmic Galaxy (Dark)
    function renderGalaxy() {
      // Cosmic deep space gradient
      const bgGrad = ctx.createLinearGradient(0, 0, width, height)
      bgGrad.addColorStop(0, '#060611')
      bgGrad.addColorStop(0.4, '#0d0922')
      bgGrad.addColorStop(0.75, '#170b33')
      bgGrad.addColorStop(1, '#080514')
      ctx.fillStyle = bgGrad
      ctx.fillRect(0, 0, width, height)

      // Nebula cloud glows
      const nebula1 = ctx.createRadialGradient(width * 0.75, height * 0.3, 20, width * 0.75, height * 0.3, width * 0.5)
      nebula1.addColorStop(0, 'rgba(112, 71, 235, 0.22)')
      nebula1.addColorStop(0.6, 'rgba(77, 44, 181, 0.08)')
      nebula1.addColorStop(1, 'transparent')
      ctx.fillStyle = nebula1
      ctx.fillRect(0, 0, width, height)

      const nebula2 = ctx.createRadialGradient(width * 0.2, height * 0.7, 10, width * 0.2, height * 0.7, width * 0.4)
      nebula2.addColorStop(0, 'rgba(255, 179, 138, 0.14)')
      nebula2.addColorStop(0.7, 'rgba(174, 141, 240, 0.06)')
      nebula2.addColorStop(1, 'transparent')
      ctx.fillStyle = nebula2
      ctx.fillRect(0, 0, width, height)

      // Drifting, twinkling stars
      for (let s of stars) {
        if (liveBg && !prefersReducedMotion) {
          s.y += s.speed
          if (s.y > height) {
            s.y = 0
            s.x = Math.random() * width
          }
          s.alpha += Math.sin(auroraTime * 3 + s.x) * s.twinkleSpeed
          s.alpha = Math.max(0.15, Math.min(0.95, s.alpha))
        }

        ctx.beginPath()
        ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2)
        ctx.fillStyle = `hsla(${s.hue}, 85%, 85%, ${s.alpha})`
        ctx.shadowColor = `hsla(${s.hue}, 90%, 70%, ${s.alpha * 0.6})`
        ctx.shadowBlur = s.radius * 4
        ctx.fill()
        ctx.shadowBlur = 0
      }
    }

    // 2. Liquid Aurora (Dark)
    function renderAurora() {
      // Deep violet backdrop
      const grad = ctx.createLinearGradient(0, 0, 0, height)
      grad.addColorStop(0, '#0a0518')
      grad.addColorStop(0.5, '#130a2a')
      grad.addColorStop(1, '#070312')
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, width, height)

      if (liveBg && !prefersReducedMotion) {
        auroraTime += 0.015
      }

      // Render 4 undulating glowing wave bands
      const bands = [
        { color1: 'rgba(112, 71, 235, 0.35)', color2: 'rgba(200, 184, 255, 0.0)', yOffset: 0.35, freq: 0.003, speed: 1.0 },
        { color1: 'rgba(174, 141, 240, 0.30)', color2: 'rgba(112, 71, 235, 0.0)', yOffset: 0.5, freq: 0.0025, speed: 0.8 },
        { color1: 'rgba(255, 179, 138, 0.22)', color2: 'rgba(255, 129, 66, 0.0)', yOffset: 0.65, freq: 0.002, speed: 1.2 },
        { color1: 'rgba(147, 103, 235, 0.28)', color2: 'rgba(77, 44, 181, 0.0)', yOffset: 0.8, freq: 0.0035, speed: 0.7 },
      ]

      bands.forEach((b, idx) => {
        ctx.beginPath()
        ctx.moveTo(0, height)
        for (let x = 0; x <= width; x += 15) {
          const y =
            height * b.yOffset +
            Math.sin(x * b.freq + auroraTime * b.speed + idx) * 55 +
            Math.cos(x * 0.0015 - auroraTime * 0.6) * 35
          ctx.lineTo(x, y)
        }
        ctx.lineTo(width, height)
        ctx.closePath()

        const waveGrad = ctx.createLinearGradient(0, height * (b.yOffset - 0.2), 0, height)
        waveGrad.addColorStop(0, b.color1)
        waveGrad.addColorStop(1, b.color2)
        ctx.fillStyle = waveGrad
        ctx.fill()
      })
    }

    // 3. AI Neural Network (Dark)
    function renderAINetwork() {
      // Tech-navy background
      const grad = ctx.createLinearGradient(0, 0, width, height)
      grad.addColorStop(0, '#090a18')
      grad.addColorStop(0.5, '#120f2e')
      grad.addColorStop(1, '#0b081e')
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, width, height)

      if (liveBg && !prefersReducedMotion) {
        auroraTime += 0.02
      }

      // Connect nodes with lines if within proximity
      const maxDistance = 140
      ctx.lineWidth = 1

      for (let i = 0; i < networkNodes.length; i++) {
        const n1 = networkNodes[i]

        if (liveBg && !prefersReducedMotion) {
          n1.x += n1.vx
          n1.y += n1.vy
          if (n1.x < 0 || n1.x > width) n1.vx *= -1
          if (n1.y < 0 || n1.y > height) n1.vy *= -1
          n1.pulse += 0.03
        }

        for (let j = i + 1; j < networkNodes.length; j++) {
          const n2 = networkNodes[j]
          const dx = n1.x - n2.x
          const dy = n1.y - n2.y
          const dist = Math.sqrt(dx * dx + dy * dy)

          if (dist < maxDistance) {
            const alpha = (1 - dist / maxDistance) * 0.55
            ctx.beginPath()
            ctx.strokeStyle = `rgba(174, 141, 240, ${alpha})`
            ctx.moveTo(n1.x, n1.y)
            ctx.lineTo(n2.x, n2.y)
            ctx.stroke()

            // Occasional traveling data pulse
            if ((i + j) % 3 === 0) {
              const t = (Math.sin(auroraTime * 2 + i) + 1) / 2
              const px = n1.x + (n2.x - n1.x) * t
              const py = n1.y + (n2.y - n1.y) * t
              ctx.beginPath()
              ctx.arc(px, py, 2, 0, Math.PI * 2)
              ctx.fillStyle = 'rgba(255, 179, 138, 0.85)'
              ctx.fill()
            }
          }
        }

        // Draw node dot
        const pulseScale = 1 + Math.sin(n1.pulse) * 0.25
        ctx.beginPath()
        ctx.arc(n1.x, n1.y, n1.radius * pulseScale, 0, Math.PI * 2)
        ctx.fillStyle = '#C8B8FF'
        ctx.shadowColor = '#7047EB'
        ctx.shadowBlur = 10
        ctx.fill()
        ctx.shadowBlur = 0
      }
    }

    // 4. Lavender & Pastel Gradients (Light)
    function renderLavenderPastel() {
      ctx.fillStyle = '#FAF7FF'
      ctx.fillRect(0, 0, width, height)

      if (liveBg && !prefersReducedMotion) {
        pastelTime += 0.012
      }

      // Shifting luminous pastel radial blooms
      const rad1 = ctx.createRadialGradient(
        width * (0.3 + Math.sin(pastelTime * 0.6) * 0.15),
        height * (0.35 + Math.cos(pastelTime * 0.5) * 0.15),
        20,
        width * 0.3,
        height * 0.35,
        width * 0.5
      )
      rad1.addColorStop(0, 'rgba(200, 184, 255, 0.45)')
      rad1.addColorStop(0.5, 'rgba(243, 239, 253, 0.30)')
      rad1.addColorStop(1, 'transparent')
      ctx.fillStyle = rad1
      ctx.fillRect(0, 0, width, height)

      const rad2 = ctx.createRadialGradient(
        width * (0.75 + Math.cos(pastelTime * 0.4) * 0.15),
        height * (0.65 + Math.sin(pastelTime * 0.7) * 0.15),
        30,
        width * 0.75,
        height * 0.65,
        width * 0.5
      )
      rad2.addColorStop(0, 'rgba(255, 179, 138, 0.35)')
      rad2.addColorStop(0.6, 'rgba(255, 240, 231, 0.20)')
      rad2.addColorStop(1, 'transparent')
      ctx.fillStyle = rad2
      ctx.fillRect(0, 0, width, height)

      const rad3 = ctx.createRadialGradient(
        width * (0.5 + Math.sin(pastelTime * 0.5) * 0.1),
        height * (0.85 + Math.cos(pastelTime * 0.6) * 0.1),
        10,
        width * 0.5,
        height * 0.85,
        width * 0.4
      )
      rad3.addColorStop(0, 'rgba(221, 212, 255, 0.40)')
      rad3.addColorStop(1, 'transparent')
      ctx.fillStyle = rad3
      ctx.fillRect(0, 0, width, height)
    }

    // 5. Warm Peach & Cream Gradients (Light)
    function renderPeachCream() {
      ctx.fillStyle = '#FFFDFC'
      ctx.fillRect(0, 0, width, height)

      if (liveBg && !prefersReducedMotion) {
        pastelTime += 0.014
      }

      const p1 = ctx.createRadialGradient(
        width * (0.8 + Math.sin(pastelTime * 0.5) * 0.12),
        height * (0.25 + Math.cos(pastelTime * 0.6) * 0.12),
        30,
        width * 0.8,
        height * 0.25,
        width * 0.55
      )
      p1.addColorStop(0, 'rgba(255, 179, 138, 0.48)')
      p1.addColorStop(0.5, 'rgba(255, 225, 207, 0.25)')
      p1.addColorStop(1, 'transparent')
      ctx.fillStyle = p1
      ctx.fillRect(0, 0, width, height)

      const p2 = ctx.createRadialGradient(
        width * (0.2 + Math.cos(pastelTime * 0.7) * 0.12),
        height * (0.75 + Math.sin(pastelTime * 0.4) * 0.12),
        20,
        width * 0.2,
        height * 0.75,
        width * 0.5
      )
      p2.addColorStop(0, 'rgba(255, 195, 160, 0.40)')
      p2.addColorStop(0.6, 'rgba(255, 245, 237, 0.22)')
      p2.addColorStop(1, 'transparent')
      ctx.fillStyle = p2
      ctx.fillRect(0, 0, width, height)

      const p3 = ctx.createRadialGradient(
        width * 0.5,
        height * 0.5,
        10,
        width * 0.5,
        height * 0.5,
        width * 0.45
      )
      p3.addColorStop(0, 'rgba(243, 239, 253, 0.35)')
      p3.addColorStop(1, 'transparent')
      ctx.fillStyle = p3
      ctx.fillRect(0, 0, width, height)
    }

    // 6. Light White-Purple Glassmorphism (Light)
    function renderGlassmorphism() {
      ctx.fillStyle = '#F8F6FD'
      ctx.fillRect(0, 0, width, height)

      if (liveBg && !prefersReducedMotion) {
        pastelTime += 0.015
      }

      // Floating refractive glass orbs
      for (let blob of glassBlobs) {
        if (liveBg && !prefersReducedMotion) {
          blob.x += blob.vx
          blob.y += blob.vy
          if (blob.x < -blob.radius) blob.x = width + blob.radius
          if (blob.x > width + blob.radius) blob.x = -blob.radius
          if (blob.y < -blob.radius) blob.y = height + blob.radius
          if (blob.y > height + blob.radius) blob.y = -blob.radius
        }

        const g = ctx.createRadialGradient(
          blob.x - blob.radius * 0.3,
          blob.y - blob.radius * 0.3,
          blob.radius * 0.1,
          blob.x,
          blob.y,
          blob.radius
        )
        g.addColorStop(0, 'rgba(255, 255, 255, 0.75)')
        g.addColorStop(0.35, blob.hue)
        g.addColorStop(1, 'transparent')

        ctx.beginPath()
        ctx.arc(blob.x, blob.y, blob.radius, 0, Math.PI * 2)
        ctx.fillStyle = g
        ctx.fill()
      }

      // Frosted white glass specular sheen
      const sheen = ctx.createLinearGradient(0, 0, width, height)
      sheen.addColorStop(0, 'rgba(255, 255, 255, 0.35)')
      sheen.addColorStop(0.5, 'rgba(243, 239, 253, 0.15)')
      sheen.addColorStop(1, 'rgba(255, 255, 255, 0.25)')
      ctx.fillStyle = sheen
      ctx.fillRect(0, 0, width, height)
    }

    // 7. Abstract 3D Floating Shapes (Light)
    function renderFloatingShapes() {
      ctx.fillStyle = '#FAF8FF'
      ctx.fillRect(0, 0, width, height)

      // Ambient pastel base
      const bg = ctx.createRadialGradient(width * 0.5, height * 0.5, 50, width * 0.5, height * 0.5, width * 0.6)
      bg.addColorStop(0, 'rgba(243, 239, 253, 0.45)')
      bg.addColorStop(0.6, 'rgba(255, 240, 231, 0.35)')
      bg.addColorStop(1, 'transparent')
      ctx.fillStyle = bg
      ctx.fillRect(0, 0, width, height)

      shapes.forEach((s) => {
        if (liveBg && !prefersReducedMotion) {
          s.rotX += s.vRotX
          s.rotY += s.vRotY
          s.rotZ += s.vRotZ
          s.x += s.vx
          s.y += s.vy
          if (s.x < -s.size) s.x = width + s.size
          if (s.x > width + s.size) s.x = -s.size
          if (s.y < -s.size) s.y = height + s.size
          if (s.y > height + s.size) s.y = -s.size
        }

        ctx.save()
        ctx.translate(s.x, s.y)

        // 3D Isometric projection math for cube vertices
        const d = s.size
        const cosY = Math.cos(s.rotY)
        const sinY = Math.sin(s.rotY)
        const cosX = Math.cos(s.rotX)
        const sinX = Math.sin(s.rotX)

        // Draw 3D wireframe isometric cube/prism
        const vertices = [
          [-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1],
          [-1, -1,  1], [1, -1,  1], [1, 1,  1], [-1, 1,  1],
        ].map(([vx, vy, vz]) => {
          // rotate Y
          let x1 = vx * cosY + vz * sinY
          let z1 = -vx * sinY + vz * cosY
          // rotate X
          let y2 = vy * cosX - z1 * sinX
          let z2 = vy * sinX + z1 * cosX
          return {
            x: x1 * d * 0.6,
            y: y2 * d * 0.6,
            z: z2,
          }
        })

        const edges = [
          [0, 1], [1, 2], [2, 3], [3, 0],
          [4, 5], [5, 6], [6, 7], [7, 4],
          [0, 4], [1, 5], [2, 6], [3, 7],
        ]

        ctx.strokeStyle = s.color
        ctx.lineWidth = 1.8
        edges.forEach(([i, j]) => {
          ctx.beginPath()
          ctx.moveTo(vertices[i].x, vertices[i].y)
          ctx.lineTo(vertices[j].x, vertices[j].y)
          ctx.stroke()
        })

        // Glowing center
        ctx.beginPath()
        ctx.arc(0, 0, d * 0.18, 0, Math.PI * 2)
        ctx.fillStyle = s.color
        ctx.fill()

        ctx.restore()
      })
    }

    // ─── Main Animation Loop ───────────────────────────────────────────────
    function render() {
      // Pause completely if tab is hidden to preserve battery and CPU
      if (document.hidden) {
        animFrameIdRef.current = requestAnimationFrame(render)
        return
      }

      ctx.clearRect(0, 0, width, height)

      const active = currentStyleRef.current

      switch (active) {
        case 'galaxy':
          renderGalaxy()
          break
        case 'aurora':
          renderAurora()
          break
        case 'ai_network':
          renderAINetwork()
          break
        case 'lavender_pastel':
          renderLavenderPastel()
          break
        case 'peach_cream':
          renderPeachCream()
          break
        case 'glassmorphism':
          renderGlassmorphism()
          break
        case 'floating_shapes':
          renderFloatingShapes()
          break
        default:
          renderGalaxy()
          break
      }

      // If live background is enabled and reduced-motion is not requested, loop!
      if (liveBg && !prefersReducedMotion) {
        animFrameIdRef.current = requestAnimationFrame(render)
      }
    }

    // Initial render
    render()

    // Resume when tab becomes visible again
    const handleVisibilityChange = () => {
      if (!document.hidden && liveBg && !prefersReducedMotion) {
        cancelAnimationFrame(animFrameIdRef.current)
        animFrameIdRef.current = requestAnimationFrame(render)
      }
    }
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      window.removeEventListener('resize', handleResize)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current)
      }
    }
  }, [activeBgStyle, liveBg])

  return (
    <div
      className="fixed inset-0 pointer-events-none transition-opacity duration-1000 z-0 overflow-hidden"
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  )
}
