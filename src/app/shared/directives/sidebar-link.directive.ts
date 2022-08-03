import {
  Directive, HostBinding, Inject, Input, OnInit, OnDestroy, Output, EventEmitter, AfterViewInit
} from '@angular/core';
import { SidebarDirective } from "./sidebar.directive";

@Directive({
  selector: "[appSidebarLink]"
})
export class SidebarLinkDirective implements OnInit, OnDestroy {

  @Input()
  public parent?: string;

  @Input()
  public level = "0";

  @Input()
  public hasSub = false;

  @Input()
  public path?: string;

  @HostBinding('class.open')
  @Input()
  get open(): boolean {
    return this._open;
  }
  set open(value: boolean) {
    this._open = value;
  }

  @HostBinding('class.sidebar-group-active')
  @Input()
  get sidebarGroupActive(): boolean {
    return this._sidebarGroupActive;
  }
  set sidebarGroupActive(value: boolean) {
    this._sidebarGroupActive = value;
  }

  @HostBinding('class.nav-collapsed-open')
  @Input()
  get navCollapsedOpen(): boolean {
    return this._navCollapsedOpen;
  }
  set navCollapsedOpen(value: boolean) {
    this._navCollapsedOpen = value;
  }

  protected _open = false;
  protected _sidebarGroupActive = false;
  protected _navCollapsedOpen = false;

  protected sideNav: SidebarDirective;

  public constructor(
    @Inject(SidebarDirective) sideNav: SidebarDirective) {
    this.sideNav = sideNav;
  }

  public ngOnInit(): any {
    this.sideNav.addLink(this);
  }

  public ngOnDestroy(): any {
  }

  //when side menu (vertical menu) item gets clicked
  public toggle(): any {
    this.open = !this.open;
    if(this.open) {
      this.sideNav.closeOtherLinks(this);
    }
    if (!this.open && this.level!.toString() === "1" && this.hasSub) {
      this.sidebarGroupActive = false;
    }
  }
}
