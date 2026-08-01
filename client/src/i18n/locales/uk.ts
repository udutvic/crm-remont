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
      noData: "Даних не знайдено.",
      openMenu: "Відкрити меню",
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
      unrepairable: "Не підлягає ремонту",
    },

    delivery: {
      notReady: "Не готово",
      ready: "Готово",
      delivered: "Видано",
      deliver: "Видати",
      delivering: "Видача...",
      error: "Не вдалося позначити замовлення як видане.",
      readyWithoutRepair: "Без ремонту",
      returnedWithoutRepair: "Видано без ремонту",
      deliverWithoutRepair: "Видати",
      returningWithoutRepair: "Видача...",
    },

    auth: {
      subtitle: "Увійдіть, щоб продовжити роботу із сервісом ремонту.",
      checkingSession: "Перевірка сесії...",
      fields: {
        email: "Електронна пошта",
        password: "Пароль",
      },
      actions: {
        signIn: "Увійти",
        signingIn: "Вхід...",
        signOut: "Вийти",
        showPassword: "Показати пароль",
        hidePassword: "Приховати пароль",
        retry: "Спробувати знову",
      },
      roles: {
        admin: "Адміністратор",
        technician: "Технік",
      },
      userMenu: {
        open: "Відкрити меню користувача",
      },
      errors: {
        required: "Введіть електронну пошту та пароль.",
        loginFailed: "Не вдалося увійти.",
        sessionCheckFailed:
          "Не вдалося перевірити сесію. Переконайтеся, що сервер працює, і спробуйте знову.",
        codes: {
          AUTH_INVALID_INPUT: "Введіть коректну електронну пошту та пароль.",
          AUTH_INVALID_CREDENTIALS: "Неправильна електронна пошта або пароль.",
          AUTH_ACCOUNT_DISABLED: "Цей обліковий запис вимкнений.",
          AUTH_RATE_LIMITED: "Забагато спроб. Спробуйте пізніше.",
          ORIGIN_FORBIDDEN: "Сервер не дозволяє цю адресу застосунку.",
        },
      },
    },

    security: {
      accessDenied: "У вас немає дозволу на відкриття цієї сторінки.",
      backToDashboard: "На головну",
    },

    accessCode: {
      types: {
        none: "код доступу",
        pin: "PIN",
        password: "пароль",
        pattern: "графічний ключ",
        unknown: "код доступу",
      },
      actions: {
        show: "Показати {{type}}",
        confirmShow: "Показати код",
        loading: "Завантаження...",
        hide: "Приховати",
        copy: "Копіювати",
      },
      confirm: {
        title: "Показати код доступу до пристрою?",
        message:
          "Ця дія буде записана в журнал. {{type}} буде показано протягом {{seconds}} секунд.",
      },
      autoHide:
        "Код автоматично приховається через {{seconds}} секунд.",
      copied: "Скопійовано",
      errors: {
        revealFailed: "Не вдалося показати код доступу.",
        copyFailed: "Не вдалося скопіювати код доступу.",
      },
    },

    auditPage: {
      title: "Журнал дій",
      refresh: "Оновити",
      empty: "За вибраними фільтрами подій не знайдено.",
      systemUser: "Система або видалений користувач",
      filters: {
        action: "Дія",
        actionPlaceholder: "Наприклад: LOGIN або ORDER",
        entity: "Об’єкт",
        startDate: "Дата від",
        endDate: "Дата до",
        reset: "Скинути",
      },
      columns: {
        date: "Дата і час",
        user: "Користувач",
        action: "Дія",
        entity: "Об’єкт",
        request: "Запит",
        status: "Статус",
      },
      pagination: {
        rowsPerPage: "Рядків на сторінці:",
        displayedRows: "{{from}}–{{to}} з {{count}}",
      },
      entities: {
        all: "Усі об’єкти",
        auth: "Авторизація",
        client: "Клієнт",
        device: "Пристрій",
        intake: "Приймання",
        order: "Замовлення",
        stats: "Статистика",
      },
      actions: {
        AUTH_LOGIN_SUCCESS: "Успішний вхід",
        AUTH_LOGIN_FAILED: "Невдала спроба входу",
        AUTH_LOGOUT_SUCCESS: "Вихід із системи",
        AUTH_LOGOUT_FAILED: "Невдала спроба виходу",
        CLIENT_CREATE: "Створено клієнта",
        CLIENT_UPDATE: "Оновлено клієнта",
        CLIENT_DELETE: "Видалено клієнта",
        DEVICE_CREATE: "Створено пристрій",
        DEVICE_UPDATE: "Оновлено пристрій",
        DEVICE_DELETE: "Видалено пристрій",
        INTAKE_CREATE: "Створено приймання",
        ORDER_CREATE: "Створено замовлення",
        ORDER_UPDATE: "Оновлено замовлення",
        ORDER_STATUS_UPDATE: "Змінено статус замовлення",
        ORDER_DELIVER: "Замовлення видано",
        ORDER_DELETE: "Замовлення видалено",
        ORDER_ACCESS_CODE_REVEAL: "Переглянуто код доступу",
      },
      errors: {
        loadFailed: "Не вдалося завантажити журнал дій.",
      },
    },

    ordersPage: {
      listTools: {
        searchLabel: "Пошук замовлень",
        searchPlaceholder: "№ замовлення, клієнт, телефон, IMEI, пристрій...",
        deliveryLabel: "Видача",
        deliveryAll: "Усі",
        deliveryReady: "Готові до видачі",
        deliveryNotDelivered: "Не видані",
        deliveryDelivered: "Видані",
        startDate: "Прийнято від",
        endDate: "Прийнято до",
        reset: "Скинути",
        rowsPerPage: "Рядків на сторінці:",
        displayedRows: "{{from}}–{{to}} з {{count}}",
      },

      title: "Замовлення",
      addOrder: "Додати замовлення",
      loading: "Завантаження замовлень...",
      empty: "Замовлень не знайдено.",
      grid: {
        rowsPerPage: "Рядків на сторінці:",
      },
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

    clientInfo: {
      noOwner: "Власника не вказано",
      unknown: "Невідомий клієнт",
      avatarAlt: "Аватар клієнта",
    },

    dashboardPage: {
      title: "Головна",
      loading: "Завантаження головної сторінки...",
      statistics: {
        clients: "Клієнти",
        devices: "Пристрої",
        orders: "Замовлення",
        income: "Дохід",
      },
      recentOrders: {
        title: "Останні 5 замовлень",
        empty: "Замовлень не знайдено.",
        columns: {
          id: "ID",
          device: "Пристрій",
          client: "Клієнт",
          received: "Прийнято",
          status: "Статус",
        },
        labels: {
          device: "Пристрій",
          client: "Клієнт",
          received: "Прийнято",
        },
      },
      errors: {
        loadFailed: "Не вдалося завантажити частину даних головної сторінки.",
      },
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

    repairIntake: {
      title: "Нове приймання в ремонт",
      intro:
        "Клієнт, пристрій і замовлення будуть збережені разом в одній транзакції.",
      sections: {
        client: "Клієнт",
        device: "Пристрій",
        order: "Приймання в ремонт",
      },
      modes: {
        existing: "Наявний",
        new: "Новий",
      },
      fields: {
        existingClient: "Знайти наявного клієнта",
        existingDevice: "Вибрати наявний пристрій",
      },
      lookup: {
        checkPhone: "Перевірити телефон",
        checking: "Перевірка...",
        found: "Наявного клієнта знайдено та вибрано.",
        notFound: "Клієнта не знайдено. Продовжуйте створення нового клієнта.",
        failed: "Не вдалося перевірити номер телефону.",
      },
      helpers: {
        selectClientFirst: "Спочатку виберіть наявного клієнта.",
        noDevices: "У цього клієнта немає зареєстрованих пристроїв.",
        newClientNewDevice:
          "Новий клієнт має бути збережений разом із новим пристроєм.",
      },
      actions: {
        create: "Створити приймання",
        creating: "Створення...",
      },
      errors: {
        loadDevices: "Не вдалося завантажити пристрої.",
        save: "Не вдалося створити приймання в ремонт.",
        codes: {
          INTAKE_VALIDATION_FAILED: "Дані приймання заповнені неправильно.",
          INTAKE_CLIENT_NOT_FOUND: "Вибраного клієнта не знайдено.",
          INTAKE_CLIENT_PHONE_CONFLICT:
            "Клієнт із цим номером телефону вже існує.",
          INTAKE_CLIENT_EMAIL_CONFLICT:
            "Клієнт із цією електронною адресою вже існує.",
          INTAKE_DEVICE_NOT_FOUND: "Вибраний пристрій не знайдено.",
          INTAKE_DEVICE_CLIENT_MISMATCH:
            "Вибраний пристрій належить іншому клієнту.",
          INTAKE_DEVICE_IDENTIFIER_CONFLICT:
            "Пристрій із таким IMEI або серійним номером уже існує.",
          INTAKE_ORDER_VALIDATION_FAILED: "Дані замовлення заповнені неправильно.",
          INTAKE_RELATION_INVALID:
            "Вибраний клієнт або пристрій недійсний.",
          INTAKE_CREATE_FAILED: "Не вдалося створити приймання в ремонт.",
        },
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

    receipt: {
      title: "Квитанція про приймання в ремонт",
      serviceCopyTitle: "Протокол приймання в ремонт",
      customerCopyTitle: "Підтвердження приймання в ремонт",
      serviceCopy: "Примірник сервісу",
      customerCopy: "Примірник клієнта",
      loading: "Завантаження квитанції...",
      cutLine: "Лінія відриву",
      blankLine: "________________",
      printHint:
        "У вікні друку виберіть A4, масштаб 100% і вимкніть колонтитули браузера.",
      configurationWarning:
        "Реквізити сервісу не заповнені. Перед використанням квитанцій відредагуйте client/src/config/serviceReceiptConfig.ts.",
      confirmation:
        "Клієнт підтверджує, що пристрій, його видимий стан, комплектація та заявлена несправність зазначені правильно, а наведені нижче умови ремонту прийняті.",
      customerTerms:
        "Повні умови ремонту: {{url}}",
      fields: {
        identifiers: "IMEI / Серійний номер",
        receivedByCustomer: "Отримано клієнтом",
        paid: "Сплачено",
        stampAndSignature: "Печатка та підпис",
      },
      terms: {
        title: "Умови ремонту",
        item1:
          "Кінцева ціна та строк виконання можуть бути підтверджені лише після діагностики. За потреби додаткових робіт або витрат сервіс зв’язується з клієнтом.",
        item2:
          "Клієнт відповідає за резервне копіювання важливих даних до ремонту. Деякі ремонтні або програмні роботи можуть спричинити втрату даних.",
        item3:
          "Без PIN, пароля або графічного ключа вхідні та вихідні тести можуть бути обмежені. Сам код доступу в цій квитанції не друкується.",
        item4:
          "Після розбирання пристрою початкова водостійкість не гарантується, якщо інше окремо не підтверджено письмово.",
        item5:
          "Пристрої після контакту з рідиною, корозії, удару або пошкодження плати можуть мати приховані несправності, які проявляться під час діагностики чи ремонту.",
        item6:
          "Прийнятими разом із пристроєм вважаються лише ті аксесуари, які зазначені в цій квитанції.",
        item7:
          "Пристрій видається за цією квитанцією або після перевірки особи одержувача.",
        item8:
          "Невитребувані пристрої обробляються відповідно до опублікованих умов ремонту та чинного законодавства.",
        fullTerms:
          "Повні умови: {{url}}",
      },
      actions: {
        open: "Квитанція",
        back: "Назад до замовлення",
        print: "Друк / Зберегти PDF",
      },
      signatures: {
        customer: "Підпис клієнта",
        service: "Представник сервісу",
      },
      errors: {
        loadFailed: "Не вдалося завантажити квитанцію.",
      },
    },

    orderDetails: {
      title: "Замовлення {{number}}",
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
