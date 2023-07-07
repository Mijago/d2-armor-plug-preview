import {Component, Input, OnChanges, OnInit} from '@angular/core';
import {BasicPlugEntry, DisableStatus} from "../../app.component";
import {state, style, trigger} from "@angular/animations";


interface PlugComboEntry {
  plugA: [number, number, number];
  plugB: [number, number, number];
  active: DisableStatus;
  x: number;
  y: number;
}

@Component({
  selector: 'app-plug-combination-visualiser',
  templateUrl: './plug-combination-visualiser.component.html',
  styleUrls: ['./plug-combination-visualiser.component.css'],
  animations: [
    trigger('changePointColor', [
      // rgba(0,176,0,0.7)
      state(DisableStatus.Enabled.toString(), style({fill: 'rgba(215,255,200,1)'})),
      state(DisableStatus.PitOfHeresy.toString(), style({fill: 'rgba(215,255,200,0)',stroke: 'rgba(204,154,145,0.05)'})), //
      state(DisableStatus.ExoticIntrinsic.toString(), style({fill: 'rgba(215,255,200,0)',stroke: 'rgba(255, 215, 0, 0.05)'})),
      state(DisableStatus.GhostMod.toString(), style({fill: 'rgba(215,255,200,0)',stroke: 'rgba(204,145,201,0.05)' })),
      state(DisableStatus.HighStat.toString(), style({fill: 'rgba(215,255,200,0)',stroke: 'rgba(145,204,195,0.05)' })),
      state(DisableStatus.WartableFocus.toString(), style({fill: 'rgba(215,255,200,0)',stroke: 'rgba(165,204,145,0.05)' })),
    ])
  ]
})
export class PlugCombinationVisualiserComponent implements OnInit, OnChanges {

  @Input()
  public activePlugsA: BasicPlugEntry[] = [];
  @Input()
  public activePlugsB: BasicPlugEntry[] = [];

  @Input()
  public names: [string,string,string] = ["x","y","z"];

  combos: PlugComboEntry[] = [];

  constructor() {
  }

  ngOnInit(): void {

  }

  // detect changes in the input
  ngOnChanges() {
    let combos : [number, number][] = []
    // create all combinations of active plugs
    this.combos = this.activePlugsA.map((plugA, i1) => {
      return this.activePlugsB.map((plugB, i2) => {
        let myId = [i1, i2]
        if (combos.some(c => c[0] == myId[0] && c[1] == myId[1])) {
          return null
        }


        combos.push([i1, i2])
        combos.push([i2, i1])
        return {
          plugA: plugA.plug,
          plugB: plugB.plug,
          active: plugA.active && plugB.active,
          x: this.mapPoint(plugA.plug[0] + plugB.plug[0], plugA.plug[1] + plugB.plug[1], plugA.plug[2] + plugB.plug[2]).x,
          y: this.mapPoint(plugA.plug[0] + plugB.plug[0], plugA.plug[1] + plugB.plug[1], plugA.plug[2] + plugB.plug[2]).y
        } as PlugComboEntry
      }).filter(c => c != null) as PlugComboEntry[]
    }).flat()

  }


  mapPoint(x: number, y: number, z: number) {
    // transform the 3d [xyz]coordinates into 2d [xy] coordinates
    // x,y,z are in the range 2..32
    return {
      x: 50 + 3.25 * (x - y) / 2,
      y: 60 + 2 * (x + y - 2 * z) / 2
    }
  }

}
