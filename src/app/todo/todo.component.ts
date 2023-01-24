import {Component, NgZone, OnInit, ViewChild} from '@angular/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms'
import {CdkDragDrop, moveItemInArray, transferArrayItem} from "@angular/cdk/drag-drop";
import {TasksInterface} from "../model/tasks";
import {CdkTextareaAutosize} from "@angular/cdk/text-field";
import {take} from "rxjs";

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.scss']
})
export class TodoComponent implements OnInit {

  todoForm !: FormGroup;
  tasks: TasksInterface [] = [];
  inProgress: TasksInterface [] = [];
  done: TasksInterface [] = [];
  updateId!: any;
  isEditEnabled: boolean = false;

  constructor(private formBuilder: FormBuilder, private _ngZone: NgZone) {
  }

  ngOnInit(): void {
    this.todoForm = this.formBuilder.group({
      item: ['', Validators.required]
    })
  }

  @ViewChild('autosize') autosize: CdkTextareaAutosize | undefined;

  addTask() {
    this.tasks.push({
      title: this.todoForm.value.item,
      done: false
    })
    this.todoForm.reset();
  }

  editTask(item: TasksInterface, i: number) {
    this.todoForm.controls['item'].setValue(item.title);
    this.updateId = i;
    this.isEditEnabled = true;
  }

  deleteTask(i: number) {
    this.tasks.splice(i, 1)
  }

  deleteInProgressTask(i: number) {
    this.inProgress.splice(i, 1)
  }

  deleteDoneTask(i: number) {
    this.done.splice(i, 1)
  }

  drop(event: CdkDragDrop<TasksInterface[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
  }

  updateTask() {
    this.tasks[this.updateId].title = this.todoForm.value.item;
    this.tasks[this.updateId].done = false;
    this.todoForm.reset();
    this.updateId = undefined;
    this.isEditEnabled = false;
  }
}
