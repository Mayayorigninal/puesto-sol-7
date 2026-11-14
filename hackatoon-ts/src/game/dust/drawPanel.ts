import { columns, rows, type Panel } from './panel'

export function drawPanel(context: CanvasRenderingContext2D, panel: Panel) {
  const { width, height } = context.canvas
  const cellWidth = width / columns
  const cellHeight = height / rows
  const scale = width / 400

  context.fillStyle = '#17335F'
  context.fillRect(0, 0, width, height)
  context.strokeStyle = 'rgba(140,180,240,.35)'
  context.lineWidth = scale
  context.beginPath()
  for (let column = 0; column <= columns; column += 4) {
    context.moveTo(column * cellWidth, 0)
    context.lineTo(column * cellWidth, height)
  }
  for (let row = 0; row <= rows; row += 3) {
    context.moveTo(0, row * cellHeight)
    context.lineTo(width, row * cellHeight)
  }
  context.stroke()

  for (let index = 0; index < panel.dust.length; index++) {
    const opacity = panel.dust[index]
    if (opacity <= 0.02) continue
    context.fillStyle = `rgba(196,164,120,${opacity.toFixed(2)})`
    context.fillRect(
      (index % columns) * cellWidth, Math.floor(index / columns) * cellHeight,
      cellWidth + 0.5 * scale, cellHeight + 0.5 * scale,
    )
  }

  if (panel.windy) {
    context.strokeStyle = 'rgba(255,255,255,.5)'
    context.lineWidth = 2 * scale
    context.lineCap = 'round'
    context.beginPath()
    for (let line = 0; line < 6; line++) {
      const x = ((panel.elapsed * 420 + line * 97) * scale) % (width + 80 * scale) - 40 * scale
      const y = height * (0.12 + line * 0.15)
      context.moveTo(x, y)
      context.lineTo(x + 34 * scale, y)
    }
    context.stroke()
  }

  context.fillStyle = '#F0D9A8'
  for (const wave of panel.waves) {
    for (let grain = 0; grain < 26; grain++) {
      context.beginPath()
      context.arc(
        wave.position * width - (grain % 5) * 5 * scale,
        grain / 26 * height + ((grain * 37) % 9) * scale, 2.4 * scale, 0, 2 * Math.PI,
      )
      context.fill()
    }
  }
}
