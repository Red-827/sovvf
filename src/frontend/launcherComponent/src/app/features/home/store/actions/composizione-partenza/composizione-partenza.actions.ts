import { Composizione } from '../../../../../shared/enum/composizione.enum';
import { SintesiRichiesta } from '../../../../../shared/model/sintesi-richiesta.model';
import { ListaTipologicheMezzi } from '../../../composizione-partenza/interface/filtri/lista-filtri-composizione-interface';
import {
    FiltriComposizione
} from '../../../composizione-partenza/interface/filtri/filtri-composizione-interface';
import { ConfermaPartenze } from '../../../composizione-partenza/interface/conferma-partenze-interface';
import { MezzoComposizione } from '../../../../../shared/interface/mezzo-composizione-interface';

export class GetFiltriComposizione {
    static readonly type = '[FiltriComposizione] Get Lista Filtri';
}

export class SetFiltriComposizione {
    static readonly type = '[FiltriComposizione] Set Lista Filtri';

    constructor(public filtri: ListaTipologicheMezzi) {
    }
}

export class SetListaFiltriAffini {
    static readonly type = '[FiltriComposizione] Set Lista Filtri Affini';

    constructor(public composizioneMezzi?: MezzoComposizione[]) {
    }
}

export class ClearFiltriAffini {
    static readonly type = '[FiltriComposizione] Clear Filtri Affini';
}

export class UpdateListeComposizione {
    static readonly type = '[FiltriComposizione] Update Liste Composizione';

    constructor(public filtri: FiltriComposizione) {
    }
}

export class AddFiltroSelezionatoComposizione {
    static readonly type = '[FiltriComposizione] Add Filtro Selezionato';

    constructor(public id: string, public tipo: string) {
    }
}

export class RemoveFiltroSelezionatoComposizione {
    static readonly type = '[FiltriComposizione] Remove Filtro Selezionato';

    constructor(public id: string, public tipo: string) {
    }
}

export class RemoveFiltriSelezionatiComposizione {
    static readonly type = '[FiltriComposizione] Remove Filtri Selezionati';

    constructor(public tipo: string) {
    }
}

export class ReducerFilterListeComposizione {
    static readonly type = '[FiltriComposizione] Reducer Filter Liste Composizione';

    constructor(public filtri: FiltriComposizione) {
    }
}

export class ToggleComposizioneMode {
    static readonly type = '[ComposizionePartenza] Toggle Composizione Mode';
}

export class SetComposizioneMode {
    static readonly type = '[ComposizionePartenza] Set Composizione Mode';

    constructor(public compMode: Composizione) {
    }
}

export class UpdateRichiestaComposizione {
    static readonly type = '[ComposizionePartenza] Update Richiesta Composizione';

    constructor(public richiesta: SintesiRichiesta) {
    }
}

export class ConfirmPartenze {
    static readonly type = '[ComposizionePartenza] Conferma Partenze';

    constructor(public partenze: ConfermaPartenze) {
    }
}

export class RichiestaComposizione {
    static readonly type = '[ComposizionePartenza] Nuova Composizione Partenza';

    constructor(public richiesta: SintesiRichiesta) {
    }
}

export class TerminaComposizione {
    static readonly type = '[ComposizionePartenza] Termina Composizione Partenza';
}

export class ClearPartenza {
    static readonly type = '[ComposizionePartenza] Clear Composizione Partenza';
}

export class StartListaComposizioneLoading {
    static readonly type = '[ComposizionePartenza] Start Lista Composizione Loading';
}

export class StopListaComposizioneLoading {
    static readonly type = '[ComposizionePartenza] Stop Lista Composizione Loading';
}

export class StartInvioPartenzaLoading {
    static readonly type = '[ComposizionePartenza] Start Invio Partenza Loading';
}

export class StopInvioPartenzaLoading {
    static readonly type = '[ComposizionePartenza] Stop Invio Partenza Loading';
}
