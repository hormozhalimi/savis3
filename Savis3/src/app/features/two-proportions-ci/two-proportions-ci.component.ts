/*
import { Component, OnInit } from '@angular/core';
import { ChartDataSets, ChartOptions, ChartType, ChartXAxe } from 'chart.js';
import { Label } from 'ng2-charts';

@Component({
  selector: 'app-two-proportions-ci',
  templateUrl: './two-proportions-ci.component.html',
  styleUrls: ['./two-proportions-ci.component.scss', './../scss/base.scss']
})
export class TwoProportionsCIComponent implements OnInit {

  numASuccess: number = 0;
  numAFailure: number = 0;
  numBSuccess: number = 0;
  numBFailure: number = 0;
  numSimulations: number = 1;
  confidenceLevel: number = 95;
  sampleProportionA: number | null = null;
  sampleProportionB: number | null = null;
  sampleProportionDiff: number | null = null;
  sampleAFailure: number | null = null;
  sampleASuccess: number | null = null;
  sampleBFailure: number | null = null;
  sampleBSuccess: number | null = null;
  isDataLoaded: boolean = false;
  proportionDiff: number | null = null;
  meanSampleDiffs: number | null = null;
  stddevSampleDiffs: number | null = null;
  lowerBound: number | null = null;
  upperBound: number | null = null;
  totalSamples: number | null = null;
  minHeads: number = 0;
  maxHeads: number = 0;
  colors = {
    sample: 'rgba(255, 0, 0, 0.7)',
    binomial: 'rgba(0, 0, 255, 0.6',
    selected: 'rgba(0, 255, 0, 0.6)',
    line: 'rgba(0, 255, 0, 0.6)',
    box: 'rgba(0, 255, 0, 0.1)',
    green: 'rgba(0,255,0,0.3)',
    red: 'rgba(255,0,0,0.3)',
    invisible: 'rgba(0, 255, 0, 0.0)'
  }
  chartData: ChartDataSets[] = [];
  chartLabels: Label[] = ["Group A", "Group B"];
  chartOptions: ChartOptions = {
    responsive: true,
    scales: {
      xAxes:[
        {
          scaleLabel:{
            display: true,
          }
        } as ChartXAxe
      ],
      yAxes: [
        {
          ticks:{
            max: 100,
            beginAtZero: true,
            stepSize: 20,
          },
          scaleLabel: {
            display: true,
          }
        }
    ]
    },
    maintainAspectRatio: false,
    tooltips: {
      mode: 'index',
      backgroundColor: 'rgba(0, 0, 0, 1.0)',
      callbacks: {
        title: function(tooltipItem, data) {
          if (tooltipItem[0]) {
            let title = tooltipItem[0].xLabel || '';
            title += ` heads`;
            return title.toString();
          }
          return '';
        },
        label: (tooltipItem, data) => {
          if (tooltipItem && tooltipItem.datasetIndex !== undefined) {
            if (tooltipItem.datasetIndex !== 2) {
              return `${data.datasets?.[tooltipItem.datasetIndex]?.label} : ${tooltipItem.yLabel} %`;
            } else {
              return `${data.datasets?.[tooltipItem.datasetIndex]?.label} : ${
                this.maxHeads - this.minHeads + 1
              } %`
            }
          }
          return '';
        }
      }
    }
  };
  customChartData: ChartDataSets[] = [];
  customChartLabels: Label[] = ["1"];
  customChartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      xAxes: [{
        scaleLabel: {
          display: true,
          fontColor: 'black',
          fontSize: 14
        }
      }],
      yAxes: [{
        scaleLabel: {
          display: true,
          fontColor: 'black',
          fontSize: 14
        }
      }]
    }
  };

  constructor() { }

  ngOnInit(): void {
    this.numASuccess = 10;
    this.numAFailure = 5;
    this.numBSuccess = 8;
    this.numBFailure = 4;
    this.updateChartData();
  }

  loadData(): void {
    this.updateChartData();
    this.sampleProportionA = this.numASuccess / (this.numASuccess + this.numAFailure);
    this.sampleProportionB = this.numBSuccess / (this.numBSuccess + this.numBFailure);
    this.sampleProportionDiff = (this.sampleProportionA ?? 0) - (this.sampleProportionB ?? 0);
    this.sampleAFailure = Math.floor(Math.random() * 10);
    this.sampleASuccess = Math.floor(Math.random() * 10);
    this.sampleBFailure = Math.floor(Math.random() * 10);
    this.sampleBSuccess = Math.floor(Math.random() * 10);
    this.isDataLoaded = true;
  }

  runSimulations(): void {
    this.sampleAFailure = Math.floor(Math.random() * 10);
    this.sampleASuccess = Math.floor(Math.random() * 10);
    this.sampleBFailure = Math.floor(Math.random() * 10);
    this.sampleBSuccess = Math.floor(Math.random() * 10);
    this.sampleProportionA = this.numASuccess / (this.numASuccess + this.numAFailure);
    this.sampleProportionB = this.numBSuccess / (this.numBSuccess + this.numBFailure);
    this.sampleProportionDiff = (this.sampleProportionA ?? 0) - (this.sampleProportionB ?? 0);
  }

  buildConfidenceInterval(): void {
    this.proportionDiff = (this.sampleProportionA ?? 0) - (this.sampleProportionB ?? 0);
    const sampleDifferences: number[] = [];
    for (let i = 0; i < this.numSimulations; i++) {
      const sampleProportionASim = Math.random();
      const sampleProportionBSim = Math.random();
      const sampleProportionDiffSim = sampleProportionASim - sampleProportionBSim;
      sampleDifferences.push(sampleProportionDiffSim);
    }
    const sumSampleDifferences = sampleDifferences.reduce((acc, curr) => acc + curr, 0);
    this.meanSampleDiffs = sumSampleDifferences / this.numSimulations;
    const squaredDifferences = sampleDifferences.map(diff => Math.pow(diff - (this.meanSampleDiffs ?? 0), 2));
    const sumSquaredDifferences = squaredDifferences.reduce((acc, curr) => acc + curr, 0);
    this.stddevSampleDiffs = Math.sqrt(sumSquaredDifferences / this.numSimulations);
    const zScore = this.calculateZScore();
    this.lowerBound = (this.meanSampleDiffs ?? 0) - zScore * (this.stddevSampleDiffs ?? 0);
    this.upperBound = (this.meanSampleDiffs ?? 0) + zScore * (this.stddevSampleDiffs ?? 0);
    this.totalSamples = this.numSimulations;
  }

  applyChanges(): void {
    const incrementValue = parseInt((document.getElementById('increment') as HTMLInputElement).value, 10);
    this.numAFailure += incrementValue;
    this.numASuccess += incrementValue;
    this.numBFailure += incrementValue;
    this.numBSuccess += incrementValue;
    this.updateChartData();
  }

  calculateZScore(): number {
    return 1.96;
  }

  populateCustomChart(): void {
    const valuesInIntervalData = [1, 2];
    this.customChartData = [
      { 
        data: valuesInIntervalData,
        label: 'Values In Interval',
        backgroundColor: 'rgba(0, 255, 0, 0.3)',
        borderColor: 'rgba(0, 255, 0, 0.7)',
        borderWidth: 1
      }
    ];
    const valuesNotInIntervalData = [0, 0];
    this.customChartData.push(
      {
        data: valuesNotInIntervalData,
        label: 'Values Not in Interval',
        backgroundColor: 'rgba(255, 0, 0, 0.3)',
        borderColor: 'rgba(255, 0, 0, 0.7)',
        borderWidth: 1
      }
    );
    this.customChartLabels = ['-1.0', '-0.8', '-0.6', '-0.4', '-0.2', '0', '0.2', '0.4', '0.6', '0.8', '1.0'];
  }

  updateChartData(): void {
    const totalA = this.numASuccess + this.numAFailure;
    const totalB = this.numBSuccess + this.numBFailure;
    const percentASuccess = (this.numASuccess / totalA) * 100;
    const percentAFailure = (this.numAFailure / totalA) * 100;
    const percentBSuccess = (this.numBSuccess / totalB) * 100;
    const percentBFailure = (this.numBFailure / totalB) * 100;
    this.chartData = [
      { data: [percentASuccess, percentBSuccess], label: '% Success', backgroundColor: 'rgba(0, 250, 0, 0.7)' },
      { data: [percentAFailure, percentBFailure], label: '% Failure', backgroundColor: 'rgba(255, 0, 0, 0.7)' }
    ];
    this.chartData[0].backgroundColor = ['rgba(0, 250, 0, 0.7)', 'rgba(0, 250, 0, 0.7)'];
    this.chartData[1].backgroundColor = ['rgba(255, 0, 0, 0.7)', 'rgba(255, 0, 0, 0.7)'];
    this.populateCustomChart();
  }
}

*/



import { Component, OnInit } from '@angular/core';
import { ChartDataSets, ChartOptions, ChartType, ChartXAxe } from 'chart.js';
import { Label } from 'ng2-charts';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-two-proportions-ci',
  templateUrl: './two-proportions-ci.component.html',
  styleUrls: ['./two-proportions-ci.component.scss', './../scss/base.scss']
})
export class TwoProportionsCIComponent implements OnInit {

  successA: number = 0;
  failureA: number = 0;
  successB: number = 0;
  failureB: number = 0;


  //sampleBSuccess: number =0;
  //sampleASuccess: number =0;
  //sampleAFailure: number =0;
  //sampleBFailure: number =0;

  numASuccess: number = 0;
  numAFailure: number = 0;
  numBSuccess: number = 0;
  numBFailure: number = 0;
  numSimulations: number = 1;
  confidenceLevel: number = 95;
  sampleProportionA: number | null = null;
  sampleProportionB: number | null = null;
  sampleProportionDiff: number | null = null;
  sampleAFailure: number | null = null;
  sampleASuccess: number | null = null;
  sampleBFailure: number | null = null;
  sampleBSuccess: number | null = null;
  isDataLoaded: boolean = false;
  proportionDiff: number | null = null;
  meanSampleDiffs: number | null = null;
  stddevSampleDiffs: number | null = null;
  lowerBound: number | null = null;
  upperBound: number | null = null;
  totalSamples: number | null = null;
  minHeads: number = 0;
  maxHeads: number = 0;



  public barChartType1: ChartType = 'bar';
  public barChartType2: ChartType = 'scatter';



 public barChartData1: ChartDataSets[] = [
  {
    label: 'Group A',
    backgroundColor: ['green', 'red'], // Colors for success and failure bars for Group A
    hoverBackgroundColor: ['green', 'red'],
    data: [this.successA, this.failureA], // Data points for success and failure for Group A
  },
  {
    label: 'Group B',
    backgroundColor: ['green', 'red'], // Colors for success and failure bars for Group B
    hoverBackgroundColor: ['green', 'red'],
    data: [this.successB, this.failureB], // Data points for success and failure for Group B
  },
];

public barChartLabels1: string[] = ['Group A', 'Group B']; // Labels for the data points



public barChartData2: ChartDataSets[] = [
  {
    label: 'Group A',
    backgroundColor: ['green', 'red'], // Colors for success and failure bars for Group A
    hoverBackgroundColor: ['green', 'red'],
    data: [this.sampleASuccess, this.sampleAFailure], // Data points for success and failure for Group A
  },
  {
    label: 'Group B',
    backgroundColor: ['green', 'red'], // Colors for success and failure bars for Group B
    hoverBackgroundColor: ['green', 'red'],
    data: [this.sampleBSuccess, this.sampleBFailure], // Data points for success and failure for Group B
  },
];

public barChartLabels2: string[] = ['Group A', 'Group B']; // Labels for the data points




  public barChartData3: ChartDataSets[] =[
    {
      label: 'Values in Interval',
      backgroundColor: 'green',
      //hoverBackgroundColor: 'green',
      data: [],
      borderColor: 'green'
    },
    {
      label: 'Values not in Interval',
      backgroundColor: 'red',
      //hoverBackgroundColor: 'red',
      data: [],
      borderColor: 'red'
    },
  ];
  public barChartLabels3: any = [];
  
  public barChartOptions1: any={
    responsive: true,
    tooltips: {
      callbacks: {
        label: (tooltipItem: any, data: any) => {
          const datasetLabel = data.datasets[tooltipItem.datasetIndex].label || '';
          const value = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
          return `${datasetLabel}: ${value}%`; // Add your custom text
        }
      }
    },
    scales:{
      xAxes:[
        {
          stacked: true,
          ticks:{
            beginsAtZero: true,
          },
          scaleLabel:{
            display: true,
            labelString: 'Data'
          }
        }
      ],
      yAxes:[
        {
          id: 'groupAAxis',
          stacked: true,
          ticks:{
            min:0,
            max:100,
            stepSize:20,
            beginsAtZero: true,
          },
          scaleLabel:{
            display: true,
          }
        },
      ],
    },
    maintainAspectRatio: false,
  };

  public barChartOptions2: any={
    responsive: true,
    tooltips: {
      callbacks: {
        label: (tooltipItem: any, data: any) => {
          const datasetLabel = data.datasets[tooltipItem.datasetIndex].label || '';
          const value = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
          return `${datasetLabel}: ${value}%`; // Add your custom text
        }
      }
    },
    scales:{
      xAxes:[
        {
          stacked: true,
          ticks:{
            beginAtZero: true,
          },
          scaleLabel:{
            display: true,
            labelString: 'Data'
          }
        }
      ],
      yAxes:[
        {
          id: 'groupAAxis',
          stacked: true,
          ticks:{
            beginAtZero: true,
            min:0,
            max:100,
            stepSize:20
          },
          scaleLabel:{
            display: true,
          }
        },
      ],
    },
    maintainAspectRatio: false,
  };

  public barChartOptions3: any={
    responsive: true,
    scales:{
      xAxes:[
        {
          ticks:{
            max:1,
            min:-1,
            stepSize: 0.2, 
            beginsAtZero: true,
          },
          scaleLabel: {
            display:true,
          }
        },
      ],
      yAxes:[
        {
          ticks:{
            min:1,
            stepSize:1,
            beginsAtZero: true,
          },
          scaleLabel:{
            display:true,
          }
        }
      ]
    },
    maintainAspectRatio: false,
  };

  
  constructor(private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.numASuccess = 10;
    this.numAFailure = 5;
    this.numBSuccess = 8;
    this.numBFailure = 4;
    this.updateChartData();
  }

  loadData(): void {
    this.updateChartData();
    this.sampleProportionA = this.numASuccess / (this.numASuccess + this.numAFailure);
    this.sampleProportionB = this.numBSuccess / (this.numBSuccess + this.numBFailure);
    this.sampleProportionDiff = (this.sampleProportionA ?? 0) - (this.sampleProportionB ?? 0);
    this.sampleAFailure = Math.floor(Math.random() * 10);
    this.sampleASuccess = Math.floor(Math.random() * 10);
    this.sampleBFailure = Math.floor(Math.random() * 10);
    this.sampleBSuccess = Math.floor(Math.random() * 10);
    this.isDataLoaded = true;
  }





  runSimulations(): void {
    this.sampleAFailure = Math.floor(Math.random() * 10);
    this.sampleASuccess = Math.floor(Math.random() * 10);
    this.sampleBFailure = Math.floor(Math.random() * 10);
    this.sampleBSuccess = Math.floor(Math.random() * 10);
    this.sampleProportionA = this.numASuccess / (this.numASuccess + this.numAFailure);
    this.sampleProportionB = this.numBSuccess / (this.numBSuccess + this.numBFailure);
    this.sampleProportionDiff = (this.sampleProportionA ?? 0) - (this.sampleProportionB ?? 0);

    this.barChartData2[0].data = [this.sampleASuccess, this.sampleBSuccess];
    this.barChartData2[1].data = [this.sampleAFailure, this.sampleBFailure];

    this.barChartData2[0].backgroundColor = ['rgba(0, 250, 0, 0.7)', 'rgba(0, 250, 0, 0.7)'];
    this.barChartData2[1].backgroundColor = ['rgba(255, 0, 0, 0.7)', 'rgba(255, 0, 0, 0.7)'];

    this.buildConfidenceInterval();
  }


  /*
  buildConfidenceInterval(): void {
    this.proportionDiff = (this.sampleProportionA ?? 0) - (this.sampleProportionB ?? 0);
    const sampleDifferences: number[] = [];
    for (let i = 0; i < this.numSimulations; i++) {
      const sampleProportionASim = Math.random();
      const sampleProportionBSim = Math.random();
      const sampleProportionDiffSim = sampleProportionASim - sampleProportionBSim;
      sampleDifferences.push(sampleProportionDiffSim);
    }
    const sumSampleDifferences = sampleDifferences.reduce((acc, curr) => acc + curr, 0);
    this.meanSampleDiffs = sumSampleDifferences / this.numSimulations;
    const squaredDifferences = sampleDifferences.map(diff => Math.pow(diff - (this.meanSampleDiffs ?? 0), 2));
    const sumSquaredDifferences = squaredDifferences.reduce((acc, curr) => acc + curr, 0);
    this.stddevSampleDiffs = Math.sqrt(sumSquaredDifferences / this.numSimulations);
    const zScore = this.calculateZScore();
    this.lowerBound = (this.meanSampleDiffs ?? 0) - zScore * (this.stddevSampleDiffs ?? 0);
    this.upperBound = (this.meanSampleDiffs ?? 0) + zScore * (this.stddevSampleDiffs ?? 0);
    this.totalSamples = this.numSimulations;
  }
  */




  buildConfidenceInterval(): void {
    this.proportionDiff = (this.sampleProportionA ?? 0) - (this.sampleProportionB ?? 0);
    const sampleDifferences: number[] = [];
    for (let i = 0; i < this.numSimulations; i++) {
      const sampleProportionASim = Math.random();
      const sampleProportionBSim = Math.random();
      const sampleProportionDiffSim = sampleProportionASim - sampleProportionBSim;
      sampleDifferences.push(sampleProportionDiffSim);
    }
    const sumSampleDifferences = sampleDifferences.reduce((acc, curr) => acc + curr, 0);
    this.meanSampleDiffs = sumSampleDifferences / this.numSimulations;
    const squaredDifferences = sampleDifferences.map(diff => Math.pow(diff - (this.meanSampleDiffs ?? 0), 2));
    const sumSquaredDifferences = squaredDifferences.reduce((acc, curr) => acc + curr, 0);
    this.stddevSampleDiffs = Math.sqrt(sumSquaredDifferences / this.numSimulations);
    const zScore = this.calculateZScore();
    this.lowerBound = (this.meanSampleDiffs ?? 0) - zScore * (this.stddevSampleDiffs ?? 0);
    this.upperBound = (this.meanSampleDiffs ?? 0) + zScore * (this.stddevSampleDiffs ?? 0);
    this.totalSamples = this.numSimulations;
  
    // Update barChartData3
    const valuesInInterval = []; // Values in confidence interval
    const valuesNotInInterval = []; // Values not in confidence interval
  
    for (const diff of sampleDifferences) {
      if (diff >= this.lowerBound && diff <= this.upperBound) {
        valuesInInterval.push(diff);
      } else {
        valuesNotInInterval.push(diff);
      }
    }
  
    this.barChartData3[0].data = valuesInInterval.map(() => 1); // Set the value to 1 for each data point
    this.barChartData3[1].data = valuesNotInInterval.map(() => 1); // Set the value to 1 for each data point
  
    // Update labels for barChartData3 if needed
    // this.barChartLabels3 = ...;
  
    // Trigger change detection to update the chart
    // You may need to inject ChangeDetectorRef and call detectChanges() if necessary

    this.cdr.detectChanges();
  }




  applyChanges(): void {
    const incrementValue = parseInt((document.getElementById('increment') as HTMLInputElement).value, 10);
    this.numAFailure += incrementValue;
    this.numASuccess += incrementValue;
    this.numBFailure += incrementValue;
    this.numBSuccess += incrementValue;
    this.updateChartData();
  }

  calculateZScore(): number {
    return 1.96;
  }

  

  updateChartData(): void {
    const totalA = this.numASuccess + this.numAFailure;
    const totalB = this.numBSuccess + this.numBFailure;
    const percentASuccess = (this.numASuccess / totalA) * 100;
    const percentAFailure = (this.numAFailure / totalA) * 100;
    const percentBSuccess = (this.numBSuccess / totalB) * 100;
    const percentBFailure = (this.numBFailure / totalB) * 100;
    this.barChartData1 = [
      { data: [percentASuccess, percentBSuccess], label: '% Success', backgroundColor: 'rgba(0, 250, 0, 0.7)' },
      { data: [percentAFailure, percentBFailure], label: '% Failure', backgroundColor: 'rgba(255, 0, 0, 0.7)' }
    ];
    this.barChartData1[0].backgroundColor = ['rgba(0, 250, 0, 0.7)', 'rgba(0, 250, 0, 0.7)'];
    this.barChartData1[1].backgroundColor = ['rgba(255, 0, 0, 0.7)', 'rgba(255, 0, 0, 0.7)'];
    //this.populateCustomChart();


  }
}