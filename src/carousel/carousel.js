import './carousel.scss'
import Card from '../card/card';
import PlaceholderCard from '../card/placeholder-card';

/**
 * The options of a carousel
 * 
 * @typedef {Object} CarouselOptions
 * @property {string} title - The title of the carousel
 * @property {string} subtitle - The subtitle of the carousel
 * @property {string} container - The ID of the container of the carousel
 * @property {string} icon - The name of the icon
 */

/**
 * A carousel of images
 */
export default class Carousel {

    /**
     * Get if is the last page
     * 
     * @returns {boolean}
     */
    get isLastPage() {
        return this._allCardsLoaded && (this._page + 1) > this.totalPages;
    }

    /**
     * Get the numeber of pages
     * 
     * @returns {number}
     */
    get totalPages() {
        return Math.ceil(this._cards.length / this._maxDisplayedCards);
    }

    /**
     * Get the options of the carousel
     * 
     * @returns {CarouselOptions}
     */
    get options() {
        return this._options;
    }

    /**
     * The width of the cards
     * 
     * @returns {number}
     * @private
     */
    get _cardWidth() {
        const containerWidth = this._cardsContainer.offsetWidth;
        return (containerWidth - ((this._maxDisplayedCards - 1) * this._CARDS_GUTTER)) / this._maxDisplayedCards;
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
    
        this._element = null;
        this._cardsContainer = null;
        this._nextController = null;
        this._prevController = null;
    
        this._CARD_MIN_WIDTH = 300;
        this._CARDS_GUTTER = 15;

        const validation = this._validateOptions(options);
        if (validation !== true) {
            this._throwError(validation);
            return;
        }

        this._options = options;

        this._init();
    }

    /**
     * Go to the next page
     */
    next() {
        this._next();
    }

    /**
     * Go to the previous page
     */
    previous() {
        this._previous();
    }

    /**
     * Load the next page
     * 
     * @private
     * @async
     */
    async _next() {
        if (!this._allCardsLoaded && this._page === this.totalPages)
            await this._fetchCards(this._maxDisplayedCards, true);
        
        if (this.isLastPage) return;

        this._page++;
        this._loadCurrentPage();
    }

    /**
     * Load the previous page
     * 
     * @private
     */
    _previous() {
        if (this._page === 0) return;

        this._page--;
        this._loadCurrentPage();
    }

    /**
     * Load the current page and render it
     * 
     * @private
     */
    _loadCurrentPage() {
        this._loadCardsForCurrentPage();
        this._renderCurrentPage();
    }

    /**
     * Reload the current page and render it
     * 
     * @private
     * @async
     */
    async _reloadCurrentPage() {
        if ((this._cards.length % this._maxDisplayedCards !== 0) && !this._allCardsLoaded)
            await this._fetchCards(this._maxDisplayedCards - (this._cards.length % this._maxDisplayedCards));

        this._loadCurrentPage();
    }


    /**
     * Get the cards to be rendered from the server
     * 
     * @param {number} chunkSize - The number of placeholders to be rendered
     * @param {boolean} [clearResults] - The results must be cleared or not
     * @private
     * @async
     */
    async _fetchCards(chunkSize, clearResults) {
        this._preloadCards(chunkSize, clearResults);

        const cardsData = await this._options.fetchCards(chunkSize);
        const cards = (cardsData || []).map(card => new Card(card));

        if (!cards.length || cards.length < chunkSize) {
            this._allCardsLoaded = true;
        }

        this._cards.push(...cards);
    }

    /**
     * Load into memory the cards to be rendered
     * 
     * @private
     */
    _loadCardsForCurrentPage() {
        const startIndex = (this._page -1) * this._maxDisplayedCards;
        const endIndex = this._page * this._maxDisplayedCards;

        this._displayedCards = this._cards.slice(startIndex, endIndex);
    }

    /**
     * Render the placeholders for the card in fetching
     * 
     * @param {number} chunkSize - The number of placeholders to be rendered
     * @param {boolean} [clearResults] - The results must be cleared or not
     * @private
     */
    _preloadCards(chunkSize, clearResults) {
        if (clearResults) this._clearRenderedCards();

        let count = chunkSize;
        while (count) {
            this._renderPlaceholder();
            count--;
        }
    }

    /**
     * Render the current page
     * 
     * @private
     */
    _renderCurrentPage() {
        this._clearRenderedCards();

        this._displayedCards.forEach(card => this._renderCard(card));
        this._evaluateControllers();
    }

    /**
     * Render a card
     * 
     * @param {Card} card - The card to be rendered
     * @private
     */
    _renderCard(card) {
        const cardElement = card.render();
        cardElement.style.width = `${this._cardWidth}px`;

        this._cardsContainer.append(cardElement);
    }

    /**
     * Render a placeholder
     * 
     * @private
     */
    _renderPlaceholder() {
        const placeholder = new PlaceholderCard();
        const placeholderElement = placeholder.render();
        placeholderElement.style.width = `${this._cardWidth}px`;

        this._cardsContainer.append(placeholderElement);
    }

    /**
     * Hide and show the controllers
     * 
     * @private
     */
    _evaluateControllers() {
        this._page === 1
            ? this._prevController.classList.add('controller--hidden')
            : this._prevController.classList.remove('controller--hidden');

        this.isLastPage
        ? this._nextController.classList.add('controller--hidden')
        : this._nextController.classList.remove('controller--hidden');
    }

    /**
     * Clear the rendered cards
     * 
     * @private
     */
    _clearRenderedCards() {
        this._cardsContainer.querySelectorAll('.card').forEach(el => el.remove());
    }

    /**
     * Init the carousel with the given options
     * @private
     * @async
     */
    async _init() {
        // load the container from DOM, and check it
        const loaded = this._loadContainer(this._options.container);

        if (!loaded) return;

        // init html templates
        this._initContainer();
        this._initControls();
        this._renderControls();

        // init listeners
        this._initListeners();

        // first data load
        await this._fetchCards(this._maxDisplayedCards);
        this._loadCurrentPage();
    }

    /**
     * Load the container given from the options
     * @private
     * @param {string} container - The ID of the container
     */
    _loadContainer(container) {
        this._element = document.querySelector(`#${container}`);

        if (!this._element) this._throwError('The selected container does not exist');

        return !!this._element;
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
        this._page = this._page > this.totalPages ? this.totalPages : this._page;
        this._reloadCurrentPage();
    }

    /**
     * Calculate the number of displayed cards, based on the container's width.
     * @private
     */
    _calculateCardsDisplayed() {
        const containerWidth = this._element.offsetWidth;

        if (!containerWidth) return;

        this._maxDisplayedCards = Math.floor(containerWidth / (this._CARD_MIN_WIDTH + this._CARDS_GUTTER));
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

    /**
     * Init the container of the carouser
     * 
     * @private
     */
    _initContainer() {
        this._element.classList.add('carousel');

        this._element.append(this._createContainerHeader());

        this._cardsContainer = this._createContainerContent();
        this._element.append(this._cardsContainer);

        this._calculateCardsDisplayed();
    }

    /**
     * Create the header
     * 
     * @returns {HTMLElement}
     * @private
     */
    _createContainerHeader() {
        const headerEl = document.createElement('div');
        headerEl.classList.add('carousel__header');

        if (this._options.icon) {
            const iconEl = document.createElement('i');
            iconEl.classList.add('carousel__icon', 'material-icons-outlined');
            iconEl.append(this._options.icon);

            headerEl.append(iconEl);
        }

        if (this._options.title) {
            const titleEl = document.createElement('a');
            titleEl.classList.add('carousel__title');
            titleEl.append(`${this._options.title}`);

            if (this._options.link) {
                titleEl.setAttribute('href', this._options.link);
                titleEl.setAttribute('target', '_blank');
            }                

            const chevron = this._createChevron(['carousel__title-icon', 'material-icons-outlined']);
            titleEl.append(chevron);

            headerEl.append(titleEl);
        }

        if (this._options.subtitle) {
            const subtitleEl = document.createElement('span');
            subtitleEl.classList.add('carousel__subtitle');
            subtitleEl.append(this._options.subtitle);

            headerEl.append(subtitleEl);            
        }

        return headerEl;
    }

    /**
     * Create the container for the cards
     * 
     * @returns {HTMLElement}
     * @private
     */
    _createContainerContent() {
        const contentEl = document.createElement('div');
        contentEl.classList.add('carousel__content');

        return contentEl;
    }

    /**
     * Init the controls of the carousel
     * 
     * @private
     */
    _initControls() {
        this._nextController = document.createElement('div');
        this._nextController.classList.add('controller', 'next-controller');
        this._attachClickToController(this._nextController, () => this._next());
        
        this._prevController = document.createElement('div');
        this._prevController.classList.add('controller', 'prev-controller');
        this._attachClickToController(this._prevController, () => this._previous());

        const chevron = this._createChevron(['controller__icon', 'material-icons-outlined']);

        this._nextController.append(chevron.cloneNode(true));
        this._prevController.append(chevron.cloneNode(true));

        chevron.remove();
    }

    /**
     * Render the controls of the carousel
     * 
     * @private
     */
    _renderControls() {
        this._cardsContainer.append(this._prevController);
        this._cardsContainer.append(this._nextController);
    }

    /**
     * Attach the click listener to the controls
     * 
     * @private
     */
    _attachClickToController(controller, fn) {
        // fn.bind(this);

        controller.addEventListener('click', (event) => {
            event.preventDefault;
            fn();
        })
    }

    /**
     * Create a chevron icon
     * 
     * @returns {HTMLElement}
     * @private
     */
    _createChevron(classList) {
        const chevron = document.createElement('i');
        chevron.classList.add(...classList);
        chevron.append('keyboard_arrow_right');

        return chevron;
    }
}