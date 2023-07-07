import {ChangeDetectionStrategy, ChangeDetectorRef, Component, ViewChild} from '@angular/core';
import {Plugs} from "./data/plugs";
import {
  PlugStatisticsOverviewComponent
} from "./components/plug-statistics-overview/plug-statistics-overview.component";

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
})
export class AppComponent {
  plugs_mrr_A: BasicPlugEntry[] = [];
  plugs_mrr_B: BasicPlugEntry[] = [];
  plugs_dis_A: BasicPlugEntry[] = [];
  plugs_dis_B: BasicPlugEntry[] = [];

  // get viewchild observationTable which is a PlugStatisticsOverviewComponent
  @ViewChild('observationTable') observationTable!: PlugStatisticsOverviewComponent;

  constructor(public changeRef: ChangeDetectorRef) {
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
  desired_stats: number[] = [2, 2, 2, 2, 2, 2];

  filter(type: DisableStatus, targets: BasicPlugEntry[][], ft: (c: BasicPlugEntry) => boolean) {
    for (let target of targets) {
      target
        .filter(p => p.active === DisableStatus.Enabled)
        .filter(ft)
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

  update() {
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

    this.observationTable.trigger();
  }

  isGhostModDisabled(ghostMod: number): boolean {
    if (ghostMod == -1) return false;

    let group = Math.floor(ghostMod / 3);

    let groupExotic = Math.floor(this.filterExoticIntrinsic / 3);
    let groupWarTable = Math.floor(this.warTableFocus / 3);

    return group == groupExotic || group == groupWarTable;
  }


  //----------------------------------------------------------------------------------------------------

  public armorStatsEqual = false;

  getArmorProbability() {
    const pmrrAfiltered = this.plugs_mrr_A.filter(p => p.active === DisableStatus.Enabled);
    const pmrrBfiltered = this.plugs_mrr_B.filter(p => p.active === DisableStatus.Enabled);
    const pdisAfiltered = this.plugs_dis_A.filter(p => p.active === DisableStatus.Enabled);
    const pdisBfiltered = this.plugs_dis_B.filter(p => p.active === DisableStatus.Enabled);

    let requirement = (num: number, goal: number) => num >= goal;
    if (this.armorStatsEqual)
      requirement = (num: number, goal: number) => num == goal;

    // check MRR
    let probMRR = 0;
    for (let i = 0; i < pmrrAfiltered.length; i++) {
      for (let j = 0; j < pmrrBfiltered.length; j++) {
        if (!requirement(pmrrAfiltered[i].plug[0] + pmrrBfiltered[j].plug[0], this.desired_stats[0])) continue;
        if (!requirement(pmrrAfiltered[i].plug[1] + pmrrBfiltered[j].plug[1], this.desired_stats[1])) continue;
        if (!requirement(pmrrAfiltered[i].plug[2] + pmrrBfiltered[j].plug[2], this.desired_stats[2])) continue;
        probMRR += 1;
      }
    }
    probMRR /= pmrrAfiltered.length * pmrrBfiltered.length;

    // check DIS
    let probDIS = 0;
    for (let i = 0; i < pdisAfiltered.length; i++) {
      for (let j = 0; j < pdisBfiltered.length; j++) {
        if (!requirement(pdisAfiltered[i].plug[0] + pdisBfiltered[j].plug[0], this.desired_stats[3])) continue;
        if (!requirement(pdisAfiltered[i].plug[1] + pdisBfiltered[j].plug[1], this.desired_stats[4])) continue;
        if (!requirement(pdisAfiltered[i].plug[2] + pdisBfiltered[j].plug[2], this.desired_stats[5])) continue;
        probDIS += 1;
      }
    }
    probDIS /= pdisAfiltered.length * pdisBfiltered.length;

    return probMRR * probDIS;
  }


  //----------------------------------------------------------------------------------------------------

  getStatName(stat: number): string {
    return ["Mobility", "Resilience", "Recovery", "Discipline", "Intellect", "Strength"][stat]
  }

  get statList(): number[] {
    return [0, 1, 2, 3, 4, 5]
  }
}
