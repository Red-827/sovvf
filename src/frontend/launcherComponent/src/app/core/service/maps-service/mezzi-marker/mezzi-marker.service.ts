import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { AreaMappa } from '../../../../features/home/maps/maps-model/area-mappa-model';
import { FiltroMezzi } from '../../../../features/home/maps/maps-model/filtro-mezzi.interface';
import { AreaMappaFiltrata } from '../../../../shared/helper/query-helper';
import { MezzoMarker } from '../../../../features/home/maps/maps-model/mezzo-marker.model';

const BASE_URL = environment.baseUrl;
const API_MARKER = BASE_URL + environment.apiUrl.markers;

@Injectable()
export class MezziMarkerService {

    constructor(private http: HttpClient) {
    }

    public getMezziMarkers(areaMappa: AreaMappa, filtroMezzi?: FiltroMezzi): Observable<MezzoMarker[]> {
        return this.http.post<MezzoMarker[]>(`${API_MARKER}/GetMezzi`, AreaMappaFiltrata(areaMappa, { filtroMezzi }));
    }

}
