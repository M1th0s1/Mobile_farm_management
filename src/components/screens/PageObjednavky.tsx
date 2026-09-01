import { useState } from "react";
import PageShell from "@/components/ui/PageShell";
import Card from "@/components/ui/Card";
import BottomSheet from "@/components/ui/BottomSheet";
import { CalendarIcon, CheckIcon, ChevronDownIcon, ClipboardIcon, productIcons } from "@/components/ui/Icons";
import { colors, productTypes, radius, statusColors, typography } from "@/theme/tokens";
import { formatDate } from "@/utils/date";
import { fabButton, ghostButton, sectionLabel } from "@/styles/shared";
import type { Customer, Order, OrderItem } from "@/types";

function NewOrderModal({ customers, onClose, onSubmit }: {
  customers: Customer[];
  onClose: () => void;
  onSubmit: (o: Order) => void;
}) {
  const [selCustomer, setSelCustomer] = useState("");
  const [dropOpen, setDropOpen] = useState(false);
  const [items, setItems] = useState<Record<string, string>>({ cele: "", porcie: "", prsia: "" });
  const [note, setNote] = useState("");

  const selectedCustomer = customers.find(c => c.name === selCustomer);
  const filledItems = productTypes.filter(p => parseInt(items[p.key]) > 0);
  const totalQty = filledItems.reduce((s, p) => s + parseInt(items[p.key]), 0);
  const canSubmit = !!selCustomer && filledItems.length > 0;

  function handleSubmit() {
    if (!canSubmit) return;
    const id = "OBJ-" + String(Math.floor(Math.random() * 900) + 100);
    const orderItems: OrderItem[] = filledItems.map(p => ({ productKey: p.key, qty: parseInt(items[p.key]) }));
    const productType = filledItems.map(p => p.label).join(" + ");
    onSubmit({ id, customer: selCustomer, items: orderItems, productType, qty: totalQty, note, date: formatDate(new Date()), status: "pending", turnus: "02/2026" });
    onClose();
  }

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "13px 16px", borderRadius: radius.lg,
    border: `1.5px solid ${colors.border}`, fontFamily: typography.fontFamily,
    fontSize: 14, fontWeight: 700, color: colors.text, background: colors.bg,
    outline: "none", boxSizing: "border-box",
  };

  return (
    <BottomSheet
      onClose={onClose}
      sheetStyle={{ maxHeight: "92vh", display: "flex", flexDirection: "column" }}
    >
      <div style={{ padding: "20px 20px 0", flexShrink: 0 }}>
        <div style={{ fontSize: 16, fontWeight: 900, color: colors.text, marginBottom: 18 }}>Nová objednávka</div>
      </div>

      <div style={{ overflowY: "auto", padding: "0 20px", flex: 1 }} className="scrollbar-hide">
        <div style={sectionLabel}>Zákazník</div>
        <div style={{ position: "relative", marginBottom: 18 }}>
          <button onClick={() => setDropOpen(v => !v)} style={{
            width: "100%", padding: "13px 16px", borderRadius: radius.lg,
            border: `1.5px solid ${dropOpen ? colors.dark : colors.border}`,
            background: colors.bg, cursor: "pointer", fontFamily: typography.fontFamily,
            display: "flex", justifyContent: "space-between", alignItems: "center", boxSizing: "border-box",
          }}>
            {selectedCustomer ? (
              <div style={{ textAlign: "left" }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: colors.text }}>{selectedCustomer.name}</div>
                <div style={{ fontSize: 10, fontWeight: 500, color: colors.dark, marginTop: 1 }}>{selectedCustomer.phone}</div>
              </div>
            ) : (
              <span style={{ fontSize: 13, fontWeight: 600, color: colors.dark, opacity: 0.5 }}>Vybrať zákazníka…</span>
            )}
            <ChevronDownIcon rotated={dropOpen} />
          </button>
          {dropOpen && (
            <div style={{ position: "absolute", top: "calc(100% + 6px)", left: 0, right: 0, background: colors.white, borderRadius: radius.xl, border: `1.5px solid ${colors.border}`, boxShadow: "0 8px 32px rgba(19,94,75,0.15)", zIndex: 10, overflow: "hidden" }}>
              {customers.map((c, i) => {
                const sel = selCustomer === c.name;
                return (
                  <button key={c.name} onClick={() => { setSelCustomer(c.name); setDropOpen(false); }} style={{
                    width: "100%", padding: "12px 16px", background: sel ? colors.dark + "0A" : colors.white,
                    border: "none", borderBottom: i < customers.length - 1 ? `1px solid ${colors.border}` : "none",
                    cursor: "pointer", fontFamily: typography.fontFamily, textAlign: "left",
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                  }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: colors.text }}>{c.name}</div>
                      <div style={{ fontSize: 10, fontWeight: 500, color: colors.dark, marginTop: 1 }}>{c.phone}</div>
                    </div>
                    {sel && <CheckIcon color={colors.dark} />}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div style={sectionLabel}>Produkty</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 18 }}>
          {productTypes.map(p => {
            const qty = parseInt(items[p.key]) > 0;
            return (
              <div key={p.key} style={{
                display: "flex", alignItems: "center", gap: 12, padding: "12px 14px",
                borderRadius: radius.xl, border: `1.5px solid ${qty ? colors.dark : colors.border}`,
                background: qty ? colors.dark + "06" : colors.white, transition: "all 0.15s ease",
              }}>
                <span style={{ flexShrink: 0, display: "flex" }}>{productIcons[p.key]}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: colors.text }}>{p.label}</div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <button onClick={() => setItems(v => ({ ...v, [p.key]: String(Math.max(0, (parseInt(v[p.key]) || 0) - 1)) }))} style={{ width: 30, height: 30, borderRadius: radius.sm, border: `1.5px solid ${colors.border}`, background: colors.white, cursor: "pointer", fontSize: 18, fontWeight: 700, color: colors.dark, display: "flex", alignItems: "center", justifyContent: "center" }}>−</button>
                  <input type="number" min="0" value={items[p.key]} onChange={e => setItems(v => ({ ...v, [p.key]: e.target.value }))} style={{ width: 52, textAlign: "center", padding: "6px 4px", borderRadius: radius.sm, border: `1.5px solid ${colors.border}`, fontFamily: typography.fontFamily, fontSize: 14, fontWeight: 800, color: colors.text, background: colors.bg, outline: "none" }} />
                  <button onClick={() => setItems(v => ({ ...v, [p.key]: String((parseInt(v[p.key]) || 0) + 1) }))} style={{ width: 30, height: 30, borderRadius: radius.sm, border: `1.5px solid ${colors.border}`, background: colors.dark, cursor: "pointer", fontSize: 18, fontWeight: 700, color: colors.white, display: "flex", alignItems: "center", justifyContent: "center" }}>+</button>
                </div>
              </div>
            );
          })}
        </div>

        {totalQty > 0 && (
          <div style={{ background: colors.dark + "0A", borderRadius: radius.lg, padding: "10px 14px", marginBottom: 18, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 11, fontWeight: 600, color: colors.dark }}>Celkom</span>
            <span style={{ fontSize: 16, fontWeight: 900, color: colors.dark }}>{totalQty} ks</span>
          </div>
        )}

        <div style={sectionLabel}>Poznámka</div>
        <textarea
          placeholder="Špeciálne požiadavky, spôsob balenia…"
          value={note}
          onChange={e => setNote(e.target.value)}
          rows={3}
          style={{ ...inputStyle, resize: "none", lineHeight: 1.5, fontWeight: 500, fontSize: 13, marginBottom: 20 }}
        />
      </div>

      <div style={{ padding: "12px 20px 36px", borderTop: `1px solid ${colors.border}`, flexShrink: 0, display: "flex", gap: 10 }}>
        <button onClick={onClose} style={ghostButton}>Zrušiť</button>
        <button onClick={handleSubmit} disabled={!canSubmit} style={{
          flex: 2, padding: 14, borderRadius: radius.xl, border: "none",
          background: canSubmit ? colors.dark : colors.border,
          fontFamily: typography.fontFamily, fontWeight: 800, fontSize: 13, color: colors.white,
          cursor: canSubmit ? "pointer" : "default", transition: "background 0.2s ease",
        }}>Vytvoriť objednávku</button>
      </div>
    </BottomSheet>
  );
}

function OrderDetailModal({ order, onClose, onChangeStatus, onDelete, onSetPaid, onUpdate }: {
  order: Order;
  onClose: () => void;
  onChangeStatus: (id: string, status: Order["status"]) => void;
  onDelete: (id: string) => void;
  onSetPaid: (id: string, paid: number | undefined) => void;
  onUpdate: (id: string, items: OrderItem[], note: string) => void;
}) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [paidInput, setPaidInput] = useState(order.paid !== undefined ? String(order.paid) : "");
  const [editing, setEditing] = useState(false);
  const initItems = () => Object.fromEntries(productTypes.map(p => [p.key, String((order.items ?? []).find(i => i.productKey === p.key)?.qty ?? 0)]));
  const [editItems, setEditItems] = useState<Record<string, string>>(initItems);
  const [editNote, setEditNote] = useState(order.note ?? "");
  const editTotalQty = productTypes.reduce((s, p) => s + (parseInt(editItems[p.key]) || 0), 0);

  function saveEdit() {
    const items = productTypes.filter(p => parseInt(editItems[p.key]) > 0).map(p => ({ productKey: p.key, qty: parseInt(editItems[p.key]) }));
    if (items.length === 0) return;
    onUpdate(order.id, items, editNote);
    setEditing(false);
  }

  const dItems = order.items ?? [];

  return (
    <BottomSheet onClose={onClose} sheetStyle={{ maxHeight: "92vh", display: "flex", flexDirection: "column" }}>
      <div style={{ padding: "20px 20px 0", overflowY: "auto", flex: 1 }} className="scrollbar-hide">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 18 }}>
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, color: colors.dark, letterSpacing: 0.8 }}>{order.id} · Turnus {order.turnus}</div>
            <div style={{ fontSize: 17, fontWeight: 900, color: colors.text, marginTop: 3 }}>{order.customer}</div>
            <div style={{ fontSize: 11, fontWeight: 500, color: colors.dark, marginTop: 2, display: "flex", alignItems: "center", gap: 4 }}>
              <CalendarIcon size={12} color={colors.dark} />
              {order.date}
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 22, fontWeight: 900, color: colors.dark }}>{order.qty} <span style={{ fontSize: 13 }}>ks</span></div>
            <button onClick={() => { setEditing(v => !v); setEditItems(initItems()); setEditNote(order.note ?? ""); }} style={{
              marginTop: 4, padding: "4px 10px", borderRadius: radius.sm, border: `1.5px solid ${colors.border}`,
              background: editing ? colors.dark : colors.white, cursor: "pointer",
              fontFamily: typography.fontFamily, fontSize: 10, fontWeight: 700,
              color: editing ? colors.white : colors.dark,
            }}>{editing ? "Zrušiť" : "Upraviť"}</button>
          </div>
        </div>

        {!editing ? (
          <div style={{ background: colors.bg, borderRadius: radius.lg, padding: "10px 14px", marginBottom: 16 }}>
            {dItems.map(it => {
              const pt = productTypes.find(p => p.key === it.productKey);
              return pt ? (
                <div key={it.productKey} style={{ display: "flex", justifyContent: "space-between", paddingBottom: 4 }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: colors.text, display: "flex", alignItems: "center", gap: 4 }}>{productIcons[it.productKey]} {pt.label}</span>
                  <span style={{ fontSize: 12, fontWeight: 800, color: colors.dark }}>{it.qty} ks</span>
                </div>
              ) : null;
            })}
            {order.note ? <div style={{ fontSize: 10, fontStyle: "italic", color: colors.dark, marginTop: 6, opacity: 0.7, borderTop: `1px solid ${colors.border}`, paddingTop: 6 }}>"{order.note}"</div> : null}
          </div>
        ) : (
          <div style={{ marginBottom: 16 }}>
            <div style={sectionLabel}>Množstvo</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 12 }}>
              {productTypes.map(p => {
                const qty = parseInt(editItems[p.key]) > 0;
                return (
                  <div key={p.key} style={{
                    display: "flex", alignItems: "center", gap: 12, padding: "10px 14px",
                    borderRadius: radius.xl, border: `1.5px solid ${qty ? colors.dark : colors.border}`,
                    background: qty ? colors.dark + "06" : colors.white,
                  }}>
                    <span style={{ flexShrink: 0, display: "flex" }}>{productIcons[p.key]}</span>
                    <div style={{ flex: 1, fontSize: 12, fontWeight: 700, color: colors.text }}>{p.label}</div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <button onClick={() => setEditItems(v => ({ ...v, [p.key]: String(Math.max(0, (parseInt(v[p.key]) || 0) - 1)) }))} style={{ width: 28, height: 28, borderRadius: radius.sm, border: `1.5px solid ${colors.border}`, background: colors.white, cursor: "pointer", fontSize: 16, fontWeight: 700, color: colors.dark, display: "flex", alignItems: "center", justifyContent: "center" }}>−</button>
                      <input type="number" min="0" value={editItems[p.key]} onChange={e => setEditItems(v => ({ ...v, [p.key]: e.target.value }))} style={{ width: 50, textAlign: "center", padding: "5px 4px", borderRadius: radius.sm, border: `1.5px solid ${colors.border}`, fontFamily: typography.fontFamily, fontSize: 14, fontWeight: 800, color: colors.text, background: colors.bg, outline: "none" }} />
                      <button onClick={() => setEditItems(v => ({ ...v, [p.key]: String((parseInt(v[p.key]) || 0) + 1) }))} style={{ width: 28, height: 28, borderRadius: radius.sm, border: `1.5px solid ${colors.border}`, background: colors.dark, cursor: "pointer", fontSize: 16, fontWeight: 700, color: colors.white, display: "flex", alignItems: "center", justifyContent: "center" }}>+</button>
                    </div>
                  </div>
                );
              })}
            </div>
            {editTotalQty > 0 && (
              <div style={{ background: colors.dark + "0A", borderRadius: radius.lg, padding: "8px 14px", marginBottom: 12, display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: 11, fontWeight: 600, color: colors.dark }}>Celkom</span>
                <span style={{ fontSize: 14, fontWeight: 900, color: colors.dark }}>{editTotalQty} ks</span>
              </div>
            )}
            <div style={sectionLabel}>Poznámka</div>
            <textarea value={editNote} onChange={e => setEditNote(e.target.value)} rows={2} placeholder="Špeciálne požiadavky…"
              style={{ width: "100%", padding: "12px 14px", borderRadius: radius.lg, border: `1.5px solid ${colors.border}`, fontFamily: typography.fontFamily, fontSize: 13, fontWeight: 500, color: colors.text, background: colors.bg, outline: "none", resize: "none", boxSizing: "border-box", marginBottom: 12 }} />
            <button onClick={saveEdit} disabled={editTotalQty === 0} style={{
              width: "100%", padding: 13, borderRadius: radius.xl, border: "none",
              background: editTotalQty > 0 ? colors.dark : colors.border,
              fontFamily: typography.fontFamily, fontWeight: 800, fontSize: 13, color: colors.white,
              cursor: editTotalQty > 0 ? "pointer" : "default",
            }}>Uložiť zmeny</button>
          </div>
        )}

        <div style={sectionLabel}>Stav objednávky</div>
        <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
          {(["pending", "confirmed", "delivered"] as const).map(s => {
            const m = statusColors[s];
            const active = order.status === s;
            return (
              <button key={s} onClick={() => onChangeStatus(order.id, s)} style={{
                flex: 1, padding: "10px 6px", borderRadius: radius.lg, cursor: "pointer",
                border: `2px solid ${active ? m.dot : colors.border}`,
                background: active ? m.bg : colors.white,
                fontFamily: typography.fontFamily,
                display: "flex", flexDirection: "column", alignItems: "center", gap: 5,
                transition: "all 0.15s ease",
              }}>
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: m.dot }} />
                <span style={{ fontSize: 9, fontWeight: 800, color: active ? m.color : colors.dark, textAlign: "center", lineHeight: 1.3 }}>{m.label.toUpperCase()}</span>
              </button>
            );
          })}
        </div>

        {order.status === "delivered" && <div style={sectionLabel}>Zaplatená suma</div>}
        {order.status === "delivered" && (
          <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
            <div style={{ position: "relative", flex: 1 }}>
              <input
                type="number" min="0" step="0.01" placeholder="0.00"
                value={paidInput}
                onChange={e => setPaidInput(e.target.value)}
                style={{
                  width: "100%", padding: "13px 48px 13px 16px", borderRadius: radius.lg,
                  border: `1.5px solid ${paidInput ? colors.dark : colors.border}`,
                  fontFamily: typography.fontFamily, fontSize: 16, fontWeight: 800,
                  color: colors.text, background: colors.bg, outline: "none", boxSizing: "border-box",
                }}
              />
              <span style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", fontSize: 14, fontWeight: 700, color: colors.dark, pointerEvents: "none" }}>€</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6, flexShrink: 0 }}>
              {order.paid !== undefined && (
                <div style={{ background: colors.dark + "0A", borderRadius: radius.md, padding: "6px 12px", textAlign: "center" }}>
                  <div style={{ fontSize: 9, fontWeight: 700, color: colors.dark, textTransform: "uppercase", letterSpacing: 0.5 }}>za kus</div>
                  <div style={{ fontSize: 13, fontWeight: 900, color: colors.dark }}>{(order.paid / order.qty).toFixed(2)} €</div>
                </div>
              )}
              <button
                onClick={() => { const v = parseFloat(paidInput); onSetPaid(order.id, isNaN(v) ? undefined : v); onClose(); }}
                style={{ height: order.paid !== undefined ? "auto" : "100%", padding: "10px 14px", borderRadius: radius.md, border: "none", background: colors.dark, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
              >
                <CheckIcon />
              </button>
            </div>
          </div>
        )}

        {!confirmDelete ? (
          <button onClick={() => setConfirmDelete(true)} style={{
            width: "100%", padding: 13, borderRadius: radius.xl, border: "1.5px solid #FCA5A5",
            background: "#FFF5F5", fontFamily: typography.fontFamily,
            fontWeight: 700, fontSize: 13, color: "#B91C1C", cursor: "pointer", marginBottom: 36,
          }}>Zmazať objednávku</button>
        ) : (
          <div style={{ display: "flex", gap: 10, marginBottom: 36 }}>
            <button onClick={() => setConfirmDelete(false)} style={ghostButton}>Zrušiť</button>
            <button onClick={() => { onDelete(order.id); onClose(); }} style={{ flex: 2, padding: 13, borderRadius: radius.xl, border: "none", background: "#B91C1C", fontFamily: typography.fontFamily, fontWeight: 800, fontSize: 13, color: colors.white, cursor: "pointer" }}>Áno, zmazať</button>
          </div>
        )}
      </div>
    </BottomSheet>
  );
}

export default function PageObjednavky({ customers, orders, onBack, onAdd, onChangeStatus, onSetPaid, onUpdate, onDelete }: {
  customers: Customer[];
  orders: Order[];
  onBack: () => void;
  onAdd: (o: Order) => void;
  onChangeStatus: (id: string, status: Order["status"]) => void;
  onSetPaid: (id: string, paid: number | undefined) => void;
  onUpdate: (id: string, items: OrderItem[], note: string) => void;
  onDelete: (id: string) => void;
}) {
  const [tab, setTab] = useState<"all" | "pending" | "confirmed" | "delivered">("all");
  const [showNew, setShowNew] = useState(false);
  const [detailOrder, setDetailOrder] = useState<Order | null>(null);
  const filtered = tab === "all" ? orders : orders.filter(o => o.status === tab);

  function changeStatus(id: string, status: Order["status"]) {
    onChangeStatus(id, status);
    setDetailOrder(prev => prev?.id === id ? { ...prev, status } : prev);
  }

  function setPaid(id: string, paid: number | undefined) {
    onSetPaid(id, paid);
    setDetailOrder(prev => prev?.id === id ? { ...prev, paid } : prev);
  }

  function updateOrder(id: string, items: OrderItem[], note: string) {
    const qty = items.reduce((s, i) => s + i.qty, 0);
    const productType = items.map(i => productTypes.find(p => p.key === i.productKey)?.label ?? "").join(" + ");
    onUpdate(id, items, note);
    setDetailOrder(prev => prev?.id === id ? { ...prev, items, qty, productType, note } : prev);
  }

  function deleteOrder(id: string) {
    onDelete(id);
  }

  return (
    <PageShell title="Objednávky" icon={<ClipboardIcon size={24} />} onBack={onBack}>
      <div style={{ padding: "0 16px 110px" }}>
        <div style={{ display: "flex", gap: 6, marginBottom: 16, overflowX: "auto" }} className="scrollbar-hide">
          {(["all", "pending", "confirmed", "delivered"] as const).map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              flexShrink: 0, padding: "7px 14px", borderRadius: 20, border: "none", cursor: "pointer",
              fontFamily: typography.fontFamily, fontSize: 11, fontWeight: 700,
              background: tab === t ? colors.dark : colors.white,
              color: tab === t ? colors.white : colors.dark,
              boxShadow: tab === t ? "0 3px 10px rgba(19,94,75,0.25)" : "none",
              transition: "all 0.15s ease",
            }}>
              {t === "all" ? "Všetky" : statusColors[t].label}
            </button>
          ))}
        </div>

        <Card style={{ marginBottom: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            {[
              { label: "Celkom ks", val: `${orders.reduce((s, o) => s + o.qty, 0)} ks` },
              { label: "Čakajúce", val: String(orders.filter(o => o.status === "pending").length) },
              { label: "Est. tržba", val: `${(orders.reduce((s, o) => s + o.qty, 0) * 2.85).toFixed(0)} €` },
            ].map((s, i) => (
              <div key={s.label} style={{ textAlign: i === 1 ? "center" : i === 2 ? "right" : "left" }}>
                <div style={{ fontSize: 18, fontWeight: 900, color: colors.dark }}>{s.val}</div>
                <div style={{ fontSize: 9, fontWeight: 600, color: colors.dark, textTransform: "uppercase", letterSpacing: 0.5, marginTop: 2 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </Card>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {filtered.map(o => {
            const m = statusColors[o.status];
            return (
              <button key={o.id} onClick={() => setDetailOrder(o)} style={{ all: "unset", display: "block", cursor: "pointer", width: "100%", boxSizing: "border-box" }}>
                <Card>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 10, fontWeight: 700, color: colors.dark, letterSpacing: 0.8 }}>{o.id} · Turnus {o.turnus}</div>
                      <div style={{ fontSize: 14, fontWeight: 800, color: colors.text, marginTop: 3 }}>{o.customer}</div>
                      <div style={{ fontSize: 11, fontWeight: 500, color: colors.dark, marginTop: 2, display: "flex", alignItems: "center", gap: 4 }}>
                        <CalendarIcon size={12} color={colors.dark} />
                        {o.date}
                      </div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "4px 10px", marginTop: 6 }}>
                        {(o.items ?? []).map(it => {
                          const pt = productTypes.find(p => p.key === it.productKey);
                          return pt ? (
                            <span key={it.productKey} style={{ fontSize: 10, fontWeight: 600, color: colors.dark, display: "flex", alignItems: "center", gap: 3 }}>
                              {productIcons[it.productKey]} {it.qty} ks {pt.label}
                            </span>
                          ) : null;
                        })}
                      </div>
                      {o.note ? <div style={{ fontSize: 10, fontWeight: 500, color: colors.dark, marginTop: 5, fontStyle: "italic", opacity: 0.7 }}>"{o.note}"</div> : null}
                    </div>
                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                      <div style={{ fontSize: 20, fontWeight: 900, color: colors.dark, letterSpacing: -0.5 }}>{o.qty} <span style={{ fontSize: 12 }}>ks</span></div>
                      {o.paid !== undefined && (
                        <div style={{ fontSize: 13, fontWeight: 800, color: colors.dark, marginTop: 2 }}>{o.paid.toFixed(2)} €</div>
                      )}
                      <div style={{ marginTop: 4, display: "flex", alignItems: "center", gap: 5, justifyContent: "flex-end" }}>
                        <div style={{ width: 7, height: 7, borderRadius: "50%", background: m.dot, flexShrink: 0 }} />
                        <span style={{ fontSize: 9, fontWeight: 800, color: m.color, textTransform: "uppercase", letterSpacing: 0.5 }}>{m.label}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              </button>
            );
          })}
        </div>
      </div>

      <button onClick={() => setShowNew(true)} style={fabButton}>+</button>

      {showNew && <NewOrderModal customers={customers} onClose={() => setShowNew(false)} onSubmit={o => onAdd(o)} />}
      {detailOrder && <OrderDetailModal order={detailOrder} onClose={() => setDetailOrder(null)} onChangeStatus={changeStatus} onDelete={deleteOrder} onSetPaid={setPaid} onUpdate={updateOrder} />}
    </PageShell>
  );
}