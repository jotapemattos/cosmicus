import bluePlanet from '@/public/planets/blue-planet.png'
import bluePlanet2 from '@/public/planets/blue-planet-2.png'
import bluePlanet3 from '@/public/planets/blue-planet-3.png'
import bluePlanet4 from '@/public/planets/blue-planet-4.png'

import purplePlanet from '@/public/planets/purple-planet.png'
import purplePlanet2 from '@/public/planets/purple-planet-2.png'
import purplePlanet3 from '@/public/planets/purple-planet-3.png'
import purplePlanet4 from '@/public/planets/purple-planet-4.png'

import greenPlanet from '@/public/planets/green-planet.png'
import greenPlanet2 from '@/public/planets/green-planet-2.png'
import greenPlanet3 from '@/public/planets/green-planet-3.png'
import greenPlanet4 from '@/public/planets/green-planet-4.png'

import yellowPlanet from '@/public/planets/yellow-planet.png'
import yellowPlanet2 from '@/public/planets/yellow-planet-2.png'
import yellowPlanet3 from '@/public/planets/yellow-planet-3.png'
import yellowPlanet4 from '@/public/planets/yellow-planet-4.png'

import redPlanet from '@/public/planets/red-planet.png'
import redPlanet2 from '@/public/planets/red-planet-2.png'
import redPlanet3 from '@/public/planets/red-planet-3.png'
import redPlanet4 from '@/public/planets/red-planet-4.png'

import pinkPlanet from '@/public/planets/pink-planet.png'
import pinkPlanet2 from '@/public/planets/pink-planet-2.png'
import pinkPlanet3 from '@/public/planets/pink-planet-3.png'
import pinkPlanet4 from '@/public/planets/pink-planet-4.png'

const planets = [
  bluePlanet,
  bluePlanet2,
  bluePlanet3,
  bluePlanet4,

  purplePlanet,
  purplePlanet2,
  purplePlanet3,
  purplePlanet4,

  greenPlanet,
  greenPlanet2,
  greenPlanet3,
  greenPlanet4,

  yellowPlanet,
  yellowPlanet2,
  yellowPlanet3,
  yellowPlanet4,

  redPlanet,
  redPlanet2,
  redPlanet3,
  redPlanet4,

  pinkPlanet,
  pinkPlanet2,
  pinkPlanet3,
  pinkPlanet4,
]
export function getPlanet(index: number): string {
  const wrappedIndex = (index + 1) % planets.length
  return planets[wrappedIndex].src
}
