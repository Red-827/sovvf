import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PipeModule } from './pipes/pipe.module';
import { TreeviewI18n, TreeviewModule } from 'ngx-treeview';
import { DefaultTreeviewI18n } from './store/states/sedi-treeview/default-treeview-i18n';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { ListaPartenzeComponent } from './components/lista-partenze/lista-partenze.component';
import { EnteModalComponent } from './modal/ente-modal/ente-modal.component';
import { NumeriEnteComponent } from './components/numeri-ente/numeri-ente.component';
import { NgxsFormPluginModule } from '@ngxs/form-plugin';
import { FormRichiestaComponent } from './components/form-richiesta/form-richiesta.component';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';
import { UiSwitchModule } from 'ngx-ui-switch';
import { TagInputModule } from 'ngx-chips';
import * as Shared from './index';


const COMPONENTS = [
    Shared.DebounceClickDirective,
    Shared.DebounceKeyUpDirective,
    Shared.ClickStopPropagationDirective,
    Shared.ComponenteComponent,
    Shared.CompetenzaComponent,
    Shared.MezzoComponent,
    Shared.TreeviewComponent,
    Shared.ListaEntiComponent,
    Shared.ListaSquadrePartenzaComponent,
    Shared.ConfirmModalComponent,
    Shared.SelezioneTipiTerrenoComponent,
    Shared.PartenzaComponent,
    Shared.MezzoActionsComponent,
    Shared.SintesiRichiestaActionsComponent,
    Shared.ActionRichiestaModalComponent,
    Shared.CheckboxComponent,
    Shared.PartialLoaderComponent,
    Shared.BottoneNuovaVersioneComponent,
    Shared.EliminaPartenzaModalComponent,
    Shared.RichiestaDuplicataModalComponent,
    Shared.ModificaFonogrammaModalComponent,
    Shared.DettaglioFonogrammaModalComponent,
    Shared.MezzoActionsModalComponent,
    Shared.ModificaEntiModalComponent,

    ListaPartenzeComponent,
    ListaPartenzeComponent,
    EnteModalComponent,
    NumeriEnteComponent,
    FormRichiestaComponent
];

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        NgbModule,
        FormsModule,
        PipeModule,
        TreeviewModule.forRoot(),
        NgSelectModule,
        NgxsFormPluginModule.forRoot(),
        GooglePlaceModule,
        UiSwitchModule,
        TagInputModule,
        NgxsFormPluginModule
    ],
    declarations: [
        ...COMPONENTS,
    ],
    exports: [
        ...COMPONENTS,
        PipeModule
    ]
})
export class SharedModule {

    static forRoot() {
        return {
            ngModule: SharedModule,
            providers: [
                { provide: TreeviewI18n, useClass: DefaultTreeviewI18n },
            ],
        };
    }
}
