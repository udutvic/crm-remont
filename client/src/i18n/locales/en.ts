const en = {
  translation: {
    common: {
      language: "Language",
      english: "English",
      ukrainian: "Ukrainian",
      czech: "Czech",
      loading: "Loading...",
      save: "Save",
      cancel: "Cancel",
      edit: "Edit",
      delete: "Delete",
      view: "View",
      back: "Back",
      close: "Close",
      status: "Status",
      all: "All",
      yes: "Yes",
      no: "No",
      notAvailable: "-",
      noData: "No data found.",
      openMenu: "Open menu",
    },

    navigation: {
      dashboard: "Dashboard",
      clients: "Clients",
      devices: "Devices",
      orders: "Orders",
    },

    statuses: {
      pending: "Pending",
      inProgress: "In Progress",
      completed: "Completed",
      cancelled: "Cancelled",
      unrepairable: "Not repairable",
    },

    delivery: {
      notReady: "Not ready",
      ready: "Ready",
      delivered: "Delivered",
      deliver: "Deliver",
      delivering: "Delivering...",
      error: "Failed to mark as delivered.",
      readyWithoutRepair: "No repair",
      returnedWithoutRepair: "Returned without repair",
      deliverWithoutRepair: "Return",
      returningWithoutRepair: "Returning...",
    },

    ordersPage: {
      title: "Orders",
      addOrder: "Add Order",
      loading: "Loading orders...",
      empty: "No orders found.",
      grid: {
        rowsPerPage: "Rows per page:",
      },
      columns: {
        id: "ID",
        device: "Device",
        client: "Client",
        price: "Price",
        received: "Received",
        status: "Status",
        delivery: "Delivery",
        actions: "Actions",
      },
      labels: {
        client: "Client",
        price: "Price",
        received: "Received",
        status: "Status",
        delivery: "Delivery",
      },
      priceTypes: {
        final: "Final",
        estimated: "Estimated",
      },
      actions: {
        view: "View order",
        edit: "Edit order",
        delete: "Delete order",
      },
      deleteConfirmation:
        'Are you sure you want to delete order "{{id}}"?',
      errors: {
        loadFailed: "Failed to load orders.",
        clientsLoadFailed: "Failed to load clients.",
        statusUpdateFailed: "Failed to change order status.",
      },
    },

    deleteDialog: {
      title: "Confirm Deletion",
      cancel: "Cancel",
      delete: "Delete",
    },

    clientInfo: {
      noOwner: "No owner",
      unknown: "Unknown",
      avatarAlt: "Client avatar",
    },

    dashboardPage: {
      title: "Dashboard",
      loading: "Loading dashboard...",
      statistics: {
        clients: "Clients",
        devices: "Devices",
        orders: "Orders",
        income: "Income",
      },
      recentOrders: {
        title: "Latest 5 Orders",
        empty: "No orders found.",
        columns: {
          id: "ID",
          device: "Device",
          client: "Client",
          received: "Received",
          status: "Status",
        },
        labels: {
          device: "Device",
          client: "Client",
          received: "Received",
        },
      },
      errors: {
        loadFailed: "Some dashboard data could not be loaded.",
      },
    },

    clientsPage: {
      title: "Clients",
      addClient: "Add Client",
      loading: "Loading clients...",
      empty: "No clients found.",
      columns: {
        name: "Name",
        phone: "Phone",
        email: "Email",
        date: "Date",
        actions: "Actions",
      },
      labels: {
        phone: "Phone",
        email: "Email",
      },
      actions: {
        edit: "Edit client",
        delete: "Delete client",
      },
      deleteConfirmation:
        'Are you sure you want to delete client "{{name}}"?',
      errors: {
        loadFailed: "Failed to load clients.",
      },
    },

    clientForm: {
      titles: {
        add: "Add New Client",
        edit: "Edit Client",
      },
      fields: {
        fullName: "Full name",
        phone: "Phone",
        secondaryPhone: "Secondary phone",
        email: "Email",
        address: "Address",
        note: "Client note",
      },
      lookup: {
        searching: "Searching...",
        findClient: "Find client",
        notFound:
          "No existing client was found. Complete the form to create a new client.",
        failed: "Unable to search for the client.",
      },
      helpers: {
        optional: "Optional",
        note: "Internal information about the client",
      },
      validation: {
        nameRequired: "Full name is required",
        nameMax: "Full name cannot exceed 120 characters",
        phoneRequired: "Phone is required",
        phoneInvalid: "Enter a valid phone number",
        secondaryPhoneInvalid:
          "Enter a valid secondary phone number",
        emailInvalid: "Invalid email format",
        emailMax: "Email cannot exceed 160 characters",
        addressMax: "Address cannot exceed 255 characters",
        noteMax: "Note cannot exceed 2000 characters",
      },
      actions: {
        cancel: "Cancel",
        save: "Save",
      },
      errors: {
        save: "Error saving client. Please try again.",
      },
    },

    devicesPage: {
      title: "Devices",
      addDevice: "Add Device",
      loading: "Loading devices...",
      empty: "No devices found.",
      columns: {
        brand: "Brand",
        model: "Model",
        identifier: "Identifier",
        client: "Client",
        date: "Date",
        actions: "Actions",
      },
      labels: {
        client: "Client",
        deviceType: "Device type",
        date: "Date",
      },
      identifiers: {
        imei1: "IMEI 1",
        imei2: "IMEI 2",
        serial: "Serial number",
        none: "No identifier",
      },
      deviceTypes: {
        phone: "Phone",
        tablet: "Tablet",
        laptop: "Laptop",
        smartwatch: "Smartwatch",
        other: "Other",
      },
      actions: {
        edit: "Edit device",
        delete: "Delete device",
      },
      deleteConfirmation:
        'Are you sure you want to delete device "{{device}}"?',
      errors: {
        loadFailed: "Failed to load devices.",
        clientsLoadFailed: "Failed to load clients.",
      },
    },

    deviceForm: {
      titles: {
        add: "Add New Device",
        edit: "Edit Device",
      },
      fields: {
        client: "Client",
        deviceType: "Device type",
        color: "Color",
        brand: "Brand",
        model: "Model",
        imei1: "IMEI 1",
        imei2: "IMEI 2",
        serial: "Serial number",
      },
      deviceTypes: {
        phone: "Phone",
        tablet: "Tablet",
        laptop: "Laptop",
        smartwatch: "Smartwatch",
        other: "Other",
      },
      helpers: {
        noClients: "No clients available",
        optional: "Optional",
        imei: "Optional, 15 digits",
      },
      validation: {
        clientRequired: "Client is required",
        deviceTypeRequired: "Device type is required",
        colorMax: "Color cannot exceed 80 characters",
        brandRequired: "Brand is required",
        brandMax: "Brand cannot exceed 120 characters",
        modelRequired: "Model is required",
        modelMax: "Model cannot exceed 120 characters",
        imeiCharacters:
          "IMEI may contain only digits, spaces and hyphens",
        imeiLength: "IMEI must contain exactly 15 digits",
        serialMax:
          "Serial number cannot exceed 100 characters",
      },
      actions: {
        cancel: "Cancel",
        save: "Save",
        saving: "Saving...",
      },
      errors: {
        save: "Error saving device. Please try again.",
        existingDevice: "Existing device ID: {{id}}.",
      },
    },

    repairIntake: {
      title: "New Repair Intake",
      intro:
        "Client, device and order will be saved together in one transaction.",
      sections: {
        client: "Client",
        device: "Device",
        order: "Repair Intake",
      },
      modes: {
        existing: "Existing",
        new: "New",
      },
      fields: {
        existingClient: "Find existing client",
        existingDevice: "Select existing device",
      },
      lookup: {
        checkPhone: "Check phone",
        checking: "Checking...",
        found: "Existing client found and selected.",
        notFound: "No client found. Continue creating a new client.",
        failed: "Unable to check the phone number.",
      },
      helpers: {
        selectClientFirst: "Select an existing client first.",
        noDevices: "This client has no registered devices.",
        newClientNewDevice:
          "A new client must be saved with a new device.",
      },
      actions: {
        create: "Create Intake",
        creating: "Creating...",
      },
      errors: {
        loadDevices: "Failed to load devices.",
        save: "Failed to create repair intake.",
        codes: {
          INTAKE_VALIDATION_FAILED: "Intake data is invalid.",
          INTAKE_CLIENT_NOT_FOUND: "The selected client was not found.",
          INTAKE_CLIENT_PHONE_CONFLICT:
            "A client with this phone number already exists.",
          INTAKE_CLIENT_EMAIL_CONFLICT:
            "A client with this email address already exists.",
          INTAKE_DEVICE_NOT_FOUND: "The selected device was not found.",
          INTAKE_DEVICE_CLIENT_MISMATCH:
            "The selected device belongs to another client.",
          INTAKE_DEVICE_IDENTIFIER_CONFLICT:
            "A device with this IMEI or serial number already exists.",
          INTAKE_ORDER_VALIDATION_FAILED: "Order data is invalid.",
          INTAKE_RELATION_INVALID:
            "The selected client or device is invalid.",
          INTAKE_CREATE_FAILED: "Failed to create repair intake.",
        },
      },
    },

    orderForm: {
      titles: {
        create: "Create New Order",
        edit: "Edit Order",
      },

      sections: {
        clientDevice: "Client and Device",
        intake: "Intake Information",
        repair: "Repair Information",
      },

      fields: {
        client: "Client",
        device: "Device",
        reportedProblem: "Reported Problem",
        deviceCondition: "Device Condition",
        accessories: "Accessories",
        receivedAt: "Received At",
        dueAt: "Due At",
        accessType: "Access Type",
        accessCode: "Access Code",
        status: "Status",
        estimatedPrice: "Estimated Price",
        finalPrice: "Final Price",
        diagnosis: "Diagnosis",
        workPerformed: "Work Performed",
        internalNote: "Internal Note",
      },

      placeholders: {
        deviceCondition: "Scratches, cracks, bent frame...",
        accessories: "Phone, case, charger...",
      },

      accessTypes: {
        none: "No access code",
        pin: "PIN",
        password: "Password",
        pattern: "Pattern",
        unknown: "Unknown",
      },

      helpers: {
        noClients: "No clients available",
        noDevices: "This client has no devices",
        codeSaved: "A code is already saved. Leave blank to keep it.",
        patternExample: "Example: 1-2-5-8",
        unknownAccess: "The access method is unknown.",
        noCodeRequired: "No access code is required.",
        internalNote: "Visible only to service staff.",
      },

      validation: {
        clientRequired: "Client is required",
        deviceRequired: "Device is required",
        clientDeviceRequired: "Client and device must be selected.",
        problemRequired: "Problem is required",
        problemMax: "Problem cannot exceed 255 characters",
        receivedRequired: "Received date is required",
        dueBeforeReceived: "Due date cannot be earlier than received date",
        accessCodeRequired: "Access code is required",
        accessCodeMax: "Access code cannot exceed 256 characters",
        estimatedNonNegative: "Estimated price cannot be negative",
        estimatedWhole: "Estimated price must be a whole number",
        finalNonNegative: "Final price cannot be negative",
        finalWhole: "Final price must be a whole number",
      },

      actions: {
        cancel: "Cancel",
        add: "Add",
        update: "Update",
      },

      errors: {
        loadDevices: "Failed to load devices.",
        save: "Failed to save order.",
      },
    },

    orderDetails: {
      title: "Order #{{id}}",
      backToOrders: "Back to Orders",
      editOrder: "Edit Order",
      loadingOrder: "Loading order...",
      clientFallback: "Client #{{id}}",
      sections: {
        client: "Client",
        device: "Device",
        intake: "Intake",
        repair: "Repair",
        price: "Price",
        timeline: "Timeline",
      },
      fields: {
        name: "Name",
        phone: "Phone",
        secondaryPhone: "Secondary Phone",
        email: "Email",
        address: "Address",
        clientNote: "Client Note",
        deviceType: "Device Type",
        brand: "Brand",
        model: "Model",
        color: "Color",
        imei1: "IMEI 1",
        imei2: "IMEI 2",
        serialNumber: "Serial Number",
        reportedProblem: "Reported Problem",
        deviceCondition: "Device Condition",
        accessories: "Accessories",
        deviceAccess: "Device Access",
        received: "Received",
        dueDate: "Due Date",
        diagnosis: "Diagnosis",
        workPerformed: "Work Performed",
        internalNote: "Internal Note",
        estimatedPrice: "Estimated Price",
        finalPrice: "Final Price",
        created: "Created",
        lastUpdated: "Last Updated",
        completed: "Completed",
        delivered: "Delivered",
      },
      deviceTypes: {
        phone: "Phone",
        tablet: "Tablet",
        laptop: "Laptop",
        smartwatch: "Smartwatch",
        other: "Other",
      },
      access: {
        pinProvided: "PIN provided",
        pinNotProvided: "PIN not provided",
        passwordProvided: "Password provided",
        passwordNotProvided: "Password not provided",
        patternProvided: "Pattern provided",
        patternNotProvided: "Pattern not provided",
        unknown: "Unknown",
        none: "No access code",
      },
      errors: {
        invalidId: "Invalid order ID.",
        notFound: "Order not found.",
        loadFailed: "Failed to load order.",
        statusUpdateFailed: "Failed to change order status.",
        deliveryFailed: "Failed to mark order as delivered.",
        editPreparationFailed: "Failed to prepare the edit form.",
        missingOrderId: "Order ID is missing.",
      },
    },
  },
};

export default en;
