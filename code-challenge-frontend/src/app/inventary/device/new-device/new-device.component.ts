import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-new-device',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './new-device.component.html',
  styleUrl: './new-device.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewDeviceComponent implements OnInit {
  myForm: FormGroup;
  isEditing: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<NewDeviceComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.myForm = this.formBuilder.group({
      type: ['', Validators.required],
      description: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    if (this.data && this.data.device) {
      this.isEditing = true;
      this.myForm.patchValue(this.data.device);
    }
  }

  saveDialog(): void {
    if (this.isEditing && this.data.device && this.data.device.id) {
      const dialogResult = {
        deviceData: { ...this.myForm.value, id: this.data.device.id },
        isEditing: this.isEditing,
      };
      this.dialogRef.close(dialogResult);
    } else {
      const dialogResult = {
        deviceData: this.myForm.value,
        isEditing: this.isEditing,
      };
      this.dialogRef.close(dialogResult);
    }
  }
}
