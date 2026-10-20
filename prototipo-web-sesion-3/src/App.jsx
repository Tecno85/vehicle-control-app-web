import { useMemo, useState } from "react";

const demoVehicles = [
  {
    id: "private-demo",
    plate: "ABC123",
    make: "Vehículo de ejemplo",
    model: "Particular",
    type: "Particular",
    indrive: true,
    status: "Activo",
  },
  {
    id: "taxi-demo",
    plate: "XYZ789",
    make: "Vehículo de ejemplo",
    model: "Taxi",
    type: "Taxi",
    driver: "Conductor de ejemplo",
    quota: 60000,
    status: "Activo",
  },
];

const demoDocuments = [
  {
    id: "doc-demo",
    vehicleId: "taxi-demo",
    type: "SOAT",
    name: "SOAT de ejemplo",
    dueDate: "Fecha ficticia",
    dueTone: "safe",
    fileName: "Sin archivo adjunto",
    fileUrl: "",
    fileType: "",
  },
  {
    id: "inspection-demo",
    vehicleId: "private-demo",
    type: "Tecnomecánica",
    name: "Tecnomecánica de ejemplo",
    dueDate: "Fecha ficticia",
    dueTone: "warning",
    fileName: "Sin archivo adjunto",
    fileUrl: "",
    fileType: "",
  },
];

const initialExpenses = [
  {
    id: "expense-demo",
    vehicleId: "taxi-demo",
    date: "Fecha de ejemplo",
    amount: 65000,
    category: "Combustible",
    description: "Gasto de demostración",
  },
];

const expenseCategories = ["Combustible", "Lavado", "Mantenimiento", "Repuestos", "Seguros/Pólizas"];

const CONDUCTOR_DAILY = 5000;
const CONDUCTOR_CATEGORY = "Conductor";

function formatCurrency(value) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);
}

function formatMonthLabel(value) {
  if (!/^\d{4}-\d{2}$/.test(value)) return value;
  const [year, month] = value.split("-").map(Number);
  const label = new Intl.DateTimeFormat("es-CO", { month: "long", year: "numeric" })
    .format(new Date(year, month - 1, 1));
  return label.charAt(0).toUpperCase() + label.slice(1);
}

function getMonthKey(date) {
  const value = String(date || "").slice(0, 7);
  return /^\d{4}-\d{2}$/.test(value) ? value : "";
}

function getToday() {
  const now = new Date();
  const localDate = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
  return localDate.toISOString().slice(0, 10);
}

function Brand({ compact = false }) {
  return (
    <div className={`brand ${compact ? "brand-compact" : ""}`}>
      <span className="brand-mark" aria-hidden="true">VC</span>
      <span>
        <strong>Control Vehicular</strong>
        {!compact && <small>VehicleControlApp Web</small>}
      </span>
    </div>
  );
}

function Field({ label, children, helper }) {
  return (
    <label className="field">
      <span className="field-label">{label}</span>
      {children}
      {helper && <span className="field-helper">{helper}</span>}
    </label>
  );
}

function App() {
  const [page, setPage] = useState("login");
  const [theme, setTheme] = useState("light");
  const [vehicles, setVehicles] = useState(demoVehicles);
  const [documents, setDocuments] = useState(demoDocuments);
  const [expenses, setExpenses] = useState(initialExpenses);
  const [incomes, setIncomes] = useState([]);
  const [currentVehicleId, setCurrentVehicleId] = useState("taxi-demo");
  const [activeDocumentId, setActiveDocumentId] = useState("doc-demo");
  const [message, setMessage] = useState("");
  const [formError, setFormError] = useState("");
  const [newVehicleType, setNewVehicleType] = useState("Particular");
  const [selectedFile, setSelectedFile] = useState(null);
  const [attachingToDocumentId, setAttachingToDocumentId] = useState(null);
  const [categoryList, setCategoryList] = useState(expenseCategories);
  const [inactiveCategories, setInactiveCategories] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [editingCategory, setEditingCategory] = useState(null);
  const [editingVehicleId, setEditingVehicleId] = useState(null);
  const [editingIncomeId, setEditingIncomeId] = useState(null);
  const [editingExpenseId, setEditingExpenseId] = useState(null);
  const [editingDocumentId, setEditingDocumentId] = useState(null);
  const [pendingConfirmation, setPendingConfirmation] = useState(null);

  const currentVehicle = useMemo(
    () => vehicles.find((vehicle) => vehicle.id === currentVehicleId) || vehicles[0],
    [vehicles, currentVehicleId],
  );
  const activeDocument = useMemo(
    () => documents.find((document) => document.id === activeDocumentId) || documents[0],
    [documents, activeDocumentId],
  );
  const activeCategories = categoryList.filter((category) => !inactiveCategories.includes(category));

  function vehicleHasRecords(vehicleId) {
    return documents.some((item) => item.vehicleId === vehicleId)
      || expenses.some((item) => item.vehicleId === vehicleId)
      || incomes.some((item) => item.vehicleId === vehicleId);
  }

  function announce(text) {
    setMessage(text);
    window.setTimeout(() => setMessage(""), 3200);
  }

  function openVehicle(vehicleId) {
    setCurrentVehicleId(vehicleId);
    setPage("vehicle-detail");
  }

  function openDocument(documentId) {
    const document = documents.find((item) => item.id === documentId);
    if (!document) return;
    setActiveDocumentId(documentId);
    setCurrentVehicleId(document.vehicleId);
    setPage("document-view");
  }

  function returnToVehicle() {
    setFormError("");
    setPage("vehicle-detail");
  }

  function saveVehicle(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const plate = String(form.get("plate") || "").trim().toUpperCase();
    const make = String(form.get("make") || "").trim();
    const model = String(form.get("model") || "").trim();

    if (!plate || !make || !model) {
      setFormError("Completa la placa, la marca y el modelo para continuar.");
      return;
    }

    const existingVehicle = vehicles.find((item) => item.id === editingVehicleId);
    const vehicle = {
      id: existingVehicle?.id || `vehicle-${Date.now()}`,
      plate,
      make,
      model,
      type: newVehicleType,
      status: existingVehicle?.status || "Activo",
      ...(newVehicleType === "Taxi"
        ? { driver: String(form.get("driver") || "").trim(), quota: Number(form.get("quota")) || 0 }
        : { indrive: form.get("indrive") === "on" }),
    };
    setVehicles((current) => existingVehicle
      ? current.map((item) => item.id === existingVehicle.id ? vehicle : item)
      : [...current, vehicle]);
    setCurrentVehicleId(vehicle.id);
    setEditingVehicleId(null);
    setFormError("");
    setPage("vehicle-detail");
    announce(`${existingVehicle ? "Vehículo actualizado" : "Vehículo agregado"} a la demostración temporal.`);
  }

  function saveIncome(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const amountValue = String(form.get("amount") ?? "").trim();
    const amount = Number(amountValue);
    if (amountValue === "" || !Number.isFinite(amount) || amount < 0) {
      setFormError("Escribe un valor de ingreso válido. Puedes registrar cero.");
      return;
    }

    const isTaxi = currentVehicle.type === "Taxi";
    const quota = currentVehicle.quota || 0;
    const reason = String(form.get("reason") || "").trim();
    const note = String(form.get("note") || "").trim();

    if (isTaxi && amount !== quota && !reason) {
      setFormError("Si el valor recibido difiere de la cuota, escribe el motivo.");
      return;
    }

    const existingIncome = incomes.find((item) => item.id === editingIncomeId);
    const income = {
      id: existingIncome?.id || `income-${Date.now()}`,
      vehicleId: currentVehicle.id,
      type: isTaxi ? "Cuota diaria de taxi" : "Ingreso diario de inDrive",
      date: String(form.get("date") || ""),
      amount,
      note,
      reason,
      conductorPagado: isTaxi && amount > 0,
    };
    setIncomes((current) => existingIncome
      ? current.map((item) => item.id === existingIncome.id ? income : item)
      : [income, ...current]);

    // Auto-registrar pago a conductor (5k) si es taxi con ingreso > 0
    if (isTaxi && amount > 0 && !existingIncome) {
      const conductorExpense = {
        id: `expense-${Date.now()}`,
        vehicleId: currentVehicle.id,
        date: String(form.get("date") || ""),
        amount: CONDUCTOR_DAILY,
        category: CONDUCTOR_CATEGORY,
        description: "Pago a conductor",
        isConductor: true,
      };
      setExpenses((current) => [conductorExpense, ...current]);
      // Añadir categoría "Conductor" si no existe
      if (!categoryList.includes(CONDUCTOR_CATEGORY)) {
        setCategoryList((c) => [...c, CONDUCTOR_CATEGORY]);
      }
    }

    setEditingIncomeId(null);
    setFormError("");
    setPage("vehicle-detail");
    announce(`${existingIncome ? "Ingreso actualizado" : "Ingreso agregado"} a la demostración temporal.`);
  }

  function saveExpense(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const amount = Number(form.get("amount"));
    const description = String(form.get("description") || "").trim();
    if (!amount || amount < 0 || !description) {
      setFormError("Completa la descripción y escribe un valor válido.");
      return;
    }

    const existingExpense = expenses.find((item) => item.id === editingExpenseId);
    const expense = {
      id: existingExpense?.id || `expense-${Date.now()}`,
      vehicleId: currentVehicle.id,
      date: String(form.get("date") || ""),
      amount,
      category: String(form.get("category") || existingExpense?.category || activeCategories[0] || "Sin categoría"),
      description,
    };
    setExpenses((current) => existingExpense
      ? current.map((item) => item.id === existingExpense.id ? expense : item)
      : [expense, ...current]);
    setEditingExpenseId(null);
    setFormError("");
    setPage("vehicle-detail");
    announce(`${existingExpense ? "Gasto actualizado" : "Gasto agregado"} a la demostración temporal.`);
  }

  function saveDocument(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") || "").trim();
    const dueDate = String(form.get("dueDate") || "");
    if (!name || !dueDate) {
      setFormError("Completa el nombre del documento y su vencimiento.");
      return;
    }
    if (attachingToDocumentId && !selectedFile) {
      setFormError("Selecciona el archivo de soporte para continuar.");
      return;
    }

    const existingDocumentId = editingDocumentId || attachingToDocumentId;
    const existingDocument = existingDocumentId
      ? documents.find((item) => item.id === existingDocumentId)
      : null;
    const fileUrl = selectedFile ? URL.createObjectURL(selectedFile) : existingDocument?.fileUrl || "";
    const document = {
      id: existingDocument?.id || `document-${Date.now()}`,
      vehicleId: existingDocument?.vehicleId || currentVehicle.id,
      type: String(form.get("type") || existingDocument?.type || "SOAT"),
      name,
      dueDate,
      fileName: selectedFile?.name || existingDocument?.fileName || "Sin archivo adjunto",
      fileUrl,
      fileType: selectedFile?.type || existingDocument?.fileType || "",
    };
    setDocuments((current) => existingDocument
      ? current.map((item) => item.id === existingDocument.id ? document : item)
      : [document, ...current]);
    setActiveDocumentId(document.id);
    setSelectedFile(null);
    setAttachingToDocumentId(null);
    setEditingDocumentId(null);
    setFormError("");
    setPage("document-saved");
    announce(existingDocument
      ? "Documento actualizado en la demostración temporal."
      : "Documento agregado a la demostración temporal.");
  }

  function editVehicle(vehicle) {
    setCurrentVehicleId(vehicle.id);
    setEditingVehicleId(vehicle.id);
    setNewVehicleType(vehicle.type);
    setFormError("");
    setPage("vehicle-form");
  }

  function editIncome(income) {
    setCurrentVehicleId(income.vehicleId);
    setEditingIncomeId(income.id);
    setFormError("");
    setPage("income-form");
  }

  function editExpense(expense) {
    setCurrentVehicleId(expense.vehicleId);
    setEditingExpenseId(expense.id);
    setFormError("");
    setPage("expense-form");
  }

  function editDocument(document) {
    setCurrentVehicleId(document.vehicleId);
    setActiveDocumentId(document.id);
    setEditingDocumentId(document.id);
    setAttachingToDocumentId(null);
    setSelectedFile(null);
    setFormError("");
    setPage("document-form");
  }

  function confirmPendingAction() {
    if (!pendingConfirmation) return;
    const { type, id } = pendingConfirmation;
    if (type === "income") setIncomes((current) => current.filter((item) => item.id !== id));
    if (type === "expense") setExpenses((current) => current.filter((item) => item.id !== id));
    if (type === "document") {
      const document = documents.find((item) => item.id === id);
      if (document?.fileUrl) URL.revokeObjectURL(document.fileUrl);
      setDocuments((current) => current.filter((item) => item.id !== id));
      setActiveDocumentId(null);
    }
    if (type === "vehicle-delete") setVehicles((current) => current.filter((item) => item.id !== id));
    if (type === "vehicle-deactivate") setVehicles((current) => current.map((item) => item.id === id ? { ...item, status: "Inactivo" } : item));
    if (type === "category") setInactiveCategories((current) => current.includes(id) ? current : [...current, id]);
    setPendingConfirmation(null);
    setPage(type.startsWith("vehicle-") ? "fleet" : type === "document" ? "document-list" : type === "income" ? "income-list" : type === "category" ? "categories" : "expense-list");
    announce("El cambio se aplicó solo a esta demostración temporal.");
  }

  function addCategoryInline(name) {
    setCategoryList((current) => current.some((category) => category.toLowerCase() === name.toLowerCase()) ? current : [...current, name]);
    announce(`Categoría "${name}" agregada a esta demostración.`);
  }

  function addCategory(event) {
    event.preventDefault();
    const cleanName = categoryName.trim();
    const duplicate = categoryList.some((category) => category.toLowerCase() === cleanName.toLowerCase() && category !== editingCategory);
    if (!cleanName || duplicate) {
      setFormError("Escribe un nombre disponible para la categoría.");
      return;
    }
    if (editingCategory) {
      setCategoryList((current) => current.map((category) => category === editingCategory ? cleanName : category));
      setInactiveCategories((current) => current.map((category) => category === editingCategory ? cleanName : category));
      setExpenses((current) => current.map((expense) => expense.category === editingCategory ? { ...expense, category: cleanName } : expense));
    } else {
      setCategoryList((current) => [...current, cleanName]);
    }
    setCategoryName("");
    setEditingCategory(null);
    setFormError("");
    setPage("expense-form");
    announce(`Categoría ${editingCategory ? "actualizada" : "agregada"} a esta demostración.`);
  }

  function startEditingCategory(category) {
    setEditingCategory(category);
    setCategoryName(category);
    setFormError("");
  }

  function signOut() {
    setPage("login");
    setMessage("");
  }

  const authPages = ["login", "register", "register-sent", "recover", "recovery-sent", "recovery-password", "password-updated"];
  const shellVisible = !authPages.includes(page);

  return (
    <div className={`app-shell theme-${theme}`}>
      {!shellVisible ? (
        <AuthScreen
          page={page}
          setPage={setPage}
          onSignIn={() => setPage("fleet")}
          onRegister={() => setPage("register-sent")}
          onRecovery={() => setPage("recovery-sent")}
        />
      ) : (
        <div className="workspace">
          <aside className="sidebar">
            <Brand />
            <p className="sidebar-label">MENÚ PRINCIPAL</p>
            <nav className="main-nav" aria-label="Navegación principal">
              <NavButton active={page === "fleet" || page === "vehicle-form" || page === "vehicle-detail"} onClick={() => setPage("fleet")}>Vehículos</NavButton>
              <NavButton active={page === "income-list" || page === "income-form"} onClick={() => setPage("income-list")}>Ingresos</NavButton>
              <NavButton active={page === "expense-list" || page === "expense-form" || page === "categories"} onClick={() => setPage("expense-list")}>Gastos</NavButton>
              <NavButton active={page.startsWith("document")} onClick={() => setPage("document-list")}>Documentos</NavButton>
            </nav>
            <div className="sidebar-bottom">
              <span className="account-label">Sesión de demostración</span>
              <button className="text-button" onClick={signOut}>Salir</button>
            </div>
          </aside>

          <div className="main-column">
            <header className="topbar">
              <div className="mobile-brand"><Brand compact /></div>
              <div className="breadcrumb">VehicleControlApp <span>/</span> {pageTitle(page)}</div>
              <div className="topbar-actions">
                <span className="demo-pill">Demostración</span>
                <button className="theme-button" onClick={() => setTheme((current) => current === "light" ? "dark" : "light")} aria-label="Cambiar tema">
                  {theme === "light" ? "Modo oscuro" : "Modo claro"}
                </button>
              </div>
            </header>

            <main className="page-content">
              <div className="prototype-note" role="note">
                Prototipo: datos de ejemplo; los cambios no se guardan.
              </div>
              {page === "fleet" && <FleetPage vehicles={vehicles} documents={documents} onAdd={() => { setEditingVehicleId(null); setNewVehicleType("Particular"); setPage("vehicle-form"); }} onOpen={openVehicle} />}
              {page === "vehicle-form" && <VehicleForm vehicle={vehicles.find((item) => item.id === editingVehicleId)} onCancel={() => { setEditingVehicleId(null); setPage(editingVehicleId ? "vehicle-detail" : "fleet"); }} onSave={saveVehicle} type={newVehicleType} setType={setNewVehicleType} error={formError} />}
              {page === "vehicle-detail" && currentVehicle && <VehicleDetail vehicle={currentVehicle} hasRecords={vehicleHasRecords(currentVehicle.id)} documents={documents.filter((item) => item.vehicleId === currentVehicle.id)} expenses={expenses.filter((item) => item.vehicleId === currentVehicle.id)} incomes={incomes.filter((item) => item.vehicleId === currentVehicle.id)} onBack={() => setPage("fleet")} onEdit={() => editVehicle(currentVehicle)} onDeleteOrDeactivate={() => setPendingConfirmation({ type: vehicleHasRecords(currentVehicle.id) ? "vehicle-deactivate" : "vehicle-delete", id: currentVehicle.id, name: currentVehicle.plate })} onIncome={() => { setEditingIncomeId(null); setFormError(""); setPage("income-form"); }} onExpense={() => { setEditingExpenseId(null); setFormError(""); setPage("expense-form"); }} onDocument={() => { setEditingDocumentId(null); setAttachingToDocumentId(null); setSelectedFile(null); setFormError(""); setPage("document-form"); }} onDocumentOpen={openDocument} onDocumentEdit={editDocument} onDocumentDelete={(document) => setPendingConfirmation({ type: "document", id: document.id, name: document.name })} onIncomeEdit={editIncome} onIncomeDelete={(income) => setPendingConfirmation({ type: "income", id: income.id, name: income.type })} onExpenseEdit={editExpense} onExpenseDelete={(expense) => setPendingConfirmation({ type: "expense", id: expense.id, name: expense.description })} />}
              {page === "income-form" && currentVehicle && <IncomeForm key={editingIncomeId || `new-${currentVehicle.id}`} vehicle={currentVehicle} income={incomes.find((item) => item.id === editingIncomeId)} onCancel={() => { setEditingIncomeId(null); returnToVehicle(); }} onSave={saveIncome} error={formError} />}
              {page === "expense-form" && currentVehicle && <ExpenseForm key={editingExpenseId || `new-${currentVehicle.id}`} vehicle={currentVehicle} expense={expenses.find((item) => item.id === editingExpenseId)} categories={activeCategories} onCancel={() => { setEditingExpenseId(null); returnToVehicle(); }} onSave={saveExpense} onAddCategory={addCategoryInline} onCategories={() => { setEditingCategory(null); setCategoryName(""); setPage("categories"); }} error={formError} />}
              {page === "expense-list" && <ExpenseList expenses={expenses} vehicles={vehicles} onAdd={() => { const vehicle = vehicles.find((item) => item.status === "Activo"); if (vehicle) setCurrentVehicleId(vehicle.id); setEditingExpenseId(null); setFormError(""); setPage(vehicle ? "expense-form" : "fleet"); }} onOpen={openVehicle} onEdit={editExpense} onDelete={(expense) => setPendingConfirmation({ type: "expense", id: expense.id, name: expense.description })} />}
              {page === "income-list" && <IncomeList incomes={incomes} vehicles={vehicles} onAdd={() => setPage("fleet")} onOpen={openVehicle} onEdit={editIncome} onDelete={(income) => setPendingConfirmation({ type: "income", id: income.id, name: income.type })} />}
              {page === "document-list" && <DocumentList documents={documents} vehicles={vehicles} onOpen={openDocument} onEdit={editDocument} onDelete={(document) => setPendingConfirmation({ type: "document", id: document.id, name: document.name })} onAdd={() => setPage("fleet")} />}
              {page === "document-form" && currentVehicle && <DocumentForm key={editingDocumentId || attachingToDocumentId || `new-${currentVehicle.id}`} vehicle={currentVehicle} existingDocument={documents.find((item) => item.id === (editingDocumentId || attachingToDocumentId))} attachOnly={Boolean(attachingToDocumentId)} selectedFile={selectedFile} setSelectedFile={setSelectedFile} onCancel={() => { setEditingDocumentId(null); setAttachingToDocumentId(null); returnToVehicle(); }} onSave={saveDocument} error={formError} />}
              {page === "document-saved" && activeDocument && <DocumentSaved document={activeDocument} onAttach={() => { setAttachingToDocumentId(activeDocument.id); setSelectedFile(null); setPage("document-form"); }} onView={() => setPage("document-view")} onBack={returnToVehicle} />}
              {page === "document-view" && activeDocument && <DocumentView document={activeDocument} vehicle={vehicles.find((vehicle) => vehicle.id === activeDocument.vehicleId)} onBack={returnToVehicle} onEdit={() => editDocument(activeDocument)} onDelete={() => setPendingConfirmation({ type: "document", id: activeDocument.id, name: activeDocument.name })} />}
              {page === "categories" && <CategoryManager categories={categoryList} inactiveCategories={inactiveCategories} expenses={expenses} value={categoryName} setValue={setCategoryName} editingCategory={editingCategory} onEdit={startEditingCategory} onDeactivate={(category) => setPendingConfirmation({ type: "category", id: category, name: category })} onSave={addCategory} onBack={() => { setEditingCategory(null); setCategoryName(""); setPage("expense-form"); }} error={formError} />}
            </main>
          </div>
        </div>
      )}
      {pendingConfirmation && <ConfirmationDialog confirmation={pendingConfirmation} onCancel={() => setPendingConfirmation(null)} onConfirm={confirmPendingAction} />}
      <div className="toast" role="status" aria-live="polite" data-visible={Boolean(message)}>{message}</div>
    </div>
  );
}

function pageTitle(page) {
  const titles = {
    fleet: "Mis vehículos",
    "vehicle-form": "Crear vehículo",
    "vehicle-detail": "Detalle del vehículo",
    "income-form": "Registrar ingreso",
    "income-list": "Ingresos",
    "expense-form": "Registrar gasto",
    "expense-list": "Gastos",
    "document-form": "Registrar documento",
    "document-list": "Documentos",
    "document-saved": "Documento guardado",
    "document-view": "Soporte del documento",
    categories: "Categorías de gasto",
  };
  return titles[page] || "VehicleControlApp";
}

function NavButton({ active, onClick, children }) {
  return <button className={`nav-button ${active ? "is-active" : ""}`} onClick={onClick} aria-current={active ? "page" : undefined}>{children}</button>;
}

function AuthScreen({ page, setPage, onSignIn, onRegister, onRecovery }) {
  const [formError, setFormError] = useState("");
  const isRegister = page === "register";
  const isRecover = page === "recover";
  const isReset = page === "recovery-password";
  return (
    <main className="auth-layout">
      <div className="auth-brand"><Brand /></div>
      <section className="auth-card" aria-labelledby="auth-title">
        {page === "recovery-sent" ? (
          <>
            <p className="eyebrow">RECUPERACIÓN</p>
            <h1 id="auth-title">Revisa tu correo</h1>
            <p className="muted">Si existe una cuenta con ese correo, enviaremos instrucciones para recuperar la contraseña.</p>
            <button className="button button-primary button-full" onClick={() => setPage("recovery-password")}>Abrir enlace de demostración</button>
            <button className="text-button auth-back-link" onClick={() => setPage("login")}>Volver al inicio de sesión</button>
            <p className="auth-disclaimer">El enlace es simulado; no se envió ningún correo.</p>
          </>
        ) : page === "register-sent" ? (
          <>
            <p className="eyebrow">CREAR CUENTA</p>
            <h1 id="auth-title">Registro de demostración</h1>
            <p className="muted">La pantalla representa el paso de confirmación. No se creó una cuenta real.</p>
            <button className="button button-primary button-full" onClick={() => setPage("login")}>Volver al inicio de sesión</button>
          </>
        ) : page === "password-updated" ? (
          <>
            <p className="eyebrow">RECUPERACIÓN</p>
            <h1 id="auth-title">Contraseña actualizada</h1>
            <p className="muted">La demostración completó el recorrido de recuperación. No se cambió una contraseña real.</p>
            <button className="button button-primary button-full" onClick={() => setPage("login")}>Volver al inicio de sesión</button>
          </>
        ) : (
          <>
            <p className="eyebrow">{isRegister ? "CREAR CUENTA" : isReset ? "RECUPERACIÓN" : isRecover ? "RECUPERAR ACCESO" : "BIENVENIDA"}</p>
            <h1 id="auth-title">{isRegister ? "Crea tu cuenta" : isReset ? "Crea una contraseña nueva" : isRecover ? "Recupera tu contraseña" : "Ingresa a tu cuenta"}</h1>
            <p className="muted">{isRegister ? "Tu cuenta tendrá su propia flota." : isReset ? "Escribe y confirma la nueva contraseña para completar el recorrido." : isRecover ? "Te enviaremos instrucciones al correo de tu cuenta." : "Organiza la información de tus vehículos en un solo lugar."}</p>
            <form className="form-stack" onSubmit={(event) => {
              event.preventDefault();
              const form = new FormData(event.currentTarget);
              if ((isRegister || isReset) && form.get("password") !== form.get("passwordConfirm")) {
                setFormError("Las contraseñas no coinciden.");
                return;
              }
              setFormError("");
              if (isRegister) onRegister();
              else if (isRecover) onRecovery();
              else if (isReset) setPage("password-updated");
              else onSignIn();
            }}>
              {isRegister && <Field label="Nombre"><input name="name" autoComplete="name" placeholder="Tu nombre" required /></Field>}
              {!isReset && <Field label="Correo electrónico"><input name="email" type="email" autoComplete="email" placeholder="nombre@correo.com" required /></Field>}
              {!isRecover && <Field label={isReset ? "Nueva contraseña" : "Contraseña"}><input name="password" type="password" autoComplete={isRegister || isReset ? "new-password" : "current-password"} placeholder={isReset ? "Escribe la nueva contraseña" : "Ingresa tu contraseña"} required /></Field>}
              {(isRegister || isReset) && <Field label="Confirma la contraseña"><input name="passwordConfirm" type="password" autoComplete="new-password" placeholder="Repite la contraseña" required /></Field>}
              {formError && <p className="form-error" role="alert">{formError}</p>}
              <button className="button button-primary button-full" type="submit">{isRegister ? "Crear cuenta" : isReset ? "Guardar contraseña" : isRecover ? "Enviar instrucciones" : "Ingresar"}</button>
            </form>
            <div className="auth-links">
              {!isRegister && !isRecover && !isReset && <button className="text-button" onClick={() => setPage("recover")}>Olvidé mi contraseña</button>}
              {isRegister || isRecover || isReset ? <button className="text-button" onClick={() => setPage("login")}>Volver al inicio de sesión</button> : <button className="text-button" onClick={() => setPage("register")}>Crear una cuenta</button>}
            </div>
            <p className="auth-disclaimer">Pantalla de demostración. No se crean cuentas, no se envían correos ni se modifican contraseñas reales.</p>
          </>
        )}
      </section>
    </main>
  );
}

function FleetPage({ vehicles, documents, onAdd, onOpen }) {
  const taxis = vehicles.filter((vehicle) => vehicle.type === "Taxi").length;
  const privateVehicles = vehicles.length - taxis;
  return (
    <>
      <PageHeading title="Mis vehículos" subtitle="Consulta y organiza la información de cada vehículo." action={<button className="button button-primary" onClick={onAdd}>Agregar vehículo</button>} />
      <div className="summary-grid">
        <SummaryCard number={vehicles.length} label="vehículos" tone="blue" />
        <SummaryCard number={taxis} label="taxis" tone="neutral" />
        <SummaryCard number={privateVehicles} label="particulares" tone="green" />
      </div>
      <section className="section-block">
        <SectionHeading title="Próximos vencimientos" subtitle="Documentos asociados a tus vehículos." />
        {documents.length ? <div className="due-grid">
          {documents.slice(0, 2).map((document) => {
            const vehicle = vehicles.find((item) => item.id === document.vehicleId);
            const toneClass = document.dueTone === "warning" ? "due-warning" : "due-safe";
            const toneText = document.dueTone === "warning" ? "Revisar vencimiento" : "Vencimiento registrado";
            return <article className={`due-card ${toneClass}`} key={document.id}>
              <div><strong>{document.type}</strong><span className="due-plate">{vehicle?.plate || "Vehículo"}</span></div>
              <p>{document.dueDate}</p>
              <span className="due-note">{toneText}</span>
            </article>;
          })}
        </div> : <EmptyInline text="Todavía no hay documentos registrados." />}
      </section>
      <section className="section-block">
        <SectionHeading title="Vehículos registrados" subtitle="Abre un vehículo para consultar sus datos." />
        <div className="vehicle-list">
          {vehicles.map((vehicle) => <VehicleCard key={vehicle.id} vehicle={vehicle} onClick={() => onOpen(vehicle.id)} />)}
          {!vehicles.length && <EmptyState title="Todavía no hay vehículos" text="Agrega el primero para comenzar a registrar ingresos, gastos y documentos." action={<button className="button button-primary" onClick={onAdd}>Crear vehículo</button>} />}
        </div>
      </section>
    </>
  );
}

function SummaryCard({ number, label, tone }) {
  return <article className={`summary-card summary-${tone}`}><strong>{number}</strong><span>{label}</span></article>;
}

function SectionHeading({ title, subtitle }) {
  return <div className="section-heading"><div><h2>{title}</h2>{subtitle && <p>{subtitle}</p>}</div></div>;
}

function PageHeading({ title, subtitle, action, back }) {
  return (
    <div className="page-heading">
      {back && <button className="text-button back-button" onClick={back}>Volver</button>}
      <div className="page-heading-copy"><h1>{title}</h1>{subtitle && <p>{subtitle}</p>}</div>
      {action && <div className="heading-action">{action}</div>}
    </div>
  );
}

function VehicleCard({ vehicle, onClick }) {
  const isTaxi = vehicle.type === "Taxi";
  const image = `${import.meta.env.BASE_URL}assets/${isTaxi ? "vehiculo-taxi-demo.png" : "vehiculo-particular-demo.png"}`;
  return (
    <button className="vehicle-card" onClick={onClick}>
      <img src={image} alt="" className="vehicle-avatar" />
      <span className="vehicle-info"><strong className="vehicle-plate">{vehicle.plate}</strong><span className="vehicle-model">{vehicle.make} · {vehicle.model}</span><span className={`type-chip ${isTaxi ? "chip-taxi" : "chip-private"}`}>{vehicle.type}{!isTaxi && vehicle.indrive ? " · inDrive" : ""}</span></span>
      <span className={`status-chip ${vehicle.status === "Activo" ? "" : "status-inactive"}`}>{vehicle.status}</span>
      {isTaxi && <span className="vehicle-extra"><span><small>Cuota diaria</small><strong>{formatCurrency(vehicle.quota)}</strong></span></span>}
    </button>
  );
}

function VehicleForm({ vehicle, onCancel, onSave, type, setType, error }) {
  return (
    <>
      <PageHeading title={vehicle ? "Editar vehículo" : "Crear vehículo"} subtitle="Registra los datos básicos para organizar su información." back={onCancel} />
      <form className="content-card form-card" onSubmit={onSave}>
        <p className="card-kicker">INFORMACIÓN DEL VEHÍCULO</p>
        <div className="form-grid">
          <Field label="Placa"><input name="plate" defaultValue={vehicle?.plate || ""} placeholder="Ej. ABC123" autoComplete="off" required /></Field>
          <Field label="Marca"><input name="make" defaultValue={vehicle?.make || ""} placeholder="Marca del vehículo" required /></Field>
          <Field label="Modelo"><input name="model" defaultValue={vehicle?.model || ""} placeholder="Modelo o año" required /></Field>
          <Field label="Tipo de vehículo"><select value={type} onChange={(event) => setType(event.target.value)}><option>Particular</option><option>Taxi</option></select></Field>
          {type === "Taxi" ? <>
            <Field label="Conductor"><input name="driver" defaultValue={vehicle?.driver || ""} placeholder="Nombre del conductor" /></Field>
            <Field label="Cuota diaria"><input name="quota" type="number" min="0" inputMode="numeric" defaultValue={vehicle?.quota || ""} placeholder="Valor acordado" /></Field>
          </> : <label className="check-field"><input name="indrive" type="checkbox" defaultChecked={Boolean(vehicle?.indrive)} /><span><strong>Este vehículo trabaja con inDrive</strong><small>Podrás registrar el total variable de cada día.</small></span></label>}
        </div>
        {error && <p className="form-error" role="alert">{error}</p>}
        <div className="form-actions"><button className="button button-quiet" type="button" onClick={onCancel}>Cancelar</button><button className="button button-primary" type="submit">{vehicle ? "Guardar cambios" : "Guardar vehículo"}</button></div>
      </form>
    </>
  );
}

function VehicleDetail({ vehicle, hasRecords, documents, expenses, incomes, onBack, onEdit, onDeleteOrDeactivate, onIncome, onExpense, onDocument, onDocumentOpen, onDocumentEdit, onDocumentDelete, onIncomeEdit, onIncomeDelete, onExpenseEdit, onExpenseDelete }) {
  const isTaxi = vehicle.type === "Taxi";
  const image = `${import.meta.env.BASE_URL}assets/${isTaxi ? "vehiculo-taxi-demo.png" : "vehiculo-particular-demo.png"}`;
  return (
    <>
      <PageHeading title="Detalle del vehículo" subtitle="Consulta aquí toda la información del vehículo." back={onBack} action={<button className="button button-secondary" onClick={onEdit}>Editar vehículo</button>} />
      <section className="vehicle-hero content-card">
        <img src={image} alt="" className="hero-vehicle-image" />
        <div className="hero-copy"><span className={`type-chip ${isTaxi ? "chip-taxi" : "chip-private"}`}>{vehicle.type}</span><h1>{vehicle.plate}</h1><p>{vehicle.make} · {vehicle.model}</p><span className="status-chip">{vehicle.status}</span></div>
        {vehicle.status === "Activo" ? <div className="quick-actions">{(isTaxi || vehicle.indrive) && <button className="button button-primary" onClick={onIncome}>Registrar ingreso</button>}<button className="button button-secondary" onClick={onExpense}>Registrar gasto</button><button className="button button-secondary" onClick={onDocument}>Registrar documento</button></div> : <p className="helper-panel">Este vehículo está inactivo. Puedes consultar su información e historial, pero no registrar movimientos nuevos.</p>}
        {vehicle.status === "Activo" && <div className="vehicle-status-actions"><button className="text-button destructive-link" onClick={onDeleteOrDeactivate}>{hasRecords ? "Desactivar vehículo" : "Eliminar vehículo"}</button></div>}
      </section>
      {isTaxi && <section className="content-card compact-info"><div><span className="card-kicker">INFORMACIÓN DEL TAXI</span><strong>{vehicle.driver || "Conductor sin registrar"}</strong><small>Conductor</small></div><div><span className="card-kicker">CUOTA DIARIA DE REFERENCIA</span><strong className="positive-value">{formatCurrency(vehicle.quota)}</strong><small>Valor configurado en esta demostración</small></div></section>}
      {!isTaxi && vehicle.indrive && <section className="content-card compact-info"><div><span className="card-kicker">MODALIDAD DE INGRESO</span><strong>inDrive</strong><small>El total diario puede variar.</small></div><div><span className="card-kicker">INGRESO REGISTRADO</span><strong className="positive-value">{formatCurrency(incomes.reduce((total, income) => total + income.amount, 0))}</strong><small>En esta demostración</small></div></section>}
      <section className="content-card data-section">
        <SectionHeading title="Documentos y vencimientos" subtitle="SOAT y tecnomecánica del vehículo." />
        {documents.length ? <div className="document-list">{documents.map((document) => <article className="document-row" key={document.id}><span className="document-mark">{document.type}</span><span className="document-main"><strong>{document.name}</strong><small>{document.dueDate}</small><small>{document.fileName}</small></span><div className="row-actions"><button className="text-button" onClick={() => onDocumentOpen(document.id)}>{document.fileUrl ? "Visualizar" : "Ver registro"}</button><button className="text-button" onClick={() => onDocumentEdit(document)}>Editar</button><button className="text-button destructive-link" onClick={() => onDocumentDelete(document)}>Eliminar</button></div></article>)}</div> : <EmptyInline text="Todavía no hay documentos para este vehículo." />}
      </section>
      <section className="content-card data-section">
        <SectionHeading title="Gastos recientes" subtitle="Los registros se muestran dentro del vehículo." />
        {expenses.length ? <div className="record-list">{expenses.map((expense) => <RecordActions key={expense.id} title={expense.description} subtitle={`${expense.category} · ${expense.date}`} amount={formatCurrency(expense.amount)} onEdit={() => onExpenseEdit(expense)} onDelete={() => onExpenseDelete(expense)} />)}</div> : <EmptyInline text="Todavía no hay gastos registrados." />}
      </section>
      <section className="content-card data-section">
        <SectionHeading title="Ingresos recientes" subtitle="Registro diario según el tipo de vehículo." />
        {incomes.length ? <div className="record-list">{incomes.map((income) => <RecordActions key={income.id} title={income.type} subtitle={`${income.date}${income.reason ? ` · ${income.reason}` : ""}`} amount={formatCurrency(income.amount)} positive onEdit={() => onIncomeEdit(income)} onDelete={() => onIncomeDelete(income)} />)}</div> : <EmptyInline text="Todavía no hay ingresos registrados." />}
      </section>
    </>
  );
}

function RecordRow({ title, subtitle, amount, positive }) {
  return <article className="record-row"><div><strong>{title}</strong><small>{subtitle}</small></div><strong className={positive ? "positive-value" : ""}>{amount}</strong></article>;
}

function RecordActions({ title, subtitle, amount, positive, onEdit, onDelete }) {
  return <div className="record-item"><RecordRow title={title} subtitle={subtitle} amount={amount} positive={positive} /><div className="row-actions"><button className="text-button" onClick={onEdit}>Editar</button><button className="text-button destructive-link" onClick={onDelete}>Eliminar</button></div></div>;
}

function IncomeForm({ vehicle, income, onCancel, onSave, error }) {
  const isTaxi = vehicle.type === "Taxi";
  return (
    <>
      <PageHeading title={income ? "Editar ingreso" : isTaxi ? "Registrar ingreso del taxi" : "Registrar ingreso de inDrive"} subtitle={`${vehicle.plate} · ${vehicle.type}`} back={onCancel} />
      <form className="content-card form-card narrow-card" onSubmit={onSave}>
        <div className="context-strip"><strong>{vehicle.plate}</strong><span>{isTaxi ? `Cuota de referencia: ${formatCurrency(vehicle.quota)}` : "Total diario variable"}</span></div>
        <div className="form-stack">
          <Field label="Fecha"><input name="date" type="date" lang="es-CO" defaultValue={income?.date || getToday()} required /></Field>
          <Field label={isTaxi ? "Valor recibido" : "Total del día"}><input name="amount" type="number" min="0" inputMode="numeric" defaultValue={income?.amount ?? ""} placeholder="Escribe el valor" required /></Field>
          {isTaxi ? <Field label="Motivo (obligatorio si el valor difiere de la cuota)"><textarea name="reason" rows="3" defaultValue={income?.reason || ""} placeholder="Anota por qué fue menor o no hubo ingreso" /></Field> : <Field label="Nota (opcional)"><textarea name="note" rows="3" defaultValue={income?.note || ""} placeholder="Agrega una nota para este día" /></Field>}
        </div>
        {isTaxi && <p className="helper-panel">Registrar el valor recibido no cambia la cuota configurada del taxi.</p>}
        {error && <p className="form-error" role="alert">{error}</p>}
        <div className="form-actions"><button className="button button-quiet" type="button" onClick={onCancel}>Cancelar</button><button className="button button-primary" type="submit">{income ? "Guardar cambios" : "Guardar ingreso"}</button></div>
      </form>
    </>
  );
}

function ExpenseForm({ vehicle, expense, categories, onCancel, onSave, onAddCategory, onCategories, error }) {
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [categoryError, setCategoryError] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(expense?.category || categories[0]);

  const selectableCategories = expense && !categories.includes(expense.category)
    ? [expense.category, ...categories]
    : categories;

  function handleNewCategory(event) {
    event.preventDefault();
    const name = newCategoryName.trim();
    if (!name) {
      setCategoryError("Escribe un nombre para la categoría.");
      return;
    }
    if (categories.some((category) => category.toLowerCase() === name.toLowerCase())) {
      setCategoryError("Esa categoría ya existe.");
      return;
    }
    onAddCategory(name);
    setSelectedCategory(name);
    setCategoryError("");
    setNewCategoryName("");
    setShowNewCategory(false);
  }

  return (
    <>
      <PageHeading title={expense ? "Editar gasto" : "Registrar gasto"} subtitle={`Vehículo: ${vehicle.plate}`} back={onCancel} />
      <form className="content-card form-card narrow-card" onSubmit={onSave}>
        <div className="form-stack">
          <Field label="Fecha"><input name="date" type="date" lang="es-CO" defaultValue={expense?.date || getToday()} required /></Field>
          <Field label="Valor"><input name="amount" type="number" min="0" inputMode="numeric" defaultValue={expense?.amount ?? ""} placeholder="Escribe el valor" required /></Field>
          <Field label="Descripción"><input name="description" defaultValue={expense?.description || ""} placeholder="Ej. Cambio de aceite" required /></Field>
          <Field label="Categoría">
            <div className="category-selector">
              <select name="category" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                {selectableCategories.map((category) => <option key={category}>{category}</option>)}
              </select>
              {!showNewCategory ? (
                <button type="button" className="inline-new-category" onClick={() => { setShowNewCategory(true); setCategoryError(""); }}>+ Nueva categoría</button>
              ) : (
                <div className="inline-new-category-form">
                  <input
                    type="text"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="Nombre de la nueva categoría"
                    autoFocus
                  />
                  <div className="inline-actions">
                    <button type="button" className="button button-quiet button-sm" onClick={() => { setShowNewCategory(false); setNewCategoryName(""); setCategoryError(""); }}>Cancelar</button>
                    <button type="button" className="button button-primary button-sm" onClick={handleNewCategory}>Crear</button>
                  </div>
                </div>
              )}
            </div>
          </Field>
          {categoryError && <p className="form-error" role="alert">{categoryError}</p>}
        </div>
        <button className="text-button categories-link" type="button" onClick={onCategories}>Administrar categorías</button>
        {error && <p className="form-error" role="alert">{error}</p>}
        <div className="form-actions"><button className="button button-quiet" type="button" onClick={onCancel}>Cancelar</button><button className="button button-primary" type="submit">{expense ? "Guardar cambios" : "Guardar gasto"}</button></div>
      </form>
    </>
  );
}

function DocumentForm({ vehicle, existingDocument, attachOnly, selectedFile, setSelectedFile, onCancel, onSave, error }) {
  return (
    <>
      <PageHeading title={attachOnly ? "Adjuntar o reemplazar soporte" : existingDocument ? "Editar documento" : "Registrar documento"} subtitle={`Vehículo: ${vehicle.plate}`} back={onCancel} />
      <form className="content-card form-card narrow-card" onSubmit={onSave}>
        <div className="form-stack">
          <Field label="Tipo de documento"><select name="type" defaultValue={existingDocument?.type || "SOAT"} disabled={attachOnly}><option>SOAT</option><option>Tecnomecánica</option></select></Field>
          <Field label="Nombre del documento"><input name="name" defaultValue={existingDocument?.name || ""} placeholder="Ej. SOAT 2026" required readOnly={attachOnly} /></Field>
          <Field label="Fecha de vencimiento"><input name="dueDate" type="date" lang="es-CO" defaultValue={existingDocument?.dueDate || ""} required readOnly={attachOnly} /></Field>
          <div className="field">
            <span className="field-label">{attachOnly ? "Archivo de soporte" : "Archivo de soporte (opcional)"}</span>
            <div className="file-picker">
              <input id="document-file" className="file-input-hidden" type="file" aria-describedby="document-file-help" accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png" onChange={(event) => setSelectedFile(event.target.files?.[0] || null)} />
              <label className="file-picker-button" htmlFor="document-file">Seleccionar archivo</label>
              <span className="file-picker-name" aria-live="polite">{selectedFile?.name || "Ningún archivo seleccionado"}</span>
            </div>
            <span className="field-helper" id="document-file-help">Puedes guardar los datos y adjuntar el archivo después. Se acepta un archivo por registro en esta demostración.</span>
          </div>
        </div>
        {selectedFile && <p className="file-selected">Archivo seleccionado: <strong>{selectedFile.name}</strong></p>}
        {error && <p className="form-error" role="alert">{error}</p>}
        <div className="form-actions"><button className="button button-quiet" type="button" onClick={onCancel}>Cancelar</button><button className="button button-primary" type="submit">{attachOnly ? "Guardar soporte" : existingDocument ? "Guardar cambios" : "Guardar documento"}</button></div>
      </form>
    </>
  );
}

function DocumentSaved({ document, onAttach, onView, onBack }) {
  return (
    <>
      <PageHeading title="Documento guardado" subtitle="Puedes adjuntar el soporte ahora o volver al vehículo." back={onBack} />
      <section className="content-card success-card">
        <span className="status-chip">Registro guardado en la demostración</span>
        <h2>{document.name}</h2>
        <p>{document.type} · Vencimiento: {document.dueDate}</p>
        <p className="muted">{document.fileName}</p>
        <div className="form-actions">
          {document.fileUrl ? <button className="button button-secondary" onClick={onView}>Visualizar soporte</button> : <button className="button button-primary" onClick={onAttach}>Adjuntar soporte</button>}
          <button className="button button-quiet" onClick={onBack}>Volver al vehículo</button>
        </div>
      </section>
    </>
  );
}

function DocumentView({ document, vehicle, onBack, onEdit, onDelete }) {
  const isImage = document.fileType.startsWith("image/");
  const isPdf = document.fileType === "application/pdf" || document.fileName.toLowerCase().endsWith(".pdf");
  return (
    <>
      <PageHeading title="Soporte del documento" subtitle={`${vehicle?.plate || "Vehículo"} · ${document.type}`} back={onBack} action={<div className="heading-actions"><button className="button button-secondary" onClick={onEdit}>Editar documento</button>{document.fileUrl && <a className="button button-primary" href={document.fileUrl} download={document.fileName}>Descargar</a>}</div>} />
      <section className="content-card document-preview">
        <div className="preview-header"><div><strong>{document.name}</strong><small>{document.fileName}</small></div><span className="status-chip">{document.fileUrl ? "Adjunto" : "Sin archivo"}</span></div>
        <div className="document-management-actions"><button className="text-button destructive-link" onClick={onDelete}>Eliminar documento y soporte</button></div>
        {document.fileUrl && isImage && <img className="preview-image" src={document.fileUrl} alt={`Vista previa de ${document.fileName}`} />}
        {document.fileUrl && isPdf && <iframe className="preview-pdf" src={document.fileUrl} title={`Vista previa de ${document.fileName}`} />}
        {document.fileUrl && !isImage && !isPdf && <div className="preview-message"><h2>Archivo listo para descargar</h2><p>La vista previa del formato Word se representa de forma sencilla en este prototipo.</p><a className="button button-primary" href={document.fileUrl} download={document.fileName}>Descargar archivo</a></div>}
        {!document.fileUrl && <EmptyState title="Este registro no tiene archivo adjunto" text="El nombre y el vencimiento se pueden consultar aunque todavía no se haya adjuntado el soporte." action={<button className="button button-primary" onClick={onBack}>Volver al vehículo</button>} />}
        <p className="preview-note">El archivo solo permanece disponible en esta sesión del navegador. No se envía ni se guarda en un servidor.</p>
      </section>
    </>
  );
}

function ExpenseList({ expenses, vehicles, onAdd, onOpen, onEdit, onDelete }) {
  const [filterMonth, setFilterMonth] = useState("");
  const months = useMemo(() => {
    const ms = new Set(expenses.map((e) => getMonthKey(e.date)).filter(Boolean));
    return Array.from(ms).sort().reverse();
  }, [expenses]);

  const filtered = filterMonth
    ? expenses.filter((e) => getMonthKey(e.date) === filterMonth)
    : expenses;

  return <>
    <PageHeading title="Gastos" subtitle="Consulta los gastos registrados en esta demostración." action={<button className="button button-primary" onClick={onAdd}>Registrar gasto</button>} />
    <section className="content-card data-section">
      <div className="filter-bar">
        <label className="filter-select">
          <span>Filtrar por mes</span>
          <select value={filterMonth} onChange={(e) => setFilterMonth(e.target.value)}>
            <option value="">Todos los meses</option>
            {months.map((m) => <option key={m} value={m}>{formatMonthLabel(m)}</option>)}
          </select>
        </label>
      </div>
      <div className="record-list">
        {filtered.map((expense) => {
          const vehicle = vehicles.find((item) => item.id === expense.vehicleId);
          return (
            <div className="record-list-entry" key={expense.id}>
              <button className="list-record-button" onClick={() => vehicle && onOpen(vehicle.id)}>
                <RecordRow title={expense.description} subtitle={`${vehicle?.plate || "Vehículo"} · ${expense.category} · ${expense.date}`} amount={formatCurrency(expense.amount)} />
              </button>
              <div className="row-actions">
                <button className="text-button" onClick={() => onEdit(expense)}>Editar</button>
                <button className="text-button destructive-link" onClick={() => onDelete(expense)}>Eliminar</button>
              </div>
            </div>
          );
        })}
        {(() => {
          if (!filtered.length && filterMonth) return <EmptyInline text={"Sin gastos en " + filterMonth + "."} />;
          if (!expenses.length && !filterMonth) return <EmptyState title="Todavía no hay gastos" text="Registra un gasto desde el detalle del vehículo." />;
          return null;
        })()}
      </div></section>
  </>;
}

function IncomeList({ incomes, vehicles, onAdd, onOpen, onEdit, onDelete }) {
  const [filterMonth, setFilterMonth] = useState("");
  const months = useMemo(() => {
    const ms = new Set(incomes.map((i) => getMonthKey(i.date)).filter(Boolean));
    return Array.from(ms).sort().reverse();
  }, [incomes]);

  const filtered = filterMonth
    ? incomes.filter((i) => getMonthKey(i.date) === filterMonth)
    : incomes;

  return <>
    <PageHeading title="Ingresos" subtitle="Cuotas de taxi e ingresos diarios de inDrive." action={<button className="button button-primary" onClick={onAdd}>Elegir vehículo</button>} />
    <section className="content-card data-section">
      <div className="filter-bar">
        <label className="filter-select">
          <span>Filtrar por mes</span>
          <select value={filterMonth} onChange={(e) => setFilterMonth(e.target.value)}>
            <option value="">Todos los meses</option>
            {months.map((m) => <option key={m} value={m}>{formatMonthLabel(m)}</option>)}
          </select>
        </label>
      </div>
      <div className="record-list">
        {filtered.map((income) => {
          const vehicle = vehicles.find((item) => item.id === income.vehicleId);
          return (
            <div className="record-list-entry" key={income.id}>
              <button className="list-record-button" onClick={() => vehicle && onOpen(vehicle.id)}>
                <RecordRow title={income.type} subtitle={`${vehicle?.plate || "Vehículo"} · ${income.date}`} amount={formatCurrency(income.amount)} positive />
              </button>
              <div className="row-actions">
                <button className="text-button" onClick={() => onEdit(income)}>Editar</button>
                <button className="text-button destructive-link" onClick={() => onDelete(income)}>Eliminar</button>
              </div>
            </div>
          );
        })}
        {(() => {
          if (!filtered.length && filterMonth) return <EmptyInline text={"Sin ingresos en " + filterMonth + "."} />;
          if (!incomes.length && !filterMonth) return <EmptyState title="Todavía no hay ingresos registrados" text="Abre un vehículo para registrar su ingreso diario." />;
          return null;
        })()}
      </div></section>
  </>;
}

function DocumentList({ documents, vehicles, onOpen, onEdit, onDelete, onAdd }) {
  const [filterMonth, setFilterMonth] = useState("");
  const months = useMemo(() => {
    const ms = new Set(documents.map((d) => getMonthKey(d.dueDate)).filter(Boolean));
    return Array.from(ms).sort().reverse();
  }, [documents]);

  const filtered = filterMonth
    ? documents.filter((d) => getMonthKey(d.dueDate) === filterMonth)
    : documents;

  return <>
    <PageHeading title="Documentos" subtitle="SOAT y tecnomecánica asociados a tus vehículos." action={<button className="button button-primary" onClick={onAdd}>Ir a un vehículo</button>} />
    <section className="content-card data-section">
      <div className="filter-bar">
        <label className="filter-select">
          <span>Filtrar por mes</span>
          <select value={filterMonth} onChange={(e) => setFilterMonth(e.target.value)}>
            <option value="">Todos los meses</option>
            {months.map((m) => <option key={m} value={m}>{formatMonthLabel(m)}</option>)}
          </select>
        </label>
      </div>
      <div className="document-list">
        {filtered.map((document) => {
          const vehicle = vehicles.find((item) => item.id === document.vehicleId);
          return (
            <article className="document-row" key={document.id}>
              <span className="document-mark">{document.type}</span>
              <span className="document-main">
                <strong>{document.name}</strong>
                <small>{vehicle?.plate || "Vehículo"} · {document.dueDate}</small>
                <small>{document.fileName}</small>
              </span>
              <div className="row-actions">
                <button className="text-button" onClick={() => onOpen(document.id)}>Abrir</button>
                <button className="text-button" onClick={() => onEdit(document)}>Editar</button>
                <button className="text-button destructive-link" onClick={() => onDelete(document)}>Eliminar</button>
              </div>
            </article>
          );
        })}
        {(() => {
          if (!filtered.length && filterMonth) return <EmptyInline text={"Sin documentos con vencimiento en " + filterMonth + "."} />;
          if (!documents.length && !filterMonth) return <EmptyState title="Todavía no hay documentos" text="Registra un documento desde el detalle del vehículo." />;
          return null;
        })()}
      </div></section>
  </>;
}

function CategoryManager({ categories, inactiveCategories, expenses, value, setValue, editingCategory, onEdit, onDeactivate, onSave, onBack, error }) {
  return <>
    <PageHeading title="Categorías de gasto" subtitle="Agrega, renombra o desactiva categorías." back={onBack} />
    <section className="content-card data-section"><div className="category-list">{categories.map((category) => {
      const inactive = inactiveCategories.includes(category);
      const isUsed = expenses.some((expense) => expense.category === category);
      return <div className="category-row" key={category}><div className="category-label"><strong>{category}</strong><span className={inactive ? "status-chip status-inactive" : "status-chip"}>{inactive ? "Inactiva" : "Activa"}</span>{isUsed && <small>Usada en gastos registrados</small>}</div><div className="row-actions"><button className="text-button" onClick={() => onEdit(category)}>Renombrar</button>{!inactive && <button className="text-button destructive-link" onClick={() => onDeactivate(category)}>Desactivar</button>}</div></div>;
    })}</div>
      <form className="category-form" onSubmit={onSave}><Field label={editingCategory ? "Nuevo nombre" : "Agregar categoría"}><input value={value} onChange={(event) => setValue(event.target.value)} placeholder="Nombre de la categoría" /></Field>{error && <p className="form-error" role="alert">{error}</p>}<button className="button button-primary" type="submit">{editingCategory ? "Guardar nombre" : "Agregar"}</button>{editingCategory && <button className="button button-quiet" type="button" onClick={() => { setValue(""); onBack(); }}>Cancelar cambio</button>}</form>
      <p className="field-helper">Al renombrar se actualiza la etiqueta de los gastos demostrativos asociados. Al desactivar, los gastos anteriores conservan su categoría.</p>
    </section>
  </>;
}

function EmptyInline({ text }) {
  return <p className="empty-inline">{text}</p>;
}

function EmptyState({ title, text, action }) {
  return <div className="empty-state"><h3>{title}</h3><p>{text}</p>{action}</div>;
}

function ConfirmationDialog({ confirmation, onCancel, onConfirm }) {
  const hasPermanentDelete = ["income", "expense", "document", "vehicle-delete"].includes(confirmation.type);
  const title = confirmation.type === "vehicle-deactivate" ? "Desactivar vehículo" : confirmation.type === "vehicle-delete" ? "Eliminar vehículo" : confirmation.type === "document" ? "Eliminar documento" : confirmation.type === "income" ? "Eliminar ingreso" : confirmation.type === "category" ? "Desactivar categoría" : "Eliminar gasto";
  const description = confirmation.type === "vehicle-deactivate"
    ? `El vehículo ${confirmation.name} tiene registros asociados. Se desactivará para conservar su historial.`
    : confirmation.type === "vehicle-delete"
      ? `¿Quieres eliminar el vehículo ${confirmation.name}? No tiene registros asociados.`
      : confirmation.type === "document"
        ? `Se eliminará “${confirmation.name}” y también el archivo adjunto, si existe.`
        : confirmation.type === "category"
          ? `“${confirmation.name}” dejará de aparecer en los nuevos gastos. Los gastos anteriores conservarán esta categoría.`
        : `Se eliminará “${confirmation.name}” de forma definitiva. Esta acción también lo quitará del historial y los totales.`;
  return (
    <div className="dialog-backdrop" role="presentation">
      <section className="confirmation-dialog" role="alertdialog" aria-modal="true" aria-labelledby="confirmation-title" aria-describedby="confirmation-description">
        <p className="eyebrow">CONFIRMACIÓN</p>
        <h2 id="confirmation-title">{title}</h2>
        <p id="confirmation-description">{description}</p>
        <div className="form-actions"><button className="button button-quiet" onClick={onCancel}>Cancelar</button><button className={`button ${hasPermanentDelete ? "button-danger" : "button-primary"}`} onClick={onConfirm}>{confirmation.type === "vehicle-deactivate" || confirmation.type === "category" ? "Desactivar" : confirmation.type === "vehicle-delete" ? "Eliminar vehículo" : "Eliminar definitivamente"}</button></div>
      </section>
    </div>
  );
}

export { App };
