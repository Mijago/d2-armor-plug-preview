import {Component, Input, OnInit} from '@angular/core';

import {BasicPlugEntry, DisableStatus} from "../../app.component";
import { state, style, trigger} from "@angular/animations";

@Component({
  selector: 'app-plug-triplet-visualiser',
  templateUrl: './plug-triplet-visualiser.component.html',
  styleUrls: ['./plug-triplet-visualiser.component.css'],
  animations: [
    trigger('changePointColor', [
      state(DisableStatus.Enabled.toString(), style({fill: 'rgba(215,255,200,1)'})),
      state(DisableStatus.PitOfHeresy.toString(), style({fill: 'rgba(215,255,200,0)',stroke: 'rgba(204,154,145,0.4)'})), //
      state(DisableStatus.ExoticIntrinsic.toString(), style({fill: 'rgba(215,255,200,0)',stroke: 'rgba(255, 215, 0, 0.4)'})),
      state(DisableStatus.GhostMod.toString(), style({fill: 'rgba(215,255,200,0)',stroke: 'rgba(204,145,201,0.4)' })),
      state(DisableStatus.HighStat.toString(), style({fill: 'rgba(215,255,200,0)',stroke: 'rgba(145,204,195,0.4)' })),
      state(DisableStatus.WartableFocus.toString(), style({fill: 'rgba(215,255,200,0)',stroke: 'rgba(165,204,145,0.4)' })),
    ])
  ]
})
export class PlugTripletVisualiserComponent implements OnInit {
  @Input()
  public names: [string,string,string] = ["x","y","z"];
  @Input()
  public activePlugs: BasicPlugEntry[] = [];

  constructor() {
  }

  ngOnInit(): void {
  }

  mapPoint(x: number, y: number, z: number) {
    // transform the 3d [xyz]coordinates into 2d [xy] coordinates
    // x,y,z are in the range 1..15
    return {
      x: 50 + 3.25*(x - y),
      y: 60 + 2*(x + y - 2 * z)
    }
  }

}
