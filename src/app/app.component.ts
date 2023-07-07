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


  getMinimumTotal(): number {
    const pmrrAfiltered = this.plugs_mrr_A.filter(p => p.active === DisableStatus.Enabled).map(p => p.plug.reduce((a, b) => a + b, 0));
    const pmrrBfiltered = this.plugs_mrr_B.filter(p => p.active === DisableStatus.Enabled).map(p => p.plug.reduce((a, b) => a + b, 0));
    const pdisAfiltered = this.plugs_dis_A.filter(p => p.active === DisableStatus.Enabled).map(p => p.plug.reduce((a, b) => a + b, 0));
    const pdisBfiltered = this.plugs_dis_B.filter(p => p.active === DisableStatus.Enabled).map(p => p.plug.reduce((a, b) => a + b, 0));

    let minA = Math.min(...pmrrAfiltered);
    let minB = Math.min(...pmrrBfiltered);
    let minC = Math.min(...pdisAfiltered);
    let minD = Math.min(...pdisBfiltered);

    return minA + minB + minC + minD;
  }

  getMaximumTotal(): number {
    const pmrrAfiltered = this.plugs_mrr_A.filter(p => p.active === DisableStatus.Enabled).map(p => p.plug.reduce((a, b) => a + b, 0));
    const pmrrBfiltered = this.plugs_mrr_B.filter(p => p.active === DisableStatus.Enabled).map(p => p.plug.reduce((a, b) => a + b, 0));
    const pdisAfiltered = this.plugs_dis_A.filter(p => p.active === DisableStatus.Enabled).map(p => p.plug.reduce((a, b) => a + b, 0));
    const pdisBfiltered = this.plugs_dis_B.filter(p => p.active === DisableStatus.Enabled).map(p => p.plug.reduce((a, b) => a + b, 0));

    let minA = Math.max(...pmrrAfiltered);
    let minB = Math.max(...pmrrBfiltered);
    let minC = Math.max(...pdisAfiltered);
    let minD = Math.max(...pdisBfiltered);

    return minA + minB + minC + minD;
  }

  getProbabilityForTotal(total: number): number {
    const pmrrAfiltered = this.plugs_mrr_A.filter(p => p.active === DisableStatus.Enabled).map(p => p.plug.reduce((a, b) => a + b, 0));
    const pmrrBfiltered = this.plugs_mrr_B.filter(p => p.active === DisableStatus.Enabled).map(p => p.plug.reduce((a, b) => a + b, 0));
    const pdisAfiltered = this.plugs_dis_A.filter(p => p.active === DisableStatus.Enabled).map(p => p.plug.reduce((a, b) => a + b, 0));
    const pdisBfiltered = this.plugs_dis_B.filter(p => p.active === DisableStatus.Enabled).map(p => p.plug.reduce((a, b) => a + b, 0));

    let prob = 0;

    for (let i = 0; i < pmrrAfiltered.length; i++) {
      for (let j = 0; j < pmrrBfiltered.length; j++) {
        for (let k = 0; k < pdisAfiltered.length; k++) {
          for (let l = 0; l < pdisBfiltered.length; l++) {
            if (pmrrAfiltered[i] + pmrrBfiltered[j] + pdisAfiltered[k] + pdisBfiltered[l] >= total) {
              prob += 1;
            }
          }
        }
      }
    }
    return prob/(pmrrAfiltered.length * pmrrBfiltered.length * pdisAfiltered.length * pdisBfiltered.length);
  }


  //--------------------------------------------------------------------------------------------------------------------
  getMinimumTotalForTriplet(triplet: number): number {
    let pA = this.plugs_mrr_A, pB = this.plugs_mrr_B;
    if (triplet >= 1) pA = this.plugs_dis_A, pB = this.plugs_dis_B;

    const pAfiltered = pA.filter(p => p.active === DisableStatus.Enabled).map(p => p.plug.reduce((a, b) => a + b, 0));
    const pBfiltered = pB.filter(p => p.active === DisableStatus.Enabled).map(p => p.plug.reduce((a, b) => a + b, 0));

    let minA = Math.min(...pAfiltered);
    let minB = Math.min(...pBfiltered);
    return minA + minB;
  }

  getMaximumTotalForTriplet(triplet: number): number {
    let pA = this.plugs_mrr_A, pB = this.plugs_mrr_B;
    if (triplet >= 1) pA = this.plugs_dis_A, pB = this.plugs_dis_B;

    const pAfiltered = pA.filter(p => p.active === DisableStatus.Enabled).map(p => p.plug.reduce((a, b) => a + b, 0));
    const pBfiltered = pB.filter(p => p.active === DisableStatus.Enabled).map(p => p.plug.reduce((a, b) => a + b, 0));

    let minA = Math.max(...pAfiltered);
    let minB = Math.max(...pBfiltered);
    return minA + minB;
  }


  getProbabilityForTriplet(triplet: number, value: number): number {
    let pA = this.plugs_mrr_A, pB = this.plugs_mrr_B;
    if (triplet >= 1) pA = this.plugs_dis_A, pB = this.plugs_dis_B;

    const pAfiltered = pA.filter(p => p.active === DisableStatus.Enabled).map(p => p.plug.reduce((a, b) => a + b, 0));
    const pBfiltered = pB.filter(p => p.active === DisableStatus.Enabled).map(p => p.plug.reduce((a, b) => a + b, 0));

    // the result is the probability of the sum of two plugs being >= value
    let prob = 0;

    for (let i = 0; i < pAfiltered.length; i++) {
      for (let j = 0; j < pBfiltered.length; j++) {
        if (pAfiltered[i] + pBfiltered[j] >= value) {
          prob += 1;
        }
      }
    }
    return prob / (pAfiltered.length * pBfiltered.length);
  }


  //--------------------------------------------------------------------------------------------------------------------

  getMinimumForStat(stat: number): number {
    let pA = this.plugs_mrr_A, pB = this.plugs_mrr_B;
    if (stat > 2) pA = this.plugs_dis_A, pB = this.plugs_dis_B;

    const pAfiltered = pA.filter(p => p.active === DisableStatus.Enabled).map(p => p.plug[stat % 3]);
    const pBfiltered = pB.filter(p => p.active === DisableStatus.Enabled).map(p => p.plug[stat % 3]);

    let minA = Math.min(...pAfiltered);
    let minB = Math.min(...pBfiltered);
    return minA + minB;
  }

  getMaximumForStat(stat: number): number {
    let pA = this.plugs_mrr_A, pB = this.plugs_mrr_B;
    if (stat > 2) pA = this.plugs_dis_A, pB = this.plugs_dis_B;

    const pAfiltered = pA.filter(p => p.active === DisableStatus.Enabled).map(p => p.plug[stat % 3]);
    const pBfiltered = pB.filter(p => p.active === DisableStatus.Enabled).map(p => p.plug[stat % 3]);

    let minA = Math.max(...pAfiltered);
    let minB = Math.max(...pBfiltered);

    return minA + minB;
  }

  getProbabilityForStat(stat: number, value: number): number {
    let pA = this.plugs_mrr_A, pB = this.plugs_mrr_B;
    if (stat > 2) pA = this.plugs_dis_A, pB = this.plugs_dis_B;

    const pAfiltered = pA.filter(p => p.active === DisableStatus.Enabled).map(p => p.plug[stat % 3]);
    const pBfiltered = pB.filter(p => p.active === DisableStatus.Enabled).map(p => p.plug[stat % 3]);

    // the result is the probability of the sum of two plugs being >= value
    let prob = 0;

    for (let i = 0; i < pAfiltered.length; i++) {
      for (let j = 0; j < pBfiltered.length; j++) {
        if (pAfiltered[i] + pBfiltered[j] >= value) {
          prob += 1;
        }
      }
    }
    return prob / (pAfiltered.length * pBfiltered.length);
  }

  getStatName(stat: number): string {
    return ["Mobility", "Resilience", "Recovery", "Discipline", "Intellect", "Strength"][stat]
  }

  get statList(): number[] {
    return [0, 1, 2, 3, 4, 5]
  }

}
