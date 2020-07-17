import './card.scss'

export default class Card {
    constructor(configuration) {
        if (!configuration) return;

        this._loadConfiguration(configuration);
    }

    get element() {
        return this._element;
    }

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
    }

    _loadConfiguration(configuration) {
        this.title = configuration.title;
        this.type = configuration.type;
        this.duration = configuration.duration;
        this.cardinality = configuration.cardinality;
        this.tag = configuration.language;
        this.image = configuration.image;
    }

    _checkConfiguration() {
        if (!this.title) return 'Title is mandatory';

        if (!this.image) return 'Image is mandatory';

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
    
    _createElement() {
        this._element = document.createElement('div');
        this._element.classList.add('card');

        this._element.append(this._createHeader(), this._createContent());
    }

    _createHeader(){
        const headerEl = document.createElement('div');
        headerEl.classList.add('card__header');
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