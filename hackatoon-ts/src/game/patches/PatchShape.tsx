import { shapes, type ShapeId } from './patches'

type PatchShapeProps = {
  shape: ShapeId
  /** Cuartos de vuelta (puede ser mayor que 3; el CSS anima el giro). */
  turns: number
  className: string
}

/** Una silueta girada. Se usa tanto para el agujero como para el parche. */
export function PatchShape({ shape, turns, className }: PatchShapeProps) {
  return (
    <g className={className} style={{ transform: `rotate(${turns * 90}deg)` }}>
      <polygon points={shapes[shape]} />
    </g>
  )
}
