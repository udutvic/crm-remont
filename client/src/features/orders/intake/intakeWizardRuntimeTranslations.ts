const intakeWizardRuntimeTranslations = {
  en: {
    intakeRuntime: {
      customerSearch: {
        label: "Find an existing customer",
        placeholder: "Name, phone number or e-mail",
        hint: "Enter at least 2 characters. Results are loaded from the CRM.",
        loading: "Searching customers...",
        noResults: "No matching customer was found.",
        error: "Customer search failed. Try again.",
        selected: "Existing customer selected",
        useNew: "Create a new customer",
        change: "Change customer",
      },
      devices: {
        title: "Customer devices",
        hint: "Select an existing device or continue with a new device.",
        loading: "Loading customer devices...",
        error: "Customer devices could not be loaded.",
        empty: "This customer has no saved devices.",
        selected: "Existing device selected",
        useNew: "Add a new device",
        change: "Change device",
        identifier: "Identifier",
      },
    },
  },

  uk: {
    intakeRuntime: {
      customerSearch: {
        label: "Знайти наявного клієнта",
        placeholder: "Ім’я, номер телефону або e-mail",
        hint: "Введи щонайменше 2 символи. Результати завантажуються з CRM.",
        loading: "Пошук клієнтів...",
        noResults: "Відповідного клієнта не знайдено.",
        error: "Не вдалося виконати пошук клієнтів. Спробуй ще раз.",
        selected: "Вибрано наявного клієнта",
        useNew: "Створити нового клієнта",
        change: "Змінити клієнта",
      },
      devices: {
        title: "Пристрої клієнта",
        hint: "Вибери наявний пристрій або продовжуй із новим.",
        loading: "Завантаження пристроїв клієнта...",
        error: "Не вдалося завантажити пристрої клієнта.",
        empty: "У цього клієнта ще немає збережених пристроїв.",
        selected: "Вибрано наявний пристрій",
        useNew: "Додати новий пристрій",
        change: "Змінити пристрій",
        identifier: "Ідентифікатор",
      },
    },
  },

  cs: {
    intakeRuntime: {
      customerSearch: {
        label: "Vyhledat existujícího zákazníka",
        placeholder: "Jméno, telefon nebo e-mail",
        hint: "Zadejte alespoň 2 znaky. Výsledky se načítají z CRM.",
        loading: "Vyhledávání zákazníků...",
        noResults: "Nebyl nalezen odpovídající zákazník.",
        error: "Vyhledání zákazníků se nezdařilo. Zkuste to znovu.",
        selected: "Vybrán existující zákazník",
        useNew: "Založit nového zákazníka",
        change: "Změnit zákazníka",
      },
      devices: {
        title: "Zařízení zákazníka",
        hint: "Vyberte existující zařízení nebo pokračujte s novým.",
        loading: "Načítání zařízení zákazníka...",
        error: "Zařízení zákazníka se nepodařilo načíst.",
        empty: "Tento zákazník zatím nemá uložené zařízení.",
        selected: "Vybráno existující zařízení",
        useNew: "Přidat nové zařízení",
        change: "Změnit zařízení",
        identifier: "Identifikátor",
      },
    },
  },
} as const;

export default intakeWizardRuntimeTranslations;
