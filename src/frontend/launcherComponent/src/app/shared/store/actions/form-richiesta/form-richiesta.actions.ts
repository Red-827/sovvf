import { SchedaTelefonataInterface } from '../../../interface/scheda-telefonata.interface';
import { ChiamataMarker } from '../../../../features/home/maps/maps-model/chiamata-marker.model';
import { SintesiRichiesta } from '../../../model/sintesi-richiesta.model';
import { AzioneChiamataEnum } from '../../../enum/azione-chiamata.enum';

export class ReducerFormRichiesta {
    static readonly type = '[FormRichiesta] Reducer Form Richiesta';

    constructor(public schedaTelefonata: SchedaTelefonataInterface) {
    }
}

export class MarkerChiamata {
    static readonly type = '[FormRichiesta] Set chiamata Marker';

    constructor(public marker: ChiamataMarker) {
    }
}

export class ClearMarkerChiamata {
    static readonly type = '[FormRichiesta] Clear chiamata Marker';
}

export class ClearChiamata {
    static readonly type = '[FormRichiesta] Clear chiamata';
}

export class InsertChiamata {
    static readonly type = '[FormRichiesta] Insert chiamata';

    constructor(public nuovaRichiesta: SintesiRichiesta, public azioneChiamata: AzioneChiamataEnum) {
    }
}

export class InsertChiamataSuccess {
    static readonly type = '[FormRichiesta] Insert chiamata success';

    constructor(public nuovaRichiesta: SintesiRichiesta) {
    }
}


export class CestinaChiamata {
    static readonly type = '[FormRichiesta] Cestina chiamata';

}

export class ResetFormRichiesta {
    static readonly type = '[FormRichiesta] Reset Form Richiesta';

}

export class StartChiamata {
    static readonly type = '[FormRichiesta] Start Chiamata';
}

export class ClearIndirizzo {
    static readonly type = '[FormRichiesta] Clear Indirizzo';
}

export class ApriModaleRichiestaDuplicata {
    static readonly type = '[FormRichiesta] Apri Modale Richiesta Duplicata';

    constructor(public messaggio: string) {
    }
}

export class StartLoadingFormRichiesta {
    static readonly type = '[FormRichiesta] Start Loading Form Richiesta';
}

export class StopLoadingFormRichiesta {
    static readonly type = '[FormRichiesta] Stop Loading Form Richiesta';
}
