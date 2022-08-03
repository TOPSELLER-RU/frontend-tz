import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { RouterModule } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// import { OverlayModule } from '@angular/cdk/overlay';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { IConfig, NgxMaskModule } from "ngx-mask";
import { PerfectScrollbarModule } from "ngx-perfect-scrollbar";

// import { ClickOutsideModule } from 'ng-click-outside';
// import { AutocompleteModule } from './components/autocomplete/autocomplete.module';
// import { PipeModule } from 'app/shared/pipes/pipe.module';

//COMPONENTS
import { CustomizerComponent } from './customizer/customizer.component';
import { FooterComponent } from "./footer/footer.component";
import { NavbarComponent } from "./navbar/navbar.component";
import { NotificationSidebarComponent } from './notification-sidebar/notification-sidebar.component';
import { SidebarComponent } from "./sidebar/sidebar.component";

//DIRECTIVES
import { SidebarLinkDirective } from './directives/sidebar-link.directive';
import { SidebarDropdownDirective } from './directives/sidebar-dropdown.directive';
import { SidebarAnchorToggleDirective } from './directives/sidebar-anchor-toggle.directive';
import { SidebarDirective } from './directives/sidebar.directive';
import { ToggleFullscreenDirective } from "./directives/toggle-fullscreen.directive";
import {ToastrModule} from "ngx-toastr";
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";

// import { TopMenuDirective } from './directives/topmenu.directive';
// import { TopMenuLinkDirective } from './directives/topmenu-link.directive';
// import { TopMenuDropdownDirective } from './directives/topmenu-dropdown.directive';
// import { TopMenuAnchorToggleDirective } from './directives/topmenu-anchor-toggle.directive';

export const maskConfig: Partial<IConfig> | (() => Partial<IConfig>) = {};

const toastrSetttings = {
  autoDismiss: true,
  positionClass: 'toast-bottom-right',
}


@NgModule({
    exports: [
        CommonModule,
        CustomizerComponent,
        FooterComponent,
        HttpClientModule,
        NavbarComponent,
        NgbModule,
        NotificationSidebarComponent,
        SidebarComponent,
        SidebarDirective,
        ToastrModule,
        ToggleFullscreenDirective,
        // TopMenuDirective,
        // TranslateModule,
    ],
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    NgbModule,
    NgxMaskModule.forRoot(),
    // OverlayModule,
    PerfectScrollbarModule,
    ReactiveFormsModule,
    RouterModule,
    ToastrModule.forRoot(toastrSetttings),
    FontAwesomeModule,
    // ClickOutsideModule,
    // AutocompleteModule,
    // PipeModule
  ],
  declarations: [
    CustomizerComponent,
    FooterComponent,
    NavbarComponent,
    NotificationSidebarComponent,
    SidebarComponent,
    SidebarLinkDirective,
    SidebarDropdownDirective,
    SidebarAnchorToggleDirective,
    SidebarDirective,
    ToggleFullscreenDirective,
    // TopMenuLinkDirective,
    // TopMenuDropdownDirective,
    // TopMenuAnchorToggleDirective,
    // TopMenuDirective,

  ]
})
export class SharedModule { }
