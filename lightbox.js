// Lightbox setup
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
prevButton.disabled = false; // Initially enabled

const nextButton = document.createElement('button');
nextButton.textContent = '>';
nextButton.classList.add('nav-lightbox', 'next');
nextButton.disabled = false; // Initially enabled

lightboxOverlay.appendChild(prevButton);
lightboxOverlay.appendChild(nextButton);

// Variables for current recipe navigation
let currentRecipeIndex = null;
let currentRecipe = null;

// Function to open lightbox with selected recipe
// Function to open lightbox with selected recipe
// Function to open lightbox with selected recipe
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

    // Adding "RECETTE" above the description
    const recetteTitle = document.createElement('h3');
    recetteTitle.classList.add('recette-title');
    recetteTitle.textContent = 'RECETTE';

    const description = document.createElement('p');
    description.textContent = recipe.description;
    description.id = 'lightbox-recipe-description';

    // Adding "INGRÉDIENTS" above the ingredient list
    const ingredientsTitle = document.createElement('h4');
    ingredientsTitle.classList.add('ingredients-title');
    ingredientsTitle.textContent = 'INGRÉDIENTS';

    const ingredientsList = document.createElement('ul');
    ingredientsList.id = 'lightbox-recipe-ingredients';
    recipe.ingredients.forEach(ingredient => {
        const listItem = document.createElement('li');
        const ingredientName = document.createElement('div');
        ingredientName.classList.add('ingredient-name');
        ingredientName.textContent = ingredient.ingredient;

        const ingredientQuantity = document.createElement('div');
        ingredientQuantity.classList.add('ingredient-quantity');
        ingredientQuantity.textContent = `${ingredient.quantity || ''} ${ingredient.unit || ''}`;

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


// Function to close lightbox
function closeLightboxFn() {
    lightboxOverlay.style.display = 'none';
    lightboxOverlay.setAttribute('aria-hidden', 'true');
}

// Update navigation buttons (previous/next)
function updateNavigationButtons() {
    prevButton.disabled = false;
    nextButton.disabled = false;

    // Looping functionality
    if (currentRecipeIndex === 0) {
        prevButton.disabled = false; // Enable "Previous" for first element
    } else if (currentRecipeIndex === recipes.length - 1) {
        nextButton.disabled = false; // Enable "Next" for last element
    }
}

// Navigation functions
prevButton.addEventListener('click', () => {
    if (currentRecipeIndex > 0) {
        currentRecipeIndex--;
    } else {
        currentRecipeIndex = recipes.length - 1; // Go to last recipe (loop)
    }
    currentRecipe = recipes[currentRecipeIndex];
    openLightbox(currentRecipe, currentRecipeIndex);
});

nextButton.addEventListener('click', () => {
    if (currentRecipeIndex < recipes.length - 1) {
        currentRecipeIndex++;
    } else {
        currentRecipeIndex = 0; // Go to first recipe (loop)
    }
    currentRecipe = recipes[currentRecipeIndex];
    openLightbox(currentRecipe, currentRecipeIndex);
});

// Add event to close lightbox when clicked outside
closeLightbox.addEventListener('click', closeLightboxFn);

// Add lightbox functionality to recipe images
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


