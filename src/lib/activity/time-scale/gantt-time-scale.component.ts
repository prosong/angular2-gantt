import { Component, OnInit, Input, EventEmitter, ViewChild } from '@angular/core';
import { GanttService } from '../../shared/services/gantt.service';

@Component({
    selector: 'time-scale',
    template: `
    <div class="time_scale" [ngStyle]="setTimescaleStyle()">
  <div class="time_scale_line" [ngStyle]="setTimescaleLineStyle('none')">
    <div class="time_scale_cell" *ngFor="let date of scaleLine" [ngStyle]="setTimescaleCellStyle()" [ngClass]="(isDayWeekend(date)) ? 'weekend' : ''">{{date | date: 'dd-MM-yyyy'}}</div>
  </div>
  <div *ngIf="zoomLevel === 'hours'" class="time_scale_line" [ngStyle]="setTimescaleLineStyle('1px solid #cecece')">
    <div class="time_scale_cell" *ngFor="let hour of getHours()" [ngStyle]="{ 'width': '20px' }">{{hour}}</div>
  </div>
</div>
    `,
    styleUrls: [`.weekend {
    background-color:#FAFAFA;
}

.time_scale {
    font-size: 12px;
    border-bottom: 1px solid #cecece;
    background-color: #fff;
}

.time_scale_line {
    box-sizing: border-box;
}

.time_scale_line:first-child {
    border-top: none;
}

.time_scale_cell {
    display: inline-block;
    white-space: nowrap;
    overflow: hidden;
    border-right: 1px solid #cecece;
    text-align: center;
    height: 100%;
    }`],
    providers: [
        GanttService
    ]
})
export class GanttTimeScaleComponent implements OnInit {
    @Input() scale: any;
    @Input() dimensions: any;
    @Input() zoom: any;

    private scaleLine: Date[];
    private zoomLevel: string;

    constructor(private ganttService: GanttService) {}

    ngOnInit() {
        this.drawScale(this.scale.start, this.scale.end);

        this.zoom.subscribe((zoomLevel: string) => {
            this.zoomLevel = zoomLevel;                        
        });;
    }

    private setTimescaleStyle() {
        return {
            'width': this.dimensions.width + 'px'
        };
    }

    private setTimescaleLineStyle(borderTop: string) {
        return {
            'height': this.ganttService.rowHeight + 'px',
            'line-height': this.ganttService.rowHeight + 'px',
            'position': 'relative',
            'border-top': borderTop
        };
    }

    //TODO(dale): this should be read from gantt config
    private setTimescaleCellStyle() {
        var width = this.ganttService.cellWidth;

        if(this.zoomLevel === 'hours') {
            width = 20 * 24 + 15;
        }

        return {
            'width': width + 'px'
        };
    }

    private drawScale(start: Date, end: Date): void {
        this.scaleLine = this.ganttService.calculateScale(start, end);
    }

    private isDayWeekend(date: Date): boolean {
        return this.ganttService.isDayWeekend(date);
    }

    private getHours(): string[] {
        return this.ganttService.getHours(this.scaleLine.length);
    }
}