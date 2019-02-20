import { Component, OnDestroy, OnInit, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { Sede } from '../../../shared/model/sede.model';
import { UnitaAttualeService } from '../navbar-service/unita-attuale/unita-attuale.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UnitaOperativaService } from '../navbar-service/unita-operativa-service/unita-operativa.service';
import { CambioSedeModalNavComponent } from '../cambio-sede-modal-nav/cambio-sede-modal-nav.component';
import { Coordinate } from '../../../shared/model/coordinate.model';

@Component({
    selector: 'app-unita-operativa',
    templateUrl: './unita-operativa.component.html',
    styleUrls: ['./unita-operativa.component.css']
})
export class UnitaOperativaComponent implements OnInit, OnDestroy {

    subscription = new Subscription();
    unitaOperative: Sede[];
    unitaAttuale: Sede[];
    searchUnita: string;


    constructor(private _modalService: NgbModal,
                private unitaOperativaS: UnitaOperativaService,
                private unitaAttualeS: UnitaAttualeService) {
        this.unitaOperativaS.getUnitaOperative().subscribe(unitaOperative => {
            this.unitaOperative = unitaOperative;
        });
        this.subscription.add(
            this.unitaAttualeS.getUnitaOperativaAttuale().subscribe(unitaAttuale => {
                this.unitaAttuale = unitaAttuale;
            })
        );
        const sedeAttuale = [new Sede('1', 'Comando di Roma', new Coordinate(41.900170, 12.491000), 'Via Genova, 1, 00184 Roma RM', 'Comando', 'Lazio', 'Roma')];
        this.unitaAttualeS.sendUnitaOperativaAttuale(sedeAttuale);
        this.unitaAttualeS.startCount++;
    }

    ngOnInit() {
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    changeUnitaAttuale(newUnita: any) {
        this.openModal(newUnita);
    }

    openModal(newUnita: any) {
        const sedi: Sede[] = [];
        sedi.push(newUnita);
        this.unitaAttualeS.unitaSelezionata = sedi;
        this._modalService.open(CambioSedeModalNavComponent);
    }

}