import './card.scss'

/**
 * The type of a carousel card
 * @typedef CardType
 * @enum {string}
 * @property {string} elearning
 * @property {string} video
 * @property {string} learning_plan
 * @property {string} playlist
 */

/**
 * The cardinality of a carousel card
 * @typedef CardCardinality
 * @enum {string}
 * @property {string} single
 * @property {string} collection
 */

/**
 * The configuration of a carousel card
 * @typedef {Object} CardConfiguration
 * @property {string} title - The title of the card
 * @property {CardType} type - The type of the card
 * @property {number} duration - The title of the card
 * @property {CardCardinality} cardinality - The title of the card
 * @property {string} tag - The title of the card
 * @property {string} image - The title of the card
 */

/**
 * A carousel card
 * @class
 */
export default class Card {
    /**
     * Instantiate a carousel card with a configuration
     * @param {CardConfiguration}
     */
    constructor(configuration) {
        if (!configuration) return;

        this._loadConfiguration(configuration);
    }

    /**
     * Get the card element
     * @returns {HTMLElement}
     */
    get element() {
        return this._element;
    }

    /**
     * Create the element of the card and return it, optionally attach it to a given node
     * 
     * @param {HTMLElement} [parent] - The parent which must be attached the card's element to
     * @returns {HTMLElement}
     */
    render(parent) {
        const validation = this._checkConfiguration();
        if (validation !== true) {
            this._throwError(validation);
            return;
        }

        this._createElement();

        if (parent) {
            parent.append(this._element);
        }
        return this._element;
    }

    /**
     * Load the configuration
     * 
     * @private
     * @param {CardConfiguration} configuration - The configuration of the card
     */
    _loadConfiguration(configuration) {
        /** @type {string} */
        this.title = configuration.title;
        /** @type {CardType} */
        this.type = configuration.type;
        /** @type {string} */
        this.duration = configuration.duration;
        /** @type {CardCardinality} */
        this.cardinality = configuration.cardinality;
        /** @type {string} */
        this.tag = configuration.language;
        /** @type {string} */
        this.image = configuration.image;
    }

    /**
     * Check the configuration
     * @private
     */
    _checkConfiguration() {
        if (this.title == null) return 'Title is mandatory';

        if (this.image == null) return 'Image is mandatory';

        return true;
    }

    /**
     * Throw a generic error.
     * This simple implementation throw a console error
     * @private
     * @param {string} message - The error message
     */
    _throwError(message) {
        console.error(message);
    }
    
    /**
     * Create the element of the card
     * 
     * @private
     */
    _createElement() {
        this._element = document.createElement('div');
        this._element.classList.add('card');
        if (this.cardinality === 'collection')
            this._element.classList.add('card--collection');

        this._element.append(this._createHeader(), this._createContent());
    }
    
    /**
     * Create the element of the header of the card
     * 
     * @returns {HTMLElement}
     * @private
     */
    _createHeader(){
        const headerEl = document.createElement('div');
        headerEl.classList.add('card__header');

        if (this.image)
            headerEl.style.background = `url(${this.image})`;

        if (this.type) {
            const formattedType = this.type.replace('_', ' ');
            const typeEl = document.createElement('span');
            typeEl.classList.add('card__information', 'card__type');
            typeEl.append(formattedType);

            headerEl.append(typeEl);
        }

        if (this.duration) {
            const hours = Math.floor(this.duration / 3600);
            const minutes = Math.ceil(this.duration / 60) % 60;

            const durationEl = document.createElement('span');
            durationEl.classList.add('card__information', 'card__duration');
            durationEl.append(`${hours}h ${minutes}m`);

            headerEl.append(durationEl);
        }

        return headerEl;
    }
    
    /**
     * Create the element of the content of the card
     * 
     * @returns {HTMLElement}
     * @private
     */
    _createContent() {
        const contentEl = document.createElement('div');
        contentEl.classList.add('card__content');
        
        const titleEl = document.createElement('h4');
        titleEl.classList.add('card__title');
        titleEl.append(this.title);

        contentEl.append(titleEl);

        if (this.tag) {
            const tagEl = document.createElement('span');
            tagEl.classList.add('card__tag');
            tagEl.append(this.tag);

            contentEl.append(tagEl);
        }

        return contentEl;
    }
}