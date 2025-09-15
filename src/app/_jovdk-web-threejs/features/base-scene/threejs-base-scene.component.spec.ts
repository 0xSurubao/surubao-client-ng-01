import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThreeJsBaseSceneComponent } from './threejs-base-scene.component';

describe('BaseSceneComponent', () => {
    let component: ThreeJsBaseSceneComponent;
    let fixture: ComponentFixture<ThreeJsBaseSceneComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ThreeJsBaseSceneComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(ThreeJsBaseSceneComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
