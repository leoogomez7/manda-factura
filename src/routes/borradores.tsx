import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Archive, FileText, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatMoney, getDrafts, removeDraft, saveDraft, type Invoice } from "@/lib/invoices";

export const Route = createFileRoute("/borradores")({
  component: BorradoresPage,
  head: () => ({
    meta: [
      { title: "Facturas borradores" },
      { name: "description", content: "Borradores guardados en tu workspace." },
    ],
  }),
});

function BorradoresPage() {
  const navigate = useNavigate();
  const [drafts, setDrafts] = useState<Invoice[]>([]);
  const [q, setQ] = useState("");

  useEffect(() => {
    setDrafts(getDrafts());
  }, []);

  const handleEdit = (draft: Invoice) => {
    saveDraft({
      draftId: draft.id,
      draftNumber: draft.number,
      draftCreatedAt: draft.createdAt,
      issueDate: draft.issueDate || new Date().toISOString().slice(0, 10),
      deliveryDate: draft.deliveryDate,
      currency: draft.currency,
      paymentMethod: draft.paymentMethod,
      client: draft.client,
      items: draft.items,
      deposit: draft.deposit,
      notes: draft.notes,
    });
    navigate({ to: "/nueva" });
  };

  const filtered = drafts.filter((draft) => {
    if (!q.trim()) return true;
    const term = q.toLowerCase();
    return (
      draft.number.toLowerCase().includes(term) ||
      draft.client.name.toLowerCase().includes(term) ||
      draft.type.toLowerCase().includes(term)
    );
  });

  const handleDelete = (id: string) => {
    removeDraft(id);
    setDrafts(getDrafts());
  };

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
            Workspace
          </p>
          <h1 className="mt-1 text-3xl font-bold">
            <span className="text-gradient">Facturas borradores</span>
          </h1>
        </div>
        <div className="relative w-full sm:w-72">
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar borradores..."
            className="pl-3"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="glass border-gradient rounded-2xl p-12 text-center">
          <Archive className="mx-auto h-10 w-10 text-muted-foreground" />
          <p className="mt-4 text-lg font-semibold">No hay borradores</p>
          <p className="text-sm text-muted-foreground">
            Guarda una factura como borrador para verla aquí.
          </p>
          <Button asChild className="mt-5 .bg-gradient-to-r from-[#00E5FF] to-[#FF00D4] text-black">
            <Link to="/nueva">Crear nueva factura</Link>
          </Button>
        </div>
      ) : (
        <div className="glass border-gradient overflow-hidden rounded-2xl">
          <div className="flex flex-col gap-4 p-4 md:flex-row md:items-center md:justify-between">
            <p className="text-sm text-muted-foreground">
              {filtered.length} borrador{filtered.length === 1 ? "" : "es"} guardado{filtered.length === 1 ? "" : "s"}.
            </p>
            <Button asChild size="sm" className=".bg-gradient-to-r from-[#00E5FF] to-[#FF00D4] text-black">
              <Link to="/nueva">Crear nuevo</Link>
            </Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-background/40">
                <tr className="text-xs uppercase tracking-wider text-muted-foreground">
                  <th className="px-4 py-3 text-left">Número</th>
                  <th className="px-4 py-3 text-left">Cliente</th>
                  <th className="px-4 py-3 text-left">Fecha</th>
                  <th className="px-4 py-3 text-left">Tipo</th>
                  <th className="px-4 py-3 text-right">Total</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((draft) => (
                  <tr key={draft.id} className="border-t border-border/40 hover:bg-card/40">
                    <td className="px-4 py-3 font-mono text-color:var(--neon-cyan)">{draft.number}</td>
                    <td className="px-4 py-3">{draft.client.name || "—"}</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {new Date(draft.createdAt).toLocaleDateString("es-AR")}
                    </td>
                    <td className="px-4 py-3 capitalize">{draft.type}</td>
                    <td className="px-4 py-3 text-right font-semibold tabular-nums">
                      {formatMoney(draft.total, draft.currency)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => handleEdit(draft)}
                        >
                          Modificar
                        </Button>
                        <button
                          onClick={() => handleDelete(draft.id)}
                          className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                          title="Eliminar borrador"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
