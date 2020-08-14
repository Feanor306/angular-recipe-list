import { Component, OnInit, OnDestroy } from '@angular/core';
import { Recipe } from '../recipe.model';
//import { RecipeService } from '../recipe.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import * as fromApp from '../../store/app.reducer';
//import * as RecipesActions from '../store/recipe.actions';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent implements OnInit, OnDestroy {
  subscription: Subscription;
  recipes: Recipe[];

  constructor(
    //private recipeService: RecipeService,
    private router: Router,
    private route: ActivatedRoute,
    private store: Store<fromApp.AppState>
  ) { }

  ngOnInit(): void {
    //this.subscription = this.recipeService.recipesChanged.subscribe(
    this.subscription = this.store.select('recipes')
    .pipe(map(recipeState => recipeState.recipes))
    .subscribe(
      (recipes: Recipe[]) => {
        this.recipes = recipes;
      }
    );
    //this.recipes = this.recipeService.getRecipes();
  }

  onNewRecipe() {
    this.router.navigate(['new'], { relativeTo: this.route });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
