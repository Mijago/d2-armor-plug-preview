import {ChangeDetectionStrategy, Component} from '@angular/core';
import {Plugs} from "./data/plugs";

export interface BasicPlugEntry {
  plug: [number, number, number];
  active: DisableStatus;
}

export enum DisableStatus {
  Enabled,
  ExoticIntrinsic,
  PitOfHeresy,
  WartableFocus,
  GhostMod,
  HighStat,
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  plugs_mrr_A: BasicPlugEntry[] = [];
  plugs_mrr_B: BasicPlugEntry[] = [];
  plugs_dis_A: BasicPlugEntry[] = [];
  plugs_dis_B: BasicPlugEntry[] = [];


  constructor() {
    this.plugs_mrr_A = Plugs.map(plug => {
      return {plug: plug, active: DisableStatus.Enabled,} as BasicPlugEntry
    })
    this.plugs_mrr_B = Plugs.map(plug => {
      return {plug: plug, active: DisableStatus.Enabled,} as BasicPlugEntry
    });
    this.plugs_dis_A = Plugs.map(plug => {
      return {plug: plug, active: DisableStatus.Enabled,} as BasicPlugEntry
    });
    this.plugs_dis_B = Plugs.map(plug => {
      return {plug: plug, active: DisableStatus.Enabled,} as BasicPlugEntry
    });
  }


  title = 'armor-plug-preview';
  filterGhost: -1 | number = -1;
  filterExoticIntrinsic: -1 | number = -1;
  filterHighStat: number = 0;
  warTableFocus: number = -1;

  filter(type: DisableStatus, targets: BasicPlugEntry[][], ft: (c: BasicPlugEntry) => boolean) {
    for (let target of targets) {
      target
        .filter(ft)
        .filter(p => p.active === DisableStatus.Enabled)
        .forEach((p: BasicPlugEntry) => {
          p.active = type;
        });
    }
  }

  reset_filter() {
    this.plugs_mrr_A.forEach((p: BasicPlugEntry) => p.active = DisableStatus.Enabled);
    this.plugs_mrr_B.forEach((p: BasicPlugEntry) => p.active = DisableStatus.Enabled);
    this.plugs_dis_A.forEach((p: BasicPlugEntry) => p.active = DisableStatus.Enabled);
    this.plugs_dis_B.forEach((p: BasicPlugEntry) => p.active = DisableStatus.Enabled);
  }

  async update() {
    this.reset_filter();

    if (this.filterHighStat == 1) {
      this.filter(DisableStatus.HighStat, [this.plugs_mrr_A, this.plugs_mrr_B, this.plugs_dis_A, this.plugs_dis_B],
        (p: BasicPlugEntry) => p.plug[0] + p.plug[1] + p.plug[2] < 14);
    }


    if (this.warTableFocus == 6) {
      this.filter(
        DisableStatus.PitOfHeresy,
        [this.plugs_mrr_A, this.plugs_dis_A],
        (p: BasicPlugEntry) => !(
          (p.plug[0] == 1 && p.plug[1] == 1 && p.plug[2] == 15)
          || (p.plug[0] == 15 && p.plug[1] == 1 && p.plug[2] == 1)
          || (p.plug[0] == 1 && p.plug[1] == 15 && p.plug[2] == 1)
        ),);
    } else if (this.warTableFocus > -1 && this.warTableFocus < 3) {
      this.filter(
        DisableStatus.WartableFocus,
        [this.plugs_mrr_A],
        (p: BasicPlugEntry) => p.plug[this.warTableFocus] != 15);
    } else if (this.warTableFocus > 2 && this.warTableFocus < 6) {
      this.filter(
        DisableStatus.WartableFocus,
        [this.plugs_dis_A],
        (p: BasicPlugEntry) => p.plug[this.warTableFocus - 3] != 15);
    }

    if (this.filterExoticIntrinsic > -1 && this.filterExoticIntrinsic < 3) {
      this.filter(DisableStatus.ExoticIntrinsic, [this.plugs_mrr_A, this.plugs_mrr_B],
        (p: BasicPlugEntry) => p.plug[this.filterExoticIntrinsic] == 1,
      );
    }
    if (this.filterExoticIntrinsic > 2 && this.filterExoticIntrinsic < 6) {
      this.filter(DisableStatus.ExoticIntrinsic, [this.plugs_dis_A, this.plugs_dis_B],
        (p: BasicPlugEntry) => p.plug[this.filterExoticIntrinsic - 3] == 1,
      );
    }

    if (!this.isGhostModDisabled(this.filterGhost)) {
      if (this.filterGhost > -1 && this.filterGhost < 3 && (this.filterExoticIntrinsic <= -1 || this.filterExoticIntrinsic > 2)) {
        this.filter(DisableStatus.GhostMod, [this.plugs_mrr_A, this.plugs_mrr_B],
          (p: BasicPlugEntry) => p.plug[this.filterGhost] == 1,
        );
      }
      if (this.filterGhost > 2 && this.filterGhost < 6 && (this.filterExoticIntrinsic < 3)) {
        this.filter(DisableStatus.GhostMod, [this.plugs_dis_A, this.plugs_dis_B],
          (p: BasicPlugEntry) => p.plug[this.filterGhost - 3] == 1,
        );
      }
    }
  }

  isGhostModDisabled(ghostMod: number): boolean {
    if (ghostMod == -1) return false;

    let group = Math.floor(ghostMod / 3);

    let groupExotic = Math.floor(this.filterExoticIntrinsic / 3);
    let groupWarTable = Math.floor(this.warTableFocus / 3);

    return group == groupExotic || group == groupWarTable;
  }

}
