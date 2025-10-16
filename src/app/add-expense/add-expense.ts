import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

type Expense = {
  id: number;
  name: string;
  category: string;
  amount: number;
  date: string;
  note: string;
};

@Component({
  selector: 'app-add-expense',
  imports: [CommonModule, FormsModule],
  templateUrl: './add-expense.html',
  styleUrls: ['./add-expense.css']
})
export class AddExpense {
  name = '';
  category = '';
  amount: any = '';
  date = '';
  note = '';

  private KEY = 'expenses';

  constructor(private router: Router) { }

  private readAll(): Expense[] {
    try {
      const data = localStorage.getItem(this.KEY) || '[]';
      const arr = JSON.parse(data);
      return Array.isArray(arr) ? arr : [];
    } catch {
      return [];
    }
  }

  private writeAll(list: Expense[]) {
    localStorage.setItem(this.KEY, JSON.stringify(list));
  }

  save(): void {
    if (!this.name.trim() || !this.category.trim() || !this.amount || !this.date) {
      alert('กรุณากรอกข้อมูลให้ครบ');
      return;
    }

    const list = this.readAll();
    const newItem: Expense = {
      id: Date.now(),
      name: this.name.trim(),
      category: this.category.trim(),
      amount: Number(this.amount),
      date: this.date,
      note: this.note.trim()
    };

    list.push(newItem);
    this.writeAll(list);
    alert('เพิ่มข้อมูลเรียบร้อย');
    this.router.navigate(['/dashboard']);
  }

  cancel(): void {
    this.router.navigate(['/dashboard']);
  }
}