import { Component, Input } from '@angular/core';
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
  selectedOption = this.options[0] ?? '';
}
