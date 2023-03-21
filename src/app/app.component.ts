import { Component, OnInit, ViewChild } from '@angular/core';
import {MatDialog, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { ModalComponent } from './modal/modal.component';
import { ApiService } from './services/api.service';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'angularCrud';

  displayedColumns: string[] = ['photo','empID', 'name', 'email', 'address', 'phone', 'skills','action'];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private modal: MatDialog, 
    private api:ApiService
  ){}

  ngOnInit(): void {
    this.getAllEmployees();
  }

  openModal() {
    this.modal.open(ModalComponent, {
      width: '50%',
      height: '80%'
    }).afterClosed().subscribe(val=>{
      if(val === 'save'){
        this.getAllEmployees();
      }
    })
  }

  getAllEmployees(){
    this.api.getEmployee().
    subscribe({
      next:(res)=>{
        console.log("Response from server: " , res);
        res.forEach((elementNew : any) => {
         let index =  elementNew.photo.lastIndexOf("\\");
         var namee = elementNew.photo.substring(index+1);
         elementNew.photo = "C:\\Users\\hr.ranjan\\Pictures\\Saved Pictures\\" + namee;
        });
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error:()=>{
        alert("Error while fetching the records!!")
      }
    })
  }

  editEmployee(row: any){
    this.modal.open(ModalComponent,{
      width: '50%',
      height: '80%',
      data: row
    }).afterClosed().subscribe(val=>{
      if(val === 'update'){
        this.getAllEmployees();
      }
    })
  }

  deleteEmployee(id: number){
    this.api.deleteEmployee(id)
    .subscribe({
      next:(res)=>{
        alert("Employee deleted succesfully");
        this.getAllEmployees();
      },
      error:()=>{
        alert("Error while deleting the employee!!")
      }
    })
  }

  // applyFilter(event: Event) {
  //   const filterValue = (event.target as HTMLInputElement).value;
  //   this.dataSource.filter = filterValue.trim().toLowerCase();

  //   if (this.dataSource.paginator) {
  //     this.dataSource.paginator.firstPage();
  //   }
  // }
}
