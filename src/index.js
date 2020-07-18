import './styles/styles.scss'

import Carousel from './carousel/carousel'

// Helper function to create random card in random number, based on a chunksize
// Also add a random delay to simulate a server
async function fetchCards(chunkSize) {
    const delayFactor =  5 + Math.round(Math.random() * 25);

    await new Promise(resolve => setTimeout(resolve, delayFactor * 100));

    const maxElement = 2 + Math.round(Math.random() * (chunkSize - 2));

    console.log(maxElement);

    const types = ['video', 'elearning', 'learning_plan', 'playlist'];
    const cardinality = ['single', 'collection'];

    return Array(maxElement).fill('').map(el => ({
        image: 'https://picsum.photos/400/200',
        type: types[Math.round(Math.random() * 3)],
        duration: 1800 + Math.round(Math.random() * 12600),
        title: 'Fresh and just uploaded content',
        cardinality: Math.random() >= 0.5 ? 'single' : 'collection',
        language: Math.random() >= 0.5 ? 'English' : null
    }));
}

// Options of first carousel
const carousel1Options = {
    container: 'my-carousel1',
    title: 'Fresh and just uploaded content',
    subtitle: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
    icon: 'face',
    link: 'https://www.google.it/',
    fetchCards: async (chunkSize) => {
        return fetchCards(chunkSize);
    }
}

const carousel1 = new Carousel(carousel1Options);

// Options of second carousel
const carousel2Options = {
    container: 'my-carousel2',
    title: 'Another carousel',
    subtitle: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
    icon: 'two_wheeler',
    link: 'https://www.google.it/',
    fetchCards: async (chunkSize) => {
        return fetchCards(chunkSize);
    }
}

const carousel2 = new Carousel(carousel2Options);