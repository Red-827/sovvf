import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PipeModule } from '../shared/pipes/pipe.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { environment } from '../../environments/environment';
import { SharedModule } from '../shared/shared.module';
/**
 * AGM CORE
 */
import { AgmCoreModule } from '@agm/core';
import { AgmJsMarkerClustererModule } from '@agm/js-marker-clusterer';
import { AgmSnazzyInfoWindowModule } from '@agm/snazzy-info-window';
/**
 * MAPS
 */
import { MapsComponent } from './maps.component';
import { AgmComponent } from './agm/agm.component';
import { AgmContentComponent } from './agm/agm-content.component';
/**
 * MAPS-UI
 */
import { MapsFiltroComponent } from './maps-ui/filtro/filtro.component';
import { InfoWindowComponent } from './maps-ui/info-window/info-window.component';
import { CambioSedeModalComponent } from './maps-ui/info-window/cambio-sede-modal/cambio-sede-modal.component';
/**
 * Provider
 */
import {
    CentroMappaManagerService, MezziMarkerManagerService, SediMarkerManagerService, RichiesteMarkerManagerService,
    CentroMappaManagerServiceFake, MezziMarkerManagerServiceFake, SediMarkerManagerServiceFake, RichiesteMarkerManagerServiceFake
} from '../core/manager/maps-manager';
import {
    DispatcherCentroMappaService, DispatcherMezziMarkerService, DispatcherSediMarkerService, DispatcherRichiesteMarkerService,
    DispatcherCentroMappaServiceFake, DispatcherMezziMarkerServiceFake,
    DispatcherSediMarkerServiceFake, DispatcherRichiesteMarkerServiceFake
} from '../core/dispatcher/dispatcher-maps/';
import {
    CentroMappaService, MezziMarkerService, SediMarkerService, RichiesteMarkerService,
    CentroMappaServiceFake, MezziMarkerServiceFake, SediMarkerServiceFake, RichiesteMarkerServiceFake
} from '../core/service/maps-service/';

@NgModule({
    imports: [
        CommonModule,
        NgbModule,
        PipeModule.forRoot(),
        AgmCoreModule.forRoot({
            apiKey: environment.apiUrl.maps.agm.key
        }),
        AgmJsMarkerClustererModule,
        AgmSnazzyInfoWindowModule,
        SharedModule.forRoot()
    ],
    declarations: [
        MapsComponent,
        AgmComponent,
        AgmContentComponent,
        MapsFiltroComponent,
        InfoWindowComponent,
        CambioSedeModalComponent
    ],
    entryComponents: [CambioSedeModalComponent],
    exports: [
        MapsComponent
    ],
    providers: [
        {provide: RichiesteMarkerManagerService, useClass: RichiesteMarkerManagerServiceFake},
        {provide: MezziMarkerManagerService, useClass: MezziMarkerManagerServiceFake},
        {provide: SediMarkerManagerService, useClass: SediMarkerManagerServiceFake},
        {provide: CentroMappaManagerService, useClass: CentroMappaManagerServiceFake},
        {provide: DispatcherRichiesteMarkerService, useClass: DispatcherRichiesteMarkerServiceFake},
        {provide: DispatcherMezziMarkerService, useClass: DispatcherMezziMarkerServiceFake},
        {provide: DispatcherSediMarkerService, useClass: DispatcherSediMarkerServiceFake},
        {provide: DispatcherCentroMappaService, useClass: DispatcherCentroMappaServiceFake},
        {provide: RichiesteMarkerService, useClass: RichiesteMarkerServiceFake},
        {provide: MezziMarkerService, useClass: MezziMarkerServiceFake},
        {provide: SediMarkerService, useClass: SediMarkerServiceFake},
        {provide: CentroMappaService, useClass: CentroMappaServiceFake},
    ]
})
export class MapsModule {
}