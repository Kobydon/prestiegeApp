import { Component, OnInit } from '@angular/core';
import { FormControlName,FormGroup,FormBuilder, Validators} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as XLSX from 'xlsx';
import { GuestService } from 'app/services/guest.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

import { ToastrService } from 'ngx-toastr';
import { RoomService } from 'app/services/rooms.service';
// import { guestService } from 'app/school.service';

import { userService } from 'app/user.service';
@Component({
  selector: 'expenses',
  templateUrl: './expenses.component.html',
  styleUrls: ['./expenses.component.css']
})
export class ExpensesComponent implements OnInit {



  @BlockUI('loading') loading!: NgBlockUI
  base64_string:any;
  header:any;
  displayStyle ="none";
  fileName= 'expense.xlsx';
  // @Input() ad: Adds ={brand:'',category:'',condition:'',price:'',description:'',
  //                     phone:'',negotiable:'',city:'',image:'',post_by_id:''};
  //  login:Login[]=[];
  createForm!:FormGroup;  
  submitted = false;

  id?:string|null;
  title ='Create Ad';
  isNew = true;
  post = true;
  update = false;
  i_id !:number;

  departmentList:any;
  expense_info:any;
  page = 1;
  pageSize: number = 100;
  feestypeList:any;
expenseList:any;
classList:any;
  itemsList: any[] = [];
user:any;
findList: any[] = [];
  constructor(private fb:FormBuilder,private toastr:ToastrService,private guestService:GuestService,
    private userService:userService) {

      this.createForm = this.fb.group({
  
        id:['',Validators.required],
      
        name:['',Validators.required],
        amount:['',Validators.required],
      
       
        
        date:['',Validators.required],
      
        note:['',Validators.required],
       dates:['',Validators.required],
            subcategory:['',Validators.required],
       
    })  
     }

  ngOnInit(): void {
    this.getUser();
    this.getExpenseLIst();
    this.getItemsList();
    this.GroupSorted();
  }



async getItemsList() {
      try {
        const res = await this.guestService.getAccountGroupList();
        if (res) this.itemsList = res;
      } catch (error) {
        this.toastr.error('Error fetching items list');
      }
    }

  async  adExpense(record){

    const d ={
   
     name:record.name,
     amount:record.amount,
     note:record.note,
     
     date:record.date,
    
     
   
   
     }
    
    
     // console.log(guest.password)
     // console.log(guest.confirm_password)
     // guest.image_three= this.base64_string
     try{
       this.loading.start();
      var res  = await this.guestService.addExpense(record);
      if(res)this.toastr.success(null,"record successfully added ");this.getExpenseLIst();
   
     
     } catch(error){
       this.toastr.error(null,error);
   
     }
   
   
         finally{
           this.loading.stop();
         }
   
   
    
   
   }
     async GroupSorted() {
      try {
        const res = await this.guestService.GroupSorted();
        if (res) this.findList = res;
      } catch (error) {
        this.toastr.error('Error fetching items list');
      }
    }
  
    async findAccountGroup() {
  const group = {
    find: this.createForm.value.name
  };

  try {
    // Assuming findAccountGroup is a function that returns a promise
    const res = await this.guestService.findExpenseGroup(group);

    // Check if the result is an array and assign it to itemsList
    if (Array.isArray(res)) {
      this.expenseList = res;
    } else {
      alert("Not found or result is not an array");
    }
  } catch (error) {
    console.error('Error finding account group:', error);
    alert("An error occurred");
  }
}
   
  
   async getExpenseLIst(){
    try{
      this.loading.start();
      var res = await this.guestService.getExpenseList();
      if(res) this.expenseList=res; 
  
    } catch(error){
      this.toastr.error(null,error)
    }
  finally{
    this.loading.stop();
  }
    
  }
  
  
  
  
  
  
  exportexcel()
  {
    /* pass here the table id */
    let element = document.getElementById('excel-table');
    const ws: XLSX.WorkSheet =XLSX.utils.table_to_sheet(element);
  
    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
  
    /* save to file */  
    XLSX.writeFile(wb, this.fileName);
  
  }
    
  
   
  
  openPopup() {
     
    this.header ="Add New";
  
    this.displayStyle = "block";
  
  }
  closePopup() {
    this.displayStyle = "none";
  
  }
  
    
  
  
   
  async editExpense(id:any) {
      
    this.header ="Edit";
  
    this.displayStyle = "block";
    try{
      this.loading.start();
      this.expense_info =  await this.guestService.getExpense(id);
    
      if ( this.expense_info)  
      this.createForm.patchValue({
       id:this.expense_info[0].id,
        name:this.expense_info[0].name,
       
        amount:this.expense_info[0].amount,
        note:this.expense_info[0].note,
    
        date:this.expense_info[0].date,
       
      
        
          //  image_one:this.expense_info[0].image_one,image_two:this.expense_info[0].image_two,image_three:this.expense_info[0].image_three
      })
    }
  catch (error:any) {
    this.toastr.error(null,error)
  } finally {
    this.loading.stop();
  
  }
    
  }
  
  
  
  async updateExpense(record){
   
    const d ={

   
        name:record.name,
        amount:record.amount,
        note:record.note,
        
        date:record.date,
       
        
      
      
        }
    try{
      this.loading.start();
       var res= await this.guestService.updateExpense(d);
            // this.toastr.success(null,"successfully updated profile
this.getExpenseLIst  
    }
    catch(error:any){
      this.toastr.error(null,error)
    }
   finally{
    this.loading.stop();
  
   }
  }
  
  async deleteExpense(id:number){
  
    try{
      this.loading.start();
       var res= await this.guestService.deleteExpense(id)
            // this.toastr.success(null,"successfully updated profile
            if(res)  this.getExpenseLIst();
  
    }
    catch(error:any){
      this.toastr.error(null,error)
    }
   finally{
    this.loading.stop();
  
   }
  
      
         
  }
  
  myFunction() {
  
    var input, filter, table, tr, td, i, txtValue;
    input = document.getElementById("myInput");
    filter = input.value.toUpperCase();
    table = document.getElementById("excel-table");
    tr = table.getElementsByTagName("tr");
    for (i = 0; i < tr.length; i++) {
      td = tr[i].getElementsByTagName("td")[0];
      if (td) {
        txtValue = td.textContent || td.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
          tr[i].style.display = "";
        } else {
          tr[i].style.display = "none";
        }
       
      }       
    }
  }
  
  
  
  async getUser(){
    try{
        var res = await this.userService.getUser()
        if (res) this.user=res;
  
    }catch(err){console.log(err)}
    finally{console.log("success");}
  
  
  
  }
  
  
  
  
      
  
  async searchDates(){
  
    const d = {
      date: this.createForm.value.dates
    }
      try{
        this.loading.start();
        var res = await this.guestService.searchExpenseDate(d);
      if(res) this.expenseList=res;
        
        
      
  
      }
      catch(err){this.toastr.error(null,err.message)}
  
      finally{this.loading.stop();}
  }
    


}
