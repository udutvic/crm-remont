const intakeWizardTranslations = {
  en: {
    intakeWizard: {
      badge: "New intake",
      title: "Device repair intake",
      subtitle:
        "A complete workflow from customer details to final order review.",
      stepCounter: "Step {{current}} of {{total}}",

      steps: {
        customerDevice: "Customer and device",
        inspection: "Device condition",
        repairPlan: "Diagnostics and plan",
        priceParts: "Price and parts",
        review: "Review",
      },

      actions: {
        back: "Back",
        continue: "Continue",
        createLater: "Order creation will be connected later",
        add: "Add",
        addModel: "Add new model",
        addColor: "Add color",
        addLine: "Add price item",
        addPart: "Add another part",
        clearPattern: "Clear pattern",
      },

      customer: {
        title: "Customer information",
        subtitle:
          "Find an existing customer or create a new one.",
        fullName: "Full name",
        phone: "Phone",
        phonePlaceholder: "+420 777 123 456",
        secondaryPhone: "Secondary phone",
        email: "E-mail",
        address: "Address",
        note: "Customer note",
        notePlaceholder: "Internal information about the customer",
        lookupHint:
          "After entering a phone number, matching customers and their devices will appear here.",
        foundTitle: "Found customers",
        selectExisting: "Select existing",
        searchAll: "Search all customers",
        searchPlaceholder: "Name, phone or e-mail",
      },

      device: {
        title: "Device information",
        subtitle:
          "Choose a model from the catalogue or enter the device manually.",
        modelSearch: "Search model",
        modelSearchPlaceholder: "For example iPhone 15 Pro Max",
        popularModels: "Most frequently used",
        type: "Device type",
        brand: "Brand",
        brandPlaceholder: "Apple",
        model: "Model",
        modelPlaceholder: "iPhone 15 Pro Max",
        color: "Color",
        colorPlaceholder: "Natural Titanium",
        imei1: "IMEI 1",
        imei2: "IMEI 2",
        imeiHint: "Optional, 15 digits",
        serial: "Serial number",
        serialPlaceholder: "Enter serial number",
        types: {
          phone: "Phone",
          tablet: "Tablet",
          laptop: "Laptop",
          smartwatch: "Smartwatch",
          other: "Other",
        },
      },

      access: {
        title: "Device access information",
        subtitle:
          "The access credential will be stored encrypted.",
        type: "Access type",
        code: "Access code",
        codePlaceholder: "Enter access code",
        verified: "Access verified",
        patternTitle: "Draw unlock pattern",
        patternHint:
          "The interactive 3 × 3 pattern will be connected in the next package.",
        types: {
          none: "No access code",
          pin: "PIN",
          password: "Password",
          pattern: "Pattern",
          unknown: "Unknown",
        },
      },

      inspection: {
        overallTitle: "Overall device condition",
        overallSubtitle:
          "Quick condition assessment at intake.",
        visualTitle: "Visual condition details",
        note: "Note",
        notePlaceholder: "Describe details",
        overall: {
          likeNew: {
            label: "Like new",
            description:
              "Excellent condition without visible damage.",
          },
          lightWear: {
            label: "Lightly worn",
            description:
              "Minor signs of use without effect on operation.",
          },
          normalWear: {
            label: "Normally worn",
            description:
              "Visible signs of use, small scratches and scuffs.",
          },
          heavyWear: {
            label: "Heavily worn",
            description:
              "Strong wear, scratches, dents or cosmetic damage.",
          },
        },
        groups: {
          display: {
            title: "Display",
            hairlineScratches: "Hairline scratches",
            deepScratches: "Deep scratches",
            cracked: "Cracked display",
            deadPixels: "Dead pixels",
            colorSpots: "Color spots",
            lifting: "Display is lifting",
          },
          rearGlass: {
            title: "Rear glass",
            scratches: "Scratches",
            cracked: "Cracked rear glass",
            looseCover: "Loose rear cover",
          },
          camera: {
            title: "Camera",
            crackedLens: "Cracked camera lens",
            scratchedLens: "Scratched lens",
            replaced: "Camera replaced",
          },
          frame: {
            title: "Frame",
            scratches: "Scratches",
            scuffs: "Scuffs",
            dents: "Dents",
            bent: "Bent frame",
            paintLoss: "Paint loss",
          },
        },
        additional: {
          title: "Other detected defects",
          noPower: "Does not power on",
          restarts: "Restarts",
          oxidation: "Oxidation / liquid damage",
          swollenBattery: "Swollen battery",
          missingSimTray: "Missing SIM tray",
          missingScrews: "Missing screws",
          note: "Other defect note",
        },
        contamination: {
          title: "Contamination",
          heavy: "Heavily contaminated device",
          speaker: "Clogged speaker",
          microphone: "Clogged microphone",
          chargingPort: "Clogged charging connector",
          liquidTraces: "Liquid traces",
          note: "Contamination note",
        },
        battery: {
          title: "Battery condition",
          level90: "90–100%",
          level80: "80–89%",
          level70: "70–79%",
          below70: "Below 70%",
          unknown: "Cannot determine",
        },
      },

      repair: {
        problemTitle: "Problem and preliminary diagnosis",
        customerProblem: "Problem described by customer",
        diagnosis: "Preliminary diagnosis",
        typeTitle: "Repair type",
        typeSearch: "Search repair type",
        frequentTypes: "Most common repairs",
        otherType: "Other",
        otherPlaceholder: "Describe another repair type",
        types: {
          displayOriginal: "Original-quality display replacement",
          displayPremium: "Premium-quality display replacement",
          displayGlass: "Display glass replacement",
          batteryOriginal: "Original-quality battery replacement",
          batteryPremium: "Premium-quality battery replacement",
          rearGlass: "Rear glass replacement",
          rearCover: "Rear cover replacement",
          diagnostics: "Diagnostics",
        },
        risksTitle: "Risks and warnings",
        risksSubtitle:
          "Selected risks will be included in the intake protocol.",
        risks: {
          dataLoss: "Risk of data loss",
          unrepairable: "The device may be unrepairable",
          noWarranty: "Repair without warranty",
          hiddenDefects:
            "Hidden defects may affect the repair result",
          waterDamage:
            "Liquid damage repair without warranty",
          nonOriginalPart:
            "Non-original parts may affect functionality",
          waterResistance:
            "The device may lose water resistance",
        },
        riskNote: "Additional risk or note",
      },

      price: {
        title: "Repair price",
        targetPrice: "Total repair price",
        breakdown: "Price breakdown",
        partLine: "Part",
        laborLine: "Labor",
        currency: "CZK",
        approvalTitle: "Repair approval",
        approval: {
          approved: "Price approved by customer",
          contact: "Contact customer before repair",
          afterApproval: "Repair only after approval",
        },
      },

      schedule: {
        title: "Estimated repair time",
        options: {
          within24Hours: "Within 24 hours",
          oneTwoDays: "1–2 days",
          twoThreeDays: "2–3 days",
          threeFiveDays: "3–5 days",
          weekOrMore: "One week or more",
          customDate: "Custom date",
        },
        date: "Select date",
      },

      parts: {
        title: "Assigned parts",
        search: "Search part by name or SKU",
        selected: "Selected parts",
        sampleName: "iPhone 13 display (OLED OEM)",
        sampleSku: "DISP-13-OEM-2026-000123",
        samplePrice: "1,200 CZK",
        conditionNew: "New",
        reservationHint:
          "The selected part will be reserved first. Actual stock issue will occur when it is used.",
      },

      communication: {
        title: "Customer communication",
        subtitle: "Notify after completion via:",
        call: "Phone call",
        sms: "SMS",
        email: "E-mail",
        note: "Communication note",
        notePlaceholder:
          "The customer prefers SMS; call only if necessary.",
      },

      review: {
        hint:
          "A complete review of all entered data will appear here before the order is created.",
        sections: {
          customer: {
            title: "Customer",
            contact: "Name and contact details",
            note: "Address and customer note",
          },
          device: {
            title: "Device",
            identity: "Model, color, IMEI and serial number",
            access: "Access type and verification",
          },
          inspection: {
            title: "Intake condition",
            visual: "Visual inspection and detected defects",
            battery: "Contamination and battery condition",
          },
          repair: {
            title: "Repair",
            type: "Repair type and diagnosis",
            risks: "Warnings and risks",
          },
          price: {
            title: "Price and parts",
            breakdown: "Price breakdown and approval",
            parts: "Assigned stock parts",
          },
          communication: {
            title: "Completion",
            channels: "Customer notification channels",
            deadline: "Estimated completion date",
          },
        },
      },
    },
  },

  uk: {
    intakeWizard: {
      badge: "Новий прийом",
      title: "Прийом пристрою в ремонт",
      subtitle:
        "Повний процес від даних клієнта до фінальної перевірки замовлення.",
      stepCounter: "Крок {{current}} із {{total}}",

      steps: {
        customerDevice: "Клієнт і пристрій",
        inspection: "Стан пристрою",
        repairPlan: "Діагностика і план",
        priceParts: "Ціна і деталі",
        review: "Перевірка",
      },

      actions: {
        back: "Назад",
        continue: "Продовжити",
        createLater: "Створення замовлення підключимо пізніше",
        add: "Додати",
        addModel: "Додати нову модель",
        addColor: "Додати колір",
        addLine: "Додати позицію ціни",
        addPart: "Додати ще одну деталь",
        clearPattern: "Очистити ключ",
      },

      customer: {
        title: "Інформація про клієнта",
        subtitle:
          "Знайдіть наявного клієнта або створіть нового.",
        fullName: "Ім’я та прізвище",
        phone: "Телефон",
        phonePlaceholder: "+420 777 123 456",
        secondaryPhone: "Другий телефон",
        email: "E-mail",
        address: "Адреса",
        note: "Примітка про клієнта",
        notePlaceholder: "Внутрішня інформація про клієнта",
        lookupHint:
          "Після введення телефону тут з’являться знайдені клієнти та їхні пристрої.",
        foundTitle: "Знайдені клієнти",
        selectExisting: "Вибрати наявного",
        searchAll: "Пошук усіх клієнтів",
        searchPlaceholder: "Ім’я, телефон або e-mail",
      },

      device: {
        title: "Інформація про пристрій",
        subtitle:
          "Виберіть модель із каталогу або введіть пристрій вручну.",
        modelSearch: "Знайти модель",
        modelSearchPlaceholder: "Наприклад iPhone 15 Pro Max",
        popularModels: "Найчастіше використовувані",
        type: "Тип пристрою",
        brand: "Бренд",
        brandPlaceholder: "Apple",
        model: "Модель",
        modelPlaceholder: "iPhone 15 Pro Max",
        color: "Колір",
        colorPlaceholder: "Natural Titanium",
        imei1: "IMEI 1",
        imei2: "IMEI 2",
        imeiHint: "Необов’язково, 15 цифр",
        serial: "Серійний номер",
        serialPlaceholder: "Введіть серійний номер",
        types: {
          phone: "Телефон",
          tablet: "Планшет",
          laptop: "Ноутбук",
          smartwatch: "Смартгодинник",
          other: "Інше",
        },
      },

      access: {
        title: "Інформація про доступ до пристрою",
        subtitle:
          "Дані доступу зберігатимуться в зашифрованому вигляді.",
        type: "Тип доступу",
        code: "Код доступу",
        codePlaceholder: "Введіть код доступу",
        verified: "Доступ перевірено",
        patternTitle: "Намалюйте графічний ключ",
        patternHint:
          "Інтерактивну сітку 3 × 3 підключимо в наступному пакеті.",
        types: {
          none: "Без коду доступу",
          pin: "PIN",
          password: "Пароль",
          pattern: "Графічний ключ",
          unknown: "Невідомо",
        },
      },

      inspection: {
        overallTitle: "Загальний стан пристрою",
        overallSubtitle:
          "Швидка оцінка стану під час приймання.",
        visualTitle: "Детальний візуальний стан",
        note: "Примітка",
        notePlaceholder: "Опишіть деталі",
        overall: {
          likeNew: {
            label: "Як новий",
            description:
              "Відмінний стан без видимих пошкоджень.",
          },
          lightWear: {
            label: "Легке зношення",
            description:
              "Незначні сліди використання без впливу на роботу.",
          },
          normalWear: {
            label: "Звичайне зношення",
            description:
              "Видимі сліди використання, дрібні подряпини й потертості.",
          },
          heavyWear: {
            label: "Сильне зношення",
            description:
              "Сильні потертості, подряпини, вм’ятини або косметичні дефекти.",
          },
        },
        groups: {
          display: {
            title: "Дисплей",
            hairlineScratches: "Дрібні подряпини",
            deepScratches: "Глибокі подряпини",
            cracked: "Тріснутий дисплей",
            deadPixels: "Мертві пікселі",
            colorSpots: "Кольорові плями",
            lifting: "Дисплей відклеюється",
          },
          rearGlass: {
            title: "Заднє скло",
            scratches: "Подряпини",
            cracked: "Тріснуте заднє скло",
            looseCover: "Відклеєна задня кришка",
          },
          camera: {
            title: "Камера",
            crackedLens: "Тріснуте скло камери",
            scratchedLens: "Подряпане скло",
            replaced: "Камера замінена",
          },
          frame: {
            title: "Рамка",
            scratches: "Подряпини",
            scuffs: "Потертості",
            dents: "Вм’ятини",
            bent: "Зігнута рамка",
            paintLoss: "Облуплена фарба",
          },
        },
        additional: {
          title: "Інші виявлені несправності",
          noPower: "Не вмикається",
          restarts: "Перезавантажується",
          oxidation: "Окислення / залиття",
          swollenBattery: "Надута батарея",
          missingSimTray: "Відсутній SIM-лоток",
          missingScrews: "Відсутні гвинти",
          note: "Примітка про іншу несправність",
        },
        contamination: {
          title: "Забруднення",
          heavy: "Сильно забруднений пристрій",
          speaker: "Забитий динамік",
          microphone: "Забитий мікрофон",
          chargingPort: "Забитий зарядний роз’єм",
          liquidTraces: "Сліди рідини",
          note: "Примітка про забруднення",
        },
        battery: {
          title: "Стан батареї",
          level90: "90–100%",
          level80: "80–89%",
          level70: "70–79%",
          below70: "Менше 70%",
          unknown: "Не вдалося визначити",
        },
      },

      repair: {
        problemTitle: "Проблема і попередня діагностика",
        customerProblem: "Опис проблеми клієнтом",
        diagnosis: "Попередня діагностика",
        typeTitle: "Тип ремонту",
        typeSearch: "Знайти тип ремонту",
        frequentTypes: "Найчастіші ремонти",
        otherType: "Інше",
        otherPlaceholder: "Опишіть інший тип ремонту",
        types: {
          displayOriginal: "Заміна дисплея оригінальної якості",
          displayPremium: "Заміна дисплея преміальної якості",
          displayGlass: "Заміна скла дисплея",
          batteryOriginal: "Заміна батареї оригінальної якості",
          batteryPremium: "Заміна батареї преміальної якості",
          rearGlass: "Заміна заднього скла",
          rearCover: "Заміна задньої кришки",
          diagnostics: "Діагностика",
        },
        risksTitle: "Ризики та попередження",
        risksSubtitle:
          "Вибрані ризики буде додано до приймального протоколу.",
        risks: {
          dataLoss: "Ризик втрати даних",
          unrepairable: "Пристрій може виявитися неремонтопридатним",
          noWarranty: "Ремонт без гарантії",
          hiddenDefects:
            "Приховані дефекти можуть вплинути на результат ремонту",
          waterDamage: "Ремонт після залиття без гарантії",
          nonOriginalPart:
            "Неоригінальні деталі можуть впливати на роботу",
          waterResistance:
            "Пристрій може втратити водонепроникність",
        },
        riskNote: "Додатковий ризик або примітка",
      },

      price: {
        title: "Ціна ремонту",
        targetPrice: "Загальна ціна ремонту",
        breakdown: "Розклад ціни",
        partLine: "Деталь",
        laborLine: "Робота",
        currency: "Kč",
        approvalTitle: "Погодження ремонту",
        approval: {
          approved: "Ціну погоджено з клієнтом",
          contact: "Зв’язатися з клієнтом перед ремонтом",
          afterApproval: "Ремонтувати лише після погодження",
        },
      },

      schedule: {
        title: "Орієнтовний строк ремонту",
        options: {
          within24Hours: "До 24 годин",
          oneTwoDays: "1–2 дні",
          twoThreeDays: "2–3 дні",
          threeFiveDays: "3–5 днів",
          weekOrMore: "Тиждень і більше",
          customDate: "Власна дата",
        },
        date: "Виберіть дату",
      },

      parts: {
        title: "Призначені деталі",
        search: "Знайти деталь за назвою або SKU",
        selected: "Вибрані деталі",
        sampleName: "Дисплей iPhone 13 (OLED OEM)",
        sampleSku: "DISP-13-OEM-2026-000123",
        samplePrice: "1 200 Kč",
        conditionNew: "Новий",
        reservationHint:
          "Спочатку деталь буде зарезервована. Фактичне списання відбудеться після використання.",
      },

      communication: {
        title: "Комунікація з клієнтом",
        subtitle: "Після завершення повідомити через:",
        call: "Телефонний дзвінок",
        sms: "SMS",
        email: "E-mail",
        note: "Примітка для комунікації",
        notePlaceholder:
          "Клієнт віддає перевагу SMS; телефонувати лише за потреби.",
      },

      review: {
        hint:
          "Перед створенням замовлення тут буде повна перевірка всіх введених даних.",
        sections: {
          customer: {
            title: "Клієнт",
            contact: "Ім’я та контактні дані",
            note: "Адреса та примітка клієнта",
          },
          device: {
            title: "Пристрій",
            identity: "Модель, колір, IMEI та серійний номер",
            access: "Тип доступу та його перевірка",
          },
          inspection: {
            title: "Стан під час приймання",
            visual: "Візуальний огляд і виявлені дефекти",
            battery: "Забруднення та стан батареї",
          },
          repair: {
            title: "Ремонт",
            type: "Тип ремонту та діагностика",
            risks: "Попередження і ризики",
          },
          price: {
            title: "Ціна і деталі",
            breakdown: "Розклад ціни та погодження",
            parts: "Призначені складські деталі",
          },
          communication: {
            title: "Завершення",
            channels: "Канали сповіщення клієнта",
            deadline: "Орієнтовна дата завершення",
          },
        },
      },
    },
  },

  cs: {
    intakeWizard: {
      badge: "Nový příjem",
      title: "Příjem zařízení do opravy",
      subtitle:
        "Kompletní postup od údajů zákazníka po finální kontrolu zakázky.",
      stepCounter: "Krok {{current}} z {{total}}",

      steps: {
        customerDevice: "Zákazník a zařízení",
        inspection: "Stav zařízení",
        repairPlan: "Diagnostika a plán",
        priceParts: "Cena a díly",
        review: "Kontrola",
      },

      actions: {
        back: "Zpět",
        continue: "Pokračovat",
        createLater: "Vytvoření zakázky zapojíme později",
        add: "Přidat",
        addModel: "Přidat nový model",
        addColor: "Přidat barvu",
        addLine: "Přidat položku ceny",
        addPart: "Přidat další díl",
        clearPattern: "Vymazat gesto",
      },

      customer: {
        title: "Informace o zákazníkovi",
        subtitle:
          "Vyhledejte existujícího zákazníka nebo založte nového.",
        fullName: "Celé jméno",
        phone: "Telefon",
        phonePlaceholder: "+420 777 123 456",
        secondaryPhone: "Druhý telefon",
        email: "E-mail",
        address: "Adresa",
        note: "Poznámka zákazníka",
        notePlaceholder: "Interní informace o zákazníkovi",
        lookupHint:
          "Po zadání telefonu se zde zobrazí nalezení zákazníci a jejich zařízení.",
        foundTitle: "Nalezení zákazníci",
        selectExisting: "Vybrat existující",
        searchAll: "Vyhledat všechny zákazníky",
        searchPlaceholder: "Jméno, telefon nebo e-mail",
      },

      device: {
        title: "Informace o zařízení",
        subtitle:
          "Vyberte model z katalogu nebo zadejte zařízení ručně.",
        modelSearch: "Vyhledat model",
        modelSearchPlaceholder: "Například iPhone 15 Pro Max",
        popularModels: "Nejčastěji používané",
        type: "Typ zařízení",
        brand: "Značka",
        brandPlaceholder: "Apple",
        model: "Model",
        modelPlaceholder: "iPhone 15 Pro Max",
        color: "Barva",
        colorPlaceholder: "Natural Titanium",
        imei1: "IMEI 1",
        imei2: "IMEI 2",
        imeiHint: "Volitelné, 15 číslic",
        serial: "Sériové číslo",
        serialPlaceholder: "Zadejte sériové číslo",
        types: {
          phone: "Telefon",
          tablet: "Tablet",
          laptop: "Notebook",
          smartwatch: "Chytré hodinky",
          other: "Jiné",
        },
      },

      access: {
        title: "Informace o přístupu k zařízení",
        subtitle:
          "Přístupový údaj bude uložen šifrovaně.",
        type: "Typ přístupu",
        code: "Přístupový kód",
        codePlaceholder: "Zadejte přístupový kód",
        verified: "Přístup ověřen",
        patternTitle: "Nakreslete gesto odemknutí",
        patternHint:
          "Interaktivní mřížku 3 × 3 zapojíme v dalším balíku.",
        types: {
          none: "Bez přístupového kódu",
          pin: "PIN",
          password: "Heslo",
          pattern: "Gesto",
          unknown: "Neznámé",
        },
      },

      inspection: {
        overallTitle: "Celkový stav zařízení",
        overallSubtitle:
          "Rychlé hodnocení stavu při převzetí.",
        visualTitle: "Vizuální stav – detaily",
        note: "Poznámka",
        notePlaceholder: "Popište detaily",
        overall: {
          likeNew: {
            label: "Jako nové",
            description:
              "Výborný stav bez viditelných poškození.",
          },
          lightWear: {
            label: "Lehce opotřebené",
            description:
              "Lehké známky používání bez vlivu na funkčnost.",
          },
          normalWear: {
            label: "Běžně opotřebené",
            description:
              "Viditelné známky používání, drobné škrábance a oděrky.",
          },
          heavyWear: {
            label: "Silně opotřebené",
            description:
              "Výrazné opotřebení, škrábance, oděrky nebo kosmetické vady.",
          },
        },
        groups: {
          display: {
            title: "Displej",
            hairlineScratches: "Vlasové škrábance",
            deepScratches: "Hlubší škrábance",
            cracked: "Prasklý displej",
            deadPixels: "Mrtvé pixely",
            colorSpots: "Barevné skvrny",
            lifting: "Odlepuje se displej",
          },
          rearGlass: {
            title: "Zadní sklo",
            scratches: "Škrábance",
            cracked: "Prasklé zadní sklo",
            looseCover: "Odlepený zadní kryt",
          },
          camera: {
            title: "Fotoaparát",
            crackedLens: "Prasklé sklíčko fotoaparátu",
            scratchedLens: "Poškrábané sklíčko",
            replaced: "Kamera zaměněna",
          },
          frame: {
            title: "Rám",
            scratches: "Škrábance",
            scuffs: "Oděrky",
            dents: "Promáčkliny",
            bent: "Ohnutý rám",
            paintLoss: "Oloupaná barva",
          },
        },
        additional: {
          title: "Další zjištěné vady",
          noPower: "Nezapíná se",
          restarts: "Restartuje se",
          oxidation: "Oxidace / vytopení",
          swollenBattery: "Nafouklá baterie",
          missingSimTray: "Chybí SIM šuplík",
          missingScrews: "Chybí šroubky",
          note: "Poznámka k další vadě",
        },
        contamination: {
          title: "Znečištění",
          heavy: "Silně znečištěné zařízení",
          speaker: "Zanesený reproduktor",
          microphone: "Zanesený mikrofon",
          chargingPort: "Zanesený nabíjecí konektor",
          liquidTraces: "Stopy po tekutině",
          note: "Poznámka ke znečištění",
        },
        battery: {
          title: "Stav baterie",
          level90: "90–100 %",
          level80: "80–89 %",
          level70: "70–79 %",
          below70: "Pod 70 %",
          unknown: "Nelze zjistit",
        },
      },

      repair: {
        problemTitle: "Problém a předběžná diagnostika",
        customerProblem: "Popis problému zákazníkem",
        diagnosis: "Předběžná diagnostika",
        typeTitle: "Typ opravy",
        typeSearch: "Vyhledejte typ opravy",
        frequentTypes: "Nejčastější opravy",
        otherType: "Jiný",
        otherPlaceholder: "Popište jiný typ opravy",
        types: {
          displayOriginal: "Výměna displeje originální kvality",
          displayPremium: "Výměna displeje prémiové kvality",
          displayGlass: "Výměna skla displeje",
          batteryOriginal: "Výměna baterie originální kvality",
          batteryPremium: "Výměna baterie prémiové kvality",
          rearGlass: "Výměna zadního skla",
          rearCover: "Výměna zadního krytu",
          diagnostics: "Diagnostika",
        },
        risksTitle: "Rizika a upozornění",
        risksSubtitle:
          "Vybraná rizika budou uvedena v přejímacím protokolu.",
        risks: {
          dataLoss: "Riziko ztráty dat",
          unrepairable: "Zařízení může být neopravitelné",
          noWarranty: "Oprava bez záruky",
          hiddenDefects:
            "Skryté vady mohou ovlivnit výsledek opravy",
          waterDamage: "Poškození vodou – oprava bez záruky",
          nonOriginalPart:
            "Neoriginální díly mohou ovlivnit funkčnost",
          waterResistance:
            "Zařízení může ztratit odolnost proti vodě",
        },
        riskNote: "Další riziko nebo poznámka",
      },

      price: {
        title: "Cena opravy",
        targetPrice: "Celková cena opravy",
        breakdown: "Rozpis ceny",
        partLine: "Díl",
        laborLine: "Práce technika",
        currency: "Kč",
        approvalTitle: "Schválení opravy",
        approval: {
          approved: "Cena schválena zákazníkem",
          contact: "Kontaktovat zákazníka před opravou",
          afterApproval: "Oprava až po schválení",
        },
      },

      schedule: {
        title: "Odhadovaný čas opravy",
        options: {
          within24Hours: "Do 24 hodin",
          oneTwoDays: "1–2 dny",
          twoThreeDays: "2–3 dny",
          threeFiveDays: "3–5 dnů",
          weekOrMore: "Týden a více",
          customDate: "Vlastní datum",
        },
        date: "Vyberte datum",
      },

      parts: {
        title: "Přiřazení dílů",
        search: "Vyhledejte díl podle názvu nebo SKU",
        selected: "Vybrané díly",
        sampleName: "Displej iPhone 13 (OLED OEM)",
        sampleSku: "DISP-13-OEM-2026-000123",
        samplePrice: "1 200 Kč",
        conditionNew: "Nový",
        reservationHint:
          "Vybraný díl bude nejprve rezervován. Skutečné odepsání proběhne až při použití.",
      },

      communication: {
        title: "Komunikace se zákazníkem",
        subtitle: "Po dokončení informovat přes:",
        call: "Telefonní hovor",
        sms: "SMS",
        email: "E-mail",
        note: "Poznámka pro komunikaci",
        notePlaceholder:
          "Zákazník preferuje SMS; volat pouze v případě nutnosti.",
      },

      review: {
        hint:
          "Před vytvořením zakázky zde bude kompletní kontrola všech vyplněných údajů.",
        sections: {
          customer: {
            title: "Zákazník",
            contact: "Jméno a kontaktní údaje",
            note: "Adresa a poznámka zákazníka",
          },
          device: {
            title: "Zařízení",
            identity: "Model, barva, IMEI a sériové číslo",
            access: "Typ přístupu a jeho ověření",
          },
          inspection: {
            title: "Stav při převzetí",
            visual: "Vizuální kontrola a zjištěné vady",
            battery: "Znečištění a stav baterie",
          },
          repair: {
            title: "Oprava",
            type: "Typ opravy a diagnostika",
            risks: "Upozornění a rizika",
          },
          price: {
            title: "Cena a díly",
            breakdown: "Rozpis ceny a schválení",
            parts: "Přiřazené skladové díly",
          },
          communication: {
            title: "Dokončení",
            channels: "Způsoby informování zákazníka",
            deadline: "Odhadovaný termín dokončení",
          },
        },
      },
    },
  },
} as const;

export default intakeWizardTranslations;
