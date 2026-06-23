export const demoClientObjects = [
  {
    id: 'demo-venue-1',
    name: 'Тестовое заведение',
    address: 'Адрес будет подставляться из CRM',
    status: 'active',
  },
  {
    id: 'demo-venue-2',
    name: 'Второй объект',
    address: 'Демо-объект для проверки сценария',
    status: 'active',
  },
];

export const categoryQuestions: Record<string, Array<{ id: string; title: string; options: string[] }>> = {
  venue_down: [
    { id: 'scope', title: 'Что именно не работает?', options: ['Нельзя продавать', 'Не открывается касса', 'Не работает iiko', 'Не знаю'] },
  ],
  cash_register: [
    { id: 'cash_issue', title: 'Что с кассой?', options: ['Не открывается', 'Ошибка при продаже', 'Не закрывается смена', 'Не печатает чек'] },
  ],
  payment: [
    { id: 'bank', title: 'Какой терминал?', options: ['Сбер', 'Т-Банк', 'Альфа', 'Другой', 'Не знаю'] },
  ],
  printer: [
    { id: 'printer', title: 'Какой принтер?', options: ['Кухня', 'Бар', 'Чековый', 'Все', 'Не знаю'] },
  ],
  iiko: [
    { id: 'iiko_part', title: 'Что не работает?', options: ['Front', 'Office', 'Сервер', 'Лицензия', 'Не знаю'] },
  ],
  egais: [
    { id: 'egais_part', title: 'Что связано с ЕГАИС?', options: ['УТМ', 'Накладные', 'Марки', 'Остатки', 'Не знаю'] },
  ],
  chestny_znaк: [],
  chestny_znak: [
    { id: 'cz_product', title: 'С чем проблема?', options: ['Вода', 'Пиво', 'Молоко', 'Марка не проходит', 'Не знаю'] },
  ],
  equipment: [
    { id: 'equipment_type', title: 'Какое оборудование?', options: ['Сканер', 'Весы', 'ФР', 'Терминал', 'Другое'] },
  ],
  settings: [
    { id: 'settings_type', title: 'Что нужно изменить?', options: ['Меню', 'Цены', 'Сотрудники', 'Скидки', 'Права'] },
  ],
  consultation: [
    { id: 'consultation_type', title: 'По какому вопросу нужна помощь?', options: ['Отчет', 'Смена', 'Настройка', 'Обучение', 'Другое'] },
  ],
  documents: [
    { id: 'document_type', title: 'Какой документ нужен?', options: ['Счет', 'Акт', 'Договор', 'Лицензия', 'Другое'] },
  ],
  other: [
    { id: 'other_type', title: 'Что ближе всего?', options: ['Проблема', 'Вопрос', 'Настройка', 'Документы'] },
  ],
};
