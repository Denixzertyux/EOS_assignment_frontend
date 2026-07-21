import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-task-modal',
  imports: [FormsModule],
  templateUrl: './task-modal.component.html',
  styleUrl: './task-modal.component.css',
})
export class TaskModalComponent implements OnChanges {
  @Input() task: any = null;
  @Input() users: any[] = [];
  @Input() statuses: any[] = [];
  @Output() save = new EventEmitter<any>();
  @Output() close = new EventEmitter<void>();

  taskName = '';
  dueDate = '';
  status = '';
  userId: number | null = null;

  ngOnChanges() {
    if (this.task) {
      this.taskName = this.task.content || '';
      this.dueDate = this.task.dueDate ? this.task.dueDate.substring(0, 10) : '';
      this.status = this.task.status || '';
      this.userId = this.task.userId || null;
    } else {
      this.taskName = '';
      this.dueDate = '';
      this.status = '';
      this.userId = null;
    }
  }

  get isEditMode(): boolean {
    return this.task != null;
  }

  onSave() {
    const result: any = {
      content: this.taskName,
      dueDate: this.dueDate ? this.dueDate + 'T00:00:00' : null,
      status: this.status || null,
      userId: this.userId || null,
    };
    if (this.isEditMode) {
      result.id = this.task.id;
    }
    this.save.emit(result);
  }

  onClose() {
    this.close.emit();
  }
}
