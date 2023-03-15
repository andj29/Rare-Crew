import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { EmployeeModel } from './models/employee.model';
import { EmployeeService } from './services/employee.service';
import { ChartComponent } from "ng-apexcharts";

import {
  ApexNonAxisChartSeries,
  ApexResponsive,
  ApexChart
} from "ng-apexcharts";
import { GroupByPipe } from './pipes/group-by.pipe';

export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: any;
};

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [GroupByPipe]
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'Rare-Crew';
  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;

  public employees: EmployeeModel[] = [];
  public subscription: Subscription;

  constructor(public employeeService: EmployeeService,
    public groupByPipe: GroupByPipe) { }

  ngOnInit(): void {
    this.subscription = this.employeeService.getEmployees().subscribe(response => {
      this.employees = response;
      this.initializePieChart();
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  initializePieChart() {
    let series = [];
    let labels = [];
    const grouped = this.groupByPipe.transform(this.employees, 'EmployeeName');
    grouped.forEach(e => {
      series.push(e.value);
      labels.push(e.key);
    });

    this.chartOptions = {
      series: series,
      chart: {
        width: 500,
        type: "pie"
      },
      labels: labels,
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200
            },
            legend: {
              position: "bottom"
            }
          }
        }
      ]
    };
  }

}
