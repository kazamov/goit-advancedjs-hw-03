import SlimSelect from 'slim-select';
import 'slim-select/styles';

import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

import { fetchBreeds, fetchCatByBreed } from './cat-api';

const loaderElement = document.querySelector('.loader');
const catsSelect = document.querySelector('.cat-breeds');
const catInfoTemplate = document.getElementById('cat-info-template');
const catInfoContainer = document.querySelector('.cat-info');
let cats = null;

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

async function onCatSelected(options) {
  const breedId = options[0].value;
  const catInfo = cats.find(cat => cat.id === breedId);
  let catImageInfo = null;

  if (!catInfo) {
    hideElement(catInfoContainer);
    return;
  }

  try {
    showElement(loaderElement);
    hideElement(catInfoContainer);

    catImageInfo = await fetchCatByBreed(breedId);
  } catch (error) {
    iziToast.error({
      title: 'Error',
      message: 'Failed to fetch cat by breed',
      position: 'topCenter',
    });
  } finally {
    hideElement(loaderElement);
  }

  if (!catImageInfo) {
    return;
  }

  renderCatInfo(catInfo, catImageInfo);
}

(async () => {
  try {
    showElement(loaderElement);
    cats = await fetchBreeds();
  } catch (error) {
    iziToast.error({
      title: 'Error',
      message: 'Failed to fetch cat breeds',
      position: 'topCenter',
    });
  } finally {
    hideElement(loaderElement);
  }

  if (!cats) {
    return;
  }

  const catsOptions = ['<option value="">Select a cat breed</option>'].concat(
    cats.map(cat => `<option value="${cat.id}">${cat.name}</option>`)
  );
  catsSelect.innerHTML = catsOptions.join('');

  new SlimSelect({
    select: '.cat-breeds',
    settings: {
      allowDeselect: true,
    },
    events: {
      afterChange: onCatSelected,
    },
  });

  showElement(catsSelect);
})();
