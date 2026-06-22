export type TicketCategoryKey =
  | 'venue_down'
  | 'cash_register'
  | 'payment'
  | 'printer'
  | 'iiko'
  | 'egais'
  | 'chestny_znak'
  | 'equipment'
  | 'settings'
  | 'consultation'
  | 'documents'
  | 'other';

export const ticketCategories: Array<{
  key: TicketCategoryKey;
  title: string;
  description: string;
  examples: string[];
}> = [
  {
    key: 'venue_down',
    title: 'Не работает заведение',
    description: 'Касса, iiko или продажи полностью остановлены.',
    examples: ['Нельзя продавать', 'Не открывается касса', 'Не работает iiko'],
  },
  {
    key: 'cash_register',
    title: 'Касса',
    description: 'Проблемы с кассой, сменой, чеком или продажей.',
    examples: ['Не закрывается смена', 'Ошибка на кассе', 'Не печатает чек'],
  },
  {
    key: 'payment',
    title: 'Оплата',
    description: 'Эквайринг, терминал, банк или оплата картой.',
    examples: ['Не проходит оплата', 'Терминал не отвечает', 'Ошибка банка'],
  },
  {
    key: 'printer',
    title: 'Принтеры',
    description: 'Чековый, кухонный или барный принтер.',
    examples: ['Не печатает кухня', 'Не печатает чек', 'Принтер offline'],
  },
  {
    key: 'iiko',
    title: 'iiko',
    description: 'Front, Office, лицензии, обновления и настройки.',
    examples: ['Не открывается Front', 'Ошибка лицензии', 'Проблема после обновления'],
  },
  {
    key: 'egais',
    title: 'ЕГАИС',
    description: 'УТМ, алкоголь, накладные, марки и FSRAR.',
    examples: ['УТМ не отвечает', 'Не уходит акт', 'Проблема с маркой'],
  },
  {
    key: 'chestny_znak',
    title: 'Честный знак',
    description: 'Маркировка, ТС ПиОТ, GTIN и разрешительный режим.',
    examples: ['Марка не проходит', 'Ошибка ЧЗ', 'Проблема с водой'],
  },
  {
    key: 'equipment',
    title: 'Оборудование',
    description: 'Сканеры, весы, ФР, терминалы и другое железо.',
    examples: ['Сканер не читает', 'Весы не работают', 'ФР не отвечает'],
  },
  {
    key: 'settings',
    title: 'Изменить настройки',
    description: 'Меню, цены, сотрудники, скидки и права.',
    examples: ['Добавить сотрудника', 'Изменить цены', 'Настроить скидку'],
  },
  {
    key: 'consultation',
    title: 'Консультация',
    description: 'Нужна помощь или вопрос по работе системы.',
    examples: ['Как сделать отчет', 'Как настроить акцию', 'Как закрыть смену'],
  },
  {
    key: 'documents',
    title: 'Документы',
    description: 'Счета, акты, договоры, лицензии и закрывающие документы.',
    examples: ['Нужен счет', 'Нужен акт', 'Вопрос по договору'],
  },
  {
    key: 'other',
    title: 'Другое',
    description: 'Если ничего из списка не подходит.',
    examples: ['Другая проблема'],
  },
];
