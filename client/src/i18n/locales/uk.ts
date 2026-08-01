const uk = {
  translation: {
    common: {
      language: "Мова",
      english: "Англійська",
      ukrainian: "Українська",
      czech: "Чеська",
      loading: "Завантаження...",
      save: "Зберегти",
      cancel: "Скасувати",
      edit: "Редагувати",
      delete: "Видалити",
      view: "Переглянути",
      back: "Назад",
      close: "Закрити",
      status: "Статус",
      all: "Усі",
      yes: "Так",
      no: "Ні",
      notAvailable: "-",
    },

    navigation: {
      dashboard: "Головна",
      clients: "Клієнти",
      devices: "Пристрої",
      orders: "Замовлення",
    },

    statuses: {
      pending: "Очікує",
      inProgress: "У роботі",
      completed: "Завершено",
      cancelled: "Скасовано",
    },

    delivery: {
      notReady: "Не готово",
      ready: "Готово",
      delivered: "Видано",
      deliver: "Видати",
      delivering: "Видача...",
      error: "Не вдалося позначити замовлення як видане.",
    },

    ordersPage: {
      title: "Замовлення",
      addOrder: "Додати замовлення",
      loading: "Завантаження замовлень...",
      empty: "Замовлень не знайдено.",
      columns: {
        id: "ID",
        device: "Пристрій",
        client: "Клієнт",
        price: "Ціна",
        received: "Прийнято",
        status: "Статус",
        delivery: "Видача",
        actions: "Дії",
      },
      labels: {
        client: "Клієнт",
        price: "Ціна",
        received: "Прийнято",
        status: "Статус",
        delivery: "Видача",
      },
      priceTypes: {
        final: "Кінцева",
        estimated: "Орієнтовна",
      },
      actions: {
        view: "Переглянути замовлення",
        edit: "Редагувати замовлення",
        delete: "Видалити замовлення",
      },
      deleteConfirmation:
        'Ви впевнені, що хочете видалити замовлення "{{id}}"?',
      errors: {
        loadFailed: "Не вдалося завантажити замовлення.",
        clientsLoadFailed: "Не вдалося завантажити клієнтів.",
        statusUpdateFailed: "Не вдалося змінити статус замовлення.",
      },
    },

    deleteDialog: {
      title: "Підтвердження видалення",
      cancel: "Скасувати",
      delete: "Видалити",
    },

    clientsPage: {
      title: "Клієнти",
      addClient: "Додати клієнта",
      loading: "Завантаження клієнтів...",
      empty: "Клієнтів не знайдено.",
      columns: {
        name: "Ім’я",
        phone: "Телефон",
        email: "Електронна пошта",
        date: "Дата",
        actions: "Дії",
      },
      labels: {
        phone: "Телефон",
        email: "Електронна пошта",
      },
      actions: {
        edit: "Редагувати клієнта",
        delete: "Видалити клієнта",
      },
      deleteConfirmation:
        'Ви впевнені, що хочете видалити клієнта "{{name}}"?',
      errors: {
        loadFailed: "Не вдалося завантажити клієнтів.",
      },
    },

    clientForm: {
      titles: {
        add: "Додати нового клієнта",
        edit: "Редагувати клієнта",
      },
      fields: {
        fullName: "Повне ім’я",
        phone: "Телефон",
        secondaryPhone: "Додатковий телефон",
        email: "Електронна пошта",
        address: "Адреса",
        note: "Примітка клієнта",
      },
      lookup: {
        searching: "Пошук...",
        findClient: "Знайти клієнта",
        notFound:
          "Клієнта з таким телефоном не знайдено. Заповніть форму, щоб створити нового клієнта.",
        failed: "Не вдалося виконати пошук клієнта.",
      },
      helpers: {
        optional: "Необов’язково",
        note: "Внутрішня інформація про клієнта",
      },
      validation: {
        nameRequired: "Потрібно вказати повне ім’я",
        nameMax: "Повне ім’я не може перевищувати 120 символів",
        phoneRequired: "Потрібно вказати телефон",
        phoneInvalid: "Введіть коректний номер телефону",
        secondaryPhoneInvalid:
          "Введіть коректний додатковий номер телефону",
        emailInvalid: "Некоректний формат електронної пошти",
        emailMax:
          "Електронна пошта не може перевищувати 160 символів",
        addressMax: "Адреса не може перевищувати 255 символів",
        noteMax: "Примітка не може перевищувати 2000 символів",
      },
      actions: {
        cancel: "Скасувати",
        save: "Зберегти",
      },
      errors: {
        save: "Не вдалося зберегти клієнта. Спробуйте ще раз.",
      },
    },

    devicesPage: {
      title: "Пристрої",
      addDevice: "Додати пристрій",
      loading: "Завантаження пристроїв...",
      empty: "Пристроїв не знайдено.",
      columns: {
        brand: "Бренд",
        model: "Модель",
        identifier: "Ідентифікатор",
        client: "Клієнт",
        date: "Дата",
        actions: "Дії",
      },
      labels: {
        client: "Клієнт",
        deviceType: "Тип пристрою",
        date: "Дата",
      },
      identifiers: {
        imei1: "IMEI 1",
        imei2: "IMEI 2",
        serial: "Серійний номер",
        none: "Ідентифікатор відсутній",
      },
      deviceTypes: {
        phone: "Телефон",
        tablet: "Планшет",
        laptop: "Ноутбук",
        smartwatch: "Розумний годинник",
        other: "Інше",
      },
      actions: {
        edit: "Редагувати пристрій",
        delete: "Видалити пристрій",
      },
      deleteConfirmation:
        'Ви впевнені, що хочете видалити пристрій "{{device}}"?',
      errors: {
        loadFailed: "Не вдалося завантажити пристрої.",
        clientsLoadFailed: "Не вдалося завантажити клієнтів.",
      },
    },

    deviceForm: {
      titles: {
        add: "Додати новий пристрій",
        edit: "Редагувати пристрій",
      },
      fields: {
        client: "Клієнт",
        deviceType: "Тип пристрою",
        color: "Колір",
        brand: "Бренд",
        model: "Модель",
        imei1: "IMEI 1",
        imei2: "IMEI 2",
        serial: "Серійний номер",
      },
      deviceTypes: {
        phone: "Телефон",
        tablet: "Планшет",
        laptop: "Ноутбук",
        smartwatch: "Розумний годинник",
        other: "Інше",
      },
      helpers: {
        noClients: "Немає доступних клієнтів",
        optional: "Необов’язково",
        imei: "Необов’язково, 15 цифр",
      },
      validation: {
        clientRequired: "Потрібно вибрати клієнта",
        deviceTypeRequired: "Потрібно вибрати тип пристрою",
        colorMax: "Колір не може перевищувати 80 символів",
        brandRequired: "Потрібно вказати бренд",
        brandMax: "Бренд не може перевищувати 120 символів",
        modelRequired: "Потрібно вказати модель",
        modelMax: "Модель не може перевищувати 120 символів",
        imeiCharacters:
          "IMEI може містити лише цифри, пробіли та дефіси",
        imeiLength: "IMEI має містити рівно 15 цифр",
        serialMax:
          "Серійний номер не може перевищувати 100 символів",
      },
      actions: {
        cancel: "Скасувати",
        save: "Зберегти",
        saving: "Збереження...",
      },
      errors: {
        save: "Не вдалося зберегти пристрій. Спробуйте ще раз.",
        existingDevice: "ID наявного пристрою: {{id}}.",
      },
    },

    orderForm: {
      titles: {
        create: "Створити нове замовлення",
        edit: "Редагувати замовлення",
      },

      sections: {
        clientDevice: "Клієнт і пристрій",
        intake: "Інформація про приймання",
        repair: "Інформація про ремонт",
      },

      fields: {
        client: "Клієнт",
        device: "Пристрій",
        reportedProblem: "Заявлена несправність",
        deviceCondition: "Стан пристрою",
        accessories: "Комплектація",
        receivedAt: "Дата приймання",
        dueAt: "Запланований термін",
        accessType: "Тип доступу",
        accessCode: "Код доступу",
        status: "Статус",
        estimatedPrice: "Орієнтовна ціна",
        finalPrice: "Кінцева ціна",
        diagnosis: "Діагностика",
        workPerformed: "Виконані роботи",
        internalNote: "Внутрішня примітка",
      },

      placeholders: {
        deviceCondition: "Подряпини, тріщини, погнута рамка...",
        accessories: "Телефон, чохол, зарядний пристрій...",
      },

      accessTypes: {
        none: "Без коду доступу",
        pin: "PIN",
        password: "Пароль",
        pattern: "Графічний ключ",
        unknown: "Невідомо",
      },

      helpers: {
        noClients: "Немає доступних клієнтів",
        noDevices: "У цього клієнта немає пристроїв",
        codeSaved: "Код уже збережений. Залиште поле порожнім, щоб його не змінювати.",
        patternExample: "Приклад: 1-2-5-8",
        unknownAccess: "Спосіб доступу невідомий.",
        noCodeRequired: "Код доступу не потрібний.",
        internalNote: "Видно лише працівникам сервісу.",
      },

      validation: {
        clientRequired: "Потрібно вибрати клієнта",
        deviceRequired: "Потрібно вибрати пристрій",
        clientDeviceRequired: "Потрібно вибрати клієнта і пристрій.",
        problemRequired: "Потрібно вказати несправність",
        problemMax: "Опис несправності не може перевищувати 255 символів",
        receivedRequired: "Потрібно вказати дату приймання",
        dueBeforeReceived: "Запланований термін не може бути раніше дати приймання",
        accessCodeRequired: "Потрібно вказати код доступу",
        accessCodeMax: "Код доступу не може перевищувати 256 символів",
        estimatedNonNegative: "Орієнтовна ціна не може бути від’ємною",
        estimatedWhole: "Орієнтовна ціна має бути цілим числом",
        finalNonNegative: "Кінцева ціна не може бути від’ємною",
        finalWhole: "Кінцева ціна має бути цілим числом",
      },

      actions: {
        cancel: "Скасувати",
        add: "Додати",
        update: "Оновити",
      },

      errors: {
        loadDevices: "Не вдалося завантажити пристрої.",
        save: "Не вдалося зберегти замовлення.",
      },
    },

    orderDetails: {
      title: "Замовлення №{{id}}",
      backToOrders: "Назад до замовлень",
      editOrder: "Редагувати замовлення",
      loadingOrder: "Завантаження замовлення...",
      clientFallback: "Клієнт №{{id}}",
      sections: {
        client: "Клієнт",
        device: "Пристрій",
        intake: "Приймання",
        repair: "Ремонт",
        price: "Ціна",
        timeline: "Історія дат",
      },
      fields: {
        name: "Ім’я",
        phone: "Телефон",
        secondaryPhone: "Додатковий телефон",
        email: "Електронна пошта",
        address: "Адреса",
        clientNote: "Примітка клієнта",
        deviceType: "Тип пристрою",
        brand: "Бренд",
        model: "Модель",
        color: "Колір",
        imei1: "IMEI 1",
        imei2: "IMEI 2",
        serialNumber: "Серійний номер",
        reportedProblem: "Заявлена несправність",
        deviceCondition: "Стан пристрою",
        accessories: "Комплектація",
        deviceAccess: "Доступ до пристрою",
        received: "Прийнято",
        dueDate: "Запланований термін",
        diagnosis: "Діагностика",
        workPerformed: "Виконані роботи",
        internalNote: "Внутрішня примітка",
        estimatedPrice: "Орієнтовна ціна",
        finalPrice: "Кінцева ціна",
        created: "Створено",
        lastUpdated: "Останнє оновлення",
        completed: "Завершено",
        delivered: "Видано",
      },
      deviceTypes: {
        phone: "Телефон",
        tablet: "Планшет",
        laptop: "Ноутбук",
        smartwatch: "Розумний годинник",
        other: "Інше",
      },
      access: {
        pinProvided: "PIN надано",
        pinNotProvided: "PIN не надано",
        passwordProvided: "Пароль надано",
        passwordNotProvided: "Пароль не надано",
        patternProvided: "Графічний ключ надано",
        patternNotProvided: "Графічний ключ не надано",
        unknown: "Невідомо",
        none: "Код доступу відсутній",
      },
      errors: {
        invalidId: "Некоректний номер замовлення.",
        notFound: "Замовлення не знайдено.",
        loadFailed: "Не вдалося завантажити замовлення.",
        statusUpdateFailed: "Не вдалося змінити статус замовлення.",
        deliveryFailed: "Не вдалося позначити замовлення як видане.",
        editPreparationFailed: "Не вдалося підготувати форму редагування.",
        missingOrderId: "Номер замовлення відсутній.",
      },
    },
  },
};

export default uk;
