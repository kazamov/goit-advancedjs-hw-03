import { fetchBreeds, fetchCatByBreed } from './cat-api';

const loaderElement = document.getElementById('loader');
const errorElement = document.getElementById('error');
const catsSelect = document.getElementById('cat-breeds');
const catInfoTemplate = document.getElementById('cat-info-template');
const catInfoContainer = document.getElementById('cat-info');
let cats = null;

function toggleElementVisibility(element) {
  element.classList.toggle('invisible');
}

function hideElement(element) {
  if (!element.classList.contains('invisible')) {
    element.classList.add('invisible');
  }
}

function showElement(element) {
  if (element.classList.contains('invisible')) {
    element.classList.remove('invisible');
  }
}

function renderCatInfo(catInfo, catImageInfo) {
  const catInfoElement = catInfoTemplate.content.cloneNode(true);

  const catImage = catInfoElement.querySelector('.cat-image');

  const ratio = catImageInfo.width / catImageInfo.height;

  catImage.src = catImageInfo.url;
  catImage.width = 300;
  catImage.height = 300 / ratio;
  catImage.alt = catInfo.alt_names;

  catInfoElement.querySelector('.cat-name').textContent = catInfo.name;
  catInfoElement.querySelector('.cat-description').textContent =
    catInfo.description;

  const catTemplate = catInfoElement.querySelector('.cat-temperament');
  catTemplate.innerHTML = catTemplate.innerHTML.replace(
    '[TEMPERAMENT]',
    catInfo.temperament
  );

  catInfoContainer.innerHTML = '';
  catInfoContainer.appendChild(catInfoElement);

  showElement(catInfoContainer);
}

async function onCatSelected(event) {
  const breedId = event.target.value;
  const catInfo = cats.find(cat => cat.id === breedId);
  let catImageInfo = null;

  try {
    toggleElementVisibility(loaderElement);
    hideElement(catInfoContainer);

    catImageInfo = await fetchCatByBreed(breedId);
  } catch (error) {
    toggleElementVisibility(errorElement);
  } finally {
    toggleElementVisibility(loaderElement);
  }

  if (!catInfo || !catImageInfo) {
    return;
  }

  renderCatInfo(catInfo, catImageInfo[0]);
}

(async () => {
  try {
    toggleElementVisibility(loaderElement);
    cats = await fetchBreeds();
  } catch (error) {
    toggleElementVisibility(errorElement);
  } finally {
    toggleElementVisibility(loaderElement);
  }

  if (!cats) {
    return;
  }

  const catsOptions = ['<option value="">Select a cat breed</option>'].concat(
    cats.map(cat => `<option value="${cat.id}">${cat.name}</option>`)
  );
  catsSelect.innerHTML = catsOptions.join('');
  catsSelect.onchange = onCatSelected;

  toggleElementVisibility(catsSelect);
})();
