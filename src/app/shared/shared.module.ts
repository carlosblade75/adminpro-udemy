import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HeaderComponent } from './header/header.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { BreadcrumbsComponent } from './breadcrumbs/breadcrumbs.component';
import { NopagefoundComponent } from './nopagefound/nopagefound.component';
import { RouterModule } from '@angular/router';
import { PipesModule } from '../pipes/pipes.module';

@NgModule({
    imports: [
        RouterModule,
        CommonModule,
        PipesModule
    ],
    declarations: [
       NopagefoundComponent,
       HeaderComponent,
       SidebarComponent,
       BreadcrumbsComponent
    ],
    exports: [
       NopagefoundComponent,
       HeaderComponent,
       SidebarComponent,
       BreadcrumbsComponent
    ]
})

export class SharedModule {}
