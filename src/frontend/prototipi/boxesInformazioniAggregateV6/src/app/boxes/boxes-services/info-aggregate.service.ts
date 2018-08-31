import {Injectable} from '@angular/core';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';

const API_URL = environment.apiUrl.infoAggregateFake;

@Injectable()
export class InfoAggregateService {

    constructor(private http: HttpClient) {
    }

    public getInfoAggregate(): Observable<any> {
        return this.http.get(API_URL).pipe(
            catchError(this.handleErrorObs)
        );
    }

    private handleErrorObs(error: any) {
        console.error('Si è verificato un errore', error);
        return throwError(error.message || error);
    }
}
