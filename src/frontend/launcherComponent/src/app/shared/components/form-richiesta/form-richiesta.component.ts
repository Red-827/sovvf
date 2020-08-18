import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { Localita } from 'src/app/shared/model/localita.model';
import { Coordinate } from 'src/app/shared/model/coordinate.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Address } from 'ngx-google-places-autocomplete/objects/address';
import { Observable, Subscription } from 'rxjs';
import { SchedaContatto } from 'src/app/shared/interface/scheda-contatto.interface';
import { Options } from 'ngx-google-places-autocomplete/objects/options/options';
import { LatLngBounds } from 'ngx-google-places-autocomplete/objects/latLngBounds';
import { ComponentRestrictions } from 'ngx-google-places-autocomplete/objects/options/componentRestrictions';
import { Tipologia } from '../../model/tipologia.model';
import { Utente } from '../../model/utente.model';
import { ChiamataMarker } from '../../../features/home/maps/maps-model/chiamata-marker.model';
import { AzioneChiamataEnum } from '../../enum/azione-chiamata.enum';
import { SintesiRichiesta } from '../../model/sintesi-richiesta.model';
import { Select, Store } from '@ngxs/store';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { OFFSET_SYNC_TIME } from '../../../core/settings/referral-time';
import { GOOGLEPLACESOPTIONS } from '../../../core/settings/google-places-options';
import { HomeState } from '../../../features/home/store/states/home.state';
import { ClearClipboard } from '../../../features/home/store/actions/chiamata/clipboard.actions';
import { DelChiamataMarker } from '../../../features/home/store/actions/maps/chiamate-markers.actions';
import { StatoRichiesta } from '../../enum/stato-richiesta.enum';
import { Richiedente } from '../../model/richiedente.model';
import { ConfirmModalComponent } from '../..';
import { makeCopy, makeIdChiamata, roundTodecimal } from '../../helper/function';
import { ToastrType } from '../../enum/toastr';
import { ShowToastr } from '../../store/actions/toastr/toastr.actions';
import { SchedaTelefonataInterface } from '../../interface/scheda-telefonata.interface';
import { SchedeContattoState } from '../../../features/home/store/states/schede-contatto/schede-contatto.state';
import { Ente } from '../../interface/ente.interface';
import { ReducerFormRichiesta } from '../../store/actions/form-richiesta/form-richiesta.actions';
import { ChiudiRichiestaModifica, ClearRichiestaModifica, ModificaIndirizzo } from '../../../features/home/store/actions/richieste/richiesta-modifica.actions';
import { UpdateFormValue } from '@ngxs/form-plugin';
import { RichiestaModificaState } from '../../../features/home/store/states/richieste/richiesta-modifica.state';
import { FormRichiestaState } from '../../store/states/form-richiesta/form-richiesta.state';
import { AuthState } from '../../../features/auth/store/auth.state';
import { EntiState } from '../../store/states/enti/enti.state';
import { ToggleModifica } from '../../../features/home/store/actions/view/view.actions';
import { PatchRichiesta } from '../../../features/home/store/actions/richieste/richieste.actions';

@Component({
    selector: 'app-form-richiesta',
    templateUrl: './form-richiesta.component.html',
    styleUrls: ['./form-richiesta.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class FormRichiestaComponent implements OnInit, OnDestroy {

    @Input() editMode: boolean;

    @Input() disabledInviaPartenza = false;

    @Output() aggiungiNuovoEnte: EventEmitter<boolean> = new EventEmitter<boolean>();

    @Select(FormRichiestaState.loadingFormRichiesta) loading$: Observable<boolean>;
    @Select(AuthState.currentUser) currentUser$: Observable<Utente>;
    operatore: Utente;
    @Select(HomeState.tipologie) tipologie$: Observable<Tipologia[]>;
    tipologie: Tipologia[];
    @Select(EntiState.enti) enti$: Observable<Ente[]>;
    enti: Ente[];

    // select scheda contatto telefonata
    @Select(SchedeContattoState.schedaContattoTelefonata) schedaContattoTelefonata$: Observable<SchedaContatto>;

    // select richiesta modifica
    @Select(RichiestaModificaState.richiestaModifica) richiestaModifica$: Observable<SintesiRichiesta>;
    richiestaModificaIniziale: SintesiRichiesta;
    richiestaModifica: SintesiRichiesta;

    // form
    richiestaForm: FormGroup;
    submitted = false;
    campiModificati = [];

    // dati richiesta
    idChiamata: string;
    nuovaRichiesta: SintesiRichiesta;

    // scheda contatto, se presente
    idSchedaContatto: string;

    // select indirizzi google
    ngxGooglePlacesOptions: Options;

    // mappa
    chiamataMarker: ChiamataMarker;
    coordinate: Coordinate;

    AzioneChiamataEnum = AzioneChiamataEnum;
    isCollapsed = true;
    subscription = new Subscription();

    constructor(private formBuilder: FormBuilder,
                private store: Store,
                private modalService: NgbModal) {
        this.setGooglePlacesOptions();
        this.getOperatore();
        this.getTipologie();
        this.getEnti();
    }

    ngOnInit() {
        // controllo se è "Crea Chiamata" o "Modifica Chiamata/Richiesta"
        if (!this.editMode) {
            // creo un id per la chiamata
            this.idChiamata = makeIdChiamata(this.operatore);
            // inizializzo la nuova richiesta
            this.initNuovaRichiesta();
            // richiesta proveniente da scheda contatto
            this.getSchedaContattoTelefonata();
        } else if (this.editMode) {
            this.getRichiestaModifica();
        }

        // creo il form
        this.createForm();
    }

    ngOnDestroy(): void {
        // reset del form
        this.clearForm();
        // unsubscribe
        this.subscription.unsubscribe();
    }

    createForm(): void {
        this.richiestaForm = this.formBuilder.group({
            selectedTipologie: [null, Validators.required],
            nominativo: [null, Validators.required],
            telefono: [null, [Validators.required, Validators.pattern('^(\\+?)[0-9]+$')]],
            indirizzo: [null, Validators.required],
            latitudine: [null, [Validators.required, Validators.pattern('^(\\-?)([0-9]+)(\\.)([0-9]+)$')]],
            longitudine: [null, [Validators.required, Validators.pattern('^(\\-?)([0-9]+)(\\.)([0-9]+)$')]],
            piano: [null],
            etichette: [null],
            noteIndirizzo: [null],
            rilevanzaGrave: [false],
            rilevanzaStArCu: [false],
            notePrivate: [null],
            notePubbliche: [null],
            descrizione: [null],
            zoneEmergenza: [null],
            prioritaRichiesta: [3, Validators.required],
            listaEnti: [null]
        });
    }

    get f(): any {
        return this.richiestaForm.controls;
    }

    patchForm(): void {
        const zoneEmergenza = (this.richiestaModifica.zoneEmergenza && this.richiestaModifica.zoneEmergenza.length > 0) ? this.richiestaModifica.zoneEmergenza.join(' ') : [];
        const etichette = (this.richiestaModifica.tags && this.richiestaModifica.tags.length > 0) ? this.richiestaModifica.tags : [];
        const listaEnti = (this.richiestaModifica.listaEnti && this.richiestaModifica.listaEnti.length > 0) ? this.richiestaModifica.listaEnti : [];
        const tipologie = (this.richiestaModifica.tipologie && this.richiestaModifica.tipologie.length > 0) ? this.richiestaModifica.tipologie : [];
        const obj = {
            selectedTipologie: tipologie.map(t => t.codice),
            nominativo: this.richiestaModifica.richiedente.nominativo,
            telefono: this.richiestaModifica.richiedente.telefono,
            indirizzo: this.richiestaModifica.localita.indirizzo,
            etichette: etichette,
            noteIndirizzo: this.richiestaModifica.localita.note,
            rilevanzaGrave: this.richiestaModifica.rilevanteGrave,
            rilevanzaStArCu: this.richiestaModifica.rilevanteStArCu,
            latitudine: this.richiestaModifica.localita.coordinate.latitudine,
            longitudine: this.richiestaModifica.localita.coordinate.longitudine,
            piano: this.richiestaModifica.localita.piano,
            notePrivate: this.richiestaModifica.notePrivate,
            notePubbliche: this.richiestaModifica.notePubbliche,
            motivazione: this.richiestaModifica.descrizione,
            zoneEmergenza: zoneEmergenza,
            prioritaRichiesta: this.richiestaModifica.prioritaRichiesta,
            listaEnti: listaEnti.map(e => e.codice)
        };
        this.store.dispatch(new UpdateFormValue({
            path: 'formRichiesta.form',
            value: obj
        }));
    }

    clearForm(): void {
        this.submitted = false;
        this.coordinate = null;
        this.isCollapsed = true;
        this.richiestaForm.reset();
        this._reducerFormRichiesta('reset');
        this.store.dispatch(new ClearClipboard());
        if (!this.editMode) {
            this.clearTipologieSelezionate();
            this.store.dispatch(new DelChiamataMarker(this.idChiamata));
        }
    }

    initNuovaRichiesta() {
        this.nuovaRichiesta = new SintesiRichiesta(
            this.idChiamata,
            null,
            null,
            new Utente(this.operatore.id, this.operatore.nome, this.operatore.cognome, this.operatore.codiceFiscale, this.operatore.sede, this.operatore.username),
            new Date(new Date().getTime() + OFFSET_SYNC_TIME[0]),
            StatoRichiesta.Chiamata,
            0,
            null,
            null,
            null,
            null,
            null,
            null
        );
        this.nuovaRichiesta.rilevanteStArCu = false;
        this.nuovaRichiesta.rilevanteGrave = false;
    }

    setNuovaRichiesta() {
        const f = this.f;

        if (this.editMode) {
            this.nuovaRichiesta = this.richiestaModifica;
        }

        this.nuovaRichiesta.richiedente = new Richiedente(f.telefono.value, f.nominativo.value);
        this.nuovaRichiesta.localita.note = f.noteIndirizzo.value;
        this.nuovaRichiesta.localita.indirizzo = f.indirizzo.value;
        this.nuovaRichiesta.localita.coordinate.longitudine = f.longitudine.value;
        this.nuovaRichiesta.localita.coordinate.latitudine = f.latitudine.value;
        this.nuovaRichiesta.tags = (f.etichette.value && f.etichette.value.length > 0) ? f.etichette.value : null;
        this.nuovaRichiesta.rilevanteGrave = f.rilevanzaGrave.value ? f.rilevanzaGrave.value : false;
        this.nuovaRichiesta.rilevanteStArCu = f.rilevanzaStArCu.value ? f.rilevanzaStArCu.value : false;
        this.nuovaRichiesta.descrizione = f.descrizione.value;
        this.nuovaRichiesta.zoneEmergenza = (f.zoneEmergenza.value && f.zoneEmergenza.value.length > 0) ? f.zoneEmergenza.value.split(' ') : null;
        this.nuovaRichiesta.notePrivate = f.notePrivate.value;
        this.nuovaRichiesta.notePubbliche = f.notePubbliche.value;
        this.nuovaRichiesta.prioritaRichiesta = f.prioritaRichiesta.value;
        this.nuovaRichiesta.localita.piano = f.piano.value;
        this.nuovaRichiesta.codiceSchedaNue = this.idSchedaContatto ? this.idSchedaContatto : null;
        this.nuovaRichiesta.listaEnti = (f.listaEnti.value && f.listaEnti.value.length) ? f.listaEnti.value : null;
        this.setDescrizione();
    }

    setRilevanza() {
        if (this.f.rilevanzaGrave.value === true) {
            this.f.rilevanzaGrave.setValue(false);
        } else {
            this.f.rilevanzaGrave.setValue(true);
        }
    }

    setRilevanzaStArCu() {
        if (this.f.rilevanzaStArCu.value === true) {
            this.f.rilevanzaStArCu.setValue(false);
        } else {
            this.f.rilevanzaStArCu.setValue(true);
        }
    }

    onAddTipologia(tipologia: any) {
        if (!this.nuovaRichiesta.tipologie) {
            this.nuovaRichiesta.tipologie = [];
            this.onAddTipologia(tipologia);
        } else {
            this.nuovaRichiesta.tipologie.push(tipologia);
        }
    }

    onRemoveTipologia(tipologia: any) {
        this.nuovaRichiesta.tipologie.splice(this.nuovaRichiesta.tipologie.indexOf(tipologia.codice), 1);
    }

    checkTipologie(): boolean {
        return !!!(this.nuovaRichiesta.tipologie && (this.nuovaRichiesta.tipologie.length > 0));
    }

    clearTipologieSelezionate() {
        this.f.selectedTipologie.patchValue([]);
        this.nuovaRichiesta.tipologie = [];
    }

    setGooglePlacesOptions(): void {
        this.ngxGooglePlacesOptions = new Options({
            bounds: this.store.selectSnapshot(HomeState.bounds) as unknown as LatLngBounds,
            componentRestrictions: GOOGLEPLACESOPTIONS.componentRestrictions as unknown as ComponentRestrictions
        });
    }

    onCopiaIndirizzo(): void {
        this._reducerFormRichiesta('copiaIndirizzo');
    }

    onCercaIndirizzo(result: Address): void {
        if (!this.editMode) {
            const lat = roundTodecimal(result.geometry.location.lat(), 6);
            const lng = roundTodecimal(result.geometry.location.lng(), 6);
            this.coordinate = new Coordinate(lat, lng);
            this.chiamataMarker = new ChiamataMarker(this.idChiamata, `${this.operatore.nome} ${this.operatore.cognome}`, `${this.operatore.sede.codice}`,
                new Localita(this.coordinate ? this.coordinate : null, result.formatted_address), null
            );
            this.nuovaRichiesta.localita = new Localita(this.coordinate ? this.coordinate : null, result.formatted_address, null);
            this.f.latitudine.patchValue(lat);
            this.f.longitudine.patchValue(lng);
            this.f.indirizzo.patchValue(result.formatted_address);
            this._reducerFormRichiesta('cerca');
        } else if (this.editMode) {
            const coordinate = new Coordinate(roundTodecimal(result.geometry.location.lat(), 6), roundTodecimal(result.geometry.location.lng(), 6));
            this.coordinate = coordinate;
            this.f.latitudine.patchValue(coordinate.latitudine);
            this.f.longitudine.patchValue(coordinate.longitudine);
            this.f.indirizzo.patchValue(result.formatted_address);
            const nuovoIndirizzo = new Localita(coordinate ? coordinate : null, result.formatted_address);
            this.store.dispatch(new ModificaIndirizzo(nuovoIndirizzo));
        }
    }

    getMsgIndirizzo(): string {
        let msg = '';
        if (this.f.indirizzo.errors && !this.coordinate) {
            msg = 'L\'indirizzo è richiesto';
        } else if (this.f.indirizzo.errors) {
            msg = 'L\'indirizzo è richiesto';
        } else if (!this.coordinate) {
            msg = 'È necessario selezionare un indirizzo dall\'elenco';
        } else {
            return null;
        }
        return msg;
    }

    // todo: rivedere funzionamento
    checkNessunCampoModificato(): boolean {
        let _return = false;
        if (!this.f.selectedTipologie.value && !this.f.nominativo.value && !this.f.telefono.value
            && !this.f.indirizzo.value && !this.f.latitudine.value && !this.f.longitudine.value
            && !this.f.piano.value && !this.f.etichette.value && !this.f.noteIndirizzo.value
            && !this.f.rilevanzaGrave.value && !this.f.rilevanzaStArCu.value
            && !this.f.notePrivate.value && !this.f.notePubbliche.value
            && !this.f.descrizione.value && !this.f.zoneEmergenza.value
            && this.f.prioritaRichiesta.value === 3) {
            _return = true;
        }
        return _return;
    }

    // todo: rivedere funzionamento
    formIsValid(): boolean {
        const messageArr: string[] = this.countErrorForm();
        let message = messageArr.join(', ');
        const title = messageArr.length > 1 ? 'Campi obbligatori:' : 'Campo obbligatorio:';
        if (messageArr.length > 0) {
            message = message.substring(0, message.length - 2);
            const type = ToastrType.Error;
            this.store.dispatch(new ShowToastr(ToastrType.Clear));
            this.store.dispatch(new ShowToastr(type, title, message));
        } else {
            this.store.dispatch(new ShowToastr(ToastrType.Clear));
        }
        return !!this.richiestaForm.invalid;
    }

    // todo: rivedere funzionamento
    countErrorForm(): string[] {
        let error = '';
        error += this.f.selectedTipologie.errors ? 'Tipologia;' : '';
        error += this.f.nominativo.errors ? 'Nominativo;' : '';
        // error += this.f.cognome.errors ? 'Cognome;' : '';
        // error += this.f.nome.errors ? 'Nome;' : '';
        // error += this.f.ragioneSociale.errors ? 'Ragione Sociale;' : '';
        error += this.f.telefono.errors ? 'Telefono;' : '';
        error += this.f.indirizzo.errors ? 'Indirizzo;' : '';
        // error += this.f.descrizione.errors ? 'Motivazione;' : '';
        const errors: string[] = error.split(/\s*(?:;|$)\s*/);
        return errors;
    }

    checkInputPattern(event: any, type: string): void {
        let regexp;
        switch (type) {
            case 'PHONE':
                regexp = /^[0-9\+]*$/;
                break;
            case 'LAT_LON':
                regexp = /^[0-9\.\-]$/;
                break;
        }
        let inputValue;
        if (event instanceof ClipboardEvent) {
            inputValue = event.clipboardData.getData('Text');
        } else {
            inputValue = event.key;
        }
        if (!regexp.test(inputValue)) {
            event.preventDefault();
        }
    }

    setDescrizione(): void {
        const form = this.f;
        if (!form.descrizione.value) {
            const nuovaDescrizione = this.tipologie.filter(tipologia => tipologia.codice === form.selectedTipologie.value[0]);
            if (nuovaDescrizione) {
                this.nuovaRichiesta.descrizione = nuovaDescrizione[0].descrizione;
            }
        }
    }

    toggleCollapsed(): void {
        if (this.checkSubmit()) {
            this.isCollapsed = !this.isCollapsed;
        }
    }

    checkCollapsed(): boolean {
        return !(this.richiestaForm.valid && !!this.coordinate);
    }

    onAddEnte(ente: any): void {
        if (!this.nuovaRichiesta.listaEnti) {
            this.nuovaRichiesta.listaEnti = [];
            this.onAddEnte(ente);
        } else {
            this.nuovaRichiesta.listaEnti.push(ente);
        }
    }

    onRemoveEnte(ente: any): void {
        if (this.nuovaRichiesta.listaEnti && this.nuovaRichiesta.listaEnti.length > 0) {
            this.nuovaRichiesta.listaEnti.splice(this.nuovaRichiesta.listaEnti.indexOf(ente.codice), 1);
        }
    }

    onAggiungiNuovoEnte(): void {
        this.aggiungiNuovoEnte.emit();
    }

    // todo: correggere NON FUNZIONA !!!!!!
    setSchedaContatto(scheda: SchedaContatto): void {
        const f = this.f;
        f.nominativo.patchValue(scheda.richiedente.nominativo);
        f.telefono.patchValue(scheda.richiedente.telefono);
        f.indirizzo.patchValue(scheda.localita.indirizzo);

        const lat = scheda.localita.coordinate.latitudine;
        const lng = scheda.localita.coordinate.longitudine;
        this.coordinate = new Coordinate(lat, lng);
        this.chiamataMarker = new ChiamataMarker(this.idChiamata, `${this.operatore.nome} ${this.operatore.cognome}`, `${this.operatore.sede.codice}`,
            new Localita(this.coordinate ? this.coordinate : null, scheda.localita.indirizzo), null
        );
        this.nuovaRichiesta.localita = new Localita(this.coordinate ? this.coordinate : null, scheda.localita.indirizzo, null);
        this.f.latitudine.patchValue(lat);
        this.f.longitudine.patchValue(lng);
        this._reducerFormRichiesta('cerca');
    }

    // BUTTONS
    onAnnullaChiamata(): void {
        if (!this.checkNessunCampoModificato()) {
            const modalConfermaAnnulla = this.modalService.open(ConfirmModalComponent, {
                backdropClass: 'light-blue-backdrop',
                centered: true
            });
            modalConfermaAnnulla.componentInstance.icona = { descrizione: !this.editMode ? 'trash' : 'edit', colore: 'danger' };
            modalConfermaAnnulla.componentInstance.titolo = !this.editMode ? 'Annulla Chiamata' : 'Annulla Modifica';
            modalConfermaAnnulla.componentInstance.messaggio = !this.editMode ? 'Sei sicuro di voler annullare la chiamata?' : 'Sei sicuro di voler annullare la modifiche?';
            modalConfermaAnnulla.componentInstance.messaggioAttenzione = 'Tutti i dati inseriti saranno eliminati.';
            modalConfermaAnnulla.componentInstance.bottoni = [
                { type: 'ko', descrizione: 'Annulla', colore: 'secondary' },
                { type: 'ok', descrizione: 'Conferma', colore: 'danger' },
            ];

            modalConfermaAnnulla.result.then(
                (val) => {
                    switch (val) {
                        case 'ok':
                            this.richiestaForm.reset();
                            if (!this.editMode) {
                                this.nuovaRichiesta.tipologie = [];
                                this._reducerFormRichiesta('annullata');
                            } else if (this.editMode) {
                                this.store.dispatch(new ChiudiRichiestaModifica);
                            }
                            break;
                        case 'ko':
                            console.log('Azione annullata');
                            break;
                    }
                    console.log('Modal chiusa con val ->', val);
                },
                (err) => console.error('Modal chiusa senza bottoni. Err ->', err)
            );
        } else {
            !this.editMode && this._reducerFormRichiesta('annullata');
            this.editMode && this.store.dispatch(new ChiudiRichiestaModifica);
        }
    }

    onFalsoAllarme(): void {
        if (!this.editMode) {
            this.impostaAzioneChiamata(AzioneChiamataEnum.FalsoAllarme);
        } else if (this.editMode) {
            return;
        }
    }

    onNonPiuNecessario(): void {
        if (!this.editMode) {
            this.impostaAzioneChiamata(AzioneChiamataEnum.InterventoNonPiuNecessario);
        } else if (this.editMode) {
            return;
        }
    }

    onDuplicato(): void {
        if (!this.editMode) {
            this.impostaAzioneChiamata(AzioneChiamataEnum.InterventoDuplicato);
        } else if (this.editMode) {
            return;
        }
    }

    onResetChiamata(): void {
        const modalConfermaReset = this.modalService.open(ConfirmModalComponent, {
            backdropClass: 'light-blue-backdrop',
            centered: true
        });
        modalConfermaReset.componentInstance.icona = { descrizione: 'exclamation-triangle', colore: 'danger' };
        modalConfermaReset.componentInstance.titolo = 'Reset Chiamata';
        modalConfermaReset.componentInstance.messaggio = 'Sei sicuro di voler effettuare il reset della chiamata?';
        modalConfermaReset.componentInstance.messaggioAttenzione = 'Tutti i dati inseriti verranno eliminati.';
        modalConfermaReset.componentInstance.bottoni = [
            { type: 'ko', descrizione: 'Annulla', colore: 'secondary' },
            { type: 'ok', descrizione: 'Conferma', colore: 'danger' },
        ];

        modalConfermaReset.result.then(
            (val) => {
                switch (val) {
                    case 'ok':
                        this.submitted = false;
                        this.richiestaForm.reset();
                        this.clearTipologieSelezionate();
                        this.coordinate = null;
                        this.store.dispatch(new ClearClipboard());
                        this._reducerFormRichiesta('reset');
                        this.store.dispatch(new DelChiamataMarker(this.idChiamata));
                        this.isCollapsed = true;
                        break;
                    case 'ko':
                        console.log('Azione annullata');
                        break;
                }
                console.log('Modal chiusa con val ->', val);
            },
            (err) => console.error('Modal chiusa senza bottoni. Err ->', err)
        );
    }

    onInviaPartenza(): void {
        if (!this.editMode) {
            this.impostaAzioneChiamata(AzioneChiamataEnum.InviaPartenza);
        } else if (this.editMode) {
            return;
        }
    }

    onMettiInCoda(): void {
        if (!this.editMode) {
            this.impostaAzioneChiamata(AzioneChiamataEnum.MettiInCoda);
        } else if (this.editMode) {
            this.onSubmit();
        }
    }

    // SUBMIT
    checkSubmit(): boolean {
        return (!this.formIsValid() && !!this.coordinate);
    }

    onSubmit(azione?: AzioneChiamataEnum): void {
        this.submitted = true;
        if (this.checkSubmit()) {
            this.setNuovaRichiesta();

            if (!this.editMode) {
                this._reducerFormRichiesta('inserita', azione);
            } else if (this.editMode) {
                // se i dati non sono cambiati non faccio la chiamata al backend
                if (this.checkCampiModificatiModifica()) {
                    this.store.dispatch(new PatchRichiesta(this.nuovaRichiesta));
                }
            }
        }
    }

    // CAMPI MODIFICATI
    checkCampiModificatiModifica(): boolean {
        const stringRichiesta = JSON.stringify(this.nuovaRichiesta);
        const stringRichiestaModifica = JSON.stringify(this.richiestaModificaIniziale);
        if (stringRichiesta === stringRichiestaModifica) {
            this.store.dispatch(new ToggleModifica(true));
            this.store.dispatch(new ClearRichiestaModifica);
            return false;
        } else {
            return true;
        }
    }

    // IMPOSTA AZIONE CHIAMATA
    impostaAzioneChiamata($event: AzioneChiamataEnum): void {
        if ($event === AzioneChiamataEnum.InviaPartenza || $event === AzioneChiamataEnum.MettiInCoda) {
            this.nuovaRichiesta.azione = $event;
        } else {
            this.nuovaRichiesta.azione = $event;
            this.nuovaRichiesta.stato = StatoRichiesta.Chiusa;
        }
        this.onSubmit($event);
    }

    // REDUCER NUOVA CHIAMATA
    _reducerFormRichiesta(tipo: string, azione?: AzioneChiamataEnum): void {
        const schedaTelefonata: SchedaTelefonataInterface = {
            tipo: tipo,
            nuovaRichiesta: this.nuovaRichiesta,
            markerChiamata: this.chiamataMarker
        };
        if (azione) {
            schedaTelefonata.azioneChiamata = azione;
        }
        this.store.dispatch(new ReducerFormRichiesta(schedaTelefonata));
    }

    // GET DATA
    getOperatore() {
        this.subscription.add(
            this.currentUser$.subscribe((utente: Utente) => {
                this.operatore = utente;
            })
        );
    }

    getTipologie() {
        this.subscription.add(
            this.tipologie$.subscribe((tipologie: Tipologia[]) => {
                this.tipologie = tipologie;
            })
        );
    }

    getEnti() {
        this.subscription.add(
            this.enti$.subscribe((enti: Ente[]) => {
                this.enti = enti;
            })
        );
    }

    getRichiestaModifica() {
        this.subscription.add(
            this.richiestaModifica$.subscribe((richiesta: SintesiRichiesta) => {
                if (richiesta) {
                    this.richiestaModifica = makeCopy(richiesta);
                    this.richiestaModificaIniziale = makeCopy(richiesta);
                    this.richiestaModifica.listaEnti = [];
                    this.richiestaModificaIniziale.listaEnti = [];
                    this.coordinate = makeCopy(richiesta.localita.coordinate);
                    if (this.richiestaModificaIniziale.listaEntiIntervenuti && this.richiestaModificaIniziale.listaEntiIntervenuti.length > 0) {
                        this.richiestaModificaIniziale.listaEntiIntervenuti.forEach(e => this.richiestaModificaIniziale.listaEnti.push(e));
                    }
                    if (this.richiestaModifica.listaEntiIntervenuti && this.richiestaModifica.listaEntiIntervenuti.length > 0) {
                        this.richiestaModifica.listaEntiIntervenuti.forEach(e => this.richiestaModifica.listaEnti.push(e));
                    }
                    this.patchForm();
                }
            })
        );
    }

    getSchedaContattoTelefonata() {
        this.subscription.add(
            this.schedaContattoTelefonata$.subscribe((schedaContattoTelefonata: SchedaContatto) => {
                if (schedaContattoTelefonata && schedaContattoTelefonata.codiceScheda) {
                    if (!this.idSchedaContatto) {
                        this.setSchedaContatto(schedaContattoTelefonata);
                        this.idSchedaContatto = schedaContattoTelefonata.codiceScheda;
                    }
                }
            })
        );
    }
}
