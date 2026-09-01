import { useState } from "react";
import PageShell from "@/components/ui/PageShell";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import BottomSheet from "@/components/ui/BottomSheet";
import { CalendarIcon, ChevronRightIcon, PhoneIcon, SearchIcon, UserIcon } from "@/components/ui/Icons";
import { colors, gradients, radius, shadows, typography } from "@/theme/tokens";
import { customerHistory } from "@/data/mockData";
import { fabButton } from "@/styles/shared";
import type { Customer } from "@/types";

const statusLabel: Record<string, string> = { confirmed: "Potvrdená", pending: "Čakajúca", delivered: "Doručená" };

function CustomerDetail({ customer, onBack, onUpdate, onDelete }: {
  customer: Customer;
  onBack: () => void;
  onUpdate: (c: Customer, d: { name: string; phone: string; status: string }) => void;
  onDelete: (c: Customer) => void;
}) {
  const history = customerHistory[customer.name] ?? [];
  const totalKs = history.reduce((s, h) => s + h.qty, 0);
  const [showEdit, setShowEdit] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  return (
    <PageShell title={customer.name} icon={<UserIcon size={24} />} onBack={onBack}>
      <div style={{ padding: "0 16px 16px" }}>
        {/* Profile card */}
        <div style={{ background: gradients.dark, borderRadius: radius.huge, padding: "20px", marginBottom: 16, display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: 56, height: 56, borderRadius: radius.card, background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, fontWeight: 900, color: colors.white, flexShrink: 0 }}>
            {customer.name.charAt(0)}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 17, fontWeight: 900, color: colors.white }}>{customer.name}</div>
            <div style={{ fontSize: 12, fontWeight: 500, color: "rgba(255,255,255,0.7)", marginTop: 3, display: "flex", alignItems: "center", gap: 5 }}>
              <PhoneIcon size={12} color="rgba(255,255,255,0.7)" />
              {customer.phone}
            </div>
            <div style={{ marginTop: 8 }}>
              <Badge
                label={customer.status === "active" ? "Aktívny" : customer.status === "pending" ? "Čaká" : "Neaktívny"}
                color={colors.dark}
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
          <button onClick={() => setShowEdit(true)} style={{
            flex: 1, padding: "12px 0", borderRadius: radius.lg, border: `1.5px solid ${colors.dark}`,
            background: colors.white, fontFamily: typography.fontFamily, fontWeight: 800, fontSize: 12, color: colors.dark, cursor: "pointer",
          }}>Upraviť</button>
          <button onClick={() => setConfirmDelete(true)} style={{
            flex: 1, padding: "12px 0", borderRadius: radius.lg, border: `1.5px solid #FCA5A5`,
            background: "#FFF5F5", fontFamily: typography.fontFamily, fontWeight: 800, fontSize: 12, color: "#B91C1C", cursor: "pointer",
          }}>Zmazať</button>
        </div>

        {/* Stats */}
        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          {[
            { label: "Objednávky", val: String(history.length) },
            { label: "Celkom ks",  val: `${totalKs} ks` },
            { label: "Est. tržba", val: `${(totalKs * 2.85).toFixed(0)} €` },
          ].map(s => (
            <div key={s.label} style={{ flex: 1, background: colors.bg, borderRadius: radius.lg, padding: "10px 8px", textAlign: "center", border: `1px solid ${colors.border}` }}>
              <div style={{ fontSize: 16, fontWeight: 900, color: colors.dark }}>{s.val}</div>
              <div style={{ fontSize: 8, fontWeight: 700, color: colors.dark, textTransform: "uppercase", letterSpacing: 0.6, marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* History */}
        <div style={{ fontSize: 11, fontWeight: 800, color: colors.text, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 12 }}>História objednávok</div>
        {history.length === 0 ? (
          <Card><div style={{ textAlign: "center", color: colors.dark, fontSize: 13, padding: "20px 0" }}>Žiadne objednávky</div></Card>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {history.map((h, i) => (
              <Card key={i}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 42, height: 42, borderRadius: 12, flexShrink: 0, background: colors.accent + "18", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                      <rect x="2" y="4" width="14" height="12" rx="2" stroke={colors.accent} strokeWidth="1.5" fill="none" />
                      <line x1="2" y1="8" x2="16" y2="8" stroke={colors.accent} strokeWidth="1.5" />
                      <line x1="6" y1="2" x2="6" y2="6" stroke={colors.accent} strokeWidth="1.5" strokeLinecap="round" />
                      <line x1="12" y1="2" x2="12" y2="6" stroke={colors.accent} strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 800, color: colors.text }}>Turnus {h.turnus}</div>
                    <div style={{ fontSize: 11, fontWeight: 500, color: colors.dark, marginTop: 2, display: "flex", alignItems: "center", gap: 4 }}>
                      <CalendarIcon size={12} color={colors.dark} />
                      {h.date}
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 16, fontWeight: 900, color: colors.dark }}>{h.qty} <span style={{ fontSize: 11 }}>ks</span></div>
                    <div style={{ marginTop: 4 }}><Badge label={statusLabel[h.status]} color={colors.dark} /></div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {showEdit && (
        <EditCustomerModal
          customer={customer}
          onClose={() => setShowEdit(false)}
          onSave={d => { onUpdate(customer, d); setShowEdit(false); }}
        />
      )}

      {confirmDelete && (
        <BottomSheet
          onClose={() => setConfirmDelete(false)}
          overlayStyle={{ background: colors.overlay, zIndex: 60 }}
          sheetStyle={{ padding: "20px 20px max(env(safe-area-inset-bottom, 24px), 24px)", boxShadow: shadows.modal }}
          handleStyle={{ marginBottom: 16 }}
        >
          <div style={{ fontSize: 16, fontWeight: 900, color: colors.text, marginBottom: 8 }}>Zmazať zákazníka?</div>
          <div style={{ fontSize: 13, fontWeight: 500, color: colors.dark, marginBottom: 20 }}>
            Zákazník <strong>{customer.name}</strong> sa natrvalo odstráni. Jeho objednávky ostanú zachované.
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={() => setConfirmDelete(false)} style={{ flex: 1, padding: "14px", borderRadius: radius.xl, border: `1.5px solid ${colors.border}`, background: colors.white, fontFamily: typography.fontFamily, fontWeight: 700, fontSize: 13, color: colors.dark, cursor: "pointer" }}>Zrušiť</button>
            <button onClick={() => onDelete(customer)} style={{ flex: 2, padding: "14px", borderRadius: radius.xl, border: "none", background: "#B91C1C", fontFamily: typography.fontFamily, fontWeight: 800, fontSize: 13, color: colors.white, cursor: "pointer" }}>Áno, zmazať</button>
          </div>
        </BottomSheet>
      )}
    </PageShell>
  );
}

function AddCustomerModal({ onClose, onAdd }: { onClose: () => void; onAdd: (c: Customer) => void }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const submit = () => {
    if (!name.trim()) return;
    onAdd({ name: name.trim(), phone: phone.trim() || "—", ordered: 0, status: "pending" });
    onClose();
  };

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "12px 14px", borderRadius: radius.lg,
    border: `1.5px solid ${colors.border}`, background: colors.bg,
    fontFamily: typography.fontFamily, fontSize: 13, fontWeight: 500, color: colors.text,
    outline: "none", boxSizing: "border-box", marginBottom: 12,
  };

  return (
    <BottomSheet
      onClose={onClose}
      overlayStyle={{ background: colors.overlay, zIndex: 60 }}
      sheetStyle={{ padding: "20px 20px max(env(safe-area-inset-bottom, 24px), 24px)", boxShadow: shadows.modal }}
      handleStyle={{ marginBottom: 16 }}
    >
      <div style={{ fontSize: 16, fontWeight: 900, color: colors.text, marginBottom: 20 }}>Nový zákazník</div>
      <input value={name} onChange={e => setName(e.target.value)} placeholder="Meno a priezvisko *" style={inputStyle} />
      <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="Telefónne číslo" style={{ ...inputStyle, marginBottom: 20 }} />
      <div style={{ display: "flex", gap: 10 }}>
        <button onClick={onClose} style={{ flex: 1, padding: "14px", borderRadius: radius.xl, border: `1.5px solid ${colors.border}`, background: colors.white, fontFamily: typography.fontFamily, fontWeight: 700, fontSize: 13, color: colors.dark, cursor: "pointer" }}>Zrušiť</button>
        <button onClick={submit} style={{
          flex: 2, padding: "14px", borderRadius: radius.xl, border: "none",
          background: gradients.primary, fontFamily: typography.fontFamily, fontWeight: 800, fontSize: 13, color: colors.white, cursor: "pointer",
          opacity: name.trim() ? 1 : 0.5,
        }}>Pridať zákazníka</button>
      </div>
    </BottomSheet>
  );
}

const statusOptions = [
  { key: "active", label: "Aktívny" },
  { key: "pending", label: "Čaká" },
  { key: "inactive", label: "Neaktívny" },
];

function EditCustomerModal({ customer, onClose, onSave }: {
  customer: Customer;
  onClose: () => void;
  onSave: (data: { name: string; phone: string; status: string }) => void;
}) {
  const [name, setName] = useState(customer.name);
  const [phone, setPhone] = useState(customer.phone);
  const [status, setStatus] = useState(customer.status);

  const submit = () => {
    if (!name.trim()) return;
    onSave({ name: name.trim(), phone: phone.trim() || "—", status });
    onClose();
  };

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "12px 14px", borderRadius: radius.lg,
    border: `1.5px solid ${colors.border}`, background: colors.bg,
    fontFamily: typography.fontFamily, fontSize: 13, fontWeight: 500, color: colors.text,
    outline: "none", boxSizing: "border-box", marginBottom: 12,
  };

  return (
    <BottomSheet
      onClose={onClose}
      overlayStyle={{ background: colors.overlay, zIndex: 60 }}
      sheetStyle={{ padding: "20px 20px max(env(safe-area-inset-bottom, 24px), 24px)", boxShadow: shadows.modal }}
      handleStyle={{ marginBottom: 16 }}
    >
      <div style={{ fontSize: 16, fontWeight: 900, color: colors.text, marginBottom: 20 }}>Upraviť zákazníka</div>
      <input value={name} onChange={e => setName(e.target.value)} placeholder="Meno a priezvisko *" style={inputStyle} />
      <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="Telefónne číslo" style={{ ...inputStyle, marginBottom: 12 }} />
      <div style={{ fontSize: 10, fontWeight: 700, color: colors.dark, textTransform: "uppercase", letterSpacing: 0.6, marginBottom: 8 }}>Stav</div>
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        {statusOptions.map(s => {
          const active = status === s.key;
          return (
            <button key={s.key} onClick={() => setStatus(s.key)} style={{
              flex: 1, padding: "10px 6px", borderRadius: radius.lg, cursor: "pointer",
              border: `1.5px solid ${active ? colors.dark : colors.border}`,
              background: active ? colors.dark : colors.white,
              fontFamily: typography.fontFamily, fontSize: 11, fontWeight: 800,
              color: active ? colors.white : colors.dark,
            }}>{s.label}</button>
          );
        })}
      </div>
      <div style={{ display: "flex", gap: 10 }}>
        <button onClick={onClose} style={{ flex: 1, padding: "14px", borderRadius: radius.xl, border: `1.5px solid ${colors.border}`, background: colors.white, fontFamily: typography.fontFamily, fontWeight: 700, fontSize: 13, color: colors.dark, cursor: "pointer" }}>Zrušiť</button>
        <button onClick={submit} style={{
          flex: 2, padding: "14px", borderRadius: radius.xl, border: "none",
          background: gradients.primary, fontFamily: typography.fontFamily, fontWeight: 800, fontSize: 13, color: colors.white, cursor: "pointer",
          opacity: name.trim() ? 1 : 0.5,
        }}>Uložiť zmeny</button>
      </div>
    </BottomSheet>
  );
}

export default function PageZakaznici({ customers, onAddCustomer, onUpdateCustomer, onDeleteCustomer, onBack }: {
  customers: Customer[];
  onAddCustomer: (c: Customer) => void;
  onUpdateCustomer: (c: Customer, d: { name: string; phone: string; status: string }) => void;
  onDeleteCustomer: (c: Customer) => void;
  onBack: () => void;
}) {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Customer | null>(null);
  const [showAdd, setShowAdd] = useState(false);

  const handleUpdate = (c: Customer, d: { name: string; phone: string; status: string }) => {
    onUpdateCustomer(c, d);
    setSelected(prev => {
      if (!prev || prev.dbId !== c.dbId) return prev;
      return { ...prev, name: d.name, phone: d.phone, status: d.status };
    });
  };
  const handleDelete = (c: Customer) => {
    onDeleteCustomer(c);
    setSelected(null);
  };

  if (selected) return <CustomerDetail customer={selected} onBack={() => setSelected(null)} onUpdate={handleUpdate} onDelete={handleDelete} />;

  const filtered = customers.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <PageShell title="Zákazníci" icon={<UserIcon size={24} />} onBack={onBack}>
      <div style={{ padding: "0 16px 16px" }}>
        {/* Search */}
        <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
          <div style={{ flex: 1, position: "relative" }}>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Hľadať zákazníka…"
              style={{
                width: "100%", padding: "12px 16px 12px 40px", borderRadius: radius.xl,
                border: `1.5px solid ${colors.border}`, background: colors.white,
                fontFamily: typography.fontFamily, fontSize: 13, fontWeight: 500, color: colors.text,
                outline: "none", boxSizing: "border-box",
              }}
            />
            <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", display: "flex" }}>
              <SearchIcon />
            </span>
          </div>
        </div>

        {/* List */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {filtered.map(c => (
            <button
              key={c.name}
              onClick={() => setSelected(c)}
              style={{ width: "100%", background: "none", border: "none", padding: 0, cursor: "pointer", textAlign: "left" }}
            >
              <Card style={{ transition: "box-shadow 0.15s ease" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: radius.xl, flexShrink: 0,
                    background: gradients.avatar,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 17, fontWeight: 900, color: colors.white,
                  }}>
                    {c.name.charAt(0)}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 800, color: colors.text }}>{c.name}</div>
                    <div style={{ fontSize: 11, fontWeight: 500, color: colors.dark, marginTop: 2 }}>{c.phone}</div>
                  </div>
                  <ChevronRightIcon color={colors.iconChevronLight} />
                </div>
              </Card>
            </button>
          ))}
        </div>
      </div>

      <button onClick={() => setShowAdd(true)} style={fabButton}>+</button>

      {showAdd && (
        <AddCustomerModal
          onClose={() => setShowAdd(false)}
          onAdd={onAddCustomer}
        />
      )}
    </PageShell>
  );
}
