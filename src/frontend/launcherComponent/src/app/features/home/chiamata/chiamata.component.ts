import { Component, isDevMode, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EnteModalComponent } from '../../../shared/modal/ente-modal/ente-modal.component';
import { ClearFormEnte, RequestAddEnte } from '../../../shared/store/actions/enti/enti.actions';
import { PermissionFeatures } from '../../../shared/enum/permission-features.enum';

@Component({
    selector: 'app-chiamata',
    templateUrl: './chiamata.component.html',
    styleUrls: ['./chiamata.component.css']
})
export class ChiamataComponent implements OnInit, OnDestroy {

    permessiFeature = PermissionFeatures;

    constructor(private modalService: NgbModal,
                private store: Store) {
    }

    ngOnInit(): void {
        isDevMode() && console.log('Componente Chiamata creato');
    }

    ngOnDestroy(): void {
        isDevMode() && console.log('Componente Chiamata distrutto');
    }

    aggiungiNuovoEnte() {
        const addEnteModal = this.modalService.open(EnteModalComponent, {
            backdropClass: 'light-blue-backdrop',
            centered: true,
            size: 'lg'
        });
        addEnteModal.result.then(
            (result: { success: boolean }) => {
                if (result.success) {
                    this.store.dispatch(new RequestAddEnte());
                } else if (!result.success) {
                    this.store.dispatch(new ClearFormEnte());
                    console.log('Modal "addEnteModal" chiusa con val ->', result);
                }
            },
            (err) => {
                this.store.dispatch(new ClearFormEnte());
                console.error('Modal chiusa senza bottoni. Err ->', err);
            }
        );
    }
}
