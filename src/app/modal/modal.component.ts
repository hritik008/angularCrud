import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SuccessModalComponent } from '../success-modal/success-modal.component';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {

  employeeForm !: FormGroup;
  actionBtn: string = "Submit";
  constructor(
      private formBuilder: FormBuilder,
      private api: ApiService,
      @Inject(MAT_DIALOG_DATA) public editData : any,
      private dialogRef: MatDialogRef<ModalComponent>,
      private modal: MatDialog, 
  ) { }

  ngOnInit(): void {
    this.employeeForm = this.formBuilder.group({
      empID: ['', Validators.required],
      name: ['', Validators.required],
      email: ['', Validators.required],
      address: ['', Validators.required],
      phone: ['', Validators.required],
      skills: ['', Validators.required],
      photo: ['']
    });

    if(this.editData){
      console.log(this.editData);
      this.actionBtn = "Update";
      this.employeeForm.controls['empID'].setValue(this.editData.empID);
      this.employeeForm.controls['name'].setValue(this.editData.name);
      this.employeeForm.controls['email'].setValue(this.editData.email);
      this.employeeForm.controls['address'].setValue(this.editData.address);
      this.employeeForm.controls['phone'].setValue(this.editData.phone);
      this.employeeForm.controls['skills'].setValue(this.editData.skills);
      this.employeeForm.controls['photo'].setValue(this.editData.photo);
    }
  }

  selectedFile: any = null;
  url:any;
  onFileSelected(event: any): void {
    console.log(event);
    console.log("File Selected ", event.target.files[0].name);
    this.selectedFile = event.target.files[0].name ?? null;
    this.url = this.selectedFile;
    // const reader = new FileReader();
    // reader.addEventListener("load", ()=>{
    //   // console.log(reader.result);
    // });
    // reader.readAsDataURL(this.selectedFile);
    // reader.onload = (event: any)=>{
    //   this.url = event.target.result;
    // }
  }

  addEmployee(){
    if(!this.editData){
      if(this.employeeForm.valid){
        console.log("Emp form data: " , this.employeeForm.value)
        //rxjx topic of how we can make use of observer types in angular 13
        // const fd = new FormData();
        // fd.append('image',this.selectedFile,this.selectedFile.name);
        this.api.postEmployee(this.employeeForm.value).
        subscribe({
          next:(res)=>{
            // alert("Employee added successfully");
            this.modal.open(SuccessModalComponent,{
              width: '30%',
              height: '30%'
            });
            this.employeeForm.reset();
            this.dialogRef.close('save');
          },
          error:()=>{
            alert("Error while adding the employee")
          }
        })
      }
    }else{
      this.updateEmployee();
    }
  }

  updateEmployee(){
    this.api.putEmployee(this.employeeForm.value,this.editData.id).
    subscribe({
      next:(res)=>{
        alert("Employee Updated Succesfully");
        this.employeeForm.reset();
        this.dialogRef.close('update');
      },
      error:()=>{
        alert("Error while updating the record");
      }
    })
  }

}
