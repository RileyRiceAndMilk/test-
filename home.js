import { recipes } from './recipes.js';

const recipeSection = document.querySelector('.recipe-section');
const ingredientFilter = document.querySelector('#ingredient-selector');
const applianceFilter = document.querySelector('#appliance-selector');
const ustensilFilter = document.querySelector('#utensil-selector');
const selectedTagsContainer = document.querySelector('#selected-tags');
const recipeCountElement = document.querySelector('#total-recipes');

const selectedFilters = {
    ingredient: null,
    appliance: null,
    ustensil: null,
    searchQuery: '' 
};

const searchButton = document.querySelector('.button-mobile-version');
const searchInput = document.querySelector('.text-input');

// Create Lightbox elements
const lightboxOverlay = document.createElement('div');
lightboxOverlay.classList.add('lightbox-overlay');
document.body.appendChild(lightboxOverlay);

const lightboxWrapper = document.createElement('div');
lightboxWrapper.classList.add('lightbox-wrapper');
lightboxOverlay.appendChild(lightboxWrapper);

const lightbox = document.createElement('div');
lightbox.classList.add('lightbox');
lightboxWrapper.appendChild(lightbox);

const closeLightbox = document.createElement('button');
closeLightbox.textContent = '×';
closeLightbox.classList.add('close-lightbox');
lightboxOverlay.appendChild(closeLightbox);

const prevButton = document.createElement('button');
prevButton.textContent = '<';
prevButton.classList.add('nav-lightbox', 'prev');
prevButton.disabled = false;

const nextButton = document.createElement('button');
nextButton.textContent = '>';
nextButton.classList.add('nav-lightbox', 'next');
nextButton.disabled = false;

lightboxOverlay.appendChild(prevButton);
lightboxOverlay.appendChild(nextButton);

let currentRecipeIndex = null;
let currentRecipe = null;

// Lightbox Functions
function openLightbox(recipe, index) {
    currentRecipe = recipe;
    currentRecipeIndex = index;

    const img = document.createElement('img');
    img.src = `recipes/${recipe.image}`;
    img.alt = `Image de ${recipe.name}`;
    img.id = 'lightbox-image';

    const title = document.createElement('h2');
    title.textContent = recipe.name;
    title.id = 'lightbox-recipe-title';

    const recetteTitle = createElement('h3', ['recette-title'], 'RECETTE');
    
    const description = createElement('p', [], recipe.description);
    description.id = 'lightbox-recipe-description';

    const ingredientsTitle = createElement('h4', ['ingredients-title'], 'INGRÉDIENTS');
    
    const ingredientsList = document.createElement('ul');
    ingredientsList.id = 'lightbox-recipe-ingredients';
    recipe.ingredients.forEach(ingredient => {
        const listItem = document.createElement('li');
        const ingredientName = createElement('div', ['ingredient-name'], ingredient.ingredient);
        const ingredientQuantity = createElement('div', ['ingredient-quantity'], `${ingredient.quantity || ''} ${ingredient.unit || ''}`);
        
        listItem.appendChild(ingredientName);
        listItem.appendChild(ingredientQuantity);
        ingredientsList.appendChild(listItem);
    });

    lightbox.innerHTML = '';
    lightbox.appendChild(img);
    lightbox.appendChild(title);
    lightbox.appendChild(recetteTitle);
    lightbox.appendChild(description);
    lightbox.appendChild(ingredientsTitle);
    lightbox.appendChild(ingredientsList);

    lightboxOverlay.style.display = 'flex';
    lightboxOverlay.setAttribute('aria-hidden', 'false');
    updateNavigationButtons();
}

function closeLightboxFn() {
    lightboxOverlay.style.display = 'none';
    lightboxOverlay.setAttribute('aria-hidden', 'true');
}

function updateNavigationButtons() {
    prevButton.disabled = currentRecipeIndex === 0;
    nextButton.disabled = currentRecipeIndex === recipes.length - 1;
}

prevButton.addEventListener('click', () => {
    if (currentRecipeIndex > 0) {
        currentRecipeIndex--;
    } else {
        currentRecipeIndex = recipes.length - 1;
    }
    currentRecipe = recipes[currentRecipeIndex];
    openLightbox(currentRecipe, currentRecipeIndex);
});

nextButton.addEventListener('click', () => {
    if (currentRecipeIndex < recipes.length - 1) {
        currentRecipeIndex++;
    } else {
        currentRecipeIndex = 0;
    }
    currentRecipe = recipes[currentRecipeIndex];
    openLightbox(currentRecipe, currentRecipeIndex);
});

closeLightbox.addEventListener('click', closeLightboxFn);

// Fonction utilitaire pour créer des éléments
function createElement(type, classes = [], textContent = '') {
    const element = document.createElement(type);
    classes.forEach(className => element.classList.add(className));
    if (textContent) element.textContent = textContent;
    return element;
}

// Recipe Card Class
class RecipeCard {
    constructor(recipe) {
        this.recipe = recipe;
    }

    static createCard(recipe) {
        const card = new RecipeCard(recipe);
        return card.createCardContent();
    }

    createCardContent() {
        const card = document.createElement('article');
        card.classList.add('recipe-card');
        card.setAttribute('aria-labelledby', `recipe-${this.recipe.id}`);

        const imageContainer = document.createElement('div');
        imageContainer.classList.add('image-container');

        const img = createElement('img', ['recipe-image'], '');
        img.src = `recipes/${this.recipe.image}`;
        img.alt = `Image de ${this.recipe.name}`;
        img.onerror = () => {
            img.src = 'recipes/default.jpg';
        };

        const timeTag = createElement('span', ['time-tag'], `${this.recipe.time} min`);

        imageContainer.appendChild(img);
        imageContainer.appendChild(timeTag);

        const title = createElement('h2', [], this.recipe.name);
        title.id = `recipe-${this.recipe.id}`;

        const recipeContainer = document.createElement('div');
        recipeContainer.classList.add('recipe-container');

        const recetteTitle = createElement('h3', ['recette-title'], 'RECETTE');
        recipeContainer.appendChild(recetteTitle);

        const description = createElement('p', ['recipe-description'], this.recipe.description);
        recipeContainer.appendChild(description);

        const ingredientsTitle = createElement('h4', ['ingredients-title'], 'INGRÉDIENTS');
        recipeContainer.appendChild(ingredientsTitle);

        const ingredientsList = document.createElement('ul');
        ingredientsList.classList.add('ingredients-list');
        this.recipe.ingredients.forEach(ingredient => {
            const listItem = document.createElement('li');

            // Créer un div pour le nom de l'ingrédient, au-dessus de la quantité
            const ingredientName = createElement('div', ['ingredient-name'], ingredient.ingredient);

            // Créer un div pour la quantité et l'unité, en-dessous
            const ingredientQuantity = createElement('div', ['ingredient-quantity'], `${ingredient.quantity || ''} ${ingredient.unit || ''}`);

            listItem.appendChild(ingredientName);
            listItem.appendChild(ingredientQuantity);
            ingredientsList.appendChild(listItem);
        });

        recipeContainer.appendChild(ingredientsList);

        card.appendChild(imageContainer);
        card.appendChild(title);
        card.appendChild(recipeContainer);

        return card;
    }
}

// Display Recipes and Initialize Filters
function displayRecipes(recipes) {
    recipeSection.innerHTML = ''; 
    recipes.forEach(recipe => {
        const card = RecipeCard.createCard(recipe);
        recipeSection.appendChild(card);
    });

    addLightboxToImages(); // Initialize lightbox functionality after displaying recipes
    updateRecipeCount(recipes);
}

function addLightboxToImages() {
    const recipeImages = document.querySelectorAll('.recipe-image');
    recipeImages.forEach((img, index) => {
        img.addEventListener('click', () => {
            const recipeId = img.closest('.recipe-card').getAttribute('aria-labelledby').split('-')[1];
            const selectedRecipe = recipes.find(recipe => recipe.id == recipeId);
            openLightbox(selectedRecipe, index);
        });
    });
}

function initializeFilters(recipes) {
    const ingredients = new Set();
    const appliances = new Set();
    const ustensils = new Set();

    recipes.forEach(recipe => {
        recipe.ingredients.forEach(ing => ingredients.add(ing.ingredient.toLowerCase()));
        appliances.add(recipe.appliance.toLowerCase());
        recipe.ustensils.forEach(ust => ustensils.add(ust.toLowerCase()));
    });

    populateFilter(ingredientFilter, Array.from(ingredients).sort());
    populateFilter(applianceFilter, Array.from(appliances).sort());
    populateFilter(ustensilFilter, Array.from(ustensils).sort());
}

function populateFilter(filterElement, options) {
    filterElement.innerHTML = '<option value="">Tous</option>';
    options.forEach(option => {
        const optionElement = createElement('option', [], option);
        optionElement.value = option;
        filterElement.appendChild(optionElement);
    });

    filterElement.addEventListener('change', () => {
        const filterType = filterElement.id.split('-')[0]; 
        selectedFilters[filterType] = filterElement.value || null; 
        updateTags();
        applyFilters();
    });
}

function updateTags() {
    selectedTagsContainer.innerHTML = ''; 

    Object.entries(selectedFilters).forEach(([filterType, value]) => {
        if (value && filterType !== 'searchQuery') {
            const tag = createElement('span', ['filter-tag'], `${value} ✖`);
            tag.setAttribute('data-filter-type', filterType);

            tag.addEventListener('click', () => {
                selectedFilters[filterType] = null;
                document.querySelector(`#${filterType}-selector`).value = '';
                updateTags();
                applyFilters();
            });

            selectedTagsContainer.appendChild(tag);
        }
    });

    if (selectedFilters.searchQuery) {
        const tag = createElement('span', ['filter-tag'], `${selectedFilters.searchQuery} ✖`);
        tag.setAttribute('data-filter-type', 'searchQuery');
        tag.addEventListener('click', () => {
            selectedFilters.searchQuery = '';
            searchInput.value = '';
            updateTags();
            applyFilters();
        });
        selectedTagsContainer.appendChild(tag);
    }
}

function applyFilters() {
    let filteredRecipes = recipes;

    if (selectedFilters.searchQuery) {
        filteredRecipes = filteredRecipes.filter(recipe =>
            recipe.name.toLowerCase().includes(selectedFilters.searchQuery.toLowerCase()) ||
            recipe.description.toLowerCase().includes(selectedFilters.searchQuery.toLowerCase()) ||
            recipe.ingredients.some(ingredient => ingredient.ingredient.toLowerCase().includes(selectedFilters.searchQuery.toLowerCase()))
        );
    }

    if (selectedFilters.ingredient) {
        filteredRecipes = filteredRecipes.filter(recipe =>
            recipe.ingredients.some(ingredient => ingredient.ingredient.toLowerCase() === selectedFilters.ingredient.toLowerCase())
        );
    }

    if (selectedFilters.appliance) {
        filteredRecipes = filteredRecipes.filter(recipe =>
            recipe.appliance.toLowerCase() === selectedFilters.appliance.toLowerCase()
        );
    }

    if (selectedFilters.ustensil) {
        filteredRecipes = filteredRecipes.filter(recipe =>
            recipe.ustensils.some(ustensil => ustensil.toLowerCase() === selectedFilters.ustensil.toLowerCase())
        );
    }

    displayRecipes(filteredRecipes);
}

function updateRecipeCount(filteredRecipes) {
    recipeCountElement.textContent = `${filteredRecipes.length} recette${filteredRecipes.length > 1 ? 's' : ''} ${filteredRecipes.length > 1 ? '' : ''}`;
}

// Initialize Search
searchInput.addEventListener('input', () => {
    selectedFilters.searchQuery = searchInput.value;
    applyFilters();
});

initializeFilters(recipes);
displayRecipes(recipes);

