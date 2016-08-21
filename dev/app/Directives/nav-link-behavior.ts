import { Directive, ElementRef, HostListener, Input } from "@angular/core";


@Directive({
  selector: '[nav-link-custom]'
})
export class NavLinkDirective {
    private defaultHighlighColor = "DodgerBlue";
    private el: HTMLElement;

    constructor(el: ElementRef) { this.el = el.nativeElement; }

    @Input("nav-link-custom") highlightColor: string;

    @HostListener('mouseenter') onMouseEnter() {
        this.highlight(this.highlightColor || this.defaultHighlighColor);
    }

    @HostListener('mouseleave') onMouseLeave() {
        this.highlight(null);
    }

    private highlight(color: string) {
        this.el.style.backgroundColor = color;
    }
}    // class NavLinkDirective