import type { Locale, PlanetId } from './avastar';
const content = {
  learn: {
    fa: [
      [
        'جهت‌یابی',
        'آسمان را بخوانید',
        'شناخت جهت‌ها و حرکت ظاهری آسمان، اولین قدم برای پیدا کردن اجرام است.',
      ],
      [
        'حرکت آسمان',
        'مسیر نور را دنبال کنید',
        'حرکت زمین و مسیر ظاهری خورشید را در کنار هم بشناسید.',
      ],
      [
        'صورت‌های فلکی',
        'از چند ستاره، یک نشانه',
        'با الگوهای آشنا، راه خود را میان ستاره‌ها پیدا کنید.',
      ],
    ],
    en: [
      [
        'Orientation',
        'Read the sky',
        'Start with directions and apparent motion to find your bearings.',
      ],
      [
        'Sky motion',
        'Follow the light',
        'Explore how Earth’s motion relates to the apparent path of the Sun.',
      ],
      [
        'Constellations',
        'Find a familiar pattern',
        'Use recognizable star patterns to navigate the night.',
      ],
    ],
  },
  explore: {
    fa: [
      [
        'رصد',
        'یک شب دور از شهر',
        'آسمان تاریک، فرصت دیدن جزئیاتی است که در روشنایی شهر پنهان می‌مانند.',
      ],
      [
        'خانواده',
        'کشفی برای همه',
        'تجربه‌ای متناسب با سن و کنجکاوی همراهان، با راهنمایی قدم‌به‌قدم.',
      ],
      [
        'رویداد',
        'در کنار دیگر علاقه‌مندان',
        'رصد و گفت‌وگو را در یک برنامهٔ علمی جمعی تجربه کنید.',
      ],
    ],
    en: [
      [
        'Observing',
        'Beyond the city lights',
        'A darker sky reveals details that city lights keep hidden.',
      ],
      [
        'Families',
        'Discovery for everyone',
        'A guided experience shaped around the ages and curiosity of your group.',
      ],
      [
        'Events',
        'Meet under the stars',
        'Bring observing and conversation together in a shared science experience.',
      ],
    ],
  },
  shop: {
    fa: [
      [
        'اپتیک',
        'نور بیشتر، جزئیات بیشتر',
        'دهانه و کیفیت اپتیک تعیین می‌کنند چه مقدار نور و جزئیات در دسترس شما باشد.',
      ],
      [
        'مقر',
        'پایهٔ یک تصویر آرام',
        'پایداری، حمل‌ونقل و دنبال‌کردن جرم آسمانی را در انتخاب مقر در نظر بگیرید.',
      ],
      [
        'چشمی',
        'زاویهٔ نگاه شما',
        'بزرگ‌نمایی، میدان دید و راحتی مشاهده به انتخاب چشمی وابسته‌اند.',
      ],
    ],
    en: [
      [
        'Optics',
        'Collect the light',
        'Aperture and optical quality shape the light and detail you can observe.',
      ],
      [
        'Mount',
        'A steady foundation',
        'Balance stability, transport and tracking when choosing a mount.',
      ],
      [
        'Eyepiece',
        'Choose your view',
        'Magnification, field of view and viewing comfort depend on the eyepiece.',
      ],
    ],
  },
  club: {
    fa: [
      [
        'یادگیری',
        'کنجکاوی را ادامه دهید',
        'پرسش‌ها و آموخته‌هایتان را به گفت‌وگویی ماندگار پیوند بزنید.',
      ],
      [
        'رصد',
        'تجربه را به اشتراک بگذارید',
        'از تجربهٔ دیگران بیاموزید و روایت رصد خود را همراه جمع کنید.',
      ],
      [
        'همراهی',
        'مسیر خودتان، کنار دیگران',
        'میان یادگیری، تجربه و انتخاب ابزار، ارتباط خود را با جامعه حفظ کنید.',
      ],
    ],
    en: [
      [
        'Learning',
        'Keep curiosity alive',
        'Turn questions and discoveries into an ongoing conversation.',
      ],
      [
        'Observing',
        'Share the experience',
        'Learn from others and contribute your own observing stories.',
      ],
      [
        'Belonging',
        'Your path, shared',
        'Stay connected as your learning, observing and equipment needs evolve.',
      ],
    ],
  },
} as const;
export const chapterContent = (id: PlanetId, locale: Locale) => content[id][locale];
