import Card from "./card";

/**
 * A placeholder card
 * @class
 * @extends Card
 */
export default class PlaceholderCard extends Card {
    /**
     * Instantiate a placeholder card
     */
    constructor() {
        const configuration = {
            title: '',
            image: '',
            tag: ''
        };
        super(configuration);
    }

    /**
     * Create the HTML node of a placeholder card
     * @private
     */
    _createElement() {
        super._createElement();

        this._element.classList.add('card--placeholder');
    }
}