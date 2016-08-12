import {
    addProviders,
    inject,
} from '@angular/core/testing';
import { AppLayout } from './app.layout';

describe('App', () => {
    beforeEach(() => {
        addProviders([
            AppLayout
        ]);
    });

    it ('should work', inject([AppLayout], (app: AppLayout) => {
        // Add real test here
        expect(2).toBe(2);
    }));
});