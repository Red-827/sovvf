import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import { NgZone } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Coordinate } from '../../../model/coordinate.model';
import { SintesiRichiesta } from '../../../model/sintesi-richiesta.model';
import { AzioneChiamataEnum } from '../../../enum/azione-chiamata.enum';
import { ChiamataService } from '../../../../core/service/chiamata-service/chiamata.service';
import { CopyToClipboard } from '../../../../features/home/store/actions/chiamata/clipboard.actions';
import { GetListaRichieste, SetIdChiamataInviaPartenza, SetNeedRefresh } from '../../../../features/home/store/actions/richieste/richieste.actions';
import { ShowToastr } from '../../actions/toastr/toastr.actions';
import { ToastrType } from '../../../enum/toastr';
import { RichiestaSelezionataState } from '../../../../features/home/store/states/richieste/richiesta-selezionata.state';
import { RichiestaGestioneState } from '../../../../features/home/store/states/richieste/richiesta-gestione.state';
import { AuthState } from '../../../../features/auth/store/auth.state';
import { PaginationState } from '../pagination/pagination.state';
import { UpdateFormValue } from '@ngxs/form-plugin';
import { ToggleChiamata } from '../../../../features/home/store/actions/view/view.actions';
import { GetInitCentroMappa, SetCoordCentroMappa, SetZoomCentroMappa } from '../../../../features/home/store/actions/maps/centro-mappa.actions';
import { DelChiamataMarker, SetChiamataMarker, UpdateChiamataMarker } from '../../../../features/home/store/actions/maps/chiamate-markers.actions';
import { GetMarkerDatiMeteo } from '../../../../features/home/store/actions/maps/marker-info-window.actions';
import { RichiestaDuplicataModalComponent } from '../../..';
import {
    ApriModaleRichiestaDuplicata,
    CestinaChiamata,
    ClearChiamata,
    ClearIndirizzo,
    ClearMarkerChiamata,
    InsertChiamata,
    InsertChiamataSuccess,
    MarkerChiamata,
    ReducerFormRichiesta,
    ResetFormRichiesta,
    StartLoadingFormRichiesta,
    StopLoadingFormRichiesta
} from '../../actions/form-richiesta/form-richiesta.actions';
import { ClipboardState } from '../../../../features/home/store/states/chiamata/clipboard.state';

export interface FormRichiestaStateModel {
    form: {
        model: {
            selectedTipologie: string[],
            nominativo: string,
            telefono: string,
            indirizzo: string,
            latitudine: string,
            longitudine: string,
            piano: string,
            etichette: string,
            noteIndirizzo: string,
            rilevanzaGrave: boolean,
            rilevanzaStArCu: boolean,
            notePrivate: string,
            notePubbliche: string,
            descrizione: string,
            zoneEmergenza: string,
            prioritaRichiesta: number
        },
        dirty: boolean,
        status: string,
        errors: any
    };
    coordinate: Coordinate;
    nuovaRichiesta: SintesiRichiesta;
    azioneChiamata: AzioneChiamataEnum;
    idChiamataMarker: string;
    loadingFormRichiesta: boolean;
}

export const FormRichiestaStateDefaults: FormRichiestaStateModel = {
    form: {
        model: undefined,
        dirty: false,
        status: '',
        errors: {}
    },
    coordinate: null,
    nuovaRichiesta: null,
    azioneChiamata: null,
    idChiamataMarker: null,
    loadingFormRichiesta: false
};

@State<FormRichiestaStateModel>({
    name: 'formRichiesta',
    defaults: FormRichiestaStateDefaults,
    children: [ClipboardState]
})

export class FormRichiestaState {

    constructor(private chiamataService: ChiamataService,
                private store: Store,
                private ngZone: NgZone,
                private modalService: NgbModal) {
    }

    @Selector()
    static myChiamataMarker(state: FormRichiestaStateModel) {
        return state.idChiamataMarker;
    }

    @Selector()
    static loadingFormRichiesta(state: FormRichiestaStateModel) {
        return state.loadingFormRichiesta;
    }

    @Action(ReducerFormRichiesta)
    reducerFormRichiesta({ getState, dispatch }: StateContext<FormRichiestaStateModel>, action: ReducerFormRichiesta) {
        switch (action.schedaTelefonata.tipo) {
            case 'copiaIndirizzo':
                dispatch(new CopyToClipboard(getState().coordinate));
                break;
            case 'annullata':
                dispatch(new CestinaChiamata());
                break;
            case 'reset':
                dispatch(new ResetFormRichiesta());
                break;
            case 'cerca':
                dispatch(new MarkerChiamata(action.schedaTelefonata.markerChiamata));
                break;
            case 'inserita':
                dispatch(new InsertChiamata(action.schedaTelefonata.nuovaRichiesta, action.schedaTelefonata.azioneChiamata));
                break;
            default:
                return;
        }
    }

    @Action(InsertChiamata)
    insertChiamata({ patchState, dispatch }: StateContext<FormRichiestaStateModel>, action: InsertChiamata) {

        patchState({
            azioneChiamata: action.azioneChiamata
        });
        dispatch(new StartLoadingFormRichiesta());

        action.nuovaRichiesta.richiedente.telefono = action.nuovaRichiesta.richiedente.telefono.toString();
        this.chiamataService.insertChiamata(action.nuovaRichiesta).subscribe((richiesta: SintesiRichiesta) => {
            if (richiesta && action.azioneChiamata === AzioneChiamataEnum.InviaPartenza) {
                dispatch([
                    new CestinaChiamata(),
                    new SetIdChiamataInviaPartenza(richiesta),
                    new ShowToastr(ToastrType.Success, 'Inserimento della chiamata effettuato', action.nuovaRichiesta.descrizione, 5, null, true)
                ]);
            } else {
                dispatch(new CestinaChiamata());
            }
        }, () => {
            dispatch(new StopLoadingFormRichiesta());
            patchState({
                nuovaRichiesta: null,
                azioneChiamata: null
            });
        });

    }

    @Action(InsertChiamataSuccess)
    insertChiamataSuccess({ dispatch }: StateContext<FormRichiestaStateModel>, action: InsertChiamataSuccess) {
        const idRichiestaSelezionata = this.store.selectSnapshot(RichiestaSelezionataState.idRichiestaSelezionata);
        const idRichiestaGestione = this.store.selectSnapshot(RichiestaGestioneState.idRichiestaGestione);
        const idUtenteLoggato = this.store.selectSnapshot(AuthState.currentUser).id;
        if (!idRichiestaSelezionata && !idRichiestaGestione) {
            const currentPage = this.store.selectSnapshot(PaginationState.page);
            dispatch(new GetListaRichieste({ page: currentPage }));
            dispatch(new SetNeedRefresh(false));
        } else {
            dispatch(new SetNeedRefresh(true));
        }
        dispatch(new StopLoadingFormRichiesta());
        if (idUtenteLoggato !== action.nuovaRichiesta.operatore.id) {
            dispatch(new ShowToastr(ToastrType.Success, 'Nuova chiamata inserita', action.nuovaRichiesta.descrizione, 5, null, true));
        }
    }

    @Action(ResetFormRichiesta)
    resetFormRichiesta({ patchState, dispatch }: StateContext<FormRichiestaStateModel>) {
        patchState(FormRichiestaStateDefaults);
        dispatch(
            new UpdateFormValue({
                path: 'formRichiesta.form',
                value: {
                    prioritaRichiesta: 3
                }
            })
        );
    }

    @Action(CestinaChiamata)
    cestinaChiamata({ dispatch }: StateContext<FormRichiestaStateModel>) {
        dispatch(new ClearMarkerChiamata());
        dispatch(new ResetFormRichiesta());
        dispatch(new ToggleChiamata());
        dispatch(new ClearChiamata());
        dispatch(new GetInitCentroMappa());
    }

    @Action(MarkerChiamata)
    markerChiamata({ getState, patchState, dispatch }: StateContext<FormRichiestaStateModel>, action: MarkerChiamata) {
        const state = getState();

        console.log('[MarkerChiamata] action', action.marker);
        console.log('[MarkerChiamata] idChiamataMarker', state.idChiamataMarker);
        if (state.idChiamataMarker) {
            dispatch(new UpdateChiamataMarker(action.marker));
        } else {
            dispatch(new SetChiamataMarker(action.marker));
        }

        const coordinate: Coordinate = {
            latitudine: action.marker.localita.coordinate.latitudine,
            longitudine: action.marker.localita.coordinate.longitudine
        };
        dispatch(new GetMarkerDatiMeteo('chiamata-' + action.marker.id, coordinate));
        dispatch(new SetCoordCentroMappa(coordinate));
        dispatch(new SetZoomCentroMappa(18));
        patchState({
            coordinate: coordinate,
            idChiamataMarker: action.marker.id
        });
    }

    @Action(ClearMarkerChiamata)
    clearMarkerChiamata({ getState, dispatch }: StateContext<FormRichiestaStateModel>) {
        const state = getState();
        if (state.idChiamataMarker) {
            dispatch(new DelChiamataMarker(state.idChiamataMarker));
        }
    }

    @Action(ClearChiamata)
    clearChiamata({ patchState }: StateContext<FormRichiestaStateModel>) {
        patchState(FormRichiestaStateDefaults);
    }

    /* @Action(StartChiamata)
    startChiamata({patchState}: StateContext<FormRichiestaStateModel>) {
        patchState({
            resetChiamata: false
        });
    } */

    @Action(ClearIndirizzo)
    ClearIndirizzo({ dispatch }: StateContext<FormRichiestaStateModel>) {
        dispatch(new UpdateFormValue({
            path: 'formRichiesta.form',
            value: {
                indirizzo: '',
                latitudine: '',
                longitudine: ''
            }
        }));
    }

    @Action(ApriModaleRichiestaDuplicata)
    apriModaleRichiestaDuplicata({ dispatch }: StateContext<FormRichiestaStateModel>, action: ApriModaleRichiestaDuplicata) {
        this.ngZone.run(() => {
            const richiestaDuplicataModal = this.modalService.open(RichiestaDuplicataModalComponent, {
                size: 'lg',
                centered: true,
                backdrop: 'static'
            });
            richiestaDuplicataModal.componentInstance.messaggio = action.messaggio;
        });
    }

    @Action(StartLoadingFormRichiesta)
    startLoadingFormRichiesta({ patchState }: StateContext<FormRichiestaStateModel>) {
        patchState({
            loadingFormRichiesta: true
        });
    }

    @Action(StopLoadingFormRichiesta)
    stopLoadingFormRichiesta({ patchState }: StateContext<FormRichiestaStateModel>) {
        patchState({
            loadingFormRichiesta: false
        });
    }

}
