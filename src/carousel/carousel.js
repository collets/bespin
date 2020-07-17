import './carousel.scss'
import Card from '../card/card';

/**
 * A carousel of images
 */
export default class Carousel {

    get isLastPage() {
        return this._allCardsLoaded && (this._page + 1) > this.totalPages;
    }

    get totalPages() {
        return Math.ceil(this._cards.length / this._maxDisplayedCards);
    }

    get options() {
        return this._options;
    }

    /**
     * Instantiate a carousel
     * @param {CarouselOptions} options - The configutation options of the carousel
     */
    constructor(options) {
        this._options = null;
        this._cards = [];
        this._displayedCards = [];
        
        this._page = 1;
        this._maxDisplayedCards = 6;
        this._allCardsLoaded = false;
    
        this._containerElement = null;
    
        this._CARD_MIN_WIDTH = 300;

        const validation = this._validateOptions(options);
        if (validation !== true) {
            this._throwError(validation);
            return;
        }

        this._options = options;

        this._init();
    }

    async _next() {
        if (!this._allCardsLoaded && this._page === this.totalPages) await this._fetchCards();
        
        if (this.isLastPage) return;

        this._page++;
        this._loadCurrentPage();
        this._renderCurrentPage();
    }

    _previous() {
        if (this._page === 0) return;

        this._page--;
        this._loadCurrentPage();
        this._renderCurrentPage();
    }

    async _fetchCards() {
        const cardsData = await this._options.fetchCards(this._maxDisplayedCards);
        const cards = (cardsData || []).map(card => new Card(card));

        if (!cards.length || cards.length < this._maxDisplayedCards) {
            this._allCardsLoaded = true;
        }

        this._cards.push(...cards);
    }

    _loadCurrentPage() {
        const startIndex = (this._page -1) * this._maxDisplayedCards;
        const endIndex = this._page * this._maxDisplayedCards;

        this._displayedCards = this._cards.slice(startIndex, endIndex);
    }

    _preloadCurrentPage() {

    }

    _renderCurrentPage() {
        this._clearRenderedCards();

        this._displayedCards.forEach(card => this._renderCard(card));
    }

    _renderCard(card) {
        card.render(this._containerElement);
    }

    _renderPlaceholder() {
        
    }

    _clearRenderedCards() {
        while (this._containerElement.firstChild) {
            this._containerElement.lastChild.remove();
        }
    }

    /**
     * Init the carousel with the given options
     * @private
     */
    async _init() {
        const loaded = this._loadContainer(this._options.container);

        if (!loaded) return;

        this._initListeners();

        await this._fetchCards();
        this._loadCurrentPage();
        this._renderCurrentPage();
    }

    /**
     * Load the container given from the options
     * @private
     * @param {string} container - The ID of the container
     */
    _loadContainer(container) {
        this._containerElement = document.querySelector(`#${container}`);

        if (!this._containerElement) this._throwError('The selected container does not exist');

        this._containerElement.classList.add('carousel');

        return !!this._containerElement;
    }

    /**
     * Init the carousel's listeners
     * @private
     */
    _initListeners() {
        this._initResizeListener();
    }

    /**
     * Init the resize listener
     * @private
     */
    _initResizeListener() {
        window.addEventListener('resize', () => this._onResize())
    }

    /**
     * Listener of the window's resize event
     * @private
     */
    _onResize() {
        this._calculateCardsDisplayed();
    }

    /**
     * Calculate the number of displayed cards, based on the container's width.
     * @private
     */
    _calculateCardsDisplayed() {
        const containerWidth = this._containerElement.offsetWidth;

        if (!containerWidth) return;

        this._maxDisplayedCards = Math.round(containerWidth / this._CARD_MIN_WIDTH);
    }

    /**
     * Validate a options's object, throw an error on missing data
     * @private
     * @param {Options} options - The options
     */
    _validateOptions(options) {
        if (!options) return 'Options is missing';

        if (!options.container) return 'Container is missing from options';

        if (!options.fetchCards || typeof options.fetchCards !== 'function') return 'Option fetchCards is mandatory and must be a function'

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
}