import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SelectModule } from 'primeng/select';
import { NgStyle } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'app-select-tag',
  imports: [NgStyle, FormsModule, TagModule, SelectModule],
  templateUrl: './select-tag.component.html',
  styleUrl: './select-tag.component.css',
})
export class SelectTagComponent {
  @Input() options: any[] = [];
  @Input() optionLabel: string = '';
  @Input() placeholder: string = '';

  private _selectedOption: any;

  @Input()
  set selectedOption(value: any) {
    if (this._selectedOption !== value) {
      this._selectedOption = value;
      this.selectedOptionEvent.emit(this._selectedOption);
    }
  }
  get selectedOption(): any {
    return this._selectedOption;
  }
  @Output() selectedOptionEvent = new EventEmitter<any>();

  ngOnInit() {
    if (
      this.options &&
      this.options.length > 0 &&
      this._selectedOption === undefined
    ) {
      this.selectedOption = this.options[0] ?? '';
    }
  }
}
