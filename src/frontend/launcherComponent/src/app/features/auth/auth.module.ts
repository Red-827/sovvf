import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { CasLoggedComponent } from './cas-logged.component';
import { CasLogoutComponent } from './cas-logout.component';

const routes: Routes = [
    {
        path: '',
        component: CasLoggedComponent
    },
    {
        path: 'caslogout',
        component: CasLogoutComponent
    }
];

@NgModule({
    declarations: [ CasLoggedComponent, CasLogoutComponent ],
    imports: [
        CommonModule,
        SharedModule,
        RouterModule.forChild(routes)
    ]
})
export class AuthModule {
}
