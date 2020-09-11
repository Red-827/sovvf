import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Store, Select } from '@ngxs/store';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription, Observable } from 'rxjs';
import { Utente } from '../../model/utente.model';
import { UpdateFormValue } from '@ngxs/form-plugin';
import { AuthState } from 'src/app/features/auth/store/auth.state';
import { ModificaPartenzaModalState } from '../../store/states/modifica-partenza-modal/modifica-partenza-modal.state';
import { Partenza } from './../../model/partenza.model';
import { statoMezzoColor } from '../../helper/function';
import { StatoMezzo } from '../../enum/stato-mezzo.enum';
import { SostituzionePartenzaModalComponent } from '../sostituzione-partenza-modal/sostituzione-partenza-modal.component';
import { ListaSquadre } from '../../interface/lista-squadre';
import { VisualizzaListaSquadrePartenza } from 'src/app/features/home/store/actions/richieste/richieste.actions';

export interface SequenzaValoriSelezionati {
    stato: string;
    time: { hour: number, minute: number };
}

@Component({
    selector: 'app-modifica-partenza-modal',
    templateUrl: './modifica-partenza-modal.component.html',
    styleUrls: ['./modifica-partenza-modal.component.css']
})
export class ModificaPartenzaModalComponent implements OnInit, OnDestroy {

    @Select(AuthState.currentUser) user$: Observable<Utente>;
    user: Utente;
    @Select(ModificaPartenzaModalState.formValid) formValid$: Observable<boolean>;
    formValid: boolean;

    operatore: string;
    sede: string;
    partenza: Partenza;
    idRichiesta: string;
    public time = { hour: 13, minute: 30 };
    listaStatoMezzo: any[];
    statoMezzoSelezionato: string;
    sequenze: SequenzaValoriSelezionati[] = [];

    modificaPartenzaForm: FormGroup;
    submitted: boolean;

    subscription: Subscription = new Subscription();

    constructor(private store: Store,
                private modal: NgbActiveModal,
                private fb: FormBuilder,
                private modalService: NgbModal,
                public activeModal: NgbActiveModal) {
        this.initForm();
        this.getFormValid();
        this.inizializzaUser();
        this.formatTime();
    }

    ngOnInit() {
        this.listaStatoMezzo = Object.values(StatoMezzo).map(x => ({ id: x, name: x }));
    }

    initForm() {
        this.modificaPartenzaForm = new FormGroup({
            operatore: new FormControl(),
            sede: new FormControl(),
            codMezzo: new FormControl(),
            codSquadre: new FormControl(),
            sequenze: new FormControl(),
            mezzoDaAnnullare: new FormControl(),
            squadreDaAnnullare: new FormControl(),
            motivazione: new FormControl(),
            partenzaAnnullata: new FormControl(),
        });
        this.modificaPartenzaForm = this.fb.group({
            operatore: [null],
            sede: [null],
            codMezzo: [null],
            codSquadre: [null],
            sequenze: [null],
            mezzoDaAnnullare: [null],
            squadreDaAnnullare: [null],
            motivazione: [null],
            partenzaAnnullata: [false],
        });
    }

    get f() {
        return this.modificaPartenzaForm.controls;
    }

    ngOnDestroy(): void {
        this.modificaPartenzaForm.reset();
        this.subscription.unsubscribe();
    }


    getFormValid() {
        this.subscription.add(
            this.formValid$.subscribe((valid: boolean) => {
                this.formValid = valid;
            })
        );
    }


    getTitle(): string {
        const title = 'Modifica Partenza Richiesta ' + this.partenza.mezzo['idRichiesta'];
        return title;
    }

    inizializzaUser() {
        this.subscription.add(
            this.user$.subscribe((user: Utente) => {
                console.log('inizializzaUser', user);
                this.store.dispatch(
                    new UpdateFormValue({
                        path: 'modificaPartenzaModal.modificaPartenzaForm',
                        value: {
                            operatore: user.nome + ' ' + user.cognome,
                            sede: user.sede.descrizione
                        }
                    })
                );
            })
        );
    }

    onConferma() {
        this.submitted = true;

        if (!this.modificaPartenzaForm.valid) {
            return;
        }

        this.formatTimeForCallBack();
        this.modificaPartenzaForm.value.sequenze = this.sequenze;
        if (!this.modificaPartenzaForm.value.mezzoDaAnnullare) {
            this.modificaPartenzaForm.value.codMezzo = this.partenza.mezzo.codice;
        }
        if (!this.modificaPartenzaForm.value.squadreDaAnnullare) {
            this.modificaPartenzaForm.value.codSquadre = this.partenza.squadre.map(x => x.id);
        }
        console.log('VALUE MODIFICA PARTENZA FORM: ', this.modificaPartenzaForm.value);
        this.modal.close({ status: 'ok', result: this.modificaPartenzaForm.value });
    }

    onDismiss(): void {
        this.modal.dismiss('ko');
    }

    closeModal(type: string) {
        this.modal.close(type);
    }

    formatTime() {
        const d = new Date();
        this.time.hour = d.getHours();
        this.time.minute = d.getMinutes();
    }


    formatTimeForCallBack(): any {
        return { oraEvento: this.sequenze['time'] };
    }


    statoMezzoColor(stato: StatoMezzo) {
        return statoMezzoColor(stato);
    }


    onAddSequenza() {
        const d = new Date();
        this.sequenze.push({ stato: undefined, time: { hour: d.getHours(), minute: d.getMinutes() } });
    }

    onRemoveSequenza() {
        this.sequenze.pop();
    }

    openSostituzioneModal() {
        const sostituzioneModal = this.modalService.open(SostituzionePartenzaModalComponent, {
            windowClass: 'modal-holder',
            size: 'lg',
            centered: true
        });
        sostituzioneModal.componentInstance.idRichiesta = this.idRichiesta;
        sostituzioneModal.componentInstance.codRichiesta = this.partenza.mezzo.idRichiesta;
        sostituzioneModal.result.then((res: { status: string, result: any }) => {
            switch (res.status) {
                case 'ok' :
                    console.log('RES SECONDO MODALE: ', res.result)
                    let nuovaPartenza = res.result;
                    if (nuovaPartenza.codMezzo && nuovaPartenza.codSquadre.length > 0) {
                        this.modificaPartenzaForm.value.partenzaAnnullata = true;
                        this.modificaPartenzaForm.value.codMezzo = nuovaPartenza.codMezzo;
                        this.modificaPartenzaForm.value.codSquadre = nuovaPartenza.codSquadre.map(x => x);
                        this.modificaPartenzaForm.value.mezzoDaAnnullare =  this.partenza.mezzo.codice;
                        this.modificaPartenzaForm.value.squadreDaAnnullare = this.partenza.squadre.map(x => x.id);
                        this.modificaPartenzaForm.value.motivazione = nuovaPartenza.motivazione;
                    }
                    break;
                case 'ko':
                    break;
            }
        });
    }

    onListaSquadrePartenza() {
        const listaSquadre = {} as ListaSquadre;
        listaSquadre.idPartenza = this.partenza.id;
        listaSquadre.squadre = this.partenza.squadre;
        this.store.dispatch(new VisualizzaListaSquadrePartenza(listaSquadre));
    }


    /*
    const orario = res.result.oraEvento;
    this.actionMezzo.emit({ mezzoAction: this.statoMezzoActions, oraEvento: { ora: orario.hour, minuti: orario.minute } });


    onActionMezzo(action?: MezzoActionEmit) {
    let actionMezzo: MezzoActionInterface;
    if (action) {
        let data = new Date();
        const orario = action.oraEvento;
        data.setHours(orario.ora);
        data.setMinutes(orario.minuti);
        data.setSeconds(0);
        data.setMilliseconds(0);
        data = new Date(data.getTime() + OFFSET_SYNC_TIME[0]);
        actionMezzo = { 'mezzo': this.mezzo, 'action': action.mezzoAction, 'data': data };
    } else {
        actionMezzo = { 'mezzo': this.mezzo, 'action': null };
    }
    this.actionMezzo.emit(actionMezzo);
    }

    onActionMezzo(mezzoInServizio: Mezzo, mezzoAction: MezzoActionInterface) {
    mezzoAction.codRichiesta = mezzoInServizio.idRichiesta;
    mezzoAction.listaMezzi = true;
    this.store.dispatch(new ActionMezzo(mezzoAction));
    }

    this.sequenze.stato.replace(' ', '');
    */

}
