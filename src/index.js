import './styles/styles.scss'

import Carousel from './carousel/carousel'
import faker from 'faker';

const carousel1Options = {
    container: 'my-carousel1',
    title: 'Fresh and just uploaded content',
    subtitle: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
    icon: 'face',
    link: 'https://www.google.it/',
    fetchCards: (chunkSize) => {
        const maxElement = faker.random.number({max: chunkSize, min: 2});

        const types = ['video', 'elearning', 'learning_plan', 'playlist'];
        const cardinality = ['single', 'collection'];

        return Array(maxElement).fill('').map(el => ({
            image: 'https://picsum.photos/400/200',
            type: types[faker.random.number(3)],
            duration: faker.random.number({max: 14400, min: 1800}),
            title: faker.lorem.sentence(faker.random.number(15)),
            cardinality: faker.random.boolean ? 'single' : 'collection',
            language: faker.random.word()
        }));
    }
}

const carousel1 = new Carousel(carousel1Options);