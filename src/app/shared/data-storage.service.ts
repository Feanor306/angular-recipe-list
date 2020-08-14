import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { RecipeService } from '../recipes/recipe.service';
import { Recipe } from '../recipes/recipe.model';
import { map, tap, take, exhaustMap } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import * as fromApp from '../store/app.reducer';
import * as RecipesActions from '../recipes/store/recipe.actions';
//import { AuthService } from '../auth/auth.service';

@Injectable({ providedIn: 'root' })
export class DataStorageService {
    private firebaseUrl: string = 'https://ng-course-recipe-book-25819.firebaseio.com/recipes.json';

    constructor(
        private http: HttpClient,
        private recipeService: RecipeService,
        private store: Store<fromApp.AppState>
        //private authService: AuthService
    ) {}

    storeRecipes() {
        const recipes = this.recipeService.getRecipes();
        this.http
            .put(
                this.firebaseUrl, 
                recipes)
            .subscribe(response => {
                console.log(response);
            });
    }

    fetchRecipes() {
        return this.http
            .get<Recipe[]>(this.firebaseUrl)
            .pipe(
                map(recipes => {
                    return recipes.map(recipe => {
                        return { ...recipe, ingredients: recipe.ingredients ? recipe.ingredients : [] };
                    });
                }),
                tap(recipes => {
                    this.store.dispatch(new RecipesActions.SetRecipes(recipes));
                    //this.recipeService.setRecipes(recipes);
                })
            );  
    }
}