import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

type Expense = {
  name: string;
  category: string;
  amount: number;   // บาท (เป็นค่าบวก)
  dateISO: string;  // yyyy-MM-dd
  note?: string;
};

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard {

}
