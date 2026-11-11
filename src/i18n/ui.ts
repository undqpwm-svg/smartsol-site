import { DEFAULT_LOCALE, type Locale } from './config';

/**
 * Короткие тексты интерфейса: меню, кнопки, форма, подвал.
 * Тексты страниц лежат в src/content — здесь только «обвязка».
 *
 * Русский словарь — эталон. Казахский и английский обязаны содержать
 * те же ключи (тип Dictionary); переводы ждут проверки носителем языка.
 */
const ru = {
  'skip': 'Перейти к содержанию',
  'logo.home': 'SmartSol, главная страница',

  'nav.label': 'Основное меню',
  'nav.services': 'Услуги',
  'nav.products': 'Продукты',
  'nav.finpulse': 'ФинПульс',
  'nav.cases': 'Кейсы',
  'nav.contacts': 'Контакты',
  'menu.open': 'Открыть меню',
  'menu.close': 'Закрыть меню',

  'lang.label': 'Язык сайта',

  'cta.discuss': 'Бесплатный разбор задачи',
  'cta.whatsapp': 'WhatsApp',
  'cta.whatsappAria': 'Написать в WhatsApp',
  'cta.whatsappHint': 'написать нам',

  // Текст, который подставится в WhatsApp при переходе с сайта
  'wa.prefill': 'Здравствуйте. Хочу обсудить задачу.',

  'crumbs.home': 'Главная',
  'crumbs.label': 'Вы здесь',
  'prose.toc': 'Содержание',

  'contacts.email': 'Почта',
  'contacts.geoTitle': 'Весь Казахстан',

  // Схема платёжного календаря в блоке ФинПульса
  'feature.calendar': 'Платёжный календарь',
  'feature.gap': 'Кассовый разрыв',

  // Кейсы: отрасль → задача → что сделали → результат
  'case.task': 'Задача',
  'case.solution': 'Сделали',
  'case.result': 'Результат',

  'lead.whatsapp': 'Или сразу напишите в WhatsApp',

  // Форма заявки
  'form.name': 'Имя',
  'form.namePlaceholder': 'Как к вам обращаться',
  'form.phone': 'Телефон или WhatsApp',
  'form.company': 'Компания',
  'form.task': 'Задача',
  'form.taskPlaceholder': 'Коротко: что хотите упростить',
  'form.optional': 'необязательно',
  'form.consent': 'Соглашаюсь на сбор и обработку персональных данных согласно',
  'form.consentLink': 'политике обработки персональных данных',
  'form.submit': 'Отправить заявку',
  'form.sending': 'Отправляем…',
  'form.response': 'Ответим в течение рабочего дня.',
  'form.successTitle': 'Заявка отправлена',
  'form.successText': 'Спасибо. Ответим в течение рабочего дня и договоримся о бесплатном разборе задачи.',
  'form.errorSummary': 'Проверьте поля формы',
  'form.errorName': 'Укажите имя: хотя бы 2 буквы',
  'form.errorPhone': 'Проверьте номер: +7 и ещё 10 цифр',
  'form.errorTask': 'Опишите задачу хотя бы парой слов (до 1000 символов)',
  'form.errorConsent': 'Без согласия на обработку данных мы не можем принять заявку',
  // Ошибки отправки: форма не стирается, после текста — ссылка на ту же заявку в WhatsApp
  'form.errorNetwork':
    'Заявка не ушла: похоже, пропал интернет. Всё, что вы ввели, сохранилось, нажмите «Отправить заявку» ещё раз.',
  'form.errorServer':
    'Заявка не ушла из-за ошибки на нашей стороне. Всё, что вы ввели, сохранилось, попробуйте ещё раз через минуту.',
  'form.errorWhatsapp': 'Отправить эту заявку в WhatsApp',
  'form.noscript': 'Форма работает с включённым JavaScript. Напишите нам в WhatsApp:',
  // Тема письма с заявкой (Web3Forms)
  'form.mailSubject': 'Заявка с сайта smartsol.pro',
  // Заявка в WhatsApp, если форма не отправилась: подставляются введённые данные
  'form.waTemplate': 'Здравствуйте. Хочу обсудить задачу.',
  'form.waName': 'Имя',
  'form.waPhone': 'Телефон',

  // Панель WhatsApp внизу экрана на телефоне
  'dock.label': 'Сообщение в WhatsApp',
  'dock.placeholder': 'Опишите задачу',
  'dock.send': 'Написать в WhatsApp',

  // Страница 404
  'notFound.title': 'Такой страницы нет',
  'notFound.text':
    'Проверьте адрес или начните с главной. Если не нашли нужное, напишите нам в WhatsApp, подскажем.',
  'notFound.home': 'На главную',

  'footer.slogan': 'Делаем сложное простым',
  'footer.sections': 'Разделы',
  'footer.contacts': 'Контакты',
  'footer.geo': 'Работаем удалённо по всему Казахстану',
  'footer.privacy': 'Политика обработки персональных данных',
} as const;

export type UiKey = keyof typeof ru;
// Словари обязаны содержать все ключи — TypeScript подскажет, если что-то забыто
type Dictionary = Record<UiKey, string>;

// Казахский — перевод, требует проверки носителем языка
const kz: Dictionary = {
  'skip': 'Мазмұнға өту',
  'logo.home': 'SmartSol, басты бет',

  'nav.label': 'Негізгі мәзір',
  'nav.services': 'Қызметтер',
  'nav.products': 'Өнімдер',
  'nav.finpulse': 'ФинПульс',
  'nav.cases': 'Кейстер',
  'nav.contacts': 'Байланыс',
  'menu.open': 'Мәзірді ашу',
  'menu.close': 'Мәзірді жабу',

  'lang.label': 'Сайт тілі',

  'cta.discuss': 'Міндетті тегін талдау',
  'cta.whatsapp': 'WhatsApp',
  'cta.whatsappAria': 'WhatsApp-қа жазу',
  'cta.whatsappHint': 'бізге жазу',

  'wa.prefill': 'Сәлеметсіз бе. Міндетті талқылағым келеді.',

  'crumbs.home': 'Басты бет',
  'crumbs.label': 'Сіз осындасыз',
  'prose.toc': 'Мазмұны',

  'contacts.email': 'Пошта',
  'contacts.geoTitle': 'Бүкіл Қазақстан',

  'feature.calendar': 'Төлем күнтізбесі',
  'feature.gap': 'Кассалық алшақтық',

  'case.task': 'Міндет',
  'case.solution': 'Не істедік',
  'case.result': 'Нәтиже',

  'lead.whatsapp': 'Немесе бірден WhatsApp-қа жазыңыз',

  'form.name': 'Аты',
  'form.namePlaceholder': 'Сізге қалай жүгінейік',
  'form.phone': 'Телефон немесе WhatsApp',
  'form.company': 'Компания',
  'form.task': 'Міндет',
  'form.taskPlaceholder': 'Қысқаша: нені жеңілдеткіңіз келеді',
  'form.optional': 'міндетті емес',
  'form.consent': 'Дербес деректерді жинауға және өңдеуге келісемін:',
  'form.consentLink': 'дербес деректерді өңдеу саясаты',
  'form.submit': 'Өтінім жіберу',
  'form.sending': 'Жіберілуде…',
  'form.response': 'Жұмыс күні ішінде жауап береміз.',
  'form.successTitle': 'Өтінім жіберілді',
  'form.successText': 'Рақмет. Жұмыс күні ішінде жауап беріп, міндетті тегін талдауға уағдаласамыз.',
  'form.errorSummary': 'Форма өрістерін тексеріңіз',
  'form.errorName': 'Атыңызды жазыңыз: кемінде 2 әріп',
  'form.errorPhone': 'Нөмірді тексеріңіз: +7 және тағы 10 цифр',
  'form.errorTask': 'Міндетті бірер сөзбен сипаттаңыз (1000 таңбаға дейін)',
  'form.errorConsent': 'Деректерді өңдеуге келісімсіз өтінімді қабылдай алмаймыз',
  'form.errorNetwork':
    'Өтінім жіберілмеді: интернет үзілген сияқты. Енгізгеніңіз сақталды, «Өтінім жіберу» батырмасын қайта басыңыз.',
  'form.errorServer':
    'Өтінім біз жақтағы қатеге байланысты жіберілмеді. Енгізгеніңіз сақталды, бір минуттан соң қайталап көріңіз.',
  'form.errorWhatsapp': 'Бұл өтінімді WhatsApp-қа жіберу',
  'form.noscript': 'Форма JavaScript қосулы кезде жұмыс істейді. Бізге WhatsApp-қа жазыңыз:',
  'form.mailSubject': 'smartsol.pro сайтынан өтінім',
  'form.waTemplate': 'Сәлеметсіз бе. Міндетті талқылағым келеді.',
  'form.waName': 'Аты',
  'form.waPhone': 'Телефон',

  'dock.label': 'WhatsApp-қа хабарлама',
  'dock.placeholder': 'Міндетті сипаттаңыз',
  'dock.send': 'WhatsApp-қа жазу',

  'notFound.title': 'Мұндай бет жоқ',
  'notFound.text':
    'Мекенжайды тексеріңіз немесе басты беттен бастаңыз. Керегін таппасаңыз, WhatsApp-қа жазыңыз, көмектесеміз.',
  'notFound.home': 'Басты бетке',

  'footer.slogan': 'Күрделіні қарапайым етеміз',
  'footer.sections': 'Бөлімдер',
  'footer.contacts': 'Байланыс',
  'footer.geo': 'Бүкіл Қазақстан бойынша қашықтан жұмыс істейміз',
  'footer.privacy': 'Дербес деректерді өңдеу саясаты',
};

// Английский — перевод, требует проверки носителем языка
const en: Dictionary = {
  'skip': 'Skip to content',
  'logo.home': 'SmartSol, home page',

  'nav.label': 'Main menu',
  'nav.services': 'Services',
  'nav.products': 'Products',
  'nav.finpulse': 'FinPulse',
  'nav.cases': 'Case studies',
  'nav.contacts': 'Contacts',
  'menu.open': 'Open menu',
  'menu.close': 'Close menu',

  'lang.label': 'Site language',

  'cta.discuss': 'Free task review',
  'cta.whatsapp': 'WhatsApp',
  'cta.whatsappAria': 'Message us on WhatsApp',
  'cta.whatsappHint': 'message us',

  'wa.prefill': 'Hello. I would like to discuss a task.',

  'crumbs.home': 'Home',
  'crumbs.label': 'You are here',
  'prose.toc': 'Contents',

  'contacts.email': 'Email',
  'contacts.geoTitle': 'All of Kazakhstan',

  'feature.calendar': 'Payment calendar',
  'feature.gap': 'Cash gap',

  'case.task': 'Task',
  'case.solution': 'What we did',
  'case.result': 'Result',

  'lead.whatsapp': 'Or message us on WhatsApp right away',

  'form.name': 'Name',
  'form.namePlaceholder': 'How should we address you',
  'form.phone': 'Phone or WhatsApp',
  'form.company': 'Company',
  'form.task': 'Task',
  'form.taskPlaceholder': 'In short: what you want to simplify',
  'form.optional': 'optional',
  'form.consent': 'I agree to the collection and processing of personal data under the',
  'form.consentLink': 'personal data processing policy',
  'form.submit': 'Send request',
  'form.sending': 'Sending…',
  'form.response': 'We reply within one business day.',
  'form.successTitle': 'Request sent',
  'form.successText': 'Thank you. We will reply within one business day and arrange a free review of your task.',
  'form.errorSummary': 'Please check the form fields',
  'form.errorName': 'Enter your name: at least 2 letters',
  'form.errorPhone': 'Check the number: +7 and 10 more digits',
  'form.errorTask': 'Describe the task in a few words (up to 1000 characters)',
  'form.errorConsent': 'We cannot accept the request without consent to data processing',
  'form.errorNetwork':
    'The request was not sent: the connection seems to be lost. Everything you entered is saved, press “Send request” again.',
  'form.errorServer':
    'The request was not sent because of an error on our side. Everything you entered is saved, try again in a minute.',
  'form.errorWhatsapp': 'Send this request on WhatsApp',
  'form.noscript': 'The form needs JavaScript. Message us on WhatsApp:',
  'form.mailSubject': 'Request from smartsol.pro',
  'form.waTemplate': 'Hello. I would like to discuss a task.',
  'form.waName': 'Name',
  'form.waPhone': 'Phone',

  'dock.label': 'Message on WhatsApp',
  'dock.placeholder': 'Describe your task',
  'dock.send': 'Message on WhatsApp',

  'notFound.title': 'Page not found',
  'notFound.text': 'Check the address or start from the home page. If you can’t find what you need, message us on WhatsApp.',
  'notFound.home': 'Go to home page',

  'footer.slogan': 'We make the complex simple',
  'footer.sections': 'Sections',
  'footer.contacts': 'Contacts',
  'footer.geo': 'We work remotely across Kazakhstan',
  'footer.privacy': 'Personal data processing policy',
};

const dictionaries: Record<Locale, Dictionary> = { ru, kz, en };

/** Возвращает функцию перевода для языка: t('cta.discuss') */
export function useTranslations(locale: Locale) {
  return function t(key: UiKey): string {
    return dictionaries[locale][key] ?? dictionaries[DEFAULT_LOCALE][key] ?? key;
  };
}
