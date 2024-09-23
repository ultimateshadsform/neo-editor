import BlueRoad from '@icons/blueroad.png';
import RedRoad from '@icons/redroad.png';
import GrayTunnel from '@icons/graytunnel.png';
import PurpleTunnel from '@icons/purpleTunnel.png';
import HalloweenTunnel from '@icons/halloweentunnel.png';
import GalaxyTunnel from '@icons/galaxytunnel.png';
import PurpleRoad from '@icons/purpleroad.png';
import GrassRoad from '@icons/grassroad.png';
import HalloweenRoad from '@icons/halloweenroad.png';
import GalaxyRoad from '@icons/galaxyroad.png';
import RainbowRoad from '@icons/rainbowroad.png';
import IceRoad from '@icons/iceroad.png';
import Platform from '@icons/platform.png';
import Laser from '@icons/laser.png';
import LaserLoop from '@icons/looplaser.png';
import Spikes from '@icons/spikes.png';
import SquashTrap from '@icons/thumper.png';
import Peg from '@icons/pole.png';
import Ramp from '@icons/ramp.png';
import Saw from '@icons/sawTrap.png';
import SpikeBall from '@icons/spikeball.png';
import Piston from '@icons/piston.png';
import KillZone from '@icons/killzone.png';
import Rotor from '@icons/rotator.png';
import JumpPad from '@icons/jumppad.png';
import Skull from '@icons/skull.png';
import SlowZone from '@icons/slowpad.png';
import Ball from '@icons/ball.png';
import CubeDecor from '@icons/cubesplines.png';
import SideDecor from '@icons/sidesplines.png';
import SwivelDecor from '@icons/swiveltunnel.png';
import BatDecor from '@icons/batsplines.png';
import StarDecor from '@icons/starsplines.png';
import Pillar from '@icons/pillar.png';
import MetalTomb from '@icons/metaltomb.png';
import CityBulding1 from '@icons/citybuilding1.png';
import CityProcedural from '@icons/cityprocedural.png';
import HoverPanel from '@icons/hoverpanel.png';

export interface MenuItem {
  label: string;
  action?: () => void;
  submenu?: MenuItem[];
  icon?: string;
}

export const menuItems: MenuItem[] = [
  {
    label: 'Create object',
    submenu: [
      {
        label: 'Simple roads',
        icon: RedRoad,
        submenu: [
          { label: 'Blue road', icon: BlueRoad, action: () => console.log('Create Road1') },
          { label: 'Red road', icon: RedRoad, action: () => console.log('Create Road2') },
          {
            label: 'Purple striped road',
            icon: PurpleRoad,
            action: () => console.log('Create SimpleRoad4')
          },
          { label: 'Grass road', icon: GrassRoad, action: () => console.log('Create GrassRoad') },
          {
            label: 'Halloween road',
            icon: HalloweenRoad,
            action: () => console.log('Create HalloweenRoad')
          },
          { label: 'Ice road', icon: IceRoad, action: () => console.log('Create iceRoad') },
          {
            label: 'Galaxy road',
            icon: GalaxyRoad,
            action: () => console.log('Create galaxyRoad')
          },
          {
            label: 'Rainbow road',
            icon: RainbowRoad,
            action: () => console.log('Create rainbowRoad')
          }
        ]
      },
      {
        label: 'Tunnels',
        icon: PurpleTunnel,
        submenu: [
          {
            label: 'Purple rectangular tunnel',
            icon: PurpleTunnel,
            action: () => console.log('Create TunnelRoad1')
          },
          {
            label: 'Gray round tunnel',
            icon: GrayTunnel,
            action: () => console.log('Create TunnelRoad4')
          },
          {
            label: 'Halloween tunnel',
            icon: HalloweenTunnel,
            action: () => console.log('Create halloweenTunnel')
          },
          {
            label: 'Galaxy tunnel',
            icon: GalaxyTunnel,
            action: () => console.log('Create galaxyTunnel')
          }
        ]
      },
      {
        label: 'Green platform',
        icon: Platform,
        action: () => console.log('Create Platform 1')
      },
      {
        label: 'Obstacles',
        icon: SlowZone,
        submenu: [
          { label: 'Laser', icon: Laser, action: () => console.log('Create Laser') },
          { label: 'Laser loop', icon: LaserLoop, action: () => console.log('Create LaserLoop') },
          { label: 'Spikes', icon: Spikes, action: () => console.log('Create Spikes') },
          { label: 'Slow zone', icon: SlowZone, action: () => console.log('Create SlowZone') },
          {
            label: 'Squash trap',
            icon: SquashTrap,
            action: () => console.log('Create SquashTrap')
          },
          { label: 'Peg', icon: Peg, action: () => console.log('Create Peg') },
          { label: 'Ramp', icon: Ramp, action: () => console.log('Create Ramp') },
          { label: 'Saw', icon: Saw, action: () => console.log('Create Saw') },
          { label: 'Ball', icon: Ball, action: () => console.log('Create Ball') },
          { label: 'Spike ball', icon: SpikeBall, action: () => console.log('Create SpikeBall') },
          { label: 'Piston', icon: Piston, action: () => console.log('Create Piston') },
          { label: 'Kill zone', icon: KillZone, action: () => console.log('Create KillZone') },
          { label: 'Rotor', icon: Rotor, action: () => console.log('Create Rotor') },
          { label: 'Jump pad', icon: JumpPad, action: () => console.log('Create JumpPad') },
          { label: 'Skull', icon: Skull, action: () => console.log('Create Skull') }
        ]
      },
      {
        label: 'Curve decors',
        icon: StarDecor,
        submenu: [
          { label: 'Cube spline', icon: CubeDecor, action: () => console.log('Create cubeSpline') },
          { label: 'Side spline', icon: SideDecor, action: () => console.log('Create sideSpline') },
          {
            label: 'Swivel spline',
            icon: SwivelDecor,
            action: () => console.log('Create swivelSpline')
          },
          { label: 'Bat spline', icon: BatDecor, action: () => console.log('Create batSpline') },
          { label: 'Star spline', icon: StarDecor, action: () => console.log('Create starSpline') }
        ]
      },
      {
        label: 'Decors',
        icon: Pillar,
        submenu: [
          { label: 'Pillar', icon: Pillar, action: () => console.log('Create Pillar') },
          { label: 'Metal tomb', icon: MetalTomb, action: () => console.log('Create MetalTomb') },
          {
            label: 'City bulding 1',
            icon: CityBulding1,
            action: () => console.log('Create CityBulding1')
          },
          {
            label: 'Hover panel',
            icon: HoverPanel,
            action: () => console.log('Create HoverPanel')
          },
          {
            label: 'City procedural',
            icon: CityProcedural,
            action: () => console.log('Create CityProcedural')
          }
        ]
      }
    ]
  }
];
