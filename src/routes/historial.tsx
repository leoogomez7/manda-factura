import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, FileText, Printer, Search, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

import {
  formatMoney,
  getInvoices,
  PAYMENT_LABEL,
  removeInvoice,
  type Invoice,
} from "@/lib/invoices";

export const Route = createFileRoute("/historial")({
  component: HistorialPage,
  head: () => ({
    meta: [
      { title: "Facturas emitidas" },
      { name: "description", content: "Historial de facturas y recibos generados." },
    ],
  }),
});

function HistorialPage() {
  const [list, setList] = useState<Invoice[]>([]);
  const [q, setQ] = useState("");

  useEffect(() => {
    setList(getInvoices());
  }, []);

  const filtered = useMemo(() => {
    if (!q.trim()) return list;
    const term = q.toLowerCase();
    return list.filter(
      (i) =>
        i.number.toLowerCase().includes(term) ||
        i.client.name.toLowerCase().includes(term) ||
        PAYMENT_LABEL[i.paymentMethod].toLowerCase().includes(term),
    );
  }, [list, q]);

  const handleDelete = (id: string) => {
    removeInvoice(id);
    setList(getInvoices());
    toast.success("Factura eliminada");
  };

  // 🔥 PDF lazy loader
  const handleDownloadPDF = async (invoice: Invoice) => {
    const pdf = await import("../lib/pdf");
    pdf.downloadInvoicePdf(invoice);
  };

  const handlePrintPDF = async (invoice: Invoice) => {
    const pdf = await import("../lib/pdf");
    pdf.printInvoicePdf(invoice);
  };

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
            Archivo
          </p>
          <h1 className="mt-1 text-3xl font-bold">
            <span className="text-gradient">Facturas emitidas</span>
          </h1>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar por número, cliente..."
            className="pl-9"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="glass border-gradient rounded-2xl p-12 text-center">
          <FileText className="mx-auto h-10 w-10 text-muted-foreground" />
          <p className="mt-4 text-lg font-semibold">Aún no hay facturas</p>
          <p className="text-sm text-muted-foreground">
            Generá tu primera factura para verla acá.
          </p>
          <Button
            asChild
            className="mt-5 .bg-gradient-to-r from-[#00E5FF] to-[#FF00D4] text-black"
          >
            <Link to="/nueva">Crear factura</Link>
          </Button>
        </div>
      ) : (
        <div className="glass border-gradient overflow-hidden rounded-2xl">
          {/* Desktop table */}
          <table className="hidden w-full text-sm md:table">
            <thead className="bg-background/40">
              <tr className="text-xs uppercase tracking-wider text-muted-foreground">
                <th className="px-4 py-3 text-left">Número</th>
                <th className="px-4 py-3 text-left">Cliente</th>
                <th className="px-4 py-3 text-left">Fecha</th>
                <th className="px-4 py-3 text-left">Pago</th>
                <th className="px-4 py-3 text-right">Total</th>
                <th className="px-4 py-3 text-left">Estado</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>

            <tbody>
              <AnimatePresence initial={false}>
                {filtered.map((i) => (
                  <motion.tr
                    key={i.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="border-t border-border/40 hover:bg-card/40"
                  >
                    <td className="px-4 py-3 font-mono text-color:var(--neon-cyan)">
                      {i.number}
                    </td>
                    <td className="px-4 py-3">{i.client.name || "—"}</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {new Date(i.createdAt).toLocaleDateString("es-AR")}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {PAYMENT_LABEL[i.paymentMethod]}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums font-semibold">
                      {formatMoney(i.total, i.currency)}
                    </td>
                    <td className="px-4 py-3">
                      <StatusPill status={i.status} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1">
                        <IconBtn
                          title="Descargar PDF"
                          onClick={() => handleDownloadPDF(i)}
                        >
                          <Download className="h-4 w-4" />
                        </IconBtn>

                        <IconBtn
                          title="Imprimir"
                          onClick={() => handlePrintPDF(i)}
                        >
                          <Printer className="h-4 w-4" />
                        </IconBtn>

                        <IconBtn
                          title="Eliminar"
                          onClick={() => handleDelete(i.id)}
                          danger
                        >
                          <Trash2 className="h-4 w-4" />
                        </IconBtn>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>

          {/* Mobile cards */}
          <div className="divide-y divide-border/40 md:hidden">
            {filtered.map((i) => (
              <div key={i.id} className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-mono text-sm text-color:var(--neon-cyan)">
                      {i.number}
                    </p>
                    <p className="mt-0.5 font-semibold">{i.client.name || "—"}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(i.createdAt).toLocaleDateString("es-AR")} ·{" "}
                      {PAYMENT_LABEL[i.paymentMethod]}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="font-bold tabular-nums">
                      {formatMoney(i.total, i.currency)}
                    </p>
                    <StatusPill status={i.status} />
                  </div>
                </div>

                <div className="mt-3 flex gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    type="button"
                    onClick={() => handleDownloadPDF(i)}
                  >
                    <Download className="mr-1 h-3.5 w-3.5" /> PDF
                  </Button>

                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handlePrintPDF(i)}
                  >
                    <Printer className="mr-1 h-3.5 w-3.5" /> Imprimir
                  </Button>

                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDelete(i.id)}
                    className="ml-auto text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function StatusPill({ status }: { status: Invoice["status"] }) {
  const isEm = status === "emitida";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-medium ${
        isEm
          ? "bg-color:var(--neon-cyan)/10 text-color:var(--neon-cyan) ring-1 ring-color:var(--neon-cyan)/30"
          : "bg-color:var(--neon-fuchsia)/10 text-color:var(--neon-fuchsia) ring-1 ring-color:var(--neon-fuchsia)/30"
      }`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {isEm ? "Saldado" : "Pendiente"}
    </span>
  );
}

function IconBtn({
  children,
  onClick,
  title,
  danger,
}: {
  children: React.ReactNode;
  onClick: () => void;
  title: string;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`rounded-md p-1.5 transition-colors ${
        danger
          ? "text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
          : "text-muted-foreground hover:bg-accent/10 hover:text-foreground"
      }`}
    >
      {children}
    </button>
  );
}