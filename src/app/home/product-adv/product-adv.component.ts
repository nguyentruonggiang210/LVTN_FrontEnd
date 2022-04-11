import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CarouselDto } from 'src/app/models/CarouselDto';
import { CarouselService } from 'src/app/services/home/carousel.service';

@Component({
    selector: 'app-product-adv',
    templateUrl: './product-adv.component.html',
    styleUrls: ['./product-adv.component.scss']
})


export class ProductAdvComponent implements OnInit {

    defaultImage: string = 'assets/img/default-product-image.png'
    dataSource: CarouselDto[] = null;

    constructor(private service: CarouselService,
        private router: Router) {}

    ngOnInit() {
        this.service.getNewProduct()
            .subscribe(x => this.dataSource = x.body);
    }

    navigateToDetail(id: number){
        this.router.navigate(['detail','product',id]);
    }
}

