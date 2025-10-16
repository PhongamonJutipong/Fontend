import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
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
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard {
 private KEY = 'expenses';
  expenses = signal<Expense[]>([]);

  total = computed(() =>
    this.expenses().reduce((sum, e) => sum + (Number(e.amount) || 0), 0)
  );

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.reload();
  }

  reload(): void {
    try {
      const raw = localStorage.getItem(this.KEY) || '[]';
      const arr = JSON.parse(raw);
      this.expenses.set(Array.isArray(arr) ? arr : []);
    } catch {
      this.expenses.set([]);
    }
  }

  goAdd(): void {
    this.router.navigate(['/add-expense']);
  }

  goReport(): void {
  this.router.navigate(['/report-component']);
}


  clearAll(): void {
    if (!confirm('ลบรายการทั้งหมด?')) return;
    localStorage.setItem(this.KEY, '[]');
    this.reload();
  }

  remove(id: number): void {
    const next = this.expenses().filter(e => e.id !== id);
    localStorage.setItem(this.KEY, JSON.stringify(next));
    this.expenses.set(next);
  }
}
