const intakeWizardTranslations = {
  en: {
    intakeWizard: {
      badge: "New intake",
      title: "Device repair intake",
      subtitle:
        "A clear workflow from customer details to the final order review.",
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
      },

      customer: {
        title: "Customer",
        subtitle:
          "Find an existing customer or create a new one.",
        phone: "Phone",
        phonePlaceholder: "+420 777 123 456",
        lookupHint:
          "After entering a phone number, the matching customer and their devices will appear here.",
        fullName: "Full name",
        email: "Email",
        address: "Address",
      },

      device: {
        title: "Device",
        subtitle:
          "Search the model catalogue and fill device information automatically.",
        searchModel: "Search model",
        searchModelPlaceholder: "For example, iPhone 15 Pro Max",
        type: "Device type",
        types: {
          phone: "Phone",
          tablet: "Tablet",
          laptop: "Laptop",
          smartwatch: "Smartwatch",
        },
        brand: "Brand",
        brandPlaceholder: "Apple",
        model: "Model",
        modelPlaceholder: "iPhone 15 Pro Max",
        imeiSerial: "IMEI / serial number",
        color: "Color",
        colorPlaceholder: "Natural Titanium",
      },

      access: {
        title: "Device access",
        subtitle: "The access credential will be stored encrypted.",
        none: "No code",
        pin: "PIN",
        password: "Password",
        pattern: "Pattern",
        unknown: "Unknown",
        patternTitle: "3 × 3 pattern lock",
        patternHint:
          "The interactive pattern grid will be added in the next package.",
      },

      inspection: {
        overallTitle: "Overall device condition",
        overallSubtitle: "Quick assessment when accepting the device.",
        conditions: {
          excellent: "Excellent",
          good: "Good",
          used: "Normally worn",
          damaged: "Damaged",
        },
        note: "Note",
        groups: {
          display: {
            title: "Display",
            hairlineScratches: "Hairline scratches",
            deepScratches: "Deep scratches",
            cracked: "Cracked display",
            deadPixels: "Dead pixels",
          },
          rearCover: {
            title: "Rear cover",
            scratches: "Scratches",
            crackedGlass: "Cracked glass",
            looseCover: "Loose cover",
            dents: "Dents",
          },
          frameButtons: {
            title: "Frame and buttons",
            scuffs: "Scuffs",
            bentFrame: "Bent frame",
            damagedButtons: "Damaged buttons",
            missingParts: "Missing parts",
          },
        },
        findingsTitle: "Additional findings",
        findings: {
          dirty: "Device is dirty",
          liquid: "Signs of liquid contact",
          nonOriginal: "Non-original parts",
          noPower: "Device does not power on",
          swollenBattery: "Battery is swollen",
        },
        intakeNoteTitle: "Intake note",
        generalNote: "General note",
        generalNotePlaceholder:
          "Additional information about the condition of the device...",
      },

      repair: {
        problemTitle: "Problem and preliminary diagnostics",
        customerProblem: "Problem described by the customer",
        preliminaryDiagnosis: "Preliminary diagnostics",
        type: "Repair type",
        types: {
          diagnostics: "Diagnostics",
          display: "Display replacement",
          battery: "Battery replacement",
          board: "Mainboard repair",
        },
        risksTitle: "Repair risks",
        risksSubtitle:
          "Selected risks will be included in the intake protocol.",
        risks: {
          dataLoss: "Possible data loss",
          unrepairable: "The device may be unrepairable",
          noWarranty: "Repair without warranty",
          hiddenDefects: "Possible hidden defects",
          waterResistance: "Loss of water resistance",
        },
        otherRisk: "Other risk",
      },

      price: {
        title: "Price and parts",
        labor: "Labor",
        parts: "Parts",
        total: "Total",
        searchPart: "Search inventory part",
        searchPartPlaceholder: "Name, SKU or barcode",
        partsHint:
          "At this stage a part is only selected. Reservation and final stock issue will be connected later.",
        scheduleTitle: "Schedule and communication",
        dueAt: "Estimated completion date",
        approval: "Repair approval",
        approvals: {
          approved: "Approved at intake",
          contact: "Contact before repair",
          limit: "Approved up to a price limit",
        },
        communication: {
          phone: "Phone call",
          sms: "SMS",
          email: "Email",
        },
      },

      review: {
        success:
          "A complete review of all entered information will appear here before creating the order.",
        sections: {
          customer: {
            title: "Customer",
            contact: "Name and contact",
            billing: "Billing information",
          },
          device: {
            title: "Device",
            identity: "Model, IMEI and color",
            access: "Device access",
          },
          inspection: {
            title: "Condition at intake",
            visual: "Visual inspection",
            findings: "Additional findings",
          },
          repair: {
            title: "Repair",
            diagnosis: "Diagnostics and risks",
            price: "Price, schedule and parts",
          },
        },
      },
    },
  },

  uk: {
    intakeWizard: {
      badge: "Нове приймання",
      title: "Приймання пристрою в ремонт",
      subtitle:
        "Зрозумілий процес від даних клієнта до фінальної перевірки замовлення.",
      stepCounter: "Крок {{current}} з {{total}}",

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
      },

      customer: {
        title: "Клієнт",
        subtitle:
          "Знайдіть наявного клієнта або створіть нового.",
        phone: "Телефон",
        phonePlaceholder: "+420 777 123 456",
        lookupHint:
          "Після введення номера тут з’явиться знайдений клієнт і його пристрої.",
        fullName: "Ім’я та прізвище",
        email: "Електронна пошта",
        address: "Адреса",
      },

      device: {
        title: "Пристрій",
        subtitle:
          "Знайдіть модель у каталозі та автоматично заповніть інформацію про пристрій.",
        searchModel: "Знайти модель",
        searchModelPlaceholder: "Наприклад, iPhone 15 Pro Max",
        type: "Тип пристрою",
        types: {
          phone: "Телефон",
          tablet: "Планшет",
          laptop: "Ноутбук",
          smartwatch: "Розумний годинник",
        },
        brand: "Виробник",
        brandPlaceholder: "Apple",
        model: "Модель",
        modelPlaceholder: "iPhone 15 Pro Max",
        imeiSerial: "IMEI / серійний номер",
        color: "Колір",
        colorPlaceholder: "Natural Titanium",
      },

      access: {
        title: "Доступ до пристрою",
        subtitle: "Дані доступу зберігатимуться зашифрованими.",
        none: "Без коду",
        pin: "PIN",
        password: "Пароль",
        pattern: "Графічний ключ",
        unknown: "Невідомо",
        patternTitle: "Графічний ключ 3 × 3",
        patternHint:
          "Інтерактивну сітку додамо в наступному пакеті.",
      },

      inspection: {
        overallTitle: "Загальний стан пристрою",
        overallSubtitle: "Швидка оцінка під час приймання пристрою.",
        conditions: {
          excellent: "Відмінний",
          good: "Добрий",
          used: "Звичайно зношений",
          damaged: "Пошкоджений",
        },
        note: "Примітка",
        groups: {
          display: {
            title: "Дисплей",
            hairlineScratches: "Дрібні подряпини",
            deepScratches: "Глибокі подряпини",
            cracked: "Розбитий дисплей",
            deadPixels: "Мертві пікселі",
          },
          rearCover: {
            title: "Задня кришка",
            scratches: "Подряпини",
            crackedGlass: "Розбите скло",
            looseCover: "Відклеєна кришка",
            dents: "Вм’ятини",
          },
          frameButtons: {
            title: "Рамка і кнопки",
            scuffs: "Потертості",
            bentFrame: "Зігнута рамка",
            damagedButtons: "Пошкоджені кнопки",
            missingParts: "Відсутні частини",
          },
        },
        findingsTitle: "Додаткові виявлені проблеми",
        findings: {
          dirty: "Пристрій забруднений",
          liquid: "Сліди контакту з рідиною",
          nonOriginal: "Неоригінальні деталі",
          noPower: "Пристрій не вмикається",
          swollenBattery: "Батарея здута",
        },
        intakeNoteTitle: "Примітка під час приймання",
        generalNote: "Загальна примітка",
        generalNotePlaceholder:
          "Додаткова інформація про стан пристрою...",
      },

      repair: {
        problemTitle: "Проблема і попередня діагностика",
        customerProblem: "Опис проблеми клієнтом",
        preliminaryDiagnosis: "Попередня діагностика",
        type: "Тип ремонту",
        types: {
          diagnostics: "Діагностика",
          display: "Заміна дисплея",
          battery: "Заміна батареї",
          board: "Ремонт плати",
        },
        risksTitle: "Ризики ремонту",
        risksSubtitle:
          "Вибрані ризики будуть зазначені в приймальному протоколі.",
        risks: {
          dataLoss: "Можлива втрата даних",
          unrepairable: "Пристрій може виявитися неремонтопридатним",
          noWarranty: "Ремонт без гарантії",
          hiddenDefects: "Можливі приховані дефекти",
          waterResistance: "Втрата водонепроникності",
        },
        otherRisk: "Інший ризик",
      },

      price: {
        title: "Ціна і деталі",
        labor: "Робота",
        parts: "Деталі",
        total: "Разом",
        searchPart: "Знайти деталь на складі",
        searchPartPlaceholder: "Назва, SKU або штрихкод",
        partsHint:
          "На цьому етапі деталь лише вибирається. Резервування та фактичне списання підключимо пізніше.",
        scheduleTitle: "Строк і комунікація",
        dueAt: "Орієнтовна дата завершення",
        approval: "Погодження ремонту",
        approvals: {
          approved: "Погоджено під час приймання",
          contact: "Зв’язатися перед ремонтом",
          limit: "Погоджено до визначеного ліміту",
        },
        communication: {
          phone: "Телефонний дзвінок",
          sms: "SMS",
          email: "Електронна пошта",
        },
      },

      review: {
        success:
          "Перед створенням замовлення тут буде повна перевірка всіх введених даних.",
        sections: {
          customer: {
            title: "Клієнт",
            contact: "Ім’я та контакт",
            billing: "Платіжні дані",
          },
          device: {
            title: "Пристрій",
            identity: "Модель, IMEI та колір",
            access: "Доступ до пристрою",
          },
          inspection: {
            title: "Стан під час приймання",
            visual: "Візуальний огляд",
            findings: "Додаткові виявлені проблеми",
          },
          repair: {
            title: "Ремонт",
            diagnosis: "Діагностика та ризики",
            price: "Ціна, строк і деталі",
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
        "Přehledný průvodce od zákazníka až po finální kontrolu zakázky.",
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
      },

      customer: {
        title: "Zákazník",
        subtitle:
          "Vyhledejte existujícího zákazníka nebo založte nového.",
        phone: "Telefon",
        phonePlaceholder: "+420 777 123 456",
        lookupHint:
          "Po zadání telefonu zde nabídneme nalezeného zákazníka a jeho zařízení.",
        fullName: "Jméno a příjmení",
        email: "E-mail",
        address: "Adresa",
      },

      device: {
        title: "Zařízení",
        subtitle:
          "Vyhledejte model v katalogu a automaticky doplňte údaje o zařízení.",
        searchModel: "Vyhledat model",
        searchModelPlaceholder: "Např. iPhone 15 Pro Max",
        type: "Typ zařízení",
        types: {
          phone: "Telefon",
          tablet: "Tablet",
          laptop: "Notebook",
          smartwatch: "Chytré hodinky",
        },
        brand: "Výrobce",
        brandPlaceholder: "Apple",
        model: "Model",
        modelPlaceholder: "iPhone 15 Pro Max",
        imeiSerial: "IMEI / sériové číslo",
        color: "Barva",
        colorPlaceholder: "Natural Titanium",
      },

      access: {
        title: "Přístup do zařízení",
        subtitle: "Přístupový údaj se uloží šifrovaně.",
        none: "Bez kódu",
        pin: "PIN",
        password: "Heslo",
        pattern: "Gesto",
        unknown: "Neznámé",
        patternTitle: "Grafický klíč 3 × 3",
        patternHint:
          "Interaktivní mřížku doplníme v dalším balíku.",
      },

      inspection: {
        overallTitle: "Celkový stav zařízení",
        overallSubtitle: "Rychlé hodnocení při převzetí zařízení.",
        conditions: {
          excellent: "Výborný",
          good: "Dobrý",
          used: "Běžně opotřebený",
          damaged: "Poškozený",
        },
        note: "Poznámka",
        groups: {
          display: {
            title: "Displej",
            hairlineScratches: "Vlasové škrábance",
            deepScratches: "Hlubší škrábance",
            cracked: "Prasklý displej",
            deadPixels: "Mrtvé pixely",
          },
          rearCover: {
            title: "Zadní kryt",
            scratches: "Škrábance",
            crackedGlass: "Prasklé sklo",
            looseCover: "Uvolněný kryt",
            dents: "Promáčknutí",
          },
          frameButtons: {
            title: "Rám a tlačítka",
            scuffs: "Oděrky",
            bentFrame: "Ohnutý rám",
            damagedButtons: "Poškozená tlačítka",
            missingParts: "Chybějící části",
          },
        },
        findingsTitle: "Další zjištění",
        findings: {
          dirty: "Zařízení je znečištěné",
          liquid: "Známky kontaktu s kapalinou",
          nonOriginal: "Neoriginální díly",
          noPower: "Zařízení se nezapíná",
          swollenBattery: "Baterie je nafouklá",
        },
        intakeNoteTitle: "Poznámka k převzetí",
        generalNote: "Obecná poznámka",
        generalNotePlaceholder:
          "Doplňující informace o stavu zařízení...",
      },

      repair: {
        problemTitle: "Problém a předběžná diagnostika",
        customerProblem: "Popis problému zákazníkem",
        preliminaryDiagnosis: "Předběžná diagnostika",
        type: "Typ opravy",
        types: {
          diagnostics: "Diagnostika",
          display: "Výměna displeje",
          battery: "Výměna baterie",
          board: "Oprava základní desky",
        },
        risksTitle: "Rizika opravy",
        risksSubtitle:
          "Vybraná rizika budou uvedena v přejímacím protokolu.",
        risks: {
          dataLoss: "Možná ztráta dat",
          unrepairable: "Zařízení může být neopravitelné",
          noWarranty: "Oprava bez záruky",
          hiddenDefects: "Možné skryté vady",
          waterResistance: "Ztráta voděodolnosti",
        },
        otherRisk: "Další riziko",
      },

      price: {
        title: "Cena a díly",
        labor: "Práce",
        parts: "Díly",
        total: "Celkem",
        searchPart: "Vyhledat díl ve skladu",
        searchPartPlaceholder: "Název, SKU nebo čárový kód",
        partsHint:
          "V této fázi se díl pouze vybere. Rezervaci a skutečné odepsání doplníme později.",
        scheduleTitle: "Termín a komunikace",
        dueAt: "Předpokládaný termín dokončení",
        approval: "Schválení opravy",
        approvals: {
          approved: "Schváleno při převzetí",
          contact: "Kontaktovat před opravou",
          limit: "Schváleno do cenového limitu",
        },
        communication: {
          phone: "Telefon",
          sms: "SMS",
          email: "E-mail",
        },
      },

      review: {
        success:
          "Před vytvořením zakázky zde bude kompletní kontrola všech vyplněných údajů.",
        sections: {
          customer: {
            title: "Zákazník",
            contact: "Jméno a kontakt",
            billing: "Fakturační údaje",
          },
          device: {
            title: "Zařízení",
            identity: "Model, IMEI a barva",
            access: "Přístup do zařízení",
          },
          inspection: {
            title: "Stav při převzetí",
            visual: "Vizuální kontrola",
            findings: "Další zjištění",
          },
          repair: {
            title: "Oprava",
            diagnosis: "Diagnostika a rizika",
            price: "Cena, termín a díly",
          },
        },
      },
    },
  },
} as const;

export default intakeWizardTranslations;
