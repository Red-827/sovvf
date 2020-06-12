import { Utente } from '../../../../../shared/model/utente.model';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import {
    ClearUtente, ClearUtenteLocalStorage,
    SetUtente,
    SetUtenteLocalStorage,
    UpdateUtente
} from '../../actions/operatore/utente.actions';
import {
    ClearIdUtente,
    LogoffUtenteSignalR
} from '../../../../../core/signalr/store/signalR.actions';
import { ClearVistaSedi, SetVistaSedi } from '../../../../../shared/store/actions/app/app.actions';
import { makeCopy } from '../../../../../shared/helper/function';
import { ClearRuoliUtenteLoggato } from '../../../../../shared/store/actions/ruoli/ruoli.actions';
import { Navigate } from '@ngxs/router-plugin';
import { ClearUserDataService } from '../../../../../core/auth/clear-user-data.service';
import { ClearViewState } from '../../../../home/store/actions/view/view.actions';
import { ClearRichieste } from '../../../../home/store/actions/richieste/richieste.actions';
import { LSNAME } from '../../../../../core/settings/config';

export interface UtenteStateModel {
    utente: Utente;
}

export const UtenteStateDefaults: UtenteStateModel = {
    utente: null,
};

@State<UtenteStateModel>({
    name: 'utente',
    defaults: UtenteStateDefaults
})
export class UtenteState {

    @Selector()
    static utente(state: UtenteStateModel) {
        return state.utente;
    }

    constructor(private clearUserDataService: ClearUserDataService) {
    }

    @Action(SetUtente)
    setUtente({ patchState, dispatch }: StateContext<UtenteStateModel>, action: SetUtente) {
        patchState({
            utente: action.utente,
        });
        dispatch([
            new SetVistaSedi([action.utente.sede.codice]),
            new SetUtenteLocalStorage(action.utente)
        ]);
    }

    @Action(SetUtenteLocalStorage)
    setUtenteLocalStorage({ getState }: StateContext<UtenteStateModel>, action: SetUtenteLocalStorage) {
        sessionStorage.setItem(LSNAME.currentUser, JSON.stringify(action.utente));
    }

    @Action(ClearUtenteLocalStorage)
    clearUtenteLocalStorage() {
        sessionStorage.removeItem(LSNAME.currentUser);
    }

    @Action(UpdateUtente)
    updateUtente({ patchState, dispatch }: StateContext<UtenteStateModel>, action: UpdateUtente) {
        const token = JSON.parse(sessionStorage.getItem(LSNAME.currentUser)).token;
        const utenteToSet = makeCopy(action.utente);
        utenteToSet.token = token;
        patchState({
            utente: utenteToSet
        });
        if (action.options.localStorage) {
            dispatch(new SetUtenteLocalStorage(utenteToSet));
        }
    }

    @Action(ClearUtente)
    clearUtente({ getState, patchState, dispatch }: StateContext<UtenteStateModel>, action: ClearUtente) {
        let state = getState();
        if (action.skipDeleteAll) {
            if (state.utente) {
                // Clear SignalR Data
                dispatch([
                    new LogoffUtenteSignalR(state.utente),
                    new ClearVistaSedi(),
                    new ClearIdUtente()
                ]);
            }
            dispatch([
                // Local Storage
                new ClearUtenteLocalStorage(),
                // Current Roles Session Storage
                new ClearRuoliUtenteLoggato(),
                new ClearViewState(),
                new ClearRichieste(),
                new Navigate(['/login'])
            ]);
            // Clear User Data
            patchState({
                utente: null
            });
            state = getState();
        } else {
            this.clearUserDataService.clearUserData().subscribe((res: any) => {
                if (state.utente) {
                    // Clear SignalR Data
                    dispatch([
                        new LogoffUtenteSignalR(state.utente),
                        new ClearVistaSedi(),
                        new ClearIdUtente()
                    ]);
                }
                dispatch([
                    // Local Storage
                    new ClearUtenteLocalStorage(),
                    // Current Roles Session Storage
                    new ClearRuoliUtenteLoggato(),
                    new ClearViewState(),
                    new ClearRichieste(),
                    new Navigate(['/login'])
                ]);
                // Clear User Data
                patchState({
                    utente: null
                });
                state = getState();
            });
        }
    }

}
