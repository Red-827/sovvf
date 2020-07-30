import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
    selector: 'app-utenti-per-pagina',
    templateUrl: './utenti-per-pagina.component.html',
    styleUrls: ['./utenti-per-pagina.component.css']
})
export class UtentiPerPaginaComponent implements OnInit {

    @Input() pageSize: number;
    @Input() pageSizes: number[];

    @Output() pageSizeChange: EventEmitter<number> = new EventEmitter<number>();

    constructor() {
    }

    ngOnInit(): void {
    }

    onChangePageSize(pageSize: number): void {
        this.pageSizeChange.emit(pageSize);
    }
}
