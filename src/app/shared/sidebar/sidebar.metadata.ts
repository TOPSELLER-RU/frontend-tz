// Sidebar route metadata
import {IconDefinition} from "@fortawesome/free-solid-svg-icons";

export interface RouteInfo {
    path: string;
    title: string;
    icon: IconDefinition;
    class: string;
    badge?: string;
    badgeClass?: string;
    isExternalLink: boolean;
    submenu : RouteInfo[];
}
