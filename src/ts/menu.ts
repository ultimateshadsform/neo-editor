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
import CityBuilding2 from '@icons/citybuilding2.png';
import CityBuilding3 from '@icons/citybuilding3.png';
import HoverPanel from '@icons/hoverpanel.png';
import ThinCityBuilding from '@icons/thinbuilding1.png';
import Disk from '@icons/disk.png';
import RockLoop from '@icons/rockloop.png';
import LoopQuad from '@icons/loopquad.png';
import TechLoop from '@icons/techloop.png';
import LargeArch from '@icons/arches.png';
import StripeCube from '@icons/multicube.png';
import SimpleCube from '@icons/simplecube.png';
import Multidisk from '@icons/multidisk.png';
import HoloLaser from '@icons/hololaser.png';
import RockBallParticle from '@icons/exploparticle.png';
import Pumpkin from '@icons/pumpkin.png';
import Tentacle from '@icons/tentacle.png';
import StartLine from '@icons/startline.png';
import FinishLine from '@icons/finishline.png';
import Procedural from '@icons/cityprocedural.png';
import ProceduralRocks from '@icons/rockprocedural.png';
import EnergyPickup from '@icons/energypickup.png';
import ShieldPickup from '@icons/shieldpickup.png';
import EnergyLoop from '@icons/energyloop.png';
import FogShifter from '@icons/fogshift.png';
import DirectionPanel from '@icons/dirpanel.png';
import DangerPanel from '@icons/dangerpanel.png';

export interface MenuItem {
  label: string;
  action?: (addObject: (type: string) => void) => void;
  submenu?: MenuItem[];
  icon?: string;
}

export const createMenuItems = (addObject: (type: string) => void) => ({
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
        {
          label: 'Laser',
          icon: Laser,
          action: () => addObject('LaserTrap')
        },
        {
          label: 'Laser loop',
          icon: LaserLoop,
          action: () => addObject('LaserLoop')
        },
        {
          label: 'Spikes',
          icon: Spikes,
          action: () => addObject('Spikes')
        },
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
          label: 'Hover panel',
          icon: HoverPanel,
          action: () => console.log('Create HoverPanel')
        },

        {
          label: 'Disk',
          icon: Disk,
          action: () => console.log('Create Disk')
        },
        {
          label: 'Loops',
          icon: LoopQuad,
          submenu: [
            {
              label: 'Rock loop',
              icon: RockLoop,
              action: () => console.log('Create RockLoop')
            },
            {
              label: 'Loop quad',
              icon: LoopQuad,
              action: () => console.log('Create LoopQuad')
            },
            {
              label: 'Tech loop',
              icon: TechLoop,
              action: () => console.log('Create TechLoop')
            }
          ]
        },
        {
          label: 'Buildings',
          icon: CityBulding1,
          submenu: [
            {
              label: 'City bulding 1',
              icon: CityBulding1,
              action: () => console.log('Create CityBulding1')
            },
            {
              label: 'City building 2',
              icon: CityBuilding2,
              action: () => console.log('Create CityBuilding2')
            },
            {
              label: 'City building 3',
              icon: CityBuilding3,
              action: () => console.log('Create CityBuilding3')
            },

            {
              label: 'Thin city building',
              icon: ThinCityBuilding,
              action: () => console.log('Create ThinCityBuilding')
            }
          ]
        },
        {
          label: 'Large arches',
          icon: LargeArch,
          action: () => console.log('Create LargeArch')
        },
        {
          label: 'Stripe cube',
          icon: StripeCube,
          action: () => console.log('Create StripeCube')
        },
        {
          label: 'Simple cube',
          icon: SimpleCube,
          action: () => console.log('Create SimpleCube')
        },
        {
          label: 'Multi disk',
          icon: Multidisk,
          action: () => console.log('Create Multidisk')
        },
        {
          label: 'Holo laser',
          icon: HoloLaser,
          action: () => console.log('Create HoloLaser')
        },
        {
          label: 'Rock ball particle',
          icon: RockBallParticle,
          action: () => console.log('Create RockBallParticle')
        },
        {
          label: 'Pumpkin',
          icon: Pumpkin,
          action: () => console.log('Create Pumpkin')
        },
        {
          label: 'Tentacle',
          icon: Tentacle,
          action: () => console.log('Create Tentacle')
        },
        {
          label: 'Direction panel',
          icon: DirectionPanel,
          action: () => console.log('Create DirectionPanel')
        },
        {
          label: 'Danger panel',
          icon: DangerPanel,
          action: () => console.log('Create DangerPanel')
        }
      ]
    },
    {
      label: 'Essentials',
      icon: StartLine,
      submenu: [
        {
          label: 'Start line',
          icon: StartLine,
          action: () => console.log('Create StartLine')
        },
        {
          label: 'Finish line',
          icon: FinishLine,
          action: () => console.log('Create FinishLine')
        }
      ]
    },
    {
      label: 'Procedural',
      icon: Procedural,
      submenu: [
        {
          label: 'Procedural city',
          icon: Procedural,
          action: () => console.log('Create ProceduralCity')
        },
        {
          label: 'Procedural rocks',
          icon: ProceduralRocks,
          action: () => console.log('Create ProceduralRocks')
        }
      ]
    },
    {
      label: 'Interactables',
      icon: EnergyPickup,
      submenu: [
        {
          label: 'Energy pickup',
          icon: EnergyPickup,
          action: () => console.log('Create EnergyPickup')
        },
        {
          label: 'Shield pickup',
          icon: ShieldPickup,
          action: () => console.log('Create ShieldPickup')
        },
        {
          label: 'Energy loop',
          icon: EnergyLoop,
          action: () => console.log('Create EnergyLoop')
        },
        {
          label: 'Fog shifter',
          icon: FogShifter,
          action: () => console.log('Create FogShifter')
        }
      ]
    }
  ]
});
