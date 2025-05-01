import './styles/style.scss';
import { setupMenuToggle } from './all';

setupMenuToggle();

interface Course {
    id: number;
    title: string;
    image: string;
    description: string;
    price: number;
    rating: number;
    reviews: number;
    duration: string;
    category: string;
    language: string;
    difficulty: string;
}

let courses: Course[] = [];
let filteredCourses: Course[] = [];
let debounceTimeout: number;
let currentPage = 1;
const itemsPerPage = 10;

async function fetchCourses(): Promise<void> {
    try {
        const response = await fetch('./data/courses.json');
        courses = await response.json();
        filteredCourses = [...courses];
        filteredCourses = sortCourses(filteredCourses);
        initializeFilters();
        renderCourses();
        updatePagination();
        document.querySelector('.sort-options')!.addEventListener('change', applyFilters);

        document.querySelector('.search-input')!.addEventListener('input', () => {
            clearTimeout(debounceTimeout);
            debounceTimeout = setTimeout(() => {
                applyFilters();
            }, 500);
        });

    } catch (error) {
        console.error('Error fetching courses:', error);
    }
}

function initializeFilters() {
    generateCheckboxes('.category-filter', 'category');
    generateCheckboxes('.language-filter', 'language');
    generateCheckboxes('.difficulty-filter', 'difficulty');
    generatePriceFilter('.price-filter');
    generateDurationFilter('.duration-filter');
}

function generateCheckboxes(selector: string, key: keyof Course) {
    const container = document.querySelector(selector) as HTMLElement;

    const values = [...new Set(courses.map(course => course[key]))];
    values.forEach((value) => {
        const label = document.createElement("label");
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.id = value.toString();
        checkbox.name = key;
        checkbox.value = value.toString();
        label.appendChild(checkbox);
        label.append(` ${value}`);
        container.appendChild(label);
    });
    container.addEventListener('change', applyFilters);
}

function generatePriceFilter(selector: string) {
    const container = document.querySelector(selector) as HTMLElement;

    const prices = courses.map(course => course.price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);

    const wrapper = document.createElement("div");
    wrapper.className = "selected_price";
    const rangeInput = document.createElement("input");
    rangeInput.type = "range";
    rangeInput.id = "price-range";
    rangeInput.min = minPrice.toString();
    rangeInput.max = maxPrice.toString();
    rangeInput.value = maxPrice.toString();
    rangeInput.step = "1";
    const label = document.createElement("label");
    const span = document.createElement("span");
    span.id = "price-value";
    span.textContent = maxPrice.toString();
    label.appendChild(span);

    wrapper.appendChild(rangeInput);
    wrapper.appendChild(label);
    container.appendChild(wrapper);

    rangeInput.addEventListener("input", () => {
        span.textContent = rangeInput.value;
        applyFilters();
    });
}


function generateDurationFilter(selector: string) {
    const container = document.querySelector(selector) as HTMLElement;

    const durations = ['<3h', '3-6h', '6-12h', '>12h'];
    durations.forEach(duration => {
        const label = document.createElement('label');

        const input = document.createElement('input');
        input.type = 'checkbox';
        input.name = 'duration';
        input.value = duration;

        label.appendChild(input);
        label.append(` ${duration}`);
        container.appendChild(label);
    });

    container.addEventListener('change', applyFilters);
}

function sortCourses(coursesToSort: Course[]): Course[] {
    const sortOption = (document.querySelector('.sort-options') as HTMLSelectElement).value;

    return coursesToSort.sort((a, b) => {
        switch (sortOption) {
            case "alphabetical-asc":
                return a.title.localeCompare(b.title);
            case "alphabetical-desc":
                return b.title.localeCompare(a.title);
            case "price-asc":
                return a.price - b.price;
            case "price-desc":
                return b.price - a.price;
            case "rating-asc":
                return a.rating - b.rating;
            case "rating-desc":
                return b.rating - a.rating;
            default:
                return 0;
        }
    });
}

function applyFilters() {
    const selectedCategories = getSelectedValues('category');
    const selectedLanguages = getSelectedValues('language');
    const selectedDifficulties = getSelectedValues('difficulty');
    const selectedDurations = getSelectedValues('duration');
    const maxPrice = parseFloat((document.querySelector('#price-range') as HTMLInputElement).value);
    const searchQuery = (document.querySelector('.search-input') as HTMLInputElement).value.toLowerCase();

    filteredCourses = courses.filter(course =>
        (selectedCategories.length === 0 || selectedCategories.includes(course.category)) &&
        (selectedLanguages.length === 0 || selectedLanguages.includes(course.language)) &&
        (selectedDifficulties.length === 0 || selectedDifficulties.includes(course.difficulty)) &&
        (course.price <= maxPrice) &&
        (selectedDurations.length === 0 || selectedDurations.some(d => checkDurationMatch(d, course.duration))) &&
        (course.title.toLowerCase().includes(searchQuery))
    );

    currentPage = 1;
    filteredCourses = sortCourses(filteredCourses);
    renderCourses();
    updatePagination();
}

function getSelectedValues(filterName: string): string[] {
    return Array.from(document.querySelectorAll(`input[name="${filterName}"]:checked`))
        .map(input => (input as HTMLInputElement).value);
}

function checkDurationMatch(filter: string, courseDuration: string): boolean {
    const durationParts = courseDuration.match(/(\d+)h\s*(\d*)m?/);
    if (!durationParts) return false;

    const hours = parseInt(durationParts[1]) || 0;
    const minutes = parseInt(durationParts[2]) || 0;
    const courseDurationInMinutes = hours * 60 + minutes;
    const durationRanges: { [key: string]: [number, number] } = {
        "<3h": [0, 180],
        "3-6h": [180, 360],
        "6-12h": [360, 720],
        ">12h": [720, Infinity],
    };

    const [minMinutes, maxMinutes] = durationRanges[filter];
    return courseDurationInMinutes >= minMinutes && courseDurationInMinutes < maxMinutes;
}

function renderCourses() {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const coursesToShow = filteredCourses.slice(startIndex, endIndex);

    const container = document.getElementById('courses-container')!;
    container.innerHTML = '';

    coursesToShow.forEach(course => {
        const courseCard = new CourseCard(course);
        container.appendChild(courseCard.getCardElement());
    });
}

function updatePagination() {
    const totalPages = Math.ceil(filteredCourses.length / itemsPerPage);
    const paginationContainer = document.querySelector('.pagination-container')!;
    paginationContainer.innerHTML = '';
    const container = document.getElementById('courses-container')!;

    for (let i = 1; i <= totalPages; i++) {
        const button = document.createElement('button');
        button.textContent = `${i}`;
        button.classList.toggle('active', i === currentPage);
        button.addEventListener('click', () => {
            currentPage = i;
            renderCourses();
            updatePagination();
            container.scrollIntoView({ behavior: "smooth", block: "start" });
        });
        paginationContainer.appendChild(button);
    }
}

class CourseCard {
    private course: Course;
    private cardElement: HTMLElement;

    constructor(course: Course) {
        this.course = course;
        this.cardElement = this.createCard();
    }


    private createCard(): HTMLElement {
        const courseCard = document.createElement('div');
        courseCard.classList.add('course-card');

        const div_img = document.createElement('div');
        div_img.classList.add('course-card-image');
        const img = document.createElement('img');
        img.src = this.course.image;
        img.alt = this.course.title;
        div_img.appendChild(img);
        courseCard.appendChild(div_img);

        const cardContent = document.createElement('div');
        cardContent.classList.add('course-card-content');

        const ratingWrapper = document.createElement('div');
        ratingWrapper.classList.add('course-rating-wrapper');

        const ratingDiv = document.createElement('div');
        ratingDiv.classList.add('rating');
        const starIcon = document.createElement('span');
        starIcon.classList.add('material-icons');
        starIcon.textContent = 'star';
        const ratingText = document.createElement('span');
        ratingText.classList.add('rating-text');
        ratingText.textContent = `${this.course.rating} (${this.course.reviews} reviews)`;
        ratingDiv.append(starIcon, ratingText);

        const price = document.createElement('div');
        price.classList.add('price');
        price.textContent = `$${this.course.price}`;

        ratingWrapper.append(ratingDiv, price);
        cardContent.appendChild(ratingWrapper);

        const title = document.createElement('h3');
        title.textContent = this.course.title;
        cardContent.appendChild(title);

        const detailsWrapper = document.createElement('div');
        detailsWrapper.classList.add('course-details-wrapper');

        const category = document.createElement('p');
        const categoryIcon = document.createElement('span');
        categoryIcon.classList.add('material-icons');
        categoryIcon.textContent = 'category';
        category.append(categoryIcon, document.createTextNode(` ${this.course.category}`));
        detailsWrapper.appendChild(category);

        const duration = document.createElement('p');
        const durationIcon = document.createElement('span');
        durationIcon.classList.add('material-icons');
        durationIcon.textContent = 'schedule';
        duration.append(durationIcon, document.createTextNode(` ${this.course.duration}`));
        detailsWrapper.appendChild(duration);

        const language = document.createElement('p');
        const languageIcon = document.createElement('span');
        languageIcon.classList.add('material-icons');
        languageIcon.textContent = 'language';
        language.append(languageIcon, document.createTextNode(` ${this.course.language}`));
        detailsWrapper.appendChild(language);

        const difficulty = document.createElement('p');
        const difficultyIcon = document.createElement('span');
        difficultyIcon.classList.add('material-icons');
        difficultyIcon.textContent = 'school';
        difficulty.append(difficultyIcon, document.createTextNode(` ${this.course.difficulty}`));
        detailsWrapper.appendChild(difficulty);

        cardContent.appendChild(detailsWrapper);

        const description = document.createElement('p');
        description.classList.add('course-description');
        description.textContent = this.course.description;
        cardContent.appendChild(description);

        const enrollButton = document.createElement('button');
        enrollButton.classList.add('enroll-button');
        enrollButton.textContent = 'Enroll';
        cardContent.appendChild(enrollButton);

        courseCard.appendChild(cardContent);
        return courseCard;
    }
    public getCardElement(): HTMLElement {
        return this.cardElement;
    }
}

fetchCourses();


const filterToggleBtn = document.querySelector(".mobile-filter") as HTMLButtonElement;
const filtersAside = document.querySelector(".filters") as HTMLElement;
const closeBtn = document.querySelector(".close-filters") as HTMLButtonElement;

filterToggleBtn.addEventListener("click", () => {
    filtersAside.classList.add("active");
    filterToggleBtn.setAttribute("aria-expanded", "true");
});

closeBtn.addEventListener("click", () => {
    filtersAside.classList.remove("active");
    filterToggleBtn.setAttribute("aria-expanded", "false");
});