import { SquadraComposizione } from '../../../composizione-partenza/interface/squadra-composizione-interface';
import { MezzoComposizione } from '../../../composizione-partenza/interface/mezzo-composizione-interface';
import { MezzoPrenotatoInterface } from '../../../../../shared/interface/mezzo-prenotato.interface';

export class AddBoxPartenza {
    static readonly type = '[BoxPartenza] Add Box Partenza';
}

export class RemoveBoxPartenza {
    static readonly type = '[BoxPartenza] Remove Box Partenza';

    constructor(public idBoxPartenza: string) {
    }
}

export class AddSquadraBoxPartenza {
    static readonly type = '[BoxPartenza] Add Squadra Box Partenza';

    constructor(public squadra: SquadraComposizione) {
    }
}

export class RemoveSquadraBoxPartenza {
    static readonly type = '[BoxPartenza] Remove Squadra Box Partenza';

    constructor(public idSquadra: string) {
    }
}

export class ClearBoxPartenze {
    static readonly type = '[BoxPartenza] Clear Box Partenze';
}

export class AddMezzoBoxPartenza {
    static readonly type = '[BoxPartenza] Add Mezzo Box Partenza';

    constructor(public mezzo: MezzoComposizione) {
    }
}

export class RemoveMezzoBoxPartenza {
    static readonly type = '[BoxPartenza] Remove Mezzo Box Partenza';

    constructor(public idMezzo: string) {
    }
}

export class SelectBoxPartenza {
    static readonly type = '[BoxPartenza] Select Box Partenza';

    constructor(public idBoxPartenza: string) {
    }
}

export class SelectPreviousBoxPartenza {
    static readonly type = '[BoxPartenza] Select Previous Box Partenza';

    constructor(public idBoxPartenza: string) {
    }
}

export class UnselectBoxPartenza {
    static readonly type = '[BoxPartenza] Unselect Box Partenza';

    constructor(public idBoxPartenza: string) {
    }
}
