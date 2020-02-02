import { Component, OnInit, ViewChild } from '@angular/core';
import { SnackBarMassageComponent } from 'app/views/snack-bar-massage/snack-bar-massage.component';
import { MatPaginator, MatSort, MatSnackBar, MatTableDataSource, MatDialog } from '@angular/material';
import { AdministrationService } from '../../administration.service';
import { Overlay } from '@angular/cdk/overlay';
import { DialogComponent } from '../dialog/dialog.component';

@Component({
  selector: 'app-society-table',
  templateUrl: './society-table.component.html',
  styleUrls: ['./society-table.component.scss']
})
export class SocietyTableComponent implements OnInit {
  displayedColumns: string[] = ['srNo', 'name', 'code','edit','delete'];
  dataSource:any;
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;

  constructor(private service: AdministrationService,
    private snackBar: MatSnackBar,
    public dailog: MatDialog,
    private overlay:Overlay) { }

  ngOnInit() {
    this.getSocietyData();
  }

  getSocietyData(){
    this.service.getAllSocietyData()
    .subscribe(res => {
      console.log(res);
      this.dataSource = new MatTableDataSource(res.data);
      this.dataSource.paginator = this.paginator;
     console.log(this.dataSource);
    });

  }

  openDialog(id) {
    console.log(id);
    const scrollStrategy = this.overlay.scrollStrategies.reposition();
    const dialogRef = this.dailog.open(DialogComponent, {
      data:{id:id,status:'Society'},
      width: '50%',
      maxWidth:'92vw !important',
      height:'auto',
      scrollStrategy:scrollStrategy,
      closeOnNavigation: false
    });
    dialogRef.afterClosed().subscribe(data => {
      console.log(data);
      if(data==201){
        this.getSocietyData();
      }
    });
  }
  
  
 applyFilter(filterValue: string) {
  this.dataSource.filter = filterValue.trim().toLowerCase();
  }


  delete(id:number){
    console.log(id);
    this.service.deleteSocietyById(id)
    .subscribe(res=>{
      console.log(res);
        if(res.code==200){
        this.getSocietyData();
        this.snackBar.openFromComponent(SnackBarMassageComponent, {
          data: {
            message: 'Successfully Deleted',
            icon: 'check_circle_outline',
           },
           duration:2000
         });
      }
      else{
        this.snackBar.openFromComponent(SnackBarMassageComponent, {
          data: {
            message: 'Data Not Deleted ',
            icon: 'check_circle_outline',
           },
           duration:2000
          
        });
        
      }
    })
  }


}
