import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ReadWordSharedModule } from '../../shared';
import {
    ProductService,
    ProductPopupService,
    ProductComponent,
    ProductDetailComponent,
    ProductDialogComponent,
    ProductPopupComponent,
    ProductDeletePopupComponent,
    ProductDeleteDialogComponent,
    productRoute,
    productPopupRoute,
    ProductResolvePagingParams,
} from './';

const ENTITY_STATES = [
    ...productRoute,
    ...productPopupRoute,
];

@NgModule({
    imports: [
        ReadWordSharedModule,
        RouterModule.forChild(ENTITY_STATES)
    ],
    declarations: [
        ProductComponent,
        ProductDetailComponent,
        ProductDialogComponent,
        ProductDeleteDialogComponent,
        ProductPopupComponent,
        ProductDeletePopupComponent,
    ],
    entryComponents: [
        ProductComponent,
        ProductDialogComponent,
        ProductPopupComponent,
        ProductDeleteDialogComponent,
        ProductDeletePopupComponent,
    ],
    providers: [
        ProductService,
        ProductPopupService,
        ProductResolvePagingParams,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ReadWordProductModule {}
