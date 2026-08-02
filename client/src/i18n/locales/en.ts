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
      inventory: "Inventory",
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

    auth: {
      subtitle: "Sign in to continue working with the repair service.",
      checkingSession: "Checking session...",
      fields: {
        email: "Email",
        password: "Password",
      },
      actions: {
        signIn: "Sign in",
        signingIn: "Signing in...",
        signOut: "Sign out",
        showPassword: "Show password",
        hidePassword: "Hide password",
        retry: "Try again",
      },
      roles: {
        admin: "Administrator",
        technician: "Technician",
      },
      userMenu: {
        open: "Open user menu",
      },
      errors: {
        required: "Enter your email and password.",
        loginFailed: "Could not sign in.",
        sessionCheckFailed:
          "Could not verify the session. Check that the server is running and try again.",
        codes: {
          AUTH_INVALID_INPUT: "Enter a valid email and password.",
          AUTH_INVALID_CREDENTIALS: "Incorrect email or password.",
          AUTH_ACCOUNT_DISABLED: "This account is disabled.",
          AUTH_RATE_LIMITED: "Too many attempts. Try again later.",
          ORIGIN_FORBIDDEN: "This application address is not allowed by the server.",
        },
      },
    },

    security: {
      accessDenied: "You do not have permission to open this page.",
      backToDashboard: "Back to dashboard",
    },

    accessCode: {
      types: {
        none: "access code",
        pin: "PIN",
        password: "password",
        pattern: "pattern",
        unknown: "access code",
      },
      actions: {
        show: "Show {{type}}",
        confirmShow: "Show code",
        loading: "Loading...",
        hide: "Hide",
        copy: "Copy",
      },
      confirm: {
        title: "Show device access code?",
        message:
          "This action will be recorded in the audit log. The {{type}} will be visible for {{seconds}} seconds.",
      },
      autoHide:
        "The code will be hidden automatically after {{seconds}} seconds.",
      copied: "Copied",
      errors: {
        revealFailed: "Could not reveal the access code.",
        copyFailed: "Could not copy the access code.",
      },
    },

    notFoundPage: {
      title: "Page not found",
      description:
        "The requested CRM page does not exist or the address is incorrect.",
      back: "Go back",
      dashboard: "Dashboard",
    },

    inventoryPage: {
      title: "Inventory",
      add: "Add part",
      refresh: "Refresh",
      clear: "Clear",
      empty: "No inventory items match the selected filters.",
      saving: "Saving...",
      summary: {
        active: "Active parts",
        units: "Units in stock",
        low: "Low-stock items",
        out: "Out of stock",
        purchase: "Purchase value",
        sale: "Potential sale value",
      },
      filters: {
        search: "Search SKU, barcode, name or compatibility",
        stock: "Stock level",
        allStock: "All stock levels",
        lowOnly: "Low stock only",
        status: "Item status",
        active: "Active",
        inactive: "Inactive",
        all: "All",
      },
      table: {
        item: "Part",
        stock: "Stock / minimum",
        actions: "Actions",
      },
      stock: {
        ok: "In stock",
        low: "Low stock",
        out: "Out of stock",
        inactive: "Inactive",
      },
      actions: {
        edit: "Edit part",
        movement: "Stock movement",
        history: "Movement history",
      },
      messages: {
        created: "The inventory item was created.",
        updated: "The inventory item was updated.",
        movement: "{{type}} movement was recorded.",
      },
      fields: {
        sku: "SKU",
        supplierSku: "Supplier SKU",
        barcode: "Barcode",
        name: "Name",
        category: "Category",
        brand: "Brand",
        compatibility: "Compatibility",
        purchasePrice: "Purchase price",
        salePrice: "Sale price",
        initialQuantity: "Initial quantity",
        minStock: "Minimum stock",
        supplier: "Supplier",
        location: "Storage location",
        note: "Note",
        active: "Active item",
      },
      itemDialog: {
        add: "Add inventory item",
        edit: "Edit inventory item",
        current: "Current stock: {{quantity}}. Change it only through a stock movement.",
        quantityHint: "Stock quantity is audit-controlled and cannot be edited directly.",
      },
      movementTypes: {
        receipt: "Receipt",
        issue: "Issue to repair",
        return: "Return from repair",
        adjustment: "Stock adjustment",
      },
      movement: {
        title: "Create stock movement",
        type: "Movement type",
        quantity: "Quantity",
        unitCost: "Unit cost",
        order: "Repair order",
        save: "Record movement",
        balance: "Current: {{current}} · after movement: {{projected}}",
        adjustmentHint: "Use a positive number to add stock or a negative number to reduce it.",
        loadingOrders: "Loading orders...",
        noOrders: "No repair orders are available.",
      },
      history: {
        title: "Movement history — {{name}}",
        empty: "No stock movements have been recorded.",
        date: "Date",
        type: "Type",
        change: "Change",
        balance: "Balance",
        order: "Order",
        user: "Employee",
      },
      validation: {
        required: "This field is required.",
        price: "Enter a valid non-negative price.",
        quantity: "Enter a non-negative whole number.",
        stock: "The movement would make the stock negative.",
      },
      errors: {
        loadFailed: "Inventory could not be loaded.",
        saveFailed: "The inventory item could not be saved.",
        movementFailed: "The stock movement could not be recorded.",
        historyFailed: "Movement history could not be loaded.",
        ordersFailed: "Repair orders could not be loaded.",
      },
      apiErrors: {
        validation: "Check the entered inventory data.",
        filter: "One of the inventory filters is invalid.",
        invalidId: "The inventory item ID is invalid.",
        notFound: "The inventory item was not found.",
        skuExists: "An item with this SKU already exists.",
        supplierSkuExists: "An item with this supplier SKU already exists.",
        barcodeExists: "An item with this barcode already exists.",
        duplicate: "An item with these identifiers already exists.",
        directQuantity: "Stock quantity can only be changed through a movement.",
        emptyUpdate: "No fields were provided for update.",
        inactive: "Movements cannot be created for an inactive item.",
        orderNotFound: "The selected repair order was not found.",
        stock: "There is not enough stock for this movement.",
        server: "A server error occurred in the inventory module.",
        forbidden: "You do not have permission for this inventory action.",
        auth: "Your session has expired. Sign in again.",
      },
    },
    profilePages: {
      clientProfile: "Client profile",
      deviceProfile: "Device profile",
      clientSince: "Client since {{date}}",
      deviceSince: "Device added {{date}}",
      contactInformation: "Contact information",
      clientDevices: "Client devices",
      repairHistory: "Repair history",
      owner: "Owner",
      identifiers: "Identifiers",
      delivered: "Delivered",
      noIdentifier: "No identifier",
      unknownClient: "Unknown client",
      fields: { phone: "Phone", secondaryPhone: "Secondary phone", email: "Email", address: "Address", note: "Note", imei1: "IMEI 1", imei2: "IMEI 2", serial: "Serial number", color: "Color" },
      stats: { devices: "Devices", repairs: "Repairs", activeRepairs: "Active repairs", completedIncome: "Completed repair value", lastRepair: "Last repair" },
      status: { pending: "Pending", in_progress: "In progress", completed: "Completed", cancelled: "Cancelled", unrepairable: "Unrepairable" },
      empty: { devices: "This client has no devices yet.", repairs: "No repair history yet." },
      actions: { backToClients: "Back to clients", backToDevices: "Back to devices", newRepair: "New repair", retry: "Retry" },
      errors: { invalidClient: "Invalid client ID.", invalidDevice: "Invalid device ID.", clientLoad: "Could not load the client profile.", deviceLoad: "Could not load the device profile." },
    },

    staffPage: {
      title: "Staff",
      addStaff: "Add employee",
      securityNotice:
        "Only administrators can manage staff accounts. Password changes, role changes, account status changes, and session revocations are recorded in the audit log.",
      empty: "No employees match the selected filters.",
      currentAccount: "Current account",
      activeSessions: "Sessions: {{count}}",
      lastLogin: "Last sign-in",
      passwordChanged: "Password changed",
      never: "Never",
      passwordHint: "The password must contain at least 12 characters.",
      selfProtection:
        "For safety, you cannot deactivate your own account or remove your own administrator role.",
      roles: {
        all: "All roles",
        admin: "Administrator",
        technician: "Technician",
      },
      status: {
        all: "All statuses",
        active: "Active",
        inactive: "Inactive",
      },
      filters: {
        search: "Search",
        searchPlaceholder: "Name or email",
        role: "Role",
        status: "Status",
        reset: "Reset",
      },
      fields: {
        name: "Name",
        email: "Email",
        role: "Role",
        active: "Account active",
        password: "Password",
        newPassword: "New password",
        confirmPassword: "Confirm password",
      },
      actions: {
        create: "Create employee",
        edit: "Edit",
        save: "Save",
        saving: "Saving...",
        resetPassword: "Reset password",
        revokeSessions: "End sessions",
        confirmRevoke: "End sessions",
        refresh: "Refresh",
        showPassword: "Show password",
        hidePassword: "Hide password",
      },
      dialogs: {
        createTitle: "Create employee account",
        editTitle: "Edit {{name}}",
        passwordTitle: "Set a new password for {{name}}",
        passwordMessage:
          "All active sessions for this employee will be ended after the password is changed.",
        selfPasswordMessage:
          "Your current browser session will remain active. Your other sessions will be ended.",
        revokeTitle: "End active sessions?",
        revokeMessage:
          "{{name}} currently has {{count}} active session(s). They will need to sign in again.",
        selfRevokeMessage:
          "Your current browser session will remain active. Up to {{count}} other session(s) will be ended.",
      },
      messages: {
        created: "Employee account created.",
        updated: "Employee account updated.",
        passwordReset: "Password changed and old sessions ended.",
        sessionsRevoked: "Ended sessions: {{count}}.",
      },
      validation: {
        passwordMismatch: "The passwords do not match.",
      },
      errors: {
        loadFailed: "Could not load staff accounts.",
        createFailed: "Could not create the employee account.",
        updateFailed: "Could not update the employee account.",
        passwordFailed: "Could not change the password.",
        revokeFailed: "Could not end the active sessions.",
      },
      apiErrors: {
        STAFF_EMAIL_EXISTS: "An employee with this email already exists.",
        STAFF_SELF_DEACTIVATE_FORBIDDEN: "You cannot deactivate your own account.",
        STAFF_SELF_DEMOTE_FORBIDDEN: "You cannot remove your own administrator role.",
        STAFF_LAST_ADMIN_REQUIRED: "At least one active administrator must remain.",
        STAFF_NOT_FOUND: "Employee account not found.",
        STAFF_VALIDATION_FAILED: "Check the entered employee details.",
      },
      pagination: {
        rowsPerPage: "Employees per page:",
        displayedRows: "{{from}}–{{to}} of {{count}}",
      },
    },

    auditPage: {
      title: "Audit log",
      refresh: "Refresh",
      empty: "No audit events match the selected filters.",
      systemUser: "System or deleted user",
      filters: {
        action: "Action",
        actionPlaceholder: "For example: LOGIN or ORDER",
        entity: "Entity",
        startDate: "From date",
        endDate: "To date",
        reset: "Reset",
      },
      columns: {
        date: "Date and time",
        user: "User",
        action: "Action",
        entity: "Entity",
        request: "Request",
        status: "Status",
      },
      pagination: {
        rowsPerPage: "Rows per page:",
        displayedRows: "{{from}}–{{to}} of {{count}}",
      },
      entities: {
        all: "All entities",
        auth: "Authentication",
        client: "Client",
        device: "Device",
        intake: "Intake",
        order: "Order",
        stats: "Statistics",
        staff_user: "Employee",
      },
      actions: {
        AUTH_LOGIN_SUCCESS: "Successful sign-in",
        AUTH_LOGIN_FAILED: "Failed sign-in",
        AUTH_LOGOUT_SUCCESS: "Sign-out",
        AUTH_LOGOUT_FAILED: "Failed sign-out",
        CLIENT_CREATE: "Client created",
        CLIENT_UPDATE: "Client updated",
        CLIENT_DELETE: "Client deleted",
        DEVICE_CREATE: "Device created",
        DEVICE_UPDATE: "Device updated",
        DEVICE_DELETE: "Device deleted",
        INTAKE_CREATE: "Repair intake created",
        ORDER_CREATE: "Order created",
        ORDER_UPDATE: "Order updated",
        ORDER_STATUS_UPDATE: "Order status changed",
        ORDER_DELIVER: "Order delivered",
        ORDER_DELETE: "Order deleted",
        STAFF_USER_CREATE: "Employee created",
        STAFF_USER_UPDATE: "Employee updated",
        STAFF_USER_PASSWORD_RESET: "Employee password reset",
        STAFF_USER_SESSIONS_REVOKE: "Employee sessions ended",
        ORDER_ACCESS_CODE_REVEAL: "Access code revealed",
      },
      errors: {
        loadFailed: "Could not load the audit log.",
      },
    },

    ordersPage: {
      listTools: {
        searchLabel: "Search orders",
        searchPlaceholder: "Order number, customer, phone, IMEI, device...",
        deliveryLabel: "Delivery",
        deliveryAll: "All",
        deliveryReady: "Ready for collection",
        deliveryNotDelivered: "Not collected",
        deliveryDelivered: "Collected",
        startDate: "Received from",
        endDate: "Received to",
        reset: "Reset",
        rowsPerPage: "Rows per page:",
        displayedRows: "{{from}}–{{to}} of {{count}}",
      },

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
      title: "Confirm deletion",
      cancel: "Cancel",
      delete: "Delete",
      confirmGeneric:
        "Are you sure you want to delete this item?",
      confirmItem:
        'Are you sure you want to delete "{{name}}"?',
      itemNumber: "item #{{id}}",
      errors: {
        clientHasOrders:
          "The client cannot be deleted because repair orders are associated with this client.",
        clientHasDevices:
          "The client cannot be deleted because devices are associated with this client.",
        deviceHasOrders:
          "The device cannot be deleted because repair orders are associated with this device.",
        clientNotFound:
          "The client was not found.",
        deviceNotFound:
          "The device was not found.",
        orderNotFound:
          "The order was not found.",
        invalidClient:
          "The client ID is invalid.",
        invalidDevice:
          "The device ID is invalid.",
        invalidOrder:
          "The order ID is invalid.",
        forbidden:
          "You do not have permission to delete this item.",
        notFound:
          "The item was not found or has already been deleted.",
        conflict:
          "This item cannot be deleted because it is used by other records.",
        server:
          "A server error occurred while deleting the item.",
        deleteFailed:
          "The item could not be deleted.",
      },
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
        saving: "Saving...",
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
        saving: "Saving...",
      },

      errors: {
        loadDevices: "Failed to load devices.",
        save: "Failed to save order.",
      },
    },

    receipt: {
      title: "Repair intake receipt",
      serviceCopyTitle: "Repair intake protocol",
      customerCopyTitle: "Repair intake confirmation",
      serviceCopy: "Service copy",
      customerCopy: "Customer copy",
      loading: "Loading receipt...",
      cutLine: "Cut line",
      blankLine: "________________",
      printHint:
        "In the print dialog select A4, 100% scale and disable browser headers and footers.",
      configurationWarning:
        "Service details are not filled in. Edit client/src/config/serviceReceiptConfig.ts before using receipts with customers.",
      confirmation:
        "The customer confirms that the device, its visible condition, accessories and reported fault are recorded correctly and that the repair terms below have been accepted.",
      customerTerms:
        "Full repair terms: {{url}}",
      fields: {
        identifiers: "IMEI / Serial number",
        receivedByCustomer: "Received by customer",
        paid: "Paid",
        stampAndSignature: "Stamp and signature",
      },
      terms: {
        title: "Repair terms",
        item1:
          "The final price and completion date may be confirmed only after diagnosis. The service will contact the customer if approval of additional work or costs is required.",
        item2:
          "The customer is responsible for backing up important data before repair. Some repairs or software procedures may cause data loss.",
        item3:
          "Without a PIN, password or pattern, input and output testing may be limited. The access code itself is not printed on this receipt.",
        item4:
          "After opening a device, the original water resistance cannot be guaranteed unless separately confirmed in writing.",
        item5:
          "Devices with liquid, corrosion, impact or board damage may contain hidden faults that can appear during diagnosis or repair.",
        item6:
          "Only accessories listed on this receipt are considered to have been accepted with the device.",
        item7:
          "The device is released against this receipt or after verification of the recipient's identity.",
        item8:
          "Uncollected devices are handled according to the published repair terms and applicable law.",
        fullTerms:
          "Full terms: {{url}}",
      },
      actions: {
        open: "Receipt",
        back: "Back to order",
        print: "Print / Save PDF",
      },
      signatures: {
        customer: "Customer signature",
        service: "Service representative",
      },
      errors: {
        loadFailed: "Could not load the receipt.",
      },
    },

    orderDetails: {
      title: "Order {{number}}",
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
