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

    auth: {
      subtitle: "Přihlaste se a pokračujte v práci se servisní aplikací.",
      checkingSession: "Ověřování relace...",
      fields: {
        email: "E-mail",
        password: "Heslo",
      },
      actions: {
        signIn: "Přihlásit se",
        signingIn: "Přihlašování...",
        signOut: "Odhlásit se",
        showPassword: "Zobrazit heslo",
        hidePassword: "Skrýt heslo",
        retry: "Zkusit znovu",
      },
      roles: {
        admin: "Administrátor",
        technician: "Technik",
      },
      userMenu: {
        open: "Otevřít nabídku uživatele",
      },
      errors: {
        required: "Zadejte e-mail a heslo.",
        loginFailed: "Přihlášení se nezdařilo.",
        sessionCheckFailed:
          "Relaci se nepodařilo ověřit. Zkontrolujte, zda server běží, a zkuste to znovu.",
        codes: {
          AUTH_INVALID_INPUT: "Zadejte platný e-mail a heslo.",
          AUTH_INVALID_CREDENTIALS: "Nesprávný e-mail nebo heslo.",
          AUTH_ACCOUNT_DISABLED: "Tento účet je deaktivován.",
          AUTH_RATE_LIMITED: "Příliš mnoho pokusů. Zkuste to později.",
          ORIGIN_FORBIDDEN: "Server tuto adresu aplikace nepovoluje.",
        },
      },
    },

    security: {
      accessDenied: "Nemáte oprávnění otevřít tuto stránku.",
      backToDashboard: "Zpět na přehled",
    },

    accessCode: {
      types: {
        none: "přístupový kód",
        pin: "PIN",
        password: "heslo",
        pattern: "gesto",
        unknown: "přístupový kód",
      },
      actions: {
        show: "Zobrazit {{type}}",
        confirmShow: "Zobrazit kód",
        loading: "Načítání...",
        hide: "Skrýt",
        copy: "Kopírovat",
      },
      confirm: {
        title: "Zobrazit přístupový kód zařízení?",
        message:
          "Tato akce bude zaznamenána do protokolu. {{type}} bude zobrazen po dobu {{seconds}} sekund.",
      },
      autoHide:
        "Kód se automaticky skryje za {{seconds}} sekund.",
      copied: "Zkopírováno",
      errors: {
        revealFailed: "Přístupový kód se nepodařilo zobrazit.",
        copyFailed: "Přístupový kód se nepodařilo zkopírovat.",
      },
    },

    notFoundPage: {
      title: "Stránka nebyla nalezena",
      description:
        "Požadovaná stránka CRM neexistuje nebo je adresa nesprávná.",
      back: "Zpět",
      dashboard: "Na přehled",
    },

    profilePages: {
      clientProfile: "Karta zákazníka",
      deviceProfile: "Karta zařízení",
      clientSince: "Zákazník od {{date}}",
      deviceSince: "Zařízení přidáno {{date}}",
      contactInformation: "Kontaktní údaje",
      clientDevices: "Zařízení zákazníka",
      repairHistory: "Historie oprav",
      owner: "Majitel",
      identifiers: "Identifikátory",
      delivered: "Vydáno",
      noIdentifier: "Bez identifikátoru",
      unknownClient: "Neznámý zákazník",
      fields: { phone: "Telefon", secondaryPhone: "Další telefon", email: "Email", address: "Adresa", note: "Poznámka", imei1: "IMEI 1", imei2: "IMEI 2", serial: "Sériové číslo", color: "Barva" },
      stats: { devices: "Zařízení", repairs: "Opravy", activeRepairs: "Aktivní opravy", completedIncome: "Hodnota dokončených oprav", lastRepair: "Poslední oprava" },
      status: { pending: "Čeká", in_progress: "Probíhá", completed: "Dokončeno", cancelled: "Zrušeno", unrepairable: "Neopravitelné" },
      empty: { devices: "Zákazník zatím nemá žádná zařízení.", repairs: "Historie oprav je zatím prázdná." },
      actions: { backToClients: "Zpět k zákazníkům", backToDevices: "Zpět k zařízením", newRepair: "Nový příjem", retry: "Opakovat" },
      errors: { invalidClient: "Neplatné ID zákazníka.", invalidDevice: "Neplatné ID zařízení.", clientLoad: "Kartu zákazníka se nepodařilo načíst.", deviceLoad: "Kartu zařízení se nepodařilo načíst." },
    },

    staffPage: {
      title: "Pracovníci",
      addStaff: "Přidat pracovníka",
      securityNotice:
        "Uživatelské účty pracovníků mohou spravovat pouze administrátoři. Změny hesel, rolí, aktivity a ukončení relací se zapisují do protokolu činností.",
      empty: "Vybraným filtrům neodpovídají žádní pracovníci.",
      currentAccount: "Aktuální účet",
      activeSessions: "Relace: {{count}}",
      lastLogin: "Poslední přihlášení",
      passwordChanged: "Heslo změněno",
      never: "Nikdy",
      passwordHint: "Heslo musí obsahovat alespoň 12 znaků.",
      selfProtection:
        "Z bezpečnostních důvodů nelze deaktivovat vlastní účet ani si odebrat roli administrátora.",
      roles: {
        all: "Všechny role",
        admin: "Administrátor",
        technician: "Technik",
      },
      status: {
        all: "Všechny stavy",
        active: "Aktivní",
        inactive: "Neaktivní",
      },
      filters: {
        search: "Hledat",
        searchPlaceholder: "Jméno nebo email",
        role: "Role",
        status: "Stav",
        reset: "Obnovit",
      },
      fields: {
        name: "Jméno",
        email: "Email",
        role: "Role",
        active: "Účet je aktivní",
        password: "Heslo",
        newPassword: "Nové heslo",
        confirmPassword: "Potvrzení hesla",
      },
      actions: {
        create: "Vytvořit pracovníka",
        edit: "Upravit",
        save: "Uložit",
        saving: "Ukládání...",
        resetPassword: "Změnit heslo",
        revokeSessions: "Ukončit relace",
        confirmRevoke: "Ukončit relace",
        refresh: "Obnovit",
        showPassword: "Zobrazit heslo",
        hidePassword: "Skrýt heslo",
      },
      dialogs: {
        createTitle: "Vytvoření účtu pracovníka",
        editTitle: "Úprava: {{name}}",
        passwordTitle: "Nové heslo pro {{name}}",
        passwordMessage:
          "Po změně hesla budou ukončeny všechny aktivní relace tohoto pracovníka.",
        selfPasswordMessage:
          "Aktuální relace v tomto prohlížeči zůstane aktivní. Vaše ostatní relace budou ukončeny.",
        revokeTitle: "Ukončit aktivní relace?",
        revokeMessage:
          "Pracovník {{name}} má {{count}} aktivních relací. Bude se muset znovu přihlásit.",
        selfRevokeMessage:
          "Aktuální relace v tomto prohlížeči zůstane aktivní. Bude ukončeno až {{count}} dalších relací.",
      },
      messages: {
        created: "Účet pracovníka byl vytvořen.",
        updated: "Údaje pracovníka byly aktualizovány.",
        passwordReset: "Heslo bylo změněno a staré relace ukončeny.",
        sessionsRevoked: "Ukončeno relací: {{count}}.",
      },
      validation: {
        passwordMismatch: "Hesla se neshodují.",
      },
      errors: {
        loadFailed: "Pracovníky se nepodařilo načíst.",
        createFailed: "Účet pracovníka se nepodařilo vytvořit.",
        updateFailed: "Údaje pracovníka se nepodařilo aktualizovat.",
        passwordFailed: "Heslo se nepodařilo změnit.",
        revokeFailed: "Aktivní relace se nepodařilo ukončit.",
      },
      apiErrors: {
        STAFF_EMAIL_EXISTS: "Pracovník s tímto emailem již existuje.",
        STAFF_SELF_DEACTIVATE_FORBIDDEN: "Nelze deaktivovat vlastní účet.",
        STAFF_SELF_DEMOTE_FORBIDDEN: "Nelze si odebrat roli administrátora.",
        STAFF_LAST_ADMIN_REQUIRED: "Musí zůstat alespoň jeden aktivní administrátor.",
        STAFF_NOT_FOUND: "Účet pracovníka nebyl nalezen.",
        STAFF_VALIDATION_FAILED: "Zkontrolujte zadané údaje pracovníka.",
      },
      pagination: {
        rowsPerPage: "Pracovníků na stránku:",
        displayedRows: "{{from}}–{{to}} z {{count}}",
      },
    },

    auditPage: {
      title: "Protokol činností",
      refresh: "Obnovit",
      empty: "Vybraným filtrům neodpovídají žádné události.",
      systemUser: "Systém nebo odstraněný uživatel",
      filters: {
        action: "Akce",
        actionPlaceholder: "Například: LOGIN nebo ORDER",
        entity: "Objekt",
        startDate: "Datum od",
        endDate: "Datum do",
        reset: "Obnovit",
      },
      columns: {
        date: "Datum a čas",
        user: "Uživatel",
        action: "Akce",
        entity: "Objekt",
        request: "Požadavek",
        status: "Stav",
      },
      pagination: {
        rowsPerPage: "Řádků na stránku:",
        displayedRows: "{{from}}–{{to}} z {{count}}",
      },
      entities: {
        all: "Všechny objekty",
        auth: "Přihlášení",
        client: "Zákazník",
        device: "Zařízení",
        intake: "Příjem",
        order: "Zakázka",
        stats: "Statistiky",
        staff_user: "Pracovník",
      },
      actions: {
        AUTH_LOGIN_SUCCESS: "Úspěšné přihlášení",
        AUTH_LOGIN_FAILED: "Neúspěšné přihlášení",
        AUTH_LOGOUT_SUCCESS: "Odhlášení",
        AUTH_LOGOUT_FAILED: "Neúspěšné odhlášení",
        CLIENT_CREATE: "Zákazník vytvořen",
        CLIENT_UPDATE: "Zákazník upraven",
        CLIENT_DELETE: "Zákazník odstraněn",
        DEVICE_CREATE: "Zařízení vytvořeno",
        DEVICE_UPDATE: "Zařízení upraveno",
        DEVICE_DELETE: "Zařízení odstraněno",
        INTAKE_CREATE: "Příjem opravy vytvořen",
        ORDER_CREATE: "Zakázka vytvořena",
        ORDER_UPDATE: "Zakázka upravena",
        ORDER_STATUS_UPDATE: "Stav zakázky změněn",
        ORDER_DELIVER: "Zakázka vydána",
        ORDER_DELETE: "Zakázka odstraněna",
        STAFF_USER_CREATE: "Pracovník vytvořen",
        STAFF_USER_UPDATE: "Pracovník upraven",
        STAFF_USER_PASSWORD_RESET: "Heslo pracovníka změněno",
        STAFF_USER_SESSIONS_REVOKE: "Relace pracovníka ukončeny",
        ORDER_ACCESS_CODE_REVEAL: "Přístupový kód zobrazen",
      },
      errors: {
        loadFailed: "Protokol činností se nepodařilo načíst.",
      },
    },

    ordersPage: {
      listTools: {
        searchLabel: "Hledat zakázky",
        searchPlaceholder: "Číslo zakázky, zákazník, telefon, IMEI, zařízení...",
        deliveryLabel: "Vydání",
        deliveryAll: "Vše",
        deliveryReady: "Připravené k vydání",
        deliveryNotDelivered: "Nevydané",
        deliveryDelivered: "Vydané",
        startDate: "Přijato od",
        endDate: "Přijato do",
        reset: "Obnovit",
        rowsPerPage: "Řádků na stránku:",
        displayedRows: "{{from}}–{{to}} z {{count}}",
      },

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
      title: "Potvrzení odstranění",
      cancel: "Zrušit",
      delete: "Odstranit",
      confirmGeneric:
        "Opravdu chcete tuto položku odstranit?",
      confirmItem:
        'Opravdu chcete odstranit položku "{{name}}"?',
      itemNumber: "položka č. {{id}}",
      errors: {
        clientHasOrders:
          "Zákazníka nelze odstranit, protože jsou s ním spojeny zakázky na opravu.",
        clientHasDevices:
          "Zákazníka nelze odstranit, protože jsou k němu přiřazena zařízení.",
        deviceHasOrders:
          "Zařízení nelze odstranit, protože jsou s ním spojeny zakázky na opravu.",
        clientNotFound:
          "Zákazník nebyl nalezen.",
        deviceNotFound:
          "Zařízení nebylo nalezeno.",
        orderNotFound:
          "Zakázka nebyla nalezena.",
        invalidClient:
          "ID zákazníka není platné.",
        invalidDevice:
          "ID zařízení není platné.",
        invalidOrder:
          "ID zakázky není platné.",
        forbidden:
          "K odstranění této položky nemáte oprávnění.",
        notFound:
          "Položka nebyla nalezena nebo již byla odstraněna.",
        conflict:
          "Tuto položku nelze odstranit, protože ji používají jiné záznamy.",
        server:
          "Při odstraňování došlo k chybě serveru.",
        deleteFailed:
          "Položku se nepodařilo odstranit.",
      },
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
        saving: "Ukládání...",
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
        saving: "Ukládání...",
      },

      errors: {
        loadDevices: "Zařízení se nepodařilo načíst.",
        save: "Zakázku se nepodařilo uložit.",
      },
    },

    receipt: {
      title: "Potvrzení o převzetí do opravy",
      serviceCopyTitle: "Protokol o převzetí do opravy",
      customerCopyTitle: "Potvrzení o převzetí do opravy",
      serviceCopy: "Kopie pro servis",
      customerCopy: "Kopie pro zákazníka",
      loading: "Načítání potvrzení...",
      cutLine: "Čára pro odstřižení",
      blankLine: "________________",
      printHint:
        "V dialogu tisku zvolte A4, měřítko 100 % a vypněte záhlaví a zápatí prohlížeče.",
      configurationWarning:
        "Údaje servisu nejsou vyplněny. Před použitím potvrzení upravte client/src/config/serviceReceiptConfig.ts.",
      confirmation:
        "Zákazník potvrzuje, že zařízení, jeho viditelný stav, příslušenství a nahlášená závada jsou uvedeny správně a že níže uvedené podmínky opravy byly přijaty.",
      customerTerms:
        "Úplné podmínky opravy: {{url}}",
      fields: {
        identifiers: "IMEI / Sériové číslo",
        receivedByCustomer: "Převzato zákazníkem",
        paid: "Uhrazeno",
        stampAndSignature: "Razítko a podpis",
      },
      terms: {
        title: "Podmínky opravy",
        item1:
          "Konečnou cenu a termín dokončení lze potvrdit až po diagnostice. Pokud jsou nutné další práce nebo náklady, servis kontaktuje zákazníka.",
        item2:
          "Zákazník odpovídá za zálohování důležitých dat před opravou. Některé opravy nebo softwarové úkony mohou způsobit ztrátu dat.",
        item3:
          "Bez PINu, hesla nebo gesta mohou být vstupní a výstupní testy omezené. Samotný přístupový kód se na tomto potvrzení netiskne.",
        item4:
          "Po otevření zařízení nelze zaručit původní voděodolnost, pokud není písemně potvrzeno jinak.",
        item5:
          "Zařízení po kontaktu s kapalinou, korozi, nárazu nebo poškození desky může mít skryté vady, které se projeví během diagnostiky nebo opravy.",
        item6:
          "Za převzaté se považuje pouze příslušenství uvedené na tomto potvrzení.",
        item7:
          "Zařízení se vydává proti tomuto potvrzení nebo po ověření totožnosti příjemce.",
        item8:
          "Nevyzvednutá zařízení se řeší podle zveřejněných podmínek opravy a platných právních předpisů.",
        fullTerms:
          "Úplné podmínky: {{url}}",
      },
      actions: {
        open: "Potvrzení",
        back: "Zpět k zakázce",
        print: "Tisk / Uložit PDF",
      },
      signatures: {
        customer: "Podpis zákazníka",
        service: "Zástupce servisu",
      },
      errors: {
        loadFailed: "Potvrzení se nepodařilo načíst.",
      },
    },

    orderDetails: {
      title: "Zakázka {{number}}",
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
