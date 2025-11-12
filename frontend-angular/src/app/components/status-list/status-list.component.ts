import { Component, OnInit } from '@angular/core';
import { StatusService, StatusCheck } from '../../services/status.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-status-list',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './status-list.component.html',
  styleUrls: ['./status-list.component.css']
})
export class StatusListComponent implements OnInit {
  items: StatusCheck[] = [];
  loading = true;
  constructor(private statusService: StatusService) {}

  ngOnInit(): void {
    this.statusService.getAll().subscribe({
      next: (data) => {
        this.items = data;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      }
    });
  }
}
