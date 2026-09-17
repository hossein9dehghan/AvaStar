export type Locale = 'fa' | 'en';
export type PlanetId = 'learn' | 'explore' | 'shop' | 'club';
export { siteOrigin as origin } from '@avastar/config/urls';
export const planetIds: PlanetId[] = ['learn', 'explore', 'shop', 'club'];
export const planets = {
  learn: {
    color: '#2D56C8',
    number: '01',
    en: {
      name: 'Learn',
      eyebrow: 'THE FIRST SPARK',
      title: 'Every discovery\nbegins with a question.',
      description:
        'Find your bearings in the night sky. Build your knowledge, one discovery at a time.',
      cta: 'Enter the school',
      features: ['Astronomy school', 'Learning guides', 'Course guidance'],
      detail:
        'Whether you are looking up for the first time or ready to explore further, start with a learning path that fits your experience.',
      items: [
        ['A place to start', 'Learn the language of the sky and find a comfortable first step.'],
        [
          'Learn, then observe',
          'Connect what you learn with the experience of looking through a telescope.',
        ],
        [
          'Choose your course',
          'Tell us about your interests and experience to request course guidance.',
        ],
      ],
      note: 'Course names, dates and enrollment details will appear when confirmed.',
    },
    fa: {
      name: 'آموزش',
      eyebrow: 'اولین جرقهٔ کشف',
      title: 'هر کشف بزرگی،\nبا یک سؤال شروع می‌شود.',
      description:
        'زبان آسمان را یاد بگیرید. از اولین صورت فلکی تا درک شگفتی‌های کیهان، قدم‌به‌قدم همراه شما هستیم.',
      cta: 'ورود به مدرسه نجوم',
      features: ['مدرسه نجوم', 'راهنمای یادگیری', 'مشاوره انتخاب دوره'],
      detail:
        'چه اولین بار باشد که به آسمان نگاه می‌کنید، چه بخواهید عمیق‌تر یاد بگیرید؛ مسیر آموزش را متناسب با تجربه و علاقه‌تان پیدا کنید.',
      items: [
        ['یک شروع روشن', 'با زبان آسمان آشنا شوید و اولین قدم مناسب خود را پیدا کنید.'],
        ['از یادگیری تا رصد', 'دانسته‌هایتان را به تجربه دیدن آسمان از پشت تلسکوپ پیوند بزنید.'],
        [
          'انتخاب آگاهانه دوره',
          'برای راهنمایی انتخاب دوره، علاقه‌مندی و سطح تجربه‌تان را با ما در میان بگذارید.',
        ],
      ],
      note: 'نام دوره‌ها، زمان برگزاری و شرایط ثبت‌نام پس از تأیید منتشر می‌شوند.',
    },
  },
  explore: {
    color: '#F7751D',
    number: '02',
    en: {
      name: 'Explore',
      eyebrow: 'BEYOND THE CITY LIGHTS',
      title: 'Some wonders\nhave to be experienced.',
      description:
        'Leave the everyday behind. Discover observing trips, scientific events and shared nights under the stars.',
      cta: 'Explore the experiences',
      features: ['Observing trips', 'Scientific events', 'Family experiences'],
      detail:
        'Discover the possibilities: city observing, desert nights, astronomy events and experiences for families, schools and organizations.',
      items: [
        ['Under a darker sky', 'Explore the idea of an observing trip beyond the city lights.'],
        [
          'Discovery, together',
          'Find the right kind of experience for your family, school or group.',
        ],
        ['Events with a purpose', 'Get to know astronomy gatherings, science tours and Star Cup.'],
      ],
      note: 'Upcoming programs, dates, capacities and booking terms will be published once confirmed.',
    },
    fa: {
      name: 'کاوش',
      eyebrow: 'دورتر از روشنایی شهر',
      title: 'بعضی شگفتی‌ها را\nباید زندگی کرد.',
      description:
        'از روزمرگی فاصله بگیرید؛ در گشت‌های رصدی، رویدادهای علمی و شب‌های پرستاره، کیهان را از نزدیک تجربه کنید.',
      cta: 'کشف تجربه‌های رصدی',
      features: ['گشت‌های رصدی', 'رویدادهای علمی', 'تجربه‌های خانوادگی'],
      detail:
        'از رصد شهری و شب‌های کویر تا رویدادهای نجومی و برنامه‌های خانواده، مدرسه و سازمان؛ با مسیرهای تجربه آسمان آشنا شوید.',
      items: [
        ['زیر آسمانی تاریک‌تر', 'با تجربه گشت رصدی دور از روشنایی شهر آشنا شوید.'],
        ['کشف در کنار هم', 'نوع تجربه مناسب خانواده، مدرسه یا گروه خود را پیدا کنید.'],
        ['گردهمایی برای کشف', 'گشت‌های علمی، رویدادهای مناسبتی و استارکاپ را بشناسید.'],
      ],
      note: 'برنامه‌ها، تاریخ، ظرفیت و شرایط رزرو پس از نهایی‌شدن منتشر می‌شوند.',
    },
  },
  shop: {
    color: '#2D56C8',
    number: '03',
    en: {
      name: 'Equipment',
      eyebrow: 'A CLOSER LOOK',
      title: 'Your window\ninto the universe.',
      description:
        'The right telescope starts with the right advice. Find tools that fit your curiosity, experience and observing life.',
      cta: 'Discover your equipment path',
      features: ['Telescopes & accessories', 'Buying advice', 'Setup & support'],
      detail:
        'Choosing equipment is part of your astronomy journey. Begin with how and where you want to observe, then explore the tools that fit.',
      items: [
        [
          'Choose with confidence',
          'Consider your observing location, transport, experience and budget.',
        ],
        [
          'More than a telescope',
          'Discover the role of mounts, eyepieces and practical accessories.',
        ],
        ['Keep exploring', 'Find guidance on setup, learning and the next steps after purchase.'],
      ],
      note: 'Confirmed products, availability, prices and service terms will be added to the catalog.',
    },
    fa: {
      name: 'تجهیزات',
      eyebrow: 'یک نگاه نزدیک‌تر',
      title: 'پنجرهٔ شما،\nرو به بی‌نهایت.',
      description:
        'انتخاب تلسکوپ مناسب با یک مشاوره درست شروع می‌شود. ابزاری پیدا کنید که با علاقه، تجربه و سبک رصد شما همراه باشد.',
      cta: 'کشف مسیر انتخاب ابزار',
      features: ['تلسکوپ و تجهیزات', 'مشاوره خرید', 'راه‌اندازی و پشتیبانی'],
      detail:
        'انتخاب ابزار بخشی از مسیر نجومی شماست. ابتدا ببینید کجا و چگونه می‌خواهید رصد کنید، سپس ابزار مناسب را بشناسید.',
      items: [
        ['انتخاب با اطمینان', 'محل رصد، حمل‌ونقل، تجربه و بودجه خود را کنار هم در نظر بگیرید.'],
        ['فراتر از تلسکوپ', 'با نقش مقر، چشمی و لوازم کاربردی رصد آشنا شوید.'],
        [
          'ادامه مسیر بعد از خرید',
          'راهنمای راه‌اندازی، آموزش و قدم‌های بعد از انتخاب ابزار را پیدا کنید.',
        ],
      ],
      note: 'محصولات، موجودی، قیمت و شرایط خدمات پس از تأیید به فهرست اضافه می‌شوند.',
    },
  },
  club: {
    color: '#172B64',
    number: '04',
    en: {
      name: 'Club',
      eyebrow: 'A SHARED UNIVERSE',
      title: 'Curiosity is better\nwhen shared.',
      description:
        'Find your people among the stars. Keep learning, exchange experiences and be part of the Avastar community.',
      cta: 'Get to know the club',
      features: ['Explorer community', 'Shared experiences', 'Your astronomy journey'],
      detail:
        'A lasting interest grows through shared experiences. Avastar Club connects the learning, observing and equipment parts of your journey.',
      items: [
        [
          'Meet fellow explorers',
          'Discover a community built around a shared curiosity about the sky.',
        ],
        [
          'Keep the conversation going',
          'Bring your questions and observing experiences into the journey.',
        ],
        ['Find your next step', 'Connect learning, observing and equipment through one path.'],
      ],
      note: 'Membership benefits and enrollment terms will be published after they are finalized.',
    },
    fa: {
      name: 'کالب',
      eyebrow: 'کیهانی که با هم کشف می‌کنیم',
      title: 'آسمان بزرگ‌تر است،\nوقتی تنها نیستیم.',
      description:
        'هم‌سفرهای خود را میان ستاره‌ها پیدا کنید. یاد بگیرید، تجربه‌هایتان را به اشتراک بگذارید و بخشی از جامعه آوا استار باشید.',
      cta: 'آشنایی با آوا استار کالب',
      features: ['جامعه کاوشگران', 'تجربه‌های مشترک', 'مسیر نجومی شما'],
      detail:
        'علاقه ماندگار با تجربه‌های مشترک رشد می‌کند. آوا استار کالب، یادگیری، رصد و انتخاب ابزار را در یک مسیر به هم پیوند می‌دهد.',
      items: [
        ['همراه با کاوشگران', 'با جامعه‌ای آشنا شوید که کنجکاوی درباره آسمان وجه مشترک آن است.'],
        ['ادامه یک گفت‌وگو', 'سؤال‌ها و تجربه‌های رصدی خود را به این مسیر بیاورید.'],
        ['قدم بعدی خود را پیدا کنید', 'آموزش، تجربه و ابزار را در یک مسیر پیوسته دنبال کنید.'],
      ],
      note: 'مزایای عضویت و شرایط ثبت‌نام پس از نهایی‌شدن منتشر می‌شوند.',
    },
  },
} as const;
export const guides = {
  'starting-astronomy': {
    category: { fa: 'شروع مسیر', en: 'GETTING STARTED' },
    title: { fa: 'اولین قدم شما زیر آسمان شب', en: 'Your first step under the night sky' },
    description: {
      fa: 'برای شروع، کنجکاوی کافی است. یک مسیر ساده برای اولین تجربه شما.',
      en: 'Start with curiosity. A simple path to your first observing experience.',
    },
    body: {
      fa: [
        [
          'از سؤال خود شروع کنید',
          'دوست دارید صورت‌های فلکی را بشناسید، ماه را ببینید یا درباره کیهان بیشتر بخوانید؟ مشخص‌کردن علاقه، انتخاب قدم اول را آسان‌تر می‌کند.',
        ],
        [
          'اول ببینید، بعد انتخاب کنید',
          'برای شروع لازم نیست فوراً ابزار بخرید. با چشم غیرمسلح آسمان را تماشا کنید، یادداشت بردارید و اگر امکانش را دارید در یک برنامه آموزشی یا رصد گروهی شرکت کنید.',
        ],
        [
          'مسیر را ادامه دهید',
          'سؤال‌های خود را ثبت کنید و برای انتخاب آموزش مناسب، سطح تجربه و زمان در دسترس خود را در نظر بگیرید.',
        ],
      ],
      en: [
        [
          'Start with your question',
          'Would you like to recognize constellations, observe the Moon or learn about the universe? Your interest is a useful guide to your first step.',
        ],
        [
          'Observe before you buy',
          'You do not need to buy equipment immediately. Spend time looking at the sky, take notes and consider an introductory class or group observing experience.',
        ],
        [
          'Keep the journey going',
          'Write down your questions. Consider your experience and available time when choosing a learning path.',
        ],
      ],
    },
    planet: 'learn',
  },
  'choosing-a-telescope': {
    category: { fa: 'خرید آگاهانه', en: 'CHOOSING EQUIPMENT' },
    title: { fa: 'تلسکوپ مناسب شما کدام است؟', en: 'Which telescope fits your life?' },
    description: {
      fa: 'پیش از مقایسه مدل‌ها، این چند سؤال را از خودتان بپرسید.',
      en: 'Before comparing models, start with a few questions about your observing life.',
    },
    body: {
      fa: [
        [
          'کجا رصد می‌کنید؟',
          'بالکن، حیاط یا خارج از شهر؟ فضای استفاده و امکان جابه‌جایی را مشخص کنید. وزن، ابعاد و زمان آماده‌سازی ابزار در استفاده روزمره مهم‌اند.',
        ],
        [
          'بودجه کل را ببینید',
          'بودجه را فقط به بدنه تلسکوپ محدود نکنید؛ لوازم لازم و شرایط حمل و نگهداری را هم در انتخاب خود لحاظ کنید.',
        ],
        [
          'با نیاز واقعی مشورت بگیرید',
          'محل رصد، علاقه، تجربه و بودجه را برای مشاور توضیح دهید. قبل از خرید، مشخصات، اقلام همراه و شرایط خدمات همان محصول را بررسی کنید.',
        ],
      ],
      en: [
        [
          'Where will you observe?',
          'A balcony, a garden or outside the city? Consider your space, transport, equipment weight and setup time.',
        ],
        [
          'Consider the full budget',
          'Think beyond the telescope itself. Include any necessary accessories, transport and storage in your decision.',
        ],
        [
          'Ask about your actual needs',
          'Share your observing location, interests, experience and budget. Check the exact specifications, included accessories and service terms before purchase.',
        ],
      ],
    },
    planet: 'shop',
  },
  'first-observing-trip': {
    category: { fa: 'تجربه رصد', en: 'OBSERVING TOGETHER' },
    title: { fa: 'برای اولین گشت رصدی آماده شوید', en: 'Prepare for your first observing trip' },
    description: {
      fa: 'چک‌لیستی کوتاه برای انتخاب و آماده‌شدن برای یک شب متفاوت.',
      en: 'A short checklist for choosing and preparing for a different kind of night.',
    },
    body: {
      fa: [
        [
          'شرایط برنامه را بخوانید',
          'زمان، محل حرکت، مسیر، شرایط سنی، اقامت و امکانات را از برگزارکننده بررسی کنید. برای شرکت خانوادگی، نیازهای همراهان را مطرح کنید.',
        ],
        [
          'وسایل را با برنامه هماهنگ کنید',
          'فهرست وسایل پیشنهادی برگزارکننده را دریافت کنید؛ شرایط دما، لباس، کفش، آب و تغذیه را متناسب با مقصد بررسی کنید.',
        ],
        [
          'قبل از حرکت، وضعیت را تأیید کنید',
          'رصد به شرایط آسمان وابسته است. وضعیت نهایی اجرا و شرایط تغییر یا کنسلی را قبل از حرکت از برگزارکننده دریافت کنید.',
        ],
      ],
      en: [
        [
          'Read the program details',
          'Check departure times, meeting points, transport, age requirements and available facilities. Ask about the needs of everyone in your group.',
        ],
        [
          'Pack for the actual destination',
          'Request the organizer’s equipment list. Consider temperature, clothing, footwear, water and food for the specific trip.',
        ],
        [
          'Confirm before departure',
          'Observing depends on sky conditions. Check the final program status and the organizer’s change or cancellation terms before you leave.',
        ],
      ],
    },
    planet: 'explore',
  },
} as const;
export const copy = {
  fa: {
    welcome: 'به منظومه آوا استار خوش آمدید',
    hero1: 'کشف کیهان،',
    hero2: 'برای کشف خود.',
    heroDescription:
      'از اولین نگاه به آسمان تا تجربه رصد و انتخاب ابزار؛\nیک جهان فرصت برای کنجکاوی شما.',
    start: 'شروع مسیر نجومی من',
    discover: 'کاوش در منظومه',
    scroll: 'اسکرول کنید، به عمق بروید',
    universe: 'چهار مسیر. یک جهان بی‌انتها.',
    universeSub: 'هر سیاره، آغاز یک ماجراجویی تازه است.',
    journey: 'مسیر شما',
    journal: 'مجله',
    about: 'درباره ما',
    close: 'بازگشت به منظومه',
    details: 'مشاهده مسیر کامل',
    consult: 'درخواست راهنمایی',
    read: 'خواندن راهنما',
    journalTitle: 'کمی نزدیک‌تر به آسمان',
    journalSub: 'برای هر سؤال، یک قدم به کشف نزدیک‌تر.',
    aboutTitle: 'نجوم، یک مسیر ادامه‌دار است.',
    aboutText:
      'آوا استار یک اکوسیستم نجومی است؛ جایی که یادگیری، تجربه رصد، انتخاب آگاهانه ابزار و همراهی با جامعه کاوشگران به هم می‌رسند.',
    partners: 'همکاری در مدار آوا استار',
    partnersText: 'برای مدارس، سازمان‌ها، فروشگاه‌ها و همراهان تجاری.',
    partnerCta: 'گفت‌وگو درباره همکاری',
    faq: 'پیش از شروع سفر',
    footer: 'کشف کیهان برای کشف خود',
    light: 'تم روشن',
    dark: 'تم تیره',
    motionOff: 'کاهش حرکت',
    motionOn: 'حرکت کامل',
    back: 'بازگشت',
    next: 'ادامه',
    requestTitle: 'قدم بعدی را با هم پیدا کنیم',
    name: 'نام شما',
    contact: 'ایمیل یا شماره تماس',
    message: 'درباره علاقه یا درخواستتان بنویسید',
    submit: 'ثبت درخواست',
    submitting: 'در حال ثبت…',
    consent: 'با ثبت اطلاعاتم برای بررسی همین درخواست موافقم.',
    success: 'درخواست شما ثبت شد.',
    successSub: 'شناسه درخواست را برای پیگیری نگه دارید.',
    error: 'ثبت درخواست انجام نشد. اطلاعات شما حفظ شده؛ دوباره تلاش کنید.',
    requestNote: 'این فرم برای درخواست راهنمایی است؛ به‌معنای رزرو، خرید یا عضویت قطعی نیست.',
    guideTitle: 'مسیر نجومی شما از کجا شروع می‌شود؟',
    guideSub: 'علاقه اصلی خود را انتخاب کنید.',
    level: 'چقدر با نجوم آشنایید؟',
    beginner: 'تازه شروع کرده‌ام',
    experienced: 'کمی تجربه دارم',
    result: 'پیشنهاد برای قدم بعدی شما',
    newPath: 'انتخاب دوباره',
    more: 'بیشتر بدانید',
    noAccount: 'برای کشف مسیر، نیازی به ثبت‌نام نیست.',
    cooperation: 'همکاری',
    privacy: 'اطلاعات این فرم فقط برای بررسی درخواست شما ثبت می‌شود. اطلاعات حساس ارسال نکنید.',
  },
  en: {
    welcome: 'WELCOME TO THE AVASTAR UNIVERSE',
    hero1: 'Discover the universe.',
    hero2: 'Discover yourself.',
    heroDescription:
      'From your first look at the sky to observing and choosing your tools.\nA universe of possibilities for your curiosity.',
    start: 'Find my astronomy path',
    discover: 'Explore the universe',
    scroll: 'SCROLL TO GO DEEPER',
    universe: 'Four paths. One boundless universe.',
    universeSub: 'Every planet is the beginning of a new adventure.',
    journey: 'Your journey',
    journal: 'Journal',
    about: 'About',
    close: 'Back to the universe',
    details: 'Explore the full path',
    consult: 'Request guidance',
    read: 'Read the guide',
    journalTitle: 'A little closer to the sky',
    journalSub: 'Every question takes you one step closer to discovery.',
    aboutTitle: 'Astronomy is a journey that keeps going.',
    aboutText:
      'Avastar is an astronomy ecosystem, connecting learning, observing, informed equipment choices and a community of curious explorers.',
    partners: 'Join the Avastar orbit',
    partnersText: 'For schools, organizations, stores and commercial partners.',
    partnerCta: 'Explore a partnership',
    faq: 'Before your journey',
    footer: 'Discover the universe. Discover yourself.',
    light: 'Light theme',
    dark: 'Dark theme',
    motionOff: 'Reduce motion',
    motionOn: 'Full motion',
    back: 'Back',
    next: 'Continue',
    requestTitle: 'Let’s find your next step',
    name: 'Your name',
    contact: 'Email or phone number',
    message: 'Tell us about your interests or request',
    submit: 'Submit request',
    submitting: 'Submitting…',
    consent: 'I agree to my details being stored to review this request.',
    success: 'Your request has been recorded.',
    successSub: 'Keep this reference for your records.',
    error: 'We couldn’t save your request. Your details are still here; please try again.',
    requestNote: 'This is a guidance request, not a confirmed booking, purchase or membership.',
    guideTitle: 'Where does your astronomy journey begin?',
    guideSub: 'Choose what interests you most.',
    level: 'How familiar are you with astronomy?',
    beginner: 'I’m just getting started',
    experienced: 'I have some experience',
    result: 'Your suggested next step',
    newPath: 'Choose again',
    more: 'Learn more',
    noAccount: 'No account needed to explore your path.',
    cooperation: 'Partnership',
    privacy:
      'The information in this form is stored to review your request. Please do not include sensitive information.',
  },
};
