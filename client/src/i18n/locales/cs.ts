const cs = {
  translation: {
    common: {
      language: "Jazyk",
      english: "Angličtina",
      ukrainian: "Ukrajinština",
      czech: "Čeština",
      loading: "Načítání...",
      save: "Uložit",
      cancel: "Zrušit",
      edit: "Upravit",
      delete: "Smazat",
      view: "Zobrazit",
      back: "Zpět",
      close: "Zavřít",
      status: "Stav",
      all: "Vše",
      yes: "Ano",
      no: "Ne",
      notAvailable: "-",
      noData: "Nebyla nalezena žádná data.",
      openMenu: "Otevřít nabídku",
    },

    navigation: {
      dashboard: "Přehled",
      clients: "Zákazníci",
      devices: "Zařízení",
      orders: "Zakázky",
    },

    statuses: {
      pending: "Čeká",
      inProgress: "Probíhá",
      completed: "Dokončeno",
      cancelled: "Zrušeno",
      unrepairable: "Nelze opravit",
    },

    delivery: {
      notReady: "Není připraveno",
      ready: "Připraveno",
      delivered: "Vydáno",
      deliver: "Vydat",
      delivering: "Vydávání...",
      error: "Zakázku se nepodařilo označit jako vydanou.",
      readyWithoutRepair: "Bez opravy",
      returnedWithoutRepair: "Vydáno bez opravy",
      deliverWithoutRepair: "Vydat",
      returningWithoutRepair: "Vydávání...",
    },

    ordersPage: {
      title: "Zakázky",
      addOrder: "Přidat zakázku",
      loading: "Načítání zakázek...",
      empty: "Nebyly nalezeny žádné zakázky.",
      grid: {
        rowsPerPage: "Řádků na stránku:",
      },
      columns: {
        id: "ID",
        device: "Zařízení",
        client: "Zákazník",
        price: "Cena",
        received: "Přijato",
        status: "Stav",
        delivery: "Výdej",
        actions: "Akce",
      },
      labels: {
        client: "Zákazník",
        price: "Cena",
        received: "Přijato",
        status: "Stav",
        delivery: "Výdej",
      },
      priceTypes: {
        final: "Konečná",
        estimated: "Odhadovaná",
      },
      actions: {
        view: "Zobrazit zakázku",
        edit: "Upravit zakázku",
        delete: "Smazat zakázku",
      },
      deleteConfirmation:
        'Opravdu chcete smazat zakázku "{{id}}"?',
      errors: {
        loadFailed: "Zakázky se nepodařilo načíst.",
        clientsLoadFailed: "Zákazníky se nepodařilo načíst.",
        statusUpdateFailed: "Stav zakázky se nepodařilo změnit.",
      },
    },

    deleteDialog: {
      title: "Potvrzení smazání",
      cancel: "Zrušit",
      delete: "Smazat",
    },

    clientInfo: {
      noOwner: "Vlastník není uveden",
      unknown: "Neznámý zákazník",
      avatarAlt: "Avatar zákazníka",
    },

    dashboardPage: {
      title: "Přehled",
      loading: "Načítání přehledu...",
      statistics: {
        clients: "Zákazníci",
        devices: "Zařízení",
        orders: "Zakázky",
        income: "Příjem",
      },
      recentOrders: {
        title: "Posledních 5 zakázek",
        empty: "Nebyly nalezeny žádné zakázky.",
        columns: {
          id: "ID",
          device: "Zařízení",
          client: "Zákazník",
          received: "Přijato",
          status: "Stav",
        },
        labels: {
          device: "Zařízení",
          client: "Zákazník",
          received: "Přijato",
        },
      },
      errors: {
        loadFailed: "Část dat přehledu se nepodařilo načíst.",
      },
    },

    clientsPage: {
      title: "Zákazníci",
      addClient: "Přidat zákazníka",
      loading: "Načítání zákazníků...",
      empty: "Nebyli nalezeni žádní zákazníci.",
      columns: {
        name: "Jméno",
        phone: "Telefon",
        email: "E-mail",
        date: "Datum",
        actions: "Akce",
      },
      labels: {
        phone: "Telefon",
        email: "E-mail",
      },
      actions: {
        edit: "Upravit zákazníka",
        delete: "Smazat zákazníka",
      },
      deleteConfirmation:
        'Opravdu chcete smazat zákazníka "{{name}}"?',
      errors: {
        loadFailed: "Zákazníky se nepodařilo načíst.",
      },
    },

    clientForm: {
      titles: {
        add: "Přidat nového zákazníka",
        edit: "Upravit zákazníka",
      },
      fields: {
        fullName: "Celé jméno",
        phone: "Telefon",
        secondaryPhone: "Druhý telefon",
        email: "E-mail",
        address: "Adresa",
        note: "Poznámka zákazníka",
      },
      lookup: {
        searching: "Vyhledávání...",
        findClient: "Najít zákazníka",
        notFound:
          "Zákazník s tímto telefonem nebyl nalezen. Vyplňte formulář a vytvořte nového zákazníka.",
        failed: "Zákazníka se nepodařilo vyhledat.",
      },
      helpers: {
        optional: "Volitelné",
        note: "Interní informace o zákazníkovi",
      },
      validation: {
        nameRequired: "Je nutné uvést celé jméno",
        nameMax: "Celé jméno nesmí překročit 120 znaků",
        phoneRequired: "Je nutné uvést telefon",
        phoneInvalid: "Zadejte platné telefonní číslo",
        secondaryPhoneInvalid:
          "Zadejte platné druhé telefonní číslo",
        emailInvalid: "Neplatný formát e-mailu",
        emailMax: "E-mail nesmí překročit 160 znaků",
        addressMax: "Adresa nesmí překročit 255 znaků",
        noteMax: "Poznámka nesmí překročit 2000 znaků",
      },
      actions: {
        cancel: "Zrušit",
        save: "Uložit",
      },
      errors: {
        save: "Zákazníka se nepodařilo uložit. Zkuste to znovu.",
      },
    },

    devicesPage: {
      title: "Zařízení",
      addDevice: "Přidat zařízení",
      loading: "Načítání zařízení...",
      empty: "Nebyla nalezena žádná zařízení.",
      columns: {
        brand: "Značka",
        model: "Model",
        identifier: "Identifikátor",
        client: "Zákazník",
        date: "Datum",
        actions: "Akce",
      },
      labels: {
        client: "Zákazník",
        deviceType: "Typ zařízení",
        date: "Datum",
      },
      identifiers: {
        imei1: "IMEI 1",
        imei2: "IMEI 2",
        serial: "Sériové číslo",
        none: "Bez identifikátoru",
      },
      deviceTypes: {
        phone: "Telefon",
        tablet: "Tablet",
        laptop: "Notebook",
        smartwatch: "Chytré hodinky",
        other: "Jiné",
      },
      actions: {
        edit: "Upravit zařízení",
        delete: "Smazat zařízení",
      },
      deleteConfirmation:
        'Opravdu chcete smazat zařízení "{{device}}"?',
      errors: {
        loadFailed: "Zařízení se nepodařilo načíst.",
        clientsLoadFailed: "Zákazníky se nepodařilo načíst.",
      },
    },

    deviceForm: {
      titles: {
        add: "Přidat nové zařízení",
        edit: "Upravit zařízení",
      },
      fields: {
        client: "Zákazník",
        deviceType: "Typ zařízení",
        color: "Barva",
        brand: "Značka",
        model: "Model",
        imei1: "IMEI 1",
        imei2: "IMEI 2",
        serial: "Sériové číslo",
      },
      deviceTypes: {
        phone: "Telefon",
        tablet: "Tablet",
        laptop: "Notebook",
        smartwatch: "Chytré hodinky",
        other: "Jiné",
      },
      helpers: {
        noClients: "Nejsou k dispozici žádní zákazníci",
        optional: "Volitelné",
        imei: "Volitelné, 15 číslic",
      },
      validation: {
        clientRequired: "Je nutné vybrat zákazníka",
        deviceTypeRequired: "Je nutné vybrat typ zařízení",
        colorMax: "Barva nesmí překročit 80 znaků",
        brandRequired: "Je nutné uvést značku",
        brandMax: "Značka nesmí překročit 120 znaků",
        modelRequired: "Je nutné uvést model",
        modelMax: "Model nesmí překročit 120 znaků",
        imeiCharacters:
          "IMEI může obsahovat pouze číslice, mezery a pomlčky",
        imeiLength: "IMEI musí obsahovat přesně 15 číslic",
        serialMax:
          "Sériové číslo nesmí překročit 100 znaků",
      },
      actions: {
        cancel: "Zrušit",
        save: "Uložit",
        saving: "Ukládání...",
      },
      errors: {
        save: "Zařízení se nepodařilo uložit. Zkuste to znovu.",
        existingDevice: "ID existujícího zařízení: {{id}}.",
      },
    },

    repairIntake: {
      title: "Nový příjem do opravy",
      intro:
        "Zákazník, zařízení a zakázka budou uloženi společně v jedné transakci.",
      sections: {
        client: "Zákazník",
        device: "Zařízení",
        order: "Příjem do opravy",
      },
      modes: {
        existing: "Existující",
        new: "Nový",
      },
      fields: {
        existingClient: "Vyhledat existujícího zákazníka",
        existingDevice: "Vybrat existující zařízení",
      },
      lookup: {
        checkPhone: "Ověřit telefon",
        checking: "Ověřování...",
        found: "Existující zákazník byl nalezen a vybrán.",
        notFound: "Zákazník nebyl nalezen. Pokračujte vytvořením nového zákazníka.",
        failed: "Telefonní číslo se nepodařilo ověřit.",
      },
      helpers: {
        selectClientFirst: "Nejprve vyberte existujícího zákazníka.",
        noDevices: "Tento zákazník nemá žádná registrovaná zařízení.",
        newClientNewDevice:
          "Nový zákazník musí být uložen společně s novým zařízením.",
      },
      actions: {
        create: "Vytvořit příjem",
        creating: "Vytváření...",
      },
      errors: {
        loadDevices: "Zařízení se nepodařilo načíst.",
        save: "Příjem do opravy se nepodařilo vytvořit.",
        codes: {
          INTAKE_VALIDATION_FAILED: "Údaje příjmu nejsou platné.",
          INTAKE_CLIENT_NOT_FOUND: "Vybraný zákazník nebyl nalezen.",
          INTAKE_CLIENT_PHONE_CONFLICT:
            "Zákazník s tímto telefonním číslem již existuje.",
          INTAKE_CLIENT_EMAIL_CONFLICT:
            "Zákazník s touto e-mailovou adresou již existuje.",
          INTAKE_DEVICE_NOT_FOUND: "Vybrané zařízení nebylo nalezeno.",
          INTAKE_DEVICE_CLIENT_MISMATCH:
            "Vybrané zařízení patří jinému zákazníkovi.",
          INTAKE_DEVICE_IDENTIFIER_CONFLICT:
            "Zařízení s tímto IMEI nebo sériovým číslem již existuje.",
          INTAKE_ORDER_VALIDATION_FAILED: "Údaje zakázky nejsou platné.",
          INTAKE_RELATION_INVALID:
            "Vybraný zákazník nebo zařízení není platné.",
          INTAKE_CREATE_FAILED: "Příjem do opravy se nepodařilo vytvořit.",
        },
      },
    },

    orderForm: {
      titles: {
        create: "Vytvořit novou zakázku",
        edit: "Upravit zakázku",
      },

      sections: {
        clientDevice: "Zákazník a zařízení",
        intake: "Informace o příjmu",
        repair: "Informace o opravě",
      },

      fields: {
        client: "Zákazník",
        device: "Zařízení",
        reportedProblem: "Nahlášená závada",
        deviceCondition: "Stav zařízení",
        accessories: "Příslušenství",
        receivedAt: "Datum přijetí",
        dueAt: "Předpokládaný termín",
        accessType: "Typ přístupu",
        accessCode: "Přístupový kód",
        status: "Stav",
        estimatedPrice: "Odhadovaná cena",
        finalPrice: "Konečná cena",
        diagnosis: "Diagnostika",
        workPerformed: "Provedené práce",
        internalNote: "Interní poznámka",
      },

      placeholders: {
        deviceCondition: "Škrábance, praskliny, ohnutý rám...",
        accessories: "Telefon, kryt, nabíječka...",
      },

      accessTypes: {
        none: "Bez přístupového kódu",
        pin: "PIN",
        password: "Heslo",
        pattern: "Gesto",
        unknown: "Neznámé",
      },

      helpers: {
        noClients: "Nejsou k dispozici žádní zákazníci",
        noDevices: "Tento zákazník nemá žádná zařízení",
        codeSaved: "Kód je již uložen. Ponechte pole prázdné, chcete-li jej zachovat.",
        patternExample: "Příklad: 1-2-5-8",
        unknownAccess: "Způsob přístupu není znám.",
        noCodeRequired: "Přístupový kód není vyžadován.",
        internalNote: "Viditelné pouze pro pracovníky servisu.",
      },

      validation: {
        clientRequired: "Je nutné vybrat zákazníka",
        deviceRequired: "Je nutné vybrat zařízení",
        clientDeviceRequired: "Je nutné vybrat zákazníka a zařízení.",
        problemRequired: "Je nutné uvést závadu",
        problemMax: "Popis závady nesmí překročit 255 znaků",
        receivedRequired: "Je nutné uvést datum přijetí",
        dueBeforeReceived: "Předpokládaný termín nemůže být před datem přijetí",
        accessCodeRequired: "Je nutné uvést přístupový kód",
        accessCodeMax: "Přístupový kód nesmí překročit 256 znaků",
        estimatedNonNegative: "Odhadovaná cena nesmí být záporná",
        estimatedWhole: "Odhadovaná cena musí být celé číslo",
        finalNonNegative: "Konečná cena nesmí být záporná",
        finalWhole: "Konečná cena musí být celé číslo",
      },

      actions: {
        cancel: "Zrušit",
        add: "Přidat",
        update: "Uložit změny",
      },

      errors: {
        loadDevices: "Zařízení se nepodařilo načíst.",
        save: "Zakázku se nepodařilo uložit.",
      },
    },

    orderDetails: {
      title: "Zakázka č. {{id}}",
      backToOrders: "Zpět k zakázkám",
      editOrder: "Upravit zakázku",
      loadingOrder: "Načítání zakázky...",
      clientFallback: "Zákazník č. {{id}}",
      sections: {
        client: "Zákazník",
        device: "Zařízení",
        intake: "Příjem",
        repair: "Oprava",
        price: "Cena",
        timeline: "Časový přehled",
      },
      fields: {
        name: "Jméno",
        phone: "Telefon",
        secondaryPhone: "Druhý telefon",
        email: "E-mail",
        address: "Adresa",
        clientNote: "Poznámka zákazníka",
        deviceType: "Typ zařízení",
        brand: "Značka",
        model: "Model",
        color: "Barva",
        imei1: "IMEI 1",
        imei2: "IMEI 2",
        serialNumber: "Sériové číslo",
        reportedProblem: "Nahlášená závada",
        deviceCondition: "Stav zařízení",
        accessories: "Příslušenství",
        deviceAccess: "Přístup k zařízení",
        received: "Přijato",
        dueDate: "Předpokládaný termín",
        diagnosis: "Diagnostika",
        workPerformed: "Provedené práce",
        internalNote: "Interní poznámka",
        estimatedPrice: "Odhadovaná cena",
        finalPrice: "Konečná cena",
        created: "Vytvořeno",
        lastUpdated: "Poslední změna",
        completed: "Dokončeno",
        delivered: "Vydáno",
      },
      deviceTypes: {
        phone: "Telefon",
        tablet: "Tablet",
        laptop: "Notebook",
        smartwatch: "Chytré hodinky",
        other: "Jiné",
      },
      access: {
        pinProvided: "PIN zadán",
        pinNotProvided: "PIN nezadán",
        passwordProvided: "Heslo zadáno",
        passwordNotProvided: "Heslo nezadáno",
        patternProvided: "Gesto zadáno",
        patternNotProvided: "Gesto nezadáno",
        unknown: "Neznámé",
        none: "Bez přístupového kódu",
      },
      errors: {
        invalidId: "Neplatné číslo zakázky.",
        notFound: "Zakázka nebyla nalezena.",
        loadFailed: "Zakázku se nepodařilo načíst.",
        statusUpdateFailed: "Stav zakázky se nepodařilo změnit.",
        deliveryFailed: "Zakázku se nepodařilo označit jako vydanou.",
        editPreparationFailed: "Formulář úpravy se nepodařilo připravit.",
        missingOrderId: "Číslo zakázky chybí.",
      },
    },
  },
};

export default cs;
