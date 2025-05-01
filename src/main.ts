import './styles/style.scss';
import { setupMenuToggle } from './all';

setupMenuToggle();

async function loadCourses() {
  const response = await fetch('/data/courses.json');
  const courses = await response.json();
  return courses;
}

const courses = await loadCourses();

interface Course {
  title: string;
  description: string;
  image: string;
  price: number;
  rating: number;
  duration: string;
  reviews: number;
}

class SliderCard {
  title: string;
  description: string;
  image: string;
  price: number;
  rating: number;
  duration: string;
  reviews: number;

  constructor(course: Course) {
      this.title = course.title;
      this.description = course.description;
      this.image = course.image;
      this.price = course.price;
      this.rating = course.rating;
      this.duration = course.duration;
      this.reviews = course.reviews;
  }

  render(): HTMLElement {
      const card = document.createElement('div');
      card.classList.add('slider-card');

      const img_div = document.createElement('div');
      img_div.classList.add('slider-card-image')
      const image = document.createElement('img');
      image.src = this.image;
      image.alt = this.title;
      img_div.appendChild(image);

      const cardContent = document.createElement('div');
      cardContent.classList.add('slider-card-content');

      const rating = document.createElement('div');
      rating.classList.add('slider-card-rating');
      const icon = document.createElement('i');
      icon.classList.add('material-icons');
      icon.textContent = 'star';
      const text = document.createElement('p');
      text.textContent = `${this.rating} (${this.reviews} reviews)`;
      rating.appendChild(icon);
      rating.appendChild(text);

      const title = document.createElement('h3');
      title.classList.add('slider-card-title');
      title.textContent = this.title;

      const description = document.createElement('p');
      description.classList.add('slider-card-description');
      description.textContent = this.description;

      const footer = document.createElement('div');
      footer.classList.add('slider-card-footer');
      const price = document.createElement('span');
      price.classList.add('slider-card-price');
      price.textContent = `$${this.price.toFixed(2)}`;
      const duration = document.createElement('span');
      duration.classList.add('slider-card-duration');
      duration.textContent = `${this.duration}`;
      footer.appendChild(price);
      footer.appendChild(duration);

      cardContent.appendChild(rating);
      cardContent.appendChild(title);
      cardContent.appendChild(description);
      cardContent.appendChild(footer);
      card.appendChild(img_div);
      card.appendChild(cardContent);
      return card;
  }
}

const sliderContainer = document.querySelector('.slider-container');

if (sliderContainer) {
const randomCourses = getRandomCourses(courses, 3);

randomCourses.forEach(course => {
  const sliderCard = new SliderCard(course);
  sliderContainer.appendChild(sliderCard.render());
});
}

function getRandomCourses(courses: Course[], num: number): Course[] {
const shuffled = [...courses].sort(() => 0.5 - Math.random());
return shuffled.slice(0, num);
}