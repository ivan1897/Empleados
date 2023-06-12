import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(datos: any[], filterValue: any): any {

    if (filterValue == '' || filterValue.length < 3 ) return datos;
    
    const resultPost =[];

    for (const post of datos){
      if(post.nombre.indexOf(filterValue) > -1){
        resultPost.push(post);
      };
      console.log(resultPost);
      return resultPost;
    }
         
  }

}
