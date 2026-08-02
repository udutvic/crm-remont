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
      inventory: "Склад",
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

    notFoundPage: {
      title: "Сторінку не знайдено",
      description:
        "Запитана сторінка CRM не існує або адресу введено неправильно.",
      back: "Повернутися",
      dashboard: "На головну",
    },

    orderFinance: {
      title: "Фінанси ремонту",
      subtitle:
        "Остаточна ціна є загальною сумою. Використані запчастини вже входять у неї.",
      customer: {
        total: "Остаточна ціна",
        parts: "Запчастини в ціні",
        labor: "Робота в ціні",
        discount: "Знижка",
      },
      parts: {
        title:
          "Запчастини, включені у вартість ремонту",
        empty:
          "У цьому ремонті ще немає використаних запчастин.",
        part: "Запчастина",
        quantity: "Кількість",
        unitPrice: "Ціна для клієнта",
        total: "Включено в ціну",
      },
      internal: {
        title:
          "Внутрішня економіка",
        partsCost:
          "Собівартість запчастин",
        otherCosts: "Інші витрати",
        profit:
          "Валовий прибуток",
        margin: "Маржа",
        adminOnly:
          "Закупівельні ціни, витрати та прибуток доступні лише адміністратору.",
      },
      dialog: {
        title:
          "Редагувати фінанси замовлення",
        finalPrice:
          "Остаточна ціна для клієнта",
        fixedTotalHint:
          "Запчастини не додаються зверху до остаточної ціни. Їхня вартість автоматично віднімається від частини роботи.",
        discount: "Знижка",
        otherCosts:
          "Інші внутрішні витрати",
        otherCostsHint:
          "Наприклад: доставка, витратні матеріали або стороння робота.",
      },
      partsEditor: {
        quantity: "Кількість",
        customerUnitPrice:
          "Ціна для клієнта за одиницю",
        customerTotal:
          "Включено в остаточну ціну",
        internalUnitCost:
          "Собівартість за одиницю",
        internalTotal:
          "Загальна собівартість",
      },
      finalPriceManaged:
        "Остаточна ціна змінюється у блоці фінансів ремонту.",
      actions: {
        edit: "Редагувати фінанси",
        cancel: "Скасувати",
        save: "Зберегти",
        saving: "Збереження...",
      },
      errors: {
        load:
          "Не вдалося завантажити фінанси замовлення.",
        save:
          "Не вдалося зберегти фінанси замовлення.",
        nonNegative:
          "Усі суми мають бути цілими числами не менше нуля.",
      },
    },

    orderPhotos: {
      title: "Фотографії ремонту",
      subtitle:
        "Приватні фотографії стану пристрою до, під час і після ремонту.",
      empty:
        "До цього замовлення ще не додано фотографій.",
      noCaption: "Без підпису",
      categories: {
        before: "До ремонту",
        during: "Під час ремонту",
        after: "Після ремонту",
      },
      upload: {
        title: "Додати фотографії",
        category: "Категорія",
        caption: "Підпис",
        choose: "Вибрати файли",
        camera: "Зробити фото",
        hint:
          "До 8 фотографій за раз. JPEG, PNG або WebP, до 8 MB кожна. Перед завантаженням фото автоматично зменшується.",
        selected:
          "Вибрано фотографій: {{count}}",
        progress:
          "Обробка й завантаження {{current}} з {{total}}: {{name}}",
      },
      actions: {
        add: "Додати фотографії",
        upload: "Завантажити",
        uploading: "Завантаження...",
        delete: "Видалити",
        cancel: "Скасувати",
        close: "Закрити",
      },
      deleteConfirmation:
        "Видалити цю фотографію без можливості відновлення?",
      success: {
        uploaded:
          "Фотографії завантажено: {{count}}.",
        deleted:
          "Фотографію видалено.",
      },
      errors: {
        load:
          "Не вдалося завантажити фотографії.",
        upload:
          "Не вдалося завантажити фотографію.",
        delete:
          "Не вдалося видалити фотографію.",
        notConfigured:
          "Сховище фотографій ще не налаштоване.",
        tooLarge:
          "Фото після стиснення завелике.",
        sourceTooLarge:
          "Файл {{name}} перевищує 8 MB або не вдалося стиснути його до безпечного розміру.",
        type:
          "Дозволені лише JPEG, PNG і WebP.",
        category:
          "Вибрана неправильна категорія.",
        caption:
          "Підпис не може перевищувати 500 символів.",
        count:
          "За один раз можна вибрати не більше 8 фотографій.",
        filesRequired:
          "Виберіть хоча б одну фотографію.",
        prepare:
          "Не вдалося обробити фотографію {{name}}.",
      },
    },

    orderParts: {
      title: "Використані запчастини",
      subtitle: "Запчастини, списані зі складу для цього ремонту.",
      add: "Додати запчастину",
      empty: "Для цього замовлення запчастини ще не списувалися.",
      totalCost: "Загальна собівартість запчастин",
      summary: {
        part: "Запчастина",
        issued: "Списано",
        returned: "Повернено",
        used: "Використано",
        unitCost: "Середня ціна списання",
        total: "Собівартість",
        stock: "Залишок",
        actions: "Дії",
      },
      history: {
        title: "Історія списань",
        date: "Дата",
        type: "Операція",
        quantity: "Кількість",
        unitCost: "Ціна списання",
        total: "Сума",
        user: "Працівник",
        note: "Примітка",
        issue: "Списання",
        return: "Повернення",
      },
      addDialog: {
        title: "Списати запчастину на замовлення",
        searchLabel: "Пошук за назвою, SKU або штрихкодом",
        searchHint: "Введіть щонайменше 2 символи.",
        noResults: "Запчастин не знайдено.",
        quantity: "Кількість",
        unitCost: "Ціна списання за одиницю",
        available: "Доступно",
        purchasePrice: "Закупівельна ціна",
        total: "Загальна сума списання",
        note: "Примітка",
      },
      returnDialog: {
        title: "Повернути запчастину на склад",
        description: "Запчастина: {{name}}. Зараз використано в замовленні: {{quantity}}.",
        quantity: "Кількість для повернення",
        unitCost: "Ціна повернення за одиницю",
        note: "Причина повернення",
      },
      actions: {
        cancel: "Скасувати",
        issue: "Списати",
        issuing: "Списання...",
        return: "Повернути",
        returning: "Повернення...",
      },
      validation: {
        quantity: "Вкажіть цілу кількість більше нуля.",
        stock: "На складі недостатньо запчастин.",
        cost: "Ціна має бути числом не менше нуля.",
        returnQuantity: "Кількість має бути не більшою за фактично списану.",
      },
      success: {
        issued: "Запчастину списано на замовлення.",
        returned: "Запчастину повернено на склад.",
      },
      errors: {
        returnExceeds: "Не можна повернути більше, ніж було списано на це замовлення.",
      },
    },

    inventoryPage: {
      title: "Склад",
      add: "Додати запчастину",
      refresh: "Оновити",
      clear: "Очистити",
      empty: "За вибраними фільтрами складських позицій не знайдено.",
      saving: "Збереження...",
      summary: {
        active: "Активні позиції",
        units: "Одиниць на складі",
        low: "Малий залишок",
        out: "Немає в наявності",
        purchase: "Закупівельна вартість",
        sale: "Потенційна вартість продажу",
      },
      filters: {
        search: "Пошук за SKU, штрихкодом, назвою або сумісністю",
        stock: "Рівень залишку",
        allStock: "Усі залишки",
        lowOnly: "Лише малий залишок",
        status: "Статус позиції",
        active: "Активні",
        inactive: "Неактивні",
        all: "Усі",
      },
      table: {
        item: "Запчастина",
        stock: "Залишок / мінімум",
        actions: "Дії",
      },
      stock: {
        ok: "Є в наявності",
        low: "Малий залишок",
        out: "Немає в наявності",
        inactive: "Неактивна",
      },
      actions: {
        edit: "Редагувати запчастину",
        movement: "Рух складу",
        history: "Історія рухів",
      },
      messages: {
        created: "Складську позицію створено.",
        updated: "Складську позицію оновлено.",
        movement: "Рух «{{type}}» записано.",
      },
      fields: {
        sku: "SKU",
        supplierSku: "Артикул постачальника",
        barcode: "Штрихкод",
        name: "Назва",
        category: "Категорія",
        brand: "Бренд",
        compatibility: "Сумісність",
        purchasePrice: "Закупівельна ціна",
        salePrice: "Ціна продажу",
        initialQuantity: "Початкова кількість",
        minStock: "Мінімальний залишок",
        supplier: "Постачальник",
        location: "Місце зберігання",
        note: "Примітка",
        active: "Активна позиція",
      },
      itemDialog: {
        add: "Додати складську позицію",
        edit: "Редагувати складську позицію",
        current: "Поточний залишок: {{quantity}}. Змінюйте його лише через рух складу.",
        quantityHint: "Кількість контролюється журналом і не редагується напряму.",
      },
      movementTypes: {
        receipt: "Надходження",
        issue: "Списання на ремонт",
        return: "Повернення з ремонту",
        adjustment: "Коригування залишку",
      },
      movement: {
        title: "Створити рух складу",
        type: "Тип руху",
        quantity: "Кількість",
        unitCost: "Вартість одиниці",
        order: "Замовлення на ремонт",
        save: "Записати рух",
        balance: "Зараз: {{current}} · після руху: {{projected}}",
        adjustmentHint: "Додатне число збільшує залишок, від’ємне — зменшує.",
        loadingOrders: "Завантаження замовлень...",
        noOrders: "Немає доступних замовлень на ремонт.",
      },
      history: {
        title: "Історія рухів — {{name}}",
        empty: "Рухів складу ще немає.",
        date: "Дата",
        type: "Тип",
        change: "Зміна",
        balance: "Залишок",
        order: "Замовлення",
        user: "Працівник",
      },
      validation: {
        required: "Це поле обов’язкове.",
        price: "Введіть коректну невід’ємну ціну.",
        quantity: "Введіть невід’ємне ціле число.",
        stock: "Після руху залишок став би від’ємним.",
      },
      errors: {
        loadFailed: "Не вдалося завантажити склад.",
        saveFailed: "Не вдалося зберегти складську позицію.",
        movementFailed: "Не вдалося записати рух складу.",
        historyFailed: "Не вдалося завантажити історію рухів.",
        ordersFailed: "Не вдалося завантажити замовлення.",
        previewFailed: "Не вдалося виконати попередню перевірку імпорту.",
        importFailed: "Не вдалося завершити імпорт складу.",

      },
      import: {
        title: "Імпорт складу з Excel або CSV",
        open: "Імпорт Excel / CSV",
        chooseFile: "Вибрати файл",
        changeFile: "Змінити файл",
        downloadTemplate: "Завантажити шаблон CSV",
        fileHint: "Підтримуються формати .xlsx, .xls та .csv. Перший непорожній рядок використовується як заголовок колонок. За один раз можна імпортувати не більше 1000 рядків.",
        sheet: "Аркуш",
        sheetInfo: "Рядок заголовків: {{header}} · рядків даних: {{rows}}",
        mappingTitle: "Зіставлення колонок",
        mappingHint: "Колонки розпізнаються автоматично, коли це можливо. Перед попереднім переглядом перевірте обов’язкові поля SKU, Назва і Категорія.",
        notMapped: "Не зіставлено",
        preview: "Перевірити імпорт",
        previewing: "Перевірка...",
        previewTitle: "Попередній перегляд імпорту",
        executionTitle: "Налаштування імпорту",
        duplicateAction: "Дія для наявних позицій",
        skipInvalid: "Пропустити {{count}} неправильних або конфліктних рядків та імпортувати решту",
        execute: "Імпортувати склад",
        importing: "Імпорт...",
        reportTitle: "Імпорт завершено",
        importAnother: "Імпортувати інший файл",
        completedMessage: "Імпорт складу завершено: створено {{created}}, оновлено {{updated}}.",
        fields: {
          sku: "SKU",
          supplierSku: "Артикул постачальника",
          barcode: "Штрихкод",
          name: "Назва",
          category: "Категорія",
          brand: "Бренд",
          compatibility: "Сумісність",
          purchasePrice: "Закупівельна ціна",
          salePrice: "Ціна продажу",
          quantity: "Кількість",
          minStock: "Мінімальний залишок",
          supplier: "Постачальник",
          location: "Місце зберігання",
          note: "Примітка",
          isActive: "Активна",
          action: "Дія для окремого рядка",
        },
        previewSummary: {
          totalRows: "Усього рядків",
          newRows: "Нові",
          duplicateRows: "Наявні",
          invalidRows: "Неправильні",
          conflictRows: "Конфлікти",
          fileDuplicateRows: "Повтори у файлі",
        },
        columns: {
          row: "Рядок",
          status: "Статус",
          match: "Знайдена позиція",
          problems: "Помилки / попередження",
        },
        status: {
          new: "Нова",
          duplicate: "Наявна",
          invalid: "Неправильна",
          conflict: "Конфлікт",
          file_duplicate: "Повтор у файлі",
        },
        duplicateActions: {
          skip: "Пропустити наявні позиції",
          update: "Оновити дані, не змінювати залишок",
          add_quantity: "Оновити дані та додати кількість",
          replace: "Оновити дані та замінити залишок",
        },
        duplicateHelp: {
          skip: "Наявні складські позиції залишаться без змін.",
          update: "Зіставлені дані позиції оновляться, але поточний залишок не зміниться.",
          add_quantity: "Кількість із файлу додасться до поточного залишку та створиться рух надходження.",
          replace: "Поточний залишок буде скоригований до кількості з файлу та створиться рух коригування.",
        },
        report: {
          created: "Створено",
          updated: "Оновлено",
          quantityAdded: "Додано кількість",
          quantityReplaced: "Замінено залишок",
          skipped: "Пропущено",
          skippedInvalid: "Пропущено неправильних",
          movementsCreated: "Створено рухів",
          quantityDelta: "Загальна зміна кількості",
        },
        errors: {
          unsupportedFile: "Виберіть файл .xlsx, .xls або .csv.",
          emptyFile: "Вибраний файл або аркуш не містить придатних даних.",
          fileRead: "Не вдалося прочитати файл.",
          tooManyRows: "Зменште файл до 1000 рядків даних або менше.",
          requiredMapping: "Зіставте обов’язкові колонки SKU, Назва і Категорія.",
          quantityMappingRequired: "Для вибраної стратегії дублікатів зіставте колонку Кількість.",
          blocked: "Імпорт містить неправильні, конфліктні або повторювані рядки. Виправте їх або явно дозвольте пропуск таких рядків.",
          rowsRequired: "Не передано рядків для імпорту.",
          tooLarge: "За один раз можна імпортувати не більше 1000 рядків.",
          invalidAction: "Одна з дій не підходить для відповідного рядка.",
          invalidStrategy: "Вибрана стратегія дублікатів не підтримується.",
          conflict: "Деякі ідентифікатори вказують на різні складські позиції.",
          server: "Під час імпорту складу сталася помилка сервера.",
        },
      },
      apiErrors: {
        validation: "Перевірте введені дані складської позиції.",
        filter: "Один із фільтрів складу некоректний.",
        invalidId: "Некоректний ID складської позиції.",
        notFound: "Складську позицію не знайдено.",
        skuExists: "Позиція з таким SKU вже існує.",
        supplierSkuExists: "Позиція з таким артикулом постачальника вже існує.",
        barcodeExists: "Позиція з таким штрихкодом уже існує.",
        duplicate: "Позиція з такими ідентифікаторами вже існує.",
        directQuantity: "Кількість можна змінювати лише через рух складу.",
        emptyUpdate: "Не передано полів для оновлення.",
        inactive: "Для неактивної позиції не можна створювати рухи.",
        orderNotFound: "Вибране замовлення не знайдено.",
        stock: "На складі недостатньо одиниць для цього руху.",
        server: "У модулі складу сталася помилка сервера.",
        forbidden: "У вас немає прав для цієї складської операції.",
        auth: "Сесія завершилася. Увійдіть знову.",
      },
    },
    profilePages: {
      clientProfile: "Картка клієнта",
      deviceProfile: "Картка пристрою",
      clientSince: "Клієнт із {{date}}",
      deviceSince: "Пристрій додано {{date}}",
      contactInformation: "Контактна інформація",
      clientDevices: "Пристрої клієнта",
      repairHistory: "Історія ремонтів",
      owner: "Власник",
      identifiers: "Ідентифікатори",
      delivered: "Видано",
      noIdentifier: "Ідентифікатор відсутній",
      unknownClient: "Невідомий клієнт",
      fields: { phone: "Телефон", secondaryPhone: "Додатковий телефон", email: "Email", address: "Адреса", note: "Примітка", imei1: "IMEI 1", imei2: "IMEI 2", serial: "Серійний номер", color: "Колір" },
      stats: { devices: "Пристроїв", repairs: "Ремонтів", activeRepairs: "Активних ремонтів", completedIncome: "Вартість завершених ремонтів", lastRepair: "Останній ремонт" },
      status: { pending: "Очікує", in_progress: "У роботі", completed: "Завершено", cancelled: "Скасовано", unrepairable: "Не ремонтується" },
      empty: { devices: "У клієнта ще немає пристроїв.", repairs: "Історія ремонтів поки порожня." },
      actions: { backToClients: "Назад до клієнтів", backToDevices: "Назад до пристроїв", newRepair: "Нове приймання", retry: "Повторити" },
      errors: { invalidClient: "Некоректний ID клієнта.", invalidDevice: "Некоректний ID пристрою.", clientLoad: "Не вдалося завантажити картку клієнта.", deviceLoad: "Не вдалося завантажити картку пристрою." },
    },

    staffPage: {
      title: "Працівники",
      addStaff: "Додати працівника",
      securityNotice:
        "Обліковими записами працівників можуть керувати лише адміністратори. Зміни паролів, ролей, активності та завершення сесій записуються в журнал дій.",
      empty: "За вибраними фільтрами працівників не знайдено.",
      currentAccount: "Поточний обліковий запис",
      activeSessions: "Сесій: {{count}}",
      lastLogin: "Останній вхід",
      passwordChanged: "Пароль змінено",
      never: "Ніколи",
      passwordHint: "Пароль повинен містити щонайменше 12 символів.",
      selfProtection:
        "Для безпеки не можна деактивувати власний обліковий запис або забрати в себе роль адміністратора.",
      roles: {
        all: "Усі ролі",
        admin: "Адміністратор",
        technician: "Технік",
      },
      status: {
        all: "Усі статуси",
        active: "Активний",
        inactive: "Неактивний",
      },
      filters: {
        search: "Пошук",
        searchPlaceholder: "Ім’я або email",
        role: "Роль",
        status: "Статус",
        reset: "Скинути",
      },
      fields: {
        name: "Ім’я",
        email: "Email",
        role: "Роль",
        active: "Обліковий запис активний",
        password: "Пароль",
        newPassword: "Новий пароль",
        confirmPassword: "Підтвердження пароля",
      },
      actions: {
        create: "Створити працівника",
        edit: "Редагувати",
        save: "Зберегти",
        saving: "Збереження...",
        resetPassword: "Змінити пароль",
        revokeSessions: "Завершити сесії",
        confirmRevoke: "Завершити сесії",
        refresh: "Оновити",
        showPassword: "Показати пароль",
        hidePassword: "Приховати пароль",
      },
      dialogs: {
        createTitle: "Створення облікового запису працівника",
        editTitle: "Редагування: {{name}}",
        passwordTitle: "Новий пароль для {{name}}",
        passwordMessage:
          "Після зміни пароля всі активні сесії цього працівника будуть завершені.",
        selfPasswordMessage:
          "Поточна сесія у цьому браузері залишиться активною. Інші ваші сесії будуть завершені.",
        revokeTitle: "Завершити активні сесії?",
        revokeMessage:
          "Працівник {{name}} має {{count}} активних сесій. Йому потрібно буде увійти повторно.",
        selfRevokeMessage:
          "Поточна сесія у цьому браузері залишиться активною. Буде завершено до {{count}} інших сесій.",
      },
      messages: {
        created: "Обліковий запис працівника створено.",
        updated: "Дані працівника оновлено.",
        passwordReset: "Пароль змінено, старі сесії завершено.",
        sessionsRevoked: "Завершено сесій: {{count}}.",
      },
      validation: {
        passwordMismatch: "Паролі не збігаються.",
      },
      errors: {
        loadFailed: "Не вдалося завантажити працівників.",
        createFailed: "Не вдалося створити обліковий запис працівника.",
        updateFailed: "Не вдалося оновити дані працівника.",
        passwordFailed: "Не вдалося змінити пароль.",
        revokeFailed: "Не вдалося завершити активні сесії.",
      },
      apiErrors: {
        STAFF_EMAIL_EXISTS: "Працівник із таким email уже існує.",
        STAFF_SELF_DEACTIVATE_FORBIDDEN: "Не можна деактивувати власний обліковий запис.",
        STAFF_SELF_DEMOTE_FORBIDDEN: "Не можна забрати в себе роль адміністратора.",
        STAFF_LAST_ADMIN_REQUIRED: "Повинен залишитися хоча б один активний адміністратор.",
        STAFF_NOT_FOUND: "Обліковий запис працівника не знайдено.",
        STAFF_VALIDATION_FAILED: "Перевірте введені дані працівника.",
      },
      pagination: {
        rowsPerPage: "Працівників на сторінці:",
        displayedRows: "{{from}}–{{to}} з {{count}}",
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
        staff_user: "Працівник",
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
        STAFF_USER_CREATE: "Створено працівника",
        STAFF_USER_UPDATE: "Оновлено працівника",
        STAFF_USER_PASSWORD_RESET: "Змінено пароль працівника",
        STAFF_USER_SESSIONS_REVOKE: "Завершено сесії працівника",
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
      confirmGeneric:
        "Ви впевнені, що хочете видалити цей запис?",
      confirmItem:
        'Ви впевнені, що хочете видалити "{{name}}"?',
      itemNumber: "запис №{{id}}",
      errors: {
        clientHasOrders:
          "Неможливо видалити клієнта, оскільки з ним пов’язані замовлення на ремонт.",
        clientHasDevices:
          "Неможливо видалити клієнта, оскільки за ним закріплені пристрої.",
        deviceHasOrders:
          "Неможливо видалити пристрій, оскільки з ним пов’язані замовлення на ремонт.",
        clientNotFound:
          "Клієнта не знайдено.",
        deviceNotFound:
          "Пристрій не знайдено.",
        orderNotFound:
          "Замовлення не знайдено.",
        invalidClient:
          "Некоректний ID клієнта.",
        invalidDevice:
          "Некоректний ID пристрою.",
        invalidOrder:
          "Некоректний ID замовлення.",
        forbidden:
          "У вас немає прав для видалення цього запису.",
        notFound:
          "Запис не знайдено або його вже видалено.",
        conflict:
          "Цей запис неможливо видалити, оскільки він використовується в інших даних.",
        server:
          "Під час видалення сталася помилка сервера.",
        deleteFailed:
          "Не вдалося видалити запис.",
      },
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
        saving: "Збереження...",
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
        saving: "Збереження...",
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
