import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnChanges, OnInit} from '@angular/core';
import {BasicPlugEntry, DisableStatus} from "../../app.component";

@Component({
  selector: 'app-plug-statistics-overview',
  templateUrl: './plug-statistics-overview.component.html',
  styleUrls: ['./plug-statistics-overview.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlugStatisticsOverviewComponent implements OnInit {
  @Input()
  public plugs_mrr_A: BasicPlugEntry[] = [];
  @Input()
  public plugs_mrr_B: BasicPlugEntry[] = [];
  @Input()
  public plugs_dis_A: BasicPlugEntry[] = [];
  @Input()
  public plugs_dis_B: BasicPlugEntry[] = [];

  constructor(private changeRef: ChangeDetectorRef) {
  }

  public trigger() {
    this.changeRef.markForCheck();
  }

  ngOnInit(): void {
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

  public n= 0;

  getProbabilityForTotal(total: number): number {
    this.n++;
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
  target_stat_value: number = 2;

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
