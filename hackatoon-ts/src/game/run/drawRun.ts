import { astronaut, meteor, world, type Run } from './run'

const stars = [[20, 22], [58, 60], [96, 18], [140, 44], [182, 14], [214, 70], [250, 30], [296, 56], [330, 20], [350, 84]] as const

/** Dibuja un cuadro de la carrera. `sprite` es el dibujo del astronauta (puede no haber cargado aún). */
export function drawRun(context: CanvasRenderingContext2D, run: Run, sprite: HTMLImageElement | null) {
  const { canvas } = context
  const scale = canvas.width / world.width
  context.setTransform(scale, 0, 0, scale, 0, 0)
  const { width, height, ground } = world
  const scroll = run.distance * 30

  // cielo y estrellas (se mueven despacio: están muy lejos)
  context.fillStyle = '#070B16'
  context.fillRect(0, 0, width, height)
  context.fillStyle = '#E8EDF7'
  for (const [x, y] of stars) {
    const sx = ((x - scroll * 0.03) % width + width) % width
    context.globalAlpha = 0.75
    context.fillRect(sx, y, 1.6, 1.6)
  }
  context.globalAlpha = 1

  // la Tierra
  context.fillStyle = '#5B9BF5'
  context.beginPath(); context.arc(300, 34, 13, 0, Math.PI * 2); context.fill()
  context.strokeStyle = '#BFE3C8'; context.lineWidth = 3; context.lineCap = 'round'
  context.beginPath(); context.moveTo(292, 30); context.quadraticCurveTo(298, 25, 303, 31); context.quadraticCurveTo(307, 35, 310, 31); context.stroke()

  // suelo lunar
  context.fillStyle = '#9AA3B8'
  context.fillRect(0, ground, width, 6)
  context.fillStyle = '#59627A'
  context.fillRect(0, ground + 6, width, height - ground - 6)
  context.fillStyle = '#474F66'
  for (let i = 0; i < 9; i++) {
    const x = ((i * 47 - scroll) % (width + 40) + width + 40) % (width + 40) - 20
    context.beginPath(); context.ellipse(x, ground + 16 + (i % 3) * 8, 5 + (i % 2) * 3, 2, 0, 0, Math.PI * 2); context.fill()
  }

  // obstáculos
  for (const obstacle of run.obstacles) {
    if (obstacle.kind === 'crater') {
      const cx = obstacle.x + obstacle.width / 2
      context.fillStyle = '#C3CAD9'
      context.beginPath(); context.ellipse(cx, ground + 2, obstacle.width / 2 + 4, 6, 0, 0, Math.PI * 2); context.fill()
      context.fillStyle = '#1B2133'
      context.beginPath(); context.ellipse(cx, ground + 3, obstacle.width / 2, 4.5, 0, 0, Math.PI * 2); context.fill()
    } else {
      const y = ground - meteor.altitude
      const tail = context.createLinearGradient(obstacle.x, y, obstacle.x + 46, y - 8)
      tail.addColorStop(0, '#F2B134'); tail.addColorStop(1, 'rgba(239, 107, 74, 0)')
      context.fillStyle = tail
      context.beginPath(); context.moveTo(obstacle.x, y - meteor.radius); context.lineTo(obstacle.x + 48, y - 10); context.lineTo(obstacle.x, y + meteor.radius); context.fill()
      context.fillStyle = '#8B7E6A'
      context.beginPath(); context.arc(obstacle.x, y, meteor.radius, 0, Math.PI * 2); context.fill()
      context.fillStyle = '#5E5447'
      context.beginPath(); context.arc(obstacle.x - 3, y - 2, 2.5, 0, Math.PI * 2); context.arc(obstacle.x + 3, y + 3, 1.8, 0, Math.PI * 2); context.fill()
    }
  }

  // sombra: se hace chica cuando el astronauta sube
  const shadow = Math.max(0.35, 1 - run.height / 110)
  context.fillStyle = 'rgba(0, 0, 0, .35)'
  context.beginPath(); context.ellipse(astronaut.x, ground + 3, 12 * shadow, 3 * shadow, 0, 0, Math.PI * 2); context.fill()

  // astronauta (parpadea después de un tropiezo)
  const grounded = run.height === 0
  const bob = grounded ? Math.abs(Math.sin(scroll / 11)) * 3 : 0
  const blink = run.invulnerable > 0 && Math.floor(run.invulnerable * 10) % 2 === 0
  context.save()
  context.globalAlpha = blink ? 0.3 : 1
  context.translate(astronaut.x, ground - run.height - bob)
  context.rotate(grounded ? 0.14 + Math.sin(scroll / 11) * 0.05 : -0.08)
  if (sprite?.complete && sprite.naturalWidth > 0) {
    context.drawImage(sprite, -astronaut.width / 2, -astronaut.height, astronaut.width, astronaut.height)
  } else {
    context.fillStyle = '#EFF3F8'
    context.fillRect(-8, -astronaut.height + 16, 16, 30)
    context.beginPath(); context.arc(0, -astronaut.height + 12, 12, 0, Math.PI * 2); context.fill()
    context.fillStyle = '#27314A'
    context.beginPath(); context.arc(0, -astronaut.height + 12, 9, 0, Math.PI * 2); context.fill()
  }
  context.restore()
}
